/**
 * Comparison Validation and Error Handling Utilities
 * 
 * This module provides robust validation for phone comparison queries
 * to ensure we never return unhelpful error messages.
 */

import { Mobile } from "@/types/mobile";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  suggestions?: string[];
}

/**
 * Validates that we have enough phones for comparison
 */
export function validateComparisonPhones(
  phones: Mobile[],
  requestedModels: string[]
): ValidationResult {
  if (phones.length < 2) {
    const notFound = requestedModels.filter(
      model => !phones.some(p => 
        p.model.toLowerCase().includes(model.toLowerCase()) ||
        model.toLowerCase().includes(p.model.toLowerCase())
      )
    );

    let error = "I need at least 2 phone models to compare. ";
    
    if (phones.length === 1) {
      error += `I found ${phones[0].model}, but I couldn't find a match for ${notFound.join(', ')}. `;
    } else if (phones.length === 0 && notFound.length > 0) {
      error += `I couldn't find matches for: ${notFound.join(', ')}. `;
    }
    
    const suggestions = generateComparisonSuggestions(requestedModels, phones);
    error += `Try using full names like 'Google Pixel 8 vs OnePlus 11R'.`;

    return {
      isValid: false,
      error,
      suggestions
    };
  }

  return { isValid: true };
}

/**
 * Generates helpful suggestions for comparison queries
 */
function generateComparisonSuggestions(
  requestedModels: string[],
  foundPhones: Mobile[]
): string[] {
  const suggestions: string[] = [];

  // If we found some phones, suggest similar comparisons
  if (foundPhones.length === 1) {
    suggestions.push(
      `Try: Compare ${foundPhones[0].model} vs Samsung Galaxy S21`,
      `Try: Compare ${foundPhones[0].model} vs OnePlus 11`,
      `Try: Compare ${foundPhones[0].model} vs Google Pixel 7`
    );
  }

  return suggestions;
}

/**
 * Validates extracted phone model names
 */
export function validateExtractedModels(models: string[]): ValidationResult {
  if (models.length === 0) {
    return {
      isValid: false,
      error: "I couldn't identify any phone models in your query. Please specify phone names to compare."
    };
  }

  if (models.length === 1) {
    return {
      isValid: false,
      error: `I only found one phone model (${models[0]}). Please specify at least two phones to compare.`
    };
  }

  // Check if models are too vague (single character, etc.)
  const vagueModels = models.filter(m => m.length <= 1);
  if (vagueModels.length > 0) {
    return {
      isValid: false,
      error: "Some phone names seem too vague. Please use fuller names like 'Pixel 8' or 'OnePlus 11'."
    };
  }

  return { isValid: true };
}

/**
 * Logs comparison debug information (disabled in production)
 */
export function logComparisonDebug(
  query: string,
  extractedModels: string[],
  foundPhones: Mobile[]
): void {
  // Debug logging disabled - use only during development debugging
  if (process.env.NODE_ENV === 'development' && process.env.DEBUG_COMPARISON) {
    console.log('=== COMPARISON DEBUG ===');
    console.log('Original Query:', query);
    console.log('Extracted Models:', extractedModels);
    console.log('Found Phones:', foundPhones.map(p => ({
      model: p.model,
      brand: p.brand_name
    })));
    console.log('========================');
  }
}

