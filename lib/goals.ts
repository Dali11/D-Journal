import type { Goal, GoalCategory, GoalDirection, GoalMetric, GoalProgress, Trade } from "./types";
import { resolveRange } from "./reportRange";

export const GOAL_METRICS: Record<
    GoalMetric,
    { label: string; category: GoalCategory; unit: "usd" | "percent" | "ratio" | "count"; defaultDirection: GoalDirection; defaultTarget: number }
> = {
    total_pnl: { label: "Total P&L", category: "performance", unit: "usd", defaultDirection: "at_least", defaultTarget: 1000 },
    win_rate: { label: "Win rate", category: "performance", unit: "percent", defaultDirection: "at_least", defaultTarget: 55 },
    profit_factor: { label: "Profit factor", category: "performance", unit: "ratio", defaultDirection: "at_least", defaultTarget: 1.5 },
    expectancy: { label: "Expectancy per trade", category: "performance", unit: "usd", defaultDirection: "at_least", defaultTarget: 50 },
    avg_rr: { label: "Average R:R achieved", category: "performance", unit: "ratio", defaultDirection: "at_least", defaultTarget: 1.5 },
    followed_plan_pct: { label: "Followed plan", category: "process", unit: "percent", defaultDirection: "at_least", defaultTarget: 90 },
    no_revenge_pct: { label: "No revenge trades", category: "process", unit: "percent", defaultDirection: "at_least", defaultTarget: 100 },
    no_fomo_pct: { label: "No FOMO entries", category: "process", unit: "percent", defaultDirection: "at_least", defaultTarget: 100 },
    a_plus_setup_pct: { label: "A+ setups only", category: "process", unit: "percent", defaultDirection: "at_least", defaultTarget: 80 },
    trade_count: { label: "Number of trades", category: "process", unit: "count", defaultDirection: "at_most", defaultTarget: 20 },
};

function pct(yes: number, total: number): number {
    return total ? (yes / total) * 100 : 0;
}

export function computeMetricValue(metric: GoalMetric, trades: Trade[]): number {
    const n = trades.length;
    switch (metric) {
        case "total_pnl":
            return trades.reduce((s, t) => s + t.pnl, 0);
        case "win_rate":
            return pct(trades.filter((t) => t.pnl > 0).length, n);
        case "profit_factor": {
            const grossWin = trades.filter((t) => t.pnl > 0).reduce((s, t) => s + t.pnl, 0);
            const grossLoss = Math.abs(trades.filter((t) => t.pnl < 0).reduce((s, t) => s + t.pnl, 0));
            return grossLoss > 0 ? grossWin / grossLoss : grossWin > 0 ? Infinity : 0;
        }
        case "expectancy":
            return n ? trades.reduce((s, t) => s + t.pnl, 0) / n : 0;
        case "avg_rr":
            return n ? trades.reduce((s, t) => s + (t.rrAchieved || 0), 0) / n : 0;
        case "followed_plan_pct":
            return pct(trades.filter((t) => t.followedPlan === "Yes").length, n);
        case "no_revenge_pct":
            return pct(trades.filter((t) => t.revengeTrade === "No").length, n);
        case "no_fomo_pct":
            return pct(trades.filter((t) => t.fomo === "No").length, n);
        case "a_plus_setup_pct":
            return pct(trades.filter((t) => t.aPlusSetup === "Yes").length, n);
        case "trade_count":
            return n;
        default:
            return 0;
    }
}

export function isAchieved(direction: GoalDirection, current: number, target: number): boolean {
    return direction === "at_least" ? current >= target : current <= target;
}

// A simple "usage" bar: how far current is toward target, capped at 100%.
// Achieved/failed state (color, badge) is decided separately via isAchieved.
export function computeProgressPct(current: number, target: number): number {
    if (target <= 0) return current <= 0 ? 100 : 0;
    return Math.max(0, Math.min(100, (current / target) * 100));
}

// Resolves each goal's own tracking period against a full trade list already
// scoped to the account, and returns computed progress for display.
export function computeGoalProgress(goal: Goal, allTrades: Trade[]): GoalProgress {
    const range =
        goal.period === "custom"
            ? resolveRange({ preset: "custom", from: goal.fromDate ?? undefined, to: goal.toDate ?? undefined })
            : resolveRange({ preset: goal.period });

    const tradesInPeriod = allTrades.filter((t) => t.date >= range.from && t.date <= range.to);
    const currentValue = computeMetricValue(goal.metric, tradesInPeriod);
    const achieved = isAchieved(goal.direction, currentValue, goal.targetValue);
    const progressPct = computeProgressPct(currentValue, goal.targetValue);

    return {
        goal,
        currentValue: Number.isFinite(currentValue) ? Number(currentValue.toFixed(2)) : currentValue,
        progressPct: Number(progressPct.toFixed(1)),
        achieved,
        rangeFrom: range.from,
        rangeTo: range.to,
        rangeLabel: range.label,
        tradesInPeriod: tradesInPeriod.length,
    };
}

export function formatMetricValue(metric: GoalMetric, value: number): string {
    const unit = GOAL_METRICS[metric].unit;
    if (!Number.isFinite(value)) return "∞";
    if (unit === "usd") {
        const sign = value < 0 ? "-" : "";
        return `${sign}$${Math.abs(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (unit === "percent") return `${value}%`;
    if (unit === "ratio") return `${value}R`;
    return `${value}`;
}