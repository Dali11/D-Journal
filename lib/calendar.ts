import type { DailyPnl, Trade } from "./types";

export interface MonthInfo {
    year: number;
    month: number; // 0-indexed (0 = January)
    from: string; // ISO yyyy-mm-dd, first day of month
    to: string; // ISO yyyy-mm-dd, last day of month
    label: string; // e.g. "July 2026"
    prevParam: string; // yyyy-mm for prev month
    nextParam: string; // yyyy-mm for next month
}

// Parses a "YYYY-MM" search param into a MonthInfo, defaulting to the
// current month when the param is missing or malformed.
export function resolveMonth(monthParam?: string): MonthInfo {
    const now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth();

    if (monthParam && /^\d{4}-\d{2}$/.test(monthParam)) {
        const parts = monthParam.split("-").map(Number);
        const y = parts[0] ?? year;
        const m = parts[1] ?? month + 1;
        if (m >= 1 && m <= 12) {
            year = y;
            month = m - 1;
        }
    }

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prev = new Date(year, month - 1, 1);
    const next = new Date(year, month + 1, 1);

    const pad = (n: number) => String(n).padStart(2, "0");

    return {
        year,
        month,
        from: `${year}-${pad(month + 1)}-01`,
        to: `${year}-${pad(month + 1)}-${pad(lastDay.getDate())}`,
        label: firstDay.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        prevParam: `${prev.getFullYear()}-${pad(prev.getMonth() + 1)}`,
        nextParam: `${next.getFullYear()}-${pad(next.getMonth() + 1)}`,
    };
}

export interface CalendarCell {
    date: string | null; // null for padding cells outside the month
    day: number | null;
    pnl: number | null;
    tradeCount: number;
    isToday: boolean;
    isWeekend: boolean;
}

// Builds a full Sun-Sat grid for the given month, padded with null cells so
// every week has 7 columns.
export function buildMonthGrid(
    info: MonthInfo,
    dailyPnl: DailyPnl[],
    tradesByDate: Record<string, Trade[]>
): CalendarCell[][] {
    const pnlByDate = new Map(dailyPnl.map((d) => [d.date, d.pnl]));
    const today = new Date().toISOString().slice(0, 10);

    const firstDay = new Date(info.year, info.month, 1);
    const daysInMonth = new Date(info.year, info.month + 1, 0).getDate();
    const leadingBlanks = firstDay.getDay(); // 0 = Sunday

    const cells: CalendarCell[] = [];
    for (let i = 0; i < leadingBlanks; i++) {
        cells.push({ date: null, day: null, pnl: null, tradeCount: 0, isToday: false, isWeekend: false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const pad = (n: number) => String(n).padStart(2, "0");
        const date = `${info.year}-${pad(info.month + 1)}-${pad(day)}`;
        const weekday = new Date(info.year, info.month, day).getDay();
        cells.push({
            date,
            day,
            pnl: pnlByDate.has(date) ? pnlByDate.get(date)! : null,
            tradeCount: tradesByDate[date]?.length ?? 0,
            isToday: date === today,
            isWeekend: weekday === 0 || weekday === 6,
        });
    }

    while (cells.length % 7 !== 0) {
        cells.push({ date: null, day: null, pnl: null, tradeCount: 0, isToday: false, isWeekend: false });
    }

    const weeks: CalendarCell[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
        weeks.push(cells.slice(i, i + 7));
    }
    return weeks;
}

export function groupTradesByDate(trades: Trade[]): Record<string, Trade[]> {
    const map: Record<string, Trade[]> = {};
    for (const t of trades) {
        (map[t.date] ??= []).push(t);
    }
    return map;
}

export interface MonthSummary {
    totalPnl: number;
    tradingDays: number;
    winDays: number;
    lossDays: number;
    breakevenDays: number;
    winRatePct: number;
    avgDailyPnl: number;
    bestDay: { date: string; pnl: number } | null;
    worstDay: { date: string; pnl: number } | null;
}

export function computeMonthSummary(dailyPnl: DailyPnl[]): MonthSummary {
    const traded = dailyPnl.filter((d) => d.pnl !== null) as { date: string; pnl: number }[];
    const totalPnl = traded.reduce((s, d) => s + d.pnl, 0);
    const winDays = traded.filter((d) => d.pnl > 0).length;
    const lossDays = traded.filter((d) => d.pnl < 0).length;
    const breakevenDays = traded.filter((d) => d.pnl === 0).length;

    let bestDay: { date: string; pnl: number } | null = null;
    let worstDay: { date: string; pnl: number } | null = null;
    for (const d of traded) {
        if (!bestDay || d.pnl > bestDay.pnl) bestDay = d;
        if (!worstDay || d.pnl < worstDay.pnl) worstDay = d;
    }

    return {
        totalPnl: Number(totalPnl.toFixed(2)),
        tradingDays: traded.length,
        winDays,
        lossDays,
        breakevenDays,
        winRatePct: traded.length ? Number(((winDays / traded.length) * 100).toFixed(1)) : 0,
        avgDailyPnl: traded.length ? Number((totalPnl / traded.length).toFixed(2)) : 0,
        bestDay,
        worstDay,
    };
}