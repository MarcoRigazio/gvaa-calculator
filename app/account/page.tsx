// app/account/page.tsx
import { currentUser } from "@clerk/nextjs/server";
import { UpgradeButtons } from "@/components/upgrade-buttons";

export default async function AccountPage() {
  const user = await currentUser();

  // If something weird happens and there is no user, just fail safe:
  if (!user) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-semibold mb-4">Account</h1>
        <p className="text-sm text-red-500">
          No user session found. Please sign out and sign back in.
        </p>
      </main>
    );
  }

  // We’ll eventually write this from Stripe webhooks.
  // For now, default to "Free".
  const plan =
    (user.publicMetadata?.plan as string | undefined) ||
    (user.privateMetadata?.plan as string | undefined) ||
    "Free";

  // Read price IDs from env so we don’t hardcode them in the bundle.
  const proMonthlyPriceId =
    process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY || undefined;
  const proAnnualPriceId =
    process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_ANNUAL || undefined;

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-[var(--ink)]">Account</h1>
        <p className="text-sm text-[var(--muted-foreground,#64748b)]">
          Manage your MyVOBiz calculator access and subscription.
        </p>
      </header>

      <section className="rounded-lg border border-[var(--line,#1f2933)] bg-[var(--bg,#020617)] p-4 space-y-2">
        <h2 className="text-sm font-medium text-[var(--ink)]">
          Account details
        </h2>
        <div className="text-sm space-y-1">
          <p>
            <span className="text-[var(--muted-foreground,#64748b)]">
              Email:
            </span>{" "}
            <span>{user.emailAddresses[0]?.emailAddress ?? "Unknown"}</span>
          </p>
          <p>
            <span className="text-[var(--muted-foreground,#64748b)]">
              Current plan:
            </span>{" "}
            <span className="inline-flex items-center rounded-full border border-sky-500/60 px-2 py-0.5 text-xs uppercase tracking-wide text-sky-300">
              {plan}
            </span>
          </p>
        </div>
      </section>

      <section className="rounded-lg border border-[var(--line,#1f2933)] bg-[var(--bg,#020617)] p-4 space-y-3">
        <h2 className="text-sm font-medium text-[var(--ink)]">
          Subscription & billing
        </h2>
        <p className="text-sm text-[var(--muted-foreground,#64748b)]">
          Stripe-powered subscription management is coming in Phase 2B. For now,
          all accounts are treated as <strong>Free</strong> until a Pro
          subscription is active.
        </p>

        <UpgradeButtons
          monthlyPriceId={proMonthlyPriceId}
          annualPriceId={proAnnualPriceId}
        />
      </section>
    </main>
  );
}
