import { IntentResult } from "@/types/chat";
import { generateJSONResponse } from "./gemini";
import { INTENT_DETECTION_PROMPT } from "./prompts";

/**
 * Detects the user's intent from their query using AI-based classification
 * @param query - The user's input query
 * @returns Promise<IntentResult> - Classified intent with confidence score and parameters
 */
export async function detectIntent(query: string): Promise<IntentResult> {
  try {
    const prompt = `${INTENT_DETECTION_PROMPT}\n\nUser Query: "${query}"`;
    const result = await generateJSONResponse<IntentResult>(prompt);
    return result;
  } catch (error) {
    // Fallback to rule-based detection if AI fails
    return simpleIntentDetection(query);
  }
}

/**
 * Rule-based intent detection fallback when AI is unavailable
 * @param query - The user's input query
 * @returns IntentResult - Classified intent based on pattern matching
 */
function simpleIntentDetection(query: string): IntentResult {
  const lowerQuery = query.toLowerCase();

  // Check for clearly off-topic queries (expanded detection)
  const offTopicKeywords = [
    'weather', 'joke', 'poem', 'story', 'recipe', 'cooking', 'food', 'movie', 'book',
    'sports', 'politics', 'election', 'news', 'stock', 'crypto', 'bitcoin',
    'capital of', 'president', 'history', 'math problem', 'translate',
    'play a game', 'sing', 'dance', 'draw', 'paint'
  ];
  
  // Check if query is clearly off-topic (no phone-related words)
  const phoneRelatedWords = [
    'phone', 'mobile', 'smartphone', 'device', 'camera', 'battery', 'display',
    'ram', 'storage', 'processor', 'screen', 'gb', '5g', '4g', 'android', 'ios',
    'pixel', 'iphone', 'samsung', 'oneplus', 'xiaomi', 'oppo', 'vivo', 'realme'
  ];
  
  const hasOffTopicKeyword = offTopicKeywords.some(keyword => lowerQuery.includes(keyword));
  const hasPhoneKeyword = phoneRelatedWords.some(keyword => lowerQuery.includes(keyword));
  
  if (hasOffTopicKeyword && !hasPhoneKeyword) {
    return {
      type: "irrelevant",
      confidence: 85,
      parameters: { query }
    };
  }

  // Check for help/capability queries about the bot itself
  if (
    lowerQuery.match(/what (can|do) you (do|help)/i) ||
    lowerQuery.match(/how (can|do) you help/i) ||
    lowerQuery.match(/what are (you|your) (capabilities|features)/i) ||
    lowerQuery.match(/tell me (about|what) (you|yourself)/i) ||
    lowerQuery === "help" ||
    lowerQuery === "hello" ||
    lowerQuery === "hi" ||
    lowerQuery.includes("what can you do all")
  ) {
    return {
      type: "general",
      confidence: 90,
      parameters: { query }
    };
  }

  // Check for comparison intent first
  if (
    lowerQuery.includes("compare") ||
    lowerQuery.includes("vs") ||
    lowerQuery.includes("versus")
  ) {
    const models = extractPhoneModels(query);
    return {
      type: "compare",
      confidence: 80,
      parameters: { 
        models: models.length > 0 ? models : undefined,
        query 
      }
    };
  }

  // Check for phone details/specifications queries
  // These patterns suggest user is asking about a specific phone model
  if (
    lowerQuery.match(/(?:explain|tell me about|what about|info|information|details|specs?|specifications?|features?|technical features?).*(?:of|about|for)\s+(?:the\s+)?([a-z0-9\s]+)/i) ||
    lowerQuery.match(/^(?:show me|give me|provide)\s+(?:details?|specs?|specifications?|features?|info|information).*(?:of|about|for|on)\s+(?:the\s+)?([a-z0-9\s]+)/i) ||
    lowerQuery.match(/(?:tell me more|more info|more details).*(?:about|on)\s+(?:the\s+)?([a-z0-9\s]+)/i)
  ) {
    // Check if the query likely refers to a phone model
    // Common patterns: "m35", "oneplus 11", "pixel 8a", "iphone 13", "galaxy s21"
    const phoneModelPattern = /(?:of|about|for|on)\s+(?:the\s+)?([a-z0-9\s]+(?:pro|plus|max|ultra|lite|mini)?)/i;
    const match = lowerQuery.match(phoneModelPattern);
    
    if (match && match[1]) {
      const potentialModel = match[1].trim();
      // If it looks like a phone model (contains letters and numbers, or known phone names)
      if (
        potentialModel.match(/[a-z]+\s*\d+|[a-z]+\s+[a-z]+\s*\d*|m\d+|[a-z]\d+/i) ||
        ['pixel', 'iphone', 'galaxy', 'oneplus', 'realme', 'oppo', 'vivo', 'redmi', 'poco', 'mi', 'note', 'edge', 'fold', 'flip'].some(name => potentialModel.includes(name))
      ) {
        return {
          type: "details",
          confidence: 85,
          parameters: { query: potentialModel }
        };
      }
    }
  }

  // Check for explanation intent - be more flexible with patterns
  // But ONLY for technical concepts (not phone models)
  if (
    lowerQuery.startsWith("what is") ||
    lowerQuery.startsWith("what's") ||
    lowerQuery.startsWith("explain") ||
    lowerQuery.startsWith("tell me about") ||
    lowerQuery.startsWith("what does") ||
    lowerQuery.startsWith("define") ||
    lowerQuery.includes("what is ois") ||
    lowerQuery.includes("what is eis") ||
    lowerQuery.includes("what is refresh rate") ||
    lowerQuery.includes("explain ois") ||
    lowerQuery.includes("explain eis") ||
    lowerQuery.match(/^what (is|are|does|means?) /i) ||
    lowerQuery.match(/^how (does|do) .* work/i) ||
    lowerQuery.match(/difference between .* (and|vs)/i)
  ) {
    // Extract the subject being asked about
    let subject = "";
    
    // Try to extract from "what is X", "explain X", "tell me about X", etc.
    if (lowerQuery.match(/^what (?:is|are|does|means?)\s+(.+)/i)) {
      const match = lowerQuery.match(/^what (?:is|are|does|means?)\s+(.+)/i);
      if (match) subject = match[1].trim();
    } else if (lowerQuery.match(/^explain\s+(.+)/i)) {
      const match = lowerQuery.match(/^explain\s+(.+)/i);
      if (match) subject = match[1].trim();
    } else if (lowerQuery.match(/^tell me about\s+(.+)/i)) {
      const match = lowerQuery.match(/^tell me about\s+(.+)/i);
      if (match) subject = match[1].trim();
    } else if (lowerQuery.match(/(?:of|about|for)\s+(?:the\s+)?([a-z0-9\s]+)/i)) {
      const match = lowerQuery.match(/(?:of|about|for)\s+(?:the\s+)?([a-z0-9\s]+)/i);
      if (match) subject = match[1].trim();
    }
    
    // If we found a subject, check if it's a phone model or technical term
    if (subject) {
      // Remove common trailing words
      subject = subject.replace(/\?$/, '').trim();
      
      // Check if it looks like a phone model
      // Patterns: "m35", "s21", "8a", "11 pro", "pixel 8", "iphone 13", "galaxy note 10"
      if (
        subject.match(/^[a-z]?\d+[a-z]?$/i) || // "m35", "s21", "8a"
        subject.match(/^[a-z]+\s*\d+/i) || // "pixel 8", "note 10"
        ['pixel', 'iphone', 'galaxy', 'oneplus', 'realme', 'oppo', 'vivo', 'redmi', 'poco', 'mi', 'note', 'edge', 'fold', 'flip'].some(name => subject.includes(name))
      ) {
        return {
          type: "details",
          confidence: 85,
          parameters: { query: subject }
        };
      }
    }
    
    // Otherwise, it's genuinely asking for explanation of a technical concept
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

/**
 * Extracts phone model names from comparison queries
 * @param query - The comparison query string
 * @returns Array of phone model names
 */
function extractPhoneModels(query: string): string[] {
  // First, split by separators BEFORE removing common words
  // This ensures we don't accidentally remove the separators
  const parts = query.split(/\s+(?:vs\.?|versus|and)\s+|,\s*/i);
  
  // Now clean each part individually
  const models = parts
    .map(part => {
      // Remove common words from each part
      return part
        .replace(/\b(compare|with|between|the)\b/gi, ' ')
        .trim();
    })
    .filter(p => {
      // Filter out empty strings, very short strings, and common words
      if (p.length <= 2) return false;
      const lower = p.toLowerCase();
      return !['compare', 'versus', 'vs', 'and', 'with', 'between', 'the'].includes(lower);
    });
  
  return models;
}

/**
 * Extracts budget information from user query
 * @param query - The user's input query
 * @returns Budget amount in rupees or null if not found
 */
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

