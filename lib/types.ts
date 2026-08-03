export type Direction = "Long" | "Short";
export type Grade = "A" | "B" | "C" | "D" | "F";
export type YesNo = "Yes" | "No";

export type AccountStage = "eval" | "funded";
export type AccountStatus = "active" | "passed" | "failed";
export type AccountResult = "passed" | "failed" | null;

export interface Account {
  id: string;
  name: string;
  balance: number;
  color: string;
  stage: AccountStage;
  status: AccountStatus;
  locked: boolean;
  lockedAt: string | null;
  resultNote: string | null;
}

export interface AccountBreakdownRow {
  accountId: string;
  name: string;
  color: string;
  balance: number;
  pnl: number;
  tradeCount: number;
  winRate: number;
}

export interface Setup {
  id: string;
  name: string;
  description: string;
  criteria: string[]; // checklist items
  color: string;
}

export interface SetupStats extends Setup {
  trades: number;
  winRate: number;
  totalPnl: number;
  avgPnl: number;
}

export interface AccountSummary {
  accountName: string;
  consistencyPct: number;
  consistencyRule: number;
  totalProfit: number;
  profitTarget: number;
  progressPct: number;
  remainingDrawdown: number;
  maxDailyLoss: number;
  payoutEligible: boolean;
  estPayout: number;
}

export interface Trade {
  id: string;
  date: string; // ISO yyyy-mm-dd
  accountId: string;
  instrument: string;
  instrumentLabel: string;
  session: string;
  sessionTime: string;
  entryTime: string;
  exitTime: string;
  direction: Direction;
  contracts: number;
  entryPrice: number;
  exitPrice: number;
  riskUsd: number;
  riskPts: number;
  rewardUsd: number;
  rewardPts: number;
  rrAchieved: number;
  pnl: number;
  setup: string | null;
  aPlusSetup: YesNo;
  trendDirection: "Uptrend" | "Downtrend" | "Range";
  htfBias: "Bullish" | "Bearish" | "Neutral";
  entryConfirmation: "Valid" | "Invalid";
  newsNearby: YesNo;
  grade: Grade;
  confidenceBefore: number;
  emotionsBefore: string;
  emotionsAfter: string;
  followedPlan: YesNo;
  revengeTrade: YesNo;
  fomo: YesNo;
  notes: string;
  entryScreenshotUrl: string | null;
  exitScreenshotUrl: string | null;
}

export interface DailyPnl {
  date: string; // ISO yyyy-mm-dd
  pnl: number | null;
}

export interface EquityPoint {
  date: string;
  equity: number;
}

export interface SessionPnl {
  session: string;
  pnl: number;
}

export interface DayOfWeekPnl {
  day: string;
  pnl: number;
}

export interface SetupWinRate {
  name: string;
  trades: number;
  winRate: number;
}

export interface GroupStat {
  name: string;
  pnl: number;
  trades: number;
  winRate: number;
}

export interface DisciplineRow {
  label: string;
  yesTrades: number;
  yesAvgPnl: number;
  noTrades: number;
  noAvgPnl: number;
}

export interface PerformanceStats {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  avgWinner: number;
  avgLoser: number;
  expectancy: number;
  profitFactor: number;
  maxConsecutiveWins: number;
  maxConsecutiveLosses: number;
}

export type GoalCategory = "performance" | "process";

export type GoalMetric =
  | "total_pnl"
  | "win_rate"
  | "profit_factor"
  | "expectancy"
  | "avg_rr"
  | "followed_plan_pct"
  | "no_revenge_pct"
  | "no_fomo_pct"
  | "a_plus_setup_pct"
  | "trade_count";

export type GoalDirection = "at_least" | "at_most";
export type GoalPeriod = "week" | "month" | "quarter" | "all" | "custom";

export interface Goal {
  id: string;
  accountId: string;
  category: GoalCategory;
  metric: GoalMetric;
  title: string;
  targetValue: number;
  direction: GoalDirection;
  period: GoalPeriod;
  fromDate: string | null;
  toDate: string | null;
  createdAt: string;
}

export interface GoalProgress {
  goal: Goal;
  currentValue: number;
  progressPct: number;
  achieved: boolean;
  rangeFrom: string;
  rangeTo: string;
  rangeLabel: string;
  tradesInPeriod: number;
}

export type DailyAnalysisPhase = "pre" | "mid" | "end";

export interface DailyAnalysisScreenshot {
  id: string;
  accountId: string;
  date: string;
  phase: DailyAnalysisPhase;
  url: string;
  label: string;
  createdAt: string;
}

export interface DailyAnalysis {
  accountId: string;
  date: string;
  htfBias: string;
  keyLevels: string;
  newsEvents: string;
  plan: string;
  marketUpdate: string;
  emotionalState: string;
  deviations: string;
  whatHappened: string;
  lessons: string;
  whatToRepeat: string;
  whatToImprove: string;
  updatedAt: string | null;
}

export interface TradeScreenshot {
  id: string;
  tradeId: string;
  url: string;
  label: string;
  createdAt: string;
}

export interface NoteLinkedTrade {
  date: string;
  instrument: string;
  pnl: number;
}

export interface Note {
  id: string;
  accountId: string;
  tradeId: string | null;
  title: string;
  body: string;
  resolution: string;
  tags: string[];
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
  linkedTrade: NoteLinkedTrade | null;
}

export interface DailyReview {
  bestTradeLabel: string;
  bestTradePnl: number;
  worstMistakeLabel: string;
  worstMistakePnl: number;
  whatToRepeat: string;
  oneThingToImprove: string;
  tomorrowsFocus: string;
}