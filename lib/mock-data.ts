import type {
  Account,
  AccountSummary,
  DailyPnl,
  DailyReview,
  DayOfWeekPnl,
  EquityPoint,
  PerformanceStats,
  SessionPnl,
  SetupWinRate,
  Trade,
} from "./types";

export const accounts: Account[] = [
  { id: "topstep", name: "TopStep X", balance: 50000, color: "#2FD68A" },
  { id: "tradeify", name: "Tradeify Select", balance: 25000, color: "#7C6CF2" },
  { id: "alpha", name: "Alpha Futures", balance: 25000, color: "#B980F0" },
];

export const activeTrade: Trade = {
  id: "20260715-001",
  date: "2026-07-15",
  accountId: "tradeify",
  instrument: "MNQ",
  instrumentLabel: "Micro E-mini NASDAQ-100",
  session: "NY AM",
  sessionTime: "8:30 AM – 11:30 AM",
  entryTime: "09:42:15",
  exitTime: "09:50:31",
  direction: "Long",
  contracts: 2,
  entryPrice: 20134.25,
  exitPrice: 20145.5,
  riskUsd: 200,
  riskPts: 10,
  rewardUsd: 450,
  rewardPts: 22.5,
  rrAchieved: 2.25,
  pnl: 450,
  aPlusSetup: "Yes",
  trendDirection: "Uptrend",
  htfBias: "Bullish",
  entryConfirmation: "Valid",
  newsNearby: "No",
  grade: "A",
  confidenceBefore: 8,
  emotionsBefore: "Calm, Focused",
  emotionsAfter: "Satisfied",
  followedPlan: "Yes",
  revengeTrade: "No",
  fomo: "No",
  notes: "Great execution. Waited for confirmation on 1m BOS.",
};

export const accountSummary: AccountSummary = {
  accountName: "Tradeify Select 25K",
  consistencyPct: 39.4,
  consistencyRule: 40,
  totalProfit: 1577.5,
  profitTarget: 2000,
  progressPct: 78.9,
  remainingDrawdown: 1425,
  maxDailyLoss: 1000,
  payoutEligible: false,
  estPayout: 1419.75,
};

export const dailyPnlCalendar: DailyPnl[] = [
  { date: "2026-06-30", pnl: -325 },
  { date: "2026-07-01", pnl: 145 },
  { date: "2026-07-02", pnl: 210 },
  { date: "2026-07-03", pnl: -180 },
  { date: "2026-07-04", pnl: 265 },
  { date: "2026-07-07", pnl: 310 },
  { date: "2026-07-08", pnl: -540 },
  { date: "2026-07-09", pnl: 120 },
  { date: "2026-07-10", pnl: 385 },
  { date: "2026-07-11", pnl: 220 },
  { date: "2026-07-14", pnl: 978.5 },
  { date: "2026-07-15", pnl: 450 },
  { date: "2026-07-16", pnl: null },
  { date: "2026-07-17", pnl: null },
  { date: "2026-07-18", pnl: null },
];

export const equityCurve: EquityPoint[] = [
  { date: "Jul 8", equity: 48000 },
  { date: "Jul 9", equity: 47460 },
  { date: "Jul 10", equity: 49230 },
  { date: "Jul 13", equity: 50120 },
  { date: "Jul 14", equity: 51610 },
  { date: "Jul 15", equity: 52146.25 },
];

export const performanceStats: PerformanceStats = {
  totalTrades: 72,
  winningTrades: 42,
  losingTrades: 30,
  winRate: 58.3,
  avgWinner: 92.45,
  avgLoser: -63.21,
  expectancy: 31.96,
  profitFactor: 2.18,
  maxConsecutiveWins: 7,
  maxConsecutiveLosses: 4,
};

export const sessionPnl: SessionPnl[] = [
  { session: "London", pnl: 245 },
  { session: "NY AM", pnl: 1356 },
  { session: "NY PM", pnl: -121 },
];

export const dayOfWeekPnl: DayOfWeekPnl[] = [
  { day: "Monday", pnl: 156 },
  { day: "Tuesday", pnl: 512 },
  { day: "Wednesday", pnl: 245 },
  { day: "Thursday", pnl: 678 },
  { day: "Friday", pnl: 555 },
];

export const setupWinRates: SetupWinRate[] = [
  { name: "Trend continuation", trades: 28, winRate: 65.2 },
  { name: "Breakout", trades: 15, winRate: 60.0 },
  { name: "Pullback", trades: 27, winRate: 55.6 },
  { name: "Reversal", trades: 10, winRate: 40.0 },
];

export const dailyReview: DailyReview = {
  bestTradeLabel: "MNQ Long",
  bestTradePnl: 450,
  worstMistakeLabel: "Early entry on NQ",
  worstMistakePnl: -180,
  whatToRepeat: "Patience + waiting for confirmation",
  oneThingToImprove: "Reduce early entries",
  tomorrowsFocus: "High A+ setups only",
};

export const headline = {
  totalPnl: 2146.25,
  totalPnlPct: 2.15,
  winRate: 58.3,
  winsLosses: "42W / 30L",
  expectancy: 31.96,
  profitFactor: 2.18,
  bestDay: 978.5,
  bestDayDate: "Jul 14, 2026",
  maxDrawdown: -1125,
  maxDrawdownDate: "Jul 6, 2026",
};
