import { GoogleGenerativeAI } from "@google/generative-ai";
import { retryWithBackoff } from "../utils/retry";

/**
 * Gemini AI client configuration and response generation utilities
 * Includes caching, retry logic, and error handling
 */

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Response cache with TTL
const responseCache = new Map<string, { response: string; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour
const MAX_CACHE_SIZE = 100;
const CACHE_CLEANUP_INTERVAL = 5 * 60 * 1000; // Cleanup every 5 minutes

// Periodic cache cleanup to prevent memory leaks
if (typeof global !== 'undefined') {
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, value] of responseCache.entries()) {
      if (now - value.timestamp > CACHE_TTL) {
        responseCache.delete(key);
      }
    }
  }, CACHE_CLEANUP_INTERVAL);
  
  // Don't prevent Node.js from exiting
  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }
}

function getCacheKey(prompt: string, systemPrompt?: string): string {
  return `${systemPrompt || ''}|||${prompt}`;
}

function getCachedResponse(cacheKey: string): string | null {
  const cached = responseCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.response;
  }
  if (cached) {
    responseCache.delete(cacheKey);
  }
  return null;
}

function setCachedResponse(cacheKey: string, response: string): void {
  responseCache.set(cacheKey, { response, timestamp: Date.now() });
  
  // Clean old cache entries when size exceeds limit
  if (responseCache.size > MAX_CACHE_SIZE) {
    const now = Date.now();
    for (const [key, value] of responseCache.entries()) {
      if (now - value.timestamp > CACHE_TTL) {
        responseCache.delete(key);
      }
    }
  }
}

/**
 * Generates a text response from Gemini AI
 * @param prompt - The user's prompt
 * @param systemPrompt - Optional system prompt for context
 * @param useCache - Whether to use cached responses
 * @returns Promise<string> - Generated text response
 */
export async function generateResponse(
  prompt: string,
  systemPrompt?: string,
  useCache: boolean = true
): Promise<string> {
  const cacheKey = getCacheKey(prompt, systemPrompt);
  
  // Check cache
  if (useCache) {
    const cachedResponse = getCachedResponse(cacheKey);
    if (cachedResponse) {
      return cachedResponse;
    }
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 2048,
      },
    });

    const fullPrompt = systemPrompt 
      ? `${systemPrompt}\n\nUser Query: ${prompt}`
      : prompt;

    // Use retry logic for API calls
    const text = await retryWithBackoff(async () => {
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text();
    }, {
      maxRetries: 2,
      initialDelay: 1000,
      maxDelay: 5000,
    });

    // Cache the response
    if (useCache) {
      setCachedResponse(cacheKey, text);
    }

    return text;
  } catch (error) {
    // Provide more helpful error messages
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error("AI service is not configured properly. Please check your API key.");
      }
      if (error.message.includes('quota') || error.message.includes('rate limit')) {
        throw new Error("AI service is temporarily unavailable due to high demand. Please try again in a moment.");
      }
    }
    
    throw new Error("AI generation failed. Please try again.");
  }
}

/**
 * Generates a JSON response from Gemini AI
 * @param prompt - The user's prompt
 * @param systemPrompt - Optional system prompt for context
 * @param useCache - Whether to use cached responses
 * @returns Promise<T> - Parsed JSON response
 */
export async function generateJSONResponse<T>(
  prompt: string,
  systemPrompt?: string,
  useCache: boolean = true
): Promise<T> {
  const response = await generateResponse(prompt, systemPrompt, useCache);
  
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as T;
    }
    throw new Error("No JSON found in response");
  } catch (error) {
    throw new Error("Failed to parse AI response");
  }
}

/**
 * Checks if Gemini API is properly configured
 * @returns boolean - True if API key is set
 */
export function isGeminiConfigured(): boolean {
  return !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 0;
}

