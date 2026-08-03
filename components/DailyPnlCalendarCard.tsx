"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { DailyPnl } from "@/lib/types";
import { formatUsd, pnlColor } from "@/lib/format";

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri"];

// Builds up to 3 rows of 5 weekdays from a flat list of daily P&L entries.
function buildCalendarGrid(dailyPnlCalendar: DailyPnl[]) {
    const weekdayOnly = dailyPnlCalendar.filter((d) => {
        const day = new Date(d.date).getDay();
        return day !== 0 && day !== 6; // skip Sat/Sun
    });

    const lastThree = weekdayOnly.slice(-15); // up to 3 weeks of 5 weekdays

    const weeks: { date: string; day: number; pnl: number | null }[][] = [];
    for (let i = 0; i < lastThree.length; i += 5) {
        weeks.push(
            lastThree.slice(i, i + 5).map((d) => ({
                date: d.date,
                day: Number(d.date.slice(-2)),
                pnl: d.pnl,
            }))
        );
    }
    return weeks;
}

export default function DailyPnlCalendarCard({ dailyPnlCalendar }: { dailyPnlCalendar: DailyPnl[] }) {
    const grid = buildCalendarGrid(dailyPnlCalendar);
    const total = dailyPnlCalendar.reduce((sum, d) => sum + (d.pnl ?? 0), 0);
    const today = new Date().toISOString().slice(0, 10);
    const monthLabel = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

    return (
        <div className="rounded-xl border border-border bg-surface p-6">
            <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                    Daily P&L calendar
                </p>
                <div className="flex items-center gap-1 text-ink-muted">
                    <button className="rounded p-1 hover:bg-surface-hover" aria-label="Previous month">
                        <ChevronLeft size={14} />
                    </button>
                    <span className="text-xs text-ink-secondary">{monthLabel}</span>
                    <button className="rounded p-1 hover:bg-surface-hover" aria-label="Next month">
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] text-ink-muted">
                {weekdays.map((d) => (
                    <span key={d}>{d}</span>
                ))}
            </div>

            <div className="mt-1.5 flex flex-col gap-1.5">
                {grid.map((week, i) => (
                    <div key={i} className="grid grid-cols-5 gap-1.5">
                        {week.map((cell) => {
                            const isToday = cell.date === today;
                            return (
                                <div
                                    key={cell.date}
                                    className={`flex h-14 flex-col items-center justify-center rounded-lg border text-xs ${isToday ? "border-accent bg-accent/10" : "border-transparent bg-canvas"
                                        }`}
                                >
                                    <span className="text-[10px] text-ink-muted">{cell.day}</span>
                                    <span className={`num text-xs ${cell.pnl === null ? "text-ink-muted" : pnlColor(cell.pnl)}`}>
                                        {cell.pnl === null ? "—" : formatUsd(cell.pnl)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                ))}
                {grid.length === 0 && (
                    <p className="py-4 text-center text-xs text-ink-muted">No trades yet</p>
                )}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-sm">
                <span className="text-ink-muted">Total P&L</span>
                <span className={`num font-medium ${pnlColor(total)}`}>{formatUsd(total, { sign: true })}</span>
            </div>
        </div>
    );
}