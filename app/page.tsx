"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Download, FileText, RefreshCw, Info } from "lucide-react";
// Password Gate Component
const BETA_PASSWORD = "beta2025";

function PasswordGate({ children }: { children: React.ReactNode }) {
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === BETA_PASSWORD) {
      setIsUnlocked(true);
      setError('');
    } else {
      setError('Invalid password. Please try again.');
      setPassword('');
    }
  };

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>MyVoBiz Calculator - Beta Access</CardTitle>
          <CardDescription>
            This calculator is currently in private beta. Enter your access code to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Access Code</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter beta access code"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            <Button type="submit" className="w-full">
              Access Calculator
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// -----------------------------
// Config: Platforms & Fees
// -----------------------------
const PLATFORM_FEES = {
  "Voices.com": { feePct: 0.2 },
  Upwork: { feePct: 0.1, notes: "Upwork tiers exist. Defaulting to 10% for $500–$10K." },
  Fiverr: { feePct: 0.2 },
  Voice123: { feePct: 0, notes: "Set 5% if using Safe Payment." },
  Bodalgo: { feePct: 0 },
  Voquent: { feePct: 0 },
  "Direct Client": { feePct: 0 },
};

// -----------------------------
// Config: GVAA reference ranges (USD)
// -----------------------------

// IVR / Telephony
const GVAA_IVR = {
  minimum: 150,
  perPrompt: { baseLow: 150, baseHigh: 200, promptLow: 1, promptHigh: 5 },
  perWord: { low: 0.08, high: 0.25 },
  perHour: { low: 50, high: 200 },
  moh: { minimum: 200, perMinute: 100, perParagraph: 8 },
};

// Internal / Corporate (hourly session)
const GVAA_INTERNAL = {
  firstHour: 525,
  addlHalfHour: 262,
  finishedMinute: [
    { min: 1, max: 2, low: 350, high: 450 },
    { min: 3, max: 5, low: 450, high: 550 },
    { min: 5, max: 10, low: 600, high: 700 },
    { min: 10, max: 15, low: 700, high: 800 },
    { min: 15, max: 20, low: 800, high: 950 },
    { min: 20, max: 30, low: 950, high: 1250 },
    { min: 30, max: 40, low: 1250, high: 1750 },
    { min: 40, max: 60, low: 1750, high: 2350 },
  ]
};

// Explainers (Non-Broadcast)
const GVAA_EXPLAINER = {
  singleVideo: { low: 300, high: 525, maxSeconds: 90 },
  bulkBase: 250,
  bulkAddlPer100: 50,
};

// Digital Visual - Paid Social
const GVAA_PAID_SOCIAL = {
  oneMonth: { low: 300, high: 450 },
  threeMonths: { low: 400, high: 750 },
  oneYear: { low: 1000, high: 1500 }
};

// Digital Visual - Online Pre-Roll/OLV
const GVAA_OLV = {
  oneMonth: { low: 650, high: 800 },
  threeMonths: { low: 750, high: 1100 },
  oneYear: { low: 2250, high: 3000 }
};

// Digital Visual - OTT/CTV
const GVAA_OTT = {
  oneMonth: { low: 1250, high: 1750 },
  threeMonths: { low: 1500, high: 2250 },
  oneYear: { low: 4000, high: 6000 }
};

// Digital Visual - Non-Paid Web
const GVAA_NONPAID_WEB = {
  threeMonths: { low: 300, high: 500 },
  oneYear: { low: 500, high: 700 },
  threeYears: { low: 900, high: 1100 },
  fiveYears: { low: 1300, high: 1500 }
};

// Trade Shows / Sporting Events
const GVAA_TRADESHOW = {
  oneYear: { firstHour: { low: 600, high: 700 }, addlHour: { low: 300, high: 350 } },
  fullBuyout: { firstHour: { low: 2000, high: 2100 }, addlHour: { low: 1000, high: 1100 } }
};

// Event Video
const GVAA_EVENT = {
  oneYear: { firstHour: { low: 600, high: 700 }, addlHour: { low: 300, high: 350 } },
  fullBuyout: { firstHour: { low: 2000, high: 2100 }, addlHour: { low: 1000, high: 1100 } }
};

// Cinema Usage
const GVAA_CINEMA = {
  small: {
    oneMonth: 300,
    threeMonths: { low: 425, high: 550 },
    sixMonths: { low: 800, high: 950 },
    oneYear: { low: 1200, high: 1350 }
  },
  large: {
    oneMonth: 500,
    threeMonths: { low: 800, high: 1050 },
    sixMonths: { low: 1600, high: 2000 },
    oneYear: { low: 2400, high: 3000 }
  }
};

// Toys & Games
const GVAA_TOYS = {
  toysGames: { low: 500, high: 750, addlHourLow: 200, addlHourHigh: 250 },
  mobilePerGame: { low: 300, high: 500 },
  mobileHourly: { low: 200, high: 300, minHours: 2 }
};

// Dubbing
const GVAA_DUBBING = {
  union: { hourly: 181.5, minHours: 2 },
  nonUnion: { hourly: 125, minHours: 2 }
};

// Animation (Non-Union Original)
const GVAA_ANIMATION = {
  episode22min: { low: 1100, high: 1200 }, // Up to 4 hrs, 2 voices
  episode11min: { low: 400, high: 700 },   // Up to 2 hrs, 2 characters
  hourly22min: { low: 450, high: 600 },    // Alt: hourly for 22-min
  hourly11min: { low: 250, high: 350 }     // Alt: hourly for 11-min
};

// Radio
const GVAA_RADIO = {
  local: {
    oneMonth: { low: 275, high: 400 },
    threeMonths: { low: 350, high: 600 },
    oneYear: { low: 900, high: 1500 },
  },
  national: {
    oneMonth: { low: 550, high: 700 },
    threeMonths: { low: 750, high: 1000 },
    oneYear: { low: 1500, high: 2500 },
  },
  digital: {
    oneMonth: { low: 550, high: 700 },
    threeMonths: { low: 750, high: 1000 },
    oneYear: { low: 1750, high: 2500 },
  }
};

// Lobby Viewing
const GVAA_LOBBY = {
  explainer: { firstHour: 525, addlHour: 262 }
  // Retail uses TV broadcast rates
};

// Medical / Technical Narration
const GVAA_MEDICAL = {
  perWord: { low: 0.25, high: 0.50 },
  finishedMinute: [
    { min: 1, max: 2, low: 400, high: 500 },
    { min: 3, max: 5, low: 600, high: 700 },
    { min: 5, max: 10, low: 700, high: 800 },
    { min: 10, max: 15, low: 800, high: 900 },
    { min: 15, max: 20, low: 900, high: 1000 },
    { min: 20, max: 30, low: 1000, high: 1400 },
    { min: 30, max: 40, low: 1400, high: 1900 },
    { min: 40, max: 60, low: 1900, high: 2400 },
  ]
};

// YouTube Content
const GVAA_YOUTUBE = {
  narration: { low: 750, high: 1000 },
  channelIntro: { low: 500, high: 2000 }
};

// Podcasts
const GVAA_PODCAST = {
  introOutro: { low: 300, high: 400 },
  nonPrincipal: { low: 400, high: 500 },
  principal: { low: 800, high: 1000 }
};

// Airport Announcements
const GVAA_AIRPORT = {
  firstAirport: { low: 1500, high: 2000 },
  additionalAirport: { low: 1000, high: 1500 }
};

// Museum Tours - Educational
const GVAA_MUSEUM = {
  audioTour: { firstHour: 505, addlHalfHour: 148 }, // Industrial CAT 1
  exhibition: { firstHour: 563, addlHalfHour: 148 }  // Industrial CAT 2
};

// PSA (Public Service Announcement)
const GVAA_PSA = {
  sixtyOrLess: { low: 500, high: 600 }
};

// Digital Greeting Cards
const GVAA_DIGITAL_GREETING = {
  fullBuyout: { low: 750, high: 1000 }
};

// Audiobooks
const GVAA_AUDIOBOOK = {
  unionPFH: { low: 150, high: 225 },
  nonUnionPFH: { low: 200, high: 500 },
  perRawHour: 225,
  productionAddon: { low: 75, high: 125 },
  hybrid: { pfh: 100, note: "Plus royalty share" }
};

// E-learning rates
const GVAA_ELEARNING = {
  perWord: { 
    standard: { low: 0.20, high: 0.35 },
    technical: { low: 0.35, high: 0.50 },
    bulk: { low: 0.15, high: 0.20 }  // >50k words
  },
  perFinishedMinute: { low: 30, high: 55 },
  perRawHour: { low: 600, high: 2400 },
  perFinishedHour: { low: 1500, high: 3300 },
  directedSession: { firstHour: 0, additionalHourLow: 150, additionalHourHigh: 300 }
};

// TV / Commercial rates
const GVAA_TV = {
  local: {
    oneMonth: { low: 400, high: 750 },
    threeMonths: { low: 650, high: 1000 },
    oneYear: { low: 1250, high: 2250 },
  },
  regional: {
    oneMonth: { low: 400, high: 750 },
    threeMonths: { low: 650, high: 1000 },
    oneYear: { low: 1250, high: 2250 },
  },
  national: {
    oneMonth: { low: 1000, high: 1500 },
    threeMonths: { low: 1750, high: 2500 },
    oneYear: { low: 4000, high: 8000 },
  },
};

// Games
const GVAA_GAMES = {
  mobileCharacter: { 
    perGame: { low: 300, high: 500 }, 
    hourly: { low: 200, high: 350 }, 
    sessionMinHours: 2 
  },
  unionSession: 825.5,
  educational: { 
    fiveMin: { low: 350, high: 400 }, 
    tenMin: 600 
  },
  extraVoiceFee: { low: 75, high: 100 },
};

// TV Promo & Imaging
const GVAA_TV_PROMO = {
  local: { low: 150, high: 300 },
  regional: { low: 450, high: 600 },
  national: { low: 750, high: 1000 },
};

// Radio Promo & Imaging
const GVAA_RADIO_PROMO = {
  local: { low: 150, high: 200 },
  regional: { low: 350, high: 500 },
  national: { low: 600, high: 850 },
};

// Trailers
const GVAA_TRAILERS = {
  local: 100,
  regional: { low: 325, high: 500 },
  national: { low: 1500, high: 2000 }
};

