"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Mobile } from "@/types/mobile";

// Maximum number of phones that can be compared at once
const MAX_COMPARISON_PHONES = 3;

interface ComparisonContextType {
  comparisonPhones: Mobile[];
  addToComparison: (phone: Mobile) => boolean;
  removeFromComparison: (phoneId: string) => void;
  clearComparison: () => void;
  isInComparison: (phoneId: string) => boolean;
  canAddMore: boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [comparisonPhones, setComparisonPhones] = useState<Mobile[]>([]);

  const addToComparison = (phone: Mobile): boolean => {
    if (comparisonPhones.length >= MAX_COMPARISON_PHONES) {
      return false; // Max phones reached
    }
    if (comparisonPhones.some(p => p.model === phone.model)) {
      return false; // Already in comparison
    }
    setComparisonPhones([...comparisonPhones, phone]);
    return true;
  };

  const removeFromComparison = (phoneModel: string) => {
    setComparisonPhones(comparisonPhones.filter(p => p.model !== phoneModel));
  };

  const clearComparison = () => {
    setComparisonPhones([]);
  };

  const isInComparison = (phoneModel: string): boolean => {
    return comparisonPhones.some(p => p.model === phoneModel);
  };

  const canAddMore = comparisonPhones.length < MAX_COMPARISON_PHONES;

  return (
    <ComparisonContext.Provider
      value={{
        comparisonPhones,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isInComparison,
        canAddMore,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error("useComparison must be used within a ComparisonProvider");
  }
  return context;
}

