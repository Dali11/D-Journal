"use client";

import type { AccountSummary, DailyPnl } from "@/lib/types";
import { formatUsd, formatConsistencyPct } from "@/lib/format";
import DailyPnlCalendarCard from "./DailyPnlCalendarCard";

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

export function SummaryRow({
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

export default function RightPanel({
  accountSummary,
  dailyPnlCalendar,
}: {
  accountSummary: AccountSummary;
  dailyPnlCalendar: DailyPnl[];
}) {
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

      <DailyPnlCalendarCard dailyPnlCalendar={dailyPnlCalendar} />
    </div>
  );
}