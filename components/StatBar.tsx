"use client";

import { LineChart, Line, ResponsiveContainer } from "recharts";
import type { PerformanceStats } from "@/lib/types";
import { formatUsd, pnlColor } from "@/lib/format";

type Headline = {
  totalPnl: number;
  totalPnlPct: number;
  winRate: number;
  winsLosses: string;
  expectancy: number;
  profitFactor: number;
  bestDay: number;
  bestDayDate: string;
  maxDrawdown: number;
  maxDrawdownDate: string;
};

const sparkUp = [
  { v: 4 }, { v: 6 }, { v: 5 }, { v: 8 }, { v: 7 }, { v: 10 }, { v: 12 },
];

function Sparkline({ color }: { color: string }) {
  return (
    <div className="h-8 w-20">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={sparkUp}>
          <Line
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function WinRateRing({ pct }: { pct: number }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(pct, 100) / 100) * c;
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
      <circle cx="28" cy="28" r={r} stroke="#1E2532" strokeWidth="6" fill="none" />
      <circle
        cx="28"
        cy="28"
        r={r}
        stroke="#2FD68A"
        strokeWidth="6"
        fill="none"
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  );
}

function Card({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 min-w-[150px] flex-col gap-2 border-r border-border px-5 py-4 last:border-r-0">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
        {label}
      </p>
      {children}
    </div>
  );
}

export default function StatBar({
  headline,
  performanceStats,
}: {
  headline: Headline;
  performanceStats: PerformanceStats;
}) {
  return (
    <div className="mx-6 flex flex-wrap rounded-xl border border-border bg-surface lg:mx-8">
      <Card label="Total P&L">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className={`num text-xl font-medium ${pnlColor(headline.totalPnl)}`}>
              {formatUsd(headline.totalPnl, { sign: true })}
            </p>
            <p className="num mt-1 text-xs text-profit">
              {headline.totalPnlPct >= 0 ? "+" : ""}
              {headline.totalPnlPct}%
            </p>
          </div>
          <Sparkline color="#2FD68A" />
        </div>
      </Card>

      <Card label="Win rate">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="num text-xl font-medium">{headline.winRate}%</p>
            <p className="num mt-1 text-xs text-ink-muted">{headline.winsLosses}</p>
          </div>
          <WinRateRing pct={headline.winRate} />
        </div>
      </Card>

      <Card label="Expectancy">
        <p className="num text-xl font-medium text-profit">
          {formatUsd(headline.expectancy)}
        </p>
        <p className="text-xs text-ink-muted">Per trade</p>
      </Card>

      <Card label="Profit factor">
        <p className="num text-xl font-medium">
          {performanceStats.profitFactor.toFixed(2)}
        </p>
      </Card>

      <Card label="Best day">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="num text-xl font-medium text-profit">
              {formatUsd(headline.bestDay)}
            </p>
            <p className="num mt-1 text-xs text-ink-muted">{headline.bestDayDate || "—"}</p>
          </div>
          <Sparkline color="#2FD68A" />
        </div>
      </Card>

      <Card label="Max drawdown">
        <p className="num text-xl font-medium text-loss">
          {formatUsd(headline.maxDrawdown)}
        </p>
        <p className="num mt-1 text-xs text-ink-muted">{headline.maxDrawdownDate || "—"}</p>
      </Card>
    </div>
  );
}