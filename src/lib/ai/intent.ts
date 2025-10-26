import { IntentResult } from "@/types/chat";
import { generateJSONResponse } from "./gemini";
import { INTENT_DETECTION_PROMPT } from "./prompts";

export async function detectIntent(query: string): Promise<IntentResult> {
  try {
    const prompt = `${INTENT_DETECTION_PROMPT}\n\nUser Query: "${query}"`;
    const result = await generateJSONResponse<IntentResult>(prompt);
    return result;
  } catch (error) {
    console.error("Intent detection error:", error);
    return simpleIntentDetection(query);
  }
}

function simpleIntentDetection(query: string): IntentResult {
  const lowerQuery = query.toLowerCase();

  if (
    lowerQuery.includes("compare") ||
    lowerQuery.includes("vs") ||
    lowerQuery.includes("versus")
  ) {
    return {
      type: "compare",
      confidence: 80,
      parameters: { query }
    };
  }

  if (
    lowerQuery.startsWith("what is") ||
    lowerQuery.startsWith("explain")
  ) {
    return {
      type: "explain",
      confidence: 80,
      parameters: { query }
    };
  }

  let budget: number | undefined;
  const budgetMatch = lowerQuery.match(/(?:under|below|less than|₹|rs\.?)\s*(\d+)k?/i);
  if (budgetMatch) {
    budget = parseInt(budgetMatch[1]) * (budgetMatch[0].includes('k') || parseInt(budgetMatch[1]) < 1000 ? 1000 : 1);
  }

  const brands: string[] = [];
  const commonBrands = ["samsung", "apple", "oneplus", "xiaomi", "realme", "oppo", "vivo", "google", "pixel"];
  commonBrands.forEach(brand => {
    if (lowerQuery.includes(brand)) {
      brands.push(brand);
    }
  });

  const features: string[] = [];
  const featureKeywords = ["camera", "battery", "5g", "gaming", "display"];
  featureKeywords.forEach(feature => {
    if (lowerQuery.includes(feature)) {
      features.push(feature);
    }
  });

  return {
    type: "search",
    confidence: 70,
    parameters: {
      budget,
      brands: brands.length > 0 ? brands : undefined,
      features: features.length > 0 ? features : undefined,
      query
    }
  };
}

export function extractBudget(query: string): number | null {
  const patterns = [
    /(?:under|below|less than|within|around|about)?\s*₹?\s*(\d+)k/i,
    /(?:under|below|less than|within|around|about)?\s*₹?\s*(\d{5,6})/i,
  ];

  for (const pattern of patterns) {
    const match = query.match(pattern);
    if (match) {
      let amount = parseInt(match[1]);
      if (amount < 1000 && query.toLowerCase().includes('k')) {
        amount *= 1000;
      }
      if (amount >= 5000 && amount <= 200000) {
        return amount;
      }
    }
  }

  return null;
}

