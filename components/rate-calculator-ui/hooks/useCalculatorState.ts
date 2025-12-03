"use client";

import { useState } from "react";

// TEMP stub – later we’ll wire to real GVAA logic
import { calculateRate } from "@/lib/calculateRate";

export type OpenSection = "category" | "subtype" | "details" | "";

export interface CalculatorDetails {
  [key: string]: unknown;
}

export interface CalculatorState {
  openSection: OpenSection;
  selectedCategory: string | null;
  selectedSubType: string | null;
  details: CalculatorDetails | null;
  calculatedRate: number | null;
}

export interface CalculatorActions {
  setOpenSection: (section: OpenSection | "") => void;
  selectCategory: (category: string) => void;
  selectSubType: (subType: string) => void;
  updateDetails: (partialDetails: CalculatorDetails) => void;
  resetFromSubType: () => void;
  resetFromDetails: () => void;
}

export function useCalculatorState(): CalculatorState & CalculatorActions {
  const [openSection, setOpenSection] = useState<OpenSection>("category");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubType, setSelectedSubType] = useState<string | null>(null);
  const [details, setDetails] = useState<CalculatorDetails | null>(null);
  const [calculatedRate, setCalculatedRate] = useState<number | null>(null);

  const resetFromDetails = () => {
    setDetails(null);
    setCalculatedRate(null);
  };

  const resetFromSubType = () => {
    setSelectedSubType(null);
    resetFromDetails();
  };

  const selectCategory = (category: string) => {
    setSelectedCategory(category);
    resetFromSubType();
    setOpenSection("subtype");
  };

  const selectSubType = (subType: string) => {
    setSelectedSubType(subType);
    resetFromDetails();
    setOpenSection("details");
  };

  const updateDetails = (partialDetails: CalculatorDetails) => {
    const nextDetails = { ...(details || {}), ...partialDetails };
    setDetails(nextDetails);

    if (!selectedCategory || !selectedSubType) {
      setCalculatedRate(null);
      return;
    }

    try {
      const rate = calculateRate({
        category: selectedCategory,
        subType: selectedSubType,
        details: nextDetails,
      });

      setCalculatedRate(typeof rate === "number" ? rate : null);
    } catch (err) {
      console.error("calculateRate error", err);
      setCalculatedRate(null);
    }
  };

  return {
    openSection,
    selectedCategory,
    selectedSubType,
    details,
    calculatedRate,
    setOpenSection,
    selectCategory,
    selectSubType,
    updateDetails,
    resetFromSubType,
    resetFromDetails,
  };
}