// Infomercial / DRTV
const GVAA_INFOMERCIAL = {
  national: 1750,
  northAmerica: 2500
};

// In-Show / Documentary Narration
const GVAA_INSHOW = {
  twentyFourMin: { low: 1000, high: 1500 },
  fortyEightMin: { low: 2000, high: 3000 }
};

// -----------------------------
// Persist helper
// -----------------------------
const LS_KEY = "gvaa_calc_state_v3";

function usePersistentState<T>(key: string, initial: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);
  return [state, setState];
}

// -----------------------------
// Types & Constants
// -----------------------------

const TERRITORIES = [
  "Local",
  "City",
  "State/Province",
  "Regional",
  "National",
  "North America",
  "Worldwide",
];

// -----------------------------
// Defaults
// -----------------------------
type CalculatorState = {
  platform: string | undefined;
  currency: "USD" | "EUR" | "GBP" | "CAD" | "AUD";
  usage: string | undefined;
  budgetInput: string;
  safePayment: boolean;
  liveDirection: boolean;
  liveDirectionMinutes: string | undefined;
  fileSplits: string;
  commercialSale: boolean;
  ivrModel: string | undefined;
  ivrPromptCount: string | undefined;
  gamesModel: string | undefined;
  gameExtraVoices: string | undefined;
  promoMarket: string | undefined;
  radioPromoMarket: string | undefined;
  trailerMarket: string | undefined;
  infomercialMarket: string | undefined;
  inshowLength: string | undefined;
  termMonths: number | undefined;
  territory: string;
  spotLengthSeconds: number | undefined;
  explainerModel: string | undefined;
  videoCount: number | undefined;
  avgWords: string;
  wordCount: string;
  minutes: string;
  finishedHours: string;
  elearningModel: string | undefined;
  elearningWordType: string;
  internalModel: string | undefined;
  recordingHours: string;
  audiobookModel: string | undefined;
  audiobookHours: string;
  kioskHours: string;
  museumModel: string | undefined;
  museumHours: string;
  airportCount: string;
  podcastRole: string | undefined;
  youtubeType: string | undefined;
  medicalModel: string | undefined;
  medicalMinutes: string;
  medicalWords: string;
  lobbyType: string | undefined;
  lobbyHours: string;
  radioMarket: string | undefined;
  radioTerm: number | undefined;
  animationLength: string | undefined;
  dubbingType: string | undefined;
  dubbingHours: string;
  toysModel: string | undefined;
  toysHours: string;
  cinemaStates: string | undefined;
  cinemaTerm: number | undefined;
  eventType: string | undefined;
  eventHours: string;
  tradeshowType: string | undefined;
  tradeshowHours: string;
  nonPaidWebTerm: number | undefined;
  paidSocialTerm: number | undefined;
  olvTerm: number | undefined;
  ottTerm: number | undefined;
  notes: string;
};
const DEFAULT_STATE: CalculatorState = {
  platform: undefined,
  currency: "USD",
  usage: undefined,
  budgetInput: "",
  safePayment: false,
  liveDirection: false,
  liveDirectionMinutes: undefined,
  fileSplits: "",
  commercialSale: false,
  ivrModel: undefined,
  ivrPromptCount: undefined,
  gamesModel: undefined,
  gameExtraVoices: undefined,
  promoMarket: undefined,
  radioPromoMarket: undefined,
  trailerMarket: undefined,
  infomercialMarket: undefined,
  inshowLength: undefined,
  termMonths: undefined,
  territory: "",
  spotLengthSeconds: undefined,
  explainerModel: undefined,
  videoCount: undefined,
  avgWords: "",
  wordCount: "",
  minutes: "",
  finishedHours: "",
  elearningModel: undefined,
  elearningWordType: "standard",
  internalModel: undefined,
  recordingHours: "",
  audiobookModel: undefined,
  audiobookHours: "",
  kioskHours: "",
  museumModel: undefined,
  museumHours: "",
  airportCount: "",
  podcastRole: undefined,
  youtubeType: undefined,
  medicalModel: undefined,
  medicalMinutes: "",
  medicalWords: "",
  lobbyType: undefined,
  lobbyHours: "",
  radioMarket: undefined,
  radioTerm: undefined,
  animationLength: undefined,
  dubbingType: undefined,
  dubbingHours: "",
  toysModel: undefined,
  toysHours: "",
  cinemaStates: undefined,
  cinemaTerm: undefined,
  eventType: undefined,
  eventHours: "",
  tradeshowType: undefined,
  tradeshowHours: "",
  nonPaidWebTerm: undefined,
  paidSocialTerm: undefined,
  olvTerm: undefined,
  ottTerm: undefined,
  notes: "",
};

// -----------------------------
// Utilities
// -----------------------------
const fmt = (n: number, currency: "USD" | "EUR" | "GBP" | "CAD" | "AUD" = "USD") => new Intl.NumberFormat(undefined, { style: "currency", currency }).format(n);
const toPct = (v: number) => `${Math.round(v * 100)}%`;

const parseMoney = (s: string) => {
  if (!s) return { low: 0, high: 0, isSingle: true };
  
  // First check if it's a range (contains dash, "to", or multiple numbers)
  const str = String(s).trim();
  
  // Try to match range patterns: "250-700", "250 - 700", "250 to 700", "250/700"
  const rangeMatch = str.match(/(\d+(?:\.\d+)?)\s*[-–—to/]\s*(\d+(?:\.\d+)?)/i);
  
  if (rangeMatch) {
    const low = Number(rangeMatch[1]);
    const high = Number(rangeMatch[2]);
    return { 
      low: isFinite(low) ? low : 0, 
      high: isFinite(high) ? high : 0, 
      isSingle: false 
    };
  }
  
  // Single number - strip out non-numeric except decimal
  const cleaned = str.replace(/[^\d.]/g, '');
  const n = Number(cleaned);
  
  if (isFinite(n) && n > 0) {
    return { low: n, high: n, isSingle: true };
  }
  
  return { low: 0, high: 0, isSingle: true };
};

function computePlatformNet(grossClient: number, platform: string | undefined, safePayment: boolean) {
  let feePct = platform ? PLATFORM_FEES[platform as keyof typeof PLATFORM_FEES]?.feePct ?? 0 : 0;
  if (platform === "Voice123" && safePayment) feePct = 0.05;
  const net = grossClient * (1 - feePct);
  return { feePct, net };
}

