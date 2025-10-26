import { Mobile } from "@/types/mobile";

export interface RankingCriteria {
  budget?: number;
  priorityFeature?: "camera" | "battery" | "performance" | "display";
}

export function rankPhones(phones: Mobile[], criteria: RankingCriteria): Mobile[] {
  return phones
    .map(phone => ({
      phone,
      score: calculateScore(phone, criteria)
    }))
    .sort((a, b) => b.score - a.score)
    .map(item => item.phone);
}

function calculateScore(phone: Mobile, criteria: RankingCriteria): number {
  let score = phone.rating;

  if (criteria.budget) {
    const priceRatio = phone.price / criteria.budget;
    if (priceRatio <= 1) {
      score += (priceRatio * 20);
    } else {
      score -= 50;
    }
  }

  if (criteria.priorityFeature === "camera") {
    score += (phone.primary_camera_rear / 10) * 2;
    score += phone.num_rear_cameras * 2;
  } else if (criteria.priorityFeature === "battery") {
    score += (phone.battery_capacity / 1000) * 3;
    if (phone.fast_charging_available) {
      score += (phone.fast_charging / 10);
    }
  } else if (criteria.priorityFeature === "performance") {
    score += phone.ram_capacity * 2;
    score += phone.processor_speed * 5;
    score += phone.refresh_rate / 10;
  } else if (criteria.priorityFeature === "display") {
    score += phone.screen_size * 2;
    score += phone.refresh_rate / 10;
    score += (phone.resolution_width * phone.resolution_height) / 100000;
  }

  if (phone.has_5g) {
    score += 5;
  }

  if (phone.refresh_rate >= 120) {
    score += 10;
  }

  return score;
}

