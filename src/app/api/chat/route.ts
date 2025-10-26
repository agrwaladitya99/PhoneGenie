import { NextRequest, NextResponse } from "next/server";
import { ChatRequestSchema } from "@/lib/utils/validation";
import { checkSafety, isQueryOffTopic } from "@/lib/ai/safety";
import { detectIntent, extractBudget } from "@/lib/ai/intent";
import { searchPhones } from "@/lib/data/search";
import { rankPhones } from "@/lib/data/ranking";
import { comparePhones } from "@/lib/data/comparison";
import { fuzzySearchModel, getMobileByModel } from "@/lib/data/mobile-service";
import {
  generateSearchResponse,
  generateComparisonResponse,
  generateExplanationResponse,
  generateGeneralResponse,
} from "@/lib/ai/response-generator";
import { REFUSAL_MESSAGE, IRRELEVANT_MESSAGE } from "@/lib/ai/prompts";
import { isGeminiConfigured } from "@/lib/ai/gemini";

export async function POST(request: NextRequest) {
  try {
    if (!isGeminiConfigured()) {
      return NextResponse.json(
        {
          message: "AI service is not configured. Please add your GEMINI_API_KEY to the .env.local file.",
          type: "error"
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const validation = ChatRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request format", details: validation.error.errors },
        { status: 400 }
      );
    }

    const { message } = validation.data;

    const safetyCheck = checkSafety(message);
    if (!safetyCheck.safe) {
      return NextResponse.json({
        message: safetyCheck.refusalMessage || REFUSAL_MESSAGE,
        type: "refusal",
      });
    }

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

        const searchParams: any = {};
        
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
            budget,
            priorityFeature,
          });
        }

        const responseText = await generateSearchResponse(
          message,
          results.slice(0, 5),
          budget
        );

        return NextResponse.json({
          message: responseText,
          phones: results.slice(0, 5),
          type: "search",
        });
      }

      case "compare": {
        const models = intent.parameters?.models || [];
        const phones = [];

        for (const modelQuery of models) {
          const found = getMobileByModel(modelQuery) || fuzzySearchModel(modelQuery, 0.5)[0];
          if (found) {
            phones.push(found);
          }
        }

        if (phones.length < 2) {
          return NextResponse.json({
            message: "I need at least 2 phone models to compare. Could you specify which phones you'd like to compare?",
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

      case "explain": {
        const responseText = await generateExplanationResponse(message);

        return NextResponse.json({
          message: responseText,
          type: "explain",
        });
      }

      case "details": {
        const query = intent.parameters?.query || message;
        const found = fuzzySearchModel(query, 0.5);

        if (found.length > 0) {
          const phone = found[0];
          const responseText = await generateGeneralResponse(
            `Tell me detailed information about the ${phone.model}`
          );

          return NextResponse.json({
            message: responseText,
            phones: [phone],
            type: "details",
          });
        } else {
          return NextResponse.json({
            message: "Could you specify which phone you'd like to know more about?",
            type: "general",
          });
        }
      }

      default: {
        const responseText = await generateGeneralResponse(message);

        return NextResponse.json({
          message: responseText,
          type: "general",
        });
      }
    }
  } catch (error) {
    console.error("Chat API error:", error);

    return NextResponse.json(
      {
        error: "Something went wrong processing your request. Please try again.",
        message: "I'm having trouble processing your request. Could you try rephrasing it?",
      },
      { status: 500 }
    );
  }
}

