import { Mobile } from "@/types/mobile";

export interface ComparisonData {
  phones: Mobile[];
  differences: ComparisonDifference[];
  summary: string;
}

export interface ComparisonDifference {
  feature: string;
  values: any[];
  winner?: number;
  note?: string;
}

export function comparePhones(phones: Mobile[]): ComparisonData {
  if (phones.length < 2) {
    throw new Error("Need at least 2 phones to compare");
  }

  const differences: ComparisonDifference[] = [];

  differences.push(compareFeature("Price", phones, p => p.price, "lower", "₹"));
  differences.push(compareFeature("Rating", phones, p => p.rating, "higher", "/100"));
  differences.push(compareFeature("Camera", phones, p => p.primary_camera_rear, "higher", "MP"));
  differences.push(compareFeature("Battery", phones, p => p.battery_capacity, "higher", "mAh"));
  differences.push(compareFeature("RAM", phones, p => p.ram_capacity, "higher", "GB"));
  differences.push(compareFeature("Storage", phones, p => p.internal_memory, "higher", "GB"));
  differences.push(compareFeature("Display", phones, p => p.screen_size, "higher", "\""));
  differences.push(compareFeature("Refresh Rate", phones, p => p.refresh_rate, "higher", "Hz"));

  const summary = generateComparisonSummary(phones, differences);

  return {
    phones,
    differences,
    summary
  };
}

function compareFeature(
  featureName: string,
  phones: Mobile[],
  extractor: (phone: Mobile) => any,
  comparison: "higher" | "lower" | "text",
  unit: string = ""
): ComparisonDifference {
  const values = phones.map(extractor);
  
  let winner: number | undefined;
  
  if (comparison === "higher") {
    const maxValue = Math.max(...values.map(v => typeof v === 'number' ? v : 0));
    winner = values.findIndex(v => v === maxValue);
  } else if (comparison === "lower") {
    const minValue = Math.min(...values.map(v => typeof v === 'number' ? v : Infinity));
    winner = values.findIndex(v => v === minValue);
  }

  return {
    feature: featureName,
    values: values.map(v => typeof v === 'number' ? `${v}${unit}` : v),
    winner,
  };
}

function generateComparisonSummary(phones: Mobile[], differences: ComparisonDifference[]): string {
  const names = phones.map(p => p.model);
  const wins = phones.map((_, idx) => 
    differences.filter(d => d.winner === idx).length
  );
  
  const maxWins = Math.max(...wins);
  const overallWinner = wins.indexOf(maxWins);
  
  return `${names[overallWinner]} leads in ${wins[overallWinner]} categories.`;
}

