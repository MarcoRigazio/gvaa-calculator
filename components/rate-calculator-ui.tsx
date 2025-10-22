"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
    "OTT/CTV",
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
  { id: "animation_dubbing", name: "Animation / Dubbing", subTypes: [] },
  { 
    id: "video_games_toys", 
    name: "Video Games / Toys & Games", 
    subTypes: ["Indie", "AAA Game"] // Kept your old sub-types, you can adjust
  },
  { id: "promo_imaging", name: "Promo & Imaging", subTypes: [] },
  { 
    id: "audiobooks", 
    name: "Audiobooks", 
    subTypes: ["Fiction", "Non-Fiction"] // Kept your old sub-types
  },
  { 
    id: "ivr_message_on_hold", 
    name: "IVR / Message-on-Hold", 
    subTypes: ["Example"] // Kept your old sub-types
  },
  { id: "cinema_events", name: "Cinema / Events", subTypes: [] },
  { id: "fees_pickups_editing", name: "Fees / Pick-Ups / Editing", subTypes: [] },
];

export function RateCalculatorUI() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubType, setSelectedSubType] = useState<string | null>(null);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubType(null); // Reset subtype when category changes
  };

  const currentCategory = categories.find(cat => cat.id === selectedCategory);

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
                  onValueChange={setSelectedSubType}
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

            {/* --- Placeholder for Input Fields --- */}
            {selectedCategory && (
              <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
                <p className="text-slate-600 dark:text-slate-400">
                  Input fields for{" "}
                  <span className="font-semibold">{selectedSubType ? selectedSubType : currentCategory?.name}</span>
                  {" "}will appear here.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
