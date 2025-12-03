// /data/categoryTree.ts

// --- Types that the UI + calculateRate can both depend on ---

// Whatever categories your engine actually supports right now.
// You already have "radio" and "tv" wired; the others are future-safe.
export type RateCategoryId =
  | "radio"
  | "tv"
  | "corporate"
  | "elearning"
  | "promo"
  | "trailer";

// These are just shared enums so the UI and the engine
// don't drift on spelling.
export type MarketId = "local" | "regional" | "national" | "network" | "cable";
export type UsageTypeId =
  | "spot"
  | "tag"
  | "psa"
  | "sponsorship"
  | "id"
  | "billboard"
  | "brand";

// This shape should be compatible with (or easily mapped to)
// the input for calculateRate. Adjust as needed to match your
// actual calculateRate signature.
export interface CalculatorArgs {
  category: RateCategoryId;
  usageType?: UsageTypeId;
  market?: MarketId;
  // Radio/TV specific flags
  includesMajorMarkets?: boolean;
  isAutomotive?: boolean;
  isStreamingOnly?: boolean;
  // You can add more knobs later without changing the tree shape.
}

// Tree nodes powering the accordion UI

export type CategoryTreeNode =
  | CategoryGroupNode
  | CategoryOptionNode;

export interface CategoryGroupNode {
  type: "group";
  id: string;
  label: string;
  helperText?: string;
  children: CategoryTreeNode[];
}

export interface CategoryOptionNode {
  type: "option";
  id: string;
  label: string;
  helperText?: string;
  calculatorArgs: CalculatorArgs;
}

// --- The actual tree data ---
// v0: Radio + TV fleshed out; other categories stubbed for future wiring.

