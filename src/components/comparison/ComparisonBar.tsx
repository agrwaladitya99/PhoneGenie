"use client";

import { useComparison } from "@/contexts/ComparisonContext";
import { X, ArrowRightLeft, Smartphone } from "lucide-react";
import { useState } from "react";
import { Mobile } from "@/types/mobile";

interface ComparisonBarProps {
  onCompare: (phones: Mobile[]) => void;
}

export default function ComparisonBar({ onCompare }: ComparisonBarProps) {
  const { comparisonPhones, removeFromComparison, clearComparison } = useComparison();
  const [isExpanded, setIsExpanded] = useState(true);

  if (comparisonPhones.length === 0) {
    return null;
  }

  const handleCompare = () => {
    onCompare(comparisonPhones);
    clearComparison();
  };

  return (
    <div className="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 animate-slideUp w-[calc(100%-1.5rem)] sm:w-auto max-w-4xl">
      <div className="glass-dark rounded-xl sm:rounded-2xl border border-gray-300 dark:border-white/30 shadow-2xl">
        {/* Header - Responsive */}
        <div className="flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-4 border-b border-gray-300 dark:border-white/20">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-1.5 sm:p-2 rounded-lg">
              <ArrowRightLeft size={16} className="text-white sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="text-gray-900 dark:text-white font-bold text-sm sm:text-lg">Compare Phones</h3>
              <p className="text-gray-600 dark:text-white/60 text-[11px] sm:text-sm">
                {comparisonPhones.length} of 3 selected
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors text-[11px] sm:text-sm font-medium px-2 sm:px-3 py-1 sm:py-1.5"
            >
              {isExpanded ? "Hide" : "Show"}
            </button>
            <button
              onClick={clearComparison}
              className="text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors p-1.5 sm:p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg"
              title="Clear all"
            >
              <X size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          </div>
        </div>

        {/* Phone List - Responsive */}
        {isExpanded && (
          <div className="p-2.5 sm:p-4">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-3 sm:mb-4">
              {comparisonPhones.map((phone) => (
                <div
                  key={phone.model}
                  className="flex-1 glass rounded-lg sm:rounded-xl p-2.5 sm:p-4 border border-gray-300 dark:border-white/20 group hover:border-gray-400 dark:hover:border-white/40 transition-all"
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
                      <Smartphone size={20} className="text-gray-700 dark:text-white sm:w-6 sm:h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-gray-900 dark:text-white font-semibold text-xs sm:text-sm line-clamp-2 mb-0.5 sm:mb-1">
                        {phone.model}
                      </h4>
                      <p className="text-gray-600 dark:text-white/60 text-[11px] sm:text-xs">
                        ₹{phone.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromComparison(phone.model)}
                      className="flex-shrink-0 text-gray-500 dark:text-white/40 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 hover:bg-red-500/10 rounded"
                    >
                      <X size={14} className="sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Empty slots - Hidden on mobile when space is tight */}
              {[...Array(3 - comparisonPhones.length)].map((_, idx) => (
                <div
                  key={`empty-${idx}`}
                  className="hidden sm:flex flex-1 glass-dark rounded-xl p-4 border border-dashed border-gray-300 dark:border-white/20"
                >
                  <div className="flex items-center justify-center h-full w-full">
                    <p className="text-gray-500 dark:text-white/40 text-xs text-center">
                      Add phone to compare
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Compare Button - Responsive */}
            <button
              onClick={handleCompare}
              disabled={comparisonPhones.length < 2}
              className={`w-full py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-base ${
                comparisonPhones.length >= 2
                  ? "bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:shadow-lg hover:scale-[1.02] active:scale-95 cursor-pointer"
                  : "bg-white/10 cursor-not-allowed opacity-50"
              }`}
            >
              <ArrowRightLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline">
                {comparisonPhones.length < 2
                  ? "Select at least 2 phones to compare"
                  : `Compare ${comparisonPhones.length} Phones`}
              </span>
              <span className="sm:hidden">
                {comparisonPhones.length < 2
                  ? "Select 2+ phones"
                  : `Compare ${comparisonPhones.length} Phones`}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

