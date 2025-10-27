import { NextRequest, NextResponse } from "next/server";
import { ChatRequestSchema } from "@/lib/utils/validation";
import { checkSafety, isQueryOffTopic, checkToxicity, checkRateLimit, getRateLimitInfo, isGeneralQueryOffTopic } from "@/lib/ai/safety";
import { detectIntent, extractBudget } from "@/lib/ai/intent";
import { searchPhones } from "@/lib/data/search";
import { SearchParams } from "@/types/mobile";
import { rankPhones } from "@/lib/data/ranking";
import { comparePhones } from "@/lib/data/comparison";
import { fuzzySearchModel, getMobileByModel } from "@/lib/data/mobile-service";
import {
  generateSearchResponse,
  generateComparisonResponse,
  generateExplanationResponse,
  generateGeneralResponse,
  generatePhoneDetailsResponse,
} from "@/lib/ai/response-generator";
import { REFUSAL_MESSAGE, IRRELEVANT_MESSAGE } from "@/lib/ai/prompts";
import { isGeminiConfigured } from "@/lib/ai/gemini";
import { validateComparisonPhones, logComparisonDebug } from "@/lib/utils/comparison-validator";

// Constants for result limits
const MAX_INITIAL_RESULTS = 3;
const MAX_ADDITIONAL_RESULTS = 10;

/**
 * Helper function to get client identifier for rate limiting
 * Uses IP address or falls back to a default for development
 */
function getClientIdentifier(request: NextRequest): string {
  // Try to get real IP from various headers (Vercel, Cloudflare, etc.)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIp) {
    return realIp;
  }
  if (cfConnectingIp) {
    return cfConnectingIp;
  }
  
  // Development fallback
  return 'dev-client';
}

