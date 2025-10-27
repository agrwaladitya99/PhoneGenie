"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, Search } from "lucide-react";

interface SuggestionCardProps {
  icon: React.ReactNode;
  text: string;
  category: string;
  description: string;
  examples: string[];
  phoneNames?: string[];
  onSelect: (text: string) => void;
}

export default function SuggestionCard({
  icon,
  text,
  category,
  description,
  examples,
  phoneNames = [],
  onSelect,
}: SuggestionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleGoogleSearch = (phoneName: string) => {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(phoneName + " mobile phone specifications")}`;
    window.open(searchUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="glass-dark rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 group shadow-md">
      {/* Main Card - Clickable to use suggestion - Responsive */}
      <button
        onClick={() => onSelect(text)}
        className="w-full p-3 sm:p-5 text-left transition-all duration-200 hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-2 sm:p-2.5 rounded-lg group-hover:rotate-6 transition-transform flex-shrink-0">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] sm:text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-1 sm:mb-1.5">{category}</p>
            <p className="text-slate-800 dark:text-slate-100 text-sm sm:text-[15px] font-normal leading-snug">{text}</p>
          </div>
        </div>
      </button>

      {/* Expand/Collapse Button - Responsive */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-center gap-1.5 sm:gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 text-[11px] sm:text-xs font-normal border-t border-slate-200 dark:border-slate-700 transition-colors"
      >
        <span>{isExpanded ? "Hide Details" : "Show Details"}</span>
        {isExpanded ? <ChevronUp size={12} className="sm:w-3.5 sm:h-3.5" /> : <ChevronDown size={12} className="sm:w-3.5 sm:h-3.5" />}
      </button>

      {/* Expanded Content - Responsive */}
      {isExpanded && (
        <div className="px-3 sm:px-5 pb-3 sm:pb-5 space-y-3 sm:space-y-4 border-t border-slate-200 dark:border-slate-700 pt-3 sm:pt-4 animate-fadeIn">
          {/* Description - Responsive */}
          <div>
            <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-[14px] leading-relaxed">
              {description}
            </p>
          </div>

          {/* Example Queries - Responsive */}
          {examples.length > 0 && (
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs font-normal mb-2 sm:mb-2.5 uppercase tracking-wider">
                Try asking:
              </p>
              <div className="space-y-1.5 sm:space-y-2">
                {examples.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelect(example)}
                    className="w-full text-left px-2.5 sm:px-3 py-2 sm:py-2.5 bg-slate-100/70 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs sm:text-[13px] text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200 flex items-center gap-1.5 sm:gap-2"
                  >
                    <Search size={11} className="text-indigo-500 sm:w-3 sm:h-3 flex-shrink-0" />
                    <span className="truncate">{example}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Google Search Links - Responsive */}
          {phoneNames.length > 0 && (
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs font-normal mb-2 sm:mb-2.5 uppercase tracking-wider">
                Research online:
              </p>
              <div className="space-y-1.5 sm:space-y-2">
                {phoneNames.map((phoneName, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleGoogleSearch(phoneName)}
                    className="w-full text-left px-2.5 sm:px-3 py-2 sm:py-2.5 bg-gradient-to-r from-blue-100/50 to-indigo-100/50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 rounded-lg text-xs sm:text-[13px] text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200 flex items-center justify-between group"
                  >
                    <span className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                      <ExternalLink size={11} className="text-blue-500 sm:w-3 sm:h-3 flex-shrink-0" />
                      <span className="truncate">Search: {phoneName}</span>
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 text-[10px] sm:text-[11px] flex-shrink-0 ml-2">
                      Google →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

