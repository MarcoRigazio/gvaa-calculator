"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingCart, Trash2, FileText, X, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

function EnterHint() {
  return (
    <p className="mt-1 text-xs text-slate-400">
      Press Enter to apply and collapse this section.
    </p>
  );
}


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
      <Card className="w-full rounded-2xl border border-slate-800 bg-slate-900/80 text-slate-100 shadow-lg shadow-slate-900/40">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-100">
            <ShoppingCart className="w-4 h-4 text-slate-300" />
            Quote Builder
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-300">
            Calculate rates and add them here to build your quote.
          </p>
        </CardContent>
      </Card>
    );
  }


  const calculateTotal = () => {
    let lowTotal = 0;
    let highTotal = 0;

    items.forEach((item) => {
      const rates = item.rate.match(/\$([0-9,]+)(?:—|-)\$([0-9,]+)/);
      if (rates) {
        lowTotal += parseInt(rates[1].replace(/,/g, ""));
        highTotal += parseInt(rates[2].replace(/,/g, ""));
      } else {
        const singleRate = item.rate.match(/\$([0-9,]+)/);
        if (singleRate) {
          const amount = parseInt(singleRate[1].replace(/,/g, ""));
          lowTotal += amount;
          highTotal += amount;
        }
      }
    });

    return { lowTotal, highTotal };
  };

  const { lowTotal, highTotal } = calculateTotal();

  return (
    <Card className="w-full rounded-2xl border border-slate-800 bg-slate-900/80 text-slate-100 shadow-lg shadow-slate-900/40">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-100">
            <ShoppingCart className="w-4 h-4 text-slate-300" />
            Quote ({items.length})
          </CardTitle>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-red-400 hover:text-red-300 hover:bg-red-900/30"
          >
            Clear All
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        {/* Line items list */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl border border-slate-700 bg-slate-900/70"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-100">
                    {item.category}
                  </div>
                  <div className="mt-1 text-xs text-slate-400 truncate">
                    {item.subType}
                  </div>
                  {item.description && (
                    <div className="mt-1 text-xs text-slate-300 italic line-clamp-2">
                      {item.description}
                    </div>
                  )}
                  <div className="mt-2 text-sm font-semibold text-emerald-300">
                    {item.rate}
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveItem(item.id)}
                  className="flex-shrink-0 text-red-400 hover:text-red-300 hover:bg-red-900/30"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Totals + export */}
        <div className="mt-6 pt-4 border-t border-slate-700">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-100">
              Estimated Total:
            </span>
            <span className="text-lg font-bold text-slate-50">
              ${lowTotal.toLocaleString()}—${highTotal.toLocaleString()}
            </span>
          </div>

          <Button
            type="button"
            onClick={onGenerateQuote}
            size="sm"
            className="w-full justify-center cursor-pointer border border-slate-700"
          >
            <FileText className="w-4 h-4 mr-2" />
            Review &amp; Export
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

    items.forEach((item) => {
      const rates = item.rate.match(/\$([0-9,]+)(?:—|-)\$([0-9,]+)/);
      if (rates) {
        lowTotal += parseInt(rates[1].replace(/,/g, ""));
        highTotal += parseInt(rates[2].replace(/,/g, ""));
      } else {
        const singleRate = item.rate.match(/\$([0-9,]+)/);
        if (singleRate) {
          const amount = parseInt(singleRate[1].replace(/,/g, ""));
          lowTotal += amount;
          highTotal += amount;
        }
      }
    });

    return { lowTotal, highTotal };
  };

  const { lowTotal, highTotal } = calculateTotal();
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
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
    quote += `ESTIMATED TOTAL: $${lowTotal.toLocaleString()}—$${highTotal.toLocaleString()}\n\n`;

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
    alert("Quote copied to clipboard!");
  };

  const handleDownload = () => {
    const text = generateQuoteText();
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
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
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
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
                  autoComplete="new-password"
                />
              </div>
              <div>
                <Label htmlFor="project-name">Project Name (Optional)</Label>
                <Input
                  id="project-name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name"
                  autoComplete="new-password"
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
                autoComplete="new-password"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                type="button"
                onClick={handleCopyToClipboard}
                className="flex-1"
              >
                Copy to Clipboard
              </Button>
              <Button
                type="button"
                onClick={handleDownload}
                variant="outline"
                className="flex-1"
              >
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
      "Automotive",
    ],
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
      "PSA — Public Service Announcement",
    ],
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
      "Point of Sale (POS)",
    ],
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
      "Airport Announcements",
    ],
  },
  {
    id: "elearning",
    name: "E-Learning",
    subTypes: [
      "Per Word",
      "Per Finished Minute",
      "Per Raw Hour",
      "Per Finished Hour",
      "Directed Sessions",
    ],
  },
  {
    id: "animation_dubbing",
    name: "Animation / Dubbing",
    subTypes: [
      "Non-Union Original Animation — 22 Minute Episode",
      "Non-Union Original Animation — 11 Minute Episode or Less",
      "Dubbing (Film/TV/Animation)",
    ],
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
      "Mobile Game Apps (E-Learning/Educational)",
    ],
  },
  {
    id: "promo_imaging",
    name: "Promo & Imaging",
    subTypes: ["TV", "Radio", "Trailers"],
  },
  {
    id: "audiobooks",
    name: "Audiobooks",
    subTypes: [
      "Union Scale — PFH",
      "Non-Union — PFH",
      "Per RAW Hour",
      "Production Add-On",
      "Hybrid Agreement",
    ],
  },
  {
    id: "ivr_message_on_hold",
    name: "IVR / Message-on-Hold",
    subTypes: ["Direct Quote", "Roster Talent"],
  },
  {
    id: "cinema_events",
    name: "Cinema / Events",
    subTypes: [
      "Cinema Usage — Term (1—3 States)",
      "Cinema Usage — Term (4+ States)",
      "Event Video",
      "Trade Shows / Sporting Events",
    ],
  },
  {
    id: "fees_pickups_editing",
    name: "Fees / Pick-Ups / Editing",
    subTypes: ["Studio Fees & Editing", "Pickups"],
  },
];

// Rate data objects
const nonPaidWebRates = {
  "3 Months": "$300—$500",
  "1 Year": "$500—$700",
  "3 Years": "$900—$1,100",
  "5 Years": "$1,300—$1,500",
};

const paidSocialRates = {
  "1 Month": "$300—$450",
  "3 Months": "$400—$750",
  "1 Year": "$1,000—$1,500",
};

const onlinePreRollRates = {
  "1 Month": "$650—$800",
  "3 Months": "$750—$1,100",
  "1 Year": "$2,250—$3,000",
};

const ottRates = {
  "1 Month": "$1,250—$1,750",
  "3 Months": "$1,500—$2,250",
  "1 Year": "$4,000—$6,000",
};

const automotiveRates = {
  "Tier 1": "Union Rate",
  "Tier 2": [75, 200],
  "Tier 3 (:30/:60)": [150, 200],
  "Tier 3 (:15/:10/:6)": [75, 100],
};

const radioLocalRates = {
  "1 Month": "$275—$400",
  "3 Months": "$350—$600",
  "1 Year": "$900—$1,500",
};

const radioNationalRates = {
  "1 Month": "$550—$700",
  "3 Months": "$750—$1,000",
  "1 Year": "$1,500—$2,500",
};

const radioDigitalRates = {
  "1 Month": "$550—$700",
  "3 Months": "$750—$1,000",
  "1 Year": "$1,750—$2,500",
};

const radioValueLocalRates = {
  "1 Month": "$400—$600",
  "3 Months": "$500—$900",
  "1 Year": "$1,250—$2,250",
};

const radioValueNationalRates = {
  "1 Month": "$800—$1,000",
  "3 Months": "$1,250—$1,500",
  "1 Year": "$2,500—$3,250",
};

const radioDramaRates = {
  "Principal Actors": "$800—$1,000 (up to 4 hrs)",
  "Non-Principal Actors": "$400—$500 (up to 4 hrs)",
};

const tvLocalRates = {
  "1 Month": "$400—$750",
  "3 Months": "$650—$1,000",
  "1 Year": "$1,250—$2,250",
};

const tvNationalRates = {
  "1 Month": "$1,000—$1,500",
  "3 Months": "$1,750—$2,500",
  "1 Year": "$4,000—$8,000",
};

const tvPaidSocialRates = {
  "1 Month": "$525—$850 / $975—$1,465",
  "3 Months": "$780—$1,300 / $1,610—$2,440",
  "1 Year": "$1,680—$2,800 / $3,750—$7,125",
};

const tvOnlinePreRollRates = {
  "1 Month": "$790—$1,170 / $1,240—$1,725",
  "3 Months": "$1,050—$1,575 / $1,875—$2,700",
  "1 Year": "$2,625—$3,940 / $4,700—$8,250",
};

const tvOttRates = {
  "1 Month": "$1,240—$1,875 / $1,690—$2,440",
  "3 Months": "$1,615—$2,440 / $2,440—$3,565",
  "1 Year": "$3,940—$6,190 / $6,000—$10,500",
};

const inShowNarrationRates = {
  "24 Minutes": "$1,000—$1,500",
  "48 Minutes": "$2,000—$3,000",
};

const infomercialRates = {
  "National - 1 Year": "$1,750 (up to 2 hr session)",
  "North America (US & Canada) - 1 Year": "$2,500 (up to 2 hr session)",
};

const corporateMinuteRates = {
  "1—2 min": "$350—$450",
  "3—5 min": "$450—$550",
  "5—10 min": "$600—$700",
  "10—15 min": "$700—$800",
  "15—20 min": "$800—$950",
  "20—30 min": "$950—$1,250",
  "30—40 min": "$1,250—$1,750",
  "40—60 min": "$1,750—$2,350",
};

const museumCat1Rate = { firstHour: 505, additionalHalfHour: 148 };
const museumCat2Rate = { firstHour: 563, additionalHalfHour: 148 };

const podcastRates = {
  "Audio Drama — Non-Principal": "$400—$500 (up to 4 hrs)",
  "Audio Drama — Principal": "$800—$1,000 (up to 4 hrs)",
  "Intro/Outro": "$300—$400",
};

const medicalMinuteRates = {
  "1—2 min": "$400—$500",
  "3—5 min": "$600—$700",
  "5—10 min": "$700—$800",
  "10—15 min": "$800—$900",
  "15—20 min": "$900—$1,000",
  "20—30 min": "$1,000—$1,400",
  "30—40 min": "$1,400—$1,900",
  "40—60 min": "$1,900—$2,400",
};

const medicalPerWordRateLow = 0.25;
const medicalPerWordRateHigh = 0.5;

const youTubeRates = {
  "Narration: 3—5 min episodes": "$750—$1,000",
  "Channel Intro/Outro": "$500—$2,000",
};

const promoTvRates = {
  Local: "$150—$300",
  Regional: "$450—$600",
  National: "$750—$1,000",
  "Station Voice": "Custom Retainer",
};

const promoRadioRates = {
  Local: "$150—$200",
  Regional: "$350—$500",
  National: "$600—$850",
  "Station Voice": "Custom Retainer",
};

const promoTrailerRates = {
  "Local — Small Market": "$100",
  "Regional — Medium Market": "$325—$500",
  "National — Large Market": "$1,500—$2,000",
};

const cinemaRates1to3States = {
  "1 Month": "$300",
  "3 Months": "$425—$550",
  "6 Months": "$800—$950",
  "1 Year": "$1,200—$1,350",
};

const cinemaRates4PlusStates = {
  "1 Month": "$500",
  "3 Months": "$800—$1,050",
  "6 Months": "$1,600—$2,000",
  "1 Year": "$2,400—$3,000",
};

const eventVideoRates = {
  "1 Year": {
    firstHourLow: 600,
    firstHourHigh: 700,
    addHourLow: 300,
    addHourHigh: 350,
  },
  "Full Buyout": {
    firstHourLow: 2000,
    firstHourHigh: 2100,
    addHourLow: 1000,
    addHourHigh: 1100,
  },
};

const tradeShowRates = {
  "1 Year": {
    firstHourLow: 600,
    firstHourHigh: 700,
    addHourLow: 300,
    addHourHigh: 350,
  },
  "Full Buyout": {
    firstHourLow: 2000,
    firstHourHigh: 2100,
    addHourLow: 1000,
    addHourHigh: 1100,
  },
};

const studioFeeRates = {
  "ISDN / Source Connect": { low: 25, high: 100 },
  "Phone Patch": { low: 10, high: 25 },
  "Editing (breaths/clicks/sequencing)": { low: 25, high: 50 },
};

// ========================================
// MAIN RATE CALCULATOR COMPONENT
// ========================================

