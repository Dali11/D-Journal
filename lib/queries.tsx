import { createClient } from "@/lib/supabase/server";
import type {
    Account,
    AccountSummary,
    DailyPnl,
    DayOfWeekPnl,
    EquityPoint,
    PerformanceStats,
    SessionPnl,
    SetupWinRate,
    Trade,
} from "./types";

// ------------------------------------------------------------
// Row -> app type mapping (snake_case DB columns -> camelCase Trade)
// ------------------------------------------------------------
function mapTradeRow(row: any): Trade {
    return {
        id: row.id,
        date: row.date,
        accountId: row.account_id,
        instrument: row.instrument,
        instrumentLabel: row.instrument_label ?? "",
        session: row.session ?? "",
        sessionTime: row.session_time ?? "",
        entryTime: row.entry_time ?? "",
        exitTime: row.exit_time ?? "",
        direction: row.direction,
        contracts: row.contracts,
        entryPrice: Number(row.entry_price),
        exitPrice: Number(row.exit_price),
        riskUsd: Number(row.risk_usd ?? 0),
        riskPts: Number(row.risk_pts ?? 0),
        rewardUsd: Number(row.reward_usd ?? 0),
        rewardPts: Number(row.reward_pts ?? 0),
        rrAchieved: Number(row.rr_achieved ?? 0),
        pnl: Number(row.pnl),
        aPlusSetup: row.a_plus_setup ?? "No",
        trendDirection: row.trend_direction ?? "Range",
        htfBias: row.htf_bias ?? "Neutral",
        entryConfirmation: row.entry_confirmation ?? "Valid",
        newsNearby: row.news_nearby ?? "No",
        grade: row.grade ?? "C",
        confidenceBefore: row.confidence_before ?? 0,
        emotionsBefore: row.emotions_before ?? "",
        emotionsAfter: row.emotions_after ?? "",
        followedPlan: row.followed_plan ?? "Yes",
        revengeTrade: row.revenge_trade ?? "No",
        fomo: row.fomo ?? "No",
        notes: row.notes ?? "",
        entryScreenshotUrl: row.entry_screenshot_url ?? null,
        exitScreenshotUrl: row.exit_screenshot_url ?? null,
    };
}

function mapAccountRow(row: any): Account {
    return {
        id: row.id,
        name: row.name,
        balance: Number(row.balance),
        color: row.color,
    };
}

// ------------------------------------------------------------
// Fetchers
// ------------------------------------------------------------
export async function getAccounts(): Promise<Account[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .order("created_at", { ascending: true });

    if (error) throw error;
    return (data ?? []).map(mapAccountRow);
}

export async function getAccountRules(accountId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("accounts")
        .select("name, balance, consistency_rule, profit_target, max_daily_loss")
        .eq("id", accountId)
        .single();

    if (error) throw error;
    return {
        name: data.name,
        balance: Number(data.balance),
        consistencyRule: Number(data.consistency_rule),
        profitTarget: Number(data.profit_target),
        maxDailyLoss: Number(data.max_daily_loss),
    };
}

export async function getTradeById(id: string): Promise<Trade | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("trades")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) throw error;
    return data ? mapTradeRow(data) : null;
}

export async function getTrades(params?: {
    accountId?: string;
    from?: string; // ISO date
    to?: string; // ISO date
}): Promise<Trade[]> {
    const supabase = await createClient();
    let query = supabase.from("trades").select("*").order("date", { ascending: true });

    if (params?.accountId) query = query.eq("account_id", params.accountId);
    if (params?.from) query = query.gte("date", params.from);
    if (params?.to) query = query.lte("date", params.to);

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map(mapTradeRow);
}

