"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils"; // Import cn utility if you haven't already

interface CartItem {
  id: string; // A unique ID for React
  description: string; // e.g., "Local TV - 1 Year"
  rate: string;      // e.g., "$1,250–$2,250"
  low: number;
  high: number;
}
interface RateInfo {
  text: string;  // e.g., "$400–$600"
  low: number;
  high: number;
  description: string; // e.g., "Paid Social - 3 Months"
}

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
const studioFeeRates = {
  "ISDN / Source Connect": { low: 25, high: 100 },
  "Phone Patch": { low: 10, high: 25 },
  "Editing (breaths/clicks/sequencing)": { low: 25, high: 50 },
};


export function RateCalculatorUI() {
  
  return (
  <div className="p-4">
    <Card>
      <CardContent>
        <div />
      </CardContent>
    </Card>
  </div>
);
}
