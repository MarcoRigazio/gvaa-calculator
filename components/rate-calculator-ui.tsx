"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils"; // Import cn utility if you haven't already

// Define the main categories
const categories = [
  { 
  id: "digital_visual", 
  name: "Digital Visual", 
  subTypes: [
    "Non-Paid Web (Owned Social or Client Site)",
    "Paid Social",
    "Online Pre-Roll / OLV",
    "OTT/CTV (Includes Social & Pre-Roll)",
    "Digital Tags",
    "Automotive"
  ] 
},
  { 
  id: "radio", 
  name: "Radio", 
  subTypes: [
    "Local – Regional (Terrestrial)",
    "National (Terrestrial)",
    "Digital Radio",
    "Value Menu – Terrestrial + Digital (Local/Regional)",
    "Value Menu – Terrestrial + Digital (National)",
    "Automotive (Radio)",
    "Radio/Podcast Dramas",
    "PSA – Public Service Announcement"
  ] 
},
  { 
  id: "tv", 
  name: "TV", 
  subTypes: [
    "Local / Regional",
    "National",
    "TV + Digital Visual – Paid Social",
    "TV + Digital Visual – Online Pre-Roll (Includes Paid Social)",
    "TV + Digital Visual – OTT/CTV (Includes Pre-Roll & Paid Social)",
    "Automotive (TV)",
    "In-Show / Documentary Narration",
    "Infomercial / DRTV",
    "Mnemonics",
    "Point of Sale (POS)"
  ] 
},
  { 
  id: "non_broadcast", 
  name: "Non-Broadcast", 
  subTypes: [
    "Corporate & Industrial Narration – Finished Minute Scale",
    "Corporate & Industrial Narration – Recording Time Scale",
    "Explainer Videos",
    "Museum Tours – Educational",
    "Podcasts",
    "Medical / Technical Narration",
    "Digital Greeting Cards",
    "YouTube Content",
    "Kiosk Use (Non-Retail)",
    "Lobby Viewing",
    "Airport Announcements"
  ] 
},
  { 
  id: "elearning", 
  name: "E-Learning", 
  subTypes: [
    "Per Word",
    "Per Finished Minute",
    "Per Raw Hour",
    "Per Finished Hour",
    "Directed Sessions"
  ] 
},
  { 
  id: "animation_dubbing", 
  name: "Animation / Dubbing", 
  subTypes: [
    "Non-Union Original Animation – 22 Minute Episode",
    "Non-Union Original Animation – 11 Minute Episode or Less",
    "Dubbing (Film/TV/Animation)"
  ] 
},
  { 
  id: "video_games_toys", 
  name: "Video Games / Toys & Games", 
  subTypes: [
    "Video Games (Non-Union)",
    "Video Games (Union)",
    "Toys & Games",
    "Toys & Games (Demo/Scratch)",
    "Mobile Game Apps (Non-Union Character)",
    "Mobile Game Apps (Union Character)",
    "Mobile Game Apps (E-Learning/Educational)"
  ] 
},
  { 
  id: "promo_imaging", 
  name: "Promo & Imaging", 
  subTypes: [
    "TV",
    "Radio",
    "Trailers"
  ] 
},
  { 
  id: "audiobooks", 
  name: "Audiobooks", 
  subTypes: [
    "Union Scale – PFH",
    "Non-Union – PFH",
    "Per RAW Hour",
    "Production Add-On",
    "Hybrid Agreement"
  ] 
},
  { 
  id: "ivr_message_on_hold", 
  name: "IVR / Message-on-Hold", 
  subTypes: [
    "Direct Quote",
    "Roster Talent"
  ] 
},
  { 
  id: "cinema_events", 
  name: "Cinema / Events", 
  subTypes: [
    "Cinema Usage – Term (1–3 States)",
    "Cinema Usage – Term (4+ States)",
    "Event Video",
    "Trade Shows / Sporting Events"
  ] 
},
  { 
  id: "fees_pickups_editing", 
  name: "Fees / Pick-Ups / Editing", 
  subTypes: [
    "Studio Fees & Editing",
    "Pickups"
  ] 
},
];
const nonPaidWebRates = {
  "3 Months": "$300–$500",
  "1 Year": "$500–$700",
  "3 Years": "$900–$1,100",
  "5 Years": "$1,300–$1,500",
};
const paidSocialRates = {
  "1 Month": "$300–$450",
  "3 Months": "$400–$750",
  "1 Year": "$1,000–$1,500",
};
const onlinePreRollRates = {
  "1 Month": "$650–$800",
  "3 Months": "$750–$1,100",
  "1 Year": "$2,250–$3,000",
};
const ottRates = {
  "1 Month": "$1,250–$1,750",
  "3 Months": "$1,500–$2,250",
  "1 Year": "$4,000–$6,000",
};
const automotiveRates = {
  "Tier 1": "Union Rate",
  "Tier 2": [75, 200],
  "Tier 3 (:30/:60)": [150, 200],
  "Tier 3 (:15/:10/:6)": [75, 100],
};