// ------------------------------------------------------------
// Derived stats (computed in JS from fetched trades)
// ------------------------------------------------------------
export function computePerformanceStats(trades: Trade[]): PerformanceStats {
    const winners = trades.filter((t) => t.pnl > 0);
    const losers = trades.filter((t) => t.pnl < 0);
    const totalTrades = trades.length;
    const winRate = totalTrades ? (winners.length / totalTrades) * 100 : 0;

    const avgWinner = winners.length
        ? winners.reduce((s, t) => s + t.pnl, 0) / winners.length
        : 0;
    const avgLoser = losers.length
        ? losers.reduce((s, t) => s + t.pnl, 0) / losers.length
        : 0;

    const grossWin = winners.reduce((s, t) => s + t.pnl, 0);
    const grossLoss = Math.abs(losers.reduce((s, t) => s + t.pnl, 0));
    const profitFactor = grossLoss > 0 ? grossWin / grossLoss : grossWin > 0 ? Infinity : 0;

    const expectancy = totalTrades
        ? trades.reduce((s, t) => s + t.pnl, 0) / totalTrades
        : 0;

    // Max consecutive wins/losses (in date order)
    let maxWinStreak = 0;
    let maxLossStreak = 0;
    let curWinStreak = 0;
    let curLossStreak = 0;
    for (const t of trades) {
        if (t.pnl > 0) {
            curWinStreak += 1;
            curLossStreak = 0;
        } else if (t.pnl < 0) {
            curLossStreak += 1;
            curWinStreak = 0;
        } else {
            curWinStreak = 0;
            curLossStreak = 0;
        }
        maxWinStreak = Math.max(maxWinStreak, curWinStreak);
        maxLossStreak = Math.max(maxLossStreak, curLossStreak);
    }

    return {
        totalTrades,
        winningTrades: winners.length,
        losingTrades: losers.length,
        winRate: Number(winRate.toFixed(1)),
        avgWinner: Number(avgWinner.toFixed(2)),
        avgLoser: Number(avgLoser.toFixed(2)),
        expectancy: Number(expectancy.toFixed(2)),
        profitFactor: Number(profitFactor.toFixed(2)),
        maxConsecutiveWins: maxWinStreak,
        maxConsecutiveLosses: maxLossStreak,
    };
}

export function computeDailyPnlCalendar(
    trades: Trade[],
    from: string,
    to: string
): DailyPnl[] {
    const byDate = new Map<string, number>();
    for (const t of trades) {
        byDate.set(t.date, (byDate.get(t.date) ?? 0) + t.pnl);
    }

    const days: DailyPnl[] = [];
    const cursor = new Date(from);
    const end = new Date(to);
    while (cursor <= end) {
        const iso = cursor.toISOString().slice(0, 10);
        days.push({ date: iso, pnl: byDate.has(iso) ? byDate.get(iso)! : null });
        cursor.setDate(cursor.getDate() + 1);
    }
    return days;
}

export function computeEquityCurve(
    trades: Trade[],
    startingBalance: number
): EquityPoint[] {
    const byDate = new Map<string, number>();
    for (const t of trades) {
        byDate.set(t.date, (byDate.get(t.date) ?? 0) + t.pnl);
    }

    const sortedDates = Array.from(byDate.keys()).sort();
    let equity = startingBalance;
    return sortedDates.map((date) => {
        equity += byDate.get(date)!;
        const label = new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
        return { date: label, equity: Number(equity.toFixed(2)) };
    });
}

export function computeSessionPnl(trades: Trade[]): SessionPnl[] {
    const byName = new Map<string, number>();
    for (const t of trades) {
        const key = t.session || "Unspecified";
        byName.set(key, (byName.get(key) ?? 0) + t.pnl);
    }
    return Array.from(byName.entries()).map(([session, pnl]) => ({
        session,
        pnl: Number(pnl.toFixed(2)),
    }));
}

export function computeDayOfWeekPnl(trades: Trade[]): DayOfWeekPnl[] {
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const byDay = new Map<string, number>();
    for (const t of trades) {
        const dayName = dayNames[new Date(t.date).getDay()] ?? "Sunday";
        byDay.set(dayName, (byDay.get(dayName) ?? 0) + t.pnl);
    }
    // Only weekdays, in order, matching mock-data pattern
    return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => ({
        day,
        pnl: Number((byDay.get(day) ?? 0).toFixed(2)),
    }));
}

export function computeSetupWinRates(trades: Trade[]): SetupWinRate[] {
    const bySetup = new Map<string, { trades: number; wins: number }>();
    for (const t of trades) {
        const key = (t as any).setup || "Untagged";
        const entry = bySetup.get(key) ?? { trades: 0, wins: 0 };
        entry.trades += 1;
        if (t.pnl > 0) entry.wins += 1;
        bySetup.set(key, entry);
    }
    return Array.from(bySetup.entries()).map(([name, { trades: n, wins }]) => ({
        name,
        trades: n,
        winRate: n ? Number(((wins / n) * 100).toFixed(1)) : 0,
    }));
}

