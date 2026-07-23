export type Direction = "Long" | "Short";
export type Grade = "A" | "B" | "C" | "D" | "F";
export type YesNo = "Yes" | "No";

export interface Account {
  id: string;
  name: string;
  balance: number;
  color: string;
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

export interface DailyReview {
  bestTradeLabel: string;
  bestTradePnl: number;
  worstMistakeLabel: string;
  worstMistakePnl: number;
  whatToRepeat: string;
  oneThingToImprove: string;
  tomorrowsFocus: string;
}