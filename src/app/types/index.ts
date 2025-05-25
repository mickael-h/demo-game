// UI Types
export interface TextInputConfig {
  width?: number;
  height?: number;
  initialValue?: string | number;
  placeholder?: string;
  min?: number;
  max?: number;
  colors?: {
    background?: number;
    text?: number;
    border?: number;
  };
  textStyle?: {
    fontFamily?: string;
    fontSize?: number;
  };
}

export interface TextButtonConfig {
  text: string;
  width: number;
  height: number;
  radius: number;
  color: number;
  fontSize?: number;
  fontFamily?: string;
  textColor?: number;
}

export interface SymbolStripConfig {
  symbolSize: number;
  reelSpacing: number;
  visibleSymbols: number;
  symbols: string[];
}

export type ReelConfig = SymbolStripConfig;

// Game Types
export interface OutcomeWeights {
  threeOfAKind: number;
  twoOfAKind: number;
  noWin: number;
}

export interface SymbolWeights {
  [index: number]: number;
}

export interface BetRequest {
  amount: number;
  autowin?: boolean;
  autolose?: boolean;
  outcomeWeights?: OutcomeWeights;
  symbolWeights?: SymbolWeights;
}

export interface SpinResult {
  symbols: string[];
  win: number;
  winType: "THREE_OF_A_KIND" | "TWO_OF_A_KIND" | "NO_WIN";
}

export interface ManySpinsResult {
  totalSpins: number;
  totalWinAmount: number;
  totalBetAmount: number;
  expectation: number;
  winRate: number;
  returnToPlayer: number;
  standardDeviation: number;
}

export interface BetOptions {
  autowin?: boolean;
  autolose?: boolean;
  outcomeWeights?: OutcomeWeights;
  symbolWeights?: SymbolWeights;
}

// UI Constants
export const PANEL_CONFIG = {
  WIDTH: 300,
  PADDING: 20,
  COLORS: {
    BACKGROUND: 0x333333,
    TEXT: 0xffffff,
    INPUT_BACKGROUND: 0x444444,
    INPUT_TEXT: 0xffffff,
  },
  TEXT: {
    FONT_FAMILY: "Arial",
    FONT_SIZE: 16,
    LINE_HEIGHT: 24,
    STYLE: {
      fontFamily: "Arial",
      fontSize: 16,
      fill: 0xffffff,
    },
  },
  INPUT: {
    WIDTH: 100,
    HEIGHT: 30,
    COLORS: {
      background: 0x444444,
      text: 0xffffff,
      border: 0xffffff,
    },
    TEXT_STYLE: {
      fontFamily: "Arial",
      fontSize: 16,
    },
  },
} as const;

// Game Constants
export const SLOT_SYMBOLS = ["🍒", "🍊", "🍋", "🍇", "7️⃣", "💎"] as const;

// Storage Keys
export const STORAGE_KEYS = {
  VOLUME: {
    MASTER: "volume-master",
    BGM: "volume-bgm",
    SFX: "volume-sfx",
  },
  SLOT: {
    MANY_SPINS: "slot-many-spins",
    THREE_OF_A_KIND_WEIGHT: "slot-three-of-a-kind-weight",
    TWO_OF_A_KIND_WEIGHT: "slot-two-of-a-kind-weight",
    NO_WIN_WEIGHT: "slot-no-win-weight",
    AUTOWIN: "slot-autowin",
    AUTOLOSE: "slot-autolose",
    SYMBOL_WEIGHT_PREFIX: "slot-symbol-weight-",
  },
} as const;

// Logging Types
export type LogLevel = "info" | "warn" | "error" | "debug";

// Event Types
export type EventCallback = (detail: unknown) => void;