function anchorGVAAHigh(usage: string | undefined, fs: typeof DEFAULT_STATE) {
  if (!usage) return 0;
  
  // Helper to safely parse numeric strings
  const parseNum = (val: string | number | undefined | null) => {
    if (val === "" || val === undefined || val === null) return 0;
    const num = Number(val);
    return isFinite(num) ? num : 0;
  };
  
  // Audiobook calculation (moved outside switch due to switch statement issue)
  if (usage === "Audiobook" || usage === "Audiobooks") {
    const hours = parseNum(fs.finishedHours);
    const model = fs.audiobookModel;
    
    if (!model || hours <= 0) return 0;
    
    if (model === "Union PFH") {
      return hours * GVAA_AUDIOBOOK.unionPFH.high;
    } else if (model === "Non-Union PFH") {
      return hours * GVAA_AUDIOBOOK.nonUnionPFH.high;
    } else if (model === "Per Raw Hour") {
      return hours * GVAA_AUDIOBOOK.perRawHour;
    } else if (model === "Hybrid") {
      return hours * GVAA_AUDIOBOOK.hybrid.pfh;
    }
    
    return 0;
  }
  
  // Digital Greeting Cards - flat buyout
  if (usage === "Digital Greeting Cards") {
    return GVAA_DIGITAL_GREETING.fullBuyout.high;
  }
  
  // PSA - flat rate for :60 or less
  if (usage === "PSA") {
    return GVAA_PSA.sixtyOrLess.high;
  }
  
  // Kiosk (Non-Retail) - uses Internal recording time rates
  if (usage === "Kiosk") {
    const hours = parseNum(fs.kioskHours);
    if (hours <= 0) return 0;
    
    let total = GVAA_INTERNAL.firstHour;
    if (hours > 1) {
      const additionalHalfHours = Math.ceil((hours - 1) * 2);
      total += additionalHalfHours * GVAA_INTERNAL.addlHalfHour;
    }
    return total;
  }
  
  // Museum Tours - Educational
  if (usage === "Museum Tours") {
    if (!fs.museumModel) return 0;
    const hours = parseNum(fs.museumHours);
    if (hours <= 0) return 0;
    
    const rates = fs.museumModel === "Audio Tour" 
      ? GVAA_MUSEUM.audioTour 
      : GVAA_MUSEUM.exhibition;
    
    let total = rates.firstHour;
    if (hours > 1) {
      const additionalHalfHours = Math.ceil((hours - 1) * 2);
      total += additionalHalfHours * rates.addlHalfHour;
    }
    return total;
  }
  
  // Airport Announcements
  if (usage === "Airport") {
    const count = Math.max(1, parseNum(fs.airportCount)); // Default to 1 if empty
    
    let total = GVAA_AIRPORT.firstAirport.high;
    if (count > 1) {
      total += (count - 1) * GVAA_AIRPORT.additionalAirport.high;
    }
    return total;
  }
  
  // Podcasts
  if (usage === "Podcasts") {
    if (!fs.podcastRole) return 0;
    
    switch (fs.podcastRole) {
      case "Intro/Outro":
        return GVAA_PODCAST.introOutro.high;
      case "Non-Principal":
        return GVAA_PODCAST.nonPrincipal.high;
      case "Principal":
        return GVAA_PODCAST.principal.high;
      default:
        return 0;
    }
  }
  
  // YouTube Content
  if (usage === "YouTube") {
    if (!fs.youtubeType) return 0;
    
    if (fs.youtubeType === "Narration") {
      return GVAA_YOUTUBE.narration.high;
    } else if (fs.youtubeType === "Channel Intro/Outro") {
      return GVAA_YOUTUBE.channelIntro.high;
    }
    return 0;
  }
  
  // Medical/Technical Narration
  if (usage === "Medical/Technical") {
    if (!fs.medicalModel) return 0;
    
    if (fs.medicalModel === "Per Word") {
      const words = parseNum(fs.medicalWords);
      if (words <= 0) return 0;
      return words * GVAA_MEDICAL.perWord.high;
    } else if (fs.medicalModel === "Per Finished Minute") {
      const mins = parseNum(fs.medicalMinutes);
      if (mins <= 0) return 0;
      
      // Find the appropriate tier
      for (const tier of GVAA_MEDICAL.finishedMinute) {
        if (mins >= tier.min && mins <= tier.max) {
          return tier.high;
        }
      }
      // If over 60 minutes, use the highest tier
      return GVAA_MEDICAL.finishedMinute[GVAA_MEDICAL.finishedMinute.length - 1].high;
    }
    return 0;
  }
  
  // Lobby Viewing
  if (usage === "Lobby Viewing") {
    if (!fs.lobbyType) return 0;
    
    if (fs.lobbyType === "Explainer") {
      const hours = Math.max(1, parseNum(fs.lobbyHours)); // Default to 1 hour
      
      let total = GVAA_LOBBY.explainer.firstHour;
      if (hours > 1) {
        total += (hours - 1) * GVAA_LOBBY.explainer.addlHour;
      }
      return total;
    } else if (fs.lobbyType === "Retail") {
      // Retail uses TV Commercial rates - return 0 and show note
      return 0;
    }
    return 0;
  }
  
  // Radio
  if (usage === "Radio") {
    if (!fs.radioMarket || !fs.radioTerm) return 0;
    
    let tier = "local";
    if (fs.radioMarket === "National") tier = "national";
    else if (fs.radioMarket === "Digital Radio") tier = "digital";
    
    let termKey = "oneYear";
    if (fs.radioTerm === 1) termKey = "oneMonth";
    else if (fs.radioTerm === 3) termKey = "threeMonths";
    
    return GVAA_RADIO[tier as keyof typeof GVAA_RADIO]?.[termKey as keyof typeof GVAA_RADIO.local]?.high || 0;
  }
  
  // Animation
  if (usage === "Animation") {
    if (!fs.animationLength) return 0;
    
    if (fs.animationLength === "22-min Episode") {
      return GVAA_ANIMATION.episode22min.high;
    } else if (fs.animationLength === "11-min Episode") {
      return GVAA_ANIMATION.episode11min.high;
    }
    return 0;
  }
  
  // Dubbing
  if (usage === "Dubbing") {
    if (!fs.dubbingType) return 0;
    
    const hours = Math.max(2, parseNum(fs.dubbingHours)); // Default to 2-hr minimum
    
    if (fs.dubbingType === "Union") {
      return hours * GVAA_DUBBING.union.hourly;
    } else if (fs.dubbingType === "Non-Union") {
      return hours * GVAA_DUBBING.nonUnion.hourly;
    }
    return 0;
  }
  
  // Toys & Games
  if (usage === "Toys & Games") {
    if (!fs.toysModel) return 0;
    
    if (fs.toysModel === "Toys & Games") {
      const hours = Math.max(2, parseNum(fs.toysHours)); // Default to 2 hrs
      let total = GVAA_TOYS.toysGames.high;
      if (hours > 2) {
        total += (hours - 2) * GVAA_TOYS.toysGames.addlHourHigh;
      }
      return total;
    } else if (fs.toysModel === "Mobile Per Game") {
      return GVAA_TOYS.mobilePerGame.high;
    } else if (fs.toysModel === "Mobile Hourly") {
      const hours = Math.max(2, parseNum(fs.toysHours));
      return hours * GVAA_TOYS.mobileHourly.high;
    }
    return 0;
  }
  
  // Cinema Usage
  if (usage === "Cinema") {
    if (!fs.cinemaStates || !fs.cinemaTerm) return 0;
    
    const tier = fs.cinemaStates === "1-3 States" ? "small" : "large";
    
    let termKey = "oneYear";
    if (fs.cinemaTerm === 1) termKey = "oneMonth";
    else if (fs.cinemaTerm === 3) termKey = "threeMonths";
    else if (fs.cinemaTerm === 6) termKey = "sixMonths";
    
    const rate = GVAA_CINEMA[tier as keyof typeof GVAA_CINEMA][termKey as keyof typeof GVAA_CINEMA.small];
    return typeof rate === "number" ? rate : rate.high;
  }
  
  // Event Video
  if (usage === "Event Video") {
    if (!fs.eventType) return 0;
    
    const hours = Math.max(1, parseNum(fs.eventHours)); // Default to 1 hour
    const rates = fs.eventType === "1 Year" ? GVAA_EVENT.oneYear : GVAA_EVENT.fullBuyout;
    
    let total = rates.firstHour.high;
    if (hours > 1) {
      total += (hours - 1) * rates.addlHour.high;
    }
    return total;
  }
  
  // Trade Shows / Sporting Events
  if (usage === "Trade Shows") {
    if (!fs.tradeshowType) return 0;
    
    const hours = Math.max(1, parseNum(fs.tradeshowHours)); // Default to 1 hour
    const rates = fs.tradeshowType === "1 Year" ? GVAA_TRADESHOW.oneYear : GVAA_TRADESHOW.fullBuyout;
    
    let total = rates.firstHour.high;
    if (hours > 1) {
      total += (hours - 1) * rates.addlHour.high;
    }
    return total;
  }
  
  // Non-Paid Web (Owned Social/Site)
  if (usage === "Non-Paid Web") {
    if (!fs.nonPaidWebTerm) return 0;
    
    let termKey = "oneYear";
    if (fs.nonPaidWebTerm === 3) termKey = "threeMonths";
    else if (fs.nonPaidWebTerm === 36) termKey = "threeYears";
    else if (fs.nonPaidWebTerm === 60) termKey = "fiveYears";
    
    return GVAA_NONPAID_WEB[termKey as keyof typeof GVAA_NONPAID_WEB]?.high || 0;
  }
  
  // Paid Social
  if (usage === "Paid Social") {
    if (!fs.paidSocialTerm) return 0;
    
    let termKey = "oneYear";
    if (fs.paidSocialTerm === 1) termKey = "oneMonth";
    else if (fs.paidSocialTerm === 3) termKey = "threeMonths";
    
    return GVAA_PAID_SOCIAL[termKey as keyof typeof GVAA_PAID_SOCIAL]?.high || 0;
  }
  
  // Online Pre-Roll/OLV
  if (usage === "Online Pre-Roll") {
    if (!fs.olvTerm) return 0;

    let termKey = "oneYear";
    if (fs.olvTerm === 1) termKey = "oneMonth";
    else if (fs.olvTerm === 3) termKey = "threeMonths";

    return GVAA_OLV[termKey as keyof typeof GVAA_OLV]?.high || 0;
  }

  // OTT/CTV
  if (usage === "OTT/CTV") {
    if (!fs.ottTerm) return 0;

    let termKey = "oneYear";
    if (fs.ottTerm === 1) termKey = "oneMonth";
    else if (fs.ottTerm === 3) termKey = "threeMonths";

    return GVAA_OTT[termKey as keyof typeof GVAA_OTT]?.high || 0;
  }

  // In-Show/Documentary
  if (usage === "In-Show") {
    if (!fs.inshowLength) return 0;
    if (fs.inshowLength === "24 min") return GVAA_INSHOW.twentyFourMin.high;
    if (fs.inshowLength === "48 min") return GVAA_INSHOW.fortyEightMin.high;
    return 0;
  }

  // Infomercial/DRTV
  if (usage === "Infomercial") {
    if (!fs.infomercialMarket) return 0;
    if (fs.infomercialMarket === "National") return GVAA_INFOMERCIAL.national;
    if (fs.infomercialMarket === "North America") return GVAA_INFOMERCIAL.northAmerica;
    return 0;
  }

  // Trailers
  if (usage === "Trailers") {
    if (!fs.trailerMarket) return 0;
    switch (fs.trailerMarket) {
      case "Local": return GVAA_TRAILERS.local;
      case "Regional": return GVAA_TRAILERS.regional.high;
      case "National": return GVAA_TRAILERS.national.high;
    }
    return 0;
  }

  // Radio Promo & Imaging
  if (usage === "Radio Promo & Imaging") {
    if (!fs.radioPromoMarket) return 0;
    switch (fs.radioPromoMarket) {
      case "Local": return GVAA_RADIO_PROMO.local.high;
      case "Regional": return GVAA_RADIO_PROMO.regional.high;
      case "National": return GVAA_RADIO_PROMO.national.high;
    }
    return 0;
  }

  // TV Promo & Imaging    <-- ADD THIS SECTION HERE
  if (usage === "TV Promo & Imaging") {
    if (!fs.promoMarket) return 0;
    switch (fs.promoMarket) {
      case "Local": return GVAA_TV_PROMO.local.high;
      case "Regional": return GVAA_TV_PROMO.regional.high;
      case "National": return GVAA_TV_PROMO.national.high;
    }
    return 0;
  }

  switch (usage) {
    case "Explainer": {
      if (!fs.explainerModel) return 0;
      if (fs.explainerModel === "Single Video") {
        return GVAA_EXPLAINER.singleVideo.high;
      }
      if (fs.explainerModel === "Bulk") {
        const words = parseNum(fs.avgWords);
        let total = GVAA_EXPLAINER.bulkBase;
        if (words > 175) {
          total += Math.ceil((words - 175) / 100) * GVAA_EXPLAINER.bulkAddlPer100;
        }
        return total;
      }
      if (fs.explainerModel === "Retail") {
        return 0;
      }
      return 0;
    }
    case "Internal": {
      if (!fs.internalModel) return 0;
      
      if (fs.internalModel === "Finished Minute") {
        const mins = parseNum(fs.minutes);
        if (!mins) return 0;
        
        // Find the appropriate tier
        for (const tier of GVAA_INTERNAL.finishedMinute) {
          if (mins >= tier.min && mins <= tier.max) {
            return tier.high;
          }
        }
        // If over 60 minutes, use the highest tier
        return GVAA_INTERNAL.finishedMinute[GVAA_INTERNAL.finishedMinute.length - 1].high;
      }
      
      if (fs.internalModel === "Recording Time") {
        const hours = parseNum(fs.recordingHours);
        if (!hours) return 0;
        
        let total = GVAA_INTERNAL.firstHour;
        if (hours > 1) {
          const additionalHalfHours = Math.ceil((hours - 1) * 2);
          total += additionalHalfHours * GVAA_INTERNAL.addlHalfHour;
        }
        return total;
      }
      
      return 0;
    }
    case "IVR/Telephony": {
      if (!fs.ivrModel) return 0;
      switch (fs.ivrModel) {
        case "Minimum":
          return GVAA_IVR.minimum;
        case "Per Prompt":
          return GVAA_IVR.perPrompt.baseHigh + GVAA_IVR.perPrompt.promptHigh * parseNum(fs.ivrPromptCount);
        case "Per Word":
          return parseNum(fs.wordCount) * GVAA_IVR.perWord.high;
        case "Per Hour":
          const mins = parseNum(fs.liveDirectionMinutes) || 60;
          return GVAA_IVR.perHour.high * Math.max(1, Math.ceil(mins / 60));
        case "MOH Per Minute":
          return GVAA_IVR.moh.perMinute * Math.max(1, parseNum(fs.minutes));
        case "MOH Paragraphs":
          const words = parseNum(fs.wordCount);
          return GVAA_IVR.moh.perParagraph * (words ? Math.max(1, Math.round(words / 60)) : 1);
      }
      return 0;
    }
    case "Games": {
      if (!fs.gamesModel) return 0;
      switch (fs.gamesModel) {
        case "Mobile Character – Per Game":
          const basePerGame = GVAA_GAMES.mobileCharacter.perGame.high;
          const extraVoices = Number(fs.gameExtraVoices) || 0;
          return basePerGame + (extraVoices * GVAA_GAMES.extraVoiceFee.high);
        case "Mobile Character – Hourly":
          return GVAA_GAMES.mobileCharacter.hourly.high * GVAA_GAMES.mobileCharacter.sessionMinHours;
        case "Educational – 5 mins":
          return GVAA_GAMES.educational.fiveMin.high;
        case "Educational – 10 mins":
          return GVAA_GAMES.educational.tenMin;
        case "Union Session":
          return GVAA_GAMES.unionSession;
        default:
          return 0;
      }
    }
    case "Commercial": {
      if (!fs.territory || !fs.termMonths) return 0;
      
      let tier = "local";
      const territory = fs.territory.toLowerCase();
      if (territory.includes("national") || territory.includes("north america") || territory.includes("worldwide")) {
        tier = "national";
      } else if (territory.includes("regional") || territory.includes("state")) {
        tier = "regional";
      }
      
      const term = fs.termMonths || 0;
      let termKey = "oneYear";
      if (term <= 1) termKey = "oneMonth";
      else if (term <= 3) termKey = "threeMonths";
      
      return GVAA_TV[tier as keyof typeof GVAA_TV]?.[termKey as keyof typeof GVAA_TV.local]?.high || 0;
    }
    case "E-learning": {
      if (!fs.elearningModel) return 0;
      
      switch (fs.elearningModel) {
        case "Per Word": {
          const words = parseNum(fs.wordCount);
          if (!words) return 0;
          
          let rate = GVAA_ELEARNING.perWord.standard.high;
          if (fs.elearningWordType === "technical") {
            rate = GVAA_ELEARNING.perWord.technical.high;
          } else if (fs.elearningWordType === "bulk" || words > 50000) {
            rate = GVAA_ELEARNING.perWord.bulk.high;
          }
          
          return words * rate;
        }
        case "Per Finished Minute":
          return parseNum(fs.minutes) * GVAA_ELEARNING.perFinishedMinute.high;
        case "Per Raw Hour":
          return parseNum(fs.finishedHours) * GVAA_ELEARNING.perRawHour.high;
        case "Per Finished Hour":
          return parseNum(fs.finishedHours) * GVAA_ELEARNING.perFinishedHour.high;
        default:
          return 0;
      }
    }
    case "Animation":
    case "Audiobook":
      return 0;
    default:
      return 0;
  }
}