export function RateCalculatorAccordionUI() {
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
  const [selectedProgramLength, setSelectedProgramLength] = useState<
    string | null
  >(null);
  const [selectedInfomercialMarket, setSelectedInfomercialMarket] = useState<
    string | null
  >(null);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [numberOfHours, setNumberOfHours] = useState<number>(1);
  const [selectedMuseumCategory, setSelectedMuseumCategory] = useState<
    string | null
  >(null);
  const [museumRecordingHours, setMuseumRecordingHours] = useState<number>(1);
  const [selectedPodcastType, setSelectedPodcastType] = useState<string | null>(
    null
  );
  const [medTechCalcMethod, setMedTechCalcMethod] = useState<string | null>(
    null
  );
  const [wordCount, setWordCount] = useState<number>(0);
  const [explainerCalcMethod, setExplainerCalcMethod] = useState<string | null>(
    null
  );
  const [selectedYouTubeType, setSelectedYouTubeType] = useState<string | null>(
    null
  );
  const [numberOfAirports, setNumberOfAirports] = useState<number>(1);
  const [selectedLobbyType, setSelectedLobbyType] = useState<string | null>(
    null
  );
  const [finishedMinutes, setFinishedMinutes] = useState<number | string>("");
  const [finishedHours, setFinishedHours] = useState<number | string>("");
  const [sessionHours, setSessionHours] = useState<number | string>("");
  const [sessionLength, setSessionLength] = useState<number | string>("");
  const [numEpisodes, setNumEpisodes] = useState<number>(1);
  const [gameCalcMethod, setGameCalcMethod] = useState<string | null>(null);
  const [numVoices, setNumVoices] = useState<number>(1);
  const [selectedPromoMarket, setSelectedPromoMarket] = useState<string | null>(
    null
  );
  const [selectedIvrModel, setSelectedIvrModel] = useState<string | null>(null);
  const [numPrompts, setNumPrompts] = useState<number>(0);
  const [numParagraphs, setNumParagraphs] = useState<number>(0);
  const [selectedRosterModel, setSelectedRosterModel] = useState<string | null>(
    null
  );
  const [selectedFeeType, setSelectedFeeType] = useState<string | null>(null);
  const [selectedPickupType, setSelectedPickupType] = useState<string | null>(
    null
  );
  const [originalFee, setOriginalFee] = useState<number | string>("");
  const [isSubTypeAccordionOpen, setIsSubTypeAccordionOpen] = useState(true);
  const [isTermAccordionOpen, setIsTermAccordionOpen] = useState(false);
  const [isTagsAccordionOpen, setIsTagsAccordionOpen] = useState(false);

  // Subtypes that show guidance but should NOT be added to a quote
  const INFO_ONLY_SUBTYPES = new Set([
    "Mnemonics",
    "Point of Sale (POS)",
    "Digital Greeting Cards",
  ]);

  const isInfoOnlySubtype =
    selectedSubType !== null && INFO_ONLY_SUBTYPES.has(selectedSubType);

  // Quote Builder Functions
  const handleAddToQuote = () => {
    if (!calculatedRate || !selectedCategory || !selectedSubType) return;

    // Skip informational-only subtypes (guidance only, not addable to quote)
    if (selectedSubType && INFO_ONLY_SUBTYPES.has(selectedSubType)) {
      return;
    }


    const currentCategory = categories.find(
      (cat) => cat.id === selectedCategory
    );
    if (!currentCategory) return;

    const newItem: QuoteItem = {
      id: `${Date.now()}-${Math.random()}`,
      category: currentCategory.name,
      subType: selectedSubType,
      rate: calculatedRate,
      description: itemDescription,
      timestamp: Date.now(),
    };

    setQuoteItems((prev) => [...prev, newItem]);
    setItemDescription("");

    // Scroll quote builder into view on mobile
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        document
          .getElementById("quote-builder")
          ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 100);
    }
  };

  const handleRemoveItem = (id: string) => {
    setQuoteItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleGenerateQuote = () => {
    setShowQuotePreview(true);
  };

  const handleClearAll = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all items from your quote?"
      )
    ) {
      setQuoteItems([]);
    }
  };

  // Existing Functions
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubType(null);
    setIsSubTypeAccordionOpen(true);
  };

  const handleSubTypeSelect = (subType: string) => {
    setSelectedSubType(subType);
    setIsSubTypeAccordionOpen(false);

    setIsTermAccordionOpen(subType === "Automotive (TV)");

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

  const currentCategory = categories.find((cat) => cat.id === selectedCategory);

  // Auto-open Term when a Sub-Type is selected but no term chosen yet
  useEffect(() => {
    if (selectedSubType && !selectedTerm) {
      setIsTermAccordionOpen(true);
    }
  }, [selectedSubType, selectedTerm]);

  // Auto-open Tags accordion when Digital Tags is selected
  useEffect(() => {
    if (
      selectedCategory === "digital_visual" &&
      selectedSubType === "Digital Tags"
    ) {
      setIsTagsAccordionOpen(true);
    } else {
      setIsTagsAccordionOpen(false);
    }
  }, [selectedCategory, selectedSubType]);

  // ========================================
  // CALCULATION LOGIC (useEffect)
  // ========================================

  useEffect(() => {
    // Calculator for: Digital Visual -> Non-Paid Web
    if (
      selectedSubType === "Non-Paid Web (Owned Social or Client Site)" &&
      selectedTerm
    ) {
      const rate =
        nonPaidWebRates[selectedTerm as keyof typeof nonPaidWebRates];
      setCalculatedRate(rate || null);
    }
    // Calculator for: Digital Visual -> Paid Social
    else if (selectedSubType === "Paid Social" && selectedTerm) {
      const rate =
        paidSocialRates[selectedTerm as keyof typeof paidSocialRates];
      setCalculatedRate(rate || null);
    }
    // Calculator for: Digital Visual -> Online Pre-Roll
    else if (selectedSubType === "Online Pre-Roll / OLV" && selectedTerm) {
      const rate =
        onlinePreRollRates[selectedTerm as keyof typeof onlinePreRollRates];
      setCalculatedRate(rate || null);
    }
    // Calculator for: Digital Visual -> OTT/CTV
    else if (
      selectedSubType === "OTT/CTV (Includes Social & Pre-Roll)" &&
      selectedTerm
    ) {
      const rate = ottRates[selectedTerm as keyof typeof ottRates];
      setCalculatedRate(rate || null);
    }
    // Calculator for: Digital Visual -> Digital Tags
    else if (selectedSubType === "Digital Tags") {
      const lowRate = 175 * numberOfTags;
      const highRate = 225 * numberOfTags;
      setCalculatedRate(`$${lowRate}—$${highRate}`);
    }
    // Calculator for: Digital Visual -> Automotive
    else if (selectedSubType === "Automotive" && selectedTier) {
      const rates =
        automotiveRates[selectedTier as keyof typeof automotiveRates];
      if (typeof rates === "string") {
        setCalculatedRate(rates);
      } else if (Array.isArray(rates)) {
        const lowRate = rates[0] * numberOfSpots;
        const highRate = rates[1] * numberOfSpots;
        setCalculatedRate(`$${lowRate}—$${highRate}`);
      }
    }
    // Calculator for: Radio -> Local - Regional
    else if (
      selectedSubType === "Local — Regional (Terrestrial)" &&
      selectedTerm
    ) {
      const rate =
        radioLocalRates[selectedTerm as keyof typeof radioLocalRates];
      setCalculatedRate(rate || null);
    }
    // Calculator for: Radio -> National (Terrestrial)
    else if (selectedSubType === "National (Terrestrial)" && selectedTerm) {
      const rate =
        radioNationalRates[selectedTerm as keyof typeof radioNationalRates];
      setCalculatedRate(rate || null);
    }
    // Calculator for: Radio -> Digital Radio
    else if (selectedSubType === "Digital Radio" && selectedTerm) {
      const rate =
        radioDigitalRates[selectedTerm as keyof typeof radioDigitalRates];
      setCalculatedRate(rate || null);
    }
    // Calculator for: Radio -> Value Menu (Local)
    else if (
      selectedSubType ===
        "Value Menu — Terrestrial + Digital (Local/Regional)" &&
      selectedTerm
    ) {
      const rate =
        radioValueLocalRates[selectedTerm as keyof typeof radioValueLocalRates];
      setCalculatedRate(rate || null);
    }
    // Calculator for: Radio -> Value Menu (National)
    else if (
      selectedSubType === "Value Menu — Terrestrial + Digital (National)" &&
      selectedTerm
    ) {
      const rate =
        radioValueNationalRates[
          selectedTerm as keyof typeof radioValueNationalRates
        ];
      setCalculatedRate(rate || null);
    }
    // Calculator for: Radio -> Automotive (Radio)
    else if (selectedSubType === "Automotive (Radio)" && selectedTier) {
      const rates =
        automotiveRates[selectedTier as keyof typeof automotiveRates];
      if (typeof rates === "string") {
        setCalculatedRate(rates);
      } else if (Array.isArray(rates)) {
        const lowRate = rates[0] * numberOfSpots;
        const highRate = rates[1] * numberOfSpots;
        setCalculatedRate(`$${lowRate}—$${highRate}`);
      }
    }
    // Calculator for: Radio -> Radio/Podcast Dramas
    else if (selectedSubType === "Radio/Podcast Dramas" && selectedRole) {
      const rate =
        radioDramaRates[selectedRole as keyof typeof radioDramaRates];
      setCalculatedRate(rate || null);
    }
    // Calculator for: Radio -> PSA
    else if (selectedSubType === "PSA — Public Service Announcement") {
      setCalculatedRate("$500—$600+ (:60 or less)");
    }
    // Calculator for: TV -> Local / Regional
    else if (selectedSubType === "Local / Regional" && selectedTerm) {
      const rate = tvLocalRates[selectedTerm as keyof typeof tvLocalRates];
      setCalculatedRate(rate || null);
    }
    // Calculator for: TV -> National
    else if (selectedSubType === "National" && selectedTerm) {
      const rate =
        tvNationalRates[selectedTerm as keyof typeof tvNationalRates];
      setCalculatedRate(rate || null);
    }
    // Calculator for: TV -> TV + Digital Visual — Paid Social
    else if (
      selectedSubType === "TV + Digital Visual — Paid Social" &&
      selectedTerm &&
      selectedMarket
    ) {
      const combinedRate =
        tvPaidSocialRates[selectedTerm as keyof typeof tvPaidSocialRates];
      if (combinedRate) {
        const rateParts = combinedRate.split(" / ");
        const finalRate =
          selectedMarket === "Local/Regional"
            ? rateParts.length > 0
              ? rateParts[0]
              : null
            : rateParts.length > 1
            ? rateParts[1]
            : null;
        setCalculatedRate(finalRate || null);
      } else {
        setCalculatedRate(null);
      }
    }
    // Calculator for: TV -> TV + Digital Visual — Online Pre-Roll
    else if (
      selectedSubType ===
        "TV + Digital Visual — Online Pre-Roll (Includes Paid Social)" &&
      selectedTerm &&
      selectedMarket
    ) {
      const combinedRate =
        tvOnlinePreRollRates[selectedTerm as keyof typeof tvOnlinePreRollRates];
      if (combinedRate) {
        const rateParts = combinedRate.split(" / ");
        const finalRate =
          selectedMarket === "Local/Regional"
            ? rateParts.length > 0
              ? rateParts[0]
              : null
            : rateParts.length > 1
            ? rateParts[1]
            : null;
        setCalculatedRate(finalRate || null);
      } else {
        setCalculatedRate(null);
      }
    }
    // Calculator for: TV -> TV + Digital Visual — OTT/CTV
    else if (
      selectedSubType ===
        "TV + Digital Visual — OTT/CTV (Includes Pre-Roll & Paid Social)" &&
      selectedTerm &&
      selectedMarket
    ) {
      const combinedRate = tvOttRates[selectedTerm as keyof typeof tvOttRates];
      if (combinedRate) {
        const rateParts = combinedRate.split(" / ");
        const finalRate =
          selectedMarket === "Local/Regional"
            ? rateParts.length > 0
              ? rateParts[0]
              : null
            : rateParts.length > 1
            ? rateParts[1]
            : null;
        setCalculatedRate(finalRate || null);
      } else {
        setCalculatedRate(null);
      }
    }
    // Calculator for: TV -> Automotive (TV)
    else if (selectedSubType === "Automotive (TV)" && selectedTier) {
      const rates =
        automotiveRates[selectedTier as keyof typeof automotiveRates];
      if (typeof rates === "string") {
        setCalculatedRate(rates);
      } else if (Array.isArray(rates)) {
        const lowRate = rates[0] * numberOfSpots;
        const highRate = rates[1] * numberOfSpots;
        setCalculatedRate(`$${lowRate}—$${highRate}`);
      }
    }
    // Calculator for: TV -> In-Show / Documentary Narration
    else if (
      selectedSubType === "In-Show / Documentary Narration" &&
      selectedProgramLength
    ) {
      const rate =
        inShowNarrationRates[
          selectedProgramLength as keyof typeof inShowNarrationRates
        ];
      setCalculatedRate(rate || null);
    }
    // Calculator for: TV -> Infomercial / DRTV
    else if (
      selectedSubType === "Infomercial / DRTV" &&
      selectedInfomercialMarket
    ) {
      const rate =
        infomercialRates[
          selectedInfomercialMarket as keyof typeof infomercialRates
        ];
      setCalculatedRate(rate || null);
    }
    // Calculator for: TV -> Mnemonics (Informational)
    else if (selectedSubType === "Mnemonics") {
      setCalculatedRate(
        "Varies Greatly ($1k—$50k+). Quote based on brand scope/usage."
      );
    }
    // Calculator for: TV -> Point of Sale (POS) (Informational)
    else if (selectedSubType === "Point of Sale (POS)") {
      setCalculatedRate(
        "Refer to TV Local/Regional or National rates based on scope."
      );
    }
    // Calculator for: Non-Broadcast -> Corporate Minute Scale
    else if (
      selectedSubType ===
        "Corporate & Industrial Narration — Finished Minute Scale" &&
      selectedDuration
    ) {
      const rate =
        corporateMinuteRates[
          selectedDuration as keyof typeof corporateMinuteRates
        ];
      setCalculatedRate(rate || null);
    }
    // Calculator for: Non-Broadcast -> Corporate Recording Time Scale
    else if (
      selectedSubType ===
      "Corporate & Industrial Narration — Recording Time Scale"
    ) {
      if (numberOfHours > 0) {
        const firstHourRate = 525;
        const additionalHourRate = 262;
        const totalRate =
          numberOfHours === 1
            ? firstHourRate
            : firstHourRate + additionalHourRate * (numberOfHours - 1);
        const formattedRate = `$${totalRate.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}`;
        setCalculatedRate(formattedRate);
      } else {
        setCalculatedRate(null);
      }
    }
    // Calculator for: Non-Broadcast -> Explainer Videos
    else if (selectedSubType === "Explainer Videos") {
      if (explainerCalcMethod === "single") {
        setCalculatedRate("$300—$525");
      } else if (explainerCalcMethod === "bulk" && wordCount > 0) {
        const baseRate = 250;
        if (wordCount <= 175) {
          setCalculatedRate(`$${baseRate}`);
        } else {
          const additionalWords = wordCount - 175;
          const additionalBlocks = Math.ceil(additionalWords / 100);
          const additionalCharge = additionalBlocks * 50;
          const totalRate = baseRate + additionalCharge;
          const formattedRate = `$${totalRate.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}`;
          setCalculatedRate(formattedRate);
        }
      } else {
        setCalculatedRate(null);
      }
    }
    // Calculator for: Non-Broadcast -> Museum Tours
    else if (
      selectedSubType === "Museum Tours — Educational" &&
      selectedMuseumCategory &&
      museumRecordingHours > 0
    ) {
      const rates =
        selectedMuseumCategory === "CAT1" ? museumCat1Rate : museumCat2Rate;
      let totalRate = rates.firstHour;
      if (museumRecordingHours > 1) {
        const additionalHalfHours = Math.ceil((museumRecordingHours - 1) * 2);
        totalRate += additionalHalfHours * rates.additionalHalfHour;
      }
      const formattedRate = `$${totalRate.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`;
      setCalculatedRate(formattedRate);
    }
    // Calculator for: Non-Broadcast -> Podcasts
    else if (selectedSubType === "Podcasts" && selectedPodcastType) {
      const rate =
        podcastRates[selectedPodcastType as keyof typeof podcastRates];
      setCalculatedRate(rate || null);
    }
    // Calculator for: Non-Broadcast -> Medical / Technical Narration
    else if (selectedSubType === "Medical / Technical Narration") {
      if (medTechCalcMethod === "minute" && selectedDuration) {
        const rate =
          medicalMinuteRates[
            selectedDuration as keyof typeof medicalMinuteRates
          ];
        setCalculatedRate(rate || null);
      } else if (medTechCalcMethod === "word" && wordCount > 0) {
        const lowTotal = wordCount * medicalPerWordRateLow;
        const highTotal = wordCount * medicalPerWordRateHigh;
        const formattedLow = lowTotal.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
        const formattedHigh = highTotal.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
        setCalculatedRate(`$${formattedLow}—$${formattedHigh}`);
      } else {
        setCalculatedRate(null);
      }
    }
    // Calculator for: Non-Broadcast -> Digital Greeting Cards
    else if (selectedSubType === "Digital Greeting Cards") {
      setCalculatedRate("$750—$1,000");
    }
    // Calculator for: Non-Broadcast -> YouTube Content
    else if (selectedSubType === "YouTube Content" && selectedYouTubeType) {
      const rate =
        youTubeRates[selectedYouTubeType as keyof typeof youTubeRates];
      setCalculatedRate(rate || null);
    }
    // Calculator for: Non-Broadcast -> Kiosk Use (Non-Retail)
    else if (selectedSubType === "Kiosk Use (Non-Retail)") {
      if (numberOfHours > 0) {
        const firstHourRate = 525;
        const additionalHourRate = 262;
        const totalRate =
          numberOfHours === 1
            ? firstHourRate
            : firstHourRate + additionalHourRate * (numberOfHours - 1);
        const formattedRate = `$${totalRate.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}`;
        setCalculatedRate(formattedRate);
      } else {
        setCalculatedRate(null);
      }
    }
    // Calculator for: Non-Broadcast -> Lobby Viewing
    else if (selectedSubType === "Lobby Viewing") {
      if (selectedLobbyType === "explainer") {
        if (numberOfHours > 0) {
          const firstHourRate = 525;
          const additionalHourRate = 262;
          const totalRate =
            numberOfHours === 1
              ? firstHourRate
              : firstHourRate + additionalHourRate * (numberOfHours - 1);
          const formattedRate = `$${totalRate.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}`;
          setCalculatedRate(formattedRate);
        } else {
          setCalculatedRate(null);
        }
      } else if (selectedLobbyType === "retail") {
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
        const formattedLow = lowTotal.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
        const formattedHigh = highTotal.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
        setCalculatedRate(`$${formattedLow}—$${formattedHigh}`);
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
        const lowRate = numWords * 0.2;
        const highRate = numWords * 0.35;
        setCalculatedRate(`$${lowRate.toFixed(0)}—$${highRate.toFixed(0)}`);
      } else if (selectedSubType === "Per Finished Minute" && numPFM > 0) {
        const lowRate = numPFM * 30;
        const highRate = numPFM * 55;
        setCalculatedRate(`$${lowRate.toFixed(0)}—$${highRate.toFixed(0)}`);
      } else if (selectedSubType === "Per Raw Hour" && numRawHours > 0) {
        const lowRate = numRawHours * 600;
        const highRate = numRawHours * 2400;
        setCalculatedRate(`$${lowRate.toFixed(0)}—$${highRate.toFixed(0)}`);
      } else if (
        selectedSubType === "Per Finished Hour" &&
        numFinishedHours > 0
      ) {
        const lowRate = numFinishedHours * 1500;
        const highRate = numFinishedHours * 3300;
        setCalculatedRate(`$${lowRate.toFixed(0)}—$${highRate.toFixed(0)}`);
      } else if (selectedSubType === "Directed Sessions" && numWords > 0) {
        const lowWordRate = numWords * 0.1;
        const highWordRate = numWords * 0.3;

        const additionalHours = Math.max(0, numSessionHours - 1);
        const lowHourRate = additionalHours * 150;
        const highHourRate = additionalHours * 300;

        const lowTotal = lowWordRate + lowHourRate;
        const highTotal = highWordRate + highHourRate;

        setCalculatedRate(`$${lowTotal.toFixed(0)}—$${highTotal.toFixed(0)}`);
      } else {
        setCalculatedRate(null);
      }
    }
    // Calculator for: Animation / Dubbing
    else if (selectedCategory === "animation_dubbing") {
      const numSessionHours = Number(sessionLength) || 0;

      if (
        selectedSubType === "Non-Union Original Animation — 22 Minute Episode"
      ) {
        setCalculatedRate("$1,100—$1,200");
      } else if (
        selectedSubType ===
        "Non-Union Original Animation — 11 Minute Episode or Less"
      ) {
        const lowRate = numEpisodes * 400;
        const highRate = numEpisodes * 700;
        setCalculatedRate(`$${lowRate.toFixed(0)}—$${highRate.toFixed(0)}`);
      } else if (
        selectedSubType === "Dubbing (Film/TV/Animation)" &&
        numSessionHours > 0
      ) {
        const hoursToCharge = Math.max(2, numSessionHours);
        const rate = hoursToCharge * 125;
        setCalculatedRate(`~$${rate.toFixed(0)}`);
      } else {
        setCalculatedRate(null);
      }
    }
    // Calculator for: Video Games / Toys & Games
    else if (selectedCategory === "video_games_toys") {
      const numSessionHours = Number(sessionLength) || 0;
      const numMins = Number(finishedMinutes) || 0;

      if (selectedSubType === "Video Games (Non-Union)") {
        if (gameCalcMethod === "hourly" && numSessionHours > 0) {
          const lowRate = numSessionHours * 200;
          const highRate = numSessionHours * 350;
          setCalculatedRate(
            `$${lowRate.toFixed(0)}—$${highRate.toFixed(0)} (2-4 hr min)`
          );
        } else if (gameCalcMethod === "flat") {
          setCalculatedRate("$500 (1 hr max)");
        } else {
          setCalculatedRate(null);
        }
      } else if (selectedSubType === "Video Games (Union)") {
        setCalculatedRate("$825.50 (Up to 4 hr session)");
      } else if (selectedSubType === "Toys & Games" && numSessionHours > 0) {
        let lowRate = 500;
        let highRate = 750;
        const additionalHours = Math.max(0, numSessionHours - 2);
        if (additionalHours > 0) {
          lowRate += additionalHours * 200;
          highRate += additionalHours * 250;
        }
        setCalculatedRate(`$${lowRate.toFixed(0)}—$${highRate.toFixed(0)}`);
      } else if (
        selectedSubType === "Toys & Games (Demo/Scratch)" &&
        numSessionHours > 0
      ) {
        const lowRate = numSessionHours * 150;
        const highRate = numSessionHours * 300;
        setCalculatedRate(`$${lowRate.toFixed(0)}—$${highRate.toFixed(0)}`);
      } else if (selectedSubType === "Mobile Game Apps (Non-Union Character)") {
        if (gameCalcMethod === "per_game") {
          let lowRate = 300;
          let highRate = 500;
          const extraVoices = Math.max(0, numVoices - 4);
          if (extraVoices > 0) {
            lowRate += extraVoices * 75;
            highRate += extraVoices * 100;
          }
          setCalculatedRate(`$${lowRate.toFixed(0)}—$${highRate.toFixed(0)}`);
        } else if (gameCalcMethod === "hourly" && numSessionHours > 0) {
          const hoursToCharge = Math.max(2, numSessionHours);
          const lowRate = hoursToCharge * 200;
          const highRate = hoursToCharge * 300;
          setCalculatedRate(`$${lowRate.toFixed(0)}—$${highRate.toFixed(0)}`);
        } else {
          setCalculatedRate(null);
        }
      } else if (selectedSubType === "Mobile Game Apps (Union Character)") {
        setCalculatedRate("$825.50 (Up to 3 voices, 4 hr max)");
      } else if (
        selectedSubType === "Mobile Game Apps (E-Learning/Educational)" &&
        numMins > 0
      ) {
        if (numMins >= 1 && numMins <= 5) {
          setCalculatedRate("$350—$400");
        } else if (numMins > 5 && numMins <= 10) {
          const lowRate = 350 + (numMins - 5) * ((600 - 350) / 5);
          const highRate = 400 + (numMins - 5) * ((600 - 400) / 5);
          setCalculatedRate(`$${lowRate.toFixed(0)}—$${highRate.toFixed(0)}`);
        } else if (numMins > 10) {
          const lowRate = numMins * 60;
          setCalculatedRate(`$${lowRate.toFixed(0)}+`);
        } else {
          setCalculatedRate(null);
        }
      } else {
        setCalculatedRate(null);
      }
    }
    // Calculator for: Promo & Imaging -> TV
    else if (selectedSubType === "TV" && selectedPromoMarket) {
      const rate =
        promoTvRates[selectedPromoMarket as keyof typeof promoTvRates];
      setCalculatedRate(rate || null);
    }
    // Calculator for: Promo & Imaging -> Radio
    else if (selectedSubType === "Radio" && selectedPromoMarket) {
      const rate =
        promoRadioRates[selectedPromoMarket as keyof typeof promoRadioRates];
      setCalculatedRate(rate || null);
    }
    // Calculator for: Promo & Imaging -> Trailers
    else if (selectedSubType === "Trailers" && selectedPromoMarket) {
      const rate =
        promoTrailerRates[
          selectedPromoMarket as keyof typeof promoTrailerRates
        ];
      setCalculatedRate(rate || null);
    }
    // Calculator for: Audiobooks
    else if (selectedCategory === "audiobooks") {
      const numFinishedHours = Number(finishedHours) || 0;
      const numRawHours = Number(numberOfHours) || 0;

      if (selectedSubType === "Union Scale — PFH" && numFinishedHours > 0) {
        const lowRate = numFinishedHours * 150;
        const highRate = numFinishedHours * 225;
        setCalculatedRate(`$${lowRate.toFixed(0)}—$${highRate.toFixed(0)}`);
      } else if (
        selectedSubType === "Non-Union — PFH" &&
        numFinishedHours > 0
      ) {
        const lowRate = numFinishedHours * 200;
        const highRate = numFinishedHours * 500;
        setCalculatedRate(`$${lowRate.toFixed(0)}—$${highRate.toFixed(0)}`);
      } else if (selectedSubType === "Per RAW Hour" && numRawHours > 0) {
        const rate = numRawHours * 225;
        setCalculatedRate(`$${rate.toFixed(0)}`);
      } else if (selectedSubType === "Production Add-On" && numRawHours > 0) {
        const lowRate = numRawHours * 75;
        const highRate = numRawHours * 125;
        setCalculatedRate(`$${lowRate.toFixed(0)}—$${highRate.toFixed(0)}`);
      } else if (
        selectedSubType === "Hybrid Agreement" &&
        numFinishedHours > 0
      ) {
        const rate = numFinishedHours * 100;
        setCalculatedRate(`$${rate.toFixed(0)} + Royalty Share`);
      } else {
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
        if (selectedIvrModel === "ivr_min") {
          setCalculatedRate("$150");
        } else if (selectedIvrModel === "ivr_prompt" && numPrompts > 0) {
          const lowRate = 150 + numPrompts * 1;
          const highRate = 200 + numPrompts * 5;
          setCalculatedRate(`$${lowRate.toFixed(0)}—$${highRate.toFixed(0)}`);
        } else if (selectedIvrModel === "ivr_word" && numWords > 0) {
          const lowRate = numWords * 0.08;
          const highRate = numWords * 0.25;
          setCalculatedRate(`$${lowRate.toFixed(2)}—$${highRate.toFixed(2)}`);
        } else if (selectedIvrModel === "ivr_hour" && numHours > 0) {
          const lowRate = numHours * 50;
          const highRate = numHours * 200;
          setCalculatedRate(`$${lowRate.toFixed(0)}—$${highRate.toFixed(0)}`);
        } else if (selectedIvrModel === "moh_min") {
          setCalculatedRate("$200");
        } else if (selectedIvrModel === "moh_min_rate" && numMins > 0) {
          const rate = numMins * 100;
          setCalculatedRate(`$${rate.toFixed(0)}`);
        } else if (selectedIvrModel === "moh_para" && numParas > 0) {
          const rate = numParas * 8;
          setCalculatedRate(`$${rate.toFixed(0)}`);
        } else {
          setCalculatedRate(null);
        }
      } else if (selectedSubType === "Roster Talent") {
        if (selectedRosterModel === "prod_house" && numParas > 0) {
          const lowRate = numParas * 10;
          const highRate = numParas * 20;
          setCalculatedRate(`$${lowRate.toFixed(0)}—$${highRate.toFixed(0)}`);
        } else if (selectedRosterModel === "other_hourly" && numHours > 0) {
          const halfHours = numHours * 2;
          const rate = halfHours * 50;
          setCalculatedRate(`$${rate.toFixed(0)}`);
        } else {
          setCalculatedRate(null);
        }
      } else {
        setCalculatedRate(null);
      }
    }
    // Calculator for: Cinema / Events
    else if (selectedCategory === "cinema_events") {
      const numHours = Number(numberOfHours) || 0;

      if (
        selectedSubType === "Cinema Usage — Term (1—3 States)" &&
        selectedTerm
      ) {
        const rate =
          cinemaRates1to3States[
            selectedTerm as keyof typeof cinemaRates1to3States
          ];
        setCalculatedRate(rate || null);
      } else if (
        selectedSubType === "Cinema Usage — Term (4+ States)" &&
        selectedTerm
      ) {
        const rate =
          cinemaRates4PlusStates[
            selectedTerm as keyof typeof cinemaRates4PlusStates
          ];
        setCalculatedRate(rate || null);
      } else if (
        selectedSubType === "Event Video" &&
        selectedTerm &&
        numHours > 0
      ) {
        const rates =
          eventVideoRates[selectedTerm as keyof typeof eventVideoRates];
        if (rates) {
          const additionalHours = Math.max(0, numHours - 1);
          const lowTotal =
            rates.firstHourLow + additionalHours * rates.addHourLow;
          const highTotal =
            rates.firstHourHigh + additionalHours * rates.addHourHigh;
          setCalculatedRate(`$${lowTotal.toFixed(0)}—$${highTotal.toFixed(0)}`);
        } else {
          setCalculatedRate(null);
        }
      } else if (
        selectedSubType === "Trade Shows / Sporting Events" &&
        selectedTerm &&
        numHours > 0
      ) {
        const rates =
          tradeShowRates[selectedTerm as keyof typeof tradeShowRates];
        if (rates) {
          const additionalHours = Math.max(0, numHours - 1);
          const lowTotal =
            rates.firstHourLow + additionalHours * rates.addHourLow;
          const highTotal =
            rates.firstHourHigh + additionalHours * rates.addHourHigh;
          setCalculatedRate(`$${lowTotal.toFixed(0)}—$${highTotal.toFixed(0)}`);
        } else {
          setCalculatedRate(null);
        }
      } else {
        setCalculatedRate(null);
      }
    }
    // Calculator for: Fees / Pick-Ups / Editing
    else if (selectedCategory === "fees_pickups_editing") {
      const numHours = Number(numberOfHours) || 0;
      const fee = Number(originalFee) || 0;

      if (
        selectedSubType === "Studio Fees & Editing" &&
        selectedFeeType &&
        numHours > 0
      ) {
        const rates =
          studioFeeRates[selectedFeeType as keyof typeof studioFeeRates];
        if (rates) {
          const lowTotal = rates.low * numHours;
          const highTotal = rates.high * numHours;
          setCalculatedRate(`$${lowTotal.toFixed(0)}—$${highTotal.toFixed(0)}`);
        } else {
          setCalculatedRate(null);
        }
      } else if (selectedSubType === "Pickups" && selectedPickupType) {
        if (selectedPickupType === "Talent Error") {
          setCalculatedRate("Free");
        } else if (
          selectedPickupType === "Minor Pickups (≤15 mins)" &&
          fee > 0
        ) {
          const rate = Math.max(150, fee * 0.5);
          setCalculatedRate(
            `$${rate.toFixed(0)} (Min $150 or 50% of original fee)`
          );
        } else if (
          selectedPickupType === "Major Pickups (rewrites)" &&
          numHours > 0
        ) {
          const numHalfHours = numHours * 2;
          const rate = numHalfHours * 260;
          setCalculatedRate(`$${rate.toFixed(0)} (at $260 / 30 mins)`);
        } else {
          setCalculatedRate(null);
        }
      } else {
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
    originalFee,
  ]);

  // ========================================
  // RENDER / JSX
  // ========================================

  return (
    <div
      className="flex justify-center items-start min-h-screen bg-slate-50 dark:bg-slate-900 p-4 pt-10"
      data-1p-ignore
      data-lpignore="true"
    >
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* LEFT COLUMN: Calculator (2/3 width on desktop) */}
        <div>
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                GVAA Rate Calculator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {/* Category Card Selection */}
                <div
                  className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3"
                  data-1p-ignore
                >
                  {categories.map((category) => {
                    const isActive = selectedCategory === category.id;

                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleCategorySelect(category.id);
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                        }}
                        className={cn(
                          // uniform sizing & layout
                          "w-full h-[60px] rounded-2xl cursor-pointer select-none",
                          "flex items-center justify-center px-3 text-center",
                          "border shadow-sm transition-colors duration-150",

                          // active vs inactive
                          isActive
                            ? "bg-brand-strong text-white border-brand-strong shadow-[0_12px_25px_rgba(58,111,234,0.4)]"
                            : "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:border-slate-500"
                        )}
                      >
                        <span className="font-medium text-sm leading-tight">
                          {category.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Sub-Type Accordion */}
                {currentCategory && currentCategory.subTypes && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <Accordion
                      type="single"
                      collapsible
                      value={isSubTypeAccordionOpen ? "subtype" : ""}
                      onValueChange={(val) =>
                        setIsSubTypeAccordionOpen(val === "subtype")
                      }
                      className="w-full space-y-4"
                    >
                      <AccordionItem value="subtype">
                        <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                          <span className="text-base font-medium text-white">
                            Sub-Type
                          </span>

                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-300">
                              {selectedSubType
                                ? selectedSubType
                                : `Select sub-type for ${currentCategory.name}`}
                            </span>

                            {/* Chevron icon with brand accent when open */}
                            <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                          </div>
                        </AccordionTrigger>

                        <AccordionContent>
                          <div className="pt-3">
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
                                  <RadioGroupItem
                                    value={subType}
                                    id={subType}
                                  />
                                  <Label
                                    htmlFor={subType}
                                    className="cursor-pointer"
                                  >
                                    {subType}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {/* --- Term Accordion (Digital Visual) --- */}
                {selectedCategory === "digital_visual" && selectedSubType && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                    <Accordion
                      type="single"
                      collapsible
                      value={isTermAccordionOpen ? "term" : ""}
                      onValueChange={(val) =>
                        setIsTermAccordionOpen(val === "term")
                      }
                      className="w-full space-y-4"
                    >
                      <AccordionItem value="term">
                        <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                          <span className="text-base font-medium text-slate-200">
                            Term
                          </span>

                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-300">
                              {selectedTerm ? selectedTerm : "Select term"}
                            </span>

                            <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          {/* Digital Visual -> Non-Paid Web */}
                          {selectedSubType ===
                            "Non-Paid Web (Owned Social or Client Site)" && (
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                Select Term:
                              </Label>
                              <RadioGroup
                                value={selectedTerm ?? ""}
                                onValueChange={(value) => {
                                  setSelectedTerm(value);
                                  setIsTermAccordionOpen(false); // auto-close after select
                                }}
                                className="grid gap-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="3 Months"
                                    id="term-3m"
                                  />
                                  <Label
                                    htmlFor="term-3m"
                                    className="cursor-pointer"
                                  >
                                    3 Months
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="1 Year" id="term-1y" />
                                  <Label
                                    htmlFor="term-1y"
                                    className="cursor-pointer"
                                  >
                                    1 Year
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="3 Years"
                                    id="term-3y"
                                  />
                                  <Label
                                    htmlFor="term-3y"
                                    className="cursor-pointer"
                                  >
                                    3 Years
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="5 Years"
                                    id="term-5y"
                                  />
                                  <Label
                                    htmlFor="term-5y"
                                    className="cursor-pointer"
                                  >
                                    5 Years
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>
                          )}

                          {/* Digital Visual -> Paid Social */}
                          {selectedSubType === "Paid Social" && (
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                Select Term:
                              </Label>
                              <RadioGroup
                                value={selectedTerm ?? ""}
                                onValueChange={(value) => {
                                  setSelectedTerm(value);
                                  setIsTermAccordionOpen(false); // auto-close after select
                                }}
                                className="grid gap-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="1 Month"
                                    id="term-1m-ps"
                                  />
                                  <Label
                                    htmlFor="term-1m-ps"
                                    className="cursor-pointer"
                                  >
                                    1 Month
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="3 Months"
                                    id="term-3m-ps"
                                  />
                                  <Label
                                    htmlFor="term-3m-ps"
                                    className="cursor-pointer"
                                  >
                                    3 Months
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="1 Year"
                                    id="term-1y-ps"
                                  />
                                  <Label
                                    htmlFor="term-1y-ps"
                                    className="cursor-pointer"
                                  >
                                    1 Year
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>
                          )}

                          {/* Digital Visual -> Online Pre-Roll / OLV */}
                          {selectedSubType === "Online Pre-Roll / OLV" && (
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                Select Term:
                              </Label>
                              <RadioGroup
                                value={selectedTerm ?? ""}
                                onValueChange={(value) => {
                                  setSelectedTerm(value);
                                  setIsTermAccordionOpen(false); // auto-close after select
                                }}
                                className="grid gap-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="1 Month"
                                    id="term-1m-olv"
                                  />
                                  <Label
                                    htmlFor="term-1m-olv"
                                    className="cursor-pointer"
                                  >
                                    1 Month
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="3 Months"
                                    id="term-3m-olv"
                                  />
                                  <Label
                                    htmlFor="term-3m-olv"
                                    className="cursor-pointer"
                                  >
                                    3 Months
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="1 Year"
                                    id="term-1y-olv"
                                  />
                                  <Label
                                    htmlFor="term-1y-olv"
                                    className="cursor-pointer"
                                  >
                                    1 Year
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>
                          )}

                          {/* Digital Visual -> OTT/CTV */}
                          {selectedSubType ===
                            "OTT/CTV (Includes Social & Pre-Roll)" && (
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                Select Term:
                              </Label>
                              <RadioGroup
                                value={selectedTerm ?? ""}
                                onValueChange={(value) => {
                                  setSelectedTerm(value);
                                  setIsTermAccordionOpen(false); // auto-close after select
                                }}
                                className="grid gap-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="1 Month"
                                    id="term-1m-ott"
                                  />
                                  <Label
                                    htmlFor="term-1m-ott"
                                    className="cursor-pointer"
                                  >
                                    1 Month
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="3 Months"
                                    id="term-3m-ott"
                                  />
                                  <Label
                                    htmlFor="term-3m-ott"
                                    className="cursor-pointer"
                                  >
                                    3 Months
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="1 Year"
                                    id="term-1y-ott"
                                  />
                                  <Label
                                    htmlFor="term-1y-ott"
                                    className="cursor-pointer"
                                  >
                                    1 Year
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {/* --- Form for: Digital Visual -> Digital Tags --- */}
                {selectedSubType === "Digital Tags" && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4">
                    <Accordion
                      type="single"
                      collapsible
                      value={isTagsAccordionOpen ? "tags" : ""}
                      onValueChange={(val) =>
                        setIsTagsAccordionOpen(val === "tags")
                      }
                      className="w-full"
                    >
                      <AccordionItem value="tags">
                        <AccordionTrigger className="cursor-pointer flex justify-between items-center">
                          <span className="text-base font-medium">Tags</span>
                          <span className="text-sm text-slate-600 dark:text-slate-300">
                            {numberOfTags === 1
                              ? "1 Tag"
                              : `${numberOfTags} Tags`}
                          </span>
                        </AccordionTrigger>

                        <AccordionContent>
                          <div className="space-y-2">
                            <Label
                              htmlFor="tags-number"
                              className="text-sm font-medium"
                            >
                              Number of Tags:
                            </Label>
                            <Input
                              autoComplete="off"
                              id="tags-number"
                              type="number"
                              value={numberOfTags}
                              min={1}
                              className="max-w-[150px]"
                              onChange={(e) => {
                                const value = Number(e.target.value) || 1;
                                setNumberOfTags(value);
                              }}
                              // Collapse once they've set the value and tab/click out
                              onBlur={() => {
                                if (numberOfTags >= 1) {
                                  setIsTagsAccordionOpen(false);
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  if (numberOfTags >= 1) {
                                    setIsTagsAccordionOpen(false);
                                  }
                                }
                              }}
                            />
                            <EnterHint />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {/* --- Accordion for: Digital Visual -> Automotive --- */}
                {selectedSubType === "Automotive" && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                    <Accordion
                      type="single"
                      collapsible
                      value={isTermAccordionOpen ? "digital-automotive" : ""}
                      onValueChange={(val) =>
                        setIsTermAccordionOpen(val === "digital-automotive")
                      }
                      className="w-full space-y-4"
                    >
                      <AccordionItem value="digital-automotive">
                        <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                          <span className="text-base font-medium text-slate-200">
                            Tags
                          </span>

                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-300">
                              {numberOfTags === 1
                                ? "1 Tag"
                                : `${numberOfTags} Tags`}
                            </span>

                            <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                          </div>
                        </AccordionTrigger>

                        <AccordionContent>
                          <div className="grid gap-6">
                            {/* Tier Selection */}
                            <div className="grid gap-4">
                              <Label className="text-base font-medium">
                                Select Tier:
                              </Label>
                              <RadioGroup
                                value={selectedTier ?? ""}
                                onValueChange={(value) => {
                                  handleTierSelect(value);

                                  if (value === "Tier 1") {
                                    // Flat tier — no spots input needed
                                    setNumberOfSpots(1);
                                    setIsTermAccordionOpen(false); // close Automotive Details
                                  } else {
                                    // For Tier 2/3, ensure we have at least 1 spot as a starting point
                                    if (!numberOfSpots || numberOfSpots < 1) {
                                      setNumberOfSpots(1);
                                    }
                                  }
                                }}
                                className="grid gap-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="Tier 1"
                                    id="digital-tier-1"
                                  />
                                  <Label
                                    htmlFor="digital-tier-1"
                                    className="cursor-pointer"
                                  >
                                    Tier 1 — National Brand Spots
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="Tier 2"
                                    id="digital-tier-2"
                                  />
                                  <Label
                                    htmlFor="digital-tier-2"
                                    className="cursor-pointer"
                                  >
                                    Tier 2 — Regional Tags
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="Tier 3 (:30/:60)"
                                    id="digital-tier-3-30"
                                  />
                                  <Label
                                    htmlFor="digital-tier-3-30"
                                    className="cursor-pointer"
                                  >
                                    Tier 3 — Local Dealer :30/:60
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="Tier 3 (:15/:10/:6)"
                                    id="digital-tier-3-15"
                                  />
                                  <Label
                                    htmlFor="digital-tier-3-15"
                                    className="cursor-pointer"
                                  >
                                    Tier 3 — Local Dealer :15/:10/:6
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>

                            {/* Number of Spots Input (only for non—Tier 1) */}
                            {selectedTier && selectedTier !== "Tier 1" && (
                              <div className="grid gap-4">
                                <Label
                                  htmlFor="digital-spots-number"
                                  className="text-base font-medium"
                                >
                                  Number of Spots:
                                </Label>
                                <Input
                                  autoComplete="off"
                                  id="digital-spots-number"
                                  type="number"
                                  value={numberOfSpots}
                                  onChange={(e) => {
                                    const next = Number(e.target.value) || 1;
                                    setNumberOfSpots(next);
                                  }}
                                  onBlur={(e) => {
                                    const next = Number(e.target.value) || 1;
                                    setNumberOfSpots(next);

                                    if (next >= 1) {
                                      setIsTermAccordionOpen(false);
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      const next =
                                        Number(e.currentTarget.value) || 1;
                                      setNumberOfSpots(next);

                                      if (next >= 1) {
                                        setIsTermAccordionOpen(false);
                                      }
                                    }
                                  }}
                                  min={1}
                                  className="max-w-[150px]"
                                />
                                <EnterHint />
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {/* --- Accordion for: Radio -> Local — Regional (Terrestrial) --- */}
                {selectedSubType === "Local — Regional (Terrestrial)" && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                    <Accordion
                      type="single"
                      collapsible
                      value={isTermAccordionOpen ? "radio-local-regional" : ""}
                      onValueChange={(val) =>
                        setIsTermAccordionOpen(val === "radio-local-regional")
                      }
                      className="w-full"
                    >
                      <AccordionItem value="radio-local-regional">
                        <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                          <span className="text-base font-medium text-slate-200">
                            Term
                          </span>

                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-300">
                              {selectedTerm || "Select term"}
                            </span>

                            <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                          </div>
                        </AccordionTrigger>

                        <AccordionContent>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">
                              Select Term:
                            </Label>
                            <RadioGroup
                              value={selectedTerm ?? ""}
                              onValueChange={(value) => {
                                setSelectedTerm(value);
                                setIsTermAccordionOpen(false); // close after selection
                              }}
                              className="grid gap-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="1 Month"
                                  id="term-lr-1m"
                                />
                                <Label
                                  htmlFor="term-lr-1m"
                                  className="cursor-pointer"
                                >
                                  1 Month
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="3 Months"
                                  id="term-lr-3m"
                                />
                                <Label
                                  htmlFor="term-lr-3m"
                                  className="cursor-pointer"
                                >
                                  3 Months
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="1 Year"
                                  id="term-lr-1y"
                                />
                                <Label
                                  htmlFor="term-lr-1y"
                                  className="cursor-pointer"
                                >
                                  1 Year
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {/* --- Accordion for: Radio -> National (Terrestrial) --- */}
                {selectedSubType === "National (Terrestrial)" && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                    <Accordion
                      type="single"
                      collapsible
                      value={isTermAccordionOpen ? "radio-national" : ""}
                      onValueChange={(val) =>
                        setIsTermAccordionOpen(val === "radio-national")
                      }
                      className="w-full"
                    >
                      <AccordionItem value="radio-national">
                        <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                          <span className="text-base font-medium text-slate-200">
                            Term
                          </span>

                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-300">
                              {selectedTerm || "Select term"}
                            </span>

                            <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                          </div>
                        </AccordionTrigger>

                        <AccordionContent>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">
                              Select Term:
                            </Label>
                            <RadioGroup
                              value={selectedTerm ?? ""}
                              onValueChange={(value) => {
                                setSelectedTerm(value);
                                setIsTermAccordionOpen(false); // close after selection
                              }}
                              className="grid gap-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="1 Month"
                                  id="term-rn-1m"
                                />
                                <Label
                                  htmlFor="term-rn-1m"
                                  className="cursor-pointer"
                                >
                                  1 Month
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="3 Months"
                                  id="term-rn-3m"
                                />
                                <Label
                                  htmlFor="term-rn-3m"
                                  className="cursor-pointer"
                                >
                                  3 Months
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="1 Year"
                                  id="term-rn-1y"
                                />
                                <Label
                                  htmlFor="term-rn-1y"
                                  className="cursor-pointer"
                                >
                                  1 Year
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {/* --- Accordion for: Radio -> Digital Radio --- */}
                {selectedSubType === "Digital Radio" && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                    <Accordion
                      type="single"
                      collapsible
                      value={isTermAccordionOpen ? "radio-digital" : ""}
                      onValueChange={(val) =>
                        setIsTermAccordionOpen(val === "radio-digital")
                      }
                      className="w-full"
                    >
                      <AccordionItem value="radio-digital">
                        <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                          <span className="text-base font-medium text-slate-200">
                            Term
                          </span>

                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-300">
                              {selectedTerm || "Select term"}
                            </span>

                            <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                          </div>
                        </AccordionTrigger>

                        <AccordionContent>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">
                              Select Term:
                            </Label>

                            <RadioGroup
                              value={selectedTerm ?? ""}
                              onValueChange={(value) => {
                                setSelectedTerm(value);
                                setIsTermAccordionOpen(false); // close on select
                              }}
                              className="grid gap-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="1 Month"
                                  id="term-rd-1m"
                                />
                                <Label
                                  htmlFor="term-rd-1m"
                                  className="cursor-pointer"
                                >
                                  1 Month
                                </Label>
                              </div>

                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="3 Months"
                                  id="term-rd-3m"
                                />
                                <Label
                                  htmlFor="term-rd-3m"
                                  className="cursor-pointer"
                                >
                                  3 Months
                                </Label>
                              </div>

                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="1 Year"
                                  id="term-rd-1y"
                                />
                                <Label
                                  htmlFor="term-rd-1y"
                                  className="cursor-pointer"
                                >
                                  1 Year
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {/* --- Accordion for: Radio -> Value Menu — Terrestrial + Digital (Local/Regional) --- */}
                {selectedSubType ===
                  "Value Menu — Terrestrial + Digital (Local/Regional)" && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                    <Accordion
                      type="single"
                      collapsible
                      value={isTermAccordionOpen ? "radio-value-local" : ""}
                      onValueChange={(val) =>
                        setIsTermAccordionOpen(val === "radio-value-local")
                      }
                      className="w-full"
                    >
                      <AccordionItem value="radio-value-local">
                        <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                          <span className="text-base font-medium text-slate-200">
                            Term
                          </span>

                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-300">
                              {selectedTerm || "Select term"}
                            </span>

                            <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                          </div>
                        </AccordionTrigger>

                        <AccordionContent>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">
                              Select Term:
                            </Label>
                            <RadioGroup
                              value={selectedTerm ?? ""}
                              onValueChange={(value) => {
                                setSelectedTerm(value);
                                setIsTermAccordionOpen(false); // close after selection
                              }}
                              className="grid gap-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="1 Month"
                                  id="term-rvl-1m"
                                />
                                <Label
                                  htmlFor="term-rvl-1m"
                                  className="cursor-pointer"
                                >
                                  1 Month
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="3 Months"
                                  id="term-rvl-3m"
                                />
                                <Label
                                  htmlFor="term-rvl-3m"
                                  className="cursor-pointer"
                                >
                                  3 Months
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="1 Year"
                                  id="term-rvl-1y"
                                />
                                <Label
                                  htmlFor="term-rvl-1y"
                                  className="cursor-pointer"
                                >
                                  1 Year
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {/* --- Accordion for: Radio -> Value Menu — Terrestrial + Digital (National) --- */}
                {selectedSubType ===
                  "Value Menu — Terrestrial + Digital (National)" && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                    <Accordion
                      type="single"
                      collapsible
                      value={isTermAccordionOpen ? "radio-value-national" : ""}
                      onValueChange={(val) =>
                        setIsTermAccordionOpen(val === "radio-value-national")
                      }
                      className="w-full"
                    >
                      <AccordionItem value="radio-value-national">
                        <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                          <span className="text-base font-medium text-slate-200">
                            Term
                          </span>

                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-300">
                              {selectedTerm || "Select term"}
                            </span>

                            <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                          </div>
                        </AccordionTrigger>

                        <AccordionContent>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">
                              Select Term:
                            </Label>
                            <RadioGroup
                              value={selectedTerm ?? ""}
                              onValueChange={(value) => {
                                setSelectedTerm(value);
                                setIsTermAccordionOpen(false); // close after selection
                              }}
                              className="grid gap-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="1 Month"
                                  id="term-rvn-1m"
                                />
                                <Label
                                  htmlFor="term-rvn-1m"
                                  className="cursor-pointer"
                                >
                                  1 Month
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="3 Months"
                                  id="term-rvn-3m"
                                />
                                <Label
                                  htmlFor="term-rvn-3m"
                                  className="cursor-pointer"
                                >
                                  3 Months
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="1 Year"
                                  id="term-rvn-1y"
                                />
                                <Label
                                  htmlFor="term-rvn-1y"
                                  className="cursor-pointer"
                                >
                                  1 Year
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {/* --- Accordion for: Radio -> Automotive (Radio) --- */}
                {selectedSubType === "Automotive (Radio)" && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                    <Accordion
                      type="single"
                      collapsible
                      value={isTermAccordionOpen ? "radio-automotive" : ""}
                      onValueChange={(val) =>
                        setIsTermAccordionOpen(val === "radio-automotive")
                      }
                      className="w-full"
                    >
                      <AccordionItem value="radio-automotive">
                        <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                          <span className="text-base font-medium text-slate-200">
                            Automotive Details
                          </span>

                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-300">
                              {selectedTier
                                ? selectedTier === "Tier 1"
                                  ? "Tier 1 — National Brand Spots"
                                  : `${selectedTier} — ${numberOfSpots} spot${
                                      numberOfSpots === 1 ? "" : "s"
                                    }`
                                : "Select tier (and spots)"}
                            </span>

                            <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                          </div>
                        </AccordionTrigger>

                        <AccordionContent>
                          <div className="grid gap-6">
                            {/* Tier Selection */}
                            <div className="grid gap-4">
                              <Label className="text-base font-medium">
                                Select Tier:
                              </Label>
                              <RadioGroup
                                value={selectedTier ?? ""}
                                onValueChange={(value) => {
                                  handleTierSelect(value);

                                  if (value === "Tier 1") {
                                    // Flat tier — no spots input needed
                                    setNumberOfSpots(1);
                                    setIsTermAccordionOpen(false); // close Automotive Details
                                  } else {
                                    // For Tier 2/3, ensure we have at least 1 spot as a starting point
                                    if (!numberOfSpots || numberOfSpots < 1) {
                                      setNumberOfSpots(1);
                                    }
                                  }
                                }}
                                className="grid gap-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="Tier 1"
                                    id="tier-1-radio"
                                  />
                                  <Label
                                    htmlFor="tier-1-radio"
                                    className="cursor-pointer"
                                  >
                                    Tier 1 — National Brand Spots
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="Tier 2"
                                    id="tier-2-radio"
                                  />
                                  <Label
                                    htmlFor="tier-2-radio"
                                    className="cursor-pointer"
                                  >
                                    Tier 2 — Regional Tags
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="Tier 3 (:30/:60)"
                                    id="tier-3-30-radio"
                                  />
                                  <Label
                                    htmlFor="tier-3-30-radio"
                                    className="cursor-pointer"
                                  >
                                    Tier 3 — Local Dealer :30/:60
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="Tier 3 (:15/:10/:6)"
                                    id="tier-3-15-radio"
                                  />
                                  <Label
                                    htmlFor="tier-3-15-radio"
                                    className="cursor-pointer"
                                  >
                                    Tier 3 — Local Dealer :15/:10/:6
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>

                            {/* Number of Spots Input (only for non—Tier 1) */}
                            {selectedTier && selectedTier !== "Tier 1" && (
                              <div className="grid gap-4">
                                <Label
                                  htmlFor="radio-spots-number"
                                  className="text-base font-medium"
                                >
                                  Number of Spots:
                                </Label>
                                <Input
                                  autoComplete="off"
                                  id="radio-spots-number"
                                  type="number"
                                  value={numberOfSpots}
                                  onChange={(e) => {
                                    const next = Number(e.target.value) || 1;
                                    setNumberOfSpots(next);
                                  }}
                                  onBlur={(e) => {
                                    const next = Number(e.target.value) || 1;
                                    setNumberOfSpots(next);

                                    if (next >= 1) {
                                      setIsTermAccordionOpen(false);
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      const next =
                                        Number(e.currentTarget.value) || 1;
                                      setNumberOfSpots(next);

                                      if (next >= 1) {
                                        setIsTermAccordionOpen(false);
                                      }
                                    }
                                  }}
                                  min={1}
                                  className="max-w-[150px]"
                                />
                                <EnterHint />
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {/* --- Accordion for: Radio -> Radio/Podcast Dramas --- */}
                {selectedSubType === "Radio/Podcast Dramas" && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                    <Accordion
                      type="single"
                      collapsible
                      value={isTermAccordionOpen ? "radio-dramas" : ""}
                      onValueChange={(val) =>
                        setIsTermAccordionOpen(val === "radio-dramas")
                      }
                      className="w-full"
                    >
                      <AccordionItem value="radio-dramas">
                        <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                          <span className="text-base font-medium text-slate-200">
                            Role
                          </span>

                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-300">
                              {selectedRole || "Select role"}
                            </span>

                            <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                          </div>
                        </AccordionTrigger>

                        <AccordionContent>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">
                              Select Role:
                            </Label>
                            <RadioGroup
                              value={selectedRole ?? ""}
                              onValueChange={(value) => {
                                setSelectedRole(value);
                                setIsTermAccordionOpen(false); // close after selection
                              }}
                              className="grid gap-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="Principal Actors"
                                  id="role-principal"
                                />
                                <Label
                                  htmlFor="role-principal"
                                  className="cursor-pointer"
                                >
                                  Principal Actors
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="Non-Principal Actors"
                                  id="role-non-principal"
                                />
                                <Label
                                  htmlFor="role-non-principal"
                                  className="cursor-pointer"
                                >
                                  Non-Principal Actors
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {/* --- Form for: Radio -> PSA — Public Service Announcement --- */}
                {selectedSubType === "PSA — Public Service Announcement" && (
                  <div className="grid gap-4">
                    {/* No inputs needed for PSA, rate is fixed */}
                  </div>
                )}
                {/* --- Accordion for: TV -> Local / Regional --- */}
                {selectedSubType === "Local / Regional" && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                    <Accordion
                      type="single"
                      collapsible
                      value={isTermAccordionOpen ? "tv-local-regional" : ""}
                      onValueChange={(val) =>
                        setIsTermAccordionOpen(val === "tv-local-regional")
                      }
                      className="w-full"
                    >
                      <AccordionItem value="tv-local-regional">
                        <AccordionTrigger className="cursor-pointer flex justify-between items-center">
                          <span className="text-base font-medium">Term</span>
                          <span className="text-sm text-slate-600 dark:text-slate-300">
                            {selectedTerm || "Select term"}
                          </span>
                        </AccordionTrigger>

                        <AccordionContent>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">
                              Select Term:
                            </Label>
                            <RadioGroup
                              value={selectedTerm ?? ""}
                              onValueChange={(value) => {
                                setSelectedTerm(value);
                                setIsTermAccordionOpen(false); // close after selection
                              }}
                              className="grid gap-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="1 Month"
                                  id="term-1m-tvl"
                                />
                                <Label
                                  htmlFor="term-1m-tvl"
                                  className="cursor-pointer"
                                >
                                  1 Month
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="3 Months"
                                  id="term-3m-tvl"
                                />
                                <Label
                                  htmlFor="term-3m-tvl"
                                  className="cursor-pointer"
                                >
                                  3 Months
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="1 Year"
                                  id="term-1y-tvl"
                                />
                                <Label
                                  htmlFor="term-1y-tvl"
                                  className="cursor-pointer"
                                >
                                  1 Year
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {/* --- Accordion for: TV -> National --- */}
                {selectedSubType === "National" && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                    <Accordion
                      type="single"
                      collapsible
                      value={isTermAccordionOpen ? "tv-national" : ""}
                      onValueChange={(val) =>
                        setIsTermAccordionOpen(val === "tv-national")
                      }
                      className="w-full"
                    >
                      <AccordionItem value="tv-national">
                        <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                          <span className="text-base font-medium text-slate-200">
                            Term
                          </span>

                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-300">
                              {selectedTerm || "Select term"}
                            </span>

                            <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                          </div>
                        </AccordionTrigger>

                        <AccordionContent>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">
                              Select Term:
                            </Label>
                            <RadioGroup
                              value={selectedTerm ?? ""}
                              onValueChange={(value) => {
                                setSelectedTerm(value);
                                setIsTermAccordionOpen(false); // close after selection
                              }}
                              className="grid gap-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="1 Month"
                                  id="term-1m-tvn"
                                />
                                <Label
                                  htmlFor="term-1m-tvn"
                                  className="cursor-pointer"
                                >
                                  1 Month
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="3 Months"
                                  id="term-3m-tvn"
                                />
                                <Label
                                  htmlFor="term-3m-tvn"
                                  className="cursor-pointer"
                                >
                                  3 Months
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="1 Year"
                                  id="term-1y-tvn"
                                />
                                <Label
                                  htmlFor="term-1y-tvn"
                                  className="cursor-pointer"
                                >
                                  1 Year
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {/* --- Accordion for: TV -> TV + Digital Visual — Paid Social --- */}
                {selectedSubType === "TV + Digital Visual — Paid Social" && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                    <Accordion
                      type="single"
                      collapsible
                      value={isTermAccordionOpen ? "tv-paid-social" : ""}
                      onValueChange={(val) =>
                        setIsTermAccordionOpen(val === "tv-paid-social")
                      }
                      className="w-full"
                    >
                      <AccordionItem value="tv-paid-social">
                        <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                          <span className="text-base font-medium text-slate-200">
                            Term &amp; Market
                          </span>

                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-300">
                              {selectedTerm && selectedMarket
                                ? `${selectedTerm} — ${selectedMarket}`
                                : "Select term & market"}
                            </span>

                            <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                          </div>
                        </AccordionTrigger>

                        <AccordionContent>
                          <div className="grid gap-6">
                            {/* Term Selection */}
                            <div className="grid gap-4">
                              <Label className="text-base font-medium">
                                Select Term:
                              </Label>
                              <RadioGroup
                                value={selectedTerm ?? ""}
                                onValueChange={(value) => {
                                  setSelectedTerm(value);
                                  if (selectedMarket)
                                    setIsTermAccordionOpen(false);
                                }}
                                className="grid gap-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="1 Month"
                                    id="term-1m-tvps"
                                  />
                                  <Label
                                    htmlFor="term-1m-tvps"
                                    className="cursor-pointer"
                                  >
                                    1 Month
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="3 Months"
                                    id="term-3m-tvps"
                                  />
                                  <Label
                                    htmlFor="term-3m-tvps"
                                    className="cursor-pointer"
                                  >
                                    3 Months
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="1 Year"
                                    id="term-1y-tvps"
                                  />
                                  <Label
                                    htmlFor="term-1y-tvps"
                                    className="cursor-pointer"
                                  >
                                    1 Year
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>

                            {/* Market Selection */}
                            <div className="grid gap-4">
                              <Label className="text-base font-medium">
                                Select Market:
                              </Label>
                              <RadioGroup
                                value={selectedMarket ?? ""}
                                onValueChange={(value) => {
                                  setSelectedMarket(value);
                                  if (selectedTerm)
                                    setIsTermAccordionOpen(false);
                                }}
                                className="grid gap-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="Local/Regional"
                                    id="market-lr-tvps"
                                  />
                                  <Label
                                    htmlFor="market-lr-tvps"
                                    className="cursor-pointer"
                                  >
                                    Local / Regional
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="National"
                                    id="market-nat-tvps"
                                  />
                                  <Label
                                    htmlFor="market-nat-tvps"
                                    className="cursor-pointer"
                                  >
                                    National
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {/* --- Accordion for: TV -> TV + Digital Visual — Online Pre-Roll (Includes Paid Social) --- */}
                {selectedSubType ===
                  "TV + Digital Visual — Online Pre-Roll (Includes Paid Social)" && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                    <Accordion
                      type="single"
                      collapsible
                      value={isTermAccordionOpen ? "tv-online-pre-roll" : ""}
                      onValueChange={(val) =>
                        setIsTermAccordionOpen(val === "tv-online-pre-roll")
                      }
                      className="w-full"
                    >
                      <AccordionItem value="tv-online-pre-roll">
                        <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                          <span className="text-base font-medium text-slate-200">
                            Term &amp; Market
                          </span>

                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-300">
                              {selectedTerm && selectedMarket
                                ? `${selectedTerm} — ${selectedMarket}`
                                : "Select term & market"}
                            </span>

                            <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                          </div>
                        </AccordionTrigger>

                        <AccordionContent>
                          <div className="grid gap-6">
                            {/* Term Selection */}
                            <div className="grid gap-4">
                              <Label className="text-base font-medium">
                                Select Term:
                              </Label>
                              <RadioGroup
                                value={selectedTerm ?? ""}
                                onValueChange={(value) => {
                                  setSelectedTerm(value);
                                  if (selectedMarket)
                                    setIsTermAccordionOpen(false);
                                }}
                                className="grid gap-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="1 Month"
                                    id="term-1m-tvor"
                                  />
                                  <Label
                                    htmlFor="term-1m-tvor"
                                    className="cursor-pointer"
                                  >
                                    1 Month
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="3 Months"
                                    id="term-3m-tvor"
                                  />
                                  <Label
                                    htmlFor="term-3m-tvor"
                                    className="cursor-pointer"
                                  >
                                    3 Months
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="1 Year"
                                    id="term-1y-tvor"
                                  />
                                  <Label
                                    htmlFor="term-1y-tvor"
                                    className="cursor-pointer"
                                  >
                                    1 Year
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>

                            {/* Market Selection */}
                            <div className="grid gap-4">
                              <Label className="text-base font-medium">
                                Select Market:
                              </Label>
                              <RadioGroup
                                value={selectedMarket ?? ""}
                                onValueChange={(value) => {
                                  setSelectedMarket(value);
                                  if (selectedTerm)
                                    setIsTermAccordionOpen(false);
                                }}
                                className="grid gap-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="Local/Regional"
                                    id="market-lr-tvor"
                                  />
                                  <Label
                                    htmlFor="market-lr-tvor"
                                    className="cursor-pointer"
                                  >
                                    Local / Regional
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="National"
                                    id="market-nat-tvor"
                                  />
                                  <Label
                                    htmlFor="market-nat-tvor"
                                    className="cursor-pointer"
                                  >
                                    National
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {/* --- Accordion for: TV -> TV + Digital Visual — OTT/CTV (Includes Pre-Roll & Paid Social) --- */}
                {selectedSubType ===
                  "TV + Digital Visual — OTT/CTV (Includes Pre-Roll & Paid Social)" && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                    <Accordion
                      type="single"
                      collapsible
                      value={isTermAccordionOpen ? "tv-ott-ctv" : ""}
                      onValueChange={(val) =>
                        setIsTermAccordionOpen(val === "tv-ott-ctv")
                      }
                      className="w-full"
                    >
                      <AccordionItem value="tv-ott-ctv">
                        <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                          <span className="text-base font-medium text-slate-200">
                            Term &amp; Market
                          </span>

                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-300">
                              {selectedTerm && selectedMarket
                                ? `${selectedTerm} — ${selectedMarket}`
                                : "Select term & market"}
                            </span>

                            <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                          </div>
                        </AccordionTrigger>

                        <AccordionContent>
                          <div className="grid gap-6">
                            {/* Term Selection */}
                            <div className="grid gap-4">
                              <Label className="text-base font-medium">
                                Select Term:
                              </Label>
                              <RadioGroup
                                value={selectedTerm ?? ""}
                                onValueChange={(value) => {
                                  setSelectedTerm(value);
                                  if (selectedMarket)
                                    setIsTermAccordionOpen(false);
                                }}
                                className="grid gap-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="1 Month"
                                    id="term-1m-tvott"
                                  />
                                  <Label
                                    htmlFor="term-1m-tvott"
                                    className="cursor-pointer"
                                  >
                                    1 Month
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="3 Months"
                                    id="term-3m-tvott"
                                  />
                                  <Label
                                    htmlFor="term-3m-tvott"
                                    className="cursor-pointer"
                                  >
                                    3 Months
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="1 Year"
                                    id="term-1y-tvott"
                                  />
                                  <Label
                                    htmlFor="term-1y-tvott"
                                    className="cursor-pointer"
                                  >
                                    1 Year
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>

                            {/* Market Selection */}
                            <div className="grid gap-4">
                              <Label className="text-base font-medium">
                                Select Market:
                              </Label>
                              <RadioGroup
                                value={selectedMarket ?? ""}
                                onValueChange={(value) => {
                                  setSelectedMarket(value);
                                  if (selectedTerm)
                                    setIsTermAccordionOpen(false);
                                }}
                                className="grid gap-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="Local/Regional"
                                    id="market-lr-tvott"
                                  />
                                  <Label
                                    htmlFor="market-lr-tvott"
                                    className="cursor-pointer"
                                  >
                                    Local / Regional
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="National"
                                    id="market-nat-tvott"
                                  />
                                  <Label
                                    htmlFor="market-nat-tvott"
                                    className="cursor-pointer"
                                  >
                                    National
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {/* --- Accordion for: TV -> Automotive (TV) --- */}
                {selectedSubType === "Automotive (TV)" && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                    <Accordion
                      type="single"
                      collapsible
                      value={isTermAccordionOpen ? "tv-automotive" : ""}
                      onValueChange={(val) =>
                        setIsTermAccordionOpen(val === "tv-automotive")
                      }
                      className="w-full"
                    >
                      <AccordionItem value="tv-automotive">
                        <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                          <span className="text-base font-medium text-slate-200">
                            Automotive Details
                          </span>

                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-300">
                              {selectedTier
                                ? selectedTier === "Tier 1"
                                  ? "Tier 1 — National Brand Spots"
                                  : `${selectedTier} — ${numberOfSpots} spot${
                                      numberOfSpots === 1 ? "" : "s"
                                    }`
                                : "Select tier (and spots)"}
                            </span>

                            <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                          </div>
                        </AccordionTrigger>

                        <AccordionContent>
                          <div className="grid gap-6">
                            {/* Tier Selection */}
                            <div className="grid gap-4">
                              <Label className="text-base font-medium">
                                Select Tier:
                              </Label>
                              <RadioGroup
                                value={selectedTier ?? ""}
                                onValueChange={(value) => {
                                  handleTierSelect(value);

                                  if (value === "Tier 1") {
                                    // Flat tier — no spots input needed
                                    setNumberOfSpots(1);
                                    setIsTermAccordionOpen(false); // close Automotive Details
                                  } else {
                                    // For Tier 2/3, ensure we have at least 1 spot as a starting point
                                    if (!numberOfSpots || numberOfSpots < 1) {
                                      setNumberOfSpots(1);
                                    }
                                  }
                                }}
                                className="grid gap-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="Tier 1"
                                    id="tier-1-tv"
                                  />
                                  <Label
                                    htmlFor="tier-1-tv"
                                    className="cursor-pointer"
                                  >
                                    Tier 1 — National Brand Spots
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="Tier 2"
                                    id="tier-2-tv"
                                  />
                                  <Label
                                    htmlFor="tier-2-tv"
                                    className="cursor-pointer"
                                  >
                                    Tier 2 — Regional Tags / Localization
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="Tier 3 (:30/:60)"
                                    id="tier-3-30-tv"
                                  />
                                  <Label
                                    htmlFor="tier-3-30-tv"
                                    className="cursor-pointer"
                                  >
                                    Tier 3 — Local Dealer :30/:60
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="Tier 3 (:15/:10/:6)"
                                    id="tier-3-15-tv"
                                  />
                                  <Label
                                    htmlFor="tier-3-15-tv"
                                    className="cursor-pointer"
                                  >
                                    Tier 3 — Local Dealer :15/:10/:6
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>

                            {/* Number of Spots Input (only for non—Tier 1) */}
                            {selectedTier && selectedTier !== "Tier 1" && (
                              <div className="grid gap-4">
                                <Label
                                  htmlFor="tv-spots-number"
                                  className="text-base font-medium"
                                >
                                  Number of Spots:
                                </Label>
                                <Input
                                  autoComplete="off"
                                  id="tv-spots-number"
                                  type="number"
                                  value={numberOfSpots}
                                  onChange={(e) => {
                                    const next = Number(e.target.value) || 1;
                                    setNumberOfSpots(next);
                                  }}
                                  onBlur={(e) => {
                                    const next = Number(e.target.value) || 1;
                                    setNumberOfSpots(next);

                                    if (next >= 1) {
                                      setIsTermAccordionOpen(false);
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      const next =
                                        Number(e.currentTarget.value) || 1;
                                      setNumberOfSpots(next);

                                      if (next >= 1) {
                                        setIsTermAccordionOpen(false);
                                      }
                                    }
                                  }}
                                  min={1}
                                  className="max-w-[150px]"
                                />
                                <EnterHint />
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {/* --- Accordion for: TV -> In-Show / Documentary Narration --- */}
                {selectedSubType === "In-Show / Documentary Narration" && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                    <Accordion
                      type="single"
                      collapsible
                      value={isTermAccordionOpen ? "tv-inshow-doc" : ""}
                      onValueChange={(val) =>
                        setIsTermAccordionOpen(val === "tv-inshow-doc")
                      }
                      className="w-full"
                    >
                      <AccordionItem value="tv-inshow-doc">
                        <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                          <span className="text-base font-medium text-slate-200">
                            Program Length
                          </span>

                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-300">
                              {selectedProgramLength || "Select program length"}
                            </span>

                            <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                          </div>
                        </AccordionTrigger>

                        <AccordionContent>
                          <div className="grid gap-4">
                            <Label className="text-base font-medium">
                              Select Program Length:
                            </Label>
                            <RadioGroup
                              value={selectedProgramLength ?? ""}
                              onValueChange={(value) => {
                                setSelectedProgramLength(value);
                                setIsTermAccordionOpen(false);
                              }}
                              className="grid gap-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="24 Minutes"
                                  id="length-24"
                                />
                                <Label
                                  htmlFor="length-24"
                                  className="cursor-pointer"
                                >
                                  24 Minutes (Half-Hour Program)
                                </Label>
                              </div>

                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="48 Minutes"
                                  id="length-48"
                                />
                                <Label
                                  htmlFor="length-48"
                                  className="cursor-pointer"
                                >
                                  48 Minutes (Hour Program)
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {/* --- Accordion for: TV -> Infomercial / DRTV --- */}
                {selectedSubType === "Infomercial / DRTV" && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                    <Accordion
                      type="single"
                      collapsible
                      value={isTermAccordionOpen ? "tv-infomercial-drtv" : ""}
                      onValueChange={(val) =>
                        setIsTermAccordionOpen(val === "tv-infomercial-drtv")
                      }
                      className="w-full"
                    >
                      <AccordionItem value="tv-infomercial-drtv">
                        <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                          <span className="text-base font-medium text-slate-200">
                            Market / Term
                          </span>

                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-300">
                              {selectedInfomercialMarket ||
                                "Select market / term"}
                            </span>

                            <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                          </div>
                        </AccordionTrigger>

                        <AccordionContent>
                          <div className="grid gap-4">
                            <Label className="text-base font-medium">
                              Select Market / Term:
                            </Label>
                            <RadioGroup
                              value={selectedInfomercialMarket ?? ""}
                              onValueChange={(value) => {
                                setSelectedInfomercialMarket(value);
                                setIsTermAccordionOpen(false);
                              }}
                              className="grid gap-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="National - 1 Year"
                                  id="infomercial-national-1yr"
                                />
                                <Label
                                  htmlFor="infomercial-national-1yr"
                                  className="cursor-pointer"
                                >
                                  National — 1 Year
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="North America (US & Canada) - 1 Year"
                                  id="infomercial-na-1yr"
                                />
                                <Label
                                  htmlFor="infomercial-na-1yr"
                                  className="cursor-pointer"
                                >
                                  North America (US &amp; Canada) — 1 Year
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {/* --- Info for: TV -> Mnemonics (Informational) --- */}
                {selectedSubType === "Mnemonics" && calculatedRate && (
                  <div className="mt-4 text-sm text-slate-600 dark:text-slate-300 space-y-2">
                    <p>
                      Mnemonics are short branded tags attached to campaigns.
                      Rates vary widely based on brand, media mix, and term, so
                      the range shown is guidance only.
                    </p>
                    <p>
                      Use this range as a reference and match it to the
                      appropriate TV category and term when you quote.
                    </p>
                    <p>
                      This will <strong>NOT</strong> add to quote on the right.
                    </p>
                  </div>
                )}

                {/* --- Info for: TV -> Point of Sale (POS) (Informational) --- */}
                {selectedSubType === "Point of Sale (POS)" &&
                  calculatedRate && (
                    <div className="mt-4 text-sm text-slate-600 dark:text-slate-300 space-y-2">
                      <p>
                        Point of Sale (POS) covers in-store screens at grocery,
                        gas, or retail locations. GVAA’s guidance is to align
                        POS rates with the closest TV Local/Regional or National
                        scope.
                      </p>
                      <p>
                        Use this range as a reference and match it to the
                        appropriate TV category and term when you quote.
                      </p>
                      <p>
                        This will <strong>NOT</strong> add to quote on the
                        right.
                      </p>
                    </div>
                  )}

                {/* --- Accordion for: Non-Broadcast -> Corporate & Industrial Narration — Finished Minute Scale --- */}
                {selectedSubType ===
                  "Corporate & Industrial Narration — Finished Minute Scale" && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                    <Accordion
                      type="single"
                      collapsible
                      value={isTermAccordionOpen ? "nb-corp-finished" : ""}
                      onValueChange={(val) =>
                        setIsTermAccordionOpen(val === "nb-corp-finished")
                      }
                      className="w-full"
                    >
                      <AccordionItem value="nb-corp-finished">
                        <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                          <span className="text-base font-medium text-slate-200">
                            Finished Minute Range
                          </span>

                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-300">
                              {selectedDuration ||
                                "Select finished-minute range"}
                            </span>

                            <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                          </div>
                        </AccordionTrigger>

                        <AccordionContent>
                          <div className="grid gap-4">
                            <Label className="text-base font-medium">
                              Select Finished Minute Range:
                            </Label>
                            <RadioGroup
                              value={selectedDuration ?? ""}
                              onValueChange={(value) => {
                                setSelectedDuration(value);
                                setIsTermAccordionOpen(false); // close after selection
                              }}
                              className="grid grid-cols-2 gap-2"
                            >
                              {Object.keys(corporateMinuteRates).map(
                                (duration) => (
                                  <div
                                    key={duration}
                                    className="flex items-center space-x-2"
                                  >
                                    <RadioGroupItem
                                      value={duration}
                                      id={`duration-${duration.replace(
                                        " ",
                                        ""
                                      )}`}
                                    />
                                    <Label
                                      htmlFor={`duration-${duration.replace(
                                        " ",
                                        ""
                                      )}`}
                                      className="cursor-pointer"
                                    >
                                      {duration}
                                    </Label>
                                  </div>
                                )
                              )}
                            </RadioGroup>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {/* --- Accordion for: Non-Broadcast -> Corporate & Industrial Narration — Recording Time Scale --- */}
                {selectedSubType ===
                  "Corporate & Industrial Narration — Recording Time Scale" && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                    <Accordion
                      type="single"
                      collapsible
                      value={isTermAccordionOpen ? "nb-corp-recording" : ""}
                      onValueChange={(val) =>
                        setIsTermAccordionOpen(val === "nb-corp-recording")
                      }
                      className="w-full"
                    >
                      <AccordionItem value="nb-corp-recording">
                        <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                          <span className="text-base font-medium text-slate-200">
                            Recording Time (Hours)
                          </span>

                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-300">
                              {numberOfHours
                                ? `${numberOfHours} hour${
                                    numberOfHours === 1 ? "" : "s"
                                  }`
                                : "Enter hours"}
                            </span>

                            <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                          </div>
                        </AccordionTrigger>

                        <AccordionContent>
                          <div className="grid gap-4">
                            <Label
                              htmlFor="corp-hours"
                              className="text-base font-medium"
                            >
                              Number of Recording Hours:
                            </Label>
                            <Input
                              autoComplete="off"
                              id="corp-hours"
                              type="number"
                              value={numberOfHours}
                              onChange={(e) => {
                                const next = Math.max(
                                  1,
                                  Number(e.target.value) || 1
                                );
                                setNumberOfHours(next);
                                // Close accordion once user enters a valid hour count
                                setIsTermAccordionOpen(false);
                              }}
                              min="1"
                              step="1"
                              className="max-w-[150px]"
                            />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {/* --- Accordion for: Non-Broadcast -> Explainer Videos --- */}
                {selectedSubType === "Explainer Videos" && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                    <Accordion
                      type="single"
                      collapsible
                      value={isTermAccordionOpen ? "nb-explainer" : ""}
                      onValueChange={(val) =>
                        setIsTermAccordionOpen(val === "nb-explainer")
                      }
                      className="w-full"
                    >
                      <AccordionItem value="nb-explainer">
                        <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                          <span className="text-base font-medium text-slate-200">
                            Explainer Settings
                          </span>

                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-300">
                              {explainerCalcMethod === "single"
                                ? "Single Video (≤ 90s)"
                                : explainerCalcMethod === "bulk"
                                ? wordCount > 0
                                  ? `Bulk — ${wordCount} word${
                                      wordCount === 1 ? "" : "s"
                                    }`
                                  : "Bulk — enter word count"
                                : "Select method"}
                            </span>

                            <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                          </div>
                        </AccordionTrigger>

                        <AccordionContent>
                          <div className="grid gap-6">
                            {/* Calculation Method Selection */}
                            <div className="grid gap-4">
                              <Label className="text-base font-medium">
                                Select Calculation Method:
                              </Label>
                              <RadioGroup
                                value={explainerCalcMethod ?? ""}
                                onValueChange={(value: string) => {
                                  setExplainerCalcMethod(value);
                                  setWordCount(0);
                                  setSelectedDuration(null);

                                  // Auto-close when Single Video is selected
                                  if (value === "single") {
                                    setIsTermAccordionOpen(false);
                                  }
                                }}
                                className="grid grid-cols-2 gap-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="single"
                                    id="explainer-method-single"
                                  />
                                  <Label
                                    htmlFor="explainer-method-single"
                                    className="cursor-pointer"
                                  >
                                    Single Video (≤ 90s)
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="bulk"
                                    id="explainer-method-bulk"
                                  />
                                  <Label
                                    htmlFor="explainer-method-bulk"
                                    className="cursor-pointer"
                                  >
                                    Bulk Rate (by Word Count)
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>

                            {/* Conditional Inputs: Word Count for Bulk */}
                            {explainerCalcMethod === "bulk" && (
                              <div className="grid gap-4 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
                                <Label
                                  htmlFor="explainer-wordcount"
                                  className="text-base font-medium"
                                >
                                  Enter Word Count:
                                </Label>
                                <Input
                                  autoComplete="off"
                                  id="explainer-wordcount"
                                  type="number"
                                  value={wordCount > 0 ? wordCount : ""}
                                  onChange={(e) =>
                                    setWordCount(
                                      Math.max(0, Number(e.target.value) || 0)
                                    )
                                  }
                                  min="0"
                                  step="1"
                                  className="max-w-[150px]"
                                  placeholder="e.g., 250"
                                />
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {/* --- Accordion for: Non-Broadcast -> Museum Tours — Educational --- */}
                {selectedSubType === "Museum Tours — Educational" && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                    <Accordion
                      type="single"
                      collapsible
                      value={isTermAccordionOpen ? "nb-museum" : ""}
                      onValueChange={(val) =>
                        setIsTermAccordionOpen(val === "nb-museum")
                      }
                      className="w-full"
                    >
                      <AccordionItem value="nb-museum">
                        <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                          <span className="text-base font-medium text-slate-200">
                            Museum Tour Settings
                          </span>

                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-300">
                              {selectedMuseumCategory
                                ? museumRecordingHours
                                  ? `${selectedMuseumCategory} — ${museumRecordingHours} hr${
                                      museumRecordingHours === 1 ? "" : "s"
                                    }`
                                  : `${selectedMuseumCategory} — set hours`
                                : "Select category & hours"}
                            </span>

                            <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                          </div>
                        </AccordionTrigger>

                        <AccordionContent>
                          <div className="grid gap-6">
                            {/* Category Selection */}
                            <div className="grid gap-4">
                              <Label className="text-base font-medium">
                                Select Category:
                              </Label>
                              <RadioGroup
                                value={selectedMuseumCategory ?? ""}
                                onValueChange={(value) => {
                                  setSelectedMuseumCategory(value);
                                  // Don't auto-close here; let them set hours first
                                }}
                                className="grid gap-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="CAT1"
                                    id="museum-cat1"
                                  />
                                  <Label
                                    htmlFor="museum-cat1"
                                    className="cursor-pointer"
                                  >
                                    Principal Voice, Audio Tour (Industrial CAT
                                    1)
                                  </Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="CAT2"
                                    id="museum-cat2"
                                  />
                                  <Label
                                    htmlFor="museum-cat2"
                                    className="cursor-pointer"
                                  >
                                    Talking Statues, Exhibition Voices
                                    (Industrial CAT 2)
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>

                            {/* Recording Hours Input */}
                            <div className="grid gap-4">
                              <Label
                                htmlFor="museum-hours"
                                className="text-base font-medium"
                              >
                                Total Recording Hours:
                              </Label>
                              <Input
                                autoComplete="off"
                                id="museum-hours"
                                type="number"
                                value={museumRecordingHours}
                                onChange={(e) => {
                                  const next = Math.max(
                                    1,
                                    Number(e.target.value) || 1
                                  );
                                  setMuseumRecordingHours(next);

                                  // If category already chosen AND hours valid → close accordion
                                  if (selectedMuseumCategory && next >= 1) {
                                    setIsTermAccordionOpen(false);
                                  }
                                }}
                                min="1"
                                step="0.5" /* half-hour increments allowed */
                                className="max-w-[150px]"
                              />
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {/* --- Accordion for: Non-Broadcast -> Podcasts --- */}
                {selectedSubType === "Podcasts" && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                    <Accordion
                      type="single"
                      collapsible
                      value={isTermAccordionOpen ? "nb-podcasts" : ""}
                      onValueChange={(val) =>
                        setIsTermAccordionOpen(val === "nb-podcasts")
                      }
                      className="w-full"
                    >
                      <AccordionItem value="nb-podcasts">
                        <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                          <span className="text-base font-medium text-slate-200">
                            Podcast Type
                          </span>

                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-300">
                              {selectedPodcastType || "Select podcast type"}
                            </span>

                            <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                          </div>
                        </AccordionTrigger>

                        <AccordionContent>
                          <div className="grid gap-4">
                            <Label className="text-base font-medium">
                              Select Podcast Type:
                            </Label>
                            <RadioGroup
                              value={selectedPodcastType ?? ""}
                              onValueChange={(value) => {
                                setSelectedPodcastType(value);
                                setIsTermAccordionOpen(false); // close after selection
                              }}
                              className="grid gap-2"
                            >
                              {Object.keys(podcastRates).map((podcastType) => (
                                <div
                                  key={podcastType}
                                  className="flex items-center space-x-2"
                                >
                                  <RadioGroupItem
                                    value={podcastType}
                                    id={`podcast-${podcastType.replace(
                                      /[^a-zA-Z0-9]/g,
                                      ""
                                    )}`}
                                  />
                                  <Label
                                    htmlFor={`podcast-${podcastType.replace(
                                      /[^a-zA-Z0-9]/g,
                                      ""
                                    )}`}
                                    className="cursor-pointer"
                                  >
                                    {podcastType}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {/* --- Accordion for: Non-Broadcast -> Medical / Technical Narration --- */}
                {selectedSubType === "Medical / Technical Narration" && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                    <Accordion
                      type="single"
                      collapsible
                      value={isTermAccordionOpen ? "nb-medtech" : ""}
                      onValueChange={(val) =>
                        setIsTermAccordionOpen(val === "nb-medtech")
                      }
                      className="w-full"
                    >
                      <AccordionItem value="nb-medtech">
                        <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                          <span className="text-base font-medium text-slate-200">
                            Med/Technical Settings
                          </span>

                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-300">
                              {medTechCalcMethod === "minute"
                                ? selectedDuration
                                  ? `By Minute — ${selectedDuration}`
                                  : "By Minute — select range"
                                : medTechCalcMethod === "word"
                                ? wordCount > 0
                                  ? `By Word — ${wordCount} word${
                                      wordCount === 1 ? "" : "s"
                                    }`
                                  : "By Word — enter count"
                                : "Select method"}
                            </span>

                            <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                          </div>
                        </AccordionTrigger>

                        <AccordionContent>
                          <div className="grid gap-6">
                            {/* Calculation Method Selection */}
                            <div className="grid gap-4">
                              <Label className="text-base font-medium">
                                Select Calculation Method:
                              </Label>
                              <RadioGroup
                                value={medTechCalcMethod ?? ""}
                                onValueChange={(value: string) => {
                                  setMedTechCalcMethod(value);
                                  // Reset specific inputs when method changes
                                  setSelectedDuration(null);
                                  setWordCount(0);
                                  // Keep accordion open so they can choose range or enter words
                                }}
                                className="grid grid-cols-2 gap-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="minute"
                                    id="medtech-method-minute"
                                  />
                                  <Label
                                    htmlFor="medtech-method-minute"
                                    className="cursor-pointer"
                                  >
                                    By Finished Minute
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="word"
                                    id="medtech-method-word"
                                  />
                                  <Label
                                    htmlFor="medtech-method-word"
                                    className="cursor-pointer"
                                  >
                                    By Word Count
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>

                            {/* Conditional Inputs: Finished Minute */}
                            {medTechCalcMethod === "minute" && (
                              <div className="grid gap-4 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
                                <Label className="text-base font-medium">
                                  Select Finished Minute Range:
                                </Label>
                                <RadioGroup
                                  value={selectedDuration ?? ""}
                                  onValueChange={(value) => {
                                    setSelectedDuration(value);
                                    // Once they pick a range, we’re done → close accordion
                                    setIsTermAccordionOpen(false);
                                  }}
                                  className="grid grid-cols-2 gap-2"
                                >
                                  {Object.keys(medicalMinuteRates).map(
                                    (duration) => (
                                      <div
                                        key={duration}
                                        className="flex items-center space-x-2"
                                      >
                                        <RadioGroupItem
                                          value={duration}
                                          id={`duration-med-${duration.replace(
                                            /[^a-zA-Z0-9]/g,
                                            ""
                                          )}`}
                                        />
                                        <Label
                                          htmlFor={`duration-med-${duration.replace(
                                            /[^a-zA-Z0-9]/g,
                                            ""
                                          )}`}
                                          className="cursor-pointer"
                                        >
                                          {duration}
                                        </Label>
                                      </div>
                                    )
                                  )}
                                </RadioGroup>
                              </div>
                            )}

                            {/* Conditional Inputs: Word Count */}
                            {medTechCalcMethod === "word" && (
                              <div className="grid gap-4 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
                                <Label
                                  htmlFor="medtech-wordcount"
                                  className="text-base font-medium"
                                >
                                  Enter Word Count:
                                </Label>
                                <Input
                                  autoComplete="off"
                                  id="medtech-wordcount"
                                  type="number"
                                  value={wordCount > 0 ? wordCount : ""}
                                  onChange={(e) => {
                                    const next = Math.max(
                                      0,
                                      Number(e.target.value) || 0
                                    );
                                    setWordCount(next);
                                    // still no auto-close on every keystroke
                                  }}
                                  onBlur={() => {
                                    if (wordCount > 0) {
                                      setIsTermAccordionOpen(false);
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" && wordCount > 0) {
                                      setIsTermAccordionOpen(false);
                                    }
                                  }}
                                  min="0"
                                  step="1"
                                  className="max-w-[150px]"
                                  placeholder="e.g., 1500"
                                />
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {/* --- Info for: Non-Broadcast -> Digital Greeting Cards (Informational Only) --- */}
                {selectedSubType === "Digital Greeting Cards" &&
                  calculatedRate && (
                    <div className="mt-4 text-sm text-slate-600 dark:text-slate-300 space-y-2">
                      <p>
                        Digital Greeting Cards are typically short, personalized
                        messages used in apps or online platforms. Rates vary
                        depending on complexity and usage, so the range above is
                        provided as general guidance.
                      </p>
                      <p className="font-medium text-slate-700 dark:text-slate-200">
                        This is an informational-only category. It will{" "}
                        <strong>NOT</strong> add to the quote on the right.
                      </p>
                    </div>
                  )}

                {/* --- Accordion for: Non-Broadcast -> YouTube Content --- */}
                {selectedSubType === "YouTube Content" && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                    <Accordion
                      type="single"
                      collapsible
                      value={isTermAccordionOpen ? "nb-youtube" : ""}
                      onValueChange={(val) =>
                        setIsTermAccordionOpen(val === "nb-youtube")
                      }
                      className="w-full"
                    >
                      <AccordionItem value="nb-youtube">
                        <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                          <span className="text-base font-medium text-slate-200">
                            YouTube Content Type
                          </span>

                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-300">
                              {selectedYouTubeType || "Select content type"}
                            </span>

                            <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                          </div>
                        </AccordionTrigger>

                        <AccordionContent>
                          <div className="grid gap-4">
                            <Label className="text-base font-medium">
                              Select Content Type:
                            </Label>
                            <RadioGroup
                              value={selectedYouTubeType ?? ""}
                              onValueChange={(value) => {
                                setSelectedYouTubeType(value);
                                setIsTermAccordionOpen(false); // close after selection
                              }}
                              className="grid gap-2"
                            >
                              {Object.keys(youTubeRates).map((type) => (
                                <div
                                  key={type}
                                  className="flex items-center space-x-2"
                                >
                                  <RadioGroupItem
                                    value={type}
                                    id={`youtube-${type.replace(
                                      /[^a-zA-Z0-9]/g,
                                      ""
                                    )}`}
                                  />
                                  <Label
                                    htmlFor={`youtube-${type.replace(
                                      /[^a-zA-Z0-9]/g,
                                      ""
                                    )}`}
                                    className="cursor-pointer"
                                  >
                                    {type}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {/* --- Accordion for: Non-Broadcast -> Kiosk Use (Non-Retail) --- */}
                {selectedSubType === "Kiosk Use (Non-Retail)" && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                    <Accordion
                      type="single"
                      collapsible
                      value={isTermAccordionOpen ? "nb-kiosk" : ""}
                      onValueChange={(val) =>
                        setIsTermAccordionOpen(val === "nb-kiosk")
                      }
                      className="w-full"
                    >
                      <AccordionItem value="nb-kiosk">
                        <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                          <span className="text-base font-medium text-slate-200">
                            Recording Hours
                          </span>

                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-300">
                              {numberOfHours
                                ? `${numberOfHours} hour${
                                    numberOfHours === 1 ? "" : "s"
                                  }`
                                : "Enter hours"}
                            </span>

                            <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                          </div>
                        </AccordionTrigger>

                        <AccordionContent>
                          <div className="grid gap-4">
                            <Label
                              htmlFor="kiosk-hours"
                              className="text-base font-medium"
                            >
                              Number of Recording Hours:
                            </Label>
                            <Input
                              autoComplete="off"
                              id="kiosk-hours"
                              type="number"
                              value={numberOfHours}
                              onChange={(e) => {
                                const next = Math.max(
                                  1,
                                  Number(e.target.value) || 1
                                );
                                setNumberOfHours(next);
                                // Do not close on each digit — wait for blur/Enter
                              }}
                              onBlur={() => {
                                if (numberOfHours >= 1) {
                                  setIsTermAccordionOpen(false);
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && numberOfHours >= 1) {
                                  setIsTermAccordionOpen(false);
                                }
                              }}
                              min="1"
                              step="1"
                              className="max-w-[150px]"
                            />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {/* --- Accordion for: Non-Broadcast -> Lobby Viewing --- */}
                {selectedSubType === "Lobby Viewing" && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                    <Accordion
                      type="single"
                      collapsible
                      value={isTermAccordionOpen ? "nb-lobby" : ""}
                      onValueChange={(val) =>
                        setIsTermAccordionOpen(val === "nb-lobby")
                      }
                      className="w-full"
                    >
                      <AccordionItem value="nb-lobby">
                        <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                          <span className="text-base font-medium text-slate-200">
                            Lobby Viewing Settings
                          </span>

                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-300">
                              {!selectedLobbyType
                                ? "Select lobby video type"
                                : selectedLobbyType === "explainer"
                                ? numberOfHours
                                  ? `Explainer — ${numberOfHours} hour${
                                      numberOfHours === 1 ? "" : "s"
                                    }`
                                  : "Explainer — set hours"
                                : "Retail (Selling a Product/Service)"}
                            </span>

                            <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                          </div>
                        </AccordionTrigger>

                        <AccordionContent>
                          <div className="grid gap-6">
                            {/* Type Selection */}
                            <div className="grid gap-4">
                              <Label className="text-base font-medium">
                                Select Lobby Video Type:
                              </Label>
                              <RadioGroup
                                value={selectedLobbyType ?? ""}
                                onValueChange={(value) => {
                                  setSelectedLobbyType(value);
                                  // If Retail, nothing else to fill → close
                                  if (value === "retail") {
                                    setIsTermAccordionOpen(false);
                                  }
                                  // If Explainer, keep open so they can set hours
                                }}
                                className="grid gap-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="explainer"
                                    id="lobby-explainer"
                                  />
                                  <Label
                                    htmlFor="lobby-explainer"
                                    className="cursor-pointer"
                                  >
                                    Explainer (Service Provider, Not Selling)
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="retail"
                                    id="lobby-retail"
                                  />
                                  <Label
                                    htmlFor="lobby-retail"
                                    className="cursor-pointer"
                                  >
                                    Retail (Selling a Product/Service)
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>

                            {/* Conditional Inputs: Recording Hours for Explainer */}
                            {selectedLobbyType === "explainer" && (
                              <div className="grid gap-4 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
                                <Label
                                  htmlFor="lobby-hours"
                                  className="text-base font-medium"
                                >
                                  Number of Recording Hours:
                                </Label>
                                <Input
                                  autoComplete="off"
                                  id="lobby-hours"
                                  type="number"
                                  value={numberOfHours}
                                  onChange={(e) => {
                                    const next = Math.max(
                                      1,
                                      Number(e.target.value) || 1
                                    );
                                    setNumberOfHours(next);
                                    // don’t close on each digit
                                  }}
                                  onBlur={() => {
                                    if (
                                      selectedLobbyType === "explainer" &&
                                      numberOfHours >= 1
                                    ) {
                                      setIsTermAccordionOpen(false);
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (
                                      e.key === "Enter" &&
                                      selectedLobbyType === "explainer" &&
                                      numberOfHours >= 1
                                    ) {
                                      setIsTermAccordionOpen(false);
                                    }
                                  }}
                                  min="1"
                                  step="1"
                                  className="max-w-[150px]"
                                />
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {/* --- Accordion for: Non-Broadcast -> Airport Announcements --- */}
                {selectedSubType === "Airport Announcements" && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                    <Accordion
                      type="single"
                      collapsible
                      value={isTermAccordionOpen ? "nb-airport" : ""}
                      onValueChange={(val) =>
                        setIsTermAccordionOpen(val === "nb-airport")
                      }
                      className="w-full"
                    >
                      <AccordionItem value="nb-airport">
                        <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                          <span className="text-base font-medium text-slate-200">
                            Airport Announcement Settings
                          </span>

                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-300">
                              {numberOfAirports && numberOfHours
                                ? `${numberOfAirports} airport${
                                    numberOfAirports === 1 ? "" : "s"
                                  } — ${numberOfHours} hour${
                                    numberOfHours === 1 ? "" : "s"
                                  }`
                                : numberOfAirports
                                ? `${numberOfAirports} airport${
                                    numberOfAirports === 1 ? "" : "s"
                                  } — set hours`
                                : numberOfHours
                                ? `${numberOfHours} hour${
                                    numberOfHours === 1 ? "" : "s"
                                  } — set airports`
                                : "Set airports and hours"}
                            </span>

                            <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                          </div>
                        </AccordionTrigger>

                        <AccordionContent>
                          <div className="grid gap-6">
                            {/* Number of Airports Input */}
                            <div className="grid gap-4">
                              <Label
                                htmlFor="airport-count"
                                className="text-base font-medium"
                              >
                                Number of Airports:
                              </Label>
                              <Input
                                autoComplete="off"
                                id="airport-count"
                                type="number"
                                value={numberOfAirports}
                                onChange={(e) => {
                                  const next = Math.max(
                                    1,
                                    Number(e.target.value) || 1
                                  );
                                  setNumberOfAirports(next);
                                  // don't auto-close on each keystroke
                                }}
                                onBlur={() => {
                                  if (
                                    numberOfAirports >= 1 &&
                                    numberOfHours >= 1
                                  ) {
                                    setIsTermAccordionOpen(false);
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (
                                    e.key === "Enter" &&
                                    numberOfAirports >= 1 &&
                                    numberOfHours >= 1
                                  ) {
                                    setIsTermAccordionOpen(false);
                                  }
                                }}
                                min="1"
                                step="1"
                                className="max-w-[150px]"
                              />
                            </div>

                            {/* Number of Recording Hours Input */}
                            <div className="grid gap-4">
                              <Label
                                htmlFor="airport-hours"
                                className="text-base font-medium"
                              >
                                Total Recording Hours (RAW):
                              </Label>
                              <Input
                                autoComplete="off"
                                id="airport-hours"
                                type="number"
                                value={numberOfHours}
                                onChange={(e) => {
                                  const next = Math.max(
                                    1,
                                    Number(e.target.value) || 1
                                  );
                                  setNumberOfHours(next);
                                  // don't auto-close on each keystroke
                                }}
                                onBlur={() => {
                                  if (
                                    numberOfAirports >= 1 &&
                                    numberOfHours >= 1
                                  ) {
                                    setIsTermAccordionOpen(false);
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (
                                    e.key === "Enter" &&
                                    numberOfAirports >= 1 &&
                                    numberOfHours >= 1
                                  ) {
                                    setIsTermAccordionOpen(false);
                                  }
                                }}
                                min="1"
                                step="1" // whole hours
                                className="max-w-[150px]"
                              />
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {/* --- Form for: E-Learning --- */}
                {selectedCategory === "elearning" && (
                  <div className="grid gap-6">
                    {/* Per Word */}
                    {selectedSubType === "Per Word" && (
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                        <Accordion
                          type="single"
                          collapsible
                          value={isTermAccordionOpen ? "el-per-word" : ""}
                          onValueChange={(val) =>
                            setIsTermAccordionOpen(val === "el-per-word")
                          }
                          className="w-full"
                        >
                          <AccordionItem value="el-per-word">
                            <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                              <span className="text-base font-medium text-slate-200">
                                E-Learning — Per Word
                              </span>

                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-300">
                                  {wordCount > 0
                                    ? `${wordCount} word${
                                        wordCount === 1 ? "" : "s"
                                      }`
                                    : "Enter word count"}
                                </span>

                                <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                              </div>
                            </AccordionTrigger>

                            <AccordionContent>
                              <div className="grid gap-4">
                                <Label
                                  htmlFor="elearning-wordcount"
                                  className="text-base font-medium"
                                >
                                  Enter Word Count:
                                </Label>
                                <Input
                                  autoComplete="off"
                                  id="elearning-wordcount"
                                  type="number"
                                  value={wordCount > 0 ? wordCount : ""}
                                  onChange={(e) => {
                                    const next = Math.max(
                                      0,
                                      Number(e.target.value) || 0
                                    );
                                    setWordCount(next);
                                  }}
                                  onBlur={() => {
                                    if (wordCount > 0) {
                                      setIsTermAccordionOpen(false);
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" && wordCount > 0) {
                                      setIsTermAccordionOpen(false);
                                    }
                                  }}
                                  min="0"
                                  className="max-w-[150px]"
                                  placeholder="e.g., 7500"
                                />
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}

                    {/* Per Finished Minute */}
                    {selectedSubType === "Per Finished Minute" && (
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                        <Accordion
                          type="single"
                          collapsible
                          value={
                            isTermAccordionOpen ? "el-per-finished-minute" : ""
                          }
                          onValueChange={(val) =>
                            setIsTermAccordionOpen(
                              val === "el-per-finished-minute"
                            )
                          }
                          className="w-full"
                        >
                          <AccordionItem value="el-per-finished-minute">
                            <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                              <span className="text-base font-medium text-slate-200">
                                E-Learning — Per Finished Minute
                              </span>

                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-300">
                                  {finishedMinutes &&
                                  Number(finishedMinutes) > 0
                                    ? `${finishedMinutes} min`
                                    : "Enter finished minutes"}
                                </span>

                                <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                              </div>
                            </AccordionTrigger>

                            <AccordionContent>
                              <div className="grid gap-4">
                                <Label
                                  htmlFor="elearning-pfm"
                                  className="text-base font-medium"
                                >
                                  Enter Finished Minutes:
                                </Label>
                                <Input
                                  autoComplete="off"
                                  id="elearning-pfm"
                                  type="number"
                                  value={finishedMinutes}
                                  onChange={(e) => {
                                    setFinishedMinutes(e.target.value);
                                  }}
                                  onBlur={() => {
                                    if (
                                      finishedMinutes &&
                                      Number(finishedMinutes) > 0
                                    ) {
                                      setIsTermAccordionOpen(false);
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (
                                      e.key === "Enter" &&
                                      finishedMinutes &&
                                      Number(finishedMinutes) > 0
                                    ) {
                                      setIsTermAccordionOpen(false);
                                    }
                                  }}
                                  min="0"
                                  className="max-w-[150px]"
                                  placeholder="e.g., 30"
                                />
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}

                    {/* Per Raw Hour */}
                    {selectedSubType === "Per Raw Hour" && (
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                        <Accordion
                          type="single"
                          collapsible
                          value={isTermAccordionOpen ? "el-per-raw-hour" : ""}
                          onValueChange={(val) =>
                            setIsTermAccordionOpen(val === "el-per-raw-hour")
                          }
                          className="w-full"
                        >
                          <AccordionItem value="el-per-raw-hour">
                            <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                              <span className="text-base font-medium text-slate-200">
                                E-Learning — Per Raw Hour
                              </span>

                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-300">
                                  {numberOfHours
                                    ? `${numberOfHours} hour${
                                        numberOfHours === 1 ? "" : "s"
                                      }`
                                    : "Enter raw hours"}
                                </span>

                                <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                              </div>
                            </AccordionTrigger>

                            <AccordionContent>
                              <div className="grid gap-4">
                                <Label
                                  htmlFor="elearning-raw"
                                  className="text-base font-medium"
                                >
                                  Enter Raw Hours:
                                </Label>
                                <Input
                                  autoComplete="off"
                                  id="elearning-raw"
                                  type="number"
                                  value={numberOfHours}
                                  onChange={(e) => {
                                    const next = Math.max(
                                      1,
                                      Number(e.target.value) || 1
                                    );
                                    setNumberOfHours(next);
                                  }}
                                  onBlur={() => {
                                    if (numberOfHours >= 1) {
                                      setIsTermAccordionOpen(false);
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (
                                      e.key === "Enter" &&
                                      numberOfHours >= 1
                                    ) {
                                      setIsTermAccordionOpen(false);
                                    }
                                  }}
                                  min="1"
                                  step="0.5"
                                  className="max-w-[150px]"
                                />
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}

                    {/* Per Finished Hour */}
                    {selectedSubType === "Per Finished Hour" && (
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                        <Accordion
                          type="single"
                          collapsible
                          value={
                            isTermAccordionOpen ? "el-per-finished-hour" : ""
                          }
                          onValueChange={(val) =>
                            setIsTermAccordionOpen(
                              val === "el-per-finished-hour"
                            )
                          }
                          className="w-full"
                        >
                          <AccordionItem value="el-per-finished-hour">
                            <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                              <span className="text-base font-medium text-slate-200">
                                E-Learning — Per Finished Hour
                              </span>

                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-300">
                                  {finishedHours && Number(finishedHours) > 0
                                    ? `${finishedHours} hr`
                                    : "Enter finished hours"}
                                </span>

                                <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                              </div>
                            </AccordionTrigger>

                            <AccordionContent>
                              <div className="grid gap-4">
                                <Label
                                  htmlFor="elearning-pfh"
                                  className="text-base font-medium"
                                >
                                  Enter Finished Hours:
                                </Label>
                                <Input
                                  autoComplete="off"
                                  id="elearning-pfh"
                                  type="number"
                                  value={finishedHours}
                                  onChange={(e) => {
                                    setFinishedHours(e.target.value);
                                  }}
                                  onBlur={() => {
                                    if (
                                      finishedHours &&
                                      Number(finishedHours) > 0
                                    ) {
                                      setIsTermAccordionOpen(false);
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (
                                      e.key === "Enter" &&
                                      finishedHours &&
                                      Number(finishedHours) > 0
                                    ) {
                                      setIsTermAccordionOpen(false);
                                    }
                                  }}
                                  min="0"
                                  step="0.5"
                                  className="max-w-[150px]"
                                  placeholder="e.g., 1.5"
                                />
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}

                    {/* Directed Sessions */}
                    {selectedSubType === "Directed Sessions" && (
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                        <Accordion
                          type="single"
                          collapsible
                          value={
                            isTermAccordionOpen ? "el-directed-sessions" : ""
                          }
                          onValueChange={(val) =>
                            setIsTermAccordionOpen(
                              val === "el-directed-sessions"
                            )
                          }
                          className="w-full"
                        >
                          <AccordionItem value="el-directed-sessions">
                            <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                              <span className="text-base font-medium text-slate-200">
                                E-Learning — Directed Sessions
                              </span>

                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-300">
                                  {wordCount > 0 ||
                                  (sessionHours && Number(sessionHours) > 0)
                                    ? `${
                                        wordCount > 0
                                          ? `${wordCount} words`
                                          : ""
                                      }${
                                        wordCount > 0 &&
                                        sessionHours &&
                                        Number(sessionHours) > 0
                                          ? " · "
                                          : ""
                                      }${
                                        sessionHours && Number(sessionHours) > 0
                                          ? `${sessionHours} hr session`
                                          : ""
                                      }`
                                    : "Enter words & session hours"}
                                </span>

                                <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                              </div>
                            </AccordionTrigger>

                            <AccordionContent>
                              <div className="grid gap-6">
                                <div className="grid gap-4">
                                  <Label
                                    htmlFor="elearning-directed-words"
                                    className="text-base font-medium"
                                  >
                                    Enter Word Count:
                                  </Label>
                                  <Input
                                    autoComplete="off"
                                    id="elearning-directed-words"
                                    type="number"
                                    value={wordCount > 0 ? wordCount : ""}
                                    onChange={(e) => {
                                      const next = Math.max(
                                        0,
                                        Number(e.target.value) || 0
                                      );
                                      setWordCount(next);
                                    }}
                                    onBlur={() => {
                                      if (
                                        wordCount > 0 &&
                                        sessionHours &&
                                        Number(sessionHours) > 0
                                      ) {
                                        setIsTermAccordionOpen(false);
                                      }
                                    }}
                                    onKeyDown={(e) => {
                                      if (
                                        e.key === "Enter" &&
                                        wordCount > 0 &&
                                        sessionHours &&
                                        Number(sessionHours) > 0
                                      ) {
                                        setIsTermAccordionOpen(false);
                                      }
                                    }}
                                    min="0"
                                    className="max-w-[150px]"
                                    placeholder="e.g., 10000"
                                  />
                                </div>
                                <div className="grid gap-4">
                                  <Label
                                    htmlFor="elearning-directed-hours"
                                    className="text-base font-medium"
                                  >
                                    Enter Session Hours (First 60 mins
                                    included):
                                  </Label>
                                  <Input
                                    autoComplete="off"
                                    id="elearning-directed-hours"
                                    type="number"
                                    value={sessionHours}
                                    onChange={(e) => {
                                      setSessionHours(e.target.value);
                                    }}
                                    onBlur={() => {
                                      if (
                                        wordCount > 0 &&
                                        sessionHours &&
                                        Number(sessionHours) > 0
                                      ) {
                                        setIsTermAccordionOpen(false);
                                      }
                                    }}
                                    onKeyDown={(e) => {
                                      if (
                                        e.key === "Enter" &&
                                        wordCount > 0 &&
                                        sessionHours &&
                                        Number(sessionHours) > 0
                                      ) {
                                        setIsTermAccordionOpen(false);
                                      }
                                    }}
                                    min="0"
                                    step="0.5"
                                    className="max-w-[150px]"
                                    placeholder="e.g., 2.5"
                                  />
                                  <EnterHint />
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}
                  </div>
                )}

                {/* --- Form for: Animation / Dubbing --- */}
                {selectedCategory === "animation_dubbing" && (
                  <div className="grid gap-6">
                    {/* Non-Union Original Animation — 22 Minute Episode */}
                    {selectedSubType ===
                      "Non-Union Original Animation — 22 Minute Episode" && (
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                        <Accordion
                          type="single"
                          collapsible
                          value={isTermAccordionOpen ? "anim-22-episode" : ""}
                          onValueChange={(val) =>
                            setIsTermAccordionOpen(val === "anim-22-episode")
                          }
                          className="w-full"
                        >
                          <AccordionItem value="anim-22-episode">
                            <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                              <span className="text-base font-medium text-slate-200">
                                22-Minute Episode Session
                              </span>

                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-300">
                                  {sessionLength && Number(sessionLength) > 0
                                    ? `${sessionLength} hr session`
                                    : "Enter session hours (up to 4)"}
                                </span>

                                <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                              </div>
                            </AccordionTrigger>

                            <AccordionContent>
                              <div className="grid gap-4">
                                <Label
                                  htmlFor="anim-session-hours"
                                  className="text-base font-medium"
                                >
                                  Session Hours (Up to 4):
                                </Label>
                                <Input
                                  autoComplete="off"
                                  id="anim-session-hours"
                                  type="number"
                                  value={sessionLength}
                                  onChange={(e) => {
                                    setSessionLength(e.target.value);
                                  }}
                                  onBlur={() => {
                                    if (
                                      sessionLength &&
                                      Number(sessionLength) > 0
                                    ) {
                                      setIsTermAccordionOpen(false);
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (
                                      e.key === "Enter" &&
                                      sessionLength &&
                                      Number(sessionLength) > 0
                                    ) {
                                      setIsTermAccordionOpen(false);
                                    }
                                  }}
                                  min="0"
                                  max="4"
                                  step="0.5"
                                  className="max-w-[150px]"
                                  placeholder="e.g., 2.5"
                                />
                                <EnterHint />
                                <p className="text-xs text-muted-foreground -mt-2">
                                  (Rate is for a session up to 4 hours)
                                </p>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}

                    {/* Non-Union Original Animation — 11 Minute Episode or Less */}
                    {selectedSubType ===
                      "Non-Union Original Animation — 11 Minute Episode or Less" && (
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                        <Accordion
                          type="single"
                          collapsible
                          value={isTermAccordionOpen ? "anim-11-episode" : ""}
                          onValueChange={(val) =>
                            setIsTermAccordionOpen(val === "anim-11-episode")
                          }
                          className="w-full"
                        >
                          <AccordionItem value="anim-11-episode">
                            <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                              <span className="text-base font-medium text-slate-200">
                                11-Minute Episode or Less
                              </span>

                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-300">
                                  {numEpisodes
                                    ? `${numEpisodes} episode${
                                        numEpisodes === 1 ? "" : "s"
                                      }`
                                    : "Enter number of episodes"}
                                </span>

                                <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                              </div>
                            </AccordionTrigger>

                            <AccordionContent>
                              <div className="grid gap-4">
                                <Label
                                  htmlFor="anim-11-episodes"
                                  className="text-base font-medium"
                                >
                                  Number of Episodes:
                                </Label>
                                <Input
                                  autoComplete="off"
                                  id="anim-11-episodes"
                                  type="number"
                                  value={numEpisodes}
                                  onChange={(e) => {
                                    const next = Math.max(
                                      1,
                                      Number(e.target.value) || 1
                                    );
                                    setNumEpisodes(next);
                                  }}
                                  onBlur={() => {
                                    if (numEpisodes >= 1) {
                                      setIsTermAccordionOpen(false);
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" && numEpisodes >= 1) {
                                      setIsTermAccordionOpen(false);
                                    }
                                  }}
                                  min="1"
                                  step="1"
                                  className="max-w-[150px]"
                                />
                                <EnterHint />
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}

                    {/* Dubbing (Film/TV/Animation) */}
                    {selectedSubType === "Dubbing (Film/TV/Animation)" && (
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                        <Accordion
                          type="single"
                          collapsible
                          value={isTermAccordionOpen ? "anim-dubbing" : ""}
                          onValueChange={(val) =>
                            setIsTermAccordionOpen(val === "anim-dubbing")
                          }
                          className="w-full"
                        >
                          <AccordionItem value="anim-dubbing">
                            <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                              <span className="text-base font-medium text-slate-200">
                                Dubbing Session (Film/TV/Animation)
                              </span>

                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-300">
                                  {sessionLength && Number(sessionLength) > 0
                                    ? `${sessionLength} hr session`
                                    : "Enter session hours (2 hr min in rate)"}
                                </span>

                                <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                              </div>
                            </AccordionTrigger>

                            <AccordionContent>
                              <div className="grid gap-4">
                                <Label
                                  htmlFor="dubbing-hours"
                                  className="text-base font-medium"
                                >
                                  Session Hours (2 hr min):
                                </Label>
                                <Input
                                  autoComplete="off"
                                  id="dubbing-hours"
                                  type="number"
                                  value={sessionLength}
                                  onChange={(e) => {
                                    setSessionLength(e.target.value);
                                  }}
                                  onBlur={() => {
                                    if (
                                      sessionLength &&
                                      Number(sessionLength) > 0
                                    ) {
                                      setIsTermAccordionOpen(false);
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (
                                      e.key === "Enter" &&
                                      sessionLength &&
                                      Number(sessionLength) > 0
                                    ) {
                                      setIsTermAccordionOpen(false);
                                    }
                                  }}
                                  // 2 hr minimum is enforced in the calculator logic, not the input
                                  min="0"
                                  step="0.5"
                                  className="max-w-[150px]"
                                  placeholder="e.g., 3"
                                />
                                <EnterHint />
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}
                  </div>
                )}

                {/* --- Form for: Video Games / Toys & Games --- */}
                {selectedCategory === "video_games_toys" && (
                  <div className="grid gap-6">
                    {/* Non-Union Video Games */}
                    {selectedSubType === "Video Games (Non-Union)" && (
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                        <Accordion
                          type="single"
                          collapsible
                          value={isTermAccordionOpen ? "vg-nonunion" : ""}
                          onValueChange={(val) =>
                            setIsTermAccordionOpen(val === "vg-nonunion")
                          }
                          className="w-full"
                        >
                          <AccordionItem value="vg-nonunion">
                            <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                              <span className="text-base font-medium text-slate-200">
                                Non-Union Video Games
                              </span>

                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-300">
                                  {gameCalcMethod === "hourly"
                                    ? sessionLength && Number(sessionLength) > 0
                                      ? `Hourly — ${sessionLength} hr`
                                      : "Hourly — set session hours"
                                    : gameCalcMethod === "flat"
                                    ? "Flat Rate (1 hr max)"
                                    : "Select method"}
                                </span>

                                <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                              </div>
                            </AccordionTrigger>

                            <AccordionContent>
                              <div className="grid gap-4">
                                <Label className="text-base font-medium">
                                  Select Calculation Method:
                                </Label>
                                <RadioGroup
                                  value={gameCalcMethod ?? ""}
                                  onValueChange={(value) => {
                                    setGameCalcMethod(value);
                                    // reset supporting fields
                                    setSessionLength("");
                                    if (value === "flat") {
                                      // nothing else to fill → close
                                      setIsTermAccordionOpen(false);
                                    }
                                  }}
                                  className="grid gap-2"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                      value="hourly"
                                      id="game-hourly"
                                    />
                                    <Label
                                      htmlFor="game-hourly"
                                      className="cursor-pointer"
                                    >
                                      Per Hour (2 or 4 hr min)
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                      value="flat"
                                      id="game-flat"
                                    />
                                    <Label
                                      htmlFor="game-flat"
                                      className="cursor-pointer"
                                    >
                                      Flat Rate (1 hr max)
                                    </Label>
                                  </div>
                                </RadioGroup>

                                {gameCalcMethod === "hourly" && (
                                  <div className="grid gap-4 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
                                    <Label
                                      htmlFor="game-hours"
                                      className="text-base font-medium"
                                    >
                                      Session Hours:
                                    </Label>
                                    <Input
                                      autoComplete="off"
                                      id="game-hours"
                                      type="number"
                                      value={sessionLength}
                                      onChange={(e) => {
                                        setSessionLength(e.target.value);
                                      }}
                                      onBlur={() => {
                                        if (
                                          sessionLength &&
                                          Number(sessionLength) > 0
                                        ) {
                                          setIsTermAccordionOpen(false);
                                        }
                                      }}
                                      onKeyDown={(e) => {
                                        if (
                                          e.key === "Enter" &&
                                          sessionLength &&
                                          Number(sessionLength) > 0
                                        ) {
                                          setIsTermAccordionOpen(false);
                                        }
                                      }}
                                      min="0"
                                      step="0.5"
                                      className="max-w-[150px]"
                                      placeholder="e.g., 4"
                                    />
                                    <EnterHint />
                                  </div>
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}

                    {/* Union Video Games */}
                    {selectedSubType === "Video Games (Union)" && (
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                        <Accordion
                          type="single"
                          collapsible
                          value={isTermAccordionOpen ? "vg-union" : ""}
                          onValueChange={(val) =>
                            setIsTermAccordionOpen(val === "vg-union")
                          }
                          className="w-full"
                        >
                          <AccordionItem value="vg-union">
                            <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                              <span className="text-base font-medium text-slate-200">
                                Union Video Games
                              </span>

                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-300">
                                  {sessionLength && Number(sessionLength) > 0
                                    ? `${sessionLength} hr session`
                                    : "Enter session hours (up to 4)"}
                                </span>

                                <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                              </div>
                            </AccordionTrigger>

                            <AccordionContent>
                              <div className="grid gap-4">
                                <Label
                                  htmlFor="game-union-hours"
                                  className="text-base font-medium"
                                >
                                  Session Hours (Up to 4):
                                </Label>
                                <Input
                                  autoComplete="off"
                                  id="game-union-hours"
                                  type="number"
                                  value={sessionLength}
                                  onChange={(e) => {
                                    setSessionLength(e.target.value);
                                  }}
                                  onBlur={() => {
                                    if (
                                      sessionLength &&
                                      Number(sessionLength) > 0
                                    ) {
                                      setIsTermAccordionOpen(false);
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (
                                      e.key === "Enter" &&
                                      sessionLength &&
                                      Number(sessionLength) > 0
                                    ) {
                                      setIsTermAccordionOpen(false);
                                    }
                                  }}
                                  min="0"
                                  max="4"
                                  step="0.5"
                                  className="max-w-[150px]"
                                  placeholder="e.g., 4"
                                />
                                <EnterHint />
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}

                    {/* Toys & Games */}
                    {selectedSubType === "Toys & Games" && (
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                        <Accordion
                          type="single"
                          collapsible
                          value={isTermAccordionOpen ? "toys-main" : ""}
                          onValueChange={(val) =>
                            setIsTermAccordionOpen(val === "toys-main")
                          }
                          className="w-full"
                        >
                          <AccordionItem value="toys-main">
                            <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                              <span className="text-base font-medium text-slate-200">
                                Toys &amp; Games
                              </span>

                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-300">
                                  {sessionLength && Number(sessionLength) > 0
                                    ? `${sessionLength} hr session`
                                    : "Enter session hours (up to 2)"}
                                </span>

                                <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                              </div>
                            </AccordionTrigger>

                            <AccordionContent>
                              <div className="grid gap-4">
                                <Label
                                  htmlFor="toys-hours"
                                  className="text-base font-medium"
                                >
                                  Session Hours (Up to 2):
                                </Label>
                                <Input
                                  autoComplete="off"
                                  id="toys-hours"
                                  type="number"
                                  value={sessionLength}
                                  onChange={(e) => {
                                    setSessionLength(e.target.value);
                                  }}
                                  onBlur={() => {
                                    if (
                                      sessionLength &&
                                      Number(sessionLength) > 0
                                    ) {
                                      setIsTermAccordionOpen(false);
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (
                                      e.key === "Enter" &&
                                      sessionLength &&
                                      Number(sessionLength) > 0
                                    ) {
                                      setIsTermAccordionOpen(false);
                                    }
                                  }}
                                  min="0"
                                  step="0.5"
                                  className="max-w-[150px]"
                                  placeholder="e.g., 2"
                                />
                                <EnterHint />
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}

                    {/* Toys & Games (Demo/Scratch) */}
                    {selectedSubType === "Toys & Games (Demo/Scratch)" && (
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                        <Accordion
                          type="single"
                          collapsible
                          value={isTermAccordionOpen ? "toys-demo" : ""}
                          onValueChange={(val) =>
                            setIsTermAccordionOpen(val === "toys-demo")
                          }
                          className="w-full"
                        >
                          <AccordionItem value="toys-demo">
                            <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                              <span className="text-base font-medium text-slate-200">
                                Toys &amp; Games (Demo/Scratch)
                              </span>

                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-300">
                                  {sessionLength && Number(sessionLength) > 0
                                    ? `${sessionLength} hr session`
                                    : "Enter session hours"}
                                </span>

                                <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                              </div>
                            </AccordionTrigger>

                            <AccordionContent>
                              <div className="grid gap-4">
                                <Label
                                  htmlFor="toys-demo-hours"
                                  className="text-base font-medium"
                                >
                                  Session Hours:
                                </Label>
                                <Input
                                  autoComplete="off"
                                  id="toys-demo-hours"
                                  type="number"
                                  value={sessionLength}
                                  onChange={(e) => {
                                    setSessionLength(e.target.value);
                                  }}
                                  onBlur={() => {
                                    if (
                                      sessionLength &&
                                      Number(sessionLength) > 0
                                    ) {
                                      setIsTermAccordionOpen(false);
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (
                                      e.key === "Enter" &&
                                      sessionLength &&
                                      Number(sessionLength) > 0
                                    ) {
                                      setIsTermAccordionOpen(false);
                                    }
                                  }}
                                  min="0"
                                  step="0.5"
                                  className="max-w-[150px]"
                                  placeholder="e.g., 1.5"
                                />
                                <EnterHint />
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}

                    {/* Mobile Game Apps (Non-Union Character) */}
                    {selectedSubType ===
                      "Mobile Game Apps (Non-Union Character)" && (
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                        <Accordion
                          type="single"
                          collapsible
                          value={isTermAccordionOpen ? "mobile-nonunion" : ""}
                          onValueChange={(val) =>
                            setIsTermAccordionOpen(val === "mobile-nonunion")
                          }
                          className="w-full"
                        >
                          <AccordionItem value="mobile-nonunion">
                            <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                              <span className="text-base font-medium text-slate-200">
                                Mobile Game Apps (Non-Union Character)
                              </span>

                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-300">
                                  {gameCalcMethod === "per_game"
                                    ? numVoices
                                      ? `Per Game — ${numVoices} voice${
                                          numVoices === 1 ? "" : "s"
                                        }`
                                      : "Per Game — set voices"
                                    : gameCalcMethod === "hourly"
                                    ? sessionLength && Number(sessionLength) > 0
                                      ? `Per Hour — ${sessionLength} hr`
                                      : "Per Hour — set hours"
                                    : "Select method"}
                                </span>

                                <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                              </div>
                            </AccordionTrigger>

                            <AccordionContent>
                              <div className="grid gap-4">
                                <Label className="text-base font-medium">
                                  Select Calculation Method:
                                </Label>
                                <RadioGroup
                                  value={gameCalcMethod ?? ""}
                                  onValueChange={(value) => {
                                    setGameCalcMethod(value);
                                    setSessionLength("");
                                    setNumVoices(1);
                                    // keep open so they can fill details
                                  }}
                                  className="grid gap-2"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                      value="per_game"
                                      id="mobile-game-per-game"
                                    />
                                    <Label
                                      htmlFor="mobile-game-per-game"
                                      className="cursor-pointer"
                                    >
                                      Per Game
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                      value="hourly"
                                      id="mobile-game-hourly"
                                    />
                                    <Label
                                      htmlFor="mobile-game-hourly"
                                      className="cursor-pointer"
                                    >
                                      Per Hour (2 hr min)
                                    </Label>
                                  </div>
                                </RadioGroup>

                                {gameCalcMethod === "per_game" && (
                                  <div className="grid gap-4 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
                                    <Label
                                      htmlFor="mobile-game-voices"
                                      className="text-base font-medium"
                                    >
                                      Number of Voices (Up to 3—4):
                                    </Label>
                                    <Input
                                      autoComplete="off"
                                      id="mobile-game-voices"
                                      type="number"
                                      value={numVoices}
                                      onChange={(e) => {
                                        const next = Math.max(
                                          1,
                                          Number(e.target.value) || 1
                                        );
                                        setNumVoices(next);
                                      }}
                                      onBlur={() => {
                                        if (numVoices >= 1) {
                                          setIsTermAccordionOpen(false);
                                        }
                                      }}
                                      onKeyDown={(e) => {
                                        if (
                                          e.key === "Enter" &&
                                          numVoices >= 1
                                        ) {
                                          setIsTermAccordionOpen(false);
                                        }
                                      }}
                                      min="1"
                                      step="1"
                                      className="max-w-[150px]"
                                    />
                                    <EnterHint />
                                  </div>
                                )}

                                {gameCalcMethod === "hourly" && (
                                  <div className="grid gap-4 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
                                    <Label
                                      htmlFor="mobile-game-hours"
                                      className="text-base font-medium"
                                    >
                                      Session Hours (2 hr min):
                                    </Label>
                                    <Input
                                      autoComplete="off"
                                      id="mobile-game-hours"
                                      type="number"
                                      value={sessionLength}
                                      onChange={(e) => {
                                        setSessionLength(e.target.value);
                                      }}
                                      onBlur={() => {
                                        if (
                                          sessionLength &&
                                          Number(sessionLength) > 0
                                        ) {
                                          setIsTermAccordionOpen(false);
                                        }
                                      }}
                                      onKeyDown={(e) => {
                                        if (
                                          e.key === "Enter" &&
                                          sessionLength &&
                                          Number(sessionLength) > 0
                                        ) {
                                          setIsTermAccordionOpen(false);
                                        }
                                      }}
                                      min="0"
                                      step="0.5"
                                      className="max-w-[150px]"
                                      placeholder="e.g., 2"
                                    />
                                    <EnterHint />
                                  </div>
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}

                    {/* Mobile Game Apps (Union Character) */}
                    {selectedSubType ===
                      "Mobile Game Apps (Union Character)" && (
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                        <Accordion
                          type="single"
                          collapsible
                          value={isTermAccordionOpen ? "mobile-union" : ""}
                          onValueChange={(val) =>
                            setIsTermAccordionOpen(val === "mobile-union")
                          }
                          className="w-full"
                        >
                          <AccordionItem value="mobile-union">
                            <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                              <span className="text-base font-medium text-slate-200">
                                Mobile Game Apps (Union Character)
                              </span>

                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-300">
                                  {sessionLength && Number(sessionLength) > 0
                                    ? `${sessionLength} hr session`
                                    : "Enter session hours (up to 4)"}
                                </span>

                                <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                              </div>
                            </AccordionTrigger>

                            <AccordionContent>
                              <div className="grid gap-4">
                                <Label
                                  htmlFor="mobile-union-hours"
                                  className="text-base font-medium"
                                >
                                  Session Hours (Up to 4):
                                </Label>
                                <Input
                                  autoComplete="off"
                                  id="mobile-union-hours"
                                  type="number"
                                  value={sessionLength}
                                  onChange={(e) => {
                                    setSessionLength(e.target.value);
                                  }}
                                  onBlur={() => {
                                    if (
                                      sessionLength &&
                                      Number(sessionLength) > 0
                                    ) {
                                      setIsTermAccordionOpen(false);
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (
                                      e.key === "Enter" &&
                                      sessionLength &&
                                      Number(sessionLength) > 0
                                    ) {
                                      setIsTermAccordionOpen(false);
                                    }
                                  }}
                                  min="0"
                                  max="4"
                                  step="0.5"
                                  className="max-w-[150px]"
                                  placeholder="e.g., 4"
                                />
                                <EnterHint />
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}

                    {/* Mobile Game Apps (E-Learning/Educational) */}
                    {selectedSubType ===
                      "Mobile Game Apps (E-Learning/Educational)" && (
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                        <Accordion
                          type="single"
                          collapsible
                          value={isTermAccordionOpen ? "mobile-elearn" : ""}
                          onValueChange={(val) =>
                            setIsTermAccordionOpen(val === "mobile-elearn")
                          }
                          className="w-full"
                        >
                          <AccordionItem value="mobile-elearn">
                            <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                              <span className="text-base font-medium text-slate-200">
                                Mobile Game Apps (E-Learning / Educational)
                              </span>

                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-300">
                                  {finishedMinutes &&
                                  Number(finishedMinutes) > 0
                                    ? `${finishedMinutes} finished min`
                                    : "Enter finished minutes"}
                                </span>

                                <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                              </div>
                            </AccordionTrigger>

                            <AccordionContent>
                              <div className="grid gap-4">
                                <Label
                                  htmlFor="mobile-elearn-minutes"
                                  className="text-base font-medium"
                                >
                                  Finished Minutes:
                                </Label>
                                <Input
                                  autoComplete="off"
                                  id="mobile-elearn-minutes"
                                  type="number"
                                  value={finishedMinutes}
                                  onChange={(e) => {
                                    setFinishedMinutes(e.target.value);
                                  }}
                                  onBlur={() => {
                                    if (
                                      finishedMinutes &&
                                      Number(finishedMinutes) > 0
                                    ) {
                                      setIsTermAccordionOpen(false);
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (
                                      e.key === "Enter" &&
                                      finishedMinutes &&
                                      Number(finishedMinutes) > 0
                                    ) {
                                      setIsTermAccordionOpen(false);
                                    }
                                  }}
                                  min="0"
                                  step="1"
                                  className="max-w-[150px]"
                                  placeholder="e.g., 8"
                                />
                                <EnterHint />
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}
                  </div>
                )}

                {/* --- Form for: Promo & Imaging --- */}
                {selectedCategory === "promo_imaging" && (
                  <div className="grid gap-6">
                    {/* TV */}
                    {selectedSubType === "TV" && (
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                        <Accordion
                          type="single"
                          collapsible
                          value={isTermAccordionOpen ? "promo-tv" : ""}
                          onValueChange={(val) =>
                            setIsTermAccordionOpen(val === "promo-tv")
                          }
                          className="w-full"
                        >
                          <AccordionItem value="promo-tv">
                            <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                              <span className="text-base font-medium text-slate-200">
                                TV Promo Market
                              </span>

                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-300">
                                  {selectedPromoMarket || "Select market"}
                                </span>

                                <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                              </div>
                            </AccordionTrigger>

                            <AccordionContent>
                              <div className="grid gap-4">
                                <Label className="text-base font-medium">
                                  Select Market:
                                </Label>
                                <RadioGroup
                                  value={selectedPromoMarket ?? ""}
                                  onValueChange={(value) => {
                                    setSelectedPromoMarket(value);
                                    setIsTermAccordionOpen(false); // close after selection
                                  }}
                                  className="grid gap-2"
                                >
                                  {Object.keys(promoTvRates).map((market) => {
                                    const id = `promo-tv-${market.replace(
                                      /[^a-zA-Z0-9]/g,
                                      ""
                                    )}`;
                                    return (
                                      <div
                                        key={market}
                                        className="flex items-center space-x-2"
                                      >
                                        <RadioGroupItem
                                          value={market}
                                          id={id}
                                        />
                                        <Label
                                          htmlFor={id}
                                          className="cursor-pointer"
                                        >
                                          {market}
                                        </Label>
                                      </div>
                                    );
                                  })}
                                </RadioGroup>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}

                    {/* Radio */}
                    {selectedSubType === "Radio" && (
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                        <Accordion
                          type="single"
                          collapsible
                          value={isTermAccordionOpen ? "promo-radio" : ""}
                          onValueChange={(val) =>
                            setIsTermAccordionOpen(val === "promo-radio")
                          }
                          className="w-full"
                        >
                          <AccordionItem value="promo-radio">
                            <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                              <span className="text-base font-medium text-slate-200">
                                Radio Promo Market
                              </span>

                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-300">
                                  {selectedPromoMarket || "Select market"}
                                </span>

                                <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                              </div>
                            </AccordionTrigger>

                            <AccordionContent>
                              <div className="grid gap-4">
                                <Label className="text-base font-medium">
                                  Select Market:
                                </Label>
                                <RadioGroup
                                  value={selectedPromoMarket ?? ""}
                                  onValueChange={(value) => {
                                    setSelectedPromoMarket(value);
                                    setIsTermAccordionOpen(false);
                                  }}
                                  className="grid gap-2"
                                >
                                  {Object.keys(promoRadioRates).map(
                                    (market) => {
                                      const id = `promo-radio-${market.replace(
                                        /[^a-zA-Z0-9]/g,
                                        ""
                                      )}`;
                                      return (
                                        <div
                                          key={market}
                                          className="flex items-center space-x-2"
                                        >
                                          <RadioGroupItem
                                            value={market}
                                            id={id}
                                          />
                                          <Label
                                            htmlFor={id}
                                            className="cursor-pointer"
                                          >
                                            {market}
                                          </Label>
                                        </div>
                                      );
                                    }
                                  )}
                                </RadioGroup>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}

                    {/* Trailers */}
                    {selectedSubType === "Trailers" && (
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                        <Accordion
                          type="single"
                          collapsible
                          value={isTermAccordionOpen ? "promo-trailers" : ""}
                          onValueChange={(val) =>
                            setIsTermAccordionOpen(val === "promo-trailers")
                          }
                          className="w-full"
                        >
                          <AccordionItem value="promo-trailers">
                            <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                              <span className="text-base font-medium text-slate-200">
                                Trailer Market
                              </span>

                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-300">
                                  {selectedPromoMarket || "Select market"}
                                </span>

                                <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                              </div>
                            </AccordionTrigger>

                            <AccordionContent>
                              <div className="grid gap-4">
                                <Label className="text-base font-medium">
                                  Select Market:
                                </Label>
                                <RadioGroup
                                  value={selectedPromoMarket ?? ""}
                                  onValueChange={(value) => {
                                    setSelectedPromoMarket(value);
                                    setIsTermAccordionOpen(false);
                                  }}
                                  className="grid gap-2"
                                >
                                  {Object.keys(promoTrailerRates).map(
                                    (market) => {
                                      const id = `promo-trailer-${market.replace(
                                        /[^a-zA-Z0-9]/g,
                                        ""
                                      )}`;
                                      return (
                                        <div
                                          key={market}
                                          className="flex items-center space-x-2"
                                        >
                                          <RadioGroupItem
                                            value={market}
                                            id={id}
                                          />
                                          <Label
                                            htmlFor={id}
                                            className="cursor-pointer"
                                          >
                                            {market}
                                          </Label>
                                        </div>
                                      );
                                    }
                                  )}
                                </RadioGroup>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}
                  </div>
                )}

                {/* --- Form for: Audiobooks --- */}
                {selectedCategory === "audiobooks" && (
                  <div className="grid gap-6">
                    {/* Union Scale — PFH */}
                    {selectedSubType === "Union Scale — PFH" && (
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                        <Accordion
                          type="single"
                          collapsible
                          value={isTermAccordionOpen ? "ab-union-pfh" : ""}
                          onValueChange={(val) =>
                            setIsTermAccordionOpen(val === "ab-union-pfh")
                          }
                          className="w-full"
                        >
                          <AccordionItem value="ab-union-pfh">
                            <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                              <span className="text-base font-medium text-slate-200">
                                Union Scale — PFH
                              </span>

                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-300">
                                  {finishedHours && Number(finishedHours) > 0
                                    ? `${finishedHours} finished hr`
                                    : "Enter PFH amount"}
                                </span>

                                <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                              </div>
                            </AccordionTrigger>

                            <AccordionContent>
                              <div className="grid gap-4">
                                <Label
                                  htmlFor="audiobook-pfh-union"
                                  className="text-base font-medium"
                                >
                                  Enter Per Finished Hour (PFH):
                                </Label>
                                <Input
                                  autoComplete="off"
                                  id="audiobook-pfh-union"
                                  type="number"
                                  value={finishedHours}
                                  onChange={(e) => {
                                    setFinishedHours(e.target.value);
                                  }}
                                  onBlur={() => {
                                    if (
                                      finishedHours &&
                                      Number(finishedHours) > 0
                                    ) {
                                      setIsTermAccordionOpen(false);
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (
                                      e.key === "Enter" &&
                                      finishedHours &&
                                      Number(finishedHours) > 0
                                    ) {
                                      setIsTermAccordionOpen(false);
                                    }
                                  }}
                                  min="0"
                                  step="0.5"
                                  className="max-w-[150px]"
                                  placeholder="e.g., 8.5"
                                />
                                <EnterHint />
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}

                    {/* Non-Union — PFH */}
                    {selectedSubType === "Non-Union — PFH" && (
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                        <Accordion
                          type="single"
                          collapsible
                          value={isTermAccordionOpen ? "ab-nonunion-pfh" : ""}
                          onValueChange={(val) =>
                            setIsTermAccordionOpen(val === "ab-nonunion-pfh")
                          }
                          className="w-full"
                        >
                          <AccordionItem value="ab-nonunion-pfh">
                            <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                              <span className="text-base font-medium text-slate-200">
                                Non-Union — PFH
                              </span>

                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-300">
                                  {finishedHours && Number(finishedHours) > 0
                                    ? `${finishedHours} finished hr`
                                    : "Enter PFH amount"}
                                </span>

                                <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                              </div>
                            </AccordionTrigger>

                            <AccordionContent>
                              <div className="grid gap-4">
                                <Label
                                  htmlFor="audiobook-pfh-nonunion"
                                  className="text-base font-medium"
                                >
                                  Enter Per Finished Hour (PFH):
                                </Label>
                                <Input
                                  autoComplete="off"
                                  id="audiobook-pfh-nonunion"
                                  type="number"
                                  value={finishedHours}
                                  onChange={(e) => {
                                    setFinishedHours(e.target.value);
                                  }}
                                  onBlur={() => {
                                    if (
                                      finishedHours &&
                                      Number(finishedHours) > 0
                                    ) {
                                      setIsTermAccordionOpen(false);
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (
                                      e.key === "Enter" &&
                                      finishedHours &&
                                      Number(finishedHours) > 0
                                    ) {
                                      setIsTermAccordionOpen(false);
                                    }
                                  }}
                                  min="0"
                                  step="0.5"
                                  className="max-w-[150px]"
                                  placeholder="e.g., 8.5"
                                />
                                <EnterHint />
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}

                    {/* Hybrid Agreement */}
                    {selectedSubType === "Hybrid Agreement" && (
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                        <Accordion
                          type="single"
                          collapsible
                          value={isTermAccordionOpen ? "ab-hybrid-pfh" : ""}
                          onValueChange={(val) =>
                            setIsTermAccordionOpen(val === "ab-hybrid-pfh")
                          }
                          className="w-full"
                        >
                          <AccordionItem value="ab-hybrid-pfh">
                            <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                              <span className="text-base font-medium text-slate-200">
                                Hybrid Agreement
                              </span>

                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-300">
                                  {finishedHours && Number(finishedHours) > 0
                                    ? `${finishedHours} finished hr`
                                    : "Enter PFH amount"}
                                </span>

                                <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                              </div>
                            </AccordionTrigger>

                            <AccordionContent>
                              <div className="grid gap-4">
                                <Label
                                  htmlFor="audiobook-pfh-hybrid"
                                  className="text-base font-medium"
                                >
                                  Enter Per Finished Hour (PFH):
                                </Label>
                                <Input
                                  autoComplete="off"
                                  id="audiobook-pfh-hybrid"
                                  type="number"
                                  value={finishedHours}
                                  onChange={(e) => {
                                    setFinishedHours(e.target.value);
                                  }}
                                  onBlur={() => {
                                    if (
                                      finishedHours &&
                                      Number(finishedHours) > 0
                                    ) {
                                      setIsTermAccordionOpen(false);
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (
                                      e.key === "Enter" &&
                                      finishedHours &&
                                      Number(finishedHours) > 0
                                    ) {
                                      setIsTermAccordionOpen(false);
                                    }
                                  }}
                                  min="0"
                                  step="0.5"
                                  className="max-w-[150px]"
                                  placeholder="e.g., 8.5"
                                />
                                <EnterHint />
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}

                    {/* Per RAW Hour */}
                    {selectedSubType === "Per RAW Hour" && (
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                        <Accordion
                          type="single"
                          collapsible
                          value={isTermAccordionOpen ? "ab-raw-hour" : ""}
                          onValueChange={(val) =>
                            setIsTermAccordionOpen(val === "ab-raw-hour")
                          }
                          className="w-full"
                        >
                          <AccordionItem value="ab-raw-hour">
                            <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                              <span className="text-base font-medium text-slate-200">
                                Per RAW Hour
                              </span>

                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-300">
                                  {numberOfHours
                                    ? `${numberOfHours} hour${
                                        numberOfHours === 1 ? "" : "s"
                                      }`
                                    : "Enter hours"}
                                </span>

                                <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                              </div>
                            </AccordionTrigger>

                            <AccordionContent>
                              <div className="grid gap-4">
                                <Label
                                  htmlFor="audiobook-raw"
                                  className="text-base font-medium"
                                >
                                  Enter Hours:
                                </Label>
                                <Input
                                  autoComplete="off"
                                  id="audiobook-raw"
                                  type="number"
                                  value={numberOfHours}
                                  onChange={(e) => {
                                    const next = Math.max(
                                      1,
                                      Number(e.target.value) || 1
                                    );
                                    setNumberOfHours(next);
                                  }}
                                  onBlur={() => {
                                    if (numberOfHours >= 1) {
                                      setIsTermAccordionOpen(false);
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (
                                      e.key === "Enter" &&
                                      numberOfHours >= 1
                                    ) {
                                      setIsTermAccordionOpen(false);
                                    }
                                  }}
                                  min="1"
                                  step="0.5"
                                  className="max-w-[150px]"
                                />
                                <EnterHint />
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}

                    {/* Production Add-On */}
                    {selectedSubType === "Production Add-On" && (
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                        <Accordion
                          type="single"
                          collapsible
                          value={
                            isTermAccordionOpen ? "ab-production-addon" : ""
                          }
                          onValueChange={(val) =>
                            setIsTermAccordionOpen(
                              val === "ab-production-addon"
                            )
                          }
                          className="w-full"
                        >
                          <AccordionItem value="ab-production-addon">
                            <AccordionTrigger className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#1F2937]">
                              <span className="text-base font-medium text-slate-200">
                                Production Add-On
                              </span>

                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-300">
                                  {numberOfHours
                                    ? `${numberOfHours} hour${
                                        numberOfHours === 1 ? "" : "s"
                                      }`
                                    : "Enter hours"}
                                </span>

                                <ChevronDown className="h-4 w-4 text-slate-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                              </div>
                            </AccordionTrigger>

                            <AccordionContent>
                              <div className="grid gap-4">
                                <Label
                                  htmlFor="audiobook-prod-hours"
                                  className="text-base font-medium"
                                >
                                  Enter Hours:
                                </Label>
                                <Input
                                  autoComplete="off"
                                  id="audiobook-prod-hours"
                                  type="number"
                                  value={numberOfHours}
                                  onChange={(e) => {
                                    const next = Math.max(
                                      1,
                                      Number(e.target.value) || 1
                                    );
                                    setNumberOfHours(next);
                                  }}
                                  onBlur={() => {
                                    if (numberOfHours >= 1) {
                                      setIsTermAccordionOpen(false);
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (
                                      e.key === "Enter" &&
                                      numberOfHours >= 1
                                    ) {
                                      setIsTermAccordionOpen(false);
                                    }
                                  }}
                                  min="1"
                                  step="0.5"
                                  className="max-w-[150px]"
                                />
                                <EnterHint />
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}
                  </div>
                )}

                {/* --- Form for: IVR / Message-on-Hold --- */}
                {selectedCategory === "ivr_message_on_hold" && (
                  <div className="grid gap-6">
                    {/* --- Inputs for: Direct Quote --- */}
                    {selectedSubType === "Direct Quote" && (
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                        <Accordion
                          type="single"
                          collapsible
                          value={isTermAccordionOpen ? "ivr-direct-quote" : ""}
                          onValueChange={(val) =>
                            setIsTermAccordionOpen(val === "ivr-direct-quote")
                          }
                          className="w-full"
                        >
                          <AccordionItem value="ivr-direct-quote">
                            <AccordionTrigger
                              className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl
             bg-[#1E293B] border border-[#1F2937]"
                            >
                              <span className="text-base font-medium text-slate-200">
                                Direct Quote Calculation Model
                              </span>

                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-300">
                                  {selectedIvrModel === "ivr_min"
                                    ? "IVR (Suggested Minimum)"
                                    : selectedIvrModel === "ivr_prompt"
                                    ? numPrompts > 0
                                      ? `IVR Per Prompt — ${numPrompts} prompt${
                                          numPrompts === 1 ? "" : "s"
                                        }`
                                      : "IVR Per Prompt — set prompts"
                                    : selectedIvrModel === "ivr_word"
                                    ? wordCount > 0
                                      ? `IVR Per Word — ${wordCount} words`
                                      : "IVR Per Word — set word count"
                                    : selectedIvrModel === "ivr_hour"
                                    ? numberOfHours
                                      ? `IVR Per Hour — ${numberOfHours} hr`
                                      : "IVR Per Hour — set hours"
                                    : selectedIvrModel === "moh_min"
                                    ? "MOH (Minimum)"
                                    : selectedIvrModel === "moh_min_rate"
                                    ? finishedMinutes &&
                                      Number(finishedMinutes) > 0
                                      ? `MOH Per Minute — ${finishedMinutes} min`
                                      : "MOH Per Minute — set minutes"
                                    : selectedIvrModel === "moh_para"
                                    ? numParagraphs > 0
                                      ? `MOH Per Paragraph — ${numParagraphs} paragraph${
                                          numParagraphs === 1 ? "" : "s"
                                        }`
                                      : "MOH Per Paragraph — set count"
                                    : "Select calculation model"}
                                </span>

                                <ChevronDown
                                  className="h-4 w-4 text-slate-300 transition-transform duration-200
                 group-data-[state=open]:rotate-180"
                                />
                              </div>
                            </AccordionTrigger>

                            <AccordionContent>
                              <div className="grid gap-6">
                                <div className="grid gap-4">
                                  <Label className="text-base font-medium">
                                    Select Calculation Model:
                                  </Label>
                                  <RadioGroup
                                    value={selectedIvrModel ?? ""}
                                    onValueChange={(value) => {
                                      setSelectedIvrModel(value);
                                      // reset all dependent fields
                                      setNumPrompts(0);
                                      setWordCount(0);
                                      setNumberOfHours(1);
                                      setFinishedMinutes("");
                                      setNumParagraphs(0);

                                      // Models with no extra inputs can close immediately
                                      if (
                                        value === "ivr_min" ||
                                        value === "moh_min"
                                      ) {
                                        setIsTermAccordionOpen(false);
                                      }
                                    }}
                                    className="grid gap-2"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="ivr_min"
                                        id="ivr-min"
                                      />
                                      <Label
                                        htmlFor="ivr-min"
                                        className="cursor-pointer"
                                      >
                                        IVR (Suggested Minimum)
                                      </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="ivr_prompt"
                                        id="ivr-prompt"
                                      />
                                      <Label
                                        htmlFor="ivr-prompt"
                                        className="cursor-pointer"
                                      >
                                        IVR (Per Prompt)
                                      </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="ivr_word"
                                        id="ivr-word"
                                      />
                                      <Label
                                        htmlFor="ivr-word"
                                        className="cursor-pointer"
                                      >
                                        IVR (Per Word — RAW)
                                      </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="ivr_hour"
                                        id="ivr-hour"
                                      />
                                      <Label
                                        htmlFor="ivr-hour"
                                        className="cursor-pointer"
                                      >
                                        IVR (Per Hour — RAW)
                                      </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="moh_min"
                                        id="moh-min"
                                      />
                                      <Label
                                        htmlFor="moh-min"
                                        className="cursor-pointer"
                                      >
                                        Message-On-Hold (Minimum)
                                      </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="moh_min_rate"
                                        id="moh-min-rate"
                                      />
                                      <Label
                                        htmlFor="moh-min-rate"
                                        className="cursor-pointer"
                                      >
                                        Message-On-Hold (Per Minute)
                                      </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="moh_para"
                                        id="moh-para"
                                      />
                                      <Label
                                        htmlFor="moh-para"
                                        className="cursor-pointer"
                                      >
                                        Message-On-Hold (Per Paragraph)
                                      </Label>
                                    </div>
                                  </RadioGroup>
                                </div>

                                {/* Conditional Inputs for Direct Quote */}
                                {selectedIvrModel === "ivr_prompt" && (
                                  <div className="grid gap-4 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
                                    <Label
                                      htmlFor="ivr-prompts"
                                      className="text-base font-medium"
                                    >
                                      Enter Number of Prompts:
                                    </Label>
                                    <Input
                                      id="ivr-prompts"
                                      type="number"
                                      value={numPrompts > 0 ? numPrompts : ""}
                                      onChange={(e) =>
                                        setNumPrompts(
                                          Math.max(
                                            0,
                                            Number(e.target.value) || 0
                                          )
                                        )
                                      }
                                      onBlur={() => {
                                        if (numPrompts > 0) {
                                          setIsTermAccordionOpen(false);
                                        }
                                      }}
                                      onKeyDown={(e) => {
                                        if (
                                          e.key === "Enter" &&
                                          numPrompts > 0
                                        ) {
                                          setIsTermAccordionOpen(false);
                                        }
                                      }}
                                      min="0"
                                      className="max-w-[150px]"
                                      placeholder="e.g., 10"
                                      autoComplete="off"
                                    />
                                    <EnterHint />
                                  </div>
                                )}

                                {selectedIvrModel === "ivr_word" && (
                                  <div className="grid gap-4 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
                                    <Label
                                      htmlFor="ivr-wordcount"
                                      className="text-base font-medium"
                                    >
                                      Enter Word Count:
                                    </Label>
                                    <Input
                                      id="ivr-wordcount"
                                      type="number"
                                      value={wordCount > 0 ? wordCount : ""}
                                      onChange={(e) =>
                                        setWordCount(
                                          Math.max(
                                            0,
                                            Number(e.target.value) || 0
                                          )
                                        )
                                      }
                                      onBlur={() => {
                                        if (wordCount > 0) {
                                          setIsTermAccordionOpen(false);
                                        }
                                      }}
                                      onKeyDown={(e) => {
                                        if (
                                          e.key === "Enter" &&
                                          wordCount > 0
                                        ) {
                                          setIsTermAccordionOpen(false);
                                        }
                                      }}
                                      min="0"
                                      className="max-w-[150px]"
                                      placeholder="e.g., 500"
                                      autoComplete="off"
                                    />
                                    <EnterHint />
                                  </div>
                                )}

                                {selectedIvrModel === "ivr_hour" && (
                                  <div className="grid gap-4 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
                                    <Label
                                      htmlFor="ivr-hours"
                                      className="text-base font-medium"
                                    >
                                      Enter Raw Hours:
                                    </Label>
                                    <Input
                                      id="ivr-hours"
                                      type="number"
                                      value={numberOfHours}
                                      onChange={(e) =>
                                        setNumberOfHours(
                                          Math.max(
                                            1,
                                            Number(e.target.value) || 1
                                          )
                                        )
                                      }
                                      onBlur={() => {
                                        if (numberOfHours >= 1) {
                                          setIsTermAccordionOpen(false);
                                        }
                                      }}
                                      onKeyDown={(e) => {
                                        if (
                                          e.key === "Enter" &&
                                          numberOfHours >= 1
                                        ) {
                                          setIsTermAccordionOpen(false);
                                        }
                                      }}
                                      min="1"
                                      step="0.5"
                                      className="max-w-[150px]"
                                      autoComplete="off"
                                    />
                                    <EnterHint />
                                  </div>
                                )}

                                {selectedIvrModel === "moh_min_rate" && (
                                  <div className="grid gap-4 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
                                    <Label
                                      htmlFor="moh-minutes"
                                      className="text-base font-medium"
                                    >
                                      Enter Finished Minutes:
                                    </Label>
                                    <Input
                                      id="moh-minutes"
                                      type="number"
                                      value={finishedMinutes}
                                      onChange={(e) =>
                                        setFinishedMinutes(e.target.value)
                                      }
                                      onBlur={() => {
                                        if (
                                          finishedMinutes &&
                                          Number(finishedMinutes) > 0
                                        ) {
                                          setIsTermAccordionOpen(false);
                                        }
                                      }}
                                      onKeyDown={(e) => {
                                        if (
                                          e.key === "Enter" &&
                                          finishedMinutes &&
                                          Number(finishedMinutes) > 0
                                        ) {
                                          setIsTermAccordionOpen(false);
                                        }
                                      }}
                                      min="0"
                                      step="0.5"
                                      className="max-w-[150px]"
                                      placeholder="e.g., 5"
                                      autoComplete="off"
                                    />
                                    <EnterHint />
                                  </div>
                                )}

                                {selectedIvrModel === "moh_para" && (
                                  <div className="grid gap-4 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
                                    <Label
                                      htmlFor="moh-paras"
                                      className="text-base font-medium"
                                    >
                                      Enter Number of Paragraphs:
                                    </Label>
                                    <Input
                                      id="moh-paras"
                                      type="number"
                                      value={
                                        numParagraphs > 0 ? numParagraphs : ""
                                      }
                                      onChange={(e) =>
                                        setNumParagraphs(
                                          Math.max(
                                            0,
                                            Number(e.target.value) || 0
                                          )
                                        )
                                      }
                                      onBlur={() => {
                                        if (numParagraphs > 0) {
                                          setIsTermAccordionOpen(false);
                                        }
                                      }}
                                      onKeyDown={(e) => {
                                        if (
                                          e.key === "Enter" &&
                                          numParagraphs > 0
                                        ) {
                                          setIsTermAccordionOpen(false);
                                        }
                                      }}
                                      min="0"
                                      className="max-w-[150px]"
                                      placeholder="e.g., 4"
                                      autoComplete="off"
                                    />
                                    <EnterHint />
                                  </div>
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}

                    {/* --- Inputs for: Roster Talent --- */}
                    {selectedSubType === "Roster Talent" && (
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                        <Accordion
                          type="single"
                          collapsible
                          value={isTermAccordionOpen ? "ivr-roster" : ""}
                          onValueChange={(val) =>
                            setIsTermAccordionOpen(val === "ivr-roster")
                          }
                          className="w-full"
                        >
                          <AccordionItem value="ivr-roster">
                            <AccordionTrigger
                              className="group cursor-pointer flex justify-between items-center w-full px-4 py-3 rounded-xl
             bg-[#1E293B] border border-[#1F2937]"
                            >
                              <span className="text-base font-medium text-slate-200">
                                Roster Talent Model
                              </span>

                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-300">
                                  {selectedRosterModel === "prod_house"
                                    ? numParagraphs > 0
                                      ? `Prod House — ${numParagraphs} paragraph${
                                          numParagraphs === 1 ? "" : "s"
                                        }`
                                      : "Prod House — set paragraphs"
                                    : selectedRosterModel === "other_hourly"
                                    ? numberOfHours
                                      ? `Other — ${numberOfHours} hr`
                                      : "Other — set booth hours"
                                    : "Select roster model"}
                                </span>

                                <ChevronDown
                                  className="h-4 w-4 text-slate-300 transition-transform duration-200
                 group-data-[state=open]:rotate-180"
                                />
                              </div>
                            </AccordionTrigger>

                            <AccordionContent>
                              <div className="grid gap-6">
                                <div className="grid gap-4">
                                  <Label className="text-base font-medium">
                                    Select Roster Model:
                                  </Label>
                                  <RadioGroup
                                    value={selectedRosterModel ?? ""}
                                    onValueChange={(value) => {
                                      setSelectedRosterModel(value);
                                      setNumParagraphs(0);
                                      setNumberOfHours(0.5);
                                    }}
                                    className="grid gap-2"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="prod_house"
                                        id="roster-prod"
                                      />
                                      <Label
                                        htmlFor="roster-prod"
                                        className="cursor-pointer"
                                      >
                                        Production House (Per Paragraph)
                                      </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="other_hourly"
                                        id="roster-other"
                                      />
                                      <Label
                                        htmlFor="roster-other"
                                        className="cursor-pointer"
                                      >
                                        Other (Per 1/2 Hour Booth Time)
                                      </Label>
                                    </div>
                                  </RadioGroup>
                                </div>

                                {/* Conditional Inputs for Roster Talent */}
                                {selectedRosterModel === "prod_house" && (
                                  <div className="grid gap-4 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
                                    <Label
                                      htmlFor="roster-paras"
                                      className="text-base font-medium"
                                    >
                                      Enter Number of Paragraphs:
                                    </Label>
                                    <Input
                                      id="roster-paras"
                                      type="number"
                                      value={
                                        numParagraphs > 0 ? numParagraphs : ""
                                      }
                                      onChange={(e) =>
                                        setNumParagraphs(
                                          Math.max(
                                            0,
                                            Number(e.target.value) || 0
                                          )
                                        )
                                      }
                                      onBlur={() => {
                                        if (numParagraphs > 0) {
                                          setIsTermAccordionOpen(false);
                                        }
                                      }}
                                      onKeyDown={(e) => {
                                        if (
                                          e.key === "Enter" &&
                                          numParagraphs > 0
                                        ) {
                                          setIsTermAccordionOpen(false);
                                        }
                                      }}
                                      min="0"
                                      className="max-w-[150px]"
                                      placeholder="e.g., 20"
                                      autoComplete="off"
                                    />
                                    <EnterHint />
                                  </div>
                                )}

                                {selectedRosterModel === "other_hourly" && (
                                  <div className="grid gap-4 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
                                    <Label
                                      htmlFor="roster-hours"
                                      className="text-base font-medium"
                                    >
                                      Enter Total Booth Hours:
                                    </Label>
                                    <Input
                                      id="roster-hours"
                                      type="number"
                                      value={numberOfHours}
                                      onChange={(e) =>
                                        setNumberOfHours(
                                          Math.max(
                                            0.5,
                                            Number(e.target.value) || 0.5
                                          )
                                        )
                                      }
                                      onBlur={() => {
                                        if (numberOfHours >= 0.5) {
                                          setIsTermAccordionOpen(false);
                                        }
                                      }}
                                      onKeyDown={(e) => {
                                        if (
                                          e.key === "Enter" &&
                                          numberOfHours >= 0.5
                                        ) {
                                          setIsTermAccordionOpen(false);
                                        }
                                      }}
                                      min="0.5"
                                      step="0.5"
                                      className="max-w-[150px]"
                                      placeholder="e.g., 1.5"
                                      autoComplete="off"
                                    />
                                    <EnterHint />
                                  </div>
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}
                  </div>
                )}

                {/* --- Form for: Cinema / Events --- */}
                {selectedCategory === "cinema_events" && (
                  <div className="grid gap-6">
                    {/* --- Inputs for: Cinema Usage (1—3 States) --- */}
                    {selectedSubType === "Cinema Usage — Term (1—3 States)" && (
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                        <Accordion
                          type="single"
                          collapsible
                          value={isTermAccordionOpen ? "cinema-1-3" : ""}
                          onValueChange={(val) =>
                            setIsTermAccordionOpen(val === "cinema-1-3")
                          }
                          className="w-full"
                        >
                          <AccordionItem value="cinema-1-3">
                            <AccordionTrigger
                              className="group cursor-pointer flex justify-between items-center w-full px-4 py-3
             rounded-xl bg-[#1E293B] border border-[#1F2937]"
                            >
                              <span className="text-base font-medium text-slate-200">
                                Cinema Usage — Term (1–3 States)
                              </span>

                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-300">
                                  {selectedTerm || "Select term"}
                                </span>

                                <ChevronDown
                                  className="h-4 w-4 text-slate-300 transition-transform duration-200
                 group-data-[state=open]:rotate-180"
                                />
                              </div>
                            </AccordionTrigger>

                            <AccordionContent>
                              <div className="grid gap-4">
                                <Label className="text-base font-medium">
                                  Select Term:
                                </Label>
                                <RadioGroup
                                  value={selectedTerm ?? ""}
                                  onValueChange={(value) => {
                                    setSelectedTerm(value);
                                    setIsTermAccordionOpen(false); // close after choice
                                  }}
                                  className="grid gap-2"
                                >
                                  {Object.keys(cinemaRates1to3States).map(
                                    (term) => {
                                      const id = `cinema-1-3-${term.replace(
                                        /[^a-zA-Z0-9]/g,
                                        ""
                                      )}`;
                                      return (
                                        <div
                                          key={term}
                                          className="flex items-center space-x-2"
                                        >
                                          <RadioGroupItem
                                            value={term}
                                            id={id}
                                          />
                                          <Label
                                            htmlFor={id}
                                            className="cursor-pointer"
                                          >
                                            {term}
                                          </Label>
                                        </div>
                                      );
                                    }
                                  )}
                                </RadioGroup>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}

                    {/* --- Inputs for: Cinema Usage (4+ States) --- */}
                    {selectedSubType === "Cinema Usage — Term (4+ States)" && (
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                        <Accordion
                          type="single"
                          collapsible
                          value={isTermAccordionOpen ? "cinema-4-plus" : ""}
                          onValueChange={(val) =>
                            setIsTermAccordionOpen(val === "cinema-4-plus")
                          }
                          className="w-full"
                        >
                          <AccordionItem value="cinema-4-plus">
                            <AccordionTrigger
                              className="group cursor-pointer flex justify-between items-center w-full px-4 py-3
             rounded-xl bg-[#1E293B] border border-[#1F2937]"
                            >
                              <span className="text-base font-medium text-slate-200">
                                Cinema Usage — Term (4+ States)
                              </span>

                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-300">
                                  {selectedTerm || "Select term"}
                                </span>

                                <ChevronDown
                                  className="h-4 w-4 text-slate-300 transition-transform duration-200
                 group-data-[state=open]:rotate-180"
                                />
                              </div>
                            </AccordionTrigger>

                            <AccordionContent>
                              <div className="grid gap-4">
                                <Label className="text-base font-medium">
                                  Select Term:
                                </Label>
                                <RadioGroup
                                  value={selectedTerm ?? ""}
                                  onValueChange={(value) => {
                                    setSelectedTerm(value);
                                    setIsTermAccordionOpen(false);
                                  }}
                                  className="grid gap-2"
                                >
                                  {Object.keys(cinemaRates4PlusStates).map(
                                    (term) => {
                                      const id = `cinema-4-plus-${term.replace(
                                        /[^a-zA-Z0-9]/g,
                                        ""
                                      )}`;
                                      return (
                                        <div
                                          key={term}
                                          className="flex items-center space-x-2"
                                        >
                                          <RadioGroupItem
                                            value={term}
                                            id={id}
                                          />
                                          <Label
                                            htmlFor={id}
                                            className="cursor-pointer"
                                          >
                                            {term}
                                          </Label>
                                        </div>
                                      );
                                    }
                                  )}
                                </RadioGroup>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}

                    {/* --- Inputs for: Event Video --- */}
                    {selectedSubType === "Event Video" && (
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                        <Accordion
                          type="single"
                          collapsible
                          value={isTermAccordionOpen ? "event-video" : ""}
                          onValueChange={(val) =>
                            setIsTermAccordionOpen(val === "event-video")
                          }
                          className="w-full"
                        >
                          <AccordionItem value="event-video">
                            <AccordionTrigger
                              className="group cursor-pointer flex justify-between items-center w-full px-4 py-3
             rounded-xl bg-[#1E293B] border border-[#1F2937]"
                            >
                              <span className="text-base font-medium text-slate-200">
                                Event Video
                              </span>

                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-300">
                                  {selectedTerm
                                    ? numberOfHours
                                      ? `${selectedTerm} — ${numberOfHours} hr${
                                          numberOfHours === 1 ? "" : "s"
                                        }`
                                      : `${selectedTerm} — set hours`
                                    : "Select term and hours"}
                                </span>

                                <ChevronDown
                                  className="h-4 w-4 text-slate-300 transition-transform duration-200
                 group-data-[state=open]:rotate-180"
                                />
                              </div>
                            </AccordionTrigger>

                            <AccordionContent>
                              <div className="grid gap-6">
                                <div className="grid gap-4">
                                  <Label className="text-base font-medium">
                                    Select Term:
                                  </Label>
                                  <RadioGroup
                                    value={selectedTerm ?? ""}
                                    onValueChange={(value) => {
                                      setSelectedTerm(value);
                                      // don't auto-close; user still needs hours
                                    }}
                                    className="grid gap-2"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="1 Year"
                                        id="event-1y"
                                      />
                                      <Label htmlFor="event-1y">1 Year</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="Full Buyout"
                                        id="event-buyout"
                                      />
                                      <Label htmlFor="event-buyout">
                                        Full Buyout
                                      </Label>
                                    </div>
                                  </RadioGroup>
                                </div>

                                <div className="grid gap-4">
                                  <Label
                                    htmlFor="event-hours"
                                    className="text-base font-medium"
                                  >
                                    Enter Total Hours:
                                  </Label>
                                  <Input
                                    id="event-hours"
                                    type="number"
                                    value={numberOfHours}
                                    onChange={(e) =>
                                      setNumberOfHours(
                                        Math.max(1, Number(e.target.value) || 1)
                                      )
                                    }
                                    onBlur={() => {
                                      if (numberOfHours >= 1 && selectedTerm) {
                                        setIsTermAccordionOpen(false);
                                      }
                                    }}
                                    onKeyDown={(e) => {
                                      if (
                                        e.key === "Enter" &&
                                        numberOfHours >= 1 &&
                                        selectedTerm
                                      ) {
                                        setIsTermAccordionOpen(false);
                                      }
                                    }}
                                    min="1"
                                    step="0.5"
                                    className="max-w-[150px]"
                                    autoComplete="off"
                                  />
                                  <EnterHint />
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}

                    {/* --- Inputs for: Trade Shows / Sporting Events --- */}
                    {selectedSubType === "Trade Shows / Sporting Events" && (
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                        <Accordion
                          type="single"
                          collapsible
                          value={isTermAccordionOpen ? "trade-events" : ""}
                          onValueChange={(val) =>
                            setIsTermAccordionOpen(val === "trade-events")
                          }
                          className="w-full"
                        >
                          <AccordionItem value="trade-events">
                            <AccordionTrigger
                              className="group cursor-pointer flex justify-between items-center w-full px-4 py-3
             rounded-xl bg-[#1E293B] border border-[#1F2937]"
                            >
                              <span className="text-base font-medium text-slate-200">
                                Trade Shows / Sporting Events
                              </span>

                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-300">
                                  {selectedTerm
                                    ? numberOfHours
                                      ? `${selectedTerm} — ${numberOfHours} hr${
                                          numberOfHours === 1 ? "" : "s"
                                        }`
                                      : `${selectedTerm} — set hours`
                                    : "Select term and hours"}
                                </span>

                                <ChevronDown
                                  className="h-4 w-4 text-slate-300 transition-transform duration-200
                 group-data-[state=open]:rotate-180"
                                />
                              </div>
                            </AccordionTrigger>

                            <AccordionContent>
                              <div className="grid gap-6">
                                <div className="grid gap-4">
                                  <Label className="text-base font-medium">
                                    Select Term:
                                  </Label>
                                  <RadioGroup
                                    value={selectedTerm ?? ""}
                                    onValueChange={(value) => {
                                      setSelectedTerm(value);
                                    }}
                                    className="grid gap-2"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="1 Year"
                                        id="trade-1y"
                                      />
                                      <Label htmlFor="trade-1y">1 Year</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="Full Buyout"
                                        id="trade-buyout"
                                      />
                                      <Label htmlFor="trade-buyout">
                                        Full Buyout
                                      </Label>
                                    </div>
                                  </RadioGroup>
                                </div>

                                <div className="grid gap-4">
                                  <Label
                                    htmlFor="trade-hours"
                                    className="text-base font-medium"
                                  >
                                    Enter Total Hours:
                                  </Label>
                                  <Input
                                    id="trade-hours"
                                    type="number"
                                    value={numberOfHours}
                                    onChange={(e) =>
                                      setNumberOfHours(
                                        Math.max(1, Number(e.target.value) || 1)
                                      )
                                    }
                                    onBlur={() => {
                                      if (numberOfHours >= 1 && selectedTerm) {
                                        setIsTermAccordionOpen(false);
                                      }
                                    }}
                                    onKeyDown={(e) => {
                                      if (
                                        e.key === "Enter" &&
                                        numberOfHours >= 1 &&
                                        selectedTerm
                                      ) {
                                        setIsTermAccordionOpen(false);
                                      }
                                    }}
                                    min="1"
                                    step="0.5"
                                    className="max-w-[150px]"
                                    autoComplete="off"
                                  />
                                  <EnterHint />
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}
                  </div>
                )}

                {/* --- Form for: Fees / Pick-Ups / Editing --- */}
                {selectedCategory === "fees_pickups_editing" && (
                  <div className="grid gap-6">
                    {/* --- Studio Fees & Editing --- */}
                    {selectedSubType === "Studio Fees & Editing" && (
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                        <Accordion
                          type="single"
                          collapsible
                          value={isTermAccordionOpen ? "fees-studio" : ""}
                          onValueChange={(val) =>
                            setIsTermAccordionOpen(val === "fees-studio")
                          }
                          className="w-full"
                        >
                          <AccordionItem value="fees-studio">
                            <AccordionTrigger
                              className="group cursor-pointer flex justify-between items-center w-full px-4 py-3
             rounded-xl bg-[#1E293B] border border-[#1F2937]"
                            >
                              <span className="text-base font-medium text-slate-200">
                                Studio Fees & Editing
                              </span>

                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-300">
                                  {selectedFeeType
                                    ? numberOfHours
                                      ? `${selectedFeeType} — ${numberOfHours} hour${
                                          numberOfHours === 1 ? "" : "s"
                                        }`
                                      : `${selectedFeeType} — set hours`
                                    : "Select fee type and hours"}
                                </span>

                                <ChevronDown
                                  className="h-4 w-4 text-slate-300 transition-transform duration-200
                 group-data-[state=open]:rotate-180"
                                />
                              </div>
                            </AccordionTrigger>

                            <AccordionContent>
                              <div className="grid gap-6">
                                <div className="grid gap-4">
                                  <Label className="text-base font-medium">
                                    Select Fee Type:
                                  </Label>
                                  <RadioGroup
                                    value={selectedFeeType ?? ""}
                                    onValueChange={(value) => {
                                      setSelectedFeeType(value);
                                      // keep open so they can set hours
                                    }}
                                    className="grid gap-2"
                                  >
                                    {Object.keys(studioFeeRates).map((type) => {
                                      const id = `fee-${type.replace(
                                        /[^a-zA-Z0-9]/g,
                                        ""
                                      )}`;
                                      return (
                                        <div
                                          key={type}
                                          className="flex items-center space-x-2"
                                        >
                                          <RadioGroupItem
                                            value={type}
                                            id={id}
                                          />
                                          <Label
                                            htmlFor={id}
                                            className="cursor-pointer"
                                          >
                                            {type}
                                          </Label>
                                        </div>
                                      );
                                    })}
                                  </RadioGroup>
                                </div>

                                <div className="grid gap-4">
                                  <Label
                                    htmlFor="fee-hours"
                                    className="text-base font-medium"
                                  >
                                    Enter Total Hours:
                                  </Label>
                                  <Input
                                    id="fee-hours"
                                    type="number"
                                    value={numberOfHours}
                                    onChange={(e) =>
                                      setNumberOfHours(
                                        Math.max(1, Number(e.target.value) || 1)
                                      )
                                    }
                                    onBlur={() => {
                                      if (
                                        numberOfHours >= 1 &&
                                        selectedFeeType
                                      ) {
                                        setIsTermAccordionOpen(false);
                                      }
                                    }}
                                    onKeyDown={(e) => {
                                      if (
                                        e.key === "Enter" &&
                                        numberOfHours >= 1 &&
                                        selectedFeeType
                                      ) {
                                        setIsTermAccordionOpen(false);
                                      }
                                    }}
                                    min="1"
                                    step="0.5"
                                    className="max-w-[150px]"
                                    autoComplete="off"
                                  />
                                  <EnterHint />
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}

                    {/* --- Pickups --- */}
                    {selectedSubType === "Pickups" && (
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                        <Accordion
                          type="single"
                          collapsible
                          value={isTermAccordionOpen ? "fees-pickups" : ""}
                          onValueChange={(val) =>
                            setIsTermAccordionOpen(val === "fees-pickups")
                          }
                          className="w-full"
                        >
                          <AccordionItem value="fees-pickups">
                            <AccordionTrigger
                              className="group cursor-pointer flex justify-between items-center w-full px-4 py-3
             rounded-xl bg-[#1E293B] border border-[#1F2937]"
                            >
                              <span className="text-base font-medium text-slate-200">
                                Pickups
                              </span>

                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-300">
                                  {selectedPickupType === "Talent Error"
                                    ? "Talent Error (no charge to client)"
                                    : selectedPickupType ===
                                      "Minor Pickups (≤15 mins)"
                                    ? originalFee
                                      ? `Minor — based on $${originalFee}`
                                      : "Minor — set original fee"
                                    : selectedPickupType ===
                                      "Major Pickups (rewrites)"
                                    ? numberOfHours
                                      ? `Major — ${numberOfHours} hour${
                                          numberOfHours === 1 ? "" : "s"
                                        }`
                                      : "Major — set session hours"
                                    : "Select pickup type"}
                                </span>

                                <ChevronDown
                                  className="h-4 w-4 text-slate-300 transition-transform duration-200
                 group-data-[state=open]:rotate-180"
                                />
                              </div>
                            </AccordionTrigger>

                            <AccordionContent>
                              <div className="grid gap-6">
                                <div className="grid gap-4">
                                  <Label className="text-base font-medium">
                                    Select Pickup Type:
                                  </Label>
                                  <RadioGroup
                                    value={selectedPickupType ?? ""}
                                    onValueChange={(value) => {
                                      setSelectedPickupType(value);
                                      // reset fields when changing model
                                      setOriginalFee("");
                                      setNumberOfHours(0.5);

                                      // Talent Error has no extra inputs → close immediately
                                      if (value === "Talent Error") {
                                        setIsTermAccordionOpen(false);
                                      }
                                    }}
                                    className="grid gap-2"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="Talent Error"
                                        id="pickup-error"
                                      />
                                      <Label
                                        htmlFor="pickup-error"
                                        className="cursor-pointer"
                                      >
                                        Pickups due to Talent Error
                                      </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="Minor Pickups (≤15 mins)"
                                        id="pickup-minor"
                                      />
                                      <Label
                                        htmlFor="pickup-minor"
                                        className="cursor-pointer"
                                      >
                                        Minor Pickups (≤15 mins)
                                      </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="Major Pickups (rewrites)"
                                        id="pickup-major"
                                      />
                                      <Label
                                        htmlFor="pickup-major"
                                        className="cursor-pointer"
                                      >
                                        Major Pickups (rewrites/large
                                        re-records)
                                      </Label>
                                    </div>
                                  </RadioGroup>
                                </div>

                                {/* Conditional Input for Minor Pickups */}
                                {selectedPickupType ===
                                  "Minor Pickups (≤15 mins)" && (
                                  <div className="grid gap-4 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
                                    <Label
                                      htmlFor="pickup-original-fee"
                                      className="text-base font-medium"
                                    >
                                      Enter Original Fee ($):
                                    </Label>
                                    <Input
                                      id="pickup-original-fee"
                                      type="number"
                                      value={originalFee}
                                      onChange={(e) =>
                                        setOriginalFee(e.target.value)
                                      }
                                      onBlur={() => {
                                        if (
                                          originalFee !== "" &&
                                          !Number.isNaN(Number(originalFee))
                                        ) {
                                          setIsTermAccordionOpen(false);
                                        }
                                      }}
                                      onKeyDown={(e) => {
                                        if (
                                          e.key === "Enter" &&
                                          originalFee !== "" &&
                                          !Number.isNaN(Number(originalFee))
                                        ) {
                                          setIsTermAccordionOpen(false);
                                        }
                                      }}
                                      min="0"
                                      className="max-w-[150px]"
                                      placeholder="e.g., 500"
                                      autoComplete="off"
                                    />
                                    <EnterHint />
                                  </div>
                                )}

                                {/* Conditional Input for Major Pickups */}
                                {selectedPickupType ===
                                  "Major Pickups (rewrites)" && (
                                  <div className="grid gap-4 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
                                    <Label
                                      htmlFor="pickup-hours"
                                      className="text-base font-medium"
                                    >
                                      Enter Session Hours (in 0.5 hr
                                      increments):
                                    </Label>
                                    <Input
                                      id="pickup-hours"
                                      type="number"
                                      value={numberOfHours}
                                      onChange={(e) =>
                                        setNumberOfHours(
                                          Math.max(
                                            0.5,
                                            Number(e.target.value) || 0.5
                                          )
                                        )
                                      }
                                      onBlur={() => {
                                        if (numberOfHours >= 0.5) {
                                          setIsTermAccordionOpen(false);
                                        }
                                      }}
                                      onKeyDown={(e) => {
                                        if (
                                          e.key === "Enter" &&
                                          numberOfHours >= 0.5
                                        ) {
                                          setIsTermAccordionOpen(false);
                                        }
                                      }}
                                      min="0.5"
                                      step="0.5"
                                      className="max-w-[150px]"
                                      placeholder="e.g., 0.5"
                                      autoComplete="off"
                                    />
                                    <EnterHint />
                                  </div>
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}
                  </div>
                )}

                {calculatedRate && (
                  <section className="mt-8 space-y-6">
                    {/* RATE OUTPUT BOX */}
                    <div className="rounded-2xl border border-slate-700 bg-slate-900/90 px-5 py-4 shadow-lg shadow-slate-900/40">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                            GVAA-Aligned Rate
                          </p>
                          <p className="text-sm text-slate-400">
                            Based on your selections above
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-baseline justify-between gap-4">
                        <p className="text-3xl font-semibold tracking-tight text-slate-50">
                          {calculatedRate}
                        </p>
                        <p className="text-xs text-slate-400 text-right">
                          Preview only — final terms are set in your quote.
                        </p>
                      </div>
                    </div>

                    {/* ADD TO QUOTE AREA */}
                    <div className="rounded-2xl border border-slate-700 bg-slate-900 px-5 py-3 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-sm font-semibold text-slate-50">
                          Add to Quote
                        </h3>
                        <p className="text-xs text-slate-300">
                          Optional description helps future-you remember what
                          this line is.
                        </p>
                      </div>

                      {/* Description Textarea */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="item-description"
                          className="text-sm font-medium text-slate-50"
                        >
                          Line Item Description (Optional)
                        </Label>
                        <p className="text-xs text-slate-300">
                          e.g.,{" "}
                          <span className="italic">
                            “Spot 1 – Holiday Sale”
                          </span>{" "}
                          or <span className="italic">“Main narration”</span>
                        </p>
                        <Textarea
                          id="item-description"
                          placeholder="Enter an optional description for this line item..."
                          value={itemDescription}
                          onChange={(e) => setItemDescription(e.target.value)}
                          rows={3}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" && !event.shiftKey) {
                              event.preventDefault();
                              handleAddToQuote();
                            }
                          }}
                          autoComplete="off"
                          className="bg-slate-950/80 border-slate-700 focus-visible:ring-slate-400 text-slate-100 placeholder:text-slate-500"
                        />
                      </div>

                      {/* Add to Quote Button */}
                      <Button
                        type="button"
                        onClick={handleAddToQuote}
                        disabled={isInfoOnlySubtype}
                        size="lg"
                        className="w-full justify-center cursor-pointer disabled:cursor-not-allowed bg-primary text-primary-foreground hover:bg-primary/90 border border-border"
                      >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Add to Quote
                      </Button>

                      {isInfoOnlySubtype && (
                        <p className="mt-1 text-xs text-amber-300 text-center">
                          This selection is information-only and can’t be added
                          as a billable line item.
                        </p>
                      )}
                    </div>
                  </section>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Quote Builder (1/3 width on desktop) */}
        <div id="quote-builder">
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