export function RateCalculatorUI() {
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubType, setSelectedSubType] = useState<string | null>(null);
  const [calculatedRate, setCalculatedRate] = useState<string | null>(null);
  const [numberOfTags, setNumberOfTags] = useState<number>(1);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [numberOfSpots, setNumberOfSpots] = useState<number>(1);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubType(null); // Reset subtype when category changes
  };
  const handleSubTypeSelect = (subType: string) => {
  setSelectedSubType(subType);
  const handleTierSelect = (tier: string) => {
  setSelectedTier(tier);
  setNumberOfSpots(1);
  };

  // Reset all form inputs
  setSelectedTerm(null); 
  setNumberOfTags(1);
  setSelectedTier(null);
  setNumberOfSpots(1);
  setCalculatedRate(null);
  // We will add more resets here as we add more forms
};

  const currentCategory = categories.find(cat => cat.id === selectedCategory);
useEffect(() => {
  // Calculator for: Digital Visual -> Non-Paid Web
  if (selectedSubType === "Non-Paid Web (Owned Social or Client Site)" && selectedTerm) {
    const rate = nonPaidWebRates[selectedTerm as keyof typeof nonPaidWebRates];
    setCalculatedRate(rate || null);
  } 
  // Calculator for: Digital Visual -> Paid Social
  else if (selectedSubType === "Paid Social" && selectedTerm) {
    const rate = paidSocialRates[selectedTerm as keyof typeof paidSocialRates];
    setCalculatedRate(rate || null);
  }
  // Calculator for: Digital Visual -> Online Pre-Roll
  else if (selectedSubType === "Online Pre-Roll / OLV" && selectedTerm) {
    const rate = onlinePreRollRates[selectedTerm as keyof typeof onlinePreRollRates];
    setCalculatedRate(rate || null);
  }
  // Calculator for: Digital Visual -> OTT/CTV
  else if (selectedSubType === "OTT/CTV (Includes Social & Pre-Roll)" && selectedTerm) {
    const rate = ottRates[selectedTerm as keyof typeof ottRates];
    setCalculatedRate(rate || null);
  }
  // Calculator for: Digital Visual -> Digital Tags
  else if (selectedSubType === "Digital Tags") {
    const lowRate = 175 * numberOfTags;
    const highRate = 225 * numberOfTags;
    setCalculatedRate(`$${lowRate}–$${highRate}`);
  }
  // Calculator for: Digital Visual -> Automotive
  else if (selectedSubType === "Automotive" && selectedTier) {
    const rates = automotiveRates[selectedTier as keyof typeof automotiveRates];
    if (typeof rates === 'string') { // "Union Rate"
      setCalculatedRate(rates);
    } else if (Array.isArray(rates)) { // Tier 2 or 3
      const lowRate = rates[0] * numberOfSpots;
      const highRate = rates[1] * numberOfSpots;
      setCalculatedRate(`$${lowRate}–$${highRate}`);
    }
  }
  // Reset rate if sub-type or term changes
  else {
    setCalculatedRate(null);
  }
}, [selectedSubType, selectedTerm, numberOfTags, selectedTier, numberOfSpots]);

  return (
    <div className="flex justify-center items-start min-h-screen bg-slate-50 dark:bg-slate-900 p-4 pt-10">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Select Voice Over Genre
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {/* --- Category Card Selection --- */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={cn(
                    "p-4 border rounded-lg text-center cursor-pointer transition-all duration-150 ease-in-out",
                    "hover:border-blue-500 hover:shadow-md",
                    selectedCategory === category.id
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-500"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  )}
                >
                  <span className="font-medium text-slate-800 dark:text-slate-100">{category.name}</span>
                </button>
              ))}
            </div>

            {/* --- Conditional SubType Radio Buttons --- */}
            {currentCategory && currentCategory.subTypes && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <Label className="text-base font-medium mb-3 block">Select Sub-Type for {currentCategory.name}:</Label>
                <RadioGroup
                  value={selectedSubType ?? ""}
                  onValueChange={handleSubTypeSelect}
                  className="grid gap-2"
                >
                  {currentCategory.subTypes.map((subType) => (
                    <div key={subType} className="flex items-center space-x-2 p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
                      <RadioGroupItem value={subType} id={subType} />
                      <Label htmlFor={subType} className="cursor-pointer flex-1">{subType}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* --- Dynamic Input Fields --- */}
            {selectedSubType && (
              <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-700">
                
                {/* --- Form for: Digital Visual -> Non-Paid Web --- */}
                {selectedSubType === "Non-Paid Web (Owned Social or Client Site)" && (
                  <div className="grid gap-4">
                    <Label className="text-base font-medium">Select Term:</Label>
                    <RadioGroup
                      value={selectedTerm ?? ""}
                      onValueChange={setSelectedTerm}
                      className="grid gap-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="3 Months" id="term-3m" />
                        <Label htmlFor="term-3m" className="cursor-pointer">3 Months</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1 Year" id="term-1y" />
                        <Label htmlFor="term-1y" className="cursor-pointer">1 Year</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="3 Years" id="term-3y" />
                        <Label htmlFor="term-3y" className="cursor-pointer">3 Years</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="5 Years" id="term-5y" />
                        <Label htmlFor="term-5y" className="cursor-pointer">5 Years</Label>
                      </div>
                    </RadioGroup>
                    {/* --- Rate Display --- */}
{calculatedRate && (
  <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg text-center">
    <p className="text-sm text-slate-600 dark:text-slate-400">GVAA Rate Range:</p>
    <p className="text-2xl font-semibold text-green-700 dark:text-green-300">
      {calculatedRate}
    </p>
  </div>
)}
                  </div>
                )}

                {/* --- Form for: Digital Visual -> Paid Social --- */}
{selectedSubType === "Paid Social" && (
  <div className="grid gap-4">
    <Label className="text-base font-medium">Select Term:</Label>
    <RadioGroup
      value={selectedTerm ?? ""}
      onValueChange={setSelectedTerm}
      className="grid gap-2"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="1 Month" id="term-1m-ps" />
        <Label htmlFor="term-1m-ps" className="cursor-pointer">1 Month</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="3 Months" id="term-3m-ps" />
        <Label htmlFor="term-3m-ps" className="cursor-pointer">3 Months</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="1 Year" id="term-1y-ps" />
        <Label htmlFor="term-1y-ps" className="cursor-pointer">1 Year</Label>
      </div>
    </RadioGroup>
    
    {/* --- Rate Display --- */}
    {calculatedRate && (
      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">GVAA Rate Range:</p>
        <p className="text-2xl font-semibold text-green-700 dark:text-green-300">
          {calculatedRate}
        </p>
      </div>
    )}
  </div>
)}
{/* --- Form for: Digital Visual -> Online Pre-Roll / OLV --- */}
{selectedSubType === "Online Pre-Roll / OLV" && (
  <div className="grid gap-4">
    <Label className="text-base font-medium">Select Term:</Label>
    <RadioGroup
      value={selectedTerm ?? ""}
      onValueChange={setSelectedTerm}
      className="grid gap-2"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="1 Month" id="term-1m-olv" />
        <Label htmlFor="term-1m-olv" className="cursor-pointer">1 Month</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="3 Months" id="term-3m-olv" />
        <Label htmlFor="term-3m-olv" className="cursor-pointer">3 Months</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="1 Year" id="term-1y-olv" />
        <Label htmlFor="term-1y-olv" className="cursor-pointer">1 Year</Label>
      </div>
    </RadioGroup>
    
    {/* --- Rate Display --- */}
    {calculatedRate && (
      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">GVAA Rate Range:</p>
        <p className="text-2xl font-semibold text-green-700 dark:text-green-300">
          {calculatedRate}
        </p>
      </div>
    )}
  </div>
)}
                {/* --- Form for: Digital Visual -> OTT/CTV --- */}
{selectedSubType === "OTT/CTV (Includes Social & Pre-Roll)" && (
  <div className="grid gap-4">
    <Label className="text-base font-medium">Select Term:</Label>
    <RadioGroup
      value={selectedTerm ?? ""}
      onValueChange={setSelectedTerm}
      className="grid gap-2"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="1 Month" id="term-1m-ott" />
        <Label htmlFor="term-1m-ott" className="cursor-pointer">1 Month</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="3 Months" id="term-3m-ott" />
        <Label htmlFor="term-3m-ott" className="cursor-pointer">3 Months</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="1 Year" id="term-1y-ott" />
        <Label htmlFor="term-1y-ott" className="cursor-pointer">1 Year</Label>
      </div>
    </RadioGroup>

    {/* --- Rate Display --- */}
    {calculatedRate && (
      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">GVAA Rate Range:</p>
        <p className="text-2xl font-semibold text-green-700 dark:text-green-300">
          {calculatedRate}
        </p>
      </div>
    )}
  </div>
)}
                {/* --- Form for: Digital Visual -> Digital Tags --- */}
{selectedSubType === "Digital Tags" && (
  <div className="grid gap-4">
    <Label htmlFor="tags-number" className="text-base font-medium">Number of Tags:</Label>
    <Input
      id="tags-number"
      type="number"
      value={numberOfTags}
      onChange={(e) => setNumberOfTags(Number(e.target.value) || 1)}
      min="1"
      className="max-w-[150px]"
    />

    {/* --- Rate Display --- */}
    {calculatedRate && (
      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">GVAA Rate Range:</p>
        <p className="text-2xl font-semibold text-green-700 dark:text-green-300">
          {calculatedRate}
        </p>
      </div>
    )}
  </div>
)}
                {/* --- Form for: Digital Visual -> Automotive --- */}
{selectedSubType === "Automotive" && (
  <div className="grid gap-6">
    {/* Tier Selection */}
    <div className="grid gap-4">
      <Label className="text-base font-medium">Select Tier:</Label>
      <RadioGroup
        value={selectedTier ?? ""}
        onValueChange={handleTierSelect}
        className="grid gap-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Tier 1" id="tier-1" />
          <Label htmlFor="tier-1" className="cursor-pointer">Tier 1 – National Brand Spots</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Tier 2" id="tier-2" />
          <Label htmlFor="tier-2" className="cursor-pointer">Tier 2 – Regional Tags</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Tier 3 (:30/:60)" id="tier-3-30" />
          <Label htmlFor="tier-3-30" className="cursor-pointer">Tier 3 – Local Dealer :30/:60</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Tier 3 (:15/:10/:6)" id="tier-3-15" />
          <Label htmlFor="tier-3-15" className="cursor-pointer">Tier 3 – Local Dealer :15/:10/:6</Label>
        </div>
      </RadioGroup>
    </div>

    {/* Number of Spots Input (Conditional) */}
    {selectedTier && selectedTier !== "Tier 1" && (
      <div className="grid gap-4">
        <Label htmlFor="spots-number" className="text-base font-medium">Number of Spots:</Label>
        <Input
          id="spots-number"
          type="number"
          value={numberOfSpots}
          onChange={(e) => setNumberOfSpots(Number(e.target.value) || 1)}
          min="1"
          className="max-w-[150px]"
        />
      </div>
    )}

    {/* --- Rate Display --- */}
    {calculatedRate && (
      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">GVAA Rate Range:</p>
        <p className="text-2xl font-semibold text-green-700 dark:text-green-300">
          {calculatedRate}
        </p>
      </div>
    )}
  </div>
)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
