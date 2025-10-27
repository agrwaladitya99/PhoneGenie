import { Mobile } from "@/types/mobile";

export interface RankingCriteria {
  budget?: number;
  priorityFeature?: "camera" | "battery" | "performance" | "display";
}

// Optimized ranking with reduced allocations
export function rankPhones(phones: Mobile[], criteria: RankingCriteria): Mobile[] {
  // Early return for empty array
  if (phones.length === 0) return phones;
  
  // Create shallow copy to avoid mutating original
  const phonesWithScores = phones.map(phone => ({
    phone,
    score: calculateScore(phone, criteria)
  }));
  
  // Use in-place sort for better memory efficiency
  phonesWithScores.sort((a, b) => b.score - a.score);
  
  // Extract phones
  return phonesWithScores.map(item => item.phone);
}

// Optimized score calculation with early computation
function calculateScore(phone: Mobile, criteria: RankingCriteria): number {
  let score = phone.rating;

  // Budget scoring
  if (criteria.budget) {
    const priceRatio = phone.price / criteria.budget;
    score += priceRatio <= 1 ? (priceRatio * 20) : -50;
  }

  // Feature-specific scoring
  switch (criteria.priorityFeature) {
    case "camera":
      score += (phone.primary_camera_rear * 0.2) + (phone.num_rear_cameras * 2);
      break;
    case "battery":
      score += (phone.battery_capacity * 0.003);
      if (phone.fast_charging_available) {
        score += (phone.fast_charging * 0.1);
      }
      break;
    case "performance":
      score += (phone.ram_capacity * 2) + (phone.processor_speed * 5) + (phone.refresh_rate * 0.1);
      break;
    case "display":
      score += (phone.screen_size * 2) + (phone.refresh_rate * 0.1) + 
               ((phone.resolution_width * phone.resolution_height) * 0.00001);
      break;
  }

  // Bonus features
  if (phone.has_5g) score += 5;
  if (phone.refresh_rate >= 120) score += 10;

  return score;
}

