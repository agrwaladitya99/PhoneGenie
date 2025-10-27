import { z } from "zod";

export const ChatRequestSchema = z.object({
  message: z.string()
    .min(1, "Message cannot be empty")
    .max(1000, "Message too long")
    .refine(val => val.trim().length > 0, {
      message: "Message cannot be empty or only whitespace"
    }),
  context: z.any().optional(),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;

export const SearchRequestSchema = z.object({
  query: z.string().optional(),
  budget: z.number().optional(),
  brand: z.array(z.string()).optional(),
  minBattery: z.number().optional(),
  minCamera: z.number().optional(),
  minRAM: z.number().optional(),
  has5G: z.boolean().optional(),
});

export type SearchRequest = z.infer<typeof SearchRequestSchema>;

