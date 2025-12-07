import { RateCalculatorAccordionUI } from "@/components/RateCalculatorAccordionUI";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="rounded-2xl bg-[#111827] border border-[#1F2937] p-6 shadow-sm">
          <RateCalculatorAccordionUI />
        </div>
      </div>
    </div>
  );
}