export async function POST(request: NextRequest) {
  try {
    // Check if Gemini is configured
    if (!isGeminiConfigured()) {
      return NextResponse.json(
        {
          message: "AI service is not configured. Please add your GEMINI_API_KEY to the .env.local file.",
          type: "error"
        },
        { status: 500 }
      );
    }

    // Rate limiting check
    const clientId = getClientIdentifier(request);
    const rateLimitCheck = checkRateLimit(clientId);
    
    if (!rateLimitCheck.safe) {
      const rateLimitInfo = getRateLimitInfo(clientId);
      const resetIn = Math.ceil((rateLimitInfo.resetAt - Date.now()) / 1000);
      
      return NextResponse.json(
        {
          message: rateLimitCheck.refusalMessage,
          type: "error",
          rateLimitExceeded: true,
          retryAfter: resetIn
        },
        { 
          status: 429,
          headers: {
            'Retry-After': resetIn.toString(),
            'X-RateLimit-Limit': '20',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitInfo.resetAt.toString()
          }
        }
      );
    }

    const body = await request.json();
    
    // Handle direct comparison from comparison bar
    if (body.comparePhones && Array.isArray(body.comparePhones)) {
      const phones = body.comparePhones;
      
      if (phones.length < 2) {
        return NextResponse.json({
          message: "I need at least 2 phone models to compare.",
          type: "general",
        });
      }

      const comparisonData = comparePhones(phones);
      const responseText = await generateComparisonResponse(phones);

      return NextResponse.json({
        message: responseText,
        phones: phones,
        type: "compare",
        comparison: comparisonData,
      });
    }
    
    const validation = ChatRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request format", details: validation.error.issues },
        { status: 400 }
      );
    }

    let { message } = validation.data;
    
    // Input sanitization - Trim and normalize spaces
    message = message.trim().replace(/\s+/g, ' ');
    
    // Additional validation after sanitization
    if (!message || message.length === 0) {
      return NextResponse.json(
        { 
          message: "Please enter a query to get started.",
          type: "error"
        },
        { status: 400 }
      );
    }
    
    // Validate message length (already checked in schema, but double-check after sanitization)
    if (message.length > 1000) {
      return NextResponse.json(
        { 
          message: "Your message is too long. Please keep your query under 1000 characters.",
          type: "error"
        },
        { status: 400 }
      );
    }

    // Check for adversarial patterns and safety violations
    const safetyCheck = checkSafety(message);
    if (!safetyCheck.safe) {
      return NextResponse.json({
        message: safetyCheck.refusalMessage || REFUSAL_MESSAGE,
        type: "refusal",
      });
    }

    // Check for toxic content and brand bashing
    const toxicityCheck = checkToxicity(message);
    if (!toxicityCheck.safe) {
      return NextResponse.json({
        message: toxicityCheck.refusalMessage || REFUSAL_MESSAGE,
        type: "refusal",
      });
    }

    // Check if query is off-topic
    if (isQueryOffTopic(message)) {
      return NextResponse.json({
        message: IRRELEVANT_MESSAGE,
        type: "refusal",
      });
    }

    const intent = await detectIntent(message);

    if (intent.type === "adversarial") {
      return NextResponse.json({
        message: REFUSAL_MESSAGE,
        type: "refusal",
      });
    }

    if (intent.type === "irrelevant") {
      return NextResponse.json({
        message: IRRELEVANT_MESSAGE,
        type: "refusal",
      });
    }

    switch (intent.type) {
      case "search": {
        const budget = intent.parameters?.budget || extractBudget(message);
        const brands = intent.parameters?.brands;
        const features = intent.parameters?.features || [];

        const searchParams: SearchParams = {};
        
        if (budget) {
          searchParams.budget = budget;
        }
        
        if (brands && brands.length > 0) {
          searchParams.brand = brands;
        }

        if (features.includes("camera")) {
          searchParams.minCamera = 40;
        }
        if (features.includes("battery")) {
          searchParams.minBattery = 5000;
        }
        if (features.includes("5g")) {
          searchParams.has5G = true;
        }
        if (features.includes("gaming") || features.includes("performance")) {
          searchParams.minRAM = 8;
        }

        let results = searchPhones(searchParams);

        if (results.length > 0) {
          const priorityFeature = features.includes("camera") ? "camera"
            : features.includes("battery") ? "battery"
            : features.includes("gaming") || features.includes("performance") ? "performance"
            : undefined;

          results = rankPhones(results, {
            budget: budget || undefined,
            priorityFeature,
          });
        }

        // Show top results initially, but keep more total for "Show More"
        const topResults = results.slice(0, MAX_INITIAL_RESULTS);
        const additionalResults = results.slice(MAX_INITIAL_RESULTS, MAX_ADDITIONAL_RESULTS);

        const responseText = await generateSearchResponse(
          message,
          topResults,
          budget || undefined
        );

        return NextResponse.json({
          message: responseText,
          phones: topResults,
          additionalPhones: additionalResults.length > 0 ? additionalResults : undefined,
          type: "search",
        });
      }

      case "compare": {
        const models = intent.parameters?.models || [];
        const phones = [];
        const notFound: string[] = [];

        // Log debug information
        logComparisonDebug(message, models, []);

        for (const modelQuery of models) {
          // Try exact match first
          let found = getMobileByModel(modelQuery);
          
          // If not found, try fuzzy search with lower threshold for better matching
          if (!found) {
            const fuzzyResults = fuzzySearchModel(modelQuery, 0.2);
            found = fuzzyResults[0];
          }
          
          if (found) {
            phones.push(found);
          } else {
            notFound.push(modelQuery);
          }
        }

        // Final debug log with results
        logComparisonDebug(message, models, phones);

        // Validate the comparison
        const validation = validateComparisonPhones(phones, models);
        if (!validation.isValid) {
          return NextResponse.json({
            message: validation.error,
            type: "general",
            suggestions: validation.suggestions,
          });
        }

        const comparisonData = comparePhones(phones);
        const responseText = await generateComparisonResponse(phones);

        return NextResponse.json({
          message: responseText,
          phones: phones,
          type: "compare",
          comparison: comparisonData,
        });
      }

      case "explain": {
        const responseText = await generateExplanationResponse(message);

        return NextResponse.json({
          message: responseText,
          type: "explain",
        });
      }

      case "details": {
        const query = intent.parameters?.query || message;
        const found = fuzzySearchModel(query, 0.2); // Lower threshold for better matching

        if (found.length > 0) {
          const phone = found[0];
          const responseText = await generatePhoneDetailsResponse(phone, message);

          return NextResponse.json({
            message: responseText,
            phones: [phone],
            type: "details",
          });
        } else {
          return NextResponse.json({
            message: "I couldn't find that phone model. Could you specify which phone you'd like to know more about? Try including the brand name (e.g., 'Samsung M35' or 'OnePlus 11').",
            type: "general",
          });
        }
      }

      case "general": {
        // Additional check: ensure "general" queries aren't actually off-topic
        if (isGeneralQueryOffTopic(message)) {
          return NextResponse.json({
            message: IRRELEVANT_MESSAGE,
            type: "refusal",
          });
        }
        
        const responseText = await generateGeneralResponse(message);

        return NextResponse.json({
          message: responseText,
          type: "general",
        });
      }

      default: {
        // Fallback for any unhandled intent types
        // Additional check: ensure queries aren't actually off-topic
        if (isGeneralQueryOffTopic(message)) {
          return NextResponse.json({
            message: IRRELEVANT_MESSAGE,
            type: "refusal",
          });
        }
        
        const responseText = await generateGeneralResponse(message);

        return NextResponse.json({
          message: responseText,
          type: "general",
        });
      }
    }
  } catch (error) {
    // Log error for debugging (in production, send to logging service)
    console.error("[Chat API Error]", error);
    
    // Determine error type and provide appropriate message
    let errorMessage = "I'm having trouble processing your request. Could you try rephrasing it?";
    let statusCode = 500;
    
    if (error instanceof SyntaxError) {
      errorMessage = "Invalid request format. Please check your input and try again.";
      statusCode = 400;
    } else if (error instanceof Error) {
      // Check for specific error types
      if (error.message.includes("timeout") || error.message.includes("ETIMEDOUT")) {
        errorMessage = "The request took too long to process. Please try again with a simpler query.";
        statusCode = 504;
      } else if (error.message.includes("network") || error.message.includes("ENOTFOUND")) {
        errorMessage = "Network error. Please check your connection and try again.";
        statusCode = 503;
      }
    }
    
    return NextResponse.json(
      {
        error: "Something went wrong processing your request. Please try again.",
        message: errorMessage,
        type: "error",
      },
      { status: statusCode }
    );
  }
}

/**
 * Helper function to add rate limit headers to response
 */
function addRateLimitHeaders(response: NextResponse, clientId: string): NextResponse {
  const rateLimitInfo = getRateLimitInfo(clientId);
  response.headers.set('X-RateLimit-Limit', '20');
  response.headers.set('X-RateLimit-Remaining', rateLimitInfo.remaining.toString());
  response.headers.set('X-RateLimit-Reset', rateLimitInfo.resetAt.toString());
  return response;
}