export const categoryTree: CategoryTreeNode[] = [
  // RADIO
  {
    type: "group",
    id: "radio",
    label: "Radio",
    helperText: "Local, regional, and national broadcast radio spots & tags.",
    children: [
      {
        type: "group",
        id: "radio_spots",
        label: "Radio Spots",
        helperText: "Standard :15, :30, :60 broadcast radio commercials.",
        children: [
          {
            type: "option",
            id: "radio_spot_local_no_majors",
            label: "Local – No Major Markets",
            helperText: "Local radio buy, excluding major markets (GVAA local tier).",
            calculatorArgs: {
              category: "radio",
              usageType: "spot",
              market: "local",
              includesMajorMarkets: false,
            },
          },
          {
            type: "option",
            id: "radio_spot_local_with_majors",
            label: "Local – With Major Markets",
            helperText:
              "Local radio including at least one major market (higher tier).",
            calculatorArgs: {
              category: "radio",
              usageType: "spot",
              market: "local",
              includesMajorMarkets: true,
            },
          },
          {
            type: "option",
            id: "radio_spot_regional",
            label: "Regional",
            helperText: "Multi-city / regional radio buy.",
            calculatorArgs: {
              category: "radio",
              usageType: "spot",
              market: "regional",
            },
          },
          {
            type: "option",
            id: "radio_spot_national",
            label: "National",
            helperText: "National radio campaign.",
            calculatorArgs: {
              category: "radio",
              usageType: "spot",
              market: "national",
            },
          },
        ],
      },
      {
        type: "group",
        id: "radio_tags",
        label: "Radio Tags & IDs",
        helperText:
          "Short tags, sponsor IDs, and similar elements attached to spots.",
        children: [
          {
            type: "option",
            id: "radio_tag_local",
            label: "Local Tag",
            helperText: "Local station tag / sponsor ID.",
            calculatorArgs: {
              category: "radio",
              usageType: "tag",
              market: "local",
            },
          },
          {
            type: "option",
            id: "radio_tag_regional",
            label: "Regional Tag",
            helperText: "Regional sponsor ID / tag usage.",
            calculatorArgs: {
              category: "radio",
              usageType: "tag",
              market: "regional",
            },
          },
          {
            type: "option",
            id: "radio_tag_national",
            label: "National Tag",
            helperText: "National-level sponsor ID / tag.",
            calculatorArgs: {
              category: "radio",
              usageType: "tag",
              market: "national",
            },
          },
        ],
      },
      {
        type: "group",
        id: "radio_special",
        label: "Radio – PSA & Other",
        helperText: "Public service announcements and specialty categories.",
        children: [
          {
            type: "option",
            id: "radio_psa",
            label: "Radio PSA",
            helperText: "Public service announcement for radio.",
            calculatorArgs: {
              category: "radio",
              usageType: "psa",
              market: "local",
            },
          },
          {
            type: "option",
            id: "radio_sponsorship",
            label: "Sponsorship / Billboard",
            helperText: "Short sponsorship lines or billboards on radio.",
            calculatorArgs: {
              category: "radio",
              usageType: "sponsorship",
            },
          },
        ],
      },
    ],
  },

  // TV
  {
    type: "group",
    id: "tv",
    label: "TV / Video",
    helperText: "Linear TV, cable, and streaming TV-style usage.",
    children: [
      {
        type: "group",
        id: "tv_broadcast",
        label: "Broadcast TV",
        helperText: "Traditional broadcast TV spots.",
        children: [
          {
            type: "option",
            id: "tv_spot_local_no_majors",
            label: "Local TV – No Major Markets",
            helperText: "Local TV buy, excluding major markets.",
            calculatorArgs: {
              category: "tv",
              usageType: "spot",
              market: "local",
              includesMajorMarkets: false,
            },
          },
          {
            type: "option",
            id: "tv_spot_local_with_majors",
            label: "Local TV – With Major Markets",
            helperText: "Local TV including one or more major markets.",
            calculatorArgs: {
              category: "tv",
              usageType: "spot",
              market: "local",
              includesMajorMarkets: true,
            },
          },
          {
            type: "option",
            id: "tv_spot_regional",
            label: "Regional TV",
            helperText: "Multi-city / regional TV campaign.",
            calculatorArgs: {
              category: "tv",
              usageType: "spot",
              market: "regional",
            },
          },
          {
            type: "option",
            id: "tv_spot_national",
            label: "National TV",
            helperText: "National linear broadcast TV campaign.",
            calculatorArgs: {
              category: "tv",
              usageType: "spot",
              market: "national",
            },
          },
        ],
      },
      {
        type: "group",
        id: "tv_cable_network",
        label: "Cable & Network",
        helperText: "Cable-only buys and national network campaigns.",
        children: [
          {
            type: "option",
            id: "tv_spot_cable",
            label: "Cable Only",
            helperText: "Cable-only TV usage.",
            calculatorArgs: {
              category: "tv",
              usageType: "spot",
              market: "cable",
            },
          },
          {
            type: "option",
            id: "tv_spot_network",
            label: "Network TV",
            helperText: "National network TV usage.",
            calculatorArgs: {
              category: "tv",
              usageType: "spot",
              market: "network",
            },
          },
        ],
      },
      {
        type: "group",
        id: "tv_streaming",
        label: "Streaming TV / CTV",
        helperText: "Connected TV (CTV) and streaming-only ad buys.",
        children: [
          {
            type: "option",
            id: "tv_streaming_only",
            label: "Streaming / CTV – Ad-Supported",
            helperText: "Streaming / CTV usage only (no traditional broadcast).",
            calculatorArgs: {
              category: "tv",
              usageType: "spot",
              isStreamingOnly: true,
            },
          },
        ],
      },
    ],
  },

  // FUTURE: CORPORATE / E-LEARNING / ETC.
  // These are stubs so the UI can show the category, even if
  // calculateRate currently only fully supports Radio/TV.
  {
    type: "group",
    id: "corporate",
    label: "Corporate / Industrial",
    helperText: "Internal videos, web-only corporate content, explainers.",
    children: [
      {
        type: "option",
        id: "corporate_generic",
        label: "Corporate / Industrial (Generic)",
        helperText: "Use while we finish wiring corporate categories.",
        calculatorArgs: {
          category: "corporate",
          usageType: "brand",
        },
      },
    ],
  },
  {
    type: "group",
    id: "elearning",
    label: "E-Learning",
    helperText: "Online training, modules, and LMS content.",
    children: [
      {
        type: "option",
        id: "elearning_generic",
        label: "E-Learning (Generic)",
        helperText: "Placeholder until detailed e-learning logic is wired.",
        calculatorArgs: {
          category: "elearning",
          usageType: "brand",
        },
      },
    ],
  },
  {
    type: "group",
    id: "promo_trailer",
    label: "Promo / Trailer (Future)",
    helperText: "Network promo, in-show, trailers, and similar.",
    children: [
      {
        type: "option",
        id: "promo_generic",
        label: "Promo / Trailer (Generic)",
        helperText: "Placeholder for promo/trailer categories.",
        calculatorArgs: {
          category: "promo",
          usageType: "promo",
        },
      },
    ],
  },
];
