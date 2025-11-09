"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingCart, Trash2, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ========================================
// QUOTE BUILDER TYPES
// ========================================

interface QuoteItem {
  id: string;
  category: string;
  subType: string;
  rate: string;
  description: string;
  timestamp: number;
}
// ========================================
// QUOTE BUILDER COMPONENTS
// ========================================

// Quote Builder Sidebar Component
const QuoteBuilder: React.FC<{
  items: QuoteItem[];
  onRemoveItem: (id: string) => void;
  onGenerateQuote: () => void;
  onClearAll: () => void;
}> = ({ items, onRemoveItem, onGenerateQuote, onClearAll }) => {
  if (items.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShoppingCart className="w-5 h-5" />
            Quote Builder
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Calculate rates and add them here to build your quote.
          </p>
        </CardContent>
      </Card>
    );
  }

  const calculateTotal = () => {
    let lowTotal = 0;
    let highTotal = 0;
    
    items.forEach(item => {
      const rates = item.rate.match(/\$([0-9,]+)(?:–|-)\$([0-9,]+)/);
      if (rates) {
        lowTotal += parseInt(rates[1].replace(/,/g, ''));
        highTotal += parseInt(rates[2].replace(/,/g, ''));
      } else {
        const singleRate = item.rate.match(/\$([0-9,]+)/);
        if (singleRate) {
          const amount = parseInt(singleRate[1].replace(/,/g, ''));
          lowTotal += amount;
          highTotal += amount;
        }
      }
    });

    return { lowTotal, highTotal };
  };

  const { lowTotal, highTotal } = calculateTotal();

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShoppingCart className="w-5 h-5" />
            Quote ({items.length})
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearAll}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {items.map((item) => (
            <div 
              key={item.id}
              className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{item.category}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 truncate">
                    {item.subType}
                  </div>
                  {item.description && (
                    <div className="text-xs text-slate-500 dark:text-slate-500 mt-1 italic line-clamp-2">
                      {item.description}
                    </div>
                  )}
                  <div className="text-sm font-semibold text-green-700 dark:text-green-300 mt-2">
                    {item.rate}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveItem(item.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-sm">Estimated Total:</span>
            <span className="text-lg font-bold text-green-700 dark:text-green-300">
              ${lowTotal.toLocaleString()}–${highTotal.toLocaleString()}
            </span>
          </div>
          
          <Button 
            onClick={onGenerateQuote}
            className="w-full"
            size="sm"
          >
            <FileText className="w-4 h-4 mr-2" />
            Generate Quote
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Quote Preview Modal Component
const QuotePreview: React.FC<{ 
  items: QuoteItem[];
  onClose: () => void;
}> = ({ items, onClose }) => {
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const calculateTotal = () => {
    let lowTotal = 0;
    let highTotal = 0;
    
    items.forEach(item => {
      const rates = item.rate.match(/\$([0-9,]+)(?:–|-)\$([0-9,]+)/);
      if (rates) {
        lowTotal += parseInt(rates[1].replace(/,/g, ''));
        highTotal += parseInt(rates[2].replace(/,/g, ''));
      } else {
        const singleRate = item.rate.match(/\$([0-9,]+)/);
        if (singleRate) {
          const amount = parseInt(singleRate[1].replace(/,/g, ''));
          lowTotal += amount;
          highTotal += amount;
        }
      }
    });

    return { lowTotal, highTotal };
  };

  const { lowTotal, highTotal } = calculateTotal();
  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const generateQuoteText = () => {
    let quote = `VOICE OVER QUOTE\n`;
    quote += `Date: ${today}\n\n`;
    
    if (clientName) quote += `Client: ${clientName}\n`;
    if (projectName) quote += `Project: ${projectName}\n`;
    if (clientName || projectName) quote += `\n`;
    quote += `---\n\n`;
    
    items.forEach((item, index) => {
      quote += `${index + 1}. ${item.category} — ${item.subType}\n`;
      if (item.description) {
        quote += `   ${item.description}\n`;
      }
      quote += `   Rate: ${item.rate}\n\n`;
    });
    
    quote += `---\n\n`;
    quote += `ESTIMATED TOTAL: $${lowTotal.toLocaleString()}–$${highTotal.toLocaleString()}\n\n`;
    
    if (additionalNotes) {
      quote += `NOTES:\n${additionalNotes}\n\n`;
    }
    
    quote += `---\n\n`;
    quote += `TERMS & INCLUSIONS:\n`;
    quote += `• Rates based on GVAA (Global Voice Acting Academy) standards\n`;
    quote += `• Clean edit + up to 1 hr live direction included\n`;
    quote += `• Minor pickups ≤15 mins: $150 or 50% of original fee (whichever greater)\n`;
    quote += `• Major pickups / script rewrites: New scope and quote\n`;
    quote += `• Talent error: No charge\n`;
    quote += `• Rights/usage begin after payment clears\n`;
    
    return quote;
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generateQuoteText());
    alert('Quote copied to clipboard!');
  };

  const handleDownload = () => {
    const text = generateQuoteText();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voice-over-quote-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Professional Quote</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Client Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="client-name">Client Name (Optional)</Label>
                <Input
                  id="client-name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Enter client name"
                />
              </div>
              <div>
                <Label htmlFor="project-name">Project Name (Optional)</Label>
                <Input
                  id="project-name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name"
                />
              </div>
            </div>

            {/* Quote Preview */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-slate-50 dark:bg-slate-900 max-h-[400px] overflow-y-auto">
              <pre className="text-sm whitespace-pre-wrap font-mono">
                {generateQuoteText()}
              </pre>
            </div>

            {/* Additional Notes */}
            <div>
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Add any additional terms, conditions, or notes..."
                rows={4}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button onClick={handleCopyToClipboard} className="flex-1">
                Copy to Clipboard
              </Button>
              <Button onClick={handleDownload} variant="outline" className="flex-1">
                Download as TXT
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ========================================
// CATEGORIES AND RATE DATA
// ========================================

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
      "Local — Regional (Terrestrial)",
      "National (Terrestrial)",
      "Digital Radio",
      "Value Menu — Terrestrial + Digital (Local/Regional)",
      "Value Menu — Terrestrial + Digital (National)",
      "Automotive (Radio)",
      "Radio/Podcast Dramas",
      "PSA — Public Service Announcement"
    ] 
  },
  { 
    id: "tv", 
    name: "TV", 
    subTypes: [
      "Local / Regional",
      "National",
      "TV + Digital Visual — Paid Social",
      "TV + Digital Visual — Online Pre-Roll (Includes Paid Social)",
      "TV + Digital Visual — OTT/CTV (Includes Pre-Roll & Paid Social)",
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
      "Corporate & Industrial Narration — Finished Minute Scale",
      "Corporate & Industrial Narration — Recording Time Scale",
      "Explainer Videos",
      "Museum Tours — Educational",
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
      "Non-Union Original Animation — 22 Minute Episode",
      "Non-Union Original Animation — 11 Minute Episode or Less",
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
      "Union Scale — PFH",
      "Non-Union — PFH",
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
      "Cinema Usage — Term (1—3 States)",
      "Cinema Usage — Term (4+ States)",
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

// Rate data objects
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
  "National — 1 Year": "$1,750 (up to 2 hr session)",
  "North America (US & Canada) — 1 Year": "$2,500 (up to 2 hr session)",
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
  "Audio Drama — Non-Principal": "$400–$500 (up to 4 hrs)",
  "Audio Drama — Principal": "$800–$1,000 (up to 4 hrs)",
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

const medicalPerWordRateLow = 0.25;
const medicalPerWordRateHigh = 0.50;

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
  "Local — Small Market": "$100",
  "Regional — Medium Market": "$325–$500",
  "National — Large Market": "$1,500–$2,000",
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
  "1 Year": "$2,400–$3,000",
};

const eventVideoRates = {
  "1 Year": { firstHourLow: 600, firstHourHigh: 700, addHourLow: 300, addHourHigh: 350 },
  "Full Buyout": { firstHourLow: 2000, firstHourHigh: 2100, addHourLow: 1000, addHourHigh: 1100 },
};

const tradeShowRates = {
  "1 Year": { firstHourLow: 600, firstHourHigh: 700, addHourLow: 300, addHourHigh: 350 },
  "Full Buyout": { firstHourLow: 2000, firstHourHigh: 2100, addHourLow: 1000, addHourHigh: 1100 },
};

const studioFeeRates = {
  "ISDN / Source Connect": { low: 25, high: 100 },
  "Phone Patch": { low: 10, high: 25 },
  "Editing (breaths/clicks/sequencing)": { low: 25, high: 50 },
};

// ========================================
// MAIN RATE CALCULATOR COMPONENT
// ========================================

export function RateCalculatorUI() {
  // Quote Builder State
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [showQuotePreview, setShowQuotePreview] = useState(false);
  const [itemDescription, setItemDescription] = useState("");

  // Existing Calculator State
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
  const [museumRecordingHours, setMuseumRecordingHours] = useState<number>(1);
  const [selectedPodcastType, setSelectedPodcastType] = useState<string | null>(null);
  const [medTechCalcMethod, setMedTechCalcMethod] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState<number>(0);
  const [explainerCalcMethod, setExplainerCalcMethod] = useState<string | null>(null);
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
  const [selectedFeeType, setSelectedFeeType] = useState<string | null>(null);
  const [selectedPickupType, setSelectedPickupType] = useState<string | null>(null);
  const [originalFee, setOriginalFee] = useState<number | string>("");

  // Quote Builder Functions
  const handleAddToQuote = () => {
    if (!calculatedRate || !selectedCategory || !selectedSubType) return;

    const currentCategory = categories.find(cat => cat.id === selectedCategory);
    if (!currentCategory) return;

    const newItem: QuoteItem = {
      id: `${Date.now()}-${Math.random()}`,
      category: currentCategory.name,
      subType: selectedSubType,
      rate: calculatedRate,
      description: itemDescription,
      timestamp: Date.now()
    };

    setQuoteItems(prev => [...prev, newItem]);
    setItemDescription("");
    
    // Scroll quote builder into view on mobile
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        document.getElementById('quote-builder')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  };

  const handleRemoveItem = (id: string) => {
    setQuoteItems(prev => prev.filter(item => item.id !== id));
  };

  const handleGenerateQuote = () => {
    setShowQuotePreview(true);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all items from your quote?')) {
      setQuoteItems([]);
    }
  };

  // Existing Functions
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubType(null);
  };

  const handleSubTypeSelect = (subType: string) => {
    setSelectedSubType(subType);
    
    // Reset ALL form inputs
    setSelectedTerm(null);
    setNumberOfTags(1);
    setSelectedTier(null);
    setNumberOfSpots(1);
    setSelectedRole(null);
    setSelectedMarket(null);
    setSelectedProgramLength(null);
    setSelectedInfomercialMarket(null);
    setSelectedDuration(null);
    setNumberOfHours(1);
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
    setSessionLength("");
    setNumEpisodes(1);
    setGameCalcMethod(null);
    setNumVoices(1);
    setSelectedPromoMarket(null);
    setSelectedIvrModel(null);
    setNumPrompts(0);
    setNumParagraphs(0);
    setSelectedRosterModel(null);
    setSelectedFeeType(null);
    setSelectedPickupType(null);
    setOriginalFee("");
  };

  const handleTierSelect = (tier: string) => {
    setSelectedTier(tier);
    setNumberOfSpots(1);
  };

  const currentCategory = categories.find(cat => cat.id === selectedCategory);

// ========================================
  // CALCULATION LOGIC (useEffect)
  // ========================================
  
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
        const lowRate = rates[0] * numberOfSpots;
        const highRate = rates[1] * numberOfSpots;
        setCalculatedRate(`$${lowRate}–$${highRate}`);
      }
    }
    // Calculator for: Radio -> Local - Regional
    else if (selectedSubType === "Local — Regional (Terrestrial)" && selectedTerm) {
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
    else if (selectedSubType === "Value Menu — Terrestrial + Digital (Local/Regional)" && selectedTerm) {
      const rate = radioValueLocalRates[selectedTerm as keyof typeof radioValueLocalRates];
      setCalculatedRate(rate || null);
    }
    // Calculator for: Radio -> Value Menu (National)
    else if (selectedSubType === "Value Menu — Terrestrial + Digital (National)" && selectedTerm) {
      const rate = radioValueNationalRates[selectedTerm as keyof typeof radioValueNationalRates];
      setCalculatedRate(rate || null);
    }
    // Calculator for: Radio -> Automotive (Radio)
    else if (selectedSubType === "Automotive (Radio)" && selectedTier) {
      const rates = automotiveRates[selectedTier as keyof typeof automotiveRates];
      if (typeof rates === 'string') { setCalculatedRate(rates); }
      else if (Array.isArray(rates)) {
        const lowRate = rates[0] * numberOfSpots;
        const highRate = rates[1] * numberOfSpots;
        setCalculatedRate(`$${lowRate}–$${highRate}`);
      }
    }
    // Calculator for: Radio -> Radio/Podcast Dramas
    else if (selectedSubType === "Radio/Podcast Dramas" && selectedRole) {
      const rate = radioDramaRates[selectedRole as keyof typeof radioDramaRates];
      setCalculatedRate(rate || null);
    }
    // Calculator for: Radio -> PSA
    else if (selectedSubType === "PSA — Public Service Announcement") {
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
    // Calculator for: TV -> TV + Digital Visual — Paid Social
    else if (selectedSubType === "TV + Digital Visual — Paid Social" && selectedTerm && selectedMarket) {
      const combinedRate = tvPaidSocialRates[selectedTerm as keyof typeof tvPaidSocialRates];
      if (combinedRate) {
        const rateParts = combinedRate.split(' / ');
        const finalRate = selectedMarket === 'Local/Regional' ? (rateParts.length > 0 ? rateParts[0] : null) : (rateParts.length > 1 ? rateParts[1] : null);
        setCalculatedRate(finalRate || null);
      } else { setCalculatedRate(null); }
    }
    // Calculator for: TV -> TV + Digital Visual — Online Pre-Roll
    else if (selectedSubType === "TV + Digital Visual — Online Pre-Roll (Includes Paid Social)" && selectedTerm && selectedMarket) {
      const combinedRate = tvOnlinePreRollRates[selectedTerm as keyof typeof tvOnlinePreRollRates];
      if (combinedRate) {
        const rateParts = combinedRate.split(' / ');
        const finalRate = selectedMarket === 'Local/Regional' ? (rateParts.length > 0 ? rateParts[0] : null) : (rateParts.length > 1 ? rateParts[1] : null);
        setCalculatedRate(finalRate || null);
      } else { setCalculatedRate(null); }
    }
    // Calculator for: TV -> TV + Digital Visual — OTT/CTV
    else if (selectedSubType === "TV + Digital Visual — OTT/CTV (Includes Pre-Roll & Paid Social)" && selectedTerm && selectedMarket) {
      const combinedRate = tvOttRates[selectedTerm as keyof typeof tvOttRates];
      if (combinedRate) {
        const rateParts = combinedRate.split(' / ');
        const finalRate = selectedMarket === 'Local/Regional' ? (rateParts.length > 0 ? rateParts[0] : null) : (rateParts.length > 1 ? rateParts[1] : null);
        setCalculatedRate(finalRate || null);
      } else { setCalculatedRate(null); }
    }
    // Calculator for: TV -> Automotive (TV)
    else if (selectedSubType === "Automotive (TV)" && selectedTier) {
      const rates = automotiveRates[selectedTier as keyof typeof automotiveRates];
      if (typeof rates === 'string') { setCalculatedRate(rates); }
      else if (Array.isArray(rates)) {
        const lowRate = rates[0] * numberOfSpots;
        const highRate = rates[1] * numberOfSpots;
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
    else if (selectedSubType === "Corporate & Industrial Narration — Finished Minute Scale" && selectedDuration) {
      const rate = corporateMinuteRates[selectedDuration as keyof typeof corporateMinuteRates];
      setCalculatedRate(rate || null);
    }
    // Calculator for: Non-Broadcast -> Corporate Recording Time Scale
    else if (selectedSubType === "Corporate & Industrial Narration — Recording Time Scale") {
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
        setCalculatedRate("$300–$525");
      } else if (explainerCalcMethod === 'bulk' && wordCount > 0) {
        const baseRate = 250;
        if (wordCount <= 175) {
          setCalculatedRate(`$${baseRate}`);
        } else {
          const additionalWords = wordCount - 175;
          const additionalBlocks = Math.ceil(additionalWords / 100);
          const additionalCharge = additionalBlocks * 50;
          const totalRate = baseRate + additionalCharge;
          const formattedRate = `$${totalRate.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
          setCalculatedRate(formattedRate);
        }
      } else {
        setCalculatedRate(null);
      }
    }
    // Calculator for: Non-Broadcast -> Museum Tours
    else if (selectedSubType === "Museum Tours — Educational" && selectedMuseumCategory && museumRecordingHours > 0) {
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
        const rate = medicalMinuteRates[selectedDuration as keyof typeof medicalMinuteRates];
        setCalculatedRate(rate || null);
      } else if (medTechCalcMethod === 'word' && wordCount > 0) {
        const lowTotal = wordCount * medicalPerWordRateLow;
        const highTotal = wordCount * medicalPerWordRateHigh;
        const formattedLow = lowTotal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        const formattedHigh = highTotal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        setCalculatedRate(`$${formattedLow}–$${formattedHigh}`);
      } else {
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
        setCalculatedRate("Refer to TV broadcast rates");
      } else {
        setCalculatedRate(null);
      }
    }
    // Calculator for: Non-Broadcast -> Airport Announcements
    else if (selectedSubType === "Airport Announcements") {
      if (numberOfAirports > 0 && numberOfHours > 0) {
        const lowRate_air = 1500 + Math.max(0, numberOfAirports - 1) * 1000;
        const highRate_air = 2000 + Math.max(0, numberOfAirports - 1) * 1500;
        const hourlyUpcharge = Math.max(0, numberOfHours - 2) * 500;
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
        setCalculatedRate(null);
      }    
    }
    // Calculator for: Animation / Dubbing
    else if (selectedCategory === "animation_dubbing") {
      const numSessionHours = Number(sessionLength) || 0;

      if (selectedSubType === "Non-Union Original Animation — 22 Minute Episode") {
        setCalculatedRate("$1,100–$1,200");
      }
      else if (selectedSubType === "Non-Union Original Animation — 11 Minute Episode or Less") {
        const lowRate = numEpisodes * 400;
        const highRate = numEpisodes * 700;
        setCalculatedRate(`$${lowRate.toFixed(0)}–$${highRate.toFixed(0)}`);
      }
      else if (selectedSubType === "Dubbing (Film/TV/Animation)" && numSessionHours > 0) {
        const hoursToCharge = Math.max(2, numSessionHours);
        const rate = hoursToCharge * 125;
        setCalculatedRate(`~$${rate.toFixed(0)}`);
      }
      else {
        setCalculatedRate(null);
      }
    }
    // Calculator for: Video Games / Toys & Games
    else if (selectedCategory === "video_games_toys") {
      const numSessionHours = Number(sessionLength) || 0;
      const numMins = Number(finishedMinutes) || 0;

      if (selectedSubType === "Video Games (Non-Union)") {
        if (gameCalcMethod === 'hourly' && numSessionHours > 0) {
          const lowRate = numSessionHours * 200;
          const highRate = numSessionHours * 350;
          setCalculatedRate(`$${lowRate.toFixed(0)}–$${highRate.toFixed(0)} (2-4 hr min)`);
        } else if (gameCalcMethod === 'flat') {
          setCalculatedRate("$500 (1 hr max)");
        } else {
          setCalculatedRate(null);
        }
      }
      else if (selectedSubType === "Video Games (Union)") {
        setCalculatedRate("$825.50 (Up to 4 hr session)");
      }
      else if (selectedSubType === "Toys & Games" && numSessionHours > 0) {
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
        const lowRate = numSessionHours * 150;
        const highRate = numSessionHours * 300;
        setCalculatedRate(`$${lowRate.toFixed(0)}–$${highRate.toFixed(0)}`);
      }
      else if (selectedSubType === "Mobile Game Apps (Non-Union Character)") {
        if (gameCalcMethod === 'per_game') {
          let lowRate = 300;
          let highRate = 500;
          const extraVoices = Math.max(0, numVoices - 4);
          if (extraVoices > 0) {
            lowRate += extraVoices * 75;
            highRate += extraVoices * 100;
          }
          setCalculatedRate(`$${lowRate.toFixed(0)}–$${highRate.toFixed(0)}`);
        } else if (gameCalcMethod === 'hourly' && numSessionHours > 0) {
          const hoursToCharge = Math.max(2, numSessionHours);
          const lowRate = hoursToCharge * 200;
          const highRate = hoursToCharge * 300;
          setCalculatedRate(`$${lowRate.toFixed(0)}–$${highRate.toFixed(0)}`);
        } else {
          setCalculatedRate(null);
        }
      }
      else if (selectedSubType === "Mobile Game Apps (Union Character)") {
        setCalculatedRate("$825.50 (Up to 3 voices, 4 hr max)");
      }
      else if (selectedSubType === "Mobile Game Apps (E-Learning/Educational)" && numMins > 0) {
        if (numMins >= 1 && numMins <= 5) {
          setCalculatedRate("$350–$400");
        } else if (numMins > 5 && numMins <= 10) {
          const lowRate = 350 + (numMins - 5) * ((600 - 350) / 5);
          const highRate = 400 + (numMins - 5) * ((600 - 400) / 5);
          setCalculatedRate(`$${lowRate.toFixed(0)}–$${highRate.toFixed(0)}`);
        } else if (numMins > 10) {
          const lowRate = numMins * 60;
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
      const numRawHours = Number(numberOfHours) || 0;

      if (selectedSubType === "Union Scale — PFH" && numFinishedHours > 0) {
        const lowRate = numFinishedHours * 150;
        const highRate = numFinishedHours * 225;
        setCalculatedRate(`$${lowRate.toFixed(0)}–$${highRate.toFixed(0)}`);
      }
      else if (selectedSubType === "Non-Union — PFH" && numFinishedHours > 0) {
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
          setCalculatedRate("$150");
        }
        else if (selectedIvrModel === 'ivr_prompt' && numPrompts > 0) {
          const lowRate = 150 + (numPrompts * 1);
          const highRate = 200 + (numPrompts * 5);
          setCalculatedRate(`$${lowRate.toFixed(0)}–$${highRate.toFixed(0)}`);
        }
        else if (selectedIvrModel === 'ivr_word' && numWords > 0) {
          const lowRate = numWords * 0.08;
          const highRate = numWords * 0.25;
          setCalculatedRate(`$${lowRate.toFixed(2)}–$${highRate.toFixed(2)}`);
        }
        else if (selectedIvrModel === 'ivr_hour' && numHours > 0) {
          const lowRate = numHours * 50;
          const highRate = numHours * 200;
          setCalculatedRate(`$${lowRate.toFixed(0)}–$${highRate.toFixed(0)}`);
        }
        else if (selectedIvrModel === 'moh_min') {
          setCalculatedRate("$200");
        }
        else if (selectedIvrModel === 'moh_min_rate' && numMins > 0) {
          const rate = numMins * 100;
          setCalculatedRate(`$${rate.toFixed(0)}`);
        }
        else if (selectedIvrModel === 'moh_para' && numParas > 0) {
          const rate = numParas * 8;
          setCalculatedRate(`$${rate.toFixed(0)}`);
        }
        else {
          setCalculatedRate(null);
        }
      }
      else if (selectedSubType === "Roster Talent") {
        if (selectedRosterModel === 'prod_house' && numParas > 0) {
          const lowRate = numParas * 10;
          const highRate = numParas * 20;
          setCalculatedRate(`$${lowRate.toFixed(0)}–$${highRate.toFixed(0)}`);
        }
        else if (selectedRosterModel === 'other_hourly' && numHours > 0) {
          const halfHours = numHours * 2;
          const rate = halfHours * 50;
          setCalculatedRate(`$${rate.toFixed(0)}`);
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

      if (selectedSubType === "Cinema Usage — Term (1—3 States)" && selectedTerm) {
        const rate = cinemaRates1to3States[selectedTerm as keyof typeof cinemaRates1to3States];
        setCalculatedRate(rate || null);
      }
      else if (selectedSubType === "Cinema Usage — Term (4+ States)" && selectedTerm) {
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
    // Calculator for: Fees / Pick-Ups / Editing
    else if (selectedCategory === "fees_pickups_editing") {
      const numHours = Number(numberOfHours) || 0;
      const fee = Number(originalFee) || 0;

      if (selectedSubType === "Studio Fees & Editing" && selectedFeeType && numHours > 0) {
        const rates = studioFeeRates[selectedFeeType as keyof typeof studioFeeRates];
        if (rates) {
          const lowTotal = rates.low * numHours;
          const highTotal = rates.high * numHours;
          setCalculatedRate(`$${lowTotal.toFixed(0)}–$${highTotal.toFixed(0)}`);
        } else {
          setCalculatedRate(null);
        }
      }
      else if (selectedSubType === "Pickups" && selectedPickupType) {
        if (selectedPickupType === "Talent Error") {
          setCalculatedRate("Free");
        }
        else if (selectedPickupType === "Minor Pickups (≤15 mins)" && fee > 0) {
          const rate = Math.max(150, fee * 0.50);
          setCalculatedRate(`$${rate.toFixed(0)} (Min $150 or 50% of original fee)`);
        }
        else if (selectedPickupType === "Major Pickups (rewrites)" && numHours > 0) {
          const numHalfHours = numHours * 2;
          const rate = numHalfHours * 260;
          setCalculatedRate(`$${rate.toFixed(0)} (at $260 / 30 mins)`);
        }
        else {
          setCalculatedRate(null);
        }
      }
      else {
        setCalculatedRate(null);
      }
    }
  }, [
    selectedSubType, 
    selectedCategory, 
    selectedTerm, 
    numberOfTags, 
    selectedTier, 
    numberOfSpots, 
    selectedRole, 
    selectedMarket, 
    selectedProgramLength, 
    selectedInfomercialMarket, 
    selectedDuration, 
    numberOfHours, 
    selectedMuseumCategory, 
    museumRecordingHours, 
    selectedPodcastType, 
    medTechCalcMethod, 
    wordCount, 
    explainerCalcMethod, 
    selectedYouTubeType, 
    selectedLobbyType, 
    numberOfAirports, 
    finishedMinutes, 
    finishedHours, 
    sessionHours, 
    sessionLength, 
    numEpisodes, 
    gameCalcMethod, 
    numVoices, 
    selectedPromoMarket, 
    selectedIvrModel, 
    numPrompts, 
    numParagraphs, 
    selectedRosterModel, 
    selectedFeeType, 
    selectedPickupType, 
    originalFee
  ]);

// ========================================
  // RENDER / JSX
  // ========================================

  return (
    <div className="flex justify-center items-start min-h-screen bg-slate-50 dark:bg-slate-900 p-4 pt-10">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Calculator (2/3 width on desktop) */}
        <div className="lg:col-span-2">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                GVAA Rate Calculator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                
                {/* Category Card Selection */}
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
                      <span className="font-medium text-slate-800 dark:text-slate-100">
                        {category.name}
                      </span>
                    </button>
                  ))}
                </div>

                {/* SubType Selection */}
                {currentCategory && currentCategory.subTypes && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <Label className="text-base font-medium mb-3 block">
                      Select Sub-Type for {currentCategory.name}:
                    </Label>
                    <RadioGroup
                      value={selectedSubType ?? ""}
                      onValueChange={handleSubTypeSelect}
                      className="grid gap-2"
                    >
                      {currentCategory.subTypes.map((subType) => (
                        <div 
                          key={subType} 
                          className="flex items-center space-x-2 p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          <RadioGroupItem value={subType} id={subType} />
                          <Label htmlFor={subType} className="cursor-pointer flex-1">
                            {subType}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                {/* Dynamic Input Fields - ALL THE EXISTING FORMS FROM YOUR ORIGINAL FILE */}
                {/* I'll include a few examples, but you'll need to paste ALL your existing form sections here */}
                
                {/* Example: Non-Paid Web */}
                {selectedSubType === "Non-Paid Web (Owned Social or Client Site)" && (
                  <div className="grid gap-4 pt-6 mt-6 border-t border-slate-200 dark:border-slate-700">
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
                  </div>
                )}

                {/* 
                  MARCO: INSERT ALL YOUR OTHER FORM SECTIONS HERE
                  Copy from line ~600 to line ~3100 of your original file
                  All the forms for:
                  - Paid Social
                  - Online Pre-Roll
                  - Digital Tags
                  - Automotive
                  - All Radio forms
                  - All TV forms
                  - All Non-Broadcast forms
                  - E-Learning forms
                  - Animation forms
                  - Video Games forms
                  - Promo & Imaging forms
                  - Audiobooks forms
                  - IVR forms
                  - Cinema forms
                  - Fees/Pickups forms
                  
                  Just copy all those form sections directly from your original file
                */}

                {/* Rate Display with Add to Quote Button */}
                {calculatedRate && (
                  <div className="mt-6 space-y-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg text-center">
                      <p className="text-sm text-slate-600 dark:text-slate-400">GVAA Rate Range:</p>
                      <p className="text-2xl font-semibold text-green-700 dark:text-green-300">
                        {calculatedRate}
                      </p>
                    </div>
                    
                    {/* NEW: Add to Quote Section */}
                    <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                      <div>
                        <Label htmlFor="item-description" className="text-sm font-medium">
                          Description (Optional)
                        </Label>
                        <Input
                          id="item-description"
                          value={itemDescription}
                          onChange={(e) => setItemDescription(e.target.value)}
                          placeholder="e.g., '60-second hero video + 2 cutdowns' or '1-year license'"
                          className="mt-1"
                        />
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Add notes about deliverables, usage terms, or any other details
                        </p>
                      </div>
                      <Button 
                        onClick={handleAddToQuote}
                        className="w-full"
                        size="lg"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Quote Builder
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Quote Builder (1/3 width on desktop) */}
        <div className="lg:col-span-1" id="quote-builder">
          <div className="sticky top-4">
            <QuoteBuilder
              items={quoteItems}
              onRemoveItem={handleRemoveItem}
              onGenerateQuote={handleGenerateQuote}
              onClearAll={handleClearAll}
            />
          </div>
        </div>
      </div>

      {/* Quote Preview Modal */}
      {showQuotePreview && (
        <QuotePreview
          items={quoteItems}
          onClose={() => setShowQuotePreview(false)}
        />
      )}
    </div>
  );
}
