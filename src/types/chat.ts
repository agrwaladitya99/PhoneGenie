import { Mobile } from "./mobile";

export type MessageRole = "user" | "assistant";

export type MessageType = "search" | "compare" | "explain" | "refusal" | "general";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  phones?: Mobile[];
  type?: MessageType;
  timestamp: Date;
}

export interface ChatContext {
  previousMessages?: Message[];
  lastPhones?: Mobile[];
  userBudget?: number;
  userPreferences?: {
    brand?: string[];
    features?: string[];
  };
}

export interface IntentResult {
  type: "search" | "compare" | "explain" | "details" | "adversarial" | "irrelevant";
  confidence: number;
  parameters?: {
    budget?: number;
    brands?: string[];
    features?: string[];
    models?: string[];
    query?: string;
  };
}

