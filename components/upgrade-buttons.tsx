"use client";

type UpgradeButtonsProps = {
  monthlyPriceId?: string;
  annualPriceId?: string;
};

export function UpgradeButtons({
  monthlyPriceId,
  annualPriceId,
}: UpgradeButtonsProps) {
  async function startCheckout(priceId: string) {
    try {
      const res = await fetch("/api/checkout_v3", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const data = await res.json();

      if (!res.ok || !data?.url) {
        console.error("Checkout error:", data);
        alert("Unable to start checkout. Please try again or contact support.");
        return;
      }

      window.location.href = data.url as string;
    } catch (err) {
      console.error("Checkout exception:", err);
      alert("Unexpected error starting checkout.");
    }
  }

  const hasMonthly = !!monthlyPriceId;
  const hasAnnual = !!annualPriceId;

  if (!hasMonthly && !hasAnnual) {
    return (
      <p className="text-xs text-[var(--muted-foreground,#64748b)]">
        Pro upgrade via Stripe is almost ready. Please check back soon.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {hasMonthly && (
        <button
          type="button"
          onClick={() => startCheckout(monthlyPriceId!)}
          className="rounded-full bg-sky-500 px-4 py-1.5 text-xs font-medium text-slate-950 hover:bg-sky-400"
        >
          Upgrade to Pro – Monthly
        </button>
      )}

      {hasAnnual && (
        <button
          type="button"
          onClick={() => startCheckout(annualPriceId!)}
          className="rounded-full border border-sky-500 px-4 py-1.5 text-xs font-medium text-sky-300 hover:bg-sky-500/10"
        >
          Pro – Annual (save)
        </button>
      )}
    </div>
  );
}
