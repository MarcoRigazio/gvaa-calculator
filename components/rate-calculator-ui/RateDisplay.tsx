"use client";

type RateDisplayProps = {
  rate: number | null;
};

export function RateDisplay({ rate }: RateDisplayProps) {
  return (
    <div className="mt-4 p-4 rounded-lg border bg-card">
      <h3 className="text-lg font-semibold mb-2">Rate Estimate</h3>

      {rate === null && (
        <p className="opacity-70 text-sm">
          Complete all steps to view the rate.
        </p>
      )}

      {rate !== null && (
        <div className="text-2xl font-bold">
          ${rate}
        </div>
      )}
    </div>
  );
}

