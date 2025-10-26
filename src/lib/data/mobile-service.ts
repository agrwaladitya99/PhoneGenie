import { Mobile } from "@/types/mobile";
import mobilesData from "../../../data/mobiles.json";

let cachedMobiles: Mobile[] | null = null;

export function loadMobiles(): Mobile[] {
  if (cachedMobiles) {
    return cachedMobiles;
  }
  cachedMobiles = mobilesData as Mobile[];
  return cachedMobiles;
}

export function getMobileByModel(model: string): Mobile | null {
  const mobiles = loadMobiles();
  return mobiles.find(m => 
    m.model.toLowerCase() === model.toLowerCase()
  ) || null;
}

export function getAllBrands(): string[] {
  const mobiles = loadMobiles();
  const brands = new Set(mobiles.map(m => m.brand_name.toLowerCase()));
  return Array.from(brands).sort();
}

export function getPriceRange(): { min: number; max: number } {
  const mobiles = loadMobiles();
  const prices = mobiles.map(m => m.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
}

export function fuzzySearchModel(query: string, threshold: number = 0.6): Mobile[] {
  const allPhones = loadMobiles();
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
  
  if (queryWords.length === 0) {
    return [];
  }
  
  return allPhones.filter(phone => {
    const modelLower = phone.model.toLowerCase();
    const matchedWords = queryWords.filter(word => 
      modelLower.includes(word)
    );
    return matchedWords.length / queryWords.length >= threshold;
  });
}

