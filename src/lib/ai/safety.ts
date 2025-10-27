const ADVERSARIAL_PATTERNS = [
  // Prompt injection attempts (enhanced)
  /ignore.*(?:previous|prior|above|your|all|these|the).*(?:instructions|rules|prompt|commands|directives)/i,
  /forget.*(?:everything|instructions|rules|prompt|commands|what\s+i\s+said|all\s+that)/i,
  /reveal.*(?:system|prompt|instructions|rules|internal|hidden|secret)/i,
  /show.*(?:system|prompt|instructions|rules|internal|hidden|original)/i,
  /tell\s+me.*(?:system|prompt|instructions|rules|configuration|settings)/i,
  /what.*(?:is|are|were).*(?:your|the).*(?:system|prompt|instructions|initial\s+prompt)/i,
  /(?:display|print|output|write).*(?:system|prompt|instructions|original)/i,
  
  // API key and credential fishing (enhanced)
  /(?:api|secret|private|gemini|openai|google).*(?:key|token|credential)/i,
  /(?:show|tell|reveal|give|provide|share).*(?:password|credential|token|key|secret)/i,
  /authentication.*(?:token|key|secret|credential)/i,
  /environment.*(?:variable|var|key)/i,
  /\.env.*(?:file|variable|key)/i,
  
  // Safety bypass attempts (enhanced)
  /bypass.*(?:safety|security|filter|rule|restriction|guard|protection)/i,
  /override.*(?:protocol|safety|security|rule|restriction|filter|instruction)/i,
  /disable.*(?:safety|security|filter|rule|protection|guard)/i,
  /circumvent.*(?:safety|security|filter|rule|restriction)/i,
  /get\s+around.*(?:safety|security|filter|rule|restriction)/i,
  /work\s+around.*(?:safety|filter|rule|restriction)/i,
  
  // Role manipulation (enhanced)
  /act\s+as\s+(?:a|an)\s+(?!mobile|phone|shopping|assistant).{0,30}(?:assistant|expert|agent|bot|ai)/i,
  /pretend\s+(?:to\s+be|you(?:'re|\s+are))\s+(?!a\s+(?:mobile|phone|shopping))/i,
  /you\s+are\s+now\s+(?:a|an)\s+(?!mobile|phone|shopping)/i,
  /simulate.*(?:being|you're|you\s+are).*(?!mobile|phone|shopping)/i,
  /roleplay.*(?:as|being).*(?!mobile|phone|shopping)/i,
  /switch\s+to.*(?:mode|role|character)/i,
  
  // Instruction override (enhanced)
  /disregard.*(?:instructions|rules|guidelines|everything|previous|above)/i,
  /cancel.*(?:instructions|rules|guidelines|everything|previous)/i,
  /new\s+(?:instructions|rules|mission|task|objective|goal)/i,
  /instead.*(?:of|follow|do|execute).*(?:instructions|rules)/i,
  /don't\s+follow.*(?:instructions|rules|guidelines)/i,
  
  // Jailbreak patterns (enhanced)
  /jailbreak/i,
  /DAN\s+mode/i,
  /developer\s+mode/i,
  /god\s+mode/i,
  /admin\s+mode/i,
  /sudo\s+mode/i,
  /root\s+access/i,
  /unrestricted.*mode/i,
  
  // Hidden content extraction (enhanced)
  /hidden.*(?:prompt|instructions|rules|content|system)/i,
  /show\s+me\s+everything/i,
  /dump.*(?:prompt|instructions|memory|log|data)/i,
  /extract.*(?:prompt|instructions|system|data)/i,
  /decode.*(?:prompt|instructions|system)/i,
  
  // Manipulation through confusion
  /(?:confused|confuse).*(?:about|regarding).*(?:role|purpose|instructions)/i,
  /what\s+(?:were|was).*(?:told|instructed|programmed)/i,
  /(?:core|base|original).*(?:programming|instruction|directive)/i,
  
  // Meta-level queries designed to extract info
  /how\s+(?:were|are)\s+you\s+(?:programmed|trained|instructed|built|created)/i,
  /who\s+(?:programmed|created|built|designed|instructed)\s+you/i,
  /what\s+(?:model|version|language\s+model|llm)\s+are\s+you/i,
  
  // Encoding/obfuscation attempts
  /base64.*(?:decode|encoded)/i,
  /rot13/i,
  /hex.*(?:decode|encoded)/i,
  /\$\{.*\}/i, // Template literal injection
  /eval\s*\(/i, // Code injection patterns
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

// Toxic and brand-bashing patterns (enhanced)
const TOXIC_PATTERNS = [
  // Direct brand bashing
  /(?:trash|garbage|shit|crap|terrible|horrible|awful|pathetic|useless).*(?:brand|phone|company)/i,
  /(?:brand|phone|company).*(?:trash|garbage|shit|crap|terrible|horrible|awful|pathetic|useless)/i,
  /(?:samsung|apple|oneplus|xiaomi|oppo|vivo|realme|google|motorola|nokia|asus).*(?:is|are).*(?:trash|garbage|shit|crap|worst|pathetic|useless)/i,
  /(?:trash|garbage|shit|crap|worst|pathetic|useless).*(?:samsung|apple|oneplus|xiaomi|oppo|vivo|realme|google|motorola|nokia|asus)/i,
  /(?:hate|never\s+buy|avoid|don't\s+buy).*(?:samsung|apple|oneplus|xiaomi|oppo|vivo|realme|google|motorola|nokia|asus)/i,
  
  // "Sucks" patterns - Added for test coverage
  /(?:samsung|apple|oneplus|xiaomi|oppo|vivo|realme|google|motorola|nokia|asus).*sucks?(?!\s+as\s+in)/i,
  /sucks?(?!\s+as\s+in).*(?:samsung|apple|oneplus|xiaomi|oppo|vivo|realme|google|motorola|nokia|asus)/i,
  /phones?\s+that\s+don'?t\s+suck/i,
  
  // Aggressive comparisons
  /(?:way\s+)?(?:better|superior)\s+than.*(?:garbage|trash|shit)/i,
  /(?:samsung|apple|oneplus|xiaomi|oppo|vivo|realme|google).*(?:fanboy|fangirl|sheep|cult)/i,
  
  // Conspiracy or unfounded claims
  /(?:samsung|apple|oneplus|xiaomi|oppo|vivo|realme|google).*(?:scam|fraud|ripoff|rip-off|stealing|cheating)/i,
  
  // Inflammatory statements
  /only\s+(?:idiots|fools|morons).*(?:buy|use)/i,
  /(?:waste\s+of\s+money|money\s+down\s+the\s+drain).*(?:samsung|apple|oneplus|xiaomi|oppo|vivo|realme|google)/i,
];

const PROFANITY_PATTERNS = [
  /\b(?:fuck|shit|damn|ass|bitch|bastard|hell|cunt|dick|piss)\b/i,
  /\b(?:fuckin|fucking|shitty|shithead|asshole|dumbass|dipshit)\b/i,
];

// Spam and repetitive patterns
const SPAM_PATTERNS = [
  /(.)\1{10,}/, // Same character repeated 10+ times
  /(\b\w+\b)(\s+\1){5,}/i, // Same word repeated 5+ times
];

export function checkToxicity(message: string): SafetyCheckResult {
  // Check for spam patterns
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(message)) {
      return {
        safe: false,
        reason: "spam_detected",
        refusalMessage: "Please send a valid query. I'm here to help you find the perfect phone!"
      };
    }
  }

  // Check for toxic brand bashing
  for (const pattern of TOXIC_PATTERNS) {
    if (pattern.test(message)) {
      return {
        safe: false,
        reason: "toxic_content",
        refusalMessage: "I'm here to provide helpful, unbiased shopping assistance. Let me help you find a great phone based on facts and specifications instead. What features are most important to you?"
      };
    }
  }

  // Check for profanity (light filter - only block if excessive)
  let profanityCount = 0;
  for (const pattern of PROFANITY_PATTERNS) {
    const matches = message.match(new RegExp(pattern, 'gi'));
    if (matches) {
      profanityCount += matches.length;
    }
  }
  
  if (profanityCount >= 2) {
    return {
      safe: false,
      reason: "profanity",
      refusalMessage: "Let's keep our conversation professional. How can I help you find the perfect phone?"
    };
  }

  return { safe: true };
}

export function isQueryOffTopic(query: string): boolean {
  const lowerQuery = query.toLowerCase().trim();
  
  // First, check for explicit off-topic patterns (most specific)
  const explicitOffTopicPatterns = [
    // Jokes and entertainment
    /(?:^|\s)(?:tell|write|give|show)\s+(?:me\s+)?(?:a\s+|an\s+|some\s+)?(?:joke|story|poem|song|essay|riddle|quote)/i,
    /(?:^|\s)(?:make|create)\s+(?:me\s+)?(?:a\s+|an\s+)?(?:poem|song|joke)/i,
    
    // Weather
    /what'?s?\s+(?:the\s+)?(?:weather|temperature|forecast)/i,
    /(?:is\s+it|will\s+it)\s+(?:rain|snow|sunny|hot|cold)/i,
    
    // Food and recipes  
    /(?:recipe|how\s+to\s+(?:cook|bake|make|prepare))\s+(?!.*phone)/i,
    /how\s+(?:do\s+i|to|can\s+i)\s+(?:cook|bake|make|prepare)\s+/i,
    
    // Politics and news
    /who\s+(?:won|will\s+win|is\s+winning)\s+(?:the\s+)?(?:election|race|game|match)/i,
    /(?:president|politics|politician|election|vote|voting)/,
    
    // Geography
    /what\s+(?:is|are)\s+(?:the\s+)?capital\s+of/i,
    /where\s+is\s+(?!.*phone|.*mobile)/i,
    
    // General knowledge
    /when\s+(?:did|was|were|is)\s+(?!.*phone)/i,
    /who\s+(?:is|was|were|are)\s+(?!.*phone)/i,
    
    // Math
    /(?:calculate|solve|compute|do\s+this)\s+(?:math|equation|problem)/i,
    /what\s+is\s+\d+\s*[\+\-\*\/]/i,
    
    // Other creative tasks
    /^(?:play|sing|draw|paint|dance|write\s+code)/i,
    /translate\s+.*\s+to\s+/i,
  ];

  // Check explicit patterns first
  if (explicitOffTopicPatterns.some(pattern => pattern.test(lowerQuery))) {
    return true;
  }
  
  // Enhanced off-topic detection with context awareness
  const offTopicKeywords = [
    "weather", "news", "recipe", "cooking", "movie", "film", "book",
    "sports", "politics", "stock", "crypto", "bitcoin", "election",
    "music", "song", "lyrics", "poem", "poetry", "story",
    "game", "video game", "gaming pc", "console", // But not "mobile gaming"
    "travel", "vacation", "hotel", "flight",
    "medical", "health", "doctor", "medicine",
    "legal", "lawyer", "court", "lawsuit",
    "astronomy", "space", "planet", "star",
    "history", "historical", "ancient",
    "mathematics", "math problem", "algebra",
    "translate", "translation", "language learning",
    "capital of", "president", "geography"
  ];

  // Check if query contains off-topic keywords AND lacks phone-related context
  const phoneRelatedWords = [
    "phone", "mobile", "smartphone", "device", "camera", "battery", "display",
    "ram", "storage", "processor", "screen", "gb", "5g", "4g", "android", "ios",
    "pixel", "iphone", "samsung", "oneplus", "xiaomi", "oppo", "vivo", "realme",
    "charging", "specs", "specifications", "model", "brand", "handset", "cellphone"
  ];

  const hasOffTopicKeyword = offTopicKeywords.some(keyword => lowerQuery.includes(keyword));
  const hasPhoneContext = phoneRelatedWords.some(keyword => lowerQuery.includes(keyword));

  // If it has off-topic keywords but no phone context, it's off-topic
  return hasOffTopicKeyword && !hasPhoneContext;
}

/**
 * Advanced check to determine if a "general" query is actually off-topic
 * This is used after intent detection to catch queries that the AI might classify as "general"
 * but are actually off-topic (not about phones)
 */
export function isGeneralQueryOffTopic(query: string): boolean {
  const lowerQuery = query.toLowerCase().trim();
  
  // Phone-related words that would make a general query on-topic
  const phoneRelatedWords = [
    "phone", "mobile", "smartphone", "device", "camera", "battery", "display",
    "ram", "storage", "processor", "screen", "gb", "5g", "4g", "android", "ios",
    "pixel", "iphone", "samsung", "oneplus", "xiaomi", "oppo", "vivo", "realme",
    "charging", "specs", "specifications", "model", "brand", "handset", "cellphone",
    "app", "gaming", "performance", "speed", "megapixel", "mp", "refresh rate"
  ];
  
  // If the query contains phone-related context, it's on-topic
  if (phoneRelatedWords.some(word => lowerQuery.includes(word))) {
    return false;
  }
  
  // Patterns that indicate off-topic queries
  const offTopicPatterns = [
    // General knowledge questions
    /^what (?:is|are) (?:the )?(?:capital|population|currency|language) of/i,
    /^who (?:is|was|are|were) (?:the )?(?:president|king|queen|leader|founder|inventor)/i,
    /^when (?:did|was|were|is|are)/i,
    /^where (?:is|are|was|were|can i find)/i,
    
    // Entertainment requests
    /^(?:tell|give|show) me (?:a |an |some )?(?:joke|story|poem|riddle|quote)/i,
    /^write (?:a |an |me )?(?:poem|story|song|essay|letter)/i,
    
    // Instruction requests (non-phone)
    /^how (?:to|do i|can i) (?:cook|bake|make|build|create|write|draw|paint) (?!.*phone)/i,
    
    // Weather and time
    /^what'?s? (?:the |today'?s? )?(?:weather|temperature|time|date)/i,
    
    // Math and calculations
    /^(?:calculate|solve|compute|what is) (?:\d+|\w+) (?:\+|\-|\*|\/|plus|minus|times|divided)/i,
    
    // Translation requests
    /^(?:translate|how do you say) (?:.+) (?:in|to) (?!.*phone)/i,
  ];
  
  return offTopicPatterns.some(pattern => pattern.test(lowerQuery));
}

// Rate limiting - Simple in-memory implementation (for production, use Redis or similar)
interface RateLimitEntry {
  count: number;
  firstRequest: number;
  lastRequest: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20; // 20 requests per minute
const CLEANUP_INTERVAL = 5 * 60 * 1000; // Clean up every 5 minutes

// Periodic cleanup of old entries
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (now - entry.lastRequest > RATE_LIMIT_WINDOW * 2) {
        rateLimitStore.delete(key);
      }
    }
  }, CLEANUP_INTERVAL);
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier for the client (IP, session ID, etc.)
 * @returns SafetyCheckResult indicating if the request should be blocked
 */
export function checkRateLimit(identifier: string): SafetyCheckResult {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry) {
    // First request from this identifier
    rateLimitStore.set(identifier, {
      count: 1,
      firstRequest: now,
      lastRequest: now,
    });
    return { safe: true };
  }

  // Check if we're still in the same time window
  if (now - entry.firstRequest < RATE_LIMIT_WINDOW) {
    if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
      return {
        safe: false,
        reason: "rate_limit_exceeded",
        refusalMessage: `Too many requests. Please wait a moment before sending more queries. You can send up to ${MAX_REQUESTS_PER_WINDOW} requests per minute.`
      };
    }
    
    // Increment count
    entry.count++;
    entry.lastRequest = now;
    rateLimitStore.set(identifier, entry);
    return { safe: true };
  } else {
    // New time window - reset counter
    rateLimitStore.set(identifier, {
      count: 1,
      firstRequest: now,
      lastRequest: now,
    });
    return { safe: true };
  }
}

/**
 * Get rate limit info for a client
 * @param identifier - Unique identifier for the client
 * @returns Rate limit information
 */
export function getRateLimitInfo(identifier: string): {
  remaining: number;
  resetAt: number;
} {
  const entry = rateLimitStore.get(identifier);
  if (!entry) {
    return {
      remaining: MAX_REQUESTS_PER_WINDOW,
      resetAt: Date.now() + RATE_LIMIT_WINDOW,
    };
  }

  const remaining = Math.max(0, MAX_REQUESTS_PER_WINDOW - entry.count);
  const resetAt = entry.firstRequest + RATE_LIMIT_WINDOW;

  return { remaining, resetAt };
}

