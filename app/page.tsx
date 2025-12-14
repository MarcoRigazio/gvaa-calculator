import { RateCalculatorAccordionUI } from "@/components/RateCalculatorAccordionUI";

export default function HomePage() {
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
          <RateCalculatorAccordionUI />
        </div>
      </div>
    </div>
  );
}
