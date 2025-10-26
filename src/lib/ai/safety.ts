const ADVERSARIAL_PATTERNS = [
  /ignore.*(?:previous|prior|above|your).*(?:instructions|rules|prompt)/i,
  /forget.*(?:everything|instructions|rules|prompt)/i,
  /reveal.*(?:system|prompt|instructions|rules)/i,
  /(?:api|secret|private).*key/i,
  /system.*prompt/i,
  /bypass.*(?:safety|security|filter|rule)/i,
  /override.*(?:protocol|safety|security|rule)/i,
  /act\s+as\s+(?:a|an)\s+(?!mobile|phone|shopping)/i,
  /pretend\s+you(?:'re|\s+are)\s+(?!a\s+(?:mobile|phone|shopping))/i,
  /you\s+are\s+now\s+(?!a\s+(?:mobile|phone|shopping))/i,
  /disregard.*(?:instructions|rules|guidelines)/i,
];

export interface SafetyCheckResult {
  safe: boolean;
  reason?: string;
  refusalMessage?: string;
}

export function checkSafety(message: string): SafetyCheckResult {
  for (const pattern of ADVERSARIAL_PATTERNS) {
    if (pattern.test(message)) {
      return {
        safe: false,
        reason: "adversarial_pattern_detected",
        refusalMessage: "I can only help with mobile phone shopping queries. What phone features are you interested in?"
      };
    }
  }

  if (message.length > 1000) {
    return {
      safe: false,
      reason: "message_too_long",
      refusalMessage: "Your message is too long. Please keep your query under 1000 characters."
    };
  }

  if (!message.trim()) {
    return {
      safe: false,
      reason: "empty_message",
      refusalMessage: "Please enter a query to get started."
    };
  }

  return { safe: true };
}

export function isQueryOffTopic(query: string): boolean {
  const offTopicKeywords = [
    "weather", "news", "recipe", "cooking", "movie", "book",
    "sports", "politics", "stock", "crypto", "bitcoin",
  ];

  const lowerQuery = query.toLowerCase();
  return offTopicKeywords.some(keyword => lowerQuery.includes(keyword));
}

