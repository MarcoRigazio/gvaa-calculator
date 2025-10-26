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
const radioLocalRates = {
  "1 Month": "$275–$400",
  "3 Months": "$350–$600",
  "1 Year": "$900–$1,500",
};
const radioNationalRates = {
  "1 Month": "$550–$700",
  "3D Months": "$750–$1,000",
  "1 Year": "$1,500–$2,500",
};
const radioDigitalRates = {
  "1 Month": "$550–$700",
  "3 Months": "$750–$1,000",
  "1 Year": "$1,750–$2,500",
};
const radioValueLocalRates = {
  "1 Month": "$400–$600",
  "3 Months": "$500–$900",
  "1 Year": "$1,250–$2,250",
};
const radioValueNationalRates = {
  "1 Month": "$800–$1,000",
  "3 Months": "$1,250–$1,500",
  "1 Year": "$2,500–$3,250",
};
const radioDramaRates = {
  "Principal Actors": "$800–$1,000 (up to 4 hrs)",
  "Non-Principal Actors": "$400–$500 (up to 4 hrs)",
};
const tvLocalRates = {
  "1 Month": "$400–$750",
  "3 Months": "$650–$1,000",
  "1 Year": "$1,250–$2,250",
};
const tvNationalRates = {
  "1 Month": "$1,000–$1,500",
  "3 Months": "$1,750–$2,500",
  "1 Year": "$4,000–$8,000",
};
const tvPaidSocialRates = {
  "1 Month": "$525–$850 / $975–$1,465",
  "3 Months": "$780–$1,300 / $1,610–$2,440",
  "1 Year": "$1,680–$2,800 / $3,750–$7,125",
};
const tvOnlinePreRollRates = {
  "1 Month": "$790–$1,170 / $1,240–$1,725",
  "3 Months": "$1,050–$1,575 / $1,875–$2,700",
  "1 Year": "$2,625–$3,940 / $4,700–$8,250",
};
const tvOttRates = {
  "1 Month": "$1,240–$1,875 / $1,690–$2,440",
  "3 Months": "$1,615–$2,440 / $2,440–$3,565",
  "1 Year": "$3,940–$6,190 / $6,000–$10,500",
};
const inShowNarrationRates = {
  "24 Minutes": "$1,000–$1,500",
  "48 Minutes": "$2,000–$3,000",
};
const infomercialRates = {
  "National – 1 Year": "$1,750 (up to 2 hr session)",
  "North America (US & Canada) – 1 Year": "$2,500 (up to 2 hr session)",
};
const corporateMinuteRates = {
  "1–2 min": "$350–$450",
  "3–5 min": "$450–$550",
  "5–10 min": "$600–$700",
  "10–15 min": "$700–$800",
  "15–20 min": "$800–$950",
  "20–30 min": "$950–$1,250",
  "30–40 min": "$1,250–$1,750",
  "40–60 min": "$1,750–$2,350",
};
const museumCat1Rate = { firstHour: 505, additionalHalfHour: 148 };
const museumCat2Rate = { firstHour: 563, additionalHalfHour: 148 };
const podcastRates = {
  "Audio Drama – Non-Principal": "$400–$500 (up to 4 hrs)",
  "Audio Drama – Principal": "$800–$1,000 (up to 4 hrs)",
  "Intro/Outro": "$300–$400",
};
const medicalMinuteRates = {
  "1–2 min": "$400–$500",
  "3–5 min": "$600–$700",
  "5–10 min": "$700–$800",
  "10–15 min": "$800–$900",
  "15–20 min": "$900–$1,000",
  "20–30 min": "$1,000–$1,400",
  "30–40 min": "$1,400–$1,900",
  "40–60 min": "$1,900–$2,400",
};
const medicalPerWordRateLow = 0.25; // $0.25/word average
const medicalPerWordRateHigh = 0.50; // $0.50/word technical

