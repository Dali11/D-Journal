"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { AccountSummary, DailyPnl } from "@/lib/types";
import { formatUsd, pnlColor, formatConsistencyPct } from "@/lib/format";

function ConsistencyRing({ pct, rule, totalProfit }: { pct: number; rule: number; totalProfit: number }) {
  const r = 44;
  const c = 2 * Math.PI * r;
  const hasData = totalProfit > 0;
  const withinRule = hasData && pct <= rule;
  const offset = c - (Math.min(hasData ? pct : 0, 100) / 100) * c;
  const strokeColor = !hasData ? "#5B6478" : withinRule ? "#2FD68A" : "#F5566B";

  return (
    <div className="relative flex h-28 w-28 items-center justify-center">
      <svg width="112" height="112" viewBox="0 0 112 112" className="-rotate-90">
        <circle cx="56" cy="56" r={r} stroke="#1E2532" strokeWidth="9" fill="none" />
        <circle
          cx="56"
          cy="56"
          r={r}
          stroke={strokeColor}
          strokeWidth="9"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="num text-lg font-medium">{formatConsistencyPct(pct, totalProfit)}</span>
        <span className="text-[10px] text-ink-muted">Consistency</span>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between py-2 text-sm">
      <span className="text-ink-muted">{label}</span>
      <span className={`num ${valueClass}`}>{value}</span>
    </div>
  );
}

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

export default function RightPanel({
  accountSummary,
  dailyPnlCalendar,
}: {
  accountSummary: AccountSummary;
  dailyPnlCalendar: DailyPnl[];
}) {
  const grid = buildCalendarGrid(dailyPnlCalendar);
  const total = dailyPnlCalendar.reduce((sum, d) => sum + (d.pnl ?? 0), 0);
  const today = new Date().toISOString().slice(0, 10);
  const monthLabel = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-border bg-surface p-6">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-ink-muted">
          Account summary
        </p>
        <p className="mb-4 text-sm text-ink-secondary">{accountSummary.accountName}</p>

        <div className="flex items-center gap-5">
          <ConsistencyRing
            pct={accountSummary.consistencyPct}
            rule={accountSummary.consistencyRule}
            totalProfit={accountSummary.totalProfit}
          />
          <div className="flex-1">
            <SummaryRow label="Total profit" value={formatUsd(accountSummary.totalProfit)} valueClass="text-profit" />
            <SummaryRow label="Profit target" value={formatUsd(accountSummary.profitTarget)} />
            <SummaryRow label="Progress" value={`${accountSummary.progressPct}%`} valueClass="text-accent" />
          </div>
        </div>

        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-canvas">
          <div
            className="h-full rounded-full bg-accent"
            style={{ width: `${Math.min(accountSummary.progressPct, 100)}%` }}
          />
        </div>

        <div className="mt-4 border-t border-border pt-2">
          <SummaryRow label="Consistency rule" value={`${accountSummary.consistencyRule}%`} />
          <SummaryRow
            label="Current consistency"
            value={formatConsistencyPct(accountSummary.consistencyPct, accountSummary.totalProfit)}
            valueClass={
              accountSummary.totalProfit <= 0
                ? "text-ink-muted"
                : accountSummary.consistencyPct <= accountSummary.consistencyRule
                  ? "text-profit"
                  : "text-loss"
            }
          />
          <SummaryRow label="Remaining drawdown" value={formatUsd(accountSummary.remainingDrawdown)} valueClass="text-profit" />
          <SummaryRow label="Max daily loss" value={formatUsd(accountSummary.maxDailyLoss)} />
          <SummaryRow
            label="Payout eligible"
            value={accountSummary.payoutEligible ? "Yes" : "No"}
            valueClass={accountSummary.payoutEligible ? "text-profit" : "text-loss"}
          />
          <SummaryRow label="Est. payout" value={formatUsd(accountSummary.estPayout)} />
        </div>
      </div>

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
                    className={`flex h-14 flex-col items-center justify-center rounded-lg border text-xs ${isToday
                      ? "border-accent bg-accent/10"
                      : "border-transparent bg-canvas"
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
    </div>
  );
}