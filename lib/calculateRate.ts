// lib/calculateRate.ts

import {
  GVAA_IVR,
  GVAA_INTERNAL,
  GVAA_EXPLAINER,
  GVAA_PAID_SOCIAL,
  GVAA_OLV,
  GVAA_OTT,
  GVAA_NONPAID_WEB,
  GVAA_TRADESHOW,
  GVAA_EVENT,
  GVAA_CINEMA,
  GVAA_TOYS,
  GVAA_DUBBING,
  GVAA_ANIMATION,
  GVAA_RADIO,
  GVAA_LOBBY,
  GVAA_MEDICAL,
  GVAA_YOUTUBE,
  GVAA_PODCAST,
  GVAA_AIRPORT,
  GVAA_MUSEUM,
  GVAA_PSA,
  GVAA_DIGITAL_GREETING,
  GVAA_AUDIOBOOK,
  GVAA_ELEARNING,
  GVAA_TV,
  GVAA_GAMES,
  GVAA_TV_PROMO,
  GVAA_RADIO_PROMO,
  GVAA_TRAILERS,
  GVAA_INFOMERCIAL,
  GVAA_INSHOW,
} from "@/data/gvaaRates";

export type CalculatorInput = {
  category: string;
  subType: string;
  details: Record<string, unknown>;
};

// Internal helper types for TV
type TvScopeKey = keyof typeof GVAA_TV; // "local" | "regional" | "national"
type TvTermKey = keyof (typeof GVAA_TV)["local"]; // "oneMonth" | "threeMonths" | "oneYear"

function mapTvScope(subType: string): TvScopeKey | null {
  const key = subType.trim().toLowerCase();
  if (key === "local") return "local";
  if (key === "regional") return "regional";
  if (key === "national") return "national";
  return null;
}

function mapTvTerm(termRaw: unknown): TvTermKey | null {
  if (typeof termRaw !== "string") return null;
  const term = termRaw.trim().toLowerCase();

  // NOTE (assumption for now):
  // - "13 weeks" ≈ 3 months  → threeMonths
  // - "1 year"               → oneYear
  // - "in-perpetuity"        → oneYear (placeholder until we define a proper rule)
  if (term.includes("13")) return "threeMonths";
  if (term.includes("1 year")) return "oneYear";
  if (term.includes("perpet")) return "oneYear";

  // fallback: treat unknown TV terms as oneMonth
  return "oneMonth";
}

function calculateTvRate(input: CalculatorInput): number | null {
  const scopeKey = mapTvScope(input.subType);
  if (!scopeKey) return null;

  const termKey = mapTvTerm(input.details.term);
  if (!termKey) return null;

  const scopeTable = GVAA_TV[scopeKey];
  const termEntry = scopeTable[termKey];

  // termEntry is { low: number, high: number }
  const low = termEntry.low;
  const high = termEntry.high;

  // Simple midpoint for now. Later we can bias based on sliders, budgets, etc.
  return Math.round((low + high) / 2);
}

// Main dispatcher – currently only TV is “real”
export function calculateRate(input: CalculatorInput): number {
  const { category } = input;

  if (category === "TV") {
    const tv = calculateTvRate(input);
    if (tv !== null) return tv;
  }

  // Fallback for all other categories (for now)
  return 500;
}

