// lib/calculateRate.ts

export type CalculateRateInput = {
  category: string;
  subType: string;
  details: Record<string, unknown>;
};

// TEMP: simple stub so the UI works.
// Later we’ll replace this with your real GVAA logic
// or wrap your existing big calculator function.
export function calculateRate(_input: CalculateRateInput): number {
  // Example hard-coded placeholder
  return 500;
}
