"use client";

import { useState } from "react";
import { Message } from "@/types/chat";
import ProductGrid from "../product/ProductGrid";
import ComparisonTable from "../comparison/ComparisonTable";
import { Bot, User, ChevronDown, ChevronUp } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const [showingMore, setShowingMore] = useState(false);
  
  const hasAdditionalPhones = message.additionalPhones && message.additionalPhones.length > 0;
  const displayPhones = showingMore && message.additionalPhones 
    ? [...(message.phones || []), ...message.additionalPhones]
    : message.phones;

  return (
    <div 
      className={`flex gap-2 sm:gap-3 ${isUser ? "justify-end" : "justify-start"}`}
      role="article"
      aria-label={`${isUser ? "User" : "Assistant"} message`}
    >
      {/* Avatar for AI */}
      {!isUser && (
        <div className="flex-shrink-0" aria-hidden="true">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg sm:rounded-xl blur-md opacity-75 group-hover:opacity-100 transition"></div>
            <div 
              className="relative bg-gradient-to-br from-purple-600 to-pink-600 p-1.5 sm:p-2 rounded-lg sm:rounded-xl"
              role="img"
              aria-label="AI Assistant avatar"
            >
              <Bot className="text-white" size={18} aria-hidden="true" />
            </div>
          </div>
        </div>
      )}

      <div className={`flex-1 ${isUser ? "max-w-[85%] sm:max-w-xl" : "max-w-full"}`}>
        {/* Message bubble - Responsive with full height expansion */}
        <div
          className={`rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-lg backdrop-blur-xl transition-all duration-300 ${
            isUser
              ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white ml-auto"
              : "glass text-gray-800 dark:text-slate-100 border border-slate-200/40 dark:border-slate-700/40"
          }`}
        >
          <div className="whitespace-pre-wrap text-sm sm:text-[15px] leading-[1.7] sm:leading-[1.75] font-normal tracking-wide max-h-none overflow-visible">
            {message.content}
          </div>
        </div>

        {/* Comparison Table for compare type messages */}
        {message.type === "compare" && displayPhones && displayPhones.length >= 2 && (
          <div className="mt-3 sm:mt-4">
            <ComparisonTable phones={displayPhones} />
          </div>
        )}

        {/* Product cards if present (for non-comparison or in addition to comparison) */}
        {displayPhones && displayPhones.length > 0 && message.type !== "compare" && (
          <div className="mt-2 sm:mt-3 space-y-2">
            <ProductGrid phones={displayPhones} />
            
            {/* Show More Button - Compact */}
            {hasAdditionalPhones && (
              <div className="flex justify-center">
                <button
                  onClick={() => setShowingMore(!showingMore)}
                  className="group relative px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-[11px] sm:text-xs transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  aria-expanded={showingMore}
                  aria-controls="additional-phones"
                  aria-label={showingMore ? "Show fewer phones" : `Show ${message.additionalPhones?.length} more phones`}
                >
                  {/* Gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-lg opacity-90 group-hover:opacity-100 transition-opacity" aria-hidden="true"></div>
                  
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity" aria-hidden="true"></div>
                  
                  {/* Button content */}
                  <div className="relative flex items-center gap-1 sm:gap-1.5 text-white">
                    {showingMore ? (
                      <>
                        <ChevronUp size={12} aria-hidden="true" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown size={12} aria-hidden="true" />
                        Show More ({message.additionalPhones?.length})
                      </>
                    )}
                  </div>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Timestamp */}
        <div
          className={`text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 sm:mt-2 font-normal ${
            isUser ? "text-right" : "text-left"
          }`}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>

      {/* Avatar for User */}
      {isUser && (
        <div className="flex-shrink-0" aria-hidden="true">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg sm:rounded-xl blur-md opacity-75 group-hover:opacity-100 transition"></div>
            <div 
              className="relative bg-gradient-to-br from-blue-600 to-cyan-600 p-1.5 sm:p-2 rounded-lg sm:rounded-xl"
              role="img"
              aria-label="User avatar"
            >
              <User className="text-white" size={18} aria-hidden="true" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