// Usage Fields Component - moved outside to prevent re-creation
function UsageFieldsComponent({ fs, setFs }: { fs: typeof DEFAULT_STATE; setFs: (state: typeof DEFAULT_STATE) => void }) {
  const updateFs = (updates: Partial<typeof DEFAULT_STATE>) => setFs({ ...fs, ...updates });
  if (!fs.usage) return null;

  switch (fs.usage) {
    case "IVR/Telephony":
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label>IVR model</Label>
            <Select
              value={fs.ivrModel}
              onValueChange={(v) => updateFs({ ivrModel: v })}
            >
              <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Minimum">Minimum</SelectItem>
                <SelectItem value="Per Prompt">Per Prompt</SelectItem>
                <SelectItem value="Per Word">Per Word</SelectItem>
                <SelectItem value="Per Hour">Per Hour</SelectItem>
                <SelectItem value="MOH Per Minute">MOH Per Minute</SelectItem>
                <SelectItem value="MOH Paragraphs">MOH Paragraphs</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {fs.ivrModel === "Per Prompt" && (
            <div className="space-y-1">
              <Label htmlFor="promptCount">Prompt count</Label>
              <Input id="promptCount" type="text" value={fs.ivrPromptCount || ""} onChange={(e) => setFs({ ...fs, ivrPromptCount: e.target.value })} />
            </div>
          )}
          {(fs.ivrModel === "Per Word" || fs.ivrModel === "MOH Paragraphs") && (
            <div className="space-y-1">
              <Label htmlFor="wordCount">Word count</Label>
              <Input id="wordCount" type="text" value={fs.wordCount} onChange={(e) => setFs({ ...fs, wordCount: e.target.value })} />
            </div>
          )}
          {fs.ivrModel === "Per Hour" && (
            <div className="space-y-1">
              <Label htmlFor="liveMinutes">Live session minutes</Label>
              <Input id="liveMinutes" type="text" value={fs.liveDirectionMinutes || ""} onChange={(e) => setFs({ ...fs, liveDirectionMinutes: e.target.value })} />
            </div>
          )}
          {fs.ivrModel === "MOH Per Minute" && (
            <div className="space-y-1">
              <Label htmlFor="minutes">Minutes</Label>
              <Input id="minutes" type="text" value={fs.minutes} onChange={(e) => setFs({ ...fs, minutes: e.target.value })} />
            </div>
          )}
        </div>
      );

    case "Explainer":
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label>Explainer model</Label>
            <Select
              value={fs.explainerModel}
              onValueChange={(v) => setFs({ ...fs, explainerModel: v })}
            >
              <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Single Video">Single Video (≤90s)</SelectItem>
                <SelectItem value="Bulk">Bulk</SelectItem>
                <SelectItem value="Retail">Retail</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {fs.explainerModel === "Bulk" && (
            <div className="space-y-1">
              <Label htmlFor="avgWords">Avg words per video</Label>
              <Input id="avgWords" type="text" value={fs.avgWords} onChange={(e) => setFs({ ...fs, avgWords: e.target.value })} />
            </div>
          )}
        </div>
      );

    case "Games":
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label>Games model</Label>
            <Select
              value={fs.gamesModel}
              onValueChange={(v) => setFs({ ...fs, gamesModel: v })}
            >
              <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Mobile Character – Per Game">Mobile Character: Per game</SelectItem>
                <SelectItem value="Mobile Character – Hourly">Mobile Character: Hourly</SelectItem>
                <SelectItem value="Educational – 5 mins">Educational: 5 mins</SelectItem>
                <SelectItem value="Educational – 10 mins">Educational: 10 mins</SelectItem>
                <SelectItem value="Union Session">Union session</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {fs.gamesModel === "Mobile Character – Per Game" && (
            <div className="space-y-1">
              <Label htmlFor="extraVoices">Extra voices</Label>
              <Input id="extraVoices" type="text" value={fs.gameExtraVoices || ""} onChange={(e) => setFs({ ...fs, gameExtraVoices: e.target.value })} />
            </div>
          )}
          {fs.gamesModel === "Mobile Character – Hourly" && (
            <div className="space-y-1">
              <Label>Session minimum</Label>
              <Input readOnly value="2 hours typical minimum" />
            </div>
          )}
        </div>
      );

    case "Commercial":
      return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="space-y-1">
            <Label htmlFor="spotLen">Spot length</Label>
            <Select
              value={fs.spotLengthSeconds ? String(fs.spotLengthSeconds) : undefined}
              onValueChange={(v) => setFs({ ...fs, spotLengthSeconds: Number(v) })}
            >
              <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="15">:15</SelectItem>
                <SelectItem value="30">:30</SelectItem>
                <SelectItem value="60">:60</SelectItem>
                <SelectItem value="90">:90</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="term">Term</Label>
            <Select
              value={fs.termMonths ? String(fs.termMonths) : undefined}
              onValueChange={(v) => setFs({ ...fs, termMonths: Number(v) })}
            >
              <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 month</SelectItem>
                <SelectItem value="3">3 months</SelectItem>
                <SelectItem value="6">6 months</SelectItem>
                <SelectItem value="12">12 months</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1 md:col-span-2">
            <Label htmlFor="territory">Territory/markets</Label>
            <Select
              value={fs.territory || ""}
              onValueChange={(v) => setFs({ ...fs, territory: v })}
            >
              <SelectTrigger className="w-full"><SelectValue placeholder="Select territory" /></SelectTrigger>
              <SelectContent>
                {TERRITORIES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    case "E-learning":
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label>E-learning model</Label>
              <Select
                value={fs.elearningModel}
                onValueChange={(v) => setFs({ ...fs, elearningModel: v })}
              >
                <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Per Word">Per Word</SelectItem>
                  <SelectItem value="Per Finished Minute">Per Finished Minute</SelectItem>
                  <SelectItem value="Per Raw Hour">Per Raw Hour</SelectItem>
                  <SelectItem value="Per Finished Hour">Per Finished Hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {fs.elearningModel === "Per Word" && (
              <>
                <div className="space-y-1">
                  <Label htmlFor="words">Word count</Label>
                  <Input 
                    id="words" 
                    type="text"
                    value={fs.wordCount} 
                    onChange={(e) => setFs({ ...fs, wordCount: e.target.value })} 
                    placeholder="e.g. 5000"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Content type</Label>
                  <Select
                    value={fs.elearningWordType}
                    onValueChange={(v) => setFs({ ...fs, elearningWordType: v })}
                  >
                    <SelectTrigger className="w-full"><SelectValue placeholder="Standard" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard ($0.20-$0.35)</SelectItem>
                      <SelectItem value="technical">Technical/Medical ($0.35-$0.50)</SelectItem>
                      <SelectItem value="bulk">Large Bulk &gt;50k ($0.15-$0.20)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            
            {fs.elearningModel === "Per Finished Minute" && (
              <div className="space-y-1">
                <Label htmlFor="finMin">Finished minutes</Label>
                <Input 
                  id="finMin" 
                  type="text"
                  value={fs.minutes} 
                  onChange={(e) => setFs({ ...fs, minutes: e.target.value })} 
                  placeholder="e.g. 30"
                />
              </div>
            )}
            
            {(fs.elearningModel === "Per Raw Hour" || fs.elearningModel === "Per Finished Hour") && (
              <div className="space-y-1">
                <Label htmlFor="hours">Hours</Label>
                <Input 
                  id="hours" 
                  type="text"
                  value={fs.finishedHours} 
                  onChange={(e) => setFs({ ...fs, finishedHours: e.target.value })} 
                  placeholder="e.g. 2.5"
                />
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label htmlFor="splits">File splits</Label>
              <Input 
                id="splits" 
                type="text"
                value={fs.fileSplits} 
                onChange={(e) => setFs({ ...fs, fileSplits: e.target.value })} 
                placeholder="e.g. 10"
              />
            </div>
            <div className="space-y-1 flex items-center gap-3">
              <Switch id="commSale" checked={!!fs.commercialSale} onCheckedChange={(v) => setFs({ ...fs, commercialSale: v })} />
              <Label htmlFor="commSale">Commercial sale usage</Label>
            </div>
          </div>
        </div>
      );

    case "Internal":
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label>Internal pricing model</Label>
            <Select
              value={fs.internalModel}
              onValueChange={(v) => setFs({ ...fs, internalModel: v })}
            >
              <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Finished Minute">Finished Minute Scale</SelectItem>
                <SelectItem value="Recording Time">Recording Time (RAW)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {fs.internalModel === "Finished Minute" && (
            <div className="space-y-1">
              <Label htmlFor="intMins">Finished minutes</Label>
              <Input 
                id="intMins" 
                type="text"
                value={fs.minutes} 
                onChange={(e) => setFs({ ...fs, minutes: e.target.value })} 
                placeholder="e.g. 15"
              />
            </div>
          )}
          
          {fs.internalModel === "Recording Time" && (
            <div className="space-y-1">
              <Label htmlFor="recHours">Recording hours</Label>
              <Input 
                id="recHours" 
                type="text"
                value={fs.recordingHours} 
                onChange={(e) => setFs({ ...fs, recordingHours: e.target.value })} 
                placeholder="e.g. 2.5"
              />
            </div>
          )}
        </div>
      );

    case "Audiobook":
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label>Audiobook pricing model</Label>
            <Select
              value={fs.audiobookModel}
              onValueChange={(v) => setFs({ ...fs, audiobookModel: v })}
            >
              <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Union PFH">Union Scale - PFH ($150-$225)</SelectItem>
                <SelectItem value="Non-Union PFH">Non-Union - PFH ($200-$500)</SelectItem>
                <SelectItem value="Per Raw Hour">Per Raw Hour ($225)</SelectItem>
                <SelectItem value="Hybrid">Hybrid ($100 PFH + royalty)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="abHours">Finished hours</Label>
            <Input 
              id="abHours" 
              type="text"
              value={fs.finishedHours} 
              onChange={(e) => setFs({ ...fs, finishedHours: e.target.value })} 
              placeholder="e.g. 8.5"
            />
          </div>
          
          {fs.audiobookModel === "Hybrid" && (
            <div className="space-y-1">
              <Label className="text-sm text-gray-600">Note</Label>
              <Input readOnly value="Plus royalty share (negotiate %)" className="text-sm" />
            </div>
          )}
        </div>
      );

    case "Digital Greeting Cards":
      return (
        <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-sm">
          <p className="font-medium text-blue-900">Full Buyout: $750-$1,000</p>
          <p className="text-blue-700 mt-1">This is a flat-rate full buyout. No additional inputs needed.</p>
        </div>
      );

    case "PSA":
      return (
        <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-sm">
          <p className="font-medium text-green-900">PSA Rate: $500-$600+</p>
          <p className="text-green-700 mt-1">For :60 or less. This is a flat rate for public service announcements.</p>
        </div>
      );

    case "Kiosk":
      return (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-sm">
            <p className="font-medium text-purple-900">Kiosk (Non-Retail) - Recording Time Rates</p>
            <p className="text-purple-700 mt-1">$525 first hour, $262 each additional half hour. For museums, zoos, educational kiosks.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="kioskHrs">Recording hours</Label>
              <Input 
                id="kioskHrs" 
                type="text"
                value={fs.kioskHours} 
                onChange={(e) => setFs({ ...fs, kioskHours: e.target.value })} 
                placeholder="e.g. 2.5"
              />
            </div>
          </div>
        </div>
      );

    case "Museum Tours":
      return (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-sm">
            <p className="font-medium text-amber-900">Museum Tours - Union Scale</p>
            <p className="text-amber-700 mt-1">Audio Tour: $505/1st hr, $148/30min. Exhibition: $563/1st hr, $148/30min.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Museum tour type</Label>
              <Select
                value={fs.museumModel}
                onValueChange={(v) => setFs({ ...fs, museumModel: v })}
              >
                <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Audio Tour">Audio Tour (CAT 1) - Perpetual</SelectItem>
                  <SelectItem value="Exhibition">Exhibition/Talking Statues (CAT 2) - 3yr</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="museumHrs">Recording hours</Label>
              <Input 
                id="museumHrs" 
                type="text"
                value={fs.museumHours} 
                onChange={(e) => setFs({ ...fs, museumHours: e.target.value })} 
                placeholder="e.g. 2"
              />
            </div>
          </div>
        </div>
      );

    case "Airport":
      return (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-sm">
            <p className="font-medium text-sky-900">Airport Announcements - Per Year Per Airport</p>
            <p className="text-sky-700 mt-1">First airport: $1,500-$2,000. Each additional: $1,000-$1,500. Covers up to 2 hrs raw recording.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="airportCnt">Number of airports</Label>
              <Input 
                id="airportCnt" 
                type="text"
                value={fs.airportCount} 
                onChange={(e) => setFs({ ...fs, airportCount: e.target.value })} 
                placeholder="e.g. 3"
              />
            </div>
          </div>
        </div>
      );

    case "Podcasts":
      return (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-pink-50 border border-pink-200 text-sm">
            <p className="font-medium text-pink-900">Podcast Rates</p>
            <p className="text-pink-700 mt-1">Select your role. Audio drama sessions up to 4 hours.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Podcast role</Label>
              <Select
                value={fs.podcastRole}
                onValueChange={(v) => setFs({ ...fs, podcastRole: v })}
              >
                <SelectTrigger className="w-full"><SelectValue placeholder="Select role" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Intro/Outro">Intro/Outro ($300-$400)</SelectItem>
                  <SelectItem value="Non-Principal">Audio Drama - Non-Principal ($400-$500)</SelectItem>
                  <SelectItem value="Principal">Audio Drama - Principal ($800-$1,000)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      );

    case "YouTube":
      return (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm">
            <p className="font-medium text-red-900">YouTube Content Rates</p>
            <p className="text-red-700 mt-1">Narration: 3-5 min episodes. Channel intro: scales with subscribers. High-view channels command premium rates.</p>
          </div>
          <div className="p-3 rounded-xl bg-yellow-50 border border-yellow-300 text-sm">
            <p className="font-semibold text-yellow-900 mb-1">⚠️ Note: GVAA rates for YouTube only cover 3-5 minute episodes.</p>
            <p className="text-yellow-800">If you&apos;re narrating a longer video, you may opt to use one of these GVAA categories instead:</p>
            <ul className="list-disc ml-5 mt-1 text-yellow-800">
              <li><strong>Corporate & Industrial Narration</strong> (Finished Minute Scale)</li>
              <li><strong>E-Learning</strong> (Per Word Model)</li>
              <li><strong>Medical/Technical Narration</strong> (Per Finished Minute)</li>
            </ul>
            <p className="text-yellow-800 mt-1">Select one of those categories from the Usage Type dropdown for more appropriate pricing on longer content.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>YouTube content type</Label>
              <Select
                value={fs.youtubeType}
                onValueChange={(v) => setFs({ ...fs, youtubeType: v })}
              >
                <SelectTrigger className="w-full"><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Narration">Narration - 3-5 min episodes ($750-$1,000)</SelectItem>
                  <SelectItem value="Channel Intro/Outro">Channel Intro/Outro ($500-$2,000)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      );

    case "Medical/Technical":
      return (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-sm">
            <p className="font-medium text-teal-900">Medical/Technical Narration</p>
            <p className="text-teal-700 mt-1">Premium rates for specialized content. Includes editing, file splits, naming, delivery, and pickups.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label>Pricing model</Label>
              <Select
                value={fs.medicalModel}
                onValueChange={(v) => setFs({ ...fs, medicalModel: v })}
              >
                <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Per Finished Minute">Per Finished Minute</SelectItem>
                  <SelectItem value="Per Word">Per Word ($0.25-$0.50)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {fs.medicalModel === "Per Finished Minute" && (
              <div className="space-y-1">
                <Label htmlFor="medMins">Finished minutes</Label>
                <Input 
                  id="medMins" 
                  type="text"
                  value={fs.medicalMinutes} 
                  onChange={(e) => setFs({ ...fs, medicalMinutes: e.target.value })} 
                  placeholder="e.g. 15"
                />
              </div>
            )}
            
            {fs.medicalModel === "Per Word" && (
              <div className="space-y-1">
                <Label htmlFor="medWords">Word count</Label>
                <Input 
                  id="medWords" 
                  type="text"
                  value={fs.medicalWords} 
                  onChange={(e) => setFs({ ...fs, medicalWords: e.target.value })} 
                  placeholder="e.g. 5000"
                />
              </div>
            )}
          </div>
        </div>
      );

    case "Lobby Viewing":
      return (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-sm">
            <p className="font-medium text-indigo-900">Lobby Viewing</p>
            <p className="text-indigo-700 mt-1">For videos displayed in business lobbies or waiting areas.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label>Lobby viewing type</Label>
              <Select
                value={fs.lobbyType}
                onValueChange={(v) => setFs({ ...fs, lobbyType: v })}
              >
                <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Explainer">Explainer (Service Provider)</SelectItem>
                  <SelectItem value="Retail">Retail (Selling Product/Service)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {fs.lobbyType === "Explainer" && (
              <div className="space-y-1">
                <Label htmlFor="lobbyHrs">Recording hours</Label>
                <Input 
                  id="lobbyHrs" 
                  type="text"
                  value={fs.lobbyHours} 
                  onChange={(e) => setFs({ ...fs, lobbyHours: e.target.value })} 
                  placeholder="e.g. 2"
                />
              </div>
            )}
          </div>
          
          {fs.lobbyType === "Retail" && (
            <div className="p-3 rounded-xl bg-yellow-50 border border-yellow-300 text-sm">
              <p className="font-semibold text-yellow-900 mb-1">⚠️ Note: Retail lobby viewing uses TV Commercial rates.</p>
              <p className="text-yellow-800">If you&apos;re creating a video that sells a product or service, select <strong>TV Commercial</strong> from the Usage Type dropdown instead and specify your market tier (Local/Regional/National) and term.</p>
            </div>
          )}
        </div>
      );

    case "Radio":
      return (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-sm">
            <p className="font-medium text-orange-900">Radio Advertising</p>
            <p className="text-orange-700 mt-1">Terrestrial and digital radio rates. Session fees included in usage rates.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label>Market tier</Label>
              <Select
                value={fs.radioMarket}
                onValueChange={(v) => setFs({ ...fs, radioMarket: v })}
              >
                <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Local/Regional">Local/Regional (Terrestrial)</SelectItem>
                  <SelectItem value="National">National (Terrestrial)</SelectItem>
                  <SelectItem value="Digital Radio">Digital Radio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Term</Label>
              <Select
                value={fs.radioTerm ? String(fs.radioTerm) : undefined}
                onValueChange={(v) => setFs({ ...fs, radioTerm: Number(v) })}
              >
                <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 month</SelectItem>
                  <SelectItem value="3">3 months</SelectItem>
                  <SelectItem value="12">12 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      );

    case "Animation":
      return (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-fuchsia-50 border border-fuchsia-200 text-sm">
            <p className="font-medium text-fuchsia-900">Animation - Non-Union Original</p>
            <p className="text-fuchsia-700 mt-1">Per-episode rates. Session includes up to 2 voices. Music add-ons and additional voices may apply.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Episode length</Label>
              <Select
                value={fs.animationLength}
                onValueChange={(v) => setFs({ ...fs, animationLength: v })}
              >
                <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="22-min Episode">22-min Episode ($1,100-$1,200)</SelectItem>
                  <SelectItem value="11-min Episode">11-min Episode ($400-$700)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      );

    case "Dubbing":
      return (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-violet-50 border border-violet-200 text-sm">
            <p className="font-medium text-violet-900">Dubbing (Film/TV/Animation)</p>
            <p className="text-violet-700 mt-1">Hourly rates with 2-hour minimum session.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Dubbing type</Label>
              <Select
                value={fs.dubbingType}
                onValueChange={(v) => setFs({ ...fs, dubbingType: v })}
              >
                <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Union">Union ($181.50/hr - 2hr min)</SelectItem>
                  <SelectItem value="Non-Union">Non-Union ($125/hr - 2hr min)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="dubHrs">Session hours</Label>
              <Input 
                id="dubHrs" 
                type="text"
                value={fs.dubbingHours} 
                onChange={(e) => setFs({ ...fs, dubbingHours: e.target.value })} 
                placeholder="e.g. 3"
              />
            </div>
          </div>
        </div>
      );

    case "Toys & Games":
      return (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-200 text-sm">
            <p className="font-medium text-cyan-900">Toys, Games & Mobile Apps</p>
            <p className="text-cyan-700 mt-1">Rates for toy products, board games, and mobile game apps. Full buyout for toy usage.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Product type</Label>
              <Select
                value={fs.toysModel}
                onValueChange={(v) => setFs({ ...fs, toysModel: v })}
              >
                <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Toys & Games">Toys & Games ($500-$750 up to 2hrs)</SelectItem>
                  <SelectItem value="Mobile Per Game">Mobile Game - Per Game ($300-$500)</SelectItem>
                  <SelectItem value="Mobile Hourly">Mobile Game - Hourly ($200-$300/hr)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(fs.toysModel === "Toys & Games" || fs.toysModel === "Mobile Hourly") && (
              <div className="space-y-1">
                <Label htmlFor="toyHrs">Session hours</Label>
                <Input 
                  id="toyHrs" 
                  type="text"
                  value={fs.toysHours} 
                  onChange={(e) => setFs({ ...fs, toysHours: e.target.value })} 
                  placeholder="e.g. 3"
                />
              </div>
            )}
          </div>
        </div>
      );

    case "Cinema":
      return (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-sm">
            <p className="font-medium text-rose-900">Cinema Usage (Pre-Show Advertising)</p>
            <p className="text-rose-700 mt-1">Theater advertising rates based on state coverage and term.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>State coverage</Label>
              <Select
                value={fs.cinemaStates}
                onValueChange={(v) => setFs({ ...fs, cinemaStates: v })}
              >
                <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-3 States">1-3 States</SelectItem>
                  <SelectItem value="4+ States">4+ States</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Term</Label>
              <Select
                value={fs.cinemaTerm ? String(fs.cinemaTerm) : undefined}
                onValueChange={(v) => setFs({ ...fs, cinemaTerm: Number(v) })}
              >
                <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 month</SelectItem>
                  <SelectItem value="3">3 months</SelectItem>
                  <SelectItem value="6">6 months</SelectItem>
                  <SelectItem value="12">12 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      );

    case "Event Video":
      return (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-lime-50 border border-lime-200 text-sm">
            <p className="font-medium text-lime-900">Event Video (Non-Broadcast)</p>
            <p className="text-lime-700 mt-1">For conferences and live events. Not for trade shows or sporting events.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Usage type</Label>
              <Select
                value={fs.eventType}
                onValueChange={(v) => setFs({ ...fs, eventType: v })}
              >
                <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 Year">1 Year ($600-$700/hr)</SelectItem>
                  <SelectItem value="Full Buyout">Full Buyout ($2,000-$2,100/hr)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="eventHrs">Finished hours</Label>
              <Input 
                id="eventHrs" 
                type="text"
                value={fs.eventHours} 
                onChange={(e) => setFs({ ...fs, eventHours: e.target.value })} 
                placeholder="e.g. 2"
              />
            </div>
          </div>
        </div>
      );

    case "Trade Shows":
      return (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm">
            <p className="font-medium text-emerald-900">Trade Shows / Sporting Events (Non-Broadcast)</p>
            <p className="text-emerald-700 mt-1">For use at trade shows and sporting events. 1 Year = unlimited events for 1 year.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Usage type</Label>
              <Select
                value={fs.tradeshowType}
                onValueChange={(v) => setFs({ ...fs, tradeshowType: v })}
              >
                <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 Year">1 Year ($600-$700/hr)</SelectItem>
                  <SelectItem value="Full Buyout">Full Buyout ($2,000-$2,100/hr)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="tradeHrs">Finished hours</Label>
              <Input 
                id="tradeHrs" 
                type="text"
                value={fs.tradeshowHours} 
                onChange={(e) => setFs({ ...fs, tradeshowHours: e.target.value })} 
                placeholder="e.g. 1"
              />
            </div>
          </div>
        </div>
      );

    case "TV Promo & Imaging":
      return (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-sm">
            <p className="font-medium text-indigo-900">TV Promo & Imaging</p>
            <p className="text-indigo-700 mt-1">Per-spot rates for TV station promos and imaging.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Market tier</Label>
              <Select
                value={fs.promoMarket}
                onValueChange={(v) => setFs({ ...fs, promoMarket: v })}
              >
                <SelectTrigger className="w-full"><SelectValue placeholder="Select market" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Local">Local ($150-$300)</SelectItem>
                  <SelectItem value="Regional">Regional ($450-$600)</SelectItem>
                  <SelectItem value="National">National ($750-$1,000)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      );

      case "Radio Promo & Imaging":
      return (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-sm">
            <p className="font-medium text-orange-900">Radio Promo & Imaging</p>
            <p className="text-orange-700 mt-1">Per-spot rates for radio station promos and imaging.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Market tier</Label>
              <Select
                value={fs.radioPromoMarket}
                onValueChange={(v) => setFs({ ...fs, radioPromoMarket: v })}
              >
                <SelectTrigger className="w-full"><SelectValue placeholder="Select market" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Local">Local ($150-$200)</SelectItem>
                  <SelectItem value="Regional">Regional ($350-$500)</SelectItem>
                  <SelectItem value="National">National ($600-$850)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      );

      case "Trailers":
      return (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-sm">
            <p className="font-medium text-purple-900">Trailers</p>
            <p className="text-purple-700 mt-1">Per-spot rates for movie/entertainment trailers.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Market tier</Label>
              <Select
                value={fs.trailerMarket}
                onValueChange={(v) => setFs({ ...fs, trailerMarket: v })}
              >
                <SelectTrigger className="w-full"><SelectValue placeholder="Select market" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Local">Local - Small Market ($100)</SelectItem>
                  <SelectItem value="Regional">Regional - Medium Market ($325-$500)</SelectItem>
                  <SelectItem value="National">National - Large Market ($1,500-$2,000)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      );

      case "Infomercial":
      return (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-sm">
            <p className="font-medium text-teal-900">Infomercial / DRTV</p>
            <p className="text-teal-700 mt-1">1-year term. Includes cuts/versions and up to 10 phone numbers. Session up to 2 hours.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Market coverage</Label>
              <Select
                value={fs.infomercialMarket}
                onValueChange={(v) => setFs({ ...fs, infomercialMarket: v })}
              >
                <SelectTrigger className="w-full"><SelectValue placeholder="Select market" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="National">National - US Only ($1,750)</SelectItem>
                  <SelectItem value="North America">North America - US & Canada ($2,500)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      );

    case "In-Show":
      return (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-sm">
            <p className="font-medium text-indigo-900">In-Show / Documentary Narration</p>
            <p className="text-indigo-700 mt-1">Program length excludes commercials. Cable shows: ~6 min ads per 30-min, ~12 min ads per 60-min.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Program length</Label>
              <Select
                value={fs.inshowLength}
                onValueChange={(v) => setFs({ ...fs, inshowLength: v })}
              >
                <SelectTrigger className="w-full"><SelectValue placeholder="Select length" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="24 min">24 minutes ($1,000-$1,500)</SelectItem>
                  <SelectItem value="48 min">48 minutes ($2,000-$3,000)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="p-3 rounded bg-blue-50 border border-blue-200 text-xs text-blue-800">
            <p className="font-semibold mb-1">Additional Usage:</p>
            <p>Add $250 for home recording setup. Add 20-25% bump for each additional usage (streaming/international).</p>
          </div>
        </div>
      );

    case "Non-Paid Web":
      return (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-sm">
            <p className="font-medium text-blue-900">Non-Paid Web (Owned Social/Client Site)</p>
            <p className="text-blue-700 mt-1">For use on client-owned websites and social media. Not for paid advertising.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Term</Label>
              <Select
                value={fs.nonPaidWebTerm ? String(fs.nonPaidWebTerm) : undefined}
                onValueChange={(v) => setFs({ ...fs, nonPaidWebTerm: Number(v) })}
              >
                <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 months ($300-$500)</SelectItem>
                  <SelectItem value="12">1 year ($500-$700)</SelectItem>
                  <SelectItem value="36">3 years ($900-$1,100)</SelectItem>
                  <SelectItem value="60">5 years ($1,300-$1,500)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      );

    case "Paid Social":
      return (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-sm">
            <p className="font-medium text-purple-900">Paid Social</p>
            <p className="text-purple-700 mt-1">For paid advertising on social media platforms.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Term</Label>
              <Select
                value={fs.paidSocialTerm ? String(fs.paidSocialTerm) : undefined}
                onValueChange={(v) => setFs({ ...fs, paidSocialTerm: Number(v) })}
              >
                <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 month ($300-$450)</SelectItem>
                  <SelectItem value="3">3 months ($400-$750)</SelectItem>
                  <SelectItem value="12">1 year ($1,000-$1,500)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      );

    case "Online Pre-Roll":
      return (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-sm">
            <p className="font-medium text-indigo-900">Online Pre-Roll / OLV (Includes Paid Social)</p>
            <p className="text-indigo-700 mt-1">For online video advertising including pre-roll ads.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Term</Label>
              <Select
                value={fs.olvTerm ? String(fs.olvTerm) : undefined}
                onValueChange={(v) => setFs({ ...fs, olvTerm: Number(v) })}
              >
                <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 month ($650-$800)</SelectItem>
                  <SelectItem value="3">3 months ($750-$1,100)</SelectItem>
                  <SelectItem value="12">1 year ($2,250-$3,000)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      );

    case "OTT/CTV":
      return (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-fuchsia-50 border border-fuchsia-200 text-sm">
            <p className="font-medium text-fuchsia-900">OTT/CTV (Includes Social & Pre-Roll)</p>
            <p className="text-fuchsia-700 mt-1">For over-the-top and connected TV advertising.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Term</Label>
              <Select
                value={fs.ottTerm ? String(fs.ottTerm) : undefined}
                onValueChange={(v) => setFs({ ...fs, ottTerm: Number(v) })}
              >
                <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 month ($1,250-$1,750)</SelectItem>
                  <SelectItem value="3">3 months ($1,500-$2,250)</SelectItem>
                  <SelectItem value="12">1 year ($4,000-$6,000)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      );

    case "Animation":
      return (
        <div className="p-3 rounded-xl bg-gray-50 border text-sm">
          <p className="mb-1 font-medium">Coming soon.</p>
          <p>We&apos;ll plug in exact GVAA ranges for {fs.usage?.toLowerCase()}s. The calculator will handle PFH, session caps, and dubbing flags.</p>
        </div>
      );
    
    default:
      return null;
  }
}