export function computeHeadline(trades: Trade[], startingBalance: number) {
    const totalPnl = trades.reduce((s, t) => s + t.pnl, 0);
    const totalPnlPct = startingBalance ? Number(((totalPnl / startingBalance) * 100).toFixed(2)) : 0;

    const stats = computePerformanceStats(trades);

    const byDate = new Map<string, number>();
    for (const t of trades) {
        byDate.set(t.date, (byDate.get(t.date) ?? 0) + t.pnl);
    }

    let bestDay = 0;
    let bestDayDate = "";
    let worstDay = 0;
    let worstDayDate = "";
    for (const [date, pnl] of byDate.entries()) {
        if (pnl > bestDay) {
            bestDay = pnl;
            bestDayDate = date;
        }
        if (pnl < worstDay) {
            worstDay = pnl;
            worstDayDate = date;
        }
    }

    const fmtDate = (iso: string) =>
        iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

    return {
        totalPnl: Number(totalPnl.toFixed(2)),
        totalPnlPct,
        winRate: stats.winRate,
        winsLosses: `${stats.winningTrades}W / ${stats.losingTrades}L`,
        expectancy: stats.expectancy,
        profitFactor: stats.profitFactor,
        bestDay: Number(bestDay.toFixed(2)),
        bestDayDate: fmtDate(bestDayDate),
        maxDrawdown: Number(worstDay.toFixed(2)),
        maxDrawdownDate: fmtDate(worstDayDate),
    };
}

export async function getDailyReview(date: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("daily_reviews")
        .select("*")
        .eq("date", date)
        .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return {
        bestTradeLabel: data.best_trade_label ?? "",
        bestTradePnl: Number(data.best_trade_pnl ?? 0),
        worstMistakeLabel: data.worst_mistake_label ?? "",
        worstMistakePnl: Number(data.worst_mistake_pnl ?? 0),
        whatToRepeat: data.what_to_repeat ?? "",
        oneThingToImprove: data.one_thing_to_improve ?? "",
        tomorrowsFocus: data.tomorrows_focus ?? "",
    };
}

export function computeAccountSummary(
    account: { name: string; balance: number; consistencyRule: number; profitTarget: number; maxDailyLoss: number },
    trades: Trade[]
): AccountSummary {
    const totalProfit = trades.reduce((s, t) => s + t.pnl, 0);
    const progressPct = account.profitTarget
        ? Math.min(100, (totalProfit / account.profitTarget) * 100)
        : 0;

    // Consistency: largest single day's profit as % of total profit (a common prop-firm rule)
    const byDate = new Map<string, number>();
    for (const t of trades) {
        byDate.set(t.date, (byDate.get(t.date) ?? 0) + t.pnl);
    }
    const bestDayProfit = Math.max(0, ...Array.from(byDate.values()));
    const consistencyPct = totalProfit > 0 ? (bestDayProfit / totalProfit) * 100 : 0;

    // Drawdown: lowest equity dip below starting balance
    const sortedDates = Array.from(byDate.keys()).sort();
    let equity = account.balance;
    let peak = account.balance;
    let maxDrawdown = 0;
    for (const date of sortedDates) {
        equity += byDate.get(date)!;
        peak = Math.max(peak, equity);
        maxDrawdown = Math.max(maxDrawdown, peak - equity);
    }
    const remainingDrawdown = Math.max(0, account.maxDailyLoss - maxDrawdown);

    const payoutEligible = progressPct >= 100 && consistencyPct <= account.consistencyRule;

    return {
        accountName: account.name,
        consistencyPct: Number(consistencyPct.toFixed(1)),
        consistencyRule: account.consistencyRule,
        totalProfit: Number(totalProfit.toFixed(2)),
        profitTarget: account.profitTarget,
        progressPct: Number(progressPct.toFixed(1)),
        remainingDrawdown: Number(remainingDrawdown.toFixed(2)),
        maxDailyLoss: account.maxDailyLoss,
        payoutEligible,
        estPayout: payoutEligible ? Number((totalProfit * 0.9).toFixed(2)) : 0,
    };
}