"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useCalculatorState, OpenSection } from "./hooks/useCalculatorState";
import { RateDisplay } from "./RateDisplay";

export function RateCalculatorUI() {
  const {
    openSection,
    setOpenSection,
    selectedCategory,
    selectedSubType,
    details,
    calculatedRate,
    selectCategory,
    selectSubType,
    updateDetails,
  } = useCalculatorState();

  const catLabel = selectedCategory || "Select category";
  const subLabel = selectedSubType || "Select sub-type";
  const detLabel = details ? "Details selected" : "Provide details";

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Accordion
        type="single"
        collapsible
        value={openSection}
        onValueChange={(v: string | undefined) =>
          setOpenSection((v as OpenSection) ?? "")
        }

        className="border rounded-lg bg-card"
      >
        {/* CATEGORY */}
        <AccordionItem value="category">
          <AccordionTrigger className="text-left">
            <span className="text-sm font-semibold">
              Category — <span className="opacity-70">{catLabel}</span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {["Commercial", "Radio", "TV", "Corporate/Industrial", "E-Learning"].map(
                (c) => (
                  <button
                    key={c}
                    onClick={() => selectCategory(c)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-md border hover:bg-accent",
                      selectedCategory === c && "bg-accent",
                    )}
                  >
                    {c}
                  </button>
                ),
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* SUB-TYPE */}
        <AccordionItem value="subtype" disabled={!selectedCategory}>
          <AccordionTrigger className="text-left">
            <span className="text-sm font-semibold">
              Sub-Type — <span className="opacity-70">{subLabel}</span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {["Local", "Regional", "National", "Internet", "Tags"].map((s) => (
                <button
                  key={s}
                  onClick={() => selectSubType(s)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md border hover:bg-accent",
                    selectedSubType === s && "bg-accent",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* DETAILS */}
        <AccordionItem value="details" disabled={!selectedSubType}>
          <AccordionTrigger className="text-left">
            <span className="text-sm font-semibold">
              Details — <span className="opacity-70">{detLabel}</span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              {/* Example detail field – we’ll expand this later */}
              <div className="flex flex-col space-y-1">
                <label className="text-sm opacity-70">Term</label>
                <select
                  className="border rounded-md bg-background p-2"
                  onChange={(e) =>
                    updateDetails({
                      term: e.target.value,
                    })
                  }
                >
                  <option value="">Choose…</option>
                  <option value="13 weeks">13 weeks</option>
                  <option value="1 year">1 year</option>
                  <option value="In-perpetuity">In-perpetuity</option>
                </select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <RateDisplay rate={calculatedRate} />
    </div>
  );
}
