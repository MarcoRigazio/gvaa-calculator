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

export {
  GVAA_IVR,
  GVAA_INTERNAL,
  GVAA_EXPLAINER,
  GVAA_PAID_SOCIAL,
  GVAA_OLV,
  GVAA_OTT,
  GVAA_NONPAID_WEB,
  GVAA_TRADESHOW,
  GVAA_EVENT,
  GVAA_CINEMA,
  GVAA_TOYS,
  GVAA_DUBBING,
  GVAA_ANIMATION,
  GVAA_RADIO,
  GVAA_LOBBY,
  GVAA_MEDICAL,
  GVAA_YOUTUBE,
  GVAA_PODCAST,
  GVAA_AIRPORT,
  GVAA_MUSEUM,
  GVAA_PSA,
  GVAA_DIGITAL_GREETING,
  GVAA_AUDIOBOOK,
  GVAA_ELEARNING,
  GVAA_TV,
  GVAA_GAMES,
  GVAA_TV_PROMO,
  GVAA_RADIO_PROMO,
  GVAA_TRAILERS,
  GVAA_INFOMERCIAL,
  GVAA_INSHOW,
};