export function RateCalculatorUI() {
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubType, setSelectedSubType] = useState<string | null>(null);
  const [calculatedRate, setCalculatedRate] = useState<string | null>(null);
  const [numberOfTags, setNumberOfTags] = useState<number>(1);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [numberOfSpots, setNumberOfSpots] = useState<number>(1);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<string | null>(null);
  const [selectedProgramLength, setSelectedProgramLength] = useState<string | null>(null);
  const [selectedInfomercialMarket, setSelectedInfomercialMarket] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [numberOfHours, setNumberOfHours] = useState<number>(1);
  const [selectedMuseumCategory, setSelectedMuseumCategory] = useState<string | null>(null);
  const [museumRecordingHours, setMuseumRecordingHours] = useState<number>(1); // Default to 1 hour
  const [selectedPodcastType, setSelectedPodcastType] = useState<string | null>(null);
  const [medTechCalcMethod, setMedTechCalcMethod] = useState<string | null>(null); // 'minute' or 'word'
  const [wordCount, setWordCount] = useState<number>(0); // Default to 0 words
  const [explainerCalcMethod, setExplainerCalcMethod] = useState<string | null>(null); // 'single' or 'bulk'

  // --- THIS IS THE MISSING FUNCTION ---
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubType(null); // Reset subtype when category changes
  };

  const handleSubTypeSelect = (subType: string) => {
  setSelectedSubType(subType);

  // Reset ALL form inputs used across different sub-types
  setSelectedTerm(null); 
  setNumberOfTags(1);
  setSelectedTier(null);
  setNumberOfSpots(1);   
  setSelectedRole(null); 
  setSelectedMarket(null); 
  setSelectedProgramLength(null); 
  setSelectedInfomercialMarket(null); 
  setSelectedDuration(null); // Used by Corp Minute & Med/Tech Minute
  setNumberOfHours(1); // Used by Corp Time
  setSelectedMuseumCategory(null);
  setMuseumRecordingHours(1);      
  setSelectedPodcastType(null);
  setMedTechCalcMethod(null); // <-- ADDED
  setWordCount(0);            // <-- ADDED
  setExplainerCalcMethod(null); // <-- CORRECTED (Was Step 1)
  setCalculatedRate(null);
  // Add future state resets here
};
  const handleTierSelect = (tier: string) => {
    setSelectedTier(tier);
    setNumberOfSpots(1);
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
    if (typeof rates === 'string') { setCalculatedRate(rates); }
    else if (Array.isArray(rates)) {
      const lowRate = rates[0] * numberOfSpots; const highRate = rates[1] * numberOfSpots;
      setCalculatedRate(`$${lowRate}–$${highRate}`);
    }
  }
  // Calculator for: Radio -> Local - Regional
  else if (selectedSubType === "Local – Regional (Terrestrial)" && selectedTerm) {
    const rate = radioLocalRates[selectedTerm as keyof typeof radioLocalRates];
    setCalculatedRate(rate || null);
  }
  // Calculator for: Radio -> National (Terrestrial)
  else if (selectedSubType === "National (Terrestrial)" && selectedTerm) {
    const rate = radioNationalRates[selectedTerm as keyof typeof radioNationalRates];
    setCalculatedRate(rate || null);
  }
  // Calculator for: Radio -> Digital Radio
  else if (selectedSubType === "Digital Radio" && selectedTerm) {
    const rate = radioDigitalRates[selectedTerm as keyof typeof radioDigitalRates];
    setCalculatedRate(rate || null);
  }
  // Calculator for: Radio -> Value Menu (Local)
  else if (selectedSubType === "Value Menu – Terrestrial + Digital (Local/Regional)" && selectedTerm) {
    const rate = radioValueLocalRates[selectedTerm as keyof typeof radioValueLocalRates];
    setCalculatedRate(rate || null);
  }
  // Calculator for: Radio -> Value Menu (National)
  else if (selectedSubType === "Value Menu – Terrestrial + Digital (National)" && selectedTerm) {
    const rate = radioValueNationalRates[selectedTerm as keyof typeof radioValueNationalRates];
    setCalculatedRate(rate || null);
  }
  // Calculator for: Radio -> Automotive (Radio)
  else if (selectedSubType === "Automotive (Radio)" && selectedTier) {
     const rates = automotiveRates[selectedTier as keyof typeof automotiveRates];
     if (typeof rates === 'string') { setCalculatedRate(rates); }
     else if (Array.isArray(rates)) {
       const lowRate = rates[0] * numberOfSpots; const highRate = rates[1] * numberOfSpots;
       setCalculatedRate(`$${lowRate}–$${highRate}`);
     }
   }
   // Calculator for: Radio -> Radio/Podcast Dramas
   else if (selectedSubType === "Radio/Podcast Dramas" && selectedRole) {
     const rate = radioDramaRates[selectedRole as keyof typeof radioDramaRates];
     setCalculatedRate(rate || null);
   }
   // Calculator for: Radio -> PSA
   else if (selectedSubType === "PSA – Public Service Announcement") {
     setCalculatedRate("$500–$600+ (:60 or less)");
   }
   // Calculator for: TV -> Local / Regional
   else if (selectedSubType === "Local / Regional" && selectedTerm) {
      const rate = tvLocalRates[selectedTerm as keyof typeof tvLocalRates];
      setCalculatedRate(rate || null);
   }
    // Calculator for: TV -> National
   else if (selectedSubType === "National" && selectedTerm) {
     const rate = tvNationalRates[selectedTerm as keyof typeof tvNationalRates];
     setCalculatedRate(rate || null);
   }
   // Calculator for: TV -> TV + Digital Visual – Paid Social
   else if (selectedSubType === "TV + Digital Visual – Paid Social" && selectedTerm && selectedMarket) {
     const combinedRate = tvPaidSocialRates[selectedTerm as keyof typeof tvPaidSocialRates];
     if (combinedRate) {
       const rateParts = combinedRate.split(' / ');
       const finalRate = selectedMarket === 'Local/Regional' ? (rateParts.length > 0 ? rateParts[0] : null) : (rateParts.length > 1 ? rateParts[1] : null) ;
       setCalculatedRate(finalRate || null);
     } else { setCalculatedRate(null); }
   }
   // Calculator for: TV -> TV + Digital Visual – Online Pre-Roll
   else if (selectedSubType === "TV + Digital Visual – Online Pre-Roll (Includes Paid Social)" && selectedTerm && selectedMarket) {
     const combinedRate = tvOnlinePreRollRates[selectedTerm as keyof typeof tvOnlinePreRollRates];
     if (combinedRate) {
       const rateParts = combinedRate.split(' / ');
       const finalRate = selectedMarket === 'Local/Regional' ? (rateParts.length > 0 ? rateParts[0] : null) : (rateParts.length > 1 ? rateParts[1] : null) ;
       setCalculatedRate(finalRate || null);
     } else { setCalculatedRate(null); }
   }
   // Calculator for: TV -> TV + Digital Visual – OTT/CTV
   else if (selectedSubType === "TV + Digital Visual – OTT/CTV (Includes Pre-Roll & Paid Social)" && selectedTerm && selectedMarket) {
     const combinedRate = tvOttRates[selectedTerm as keyof typeof tvOttRates];
     if (combinedRate) {
       const rateParts = combinedRate.split(' / ');
       const finalRate = selectedMarket === 'Local/Regional' ? (rateParts.length > 0 ? rateParts[0] : null) : (rateParts.length > 1 ? rateParts[1] : null) ;
       setCalculatedRate(finalRate || null);
     } else { setCalculatedRate(null); }
   }
   // Calculator for: TV -> Automotive (TV)
   else if (selectedSubType === "Automotive (TV)" && selectedTier) {
      const rates = automotiveRates[selectedTier as keyof typeof automotiveRates];
      if (typeof rates === 'string') { setCalculatedRate(rates); }
      else if (Array.isArray(rates)) {
        const lowRate = rates[0] * numberOfSpots; const highRate = rates[1] * numberOfSpots;
        setCalculatedRate(`$${lowRate}–$${highRate}`);
      }
    }
    // Calculator for: TV -> In-Show / Documentary Narration
    else if (selectedSubType === "In-Show / Documentary Narration" && selectedProgramLength) {
       const rate = inShowNarrationRates[selectedProgramLength as keyof typeof inShowNarrationRates];
       setCalculatedRate(rate || null);
    }
    // Calculator for: TV -> Infomercial / DRTV
    else if (selectedSubType === "Infomercial / DRTV" && selectedInfomercialMarket) {
      const rate = infomercialRates[selectedInfomercialMarket as keyof typeof infomercialRates];
      setCalculatedRate(rate || null);
    }
    // Calculator for: TV -> Mnemonics (Informational)
    else if (selectedSubType === "Mnemonics") {
      setCalculatedRate("Varies Greatly ($1k–$50k+). Quote based on brand scope/usage.");
    }
    // Calculator for: TV -> Point of Sale (POS) (Informational)
    else if (selectedSubType === "Point of Sale (POS)") {
       setCalculatedRate("Refer to TV Local/Regional or National rates based on scope.");
    }
   // Calculator for: Non-Broadcast -> Corporate Minute Scale
   else if (selectedSubType === "Corporate & Industrial Narration – Finished Minute Scale" && selectedDuration) {
     const rate = corporateMinuteRates[selectedDuration as keyof typeof corporateMinuteRates];
     setCalculatedRate(rate || null);
   }
   // Calculator for: Non-Broadcast -> Corporate Recording Time Scale
   else if (selectedSubType === "Corporate & Industrial Narration – Recording Time Scale") {
     if (numberOfHours > 0) {
       const firstHourRate = 525;
       const additionalHourRate = 262;
       const totalRate = numberOfHours === 1 ? firstHourRate : firstHourRate + (additionalHourRate * (numberOfHours - 1));
       const formattedRate = `$${totalRate.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
       setCalculatedRate(formattedRate);
     } else {
       setCalculatedRate(null);
     }
   }
   // Calculator for: Non-Broadcast -> Explainer Videos
   else if (selectedSubType === "Explainer Videos") {
     if (explainerCalcMethod === 'single') {
       setCalculatedRate("$300–$525"); // The single video rate
     } else if (explainerCalcMethod === 'bulk' && wordCount > 0) {
       const baseRate = 250; //
       if (wordCount <= 175) {
         setCalculatedRate(`$${baseRate}`);
       } else {
         const additionalWords = wordCount - 175;
         const additionalBlocks = Math.ceil(additionalWords / 100);
         const additionalCharge = additionalBlocks * 50; //
         const totalRate = baseRate + additionalCharge;
         const formattedRate = `$${totalRate.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
         setCalculatedRate(formattedRate);
       }
     } else {
       setCalculatedRate(null); // Reset if no method or 0 words in bulk
     }
   }
   // Calculator for: Non-Broadcast -> Museum Tours
   else if (selectedSubType === "Museum Tours – Educational" && selectedMuseumCategory && museumRecordingHours > 0) {
       const rates = selectedMuseumCategory === "CAT1" ? museumCat1Rate : museumCat2Rate;
       let totalRate = rates.firstHour;
       if (museumRecordingHours > 1) {
         const additionalHalfHours = Math.ceil((museumRecordingHours - 1) * 2);
         totalRate += additionalHalfHours * rates.additionalHalfHour;
       }
       const formattedRate = `$${totalRate.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
       setCalculatedRate(formattedRate);
   }
   // Calculator for: Non-Broadcast -> Podcasts
   else if (selectedSubType === "Podcasts" && selectedPodcastType) {
       const rate = podcastRates[selectedPodcastType as keyof typeof podcastRates];
       setCalculatedRate(rate || null);
   }
   // Calculator for: Non-Broadcast -> Medical / Technical Narration
   else if (selectedSubType === "Medical / Technical Narration") {
     if (medTechCalcMethod === 'minute' && selectedDuration) {
       // Calculate by minute
       const rate = medicalMinuteRates[selectedDuration as keyof typeof medicalMinuteRates];
       setCalculatedRate(rate || null);
     } else if (medTechCalcMethod === 'word' && wordCount > 0) {
       // Calculate by word count
       const lowTotal = wordCount * medicalPerWordRateLow;
       const highTotal = wordCount * medicalPerWordRateHigh;
       const formattedLow = lowTotal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
       const formattedHigh = highTotal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
       setCalculatedRate(`$${formattedLow}–$${formattedHigh}`);
     } else {
       // If method isn't selected or valid input not provided, reset rate
       setCalculatedRate(null);
     }
   }
   // Calculator for: Non-Broadcast -> Digital Greeting Cards
   else if (selectedSubType === "Digital Greeting Cards") {
     setCalculatedRate("$750–$1,000");
   }
  // Reset rate if sub-type or term changes, or if required inputs for a calculation are missing
  else {
    setCalculatedRate(null);
  }
}, [selectedSubType, selectedTerm, numberOfTags, selectedTier, numberOfSpots, selectedRole, selectedMarket, selectedProgramLength, selectedInfomercialMarket, selectedDuration, numberOfHours, selectedMuseumCategory, museumRecordingHours, selectedPodcastType, medTechCalcMethod, wordCount, explainerCalcMethod]); // Added explainerCalcMethod to dependency array
, selectedMuseumCategory, museumRecordingHours, selectedPodcastType, medTechCalcMethod, wordCount, explainerCalcMethod]); // Added explainerCalcMethod to dependency array
  
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
                {/* --- Form for: Radio -> Local – Regional (Terrestrial) --- */}
{selectedSubType === "Local – Regional (Terrestrial)" && (
  <div className="grid gap-4">
    <Label className="text-base font-medium">Select Term:</Label>
    <RadioGroup
      value={selectedTerm ?? ""}
      onValueChange={setSelectedTerm}
      className="grid gap-2"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="1 Month" id="term-1m-rl" />
        <Label htmlFor="term-1m-rl" className="cursor-pointer">1 Month</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="3 Months" id="term-3m-rl" />
        <Label htmlFor="term-3m-rl" className="cursor-pointer">3 Months</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="1 Year" id="term-1y-rl" />
        <Label htmlFor="term-1y-rl" className="cursor-pointer">1 Year</Label>
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
                {/* --- Form for: Radio -> National (Terrestrial) --- */}
{selectedSubType === "National (Terrestrial)" && (
  <div className="grid gap-4">
    <Label className="text-base font-medium">Select Term:</Label>
    <RadioGroup
      value={selectedTerm ?? ""}
      onValueChange={setSelectedTerm}
      className="grid gap-2"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="1 Month" id="term-1m-rn" />
        <Label htmlFor="term-1m-rn" className="cursor-pointer">1 Month</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="3 Months" id="term-3m-rn" />
        <Label htmlFor="term-3m-rn" className="cursor-pointer">3 Months</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="1 Year" id="term-1y-rn" />
        <Label htmlFor="term-1y-rn" className="cursor-pointer">1 Year</Label>
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
                {/* --- Form for: Radio -> Digital Radio --- */}
{selectedSubType === "Digital Radio" && (
  <div className="grid gap-4">
    <Label className="text-base font-medium">Select Term:</Label>
    <RadioGroup
      value={selectedTerm ?? ""}
      onValueChange={setSelectedTerm}
      className="grid gap-2"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="1 Month" id="term-1m-rd" />
        <Label htmlFor="term-1m-rd" className="cursor-pointer">1 Month</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="3 Months" id="term-3m-rd" />
        <Label htmlFor="term-3m-rd" className="cursor-pointer">3 Months</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="1 Year" id="term-1y-rd" />
        <Label htmlFor="term-1y-rd" className="cursor-pointer">1 Year</Label>
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
                {/* --- Form for: Radio -> Value Menu – Terrestrial + Digital (Local/Regional) --- */}
{selectedSubType === "Value Menu – Terrestrial + Digital (Local/Regional)" && (
  <div className="grid gap-4">
    <Label className="text-base font-medium">Select Term:</Label>
    <RadioGroup
      value={selectedTerm ?? ""}
      onValueChange={setSelectedTerm}
      className="grid gap-2"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="1 Month" id="term-1m-rvl" />
        <Label htmlFor="term-1m-rvl" className="cursor-pointer">1 Month</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="3 Months" id="term-3m-rvl" />
        <Label htmlFor="term-3m-rvl" className="cursor-pointer">3 Months</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="1 Year" id="term-1y-rvl" />
        <Label htmlFor="term-1y-rvl" className="cursor-pointer">1 Year</Label>
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
                {/* --- Form for: Radio -> Value Menu – Terrestrial + Digital (National) --- */}
{selectedSubType === "Value Menu – Terrestrial + Digital (National)" && (
  <div className="grid gap-4">
    <Label className="text-base font-medium">Select Term:</Label>
    <RadioGroup
      value={selectedTerm ?? ""}
      onValueChange={setSelectedTerm}
      className="grid gap-2"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="1 Month" id="term-1m-rvn" />
        <Label htmlFor="term-1m-rvn" className="cursor-pointer">1 Month</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="3 Months" id="term-3m-rvn" />
        <Label htmlFor="term-3m-rvn" className="cursor-pointer">3 Months</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="1 Year" id="term-1y-rvn" />
        <Label htmlFor="term-1y-rvn" className="cursor-pointer">1 Year</Label>
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
               {/* --- Form for: Radio -> Automotive (Radio) --- */}
{selectedSubType === "Automotive (Radio)" && (
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
          <RadioGroupItem value="Tier 1" id="tier-1-radio" /> {/* Changed ID */}
          <Label htmlFor="tier-1-radio" className="cursor-pointer">Tier 1 – National Brand Spots</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Tier 2" id="tier-2-radio" /> {/* Changed ID */}
          <Label htmlFor="tier-2-radio" className="cursor-pointer">Tier 2 – Regional Tags</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Tier 3 (:30/:60)" id="tier-3-30-radio" /> {/* Changed ID */}
          <Label htmlFor="tier-3-30-radio" className="cursor-pointer">Tier 3 – Local Dealer :30/:60</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Tier 3 (:15/:10/:6)" id="tier-3-15-radio" /> {/* Changed ID */}
          <Label htmlFor="tier-3-15-radio" className="cursor-pointer">Tier 3 – Local Dealer :15/:10/:6</Label>
        </div>
      </RadioGroup>
    </div>

    {/* Number of Spots Input (Conditional) */}
    {selectedTier && selectedTier !== "Tier 1" && (
      <div className="grid gap-4">
        <Label htmlFor="spots-number-radio" className="text-base font-medium">Number of Spots:</Label> 
        <Input
          id="spots-number-radio" 
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
                {/* --- Form for: Radio -> Radio/Podcast Dramas --- */}
{selectedSubType === "Radio/Podcast Dramas" && (
  <div className="grid gap-4">
    <Label className="text-base font-medium">Select Role:</Label>
    <RadioGroup
      value={selectedRole ?? ""}
      onValueChange={setSelectedRole} // Simple state update, no reset needed here
      className="grid gap-2"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="Principal Actors" id="role-principal" />
        <Label htmlFor="role-principal" className="cursor-pointer">Principal Actors</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="Non-Principal Actors" id="role-non-principal" />
        <Label htmlFor="role-non-principal" className="cursor-pointer">Non-Principal Actors</Label>
      </div>
    </RadioGroup>

    {/* --- Rate Display --- */}
    {calculatedRate && (
      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">GVAA Rate Range:</p>
        <p className="text-2xl font-semibold text-green-700 dark:text-green-300">
          {calculatedRate}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">(up to 4 hours)</p>
      </div>
    )}
  </div>
)}
                {/* --- Form for: Radio -> PSA – Public Service Announcement --- */}
{selectedSubType === "PSA – Public Service Announcement" && (
  <div className="grid gap-4">
    {/* No inputs needed for PSA, rate is fixed */}

    {/* --- Rate Display --- */}
    {calculatedRate && (
      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">GVAA Rate Range:</p>
        <p className="text-2xl font-semibold text-green-700 dark:text-green-300">
          {calculatedRate}
        </p>
         <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">(:60 or less)</p>
      </div>
    )}
  </div>
)}
                {/* --- Form for: TV -> Local / Regional --- */}
{selectedSubType === "Local / Regional" && (
  <div className="grid gap-4">
    <Label className="text-base font-medium">Select Term:</Label>
    <RadioGroup
      value={selectedTerm ?? ""}
      onValueChange={setSelectedTerm}
      className="grid gap-2"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="1 Month" id="term-1m-tvl" />
        <Label htmlFor="term-1m-tvl" className="cursor-pointer">1 Month</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="3 Months" id="term-3m-tvl" />
        <Label htmlFor="term-3m-tvl" className="cursor-pointer">3 Months</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="1 Year" id="term-1y-tvl" />
        <Label htmlFor="term-1y-tvl" className="cursor-pointer">1 Year</Label>
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
                {/* --- Form for: TV -> National --- */}
{selectedSubType === "National" && (
  <div className="grid gap-4">
    <Label className="text-base font-medium">Select Term:</Label>
    <RadioGroup
      value={selectedTerm ?? ""}
      onValueChange={setSelectedTerm}
      className="grid gap-2"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="1 Month" id="term-1m-tvn" />
        <Label htmlFor="term-1m-tvn" className="cursor-pointer">1 Month</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="3 Months" id="term-3m-tvn" />
        <Label htmlFor="term-3m-tvn" className="cursor-pointer">3 Months</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="1 Year" id="term-1y-tvn" />
        <Label htmlFor="term-1y-tvn" className="cursor-pointer">1 Year</Label>
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
                {/* --- Form for: TV -> TV + Digital Visual – Paid Social --- */}
{selectedSubType === "TV + Digital Visual – Paid Social" && (
  <div className="grid gap-6"> 
    {/* Term Selection */}
    <div className="grid gap-4">
      <Label className="text-base font-medium">Select Term:</Label>
      <RadioGroup
        value={selectedTerm ?? ""}
        onValueChange={setSelectedTerm} // Reset only Term when Term changes
        className="grid gap-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="1 Month" id="term-1m-tvps" />
          <Label htmlFor="term-1m-tvps" className="cursor-pointer">1 Month</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="3 Months" id="term-3m-tvps" />
          <Label htmlFor="term-3m-tvps" className="cursor-pointer">3 Months</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="1 Year" id="term-1y-tvps" />
          <Label htmlFor="term-1y-tvps" className="cursor-pointer">1 Year</Label>
        </div>
      </RadioGroup>
    </div>

    {/* Market Selection */}
    <div className="grid gap-4">
      <Label className="text-base font-medium">Select Market:</Label>
      <RadioGroup
        value={selectedMarket ?? ""}
        onValueChange={setSelectedMarket} // Reset only Market when Market changes
        className="grid gap-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Local/Regional" id="market-lr-tvps" />
          <Label htmlFor="market-lr-tvps" className="cursor-pointer">Local / Regional</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="National" id="market-nat-tvps" />
          <Label htmlFor="market-nat-tvps" className="cursor-pointer">National</Label>
        </div>
      </RadioGroup>
    </div>

    {/* --- Rate Display --- */}
    {calculatedRate && (
      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">GVAA Rate Range:</p>
        <p className="text-2xl font-semibold text-green-700 dark:text-green-300">
          {calculatedRate}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">(TV + Paid Social Combined Usage)</p>
      </div>
    )}
  </div>
)}
                {/* --- Form for: TV -> TV + Digital Visual – Online Pre-Roll --- */}
{selectedSubType === "TV + Digital Visual – Online Pre-Roll (Includes Paid Social)" && (
  <div className="grid gap-6"> 
    {/* Term Selection */}
    <div className="grid gap-4">
      <Label className="text-base font-medium">Select Term:</Label>
      <RadioGroup
        value={selectedTerm ?? ""}
        onValueChange={setSelectedTerm} // Simple update
        className="grid gap-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="1 Month" id="term-1m-tvol" />
          <Label htmlFor="term-1m-tvol" className="cursor-pointer">1 Month</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="3 Months" id="term-3m-tvol" />
          <Label htmlFor="term-3m-tvol" className="cursor-pointer">3 Months</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="1 Year" id="term-1y-tvol" />
          <Label htmlFor="term-1y-tvol" className="cursor-pointer">1 Year</Label>
        </div>
      </RadioGroup>
    </div>

    {/* Market Selection */}
    <div className="grid gap-4">
      <Label className="text-base font-medium">Select Market:</Label>
      <RadioGroup
        value={selectedMarket ?? ""}
        onValueChange={setSelectedMarket} // Simple update
        className="grid gap-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Local/Regional" id="market-lr-tvol" />
          <Label htmlFor="market-lr-tvol" className="cursor-pointer">Local / Regional</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="National" id="market-nat-tvol" />
          <Label htmlFor="market-nat-tvol" className="cursor-pointer">National</Label>
        </div>
      </RadioGroup>
    </div>

    {/* --- Rate Display --- */}
    {calculatedRate && (
      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">GVAA Rate Range:</p>
        <p className="text-2xl font-semibold text-green-700 dark:text-green-300">
          {calculatedRate}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">(TV + Online Pre-Roll/OLV Combined Usage)</p>
      </div>
    )}
  </div>
)}
                {/* --- Form for: TV -> TV + Digital Visual – OTT/CTV --- */}
{selectedSubType === "TV + Digital Visual – OTT/CTV (Includes Pre-Roll & Paid Social)" && (
  <div className="grid gap-6"> 
    {/* Term Selection */}
    <div className="grid gap-4">
      <Label className="text-base font-medium">Select Term:</Label>
      <RadioGroup
        value={selectedTerm ?? ""}
        onValueChange={setSelectedTerm} // Simple update
        className="grid gap-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="1 Month" id="term-1m-tvott" />
          <Label htmlFor="term-1m-tvott" className="cursor-pointer">1 Month</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="3 Months" id="term-3m-tvott" />
          <Label htmlFor="term-3m-tvott" className="cursor-pointer">3 Months</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="1 Year" id="term-1y-tvott" />
          <Label htmlFor="term-1y-tvott" className="cursor-pointer">1 Year</Label>
        </div>
      </RadioGroup>
    </div>

    {/* Market Selection */}
    <div className="grid gap-4">
      <Label className="text-base font-medium">Select Market:</Label>
      <RadioGroup
        value={selectedMarket ?? ""}
        onValueChange={setSelectedMarket} // Simple update
        className="grid gap-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Local/Regional" id="market-lr-tvott" />
          <Label htmlFor="market-lr-tvott" className="cursor-pointer">Local / Regional</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="National" id="market-nat-tvott" />
          <Label htmlFor="market-nat-tvott" className="cursor-pointer">National</Label>
        </div>
      </RadioGroup>
    </div>

    {/* --- Rate Display --- */}
    {calculatedRate && (
      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">GVAA Rate Range:</p>
        <p className="text-2xl font-semibold text-green-700 dark:text-green-300">
          {calculatedRate}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">(TV + OTT/CTV Combined Usage)</p>
      </div>
    )}
  </div>
)}
                {/* --- Form for: TV -> Automotive (TV) --- */}
{selectedSubType === "Automotive (TV)" && (
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
          <RadioGroupItem value="Tier 1" id="tier-1-tv" /> {/* Changed ID */}
          <Label htmlFor="tier-1-tv" className="cursor-pointer">Tier 1 – National Brand Spots</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Tier 2" id="tier-2-tv" /> {/* Changed ID */}
          <Label htmlFor="tier-2-tv" className="cursor-pointer">Tier 2 – Regional Tags</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Tier 3 (:30/:60)" id="tier-3-30-tv" /> {/* Changed ID */}
          <Label htmlFor="tier-3-30-tv" className="cursor-pointer">Tier 3 – Local Dealer :30/:60</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Tier 3 (:15/:10/:6)" id="tier-3-15-tv" /> {/* Changed ID */}
          <Label htmlFor="tier-3-15-tv" className="cursor-pointer">Tier 3 – Local Dealer :15/:10/:6</Label>
        </div>
      </RadioGroup>
    </div>

    {/* Number of Spots Input (Conditional) */}
    {selectedTier && selectedTier !== "Tier 1" && (
      <div className="grid gap-4">
        <Label htmlFor="spots-number-tv" className="text-base font-medium">Number of Spots:</Label>
        <Input
          id="spots-number-tv"
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
                {/* --- Form for: TV -> In-Show / Documentary Narration --- */}
{selectedSubType === "In-Show / Documentary Narration" && (
  <div className="grid gap-4">
    <Label className="text-base font-medium">Select Program Length (Excludes Commercials):</Label>
    <RadioGroup
      value={selectedProgramLength ?? ""}
      onValueChange={setSelectedProgramLength} // Simple update
      className="grid gap-2"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="24 Minutes" id="length-24m" />
        <Label htmlFor="length-24m" className="cursor-pointer">24 Minutes (≈30 min program)</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="48 Minutes" id="length-48m" />
        <Label htmlFor="length-48m" className="cursor-pointer">48 Minutes (≈60 min program)</Label>
      </div>
    </RadioGroup>

    {/* --- Rate Display --- */}
    {calculatedRate && (
      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">GVAA Rate Range:</p>
        <p className="text-2xl font-semibold text-green-700 dark:text-green-300">
          {calculatedRate}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">(Program length excluding commercials)</p>
      </div>
    )}
  </div>
)}
                {/* --- Form for: TV -> Infomercial / DRTV --- */}
{selectedSubType === "Infomercial / DRTV" && (
  <div className="grid gap-4">
    <Label className="text-base font-medium">Select Market / Term:</Label>
    <RadioGroup
      value={selectedInfomercialMarket ?? ""}
      onValueChange={setSelectedInfomercialMarket} // Simple update
      className="grid gap-2"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="National – 1 Year" id="infomercial-nat" />
        <Label htmlFor="infomercial-nat" className="cursor-pointer">National – 1 Year</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="North America (US & Canada) – 1 Year" id="infomercial-na" />
        <Label htmlFor="infomercial-na" className="cursor-pointer">North America (US & Canada) – 1 Year</Label>
      </div>
    </RadioGroup>

    {/* --- Rate Display --- */}
    {calculatedRate && (
      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">GVAA Rate Range:</p>
        <p className="text-2xl font-semibold text-green-700 dark:text-green-300">
          {calculatedRate}
        </p>
         <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">(Per script, includes cuts/versions and up to 10 phone numbers)</p>
      </div>
    )}
  </div>
)}
                {/* --- Form for: TV -> Mnemonics --- */}
{selectedSubType === "Mnemonics" && (
  <div className="grid gap-4">
    {/* No inputs needed, rate is informational */}

    {/* --- Rate Display (Informational) --- */}
    {calculatedRate && (
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">GVAA Guidance:</p>
        <p className="text-lg font-medium text-blue-700 dark:text-blue-300">
          {calculatedRate}
        </p>
      </div>
    )}
  </div>
)}
                {/* --- Form for: TV -> Point of Sale (POS) --- */}
{selectedSubType === "Point of Sale (POS)" && (
  <div className="grid gap-4">
    {/* No inputs needed, rate is informational */}

    {/* --- Rate Display (Informational) --- */}
    {calculatedRate && (
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">GVAA Guidance:</p>
        <p className="text-lg font-medium text-blue-700 dark:text-blue-300">
          {calculatedRate}
        </p>
         <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">(Applies to videos at grocery/gas/retail displays)</p>
      </div>
    )}
  </div>
)}
                {/* --- Form for: Non-Broadcast -> Corporate & Industrial Narration – Finished Minute Scale --- */}
{selectedSubType === "Corporate & Industrial Narration – Finished Minute Scale" && (
  <div className="grid gap-4">
    <Label className="text-base font-medium">Select Finished Minute Range:</Label>
    <RadioGroup
      value={selectedDuration ?? ""}
      onValueChange={setSelectedDuration} // Simple update
      className="grid grid-cols-2 gap-2" // Use two columns for better layout
    >
      {Object.keys(corporateMinuteRates).map((duration) => (
        <div key={duration} className="flex items-center space-x-2">
          <RadioGroupItem value={duration} id={`duration-${duration.replace(' ','')}`} />
          <Label htmlFor={`duration-${duration.replace(' ','')}`} className="cursor-pointer">{duration}</Label>
        </div>
      ))}
    </RadioGroup>

    {/* --- Rate Display --- */}
    {calculatedRate && (
      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">GVAA Rate Range:</p>
        <p className="text-2xl font-semibold text-green-700 dark:text-green-300">
          {calculatedRate}
        </p>
         <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">(Single video usage, includes editing)</p>
      </div>
    )}
  </div>
)}
                {/* --- Form for: Non-Broadcast -> Corporate & Industrial Narration – Recording Time Scale --- */}
{selectedSubType === "Corporate & Industrial Narration – Recording Time Scale" && (
  <div className="grid gap-4">
    <Label htmlFor="corp-hours" className="text-base font-medium">Number of Recording Hours:</Label>
    <Input
      id="corp-hours"
      type="number"
      value={numberOfHours}
      onChange={(e) => setNumberOfHours(Math.max(1, Number(e.target.value) || 1))} // Ensure at least 1 hour
      min="1"
      step="1" // Allow only whole hours for this calculation
      className="max-w-[150px]"
    />

    {/* --- Rate Display --- */}
    {calculatedRate && (
      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">GVAA Rate (RAW Audio Only):</p>
        <p className="text-2xl font-semibold text-green-700 dark:text-green-300">
          {calculatedRate}
        </p>
         <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">($525/1st hr, $262/hr after. Full buyout. No editing included.)</p>
      </div>
    )}
  </div>
)}
                {/* --- CORRECTED JSX BLOCK (Was Step 3) --- */}
                {/* --- Form for: Non-Broadcast -> Explainer Videos --- */}
{selectedSubType === "Explainer Videos" && (
  <div className="grid gap-6">
    {/* Calculation Method Selection */}
    <div className="grid gap-4">
      <Label className="text-base font-medium">Select Calculation Method:</Label>
      <RadioGroup
        value={explainerCalcMethod ?? ""}
        onValueChange={(value) => {
          setExplainerCalcMethod(value);
          setWordCount(0); // Reset word count when method changes
          setSelectedDuration(null); // Also reset duration just in case
        }}
        className="grid grid-cols-2 gap-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="single" id="explainer-method-single" />
          <Label htmlFor="explainer-method-single" className="cursor-pointer">Single Video (≤ 90s)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="bulk" id="explainer-method-bulk" />
          <Label htmlFor="explainer-method-bulk" className="cursor-pointer">Bulk Rate (by Word Count)</Label>
        </div>
      </RadioGroup>
    </div>

    {/* Conditional Inputs: Word Count for Bulk */}
    {explainerCalcMethod === 'bulk' && (
      <div className="grid gap-4 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
        <Label htmlFor="explainer-wordcount" className="text-base font-medium">Enter Word Count:</Label>
        <Input
          id="explainer-wordcount"
          type="number"
          value={wordCount > 0 ? wordCount : ''}
          onChange={(e) => setWordCount(Math.max(0, Number(e.target.value) || 0))}
          min="0"
          step="1"
          className="max-w-[150px]"
          placeholder="e.g., 250"
        />
      </div>
    )}

    {/* --- Rate Display --- */}
    {calculatedRate && (
      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">GVAA Rate / Range:</p>
        <p className="text-2xl font-semibold text-green-700 dark:text-green-300">
          {calculatedRate}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {explainerCalcMethod === 'single'
            ? "(Public-facing on owned web/YouTube/social. Not paid placement.)" //
            : `(Based on $250 ≤175 words, +$50/add'l 100 words)` //
          }
        </p>
      </div>
    )}
  </div>
)}
                {/* --- END CORRECTED JSX BLOCK --- */}

                {/* --- Form for: Non-Broadcast -> Museum Tours – Educational --- */}
{selectedSubType === "Museum Tours – Educational" && (
  <div className="grid gap-6"> 
    {/* Category Selection */}
    <div className="grid gap-4">
      <Label className="text-base font-medium">Select Category:</Label>
      <RadioGroup
        value={selectedMuseumCategory ?? ""}
        onValueChange={setSelectedMuseumCategory} // Simple update
        className="grid gap-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="CAT1" id="museum-cat1" />
          <Label htmlFor="museum-cat1" className="cursor-pointer">Principal Voice, Audio Tour (Industrial CAT 1)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="CAT2" id="museum-cat2" />
          <Label htmlFor="museum-cat2" className="cursor-pointer">Talking Statues, Exhibition Voices (Industrial CAT 2)</Label>
        </div>
      </RadioGroup>
    </div>

    {/* Recording Hours Input */}
    <div className="grid gap-4">
      <Label htmlFor="museum-hours" className="text-base font-medium">Total Recording Hours:</Label>
      <Input
        id="museum-hours"
        type="number"
        value={museumRecordingHours}
        // Use Math.max to prevent values less than 1, allow decimals for calculation
        onChange={(e) => setMuseumRecordingHours(Math.max(1, Number(e.target.value) || 1))} 
        min="1" 
        step="0.5" // Allow half-hour increments in input
        className="max-w-[150px]"
      />
    </div>

    {/* --- Rate Display --- */}
    {calculatedRate && (
      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">GVAA Rate (Union Scale Reference):</p>
        <p className="text-2xl font-semibold text-green-700 dark:text-green-300">
          {calculatedRate}
        </p>
         <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {selectedMuseumCategory === 'CAT1' ? `($${museumCat1Rate.firstHour}/1st hr, $${museumCat1Rate.additionalHalfHour}/add'l 30 min)` : `($${museumCat2Rate.firstHour}/1st hr, $${museumCat2Rate.additionalHalfHour}/add'l 30 min)`}
         </p>
      </div>
    )}
  </div>
)}
                {/* --- Form for: Non-Broadcast -> Podcasts --- */}
{selectedSubType === "Podcasts" && (
  <div className="grid gap-4">
    <Label className="text-base font-medium">Select Podcast Type:</Label>
    <RadioGroup
      value={selectedPodcastType ?? ""}
      onValueChange={setSelectedPodcastType} // Simple update
      className="grid gap-2"
    >
      {Object.keys(podcastRates).map((podcastType) => (
        <div key={podcastType} className="flex items-center space-x-2">
          <RadioGroupItem value={podcastType} id={`podcast-${podcastType.replace(/[^a-zA-Z0-9]/g, '')}`} /> 
          <Label htmlFor={`podcast-${podcastType.replace(/[^a-zA-Z0-9]/g, '')}`} className="cursor-pointer">{podcastType}</Label>
        </div>
      ))}
    </RadioGroup>

    {/* --- Rate Display --- */}
    {calculatedRate && (
      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">GVAA Rate Range:</p>
        <p className="text-2xl font-semibold text-green-700 dark:text-green-300">
          {calculatedRate}
        </p>
        {/* Optionally add note about hours for drama roles */}
        {(selectedPodcastType?.includes("Audio Drama")) && 
         <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">(up to 4 hours session)</p>
        }
      </div>
    )}
  </div>
)}
                {/* --- Form for: Non-Broadcast -> Medical / Technical Narration --- */}
{selectedSubType === "Medical / Technical Narration" && (
  <div className="grid gap-6"> 
    {/* Calculation Method Selection */}
    <div className="grid gap-4">
      <Label className="text-base font-medium">Select Calculation Method:</Label>
      <RadioGroup
        value={medTechCalcMethod ?? ""}
        // Reset specific inputs when method changes
        onValueChange={(value) => { 
          setMedTechCalcMethod(value);
          setSelectedDuration(null); // Reset duration if switching
          setWordCount(0);           // Reset word count if switching
        }} 
        className="grid grid-cols-2 gap-2" // Two columns
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="minute" id="medtech-method-minute" />
          <Label htmlFor="medtech-method-minute" className="cursor-pointer">By Finished Minute</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="word" id="medtech-method-word" />
          <Label htmlFor="medtech-method-word" className="cursor-pointer">By Word Count</Label>
        </div>
      </RadioGroup>
    </div>

    {/* Conditional Inputs: Finished Minute */}
    {medTechCalcMethod === 'minute' && (
      <div className="grid gap-4 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
         <Label className="text-base font-medium">Select Finished Minute Range:</Label>
         <RadioGroup
           value={selectedDuration ?? ""}
           onValueChange={setSelectedDuration} // Simple update
           className="grid grid-cols-2 gap-2" // Use two columns
         >
           {Object.keys(medicalMinuteRates).map((duration) => (
             <div key={duration} className="flex items-center space-x-2">
               <RadioGroupItem value={duration} id={`duration-med-${duration.replace(/[^a-zA-Z0-9]/g, '')}`} /> 
               <Label htmlFor={`duration-med-${duration.replace(/[^a-zA-Z0-9]/g, '')}`} className="cursor-pointer">{duration}</Label>
             </div>
           ))}
         </RadioGroup>
      </div>
    )}

    {/* Conditional Inputs: Word Count */}
     {medTechCalcMethod === 'word' && (
       <div className="grid gap-4 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
         <Label htmlFor="medtech-wordcount" className="text-base font-medium">Enter Word Count:</Label>
         <Input
           id="medtech-wordcount"
           type="number"
           value={wordCount > 0 ? wordCount : ''} // Show empty string if 0
           onChange={(e) => setWordCount(Math.max(0, Number(e.target.value) || 0))} // Allow 0, ensure non-negative
           min="0"
           step="1" 
           className="max-w-[150px]"
           placeholder="e.g., 1500"
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
         <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
           {medTechCalcMethod === 'minute' 
             ? "(Includes editing, file splits, naming, delivery, pickups. Free re-records ≤10%.)" 
             : `($${medicalPerWordRateLow.toFixed(2)}–$${medicalPerWordRateHigh.toFixed(2)} per word)`
           }
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
