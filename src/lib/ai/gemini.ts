import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateResponse(
  prompt: string,
  systemPrompt?: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const fullPrompt = systemPrompt 
      ? `${systemPrompt}\n\nUser Query: ${prompt}`
      : prompt;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("AI generation failed. Please try again.");
  }
}

export async function generateJSONResponse<T>(
  prompt: string,
  systemPrompt?: string
): Promise<T> {
  const response = await generateResponse(prompt, systemPrompt);
  
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as T;
    }
    throw new Error("No JSON found in response");
  } catch (error) {
    console.error("JSON parsing error:", error);
    throw new Error("Failed to parse AI response");
  }
}

export function isGeminiConfigured(): boolean {
  return !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 0;
}

