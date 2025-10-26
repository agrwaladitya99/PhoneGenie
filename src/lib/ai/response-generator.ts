import { Mobile } from "@/types/mobile";
import { generateResponse } from "./gemini";
import {
  SYSTEM_PROMPT,
  SEARCH_PROMPT_TEMPLATE,
  COMPARISON_PROMPT_TEMPLATE,
  EXPLANATION_PROMPT_TEMPLATE,
} from "./prompts";

export async function generateSearchResponse(
  query: string,
  phones: Mobile[],
  budget?: number
): Promise<string> {
  if (phones.length === 0) {
    return `I couldn't find any phones matching your criteria${
      budget ? ` under ₹${budget.toLocaleString()}` : ""
    }. Would you like to adjust your requirements or try a different search?`;
  }

  const phoneSummary = phones.slice(0, 5).map((phone, idx) => `
${idx + 1}. ${phone.model} (₹${phone.price.toLocaleString()})
   - Camera: ${phone.primary_camera_rear}MP
   - Battery: ${phone.battery_capacity}mAh
   - RAM: ${phone.ram_capacity}GB
   - Rating: ${phone.rating}/100
  `).join("\n");

  const criteria = {
    query,
    budget: budget ? `₹${budget.toLocaleString()}` : "any budget",
    phones: phoneSummary,
  };

  const prompt = SEARCH_PROMPT_TEMPLATE.replace(
    "{criteria}",
    JSON.stringify(criteria, null, 2)
  );

  try {
    const response = await generateResponse(prompt, SYSTEM_PROMPT);
    return response;
  } catch (error) {
    return generateSimpleSearchResponse(phones, budget);
  }
}

function generateSimpleSearchResponse(phones: Mobile[], budget?: number): string {
  const topPhones = phones.slice(0, 3);
  
  let response = `Here are my top recommendations${budget ? ` under ₹${budget.toLocaleString()}` : ""}:\n\n`;
  
  topPhones.forEach((phone, idx) => {
    response += `${idx + 1}. **${phone.model}** - ₹${phone.price.toLocaleString()}\n`;
    response += `   - ${phone.primary_camera_rear}MP Camera, ${phone.battery_capacity}mAh Battery\n`;
    response += `   - ${phone.ram_capacity}GB RAM, ${phone.internal_memory}GB Storage\n\n`;
  });

  return response;
}

export async function generateComparisonResponse(
  phones: Mobile[]
): Promise<string> {
  if (phones.length < 2) {
    return "Please provide at least 2 phones to compare.";
  }

  const phonesData = phones.map(phone => ({
    model: phone.model,
    price: `₹${phone.price.toLocaleString()}`,
    camera: `${phone.primary_camera_rear}MP`,
    battery: `${phone.battery_capacity}mAh`,
    ram: `${phone.ram_capacity}GB`,
    rating: `${phone.rating}/100`,
  }));

  const prompt = COMPARISON_PROMPT_TEMPLATE.replace(
    "{phones}",
    JSON.stringify(phonesData, null, 2)
  );

  try {
    const response = await generateResponse(prompt, SYSTEM_PROMPT);
    return response;
  } catch (error) {
    return generateSimpleComparisonResponse(phones);
  }
}

function generateSimpleComparisonResponse(phones: Mobile[]): string {
  let response = `Comparing ${phones.map(p => p.model).join(" vs ")}:\n\n`;
  response += "**Key Specifications:**\n\n";
  response += `Price: ${phones.map(p => `₹${p.price.toLocaleString()}`).join(" | ")}\n`;
  response += `Camera: ${phones.map(p => `${p.primary_camera_rear}MP`).join(" | ")}\n`;
  response += `Battery: ${phones.map(p => `${p.battery_capacity}mAh`).join(" | ")}\n`;
  return response;
}

export async function generateExplanationResponse(query: string): Promise<string> {
  const prompt = EXPLANATION_PROMPT_TEMPLATE.replace("{query}", query);

  try {
    const response = await generateResponse(prompt, SYSTEM_PROMPT);
    return response;
  } catch (error) {
    return "I'm having trouble generating an explanation right now. Could you rephrase your question?";
  }
}

export async function generateGeneralResponse(query: string): Promise<string> {
  try {
    const response = await generateResponse(query, SYSTEM_PROMPT);
    return response;
  } catch (error) {
    return "I'm here to help you find the perfect mobile phone. What are you looking for?";
  }
}

