import { Mobile } from "@/types/mobile";
import mobilesData from "../../../data/mobiles.json";

/**
 * Mobile service for loading and searching phone data
 */

let cachedMobiles: Mobile[] | null = null;

/**
 * Loads all mobile phones from the dataset with caching
 * @returns Array of all mobile phones
 */
export function loadMobiles(): Mobile[] {
  if (cachedMobiles) {
    return cachedMobiles;
  }
  cachedMobiles = mobilesData as Mobile[];
  return cachedMobiles;
}

/**
 * Finds a mobile phone by exact model name match
 * @param model - The model name to search for
 * @returns Mobile phone or null if not found
 */
export function getMobileByModel(model: string): Mobile | null {
  const mobiles = loadMobiles();
  return mobiles.find(m => 
    m.model.toLowerCase() === model.toLowerCase()
  ) || null;
}

/**
 * Gets all unique brand names from the dataset
 * @returns Sorted array of brand names
 */
export function getAllBrands(): string[] {
  const mobiles = loadMobiles();
  const brands = new Set(mobiles.map(m => m.brand_name.toLowerCase()));
  return Array.from(brands).sort();
}

/**
 * Gets the minimum and maximum price range from all phones
 * @returns Object with min and max prices
 */
export function getPriceRange(): { min: number; max: number } {
  const mobiles = loadMobiles();
  const prices = mobiles.map(m => m.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
}

/**
 * Performs fuzzy search for phone models with intelligent matching
 * @param query - The search query
 * @param threshold - Minimum match ratio (0-1) to include results
 * @returns Array of matching mobile phones sorted by relevance
 */
export function fuzzySearchModel(query: string, threshold: number = 0.6): Mobile[] {
  if (!query || query.trim().length === 0) {
    return [];
  }
  
  const allPhones = loadMobiles();
  const queryLower = query.toLowerCase().trim();
  
  // Normalize query: handle common variations
  const normalizedQuery = normalizePhoneName(queryLower);
  
  // First, try exact match on model name
  const exactMatch = allPhones.filter(phone => 
    phone.model.toLowerCase() === queryLower ||
    normalizePhoneName(phone.model.toLowerCase()) === normalizedQuery
  );
  if (exactMatch.length > 0) {
    return exactMatch;
  }
  
  // Try substring match
  const substringMatch = allPhones.filter(phone => {
    const phoneLower = phone.model.toLowerCase();
    const phoneNormalized = normalizePhoneName(phoneLower);
    return phoneLower.includes(queryLower) || 
           phoneNormalized.includes(normalizedQuery) ||
           queryLower.includes(phoneLower);
  });
  if (substringMatch.length > 0) {
    return substringMatch.slice(0, 10);
  }
  
  // Split query into words
  const queryWords = normalizedQuery.split(/\s+/).filter(w => w.length > 0);
  
  if (queryWords.length === 0) {
    return [];
  }
  
  // Score-based fuzzy search
  const scoredPhones = allPhones.map(phone => {
    const modelLower = phone.model.toLowerCase();
    const brandLower = phone.brand_name.toLowerCase();
    const modelNormalized = normalizePhoneName(modelLower);
    const fullText = `${brandLower} ${modelNormalized}`;
    
    // Generate aliases for better matching
    const aliases = generatePhoneAliases(phone);
    
    let score = 0;
    let matchedWords = 0;
    
    queryWords.forEach(word => {
      // Check for partial number matches (e.g., "8a" should match "8")
      const isNumberWord = /^\d+[a-z]?$/.test(word);
      const wordBase = isNumberWord ? word.replace(/[a-z]+$/, '') : word;
      
      // Check if any alias contains the word (best match)
      if (aliases.some(alias => alias === normalizedQuery || alias.includes(word))) {
        score += 15; // Highest weight for alias matches
        matchedWords++;
      } else if (modelNormalized.includes(word)) {
        score += 10; // Higher weight for model matches
        matchedWords++;
      } else if (isNumberWord && modelNormalized.includes(wordBase)) {
        score += 8; // Good match for number variations
        matchedWords++;
      } else if (brandLower.includes(word)) {
        score += 5; // Medium weight for brand matches
        matchedWords++;
      } else if (fullText.includes(word)) {
        score += 3; // Lower weight for general matches
        matchedWords++;
      }
    });
    
    // Calculate match ratio
    const matchRatio = matchedWords / queryWords.length;
    
    // Bonus for matching all words
    if (matchRatio === 1) {
      score += 20;
    }
    
    // Bonus for matching brand name
    if (queryWords.some(w => brandLower.includes(w))) {
      score += 5;
    }
    
    // Extra bonus if query matches an alias exactly
    if (aliases.some(alias => alias === normalizedQuery)) {
      score += 25;
    }
    
    return { phone, score, matchRatio };
  });
  
  // Filter by threshold and sort by score
  const results = scoredPhones
    .filter(item => item.matchRatio >= threshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(item => item.phone);
  
  return results;
}

/**
 * Normalizes phone names for better matching
 * @param name - Phone name to normalize
 * @returns Normalized phone name
 */
function normalizePhoneName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, ' ') // Normalize spaces
    .replace(/\s*\(.*?\)\s*/g, ' ') // Remove parenthetical info like "(8GB RAM + 128GB)"
    .replace(/\bgoogle\s+/i, '') // Remove "Google" prefix for Pixel phones
    .replace(/\s+5g\b/gi, '') // Remove 5G suffix
    .replace(/\s+4g\b/gi, '') // Remove 4G suffix
    .trim();
}

/**
 * Creates search aliases for common phone model variations
 * This helps match variations like "12R" for "12 R" or "8a" for "8 a"
 */
function generatePhoneAliases(phone: Mobile): string[] {
  const aliases: string[] = [];
  const model = phone.model.toLowerCase();
  const brand = phone.brand_name.toLowerCase();
  
  // Add original model and brand+model
  aliases.push(model);
  aliases.push(`${brand} ${model}`);
  
  // Remove spaces from model (e.g., "12 R" -> "12r")
  const noSpaces = model.replace(/\s+/g, '');
  if (noSpaces !== model) {
    aliases.push(noSpaces);
    aliases.push(`${brand} ${noSpaces}`);
  }
  
  // Add variation with spaces (e.g., "12r" -> "12 r")
  if (model.match(/\d+[a-z]+$/i)) {
    const withSpace = model.replace(/(\d+)([a-z]+)$/i, '$1 $2');
    aliases.push(withSpace);
    aliases.push(`${brand} ${withSpace}`);
  }
  
  // Remove common prefixes for shorter queries
  const withoutGoogle = model.replace(/^google\s+/i, '');
  if (withoutGoogle !== model) {
    aliases.push(withoutGoogle);
  }
  
  // Handle Samsung M-series specially (e.g., "M35" vs "Galaxy M35")
  if (brand === 'samsung' && model.match(/\bm\d+/i)) {
    const mNumber = model.match(/\b(m\d+)/i)?.[1];
    if (mNumber) {
      aliases.push(mNumber);
      aliases.push(`galaxy ${mNumber}`);
      aliases.push(`samsung ${mNumber}`);
    }
  }
  
  return aliases;
}

