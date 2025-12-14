// components/upgrade-buttons.tsx
"use client";

import { useState } from "react";

type UpgradeButtonsProps = {
  monthlyPriceId?: string;
  annualPriceId?: string;
};

export function UpgradeButtons({
  monthlyPriceId,
  annualPriceId,
}: UpgradeButtonsProps) {
  const [loading, setLoading] = useState<"monthly" | "annual" | null>(null);

  async function startCheckout(kind: "monthly" | "annual") {
    const priceId = kind === "monthly" ? monthlyPriceId : annualPriceId;
    if (!priceId) {
      console.error("Missing Stripe price ID for", kind);
      return;
    }

    try {
      setLoading(kind);

      const res = await fetch("/api/checkout_v3", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          success_url: `${window.location.origin}/account?status=success`,
          cancel_url: `${window.location.origin}/account?status=cancel`,
        }),
      });

      const data = await res.json();

      if (data?.url) {
        window.location.href = data.url as string;
      } else {
        console.error("Stripe checkout did not return a URL", data);
      }
    } catch (err) {
      console.error("Error starting checkout:", err);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => startCheckout("monthly")}
        disabled={!monthlyPriceId || loading !== null}
        className="inline-flex items-center rounded-md border border-sky-500 bg-sky-500/10 px-4 py-2 text-sm font-medium text-sky-100 hover:bg-sky-500/20 disabled:opacity-50"
      >
        {loading === "monthly"
          ? "Starting monthly checkout..."
          : "Upgrade to Pro – $10/mo"}
      </button>

      <button
        type="button"
        onClick={() => startCheckout("annual")}
        disabled={!annualPriceId || loading !== null}
        className="inline-flex items-center rounded-md border border-sky-700 bg-sky-700/10 px-4 py-2 text-sm font-medium text-sky-100 hover:bg-sky-700/20 disabled:opacity-50"
      >
        {loading === "annual"
          ? "Starting annual checkout..."
          : "Upgrade to Pro – $100/yr"}
      </button>
    </div>
  );
}
