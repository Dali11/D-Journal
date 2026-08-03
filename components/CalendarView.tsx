"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ClipboardList } from "lucide-react";
import type { Trade } from "@/lib/types";
import type { CalendarCell, MonthSummary } from "@/lib/calendar";
import { formatUsd, pnlColor } from "@/lib/format";

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function StatRow({ label, value, valueClass = "" }: { label: string; value: string; valueClass?: string }) {
    return (
        <div className="flex items-center justify-between py-2 text-sm">
            <span className="text-ink-muted">{label}</span>
            <span className={`num ${valueClass}`}>{value}</span>
        </div>
    );
}

function fmtDateLong(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });
}

export default function CalendarView({
    weeks,
    tradesByDate,
    summary,
    accountId,
    analysisDates,
}: {
    weeks: CalendarCell[][];
    tradesByDate: Record<string, Trade[]>;
    summary: MonthSummary;
    accountId: string | null;
    analysisDates: string[];
}) {
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const analysisDateSet = useMemo(() => new Set(analysisDates), [analysisDates]);

    const selectedTrades = useMemo(
        () => (selectedDate ? tradesByDate[selectedDate] ?? [] : []),
        [selectedDate, tradesByDate]
    );
    const selectedPnl = selectedTrades.reduce((s, t) => s + t.pnl, 0);

    return (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_340px]">
            {/* Month grid */}
            <div className="rounded-xl border border-border bg-surface p-6">
                <div className="grid grid-cols-7 gap-2 text-center text-xs text-ink-muted">
                    {weekdayLabels.map((d) => (
                        <span key={d}>{d}</span>
                    ))}
                </div>

                <div className="mt-2 flex flex-col gap-2">
                    {weeks.map((week, i) => (
                        <div key={i} className="grid grid-cols-7 gap-2">
                            {week.map((cell, j) => {
                                if (!cell.date) {
                                    return <div key={j} className="h-24 rounded-lg" />;
                                }
                                const isSelected = cell.date === selectedDate;
                                const hasData = cell.pnl !== null;
                                const hasAnalysis = analysisDateSet.has(cell.date);
                                return (
                                    <button
                                        key={cell.date}
                                        type="button"
                                        onClick={() => setSelectedDate(isSelected ? null : cell.date)}
                                        className={`relative flex h-24 flex-col items-start justify-between rounded-lg border p-2 text-left transition-colors ${isSelected
                                            ? "border-accent bg-accent/10"
                                            : cell.isToday
                                                ? "border-accent/60 bg-canvas"
                                                : "border-transparent bg-canvas hover:border-border-strong"
                                            } ${cell.isWeekend ? "opacity-50" : ""}`}
                                    >
                                        {hasAnalysis && (
                                            <span
                                                className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent"
                                                title="Daily analysis saved"
                                            />
                                        )}
                                        <span className={`text-xs ${cell.isToday ? "font-medium text-accent" : "text-ink-muted"}`}>
                                            {cell.day}
                                        </span>
                                        {hasData ? (
                                            <div className="w-full">
                                                <p className={`num text-sm font-medium ${pnlColor(cell.pnl!)}`}>
                                                    {formatUsd(cell.pnl!, { sign: true })}
                                                </p>
                                                <p className="text-[10px] text-ink-muted">
                                                    {cell.tradeCount} trade{cell.tradeCount === 1 ? "" : "s"}
                                                </p>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-ink-muted">—</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Side panel: selected day detail, or month summary */}
            <div className="rounded-xl border border-border bg-surface p-6">
                {selectedDate ? (
                    <>
                        <div className="mb-1 flex items-center justify-between">
                            <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                                {fmtDateLong(selectedDate)}
                            </p>
                            <button
                                type="button"
                                onClick={() => setSelectedDate(null)}
                                className="text-xs text-ink-muted hover:text-ink-secondary"
                            >
                                Clear
                            </button>
                        </div>
                        <p className={`num mb-2 text-2xl font-medium ${pnlColor(selectedPnl)}`}>
                            {formatUsd(selectedPnl, { sign: true })}
                        </p>

                        {accountId && (
                            <Link
                                href={`/daily?account=${accountId}&date=${selectedDate}`}
                                className="mb-4 flex w-fit items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-ink-secondary hover:border-accent hover:text-accent"
                            >
                                <ClipboardList size={13} />
                                {analysisDateSet.has(selectedDate) ? "Review daily analysis" : "Add daily analysis"}
                            </Link>
                        )}

                        {selectedTrades.length === 0 ? (
                            <p className="py-6 text-center text-sm text-ink-muted">No trades on this day</p>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {selectedTrades.map((t) => (
                                    <button
                                        key={t.id}
                                        type="button"
                                        onClick={() => router.push(`/trades/${t.id}`)}
                                        className="flex w-full items-center justify-between rounded-lg border border-border bg-canvas px-3 py-2.5 text-left hover:border-border-strong"
                                    >
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="num text-sm">{t.instrument}</span>
                                                <span
                                                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${t.direction === "Long" ? "bg-profit/15 text-profit" : "bg-loss/15 text-loss"
                                                        }`}
                                                >
                                                    {t.direction}
                                                </span>
                                            </div>
                                            <p className="mt-0.5 text-xs text-ink-muted">
                                                {t.contracts} contract{t.contracts === 1 ? "" : "s"} · Grade {t.grade}
                                            </p>
                                        </div>
                                        <span className={`num text-sm font-medium ${pnlColor(t.pnl)}`}>
                                            {formatUsd(t.pnl, { sign: true })}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <p className="mb-4 text-xs font-medium uppercase tracking-wide text-ink-muted">
                            Month summary
                        </p>
                        <StatRow label="Total P&L" value={formatUsd(summary.totalPnl, { sign: true })} valueClass={pnlColor(summary.totalPnl)} />
                        <StatRow label="Trading days" value={String(summary.tradingDays)} />
                        <StatRow label="Win days" value={String(summary.winDays)} valueClass="text-profit" />
                        <StatRow label="Loss days" value={String(summary.lossDays)} valueClass="text-loss" />
                        <StatRow label="Day win rate" value={`${summary.winRatePct}%`} valueClass="text-accent" />
                        <StatRow label="Avg daily P&L" value={formatUsd(summary.avgDailyPnl, { sign: true })} valueClass={pnlColor(summary.avgDailyPnl)} />
                        <div className="mt-2 border-t border-border pt-2">
                            <StatRow
                                label="Best day"
                                value={summary.bestDay ? formatUsd(summary.bestDay.pnl, { sign: true }) : "—"}
                                valueClass="text-profit"
                            />
                            <StatRow
                                label="Worst day"
                                value={summary.worstDay ? formatUsd(summary.worstDay.pnl, { sign: true }) : "—"}
                                valueClass="text-loss"
                            />
                        </div>
                        <p className="mt-4 text-center text-xs text-ink-muted">
                            Click a day on the calendar to see its trades
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}