function GVAACalculator() {
  const [fs, setFs] = usePersistentState(LS_KEY, DEFAULT_STATE);

  const budgetParsed = useMemo(() => parseMoney(fs.budgetInput), [fs.budgetInput]);
  const netInfoLow = useMemo(() => computePlatformNet(budgetParsed.low, fs.platform, fs.safePayment), [budgetParsed.low, fs.platform, fs.safePayment]);
  const netInfoHigh = useMemo(() => computePlatformNet(budgetParsed.high, fs.platform, fs.safePayment), [budgetParsed.high, fs.platform, fs.safePayment]);
  const anchor = useMemo(() => anchorGVAAHigh(fs.usage, fs), [fs]);
  const pctLow = useMemo(() => anchor > 0 && budgetParsed.low > 0 ? budgetParsed.low / anchor : 0, [anchor, budgetParsed.low]);
  const pctHigh = useMemo(() => anchor > 0 && budgetParsed.high > 0 ? budgetParsed.high / anchor : 0, [anchor, budgetParsed.high]);

  const noteText = useMemo(() => {
    if (!fs.platform || !fs.usage || (budgetParsed.low <= 0 && budgetParsed.high <= 0) || anchor <= 0) return "";
    
    const lines: string[] = [];
    const isSingle = budgetParsed.isSingle;
    const feePct = Math.round((netInfoLow.feePct || 0) * 100);
    
    // Quick Facts Header
    lines.push("=== QUICK FACTS ===");
    if (isSingle) {
      lines.push(`Client Budget: ${fmt(budgetParsed.low, fs.currency)}`);
      lines.push(`Your Net (after ${feePct}% fee): ${fmt(netInfoLow.net, fs.currency)}`);
      lines.push(`GVAA High Anchor: ${fmt(anchor, fs.currency)}`);
      lines.push(`Budget vs Standard: ${toPct(pctLow)}`);
    } else {
      lines.push(`Client Budget Range: ${fmt(budgetParsed.low, fs.currency)} - ${fmt(budgetParsed.high, fs.currency)}`);
      lines.push(`Your Net Range (after ${feePct}% fee): ${fmt(netInfoLow.net, fs.currency)} - ${fmt(netInfoHigh.net, fs.currency)}`);
      lines.push(`GVAA High Anchor: ${fmt(anchor, fs.currency)}`);
      lines.push(`Budget vs Standard: ${toPct(pctLow)} - ${toPct(pctHigh)}`);
    }
    lines.push("");
    
    // Platform-specific payment language
    let paymentLang = "";
    switch(fs.platform) {
      case "Voices.com":
        paymentLang = "Rights begin after payment releases here on Voices.";
        break;
      case "Voice123":
        paymentLang = "I'll invoice through Voice123 and run this via Secure Payment. Rights begin after payment releases.";
        break;
      case "Fiverr":
        paymentLang = "Rights begin after Fiverr payment clears.";
        break;
      case "Upwork":
        paymentLang = "Rights begin after Upwork escrow clears.";
        break;
      case "Bodalgo":
      case "Voquent":
        paymentLang = "I'll send a direct invoice. Rights begin after payment.";
        break;
      default:
        paymentLang = "Rights begin after payment clears.";
    }
    
    // Usage/license description
    let usageDesc = fs.usage || "this project";
    if (fs.usage === "Commercial" && fs.territory && fs.termMonths) {
      usageDesc = `${fs.territory} commercial usage, ${fs.termMonths} month term`;
    } else if (fs.usage === "IVR/Telephony") {
      usageDesc = "IVR/telephony usage";
    } else if (fs.usage === "E-learning") {
      usageDesc = "e-learning usage";
    }
    
    // Determine which tier for templates
    const avgPct = isSingle ? pctLow : (pctLow + pctHigh) / 2;
    const topBudget = budgetParsed.high;
    
    // Calculate suggested counter amounts
    const counter95 = Math.round(anchor * 0.95);
    const counter90 = Math.round(anchor * 0.90);
    const counter75 = Math.round(anchor * 0.75);
    
    lines.push("=== PASTE-READY RESPONSES ===");
    lines.push("");
    
    // Template A: High budget (80-100%)
    if (avgPct >= 0.8) {
      lines.push("--- TEMPLATE A: Accept (Budget is 80-100% of standard) ---");
      lines.push(`I can work with your proposed budget of ${fmt(topBudget, fs.currency)}. That includes a clean edit, delivery of the full performance, and minor pickups if needed. ${paymentLang}`);
    } else {
      lines.push("--- TEMPLATE A: Counter at 95% (Use if budget is close) ---");
      lines.push(`Your proposed budget is about ${toPct(avgPct)} of what I normally receive for this type of project. If you'd be comfortable at ${fmt(counter95, fs.currency)} (≈95% of my standard), I'd be glad to record for you. That includes a clean edit, up to 1 hr of live direction, and the license for ${usageDesc}. Minor pickups ≤15m are $150 or 50% of the session fee. ${paymentLang}`);
    }
    
    lines.push("");
    
    // Template B: Medium budget (50-80%)
    lines.push("--- TEMPLATE B: Counter at 90% or 75% (Budget is 50-80%) ---");
    lines.push(`Your proposed budget is about ${toPct(avgPct)} of what I normally receive for this type of project. If you'd be comfortable at ${fmt(counter90, fs.currency)} (≈90% of my standard), I'd be happy to proceed. That includes a clean edit, up to 1 hr of live direction, and the license for ${usageDesc}. Minor pickups ≤15m are $150 or 50% of the session fee. ${paymentLang}`);
    lines.push("");
    lines.push("OR counter lower:");
    lines.push(`If you'd be comfortable at ${fmt(counter75, fs.currency)} (≈75% of my standard), I can make that work. That includes a clean edit, up to 1 hr of live direction, and the license for ${usageDesc}. ${paymentLang}`);
    
    lines.push("");
    
    // Template C: Low budget (<50%)
    lines.push("--- TEMPLATE C: Low Budget Response (<50% of standard) ---");
    lines.push(`Thanks for the invitation. Your proposed budget is about ${toPct(avgPct)} of what I normally receive for this scope. If you'd be comfortable at ${fmt(counter75, fs.currency)}, I can adjust scope to make it work. To deliver the full project as listed, my rate would be closer to ${fmt(counter90, fs.currency)}. I'd be happy to proceed with whichever option fits best. ${paymentLang}`);
    
    lines.push("");
    
    // Polite Disengagement
    lines.push("--- POLITE DISENGAGEMENT (If no agreement) ---");
    lines.push("Thank you so much for considering me. I don't think I'll be the right fit for this project, but I truly appreciate the opportunity and wish you all the best. If something comes up in the future that feels like a stronger match, I'd be glad to reconnect.");
    
    lines.push("");
    
    // Multi-year guidance
    lines.push("--- MULTI-YEAR TERMS ---");
    lines.push("For terms beyond 12 months, calculate renewals:");
    lines.push("• Local/Regional: Base year + 10-15% per additional year");
    lines.push("• National: Base year + 40-50% per additional year");
    lines.push(`Example with your anchor (${fmt(anchor, fs.currency)}): 3-year national = Year 1: ${fmt(anchor, fs.currency)}, Year 2: ${fmt(Math.round(anchor * 1.45), fs.currency)}, Year 3: ${fmt(Math.round(anchor * 1.65), fs.currency)}`);
    
    if (fs.notes) {
      lines.push("");
      lines.push("=== YOUR PROJECT NOTES ===");
      lines.push(fs.notes);
    }
    
    return lines.join("\n");
  }, [fs, budgetParsed, netInfoLow, netInfoHigh, anchor, pctLow, pctHigh]);

  const noteReady = noteText.length > 0;

  const reset = () => setFs(DEFAULT_STATE);
  
  const downloadNote = () => {
    if (!noteText) return;
    const blob = new Blob([noteText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "myvobiz_quote_note.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const copyNote = () => {
    if (noteText) {
      navigator.clipboard.writeText(noteText);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">MyVoBiz Quote Calculator</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={reset} aria-label="Reset form"><RefreshCw className="h-4 w-4 mr-2" />Reset</Button>
            <Button onClick={downloadNote} aria-label="Download note" disabled={!noteReady}><Download className="h-4 w-4 mr-2" />Download note</Button>
            <Button variant="outline" onClick={copyNote} disabled={!noteReady} aria-label="Copy note"><FileText className="h-4 w-4 mr-2" />Copy note</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="md:col-span-2 shadow-sm rounded-2xl">
            <CardContent className="p-4 md:p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="platform">Platform</Label>
                  <Select value={fs.platform || ""} onValueChange={(v) => setFs({ ...fs, platform: v })}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {Object.keys(PLATFORM_FEES).map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="usage">Usage type</Label>
                  <Select value={fs.usage || ""} onValueChange={(v) => setFs({ ...fs, usage: v })}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="header-nonbroadcast" disabled className="font-semibold text-gray-900">NON-BROADCAST</SelectItem>
                      <SelectItem value="Internal" className="pl-6">Corporate & Industrial Narration</SelectItem>
                      <SelectItem value="Explainer" className="pl-6">Explainer Videos</SelectItem>
                      <SelectItem value="Medical/Technical" className="pl-6">Medical/Technical Narration</SelectItem>
                      <SelectItem value="Museum Tours" className="pl-6">Museum Tours - Educational</SelectItem>
                      <SelectItem value="Podcasts" className="pl-6">Podcasts</SelectItem>
                      <SelectItem value="Digital Greeting Cards" className="pl-6">Digital Greeting Cards</SelectItem>
                      <SelectItem value="YouTube" className="pl-6">YouTube Content</SelectItem>
                      <SelectItem value="Kiosk" className="pl-6">Kiosk Use (Non-Retail)</SelectItem>
                      <SelectItem value="Lobby Viewing" className="pl-6">Lobby Viewing</SelectItem>
                      <SelectItem value="Airport" className="pl-6">Airport Announcements</SelectItem>
                      
                      <SelectItem value="header-digital" disabled className="font-semibold text-gray-900 mt-2">DIGITAL VISUAL</SelectItem>
                      <SelectItem value="Non-Paid Web" className="pl-6">Non-Paid Web (Owned Social/Site)</SelectItem>
                      <SelectItem value="Paid Social" className="pl-6">Paid Social</SelectItem>
                      <SelectItem value="Online Pre-Roll" className="pl-6">Online Pre-Roll/OLV</SelectItem>
                      <SelectItem value="OTT/CTV" className="pl-6">OTT/CTV</SelectItem>
                      
                      <SelectItem value="header-elearning" disabled className="font-semibold text-gray-900 mt-2">E-LEARNING</SelectItem>
                      <SelectItem value="E-learning" className="pl-6">E-Learning</SelectItem>
                      
                      <SelectItem value="header-audiobooks" disabled className="font-semibold text-gray-900 mt-2">AUDIOBOOKS</SelectItem>
                      <SelectItem value="Audiobook" className="pl-6">Audiobooks</SelectItem>
                      
                      <SelectItem value="header-radio" disabled className="font-semibold text-gray-900 mt-2">RADIO</SelectItem>
                      <SelectItem value="Radio" className="pl-6">Radio (Local/Regional/National)</SelectItem>
                      
                      <SelectItem value="header-animation" disabled className="font-semibold text-gray-900 mt-2">ANIMATION / DUBBING</SelectItem>
                      <SelectItem value="Animation" className="pl-6">Animation</SelectItem>
                      <SelectItem value="Dubbing" className="pl-6">Dubbing (Film/TV/Animation)</SelectItem>
                      
                      <SelectItem value="header-ivr" disabled className="font-semibold text-gray-900 mt-2">IVR / MESSAGE-ON-HOLD</SelectItem>
                      <SelectItem value="IVR/Telephony" className="pl-6">IVR/Telephony</SelectItem>
                      
                      <SelectItem value="header-tv" disabled className="font-semibold text-gray-900 mt-2">TV</SelectItem>
                      <SelectItem value="Commercial" className="pl-6">TV Commercial</SelectItem>
                      <SelectItem value="In-Show" className="pl-6">In-Show/Documentary Narration</SelectItem>
                      <SelectItem value="Infomercial" className="pl-6">Infomercial/DRTV</SelectItem>
                      
                      <SelectItem value="header-games" disabled className="font-semibold text-gray-900 mt-2">VIDEO GAMES / TOYS & GAMES</SelectItem>
                      <SelectItem value="Games" className="pl-6">Video Games</SelectItem>
                      <SelectItem value="Toys & Games" className="pl-6">Toys & Games / Mobile Apps</SelectItem>
                      
                      <SelectItem value="header-cinema" disabled className="font-semibold text-gray-900 mt-2">CINEMA / EVENTS</SelectItem>
                      <SelectItem value="Cinema" className="pl-6">Cinema Usage</SelectItem>
                      <SelectItem value="Event Video" className="pl-6">Event Video</SelectItem>
                      <SelectItem value="Trade Shows" className="pl-6">Trade Shows/Sporting Events</SelectItem>
                      
                      <SelectItem value="header-promo" disabled className="font-semibold text-gray-900 mt-2">PROMO & IMAGING</SelectItem>
                      <SelectItem value="TV Promo & Imaging" className="pl-6">TV Promo & Imaging</SelectItem>
                      <SelectItem value="Radio Promo & Imaging" className="pl-6">Radio Promo & Imaging</SelectItem>
                      <SelectItem value="Trailers" className="pl-6">Trailers</SelectItem>
                      <SelectItem value="PSA" className="pl-6">PSA (Public Service Announcement)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={fs.currency} onValueChange={(v) => setFs({ ...fs, currency: v })}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="USD" /></SelectTrigger>
                    <SelectContent>
                      {["USD","EUR","GBP","CAD","AUD"].map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="budget">Client budget ({fs.currency})</Label>
                  <Input id="budget" inputMode="decimal" value={fs.budgetInput} onChange={(e) => setFs({ ...fs, budgetInput: e.target.value })} placeholder="e.g. 750 or 500–800" />
                </div>
                <div className="space-y-1 flex items-center gap-3">{fs.platform === "Voice123" && (<><Switch id="safePay" checked={fs.safePayment} onCheckedChange={(v) => setFs({ ...fs, safePayment: v })} /><Label htmlFor="safePay">Voice123 Secure Payment 5%</Label></>)}</div>
                <div className="space-y-1 flex items-center gap-3">
                  <Switch id="liveDir" checked={!!fs.liveDirection} onCheckedChange={(v) => setFs({ ...fs, liveDirection: v })} />
                  <Label htmlFor="liveDir">Includes 1 hr live direction</Label>
                </div>
              </div>

              <UsageFieldsComponent fs={fs} setFs={setFs} />

              <div className="space-y-1">
                <Label htmlFor="notes">Project notes</Label>
                <Textarea id="notes" rows={3} placeholder="Exclusivity, NDA, rush, renewals, file splits, SRTs, etc." value={fs.notes || ""} onChange={(e) => setFs({ ...fs, notes: e.target.value })} />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm rounded-2xl">
            <CardContent className="p-4 md:p-6 space-y-4">
              <div className="space-y-1">
                <div className="text-sm text-gray-500">Anchor standard</div>
                <div className="text-2xl font-semibold">{anchor > 0 ? fmt(anchor, fs.currency) : "Set details to compute"}</div>
                <div className="text-sm text-gray-500">Posted budget vs standard</div>
                <div className="text-xl">
                  {anchor > 0 && budgetParsed.low > 0 ? (
                    budgetParsed.isSingle ? 
                      `${toPct(pctLow)} of standard` : 
                      `${toPct(pctLow)} - ${toPct(pctHigh)} of standard`
                  ) : "Enter budget + details"}
                </div>
                <div className="text-sm text-gray-500">Net after platform fee</div>
                <div className="text-xl">
                  {budgetParsed.isSingle ? (
                    <>{fmt(netInfoLow.net || 0, fs.currency)} <span className="text-gray-500 text-sm">({Math.round((netInfoLow.feePct || 0) * 100)}% fee)</span></>
                  ) : (
                    <>{fmt(netInfoLow.net || 0, fs.currency)} - {fmt(netInfoHigh.net || 0, fs.currency)} <span className="text-gray-500 text-sm">({Math.round((netInfoLow.feePct || 0) * 100)}% fee)</span></>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600"><Info className="w-4 h-4" />Paste-ready responses</div>
                <Textarea value={noteText} readOnly rows={16} className="font-mono text-xs" placeholder="Select platform, usage, and enter a budget to generate responses." />
              </div>

              <div className="text-xs text-gray-500">
                <p className="mb-1 font-medium">Notes</p>
                <ul className="list-disc ml-4 space-y-1">
                  <li>Explainer reflects GVAA Non-Broadcast table: Single ≤90s, Bulk per-video tiers, Retail routes to Commercial.</li>
                  <li>IVR/MOH supports minimum, per-prompt, per-word, per-hour, and MOH formulas.</li>
                  <li>Games include mobile character and educational anchors. Broader game categories TBD.</li>
                  <li>Animation and Audiobook categories are placeholders to be populated from GVAA Master.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
// Main export with password gate
export default function Page() {
  return (
    <PasswordGate>
      <GVAACalculator />
    </PasswordGate>
  );
}
