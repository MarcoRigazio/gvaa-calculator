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
  "1Year": "$1,000–$1,500",
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
  "3 Months": "$750–$1,000",
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
  "1Year": "$4,000–$8,000",
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
const youTubeRates = {
  "Narration: 3–5 min episodes": "$750–$1,000",
  "Channel Intro/Outro": "$500–$2,000",
};
const promoTvRates = {
  "Local": "$150–$300",
  "Regional": "$450–$600",
  "National": "$750–$1,000",
  "Station Voice": "Custom Retainer",
};
const promoRadioRates = {
  "Local": "$150–$200",
  "Regional": "$350–$500",
  "National": "$600–$850",
  "Station Voice": "Custom Retainer",
};
const promoTrailerRates = {
  "Local – Small Market": "$100",
  "Regional – Medium Market": "$325–$500",
  "National – Large Market": "$1,500–$2,000",
};
const cinemaRates1to3States = {
  "1 Month": "$300",
  "3 Months": "$425–$550",
  "6 Months": "$800–$950",
  "1 Year": "$1,200–$1,350",
};
const cinemaRates4PlusStates = {
  "1 Month": "$500",
  "3 Months": "$800–$1,050",
  "6 Months": "$1,600–$2,000",
  "1Year": "$2,400–$3,000",
};
const eventVideoRates = {
  "1 Year": { firstHourLow: 600, firstHourHigh: 700, addHourLow: 300, addHourHigh: 350 },
  "Full Buyout": { firstHourLow: 2000, firstHourHigh: 2100, addHourLow: 1000, addHourHigh: 1100 },
};
// Trade Show rates are identical to Event Video rates
const tradeShowRates = {
  "1 Year": { firstHourLow: 600, firstHourHigh: 700, addHourLow: 300, addHourHigh: 350 },
  "Full Buyout": { firstHourLow: 2000, firstHourHigh: 2100, addHourLow: 1000, addHourHigh: 1100 },
};


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
  const [selectedYouTubeType, setSelectedYouTubeType] = useState<string | null>(null);
  const [numberOfAirports, setNumberOfAirports] = useState<number>(1);
  const [selectedLobbyType, setSelectedLobbyType] = useState<string | null>(null);
  const [finishedMinutes, setFinishedMinutes] = useState<number | string>("");
  const [finishedHours, setFinishedHours] = useState<number | string>("");
  const [sessionHours, setSessionHours] = useState<number | string>("");
  const [sessionLength, setSessionLength] = useState<number | string>("");
  const [numEpisodes, setNumEpisodes] = useState<number>(1);
  const [gameCalcMethod, setGameCalcMethod] = useState<string | null>(null);
  const [numVoices, setNumVoices] = useState<number>(1);
  const [selectedPromoMarket, setSelectedPromoMarket] = useState<string | null>(null);
  const [selectedIvrModel, setSelectedIvrModel] = useState<string | null>(null);
  const [numPrompts, setNumPrompts] = useState<number>(0);
  const [numParagraphs, setNumParagraphs] = useState<number>(0);
  const [selectedRosterModel, setSelectedRosterModel] = useState<string | null>(null);

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
  setMedTechCalcMethod(null); 
  setWordCount(0);            
  setExplainerCalcMethod(null);
  setSelectedYouTubeType(null);
  setSelectedLobbyType(null);
  setNumberOfAirports(1);
  setCalculatedRate(null);
  setFinishedMinutes("");
  setFinishedHours("");
  setSessionHours("");
  setSelectedPromoMarket(null);
  setSelectedIvrModel(null);
  setNumPrompts(0);
  setNumParagraphs(0);
  setSelectedRosterModel(null);
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
   // Calculator for: Non-Broadcast -> YouTube Content
   else if (selectedSubType === "YouTube Content" && selectedYouTubeType) {
     const rate = youTubeRates[selectedYouTubeType as keyof typeof youTubeRates];
     setCalculatedRate(rate || null);
   }
   // Calculator for: Non-Broadcast -> Kiosk Use (Non-Retail)
   else if (selectedSubType === "Kiosk Use (Non-Retail)") {
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
   // Calculator for: Non-Broadcast -> Lobby Viewing
   else if (selectedSubType === "Lobby Viewing") {
     if (selectedLobbyType === 'explainer') {
       // Re-use the hourly calculation
       if (numberOfHours > 0) {
         const firstHourRate = 525;
         const additionalHourRate = 262;
         const totalRate = numberOfHours === 1 ? firstHourRate : firstHourRate + (additionalHourRate * (numberOfHours - 1));
         const formattedRate = `$${totalRate.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
         setCalculatedRate(formattedRate);
       } else {
         setCalculatedRate(null);
       }
     } else if (selectedLobbyType === 'retail') {
       // Show informational message
       setCalculatedRate("Refer to TV broadcast rates");
     } else {
       setCalculatedRate(null); // No type selected
     }
   }
   // Calculator for: Non-Broadcast -> Airport Announcements
   else if (selectedSubType === "Airport Announcements") {
     if (numberOfAirports > 0 && numberOfHours > 0) {
       // 1. Calculate airport-based rate
       const lowRate_air = 1500 + Math.max(0, numberOfAirports - 1) * 1000;
       const highRate_air = 2000 + Math.max(0, numberOfAirports - 1) * 1500;
       
       // 2. Calculate hourly upcharge (base rate includes up to 2 hours)
       const hourlyUpcharge = Math.max(0, numberOfHours - 2) * 500;
       
       // 3. Calculate final rate
       const lowTotal = lowRate_air + hourlyUpcharge;
       const highTotal = highRate_air + hourlyUpcharge;
       
       const formattedLow = lowTotal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
       const formattedHigh = highTotal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
       
       setCalculatedRate(`$${formattedLow}–$${formattedHigh}`);
     } else {
       setCalculatedRate(null);
     }
   }
     // Calculator for: E-Learning
  else if (selectedCategory === "elearning") {
    const numWords = Number(wordCount) || 0;
    const numPFM = Number(finishedMinutes) || 0;
    const numRawHours = Number(numberOfHours) || 0;
    const numFinishedHours = Number(finishedHours) || 0;
    const numSessionHours = Number(sessionHours) || 0;

    if (selectedSubType === "Per Word" && numWords > 0) {
      const lowRate = numWords * 0.20;
      const highRate = numWords * 0.35;
      setCalculatedRate(`$${lowRate.toFixed(0)}–$${highRate.toFixed(0)}`);
    } 
    else if (selectedSubType === "Per Finished Minute" && numPFM > 0) {
      const lowRate = numPFM * 30;
      const highRate = numPFM * 55;
      setCalculatedRate(`$${lowRate.toFixed(0)}–$${highRate.toFixed(0)}`);
    } 
    else if (selectedSubType === "Per Raw Hour" && numRawHours > 0) {
      const lowRate = numRawHours * 600;
      const highRate = numRawHours * 2400;
      setCalculatedRate(`$${lowRate.toFixed(0)}–$${highRate.toFixed(0)}`);
    }
    else if (selectedSubType === "Per Finished Hour" && numFinishedHours > 0) {
      const lowRate = numFinishedHours * 1500;
      const highRate = numFinishedHours * 3300;
      setCalculatedRate(`$${lowRate.toFixed(0)}–$${highRate.toFixed(0)}`);
    }
    else if (selectedSubType === "Directed Sessions" && numWords > 0) {
      const lowWordRate = numWords * 0.10;
      const highWordRate = numWords * 0.30;
      
      const additionalHours = Math.max(0, numSessionHours - 1);
      const lowHourRate = additionalHours * 150;
      const highHourRate = additionalHours * 300;

      const lowTotal = lowWordRate + lowHourRate;
      const highTotal = highWordRate + highHourRate;
      
      setCalculatedRate(`$${lowTotal.toFixed(0)}–$${highTotal.toFixed(0)}`);
    }   
    else {
      setCalculatedRate(null); // No input yet for E-Learning
    }    
  }
// Calculator for: Animation / Dubbing
  else if (selectedCategory === "animation_dubbing") {
    const numSessionHours = Number(sessionLength) || 0;

    if (selectedSubType === "Non-Union Original Animation – 22 Minute Episode") {
      // Rate is per episode, up to 4 hrs
      setCalculatedRate("$1,100–$1,200");
    }
    else if (selectedSubType === "Non-Union Original Animation – 11 Minute Episode or Less") {
      // Rate is per episode ($400-$700)
      const lowRate = numEpisodes * 400;
      const highRate = numEpisodes * 700;
      setCalculatedRate(`$${lowRate.toFixed(0)}–$${highRate.toFixed(0)}`);
    }
    else if (selectedSubType === "Dubbing (Film/TV/Animation)" && numSessionHours > 0) {
      // Rate is per hour, 2 hr min
      const hoursToCharge = Math.max(2, numSessionHours);
      const rate = hoursToCharge * 125; // Using the ~$125/hr non-union example
      setCalculatedRate(`~$${rate.toFixed(0)}`);
    }
    else {
      setCalculatedRate(null); // No input or sub-type not handled
    }
  }
// Calculator for: Video Games / Toys & Games
  else if (selectedCategory === "video_games_toys") {
    const numSessionHours = Number(sessionLength) || 0;
    const numMins = Number(finishedMinutes) || 0;

    if (selectedSubType === "Video Games (Non-Union)") {
      if (gameCalcMethod === 'hourly' && numSessionHours > 0) {
        // $200–$350/hr (2 or 4 hr min)
        // We'll calculate based on hours, and note the minimum
        const lowRate = numSessionHours * 200;
        const highRate = numSessionHours * 350;
        setCalculatedRate(`$${lowRate.toFixed(0)}–$${highRate.toFixed(0)} (2-4 hr min)`);
      } else if (gameCalcMethod === 'flat') {
        // Common flat: $500 for 1 hr max
        setCalculatedRate("$500 (1 hr max)");
      } else {
        setCalculatedRate(null);
      }
    }
    else if (selectedSubType === "Video Games (Union)") {
      // $825.50/session (up to 4 hrs)
      setCalculatedRate("$825.50 (Up to 4 hr session)");
    }
    else if (selectedSubType === "Toys & Games" && numSessionHours > 0) {
      // $500–$750 (up to 2 hrs), $200–$250/add’l hr
      let lowRate = 500;
      let highRate = 750;
      const additionalHours = Math.max(0, numSessionHours - 2);
      if (additionalHours > 0) {
        lowRate += additionalHours * 200;
        highRate += additionalHours * 250;
      }
      setCalculatedRate(`$${lowRate.toFixed(0)}–$${highRate.toFixed(0)}`);
    }
    else if (selectedSubType === "Toys & Games (Demo/Scratch)" && numSessionHours > 0) {
      // $150–$300/hr
      const lowRate = numSessionHours * 150;
      const highRate = numSessionHours * 300;
      setCalculatedRate(`$${lowRate.toFixed(0)}–$${highRate.toFixed(0)}`);
    }
    else if (selectedSubType === "Mobile Game Apps (Non-Union Character)") {
      if (gameCalcMethod === 'per_game') {
        // $300–$500/game. +$75–$100/extra voice over 3-4
        let lowRate = 300;
        let highRate = 500;
        const extraVoices = Math.max(0, numVoices - 4); // Extra voices over 4
        if (extraVoices > 0) {
          lowRate += extraVoices * 75;
          highRate += extraVoices * 100;
        }
        setCalculatedRate(`$${lowRate.toFixed(0)}–$${highRate.toFixed(0)}`);
      } else if (gameCalcMethod === 'hourly' && numSessionHours > 0) {
        // $200–$300/hr (2 hr min)
        const hoursToCharge = Math.max(2, numSessionHours);
        const lowRate = hoursToCharge * 200;
        const highRate = hoursToCharge * 300;
        setCalculatedRate(`$${lowRate.toFixed(0)}–$${highRate.toFixed(0)}`);
      } else {
        setCalculatedRate(null);
      }
    }
    else if (selectedSubType === "Mobile Game Apps (Union Character)") {
      // $825.50/session
      setCalculatedRate("$825.50 (Up to 3 voices, 4 hr max)");
    }
    else if (selectedSubType === "Mobile Game Apps (E-Learning/Educational)" && numMins > 0) {
      // $350–$400 (1–5 mins) / $600 (10 mins)
      if (numMins >= 1 && numMins <= 5) {
        setCalculatedRate("$350–$400");
      } else if (numMins > 5 && numMins <= 10) {
        // Prorating a bit, landing on $600 at 10 mins
        const lowRate = 350 + (numMins - 5) * ( (600-350) / 5 );
        const highRate = 400 + (numMins - 5) * ( (600-400) / 5 );
        setCalculatedRate(`$${lowRate.toFixed(0)}–$${highRate.toFixed(0)}`);
      } else if (numMins > 10) {
         const lowRate = numMins * 60; // $600/10mins = $60/min
         setCalculatedRate(`$${lowRate.toFixed(0)}+`);
      } else {
        setCalculatedRate(null);
      }
    }
    else {
      setCalculatedRate(null);
    }
  }
      // Calculator for: Promo & Imaging -> TV
  else if (selectedSubType === "TV" && selectedPromoMarket) {
    const rate = promoTvRates[selectedPromoMarket as keyof typeof promoTvRates];
    setCalculatedRate(rate || null);
  }
// Calculator for: Promo & Imaging -> Radio
  else if (selectedSubType === "Radio" && selectedPromoMarket) {
    const rate = promoRadioRates[selectedPromoMarket as keyof typeof promoRadioRates];
    setCalculatedRate(rate || null);
  }
// Calculator for: Promo & Imaging -> Trailers
  else if (selectedSubType === "Trailers" && selectedPromoMarket) {
    const rate = promoTrailerRates[selectedPromoMarket as keyof typeof promoTrailerRates];
    setCalculatedRate(rate || null);
  }
// Calculator for: Audiobooks
  else if (selectedCategory === "audiobooks") {
    const numFinishedHours = Number(finishedHours) || 0;
    const numRawHours = Number(numberOfHours) || 0; // Re-using numberOfHours for raw/prod

    if (selectedSubType === "Union Scale – PFH" && numFinishedHours > 0) {
      const lowRate = numFinishedHours * 150;
      const highRate = numFinishedHours * 225;
      setCalculatedRate(`$${lowRate.toFixed(0)}–$${highRate.toFixed(0)}`);
    }
    else if (selectedSubType === "Non-Union – PFH" && numFinishedHours > 0) {
      const lowRate = numFinishedHours * 200;
      const highRate = numFinishedHours * 500;
      setCalculatedRate(`$${lowRate.toFixed(0)}–$${highRate.toFixed(0)}`);
    }
    else if (selectedSubType === "Per RAW Hour" && numRawHours > 0) {
      const rate = numRawHours * 225;
      setCalculatedRate(`$${rate.toFixed(0)}`);
    }
    else if (selectedSubType === "Production Add-On" && numRawHours > 0) {
      const lowRate = numRawHours * 75;
      const highRate = numRawHours * 125;
      setCalculatedRate(`$${lowRate.toFixed(0)}–$${highRate.toFixed(0)}`);
    }
    else if (selectedSubType === "Hybrid Agreement" && numFinishedHours > 0) {
      const rate = numFinishedHours * 100;
      setCalculatedRate(`$${rate.toFixed(0)} + Royalty Share`);
    }
    else {
      setCalculatedRate(null);
    }
  }
      // Calculator for: IVR / Message-on-Hold
  else if (selectedCategory === "ivr_message_on_hold") {
    const numWords = Number(wordCount) || 0;
    const numHours = Number(numberOfHours) || 0;
    const numMins = Number(finishedMinutes) || 0;
    const numParas = Number(numParagraphs) || 0;

    if (selectedSubType === "Direct Quote") {
      if (selectedIvrModel === 'ivr_min') {
        setCalculatedRate("$150"); // [cite: 120]
      }
      else if (selectedIvrModel === 'ivr_prompt' && numPrompts > 0) {
        const lowRate = 150 + (numPrompts * 1);
        const highRate = 200 + (numPrompts * 5);
        setCalculatedRate(`$${lowRate.toFixed(0)}–$${highRate.toFixed(0)}`); // [cite: 120]
      }
      else if (selectedIvrModel === 'ivr_word' && numWords > 0) {
        const lowRate = numWords * 0.08;
        const highRate = numWords * 0.25;
        setCalculatedRate(`$${lowRate.toFixed(2)}–$${highRate.toFixed(2)}`); // [cite: 120]
      }
      else if (selectedIvrModel === 'ivr_hour' && numHours > 0) {
        const lowRate = numHours * 50;
        const highRate = numHours * 200;
        setCalculatedRate(`$${lowRate.toFixed(0)}–$${highRate.toFixed(0)}`); // [cite: 120]
      }
      else if (selectedIvrModel === 'moh_min') {
        setCalculatedRate("$200"); // [cite: 120]
      }
      else if (selectedIvrModel === 'moh_min_rate' && numMins > 0) {
        const rate = numMins * 100;
        setCalculatedRate(`$${rate.toFixed(0)}`); // [cite: 120]
      }
      else if (selectedIvrModel === 'moh_para' && numParas > 0) {
        const rate = numParas * 8;
        setCalculatedRate(`$${rate.toFixed(0)}`); // [cite: 120]
      }
      else {
        setCalculatedRate(null);
      }
    }
    else if (selectedSubType === "Roster Talent") {
      if (selectedRosterModel === 'prod_house' && numParas > 0) {
        const lowRate = numParas * 10;
        const highRate = numParas * 20;
        setCalculatedRate(`$${lowRate.toFixed(0)}–$${highRate.toFixed(0)}`); // [cite: 122]
      }
      else if (selectedRosterModel === 'other_hourly' && numHours > 0) {
        const halfHours = numHours * 2;
        const rate = halfHours * 50;
        setCalculatedRate(`$${rate.toFixed(0)}`); // [cite: 122]
      }
      else {
        setCalculatedRate(null);
      }
    }
    else {
      setCalculatedRate(null);
    }
  }
      // Calculator for: Cinema / Events
  else if (selectedCategory === "cinema_events") {
    const numHours = Number(numberOfHours) || 0;

    if (selectedSubType === "Cinema Usage – Term (1–3 States)" && selectedTerm) {
      const rate = cinemaRates1to3States[selectedTerm as keyof typeof cinemaRates1to3States];
      setCalculatedRate(rate || null);
    }
    else if (selectedSubType === "Cinema Usage – Term (4+ States)" && selectedTerm) {
      const rate = cinemaRates4PlusStates[selectedTerm as keyof typeof cinemaRates4PlusStates];
      setCalculatedRate(rate || null);
    }
    else if (selectedSubType === "Event Video" && selectedTerm && numHours > 0) {
      const rates = eventVideoRates[selectedTerm as keyof typeof eventVideoRates];
      if (rates) {
        const additionalHours = Math.max(0, numHours - 1);
        const lowTotal = rates.firstHourLow + (additionalHours * rates.addHourLow);
        const highTotal = rates.firstHourHigh + (additionalHours * rates.addHourHigh);
        setCalculatedRate(`$${lowTotal.toFixed(0)}–$${highTotal.toFixed(0)}`);
      } else {
        setCalculatedRate(null);
      }
    }
    else if (selectedSubType === "Trade Shows / Sporting Events" && selectedTerm && numHours > 0) {
      const rates = tradeShowRates[selectedTerm as keyof typeof tradeShowRates];
      if (rates) {
        const additionalHours = Math.max(0, numHours - 1);
        const lowTotal = rates.firstHourLow + (additionalHours * rates.addHourLow);
        const highTotal = rates.firstHourHigh + (additionalHours * rates.addHourHigh);
        setCalculatedRate(`$${lowTotal.toFixed(0)}–$${highTotal.toFixed(0)}`);
      } else {
        setCalculatedRate(null);
      }
    }
    else {
      setCalculatedRate(null);
    }
  }
      
      
}, [selectedSubType, selectedCategory, selectedTerm, numberOfTags, selectedTier, numberOfSpots, selectedRole, selectedMarket, selectedProgramLength, selectedInfomercialMarket, selectedDuration, numberOfHours, selectedMuseumCategory, museumRecordingHours, selectedPodcastType, medTechCalcMethod, wordCount, explainerCalcMethod, selectedYouTubeType, selectedLobbyType, numberOfAirports, finishedMinutes, finishedHours, sessionHours, sessionLength, numEpisodes, gameCalcMethod, numVoices, selectedPromoMarket, selectedIvrModel, numPrompts, numParagraphs, selectedRosterModel]);

  
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

                {/* --- Form for: Non-Broadcast -> Digital Greeting Cards --- */}
                {selectedSubType === "Digital Greeting Cards" && (
                  <div className="grid gap-4">
                    {/* No inputs needed, rate is informational */}

                    {/* --- Rate Display --- */}
                    {calculatedRate && (
                      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg text-center">
                        <p className="text-sm text-slate-600 dark:text-slate-400">GVAA Rate Range (Full Buyout):</p>
                        <p className="text-2xl font-semibold text-green-700 dark:text-green-300">
                          {calculatedRate}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                {/* --- Form for: Non-Broadcast -> YouTube Content --- */}
                {selectedSubType === "YouTube Content" && (
                  <div className="grid gap-4">
                    <Label className="text-base font-medium">Select Content Type:</Label>
                    <RadioGroup
                      value={selectedYouTubeType ?? ""}
                      onValueChange={setSelectedYouTubeType}
                      className="grid gap-2"
                    >
                      {Object.keys(youTubeRates).map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <RadioGroupItem value={type} id={`youtube-${type.replace(/[^a-zA-Z0-9]/g, '')}`} />
                          <Label htmlFor={`youtube-${type.replace(/[^a-zA-Z0-9]/g, '')}`} className="cursor-pointer">{type}</Label>
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
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {selectedYouTubeType === "Narration: 3–5 min episodes"
                            ? "(~500–1,000 words. Rate increases for high-view channels.)"
                            : "(Rate increases with subscriber count.)"
                          }
                        </p>
                      </div>
                    )}
                  </div>
                )}
                {/* --- Form for: Non-Broadcast -> Kiosk Use (Non-Retail) --- */}
                {selectedSubType === "Kiosk Use (Non-Retail)" && (
                  <div className="grid gap-4">
                    <Label htmlFor="kiosk-hours" className="text-base font-medium">Number of Recording Hours:</Label>
                    <Input
                      id="kiosk-hours"
                      type="number"
                      value={numberOfHours}
                      onChange={(e) => setNumberOfHours(Math.max(1, Number(e.target.value) || 1))} // Ensure at least 1 hour
                      min="1"
                      step="1" // Allow only whole hours
                      className="max-w-[150px]"
                    />

                    {/* --- Rate Display --- */}
                    {calculatedRate && (
                      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg text-center">
                        <p className="text-sm text-slate-600 dark:text-slate-400">GVAA Rate (Full Buyout):</p>
                        <p className="text-2xl font-semibold text-green-700 dark:text-green-300">
                          {calculatedRate}
                        </p>
                         <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">($525/1st hr, $262/hr after. For non-retail kiosks.)</p>
                      </div>
                    )}
                  </div>
                )}
                {/* --- Form for: Non-Broadcast -> Lobby Viewing --- */}
                {selectedSubType === "Lobby Viewing" && (
                  <div className="grid gap-6">
                    {/* Type Selection */}
                    <div className="grid gap-4">
                      <Label className="text-base font-medium">Select Lobby Video Type:</Label>
                      <RadioGroup
                        value={selectedLobbyType ?? ""}
                        onValueChange={setSelectedLobbyType}
                        className="grid gap-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="explainer" id="lobby-explainer" />
                          <Label htmlFor="lobby-explainer" className="cursor-pointer">Explainer (Service Provider, Not Selling)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="retail" id="lobby-retail" />
                          <Label htmlFor="lobby-retail" className="cursor-pointer">Retail (Selling a Product/Service)</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Conditional Inputs: Recording Hours for Explainer */}
                    {selectedLobbyType === 'explainer' && (
                      <div className="grid gap-4 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
                        <Label htmlFor="lobby-hours" className="text-base font-medium">Number of Recording Hours:</Label>
                        <Input
                          id="lobby-hours"
                          type="number"
                          value={numberOfHours}
                          onChange={(e) => setNumberOfHours(Math.max(1, Number(e.target.value) || 1))}
                          min="1"
                          step="1"
                          className="max-w-[150px]"
                        />
                      </div>
                    )}

                    {/* --- Rate Display --- */}
                    {calculatedRate && (
                      <div className={cn(
                        "mt-6 p-4 rounded-lg text-center",
                        selectedLobbyType === 'retail'
                          ? "bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700"
                          : "bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700"
                      )}>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {selectedLobbyType === 'retail' && (
                            <>GVAA Guidance:</>
                          )}
                          {selectedLobbyType !== 'retail' && ( // Default to this if 'explainer' or null
                            <>GVAA Rate (Full Buyout):</>
                          )}
                        </p>
                        <p className={cn(
                          "text-2xl font-semibold",
                          selectedLobbyType === 'retail'
                            ? "text-blue-700 dark:text-blue-300"
                            : "text-green-700 dark:text-green-300"
                        )}>
                          {calculatedRate}
                        </p>
                        {selectedLobbyType === 'explainer' && (
                           <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">($525/1st hr, $262/hr after. Full buyout.)</p>
                        )}
                         {selectedLobbyType === 'retail' && (
                           <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">(Selling a product: mirrors TV rates/terms.)</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
                                {/* --- Form for: Non-Broadcast -> Airport Announcements --- */}
                {selectedSubType === "Airport Announcements" && (
                  <div className="grid gap-6">
                    {/* Number of Airports Input */}
                    <div className="grid gap-4">
                      <Label htmlFor="airport-count" className="text-base font-medium">Number of Airports:</Label>
                      <Input
                        id="airport-count"
                        type="number"
                        value={numberOfAirports}
                        onChange={(e) => setNumberOfAirports(Math.max(1, Number(e.target.value) || 1))}
                        min="1"
                        step="1"
                        className="max-w-[150px]"
                      />
                    </div>
                
                    {/* Number of Recording Hours Input */}
                    <div className="grid gap-4">
                      <Label htmlFor="airport-hours" className="text-base font-medium">Total Recording Hours (RAW):</Label>
                      <Input
                        id="airport-hours"
                        type="number"
                        value={numberOfHours}
                        onChange={(e) => setNumberOfHours(Math.max(1, Number(e.target.value) || 1))}
                        min="1"
                        step="1" // Doc implies full hour upcharge
                        className="max-w-[150px]"
                      />
                    </div>
                
                    {/* --- Rate Display --- */}
                    {calculatedRate && (
                      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg text-center">
                        <p className="text-sm text-slate-600 dark:text-slate-400">GVAA Rate Range (Per Year):</p>
                        <p className="text-2xl font-semibold text-green-700 dark:text-green-300">
                          {calculatedRate}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          (Base rate covers 1 airport, up to 2 hrs raw. +$1k–$1.5k/additional airport. +$500/additional hr over 2.)
                        </p>
                      </div>
                    )}
                  </div>
                )}
{/* --- Form for: E-Learning --- */}
{selectedCategory === "elearning" && (
  <div className="grid gap-6">
    {/* Per Word */}
    {selectedSubType === "Per Word" && (
      <div className="grid gap-4">
        <Label htmlFor="elearning-wordcount" className="text-base font-medium">Enter Word Count:</Label>
        <Input
          id="elearning-wordcount"
          type="number"
          value={wordCount > 0 ? wordCount : ''}
          onChange={(e) => setWordCount(Math.max(0, Number(e.target.value) || 0))}
          min="0"
          className="max-w-[150px]"
          placeholder="e.g., 7500"
        />
      </div>
    )}

    {/* Per Finished Minute */}
    {selectedSubType === "Per Finished Minute" && (
      <div className="grid gap-4">
        <Label htmlFor="elearning-pfm" className="text-base font-medium">Enter Finished Minutes:</Label>
        <Input
          id="elearning-pfm"
          type="number"
          value={finishedMinutes}
          onChange={(e) => setFinishedMinutes(e.target.value)}
          min="0"
          className="max-w-[150px]"
          placeholder="e.g., 30"
        />
      </div>
    )}

    {/* Per Raw Hour */}
    {selectedSubType === "Per Raw Hour" && (
      <div className="grid gap-4">
        <Label htmlFor="elearning-raw" className="text-base font-medium">Enter Raw Hours:</Label>
        <Input
          id="elearning-raw"
          type="number"
          value={numberOfHours}
          onChange={(e) => setNumberOfHours(Math.max(1, Number(e.target.value) || 1))}
          min="1"
          step="0.5"
          className="max-w-[150px]"
        />
      </div>
    )}
    
    {/* Per Finished Hour */}
    {selectedSubType === "Per Finished Hour" && (
      <div className="grid gap-4">
        <Label htmlFor="elearning-pfh" className="text-base font-medium">Enter Finished Hours:</Label>
        <Input
          id="elearning-pfh"
          type="number"
          value={finishedHours}
          onChange={(e) => setFinishedHours(e.target.value)}
          min="0"
          step="0.5"
          className="max-w-[150px]"
          placeholder="e.g., 1.5"
        />
      </div>
    )}

    {/* Directed Sessions */}
    {selectedSubType === "Directed Sessions" && (
      <div className="grid gap-6">
        <div className="grid gap-4">
          <Label htmlFor="elearning-directed-words" className="text-base font-medium">Enter Word Count:</Label>
          <Input
            id="elearning-directed-words"
            type="number"
            value={wordCount > 0 ? wordCount : ''}
            onChange={(e) => setWordCount(Math.max(0, Number(e.target.value) || 0))}
            min="0"
            className="max-w-[150px]"
            placeholder="e.g., 10000"
          />
        </div>
        <div className="grid gap-4">
          <Label htmlFor="elearning-directed-hours" className="text-base font-medium">Enter Session Hours (First 60 mins included):</Label>
          <Input
            id="elearning-directed-hours"
            type="number"
            value={sessionHours}
            onChange={(e) => setSessionHours(e.target.value)}
            min="0"
            step="0.5"
            className="max-w-[150px]"
            placeholder="e.g., 2.5"
          />
        </div>
      </div>
    )}

    {/* --- E-Learning Rate Display --- */}
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
  {/* --- Form for: Animation / Dubbing --- */}
{selectedCategory === "animation_dubbing" && (
  <div className="grid gap-6">

    {/* Non-Union Original Animation – 22 Minute Episode */}
    {selectedSubType === "Non-Union Original Animation – 22 Minute Episode" && (
      <div className="grid gap-4">
        <Label htmlFor="anim-session-hours" className="text-base font-medium">Session Hours (Up to 4):</Label>
        <Input
          id="anim-session-hours"
          type="number"
          value={sessionLength}
          onChange={(e) => setSessionLength(e.target.value)}
          min="0"
          max="4"
          step="0.5"
          className="max-w-[150px]"
          placeholder="e.g., 2.5"
        />
        <p className="text-xs text-muted-foreground -mt-2">(Rate is for a session up to 4 hours)</p>
      </div>
    )}

    {/* Non-Union Original Animation – 11 Minute Episode or Less */}
    {selectedSubType === "Non-Union Original Animation – 11 Minute Episode or Less" && (
      <div className="grid gap-4">
        <Label htmlFor="anim-11-episodes" className="text-base font-medium">Number of Episodes:</Label>
        <Input
          id="anim-11-episodes"
          type="number"
          value={numEpisodes}
          onChange={(e) => setNumEpisodes(Math.max(1, Number(e.target.value) || 1))}
          min="1"
          step="1"
          className="max-w-[150px]"
        />
      </div>
    )}

    {/* Dubbing (Film/TV/Animation) */}
    {selectedSubType === "Dubbing (Film/TV/Animation)" && (
      <div className="grid gap-4">
        <Label htmlFor="dubbing-hours" className="text-base font-medium">Session Hours (2 hr min):</Label>
        <Input
          id="dubbing-hours"
          type="number"
          value={sessionLength}
          onChange={(e) => setSessionLength(e.target.value)}
          min="0" // We'll enforce the 2hr min in the calc
          step="0.5"
          className="max-w-[150px]"
          placeholder="e.g., 3"
        />
      </div>
    )}

    {/* --- Animation/Dubbing Rate Display --- */}
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
  {/* --- Form for: Video Games / Toys & Games --- */}
{selectedCategory === "video_games_toys" && (
  <div className="grid gap-6">

    {/* Non-Union Video Games */}
    {selectedSubType === "Video Games (Non-Union)" && (
      <div className="grid gap-4">
        <Label className="text-base font-medium">Select Calculation Method:</Label>
        <RadioGroup
          value={gameCalcMethod ?? ""}
          onValueChange={setGameCalcMethod}
          className="grid gap-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="hourly" id="game-hourly" />
            <Label htmlFor="game-hourly" className="cursor-pointer">Per Hour (2 or 4 hr min)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="flat" id="game-flat" />
            <Label htmlFor="game-flat" className="cursor-pointer">Flat Rate (1 hr max)</Label>
          </div>
        </RadioGroup>

        {gameCalcMethod === 'hourly' && (
          <div className="grid gap-4 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
            <Label htmlFor="game-hours" className="text-base font-medium">Session Hours:</Label>
            <Input
              id="game-hours"
              type="number"
              value={sessionLength}
              onChange={(e) => setSessionLength(e.target.value)}
              min="0"
              step="0.5"
              className="max-w-[150px]"
              placeholder="e.g., 4"
            />
          </div>
        )}
      </div>
    )}

    {/* Union Video Games */}
    {selectedSubType === "Video Games (Union)" && (
      <div className="grid gap-4">
        <Label htmlFor="game-union-hours" className="text-base font-medium">Session Hours (Up to 4):</Label>
        <Input
          id="game-union-hours"
          type="number"
          value={sessionLength}
          onChange={(e) => setSessionLength(e.target.value)}
          min="0"
          max="4"
          step="0.5"
          className="max-w-[150px]"
          placeholder="e.g., 4"
        />
      </div>
    )}

    {/* Toys & Games */}
    {selectedSubType === "Toys & Games" && (
      <div className="grid gap-4">
        <Label htmlFor="toys-hours" className="text-base font-medium">Session Hours (Up to 2):</Label>
        <Input
          id="toys-hours"
          type="number"
          value={sessionLength}
          onChange={(e) => setSessionLength(e.target.value)}
          min="0"
          step="0.5"
          className="max-w-[150px]"
          placeholder="e.g., 2"
        />
      </div>
    )}

    {/* Toys & Games (Demo/Scratch) */}
    {selectedSubType === "Toys & Games (Demo/Scratch)" && (
      <div className="grid gap-4">
        <Label htmlFor="toys-demo-hours" className="text-base font-medium">Session Hours:</Label>
        <Input
          id="toys-demo-hours"
          type="number"
          value={sessionLength}
          onChange={(e) => setSessionLength(e.target.value)}
          min="0"
          step="0.5"
          className="max-w-[150px]"
          placeholder="e.g., 1.5"
        />
      </div>
    )}

    {/* Mobile Game Apps (Non-Union Character) */}
    {selectedSubType === "Mobile Game Apps (Non-Union Character)" && (
      <div className="grid gap-4">
        <Label className="text-base font-medium">Select Calculation Method:</Label>
        <RadioGroup
          value={gameCalcMethod ?? ""}
          onValueChange={setGameCalcMethod}
          className="grid gap-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="per_game" id="mobile-game-per-game" />
            <Label htmlFor="mobile-game-per-game" className="cursor-pointer">Per Game</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="hourly" id="mobile-game-hourly" />
            <Label htmlFor="mobile-game-hourly" className="cursor-pointer">Per Hour (2 hr min)</Label>
          </div>
        </RadioGroup>

        {gameCalcMethod === 'per_game' && (
          <div className="grid gap-4 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
            <Label htmlFor="mobile-game-voices" className="text-base font-medium">Number of Voices (Up to 3-4):</Label>
            <Input
              id="mobile-game-voices"
              type="number"
              value={numVoices}
              onChange={(e) => setNumVoices(Math.max(1, Number(e.target.value) || 1))}
              min="1"
              step="1"
              className="max-w-[150px]"
            />
          </div>
        )}

        {gameCalcMethod === 'hourly' && (
          <div className="grid gap-4 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
            <Label htmlFor="mobile-game-hours" className="text-base font-medium">Session Hours (2 hr min):</Label>
            <Input
              id="mobile-game-hours"
              type="number"
              value={sessionLength}
              onChange={(e) => setSessionLength(e.target.value)}
              min="0"
              step="0.5"
              className="max-w-[150px]"
              placeholder="e.g., 2"
            />
          </div>
        )}
      </div>
    )}

    {/* Mobile Game Apps (Union Character) */}
    {selectedSubType === "Mobile Game Apps (Union Character)" && (
      <div className="grid gap-4">
        <Label htmlFor="mobile-union-hours" className="text-base font-medium">Session Hours (Up to 4):</Label>
        <Input
          id="mobile-union-hours"
          type="number"
          value={sessionLength}
          onChange={(e) => setSessionLength(e.target.value)}
          min="0"
          max="4"
          step="0.5"
          className="max-w-[150px]"
          placeholder="e.g., 4"
        />
      </div>
    )}

    {/* Mobile Game Apps (E-Learning/Educational) */}
    {selectedSubType === "Mobile Game Apps (E-Learning/Educational)" && (
      <div className="grid gap-4">
        <Label htmlFor="mobile-elearn-minutes" className="text-base font-medium">Finished Minutes:</Label>
        <Input
          id="mobile-elearn-minutes"
          type="number"
          value={finishedMinutes}
          onChange={(e) => setFinishedMinutes(e.target.value)}
          min="0"
          step="1"
          className="max-w-[150px]"
          placeholder="e.g., 8"
        />
      </div>
    )}

    {/* --- Video Games Rate Display --- */}
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
{/* --- Form for: Promo & Imaging --- */}
{selectedCategory === "promo_imaging" && (
  <div className="grid gap-6">

    {/* TV */}
    {selectedSubType === "TV" && (
      <div className="grid gap-4">
        <Label className="text-base font-medium">Select Market:</Label>
        <RadioGroup
          value={selectedPromoMarket ?? ""}
          onValueChange={setSelectedPromoMarket}
          className="grid gap-2"
        >
          {Object.keys(promoTvRates).map((market) => (
            <div key={market} className="flex items-center space-x-2">
              <RadioGroupItem value={market} id={`promo-tv-${market}`} />
              <Label htmlFor={`promo-tv-${market}`} className="cursor-pointer">{market}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    )}

    {/* Radio */}
    {selectedSubType === "Radio" && (
      <div className="grid gap-4">
        <Label className="text-base font-medium">Select Market:</Label>
        <RadioGroup
          value={selectedPromoMarket ?? ""}
          onValueChange={setSelectedPromoMarket}
          className="grid gap-2"
        >
          {Object.keys(promoRadioRates).map((market) => (
            <div key={market} className="flex items-center space-x-2">
              <RadioGroupItem value={market} id={`promo-radio-${market}`} />
              <Label htmlFor={`promo-radio-${market}`} className="cursor-pointer">{market}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    )}

    {/* Trailers */}
    {selectedSubType === "Trailers" && (
      <div className="grid gap-4">
        <Label className="text-base font-medium">Select Market:</Label>
        <RadioGroup
          value={selectedPromoMarket ?? ""}
          onValueChange={setSelectedPromoMarket}
          className="grid gap-2"
        >
          {Object.keys(promoTrailerRates).map((market) => (
            <div key={market} className="flex items-center space-x-2">
              <RadioGroupItem value={market} id={`promo-trailer-${market}`} />
              <Label htmlFor={`promo-trailer-${market}`} className="cursor-pointer">{market}</Label> 
            </div>
          ))}
        </RadioGroup>
      </div>
    )}

    {/* --- Promo & Imaging Rate Display --- */}
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
                {/* --- Form for: Audiobooks --- */}
{selectedCategory === "audiobooks" && (
  <div className="grid gap-6">

    {/* PFH Inputs */}
    {(selectedSubType === "Union Scale – PFH" || selectedSubType === "Non-Union – PFH" || selectedSubType === "Hybrid Agreement") && (
      <div className="grid gap-4">
        <Label htmlFor="audiobook-pfh" className="text-base font-medium">Enter Per Finished Hour (PFH):</Label>
        <Input
          id="audiobook-pfh"
          type="number"
          value={finishedHours}
          onChange={(e) => setFinishedHours(e.target.value)}
          min="0"
          step="0.5"
          className="max-w-[150px]"
          placeholder="e.g., 8.5"
        />
      </div>
    )}

    {/* Raw/Production Hour Inputs */}
    {(selectedSubType === "Per RAW Hour" || selectedSubType === "Production Add-On") && (
      <div className="grid gap-4">
        <Label htmlFor="audiobook-raw" className="text-base font-medium">Enter Hours:</Label>
        <Input
          id="audiobook-raw"
          type="number"
          value={numberOfHours}
          onChange={(e) => setNumberOfHours(Math.max(1, Number(e.target.value) || 1))}
          min="1"
          step="0.5"
          className="max-w-[150px]"
        />
      </div>
    )}

    {/* --- Audiobooks Rate Display --- */}
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
                {/* --- Form for: IVR / Message-on-Hold --- */}
{selectedCategory === "ivr_message_on_hold" && (
  <div className="grid gap-6">

    {/* --- Inputs for: Direct Quote --- */}
    {selectedSubType === "Direct Quote" && (
      <div className="grid gap-6">
        <div className="grid gap-4">
          <Label className="text-base font-medium">Select Calculation Model:</Label>
          <RadioGroup
            value={selectedIvrModel ?? ""}
            onValueChange={setSelectedIvrModel}
            className="grid gap-2"
          >
            <div className="flex items-center space-x-2"><RadioGroupItem value="ivr_min" id="ivr-min" /><Label htmlFor="ivr-min">IVR (Suggested Minimum)</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="ivr_prompt" id="ivr-prompt" /><Label htmlFor="ivr-prompt">IVR (Per Prompt)</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="ivr_word" id="ivr-word" /><Label htmlFor="ivr-word">IVR (Per Word - RAW)</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="ivr_hour" id="ivr-hour" /><Label htmlFor="ivr-hour">IVR (Per Hour - RAW)</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="moh_min" id="moh-min" /><Label htmlFor="moh-min">Message-On-Hold (Minimum)</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="moh_min_rate" id="moh-min-rate" /><Label htmlFor="moh-min-rate">Message-On-Hold (Per Minute)</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="moh_para" id="moh-para" /><Label htmlFor="moh-para">Message-On-Hold (Per Paragraph)</Label></div>
          </RadioGroup>
        </div>

        {/* Conditional Inputs for Direct Quote */}
        {selectedIvrModel === 'ivr_prompt' && (
          <div className="grid gap-4 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
            <Label htmlFor="ivr-prompts" className="text-base font-medium">Enter Number of Prompts:</Label>
            <Input id="ivr-prompts" type="number" value={numPrompts > 0 ? numPrompts : ''} onChange={(e) => setNumPrompts(Math.max(0, Number(e.target.value) || 0))} min="0" className="max-w-[150px]" placeholder="e.g., 10" />
          </div>
        )}
        {selectedIvrModel === 'ivr_word' && (
          <div className="grid gap-4 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
            <Label htmlFor="ivr-wordcount" className="text-base font-medium">Enter Word Count:</Label>
            <Input id="ivr-wordcount" type="number" value={wordCount > 0 ? wordCount : ''} onChange={(e) => setWordCount(Math.max(0, Number(e.target.value) || 0))} min="0" className="max-w-[150px]" placeholder="e.g., 500" />
          </div>
        )}
        {selectedIvrModel === 'ivr_hour' && (
          <div className="grid gap-4 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
            <Label htmlFor="ivr-hours" className="text-base font-medium">Enter Raw Hours:</Label>
            <Input id="ivr-hours" type="number" value={numberOfHours} onChange={(e) => setNumberOfHours(Math.max(1, Number(e.target.value) || 1))} min="1" step="0.5" className="max-w-[150px]" />
          </div>
        )}
        {selectedIvrModel === 'moh_min_rate' && (
          <div className="grid gap-4 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
            <Label htmlFor="moh-minutes" className="text-base font-medium">Enter Finished Minutes:</Label>
            <Input id="moh-minutes" type="number" value={finishedMinutes} onChange={(e) => setFinishedMinutes(e.target.value)} min="0" step="0.5" className="max-w-[150px]" placeholder="e.g., 5" />
          </div>
        )}
        {selectedIvrModel === 'moh_para' && (
          <div className="grid gap-4 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
            <Label htmlFor="moh-paras" className="text-base font-medium">Enter Number of Paragraphs:</Label>
            <Input id="moh-paras" type="number" value={numParagraphs > 0 ? numParagraphs : ''} onChange={(e) => setNumParagraphs(Math.max(0, Number(e.target.value) || 0))} min="0" className="max-w-[150px]" placeholder="e.g., 4" />
          </div>
        )}
      </div>
    )}

    {/* --- Inputs for: Roster Talent --- */}
    {selectedSubType === "Roster Talent" && (
      <div className="grid gap-6">
        <div className="grid gap-4">
          <Label className="text-base font-medium">Select Roster Model:</Label>
          <RadioGroup
            value={selectedRosterModel ?? ""}
            onValueChange={setSelectedRosterModel}
            className="grid gap-2"
          >
            <div className="flex items-center space-x-2"><RadioGroupItem value="prod_house" id="roster-prod" /><Label htmlFor="roster-prod">Production House (Per Paragraph)</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="other_hourly" id="roster-other" /><Label htmlFor="roster-other">Other (Per 1/2 Hour Booth Time)</Label></div>
          </RadioGroup>
        </div>

        {/* Conditional Inputs for Roster Talent */}
        {selectedRosterModel === 'prod_house' && (
          <div className="grid gap-4 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
            <Label htmlFor="roster-paras" className="text-base font-medium">Enter Number of Paragraphs:</Label>
            <Input id="roster-paras" type="number" value={numParagraphs > 0 ? numParagraphs : ''} onChange={(e) => setNumParagraphs(Math.max(0, Number(e.target.value) || 0))} min="0" className="max-w-[150px]" placeholder="e.g., 20" />
          </div>
        )}
        {selectedRosterModel === 'other_hourly' && (
          <div className="grid gap-4 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
            <Label htmlFor="roster-hours" className="text-base font-medium">Enter Total Booth Hours:</Label>
            <Input id="roster-hours" type="number" value={numberOfHours} onChange={(e) => setNumberOfHours(Math.max(0.5, Number(e.target.value) || 0.5))} min="0.5" step="0.5" className="max-w-[150px]" placeholder="e.g., 1.5" />
          </div>
        )}
      </div>
    )}

    {/* --- IVR Rate Display --- */}
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
                {/* --- Form for: Cinema / Events --- */}
{selectedCategory === "cinema_events" && (
  <div className="grid gap-6">

    {/* --- Inputs for: Cinema Usage (1-3 States) --- */}
    {selectedSubType === "Cinema Usage – Term (1–3 States)" && (
      <div className="grid gap-4">
        <Label className="text-base font-medium">Select Term:</Label>
        <RadioGroup
          value={selectedTerm ?? ""}
          onValueChange={setSelectedTerm}
          className="grid gap-2"
        >
          {Object.keys(cinemaRates1to3States).map((term) => (
            <div key={term} className="flex items-center space-x-2">
              <RadioGroupItem value={term} id={`cinema-1-3-${term}`} />
              <Label htmlFor={`cinema-1-3-${term}`} className="cursor-pointer">{term}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    )}

    {/* --- Inputs for: Cinema Usage (4+ States) --- */}
    {selectedSubType === "Cinema Usage – Term (4+ States)" && (
      <div className="grid gap-4">
        <Label className="text-base font-medium">Select Term:</Label>
        <RadioGroup
          value={selectedTerm ?? ""}
          onValueChange={setSelectedTerm}
          className="grid gap-2"
        >
          {Object.keys(cinemaRates4PlusStates).map((term) => (
            <div key={term} className="flex items-center space-x-2">
              <RadioGroupItem value={term} id={`cinema-4-plus-${term}`} />
              <Label htmlFor={`cinema-4-plus-${term}`} className="cursor-pointer">{term}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    )}

    {/* --- Inputs for: Event Video --- */}
    {selectedSubType === "Event Video" && (
      <div className="grid gap-6">
        <div className="grid gap-4">
          <Label className="text-base font-medium">Select Term:</Label>
          <RadioGroup
            value={selectedTerm ?? ""}
            onValueChange={setSelectedTerm}
            className="grid gap-2"
          >
            <div className="flex items-center space-x-2"><RadioGroupItem value="1 Year" id="event-1y" /><Label htmlFor="event-1y">1 Year</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="Full Buyout" id="event-buyout" /><Label htmlFor="event-buyout">Full Buyout</Label></div>
          </RadioGroup>
        </div>
        <div className="grid gap-4">
          <Label htmlFor="event-hours" className="text-base font-medium">Enter Total Hours:</Label>
          <Input id="event-hours" type="number" value={numberOfHours} onChange={(e) => setNumberOfHours(Math.max(1, Number(e.target.value) || 1))} min="1" step="0.5" className="max-w-[150px]" />
        </div>
      </div>
    )}

    {/* --- Inputs for: Trade Shows / Sporting Events --- */}
    {selectedSubType === "Trade Shows / Sporting Events" && (
      <div className="grid gap-6">
        <div className="grid gap-4">
          <Label className="text-base font-medium">Select Term:</Label>
          <RadioGroup
            value={selectedTerm ?? ""}
            onValueChange={setSelectedTerm}
            className="grid gap-2"
          >
            <div className="flex items-center space-x-2"><RadioGroupItem value="1 Year" id="trade-1y" /><Label htmlFor="trade-1y">1 Year</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="Full Buyout" id="trade-buyout" /><Label htmlFor="trade-buyout">Full Buyout</Label></div>
          </RadioGroup>
        </div>
        <div className="grid gap-4">
          <Label htmlFor="trade-hours" className="text-base font-medium">Enter Total Hours:</Label>
          <Input id="trade-hours" type="number" value={numberOfHours} onChange={(e) => setNumberOfHours(Math.max(1, Number(e.target.value) || 1))} min="1" step="0.5" className="max-w-[150px]" />
        </div>
      </div>
    )}

    {/* --- Cinema/Events Rate Display --- */}
    {calculatedRate && (
      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">GVAA Rate Range:</p>
        <p className="text-2xl font-semibold text-green-700 dark:text-green-300">
          {calculatedRate}
        </Done)
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
