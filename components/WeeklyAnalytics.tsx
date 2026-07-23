"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import type {
  DayOfWeekPnl,
  EquityPoint,
  PerformanceStats,
  SessionPnl,
  SetupWinRate,
} from "@/lib/types";
import { formatUsd, formatUsdCompact, pnlColor } from "@/lib/format";

function Panel({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-border bg-surface p-5 ${className}`}>
      <p className="mb-4 text-xs font-medium uppercase tracking-wide text-ink-muted">
        {title}
      </p>
      {children}
    </div>
  );
}

function EquityPanel({ equityCurve }: { equityCurve: EquityPoint[] }) {
  return (
    <Panel title="Equity curve" className="lg:col-span-2">
      <div className="mb-2">
        <span className="num text-lg font-medium">
          {formatUsd(equityCurve[equityCurve.length - 1]?.equity ?? 0)}
        </span>
      </div>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={equityCurve} margin={{ left: -20, right: 8 }}>
            <defs>
              <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7C6CF2" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#7C6CF2" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#1E2532" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#5B6478", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#5B6478", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => formatUsdCompact(v)}
              width={48}
              domain={["dataMin - 50", "dataMax + 50"]}
            />
            <Tooltip
              contentStyle={{
                background: "#141926",
                border: "1px solid #1E2532",
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(v: number) => [formatUsd(v), "Equity"]}
            />
            <Area
              type="monotone"
              dataKey="equity"
              stroke="#7C6CF2"
              strokeWidth={2}
              fill="url(#equityFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
        {equityCurve.length === 0 && (
          <div className="flex h-full items-center justify-center text-xs text-ink-muted">
            No trades yet
          </div>
        )}
      </div>
    </Panel>
  );
}

function StatsPanel({ performanceStats }: { performanceStats: PerformanceStats }) {
  const rows: [string, string, string?][] = [
    ["Total trades", String(performanceStats.totalTrades)],
    [
      "Winning trades",
      `${performanceStats.winningTrades} (${performanceStats.winRate}%)`,
      "text-profit",
    ],
    [
      "Losing trades",
      `${performanceStats.losingTrades} (${(100 - performanceStats.winRate).toFixed(1)}%)`,
      "text-loss",
    ],
    ["Average winner", formatUsd(performanceStats.avgWinner), "text-profit"],
    ["Average loser", formatUsd(performanceStats.avgLoser), "text-loss"],
    ["Expectancy", formatUsd(performanceStats.expectancy), "text-profit"],
    ["Profit factor", performanceStats.profitFactor.toFixed(2)],
    ["Max consecutive wins", String(performanceStats.maxConsecutiveWins), "text-profit"],
    ["Max consecutive losses", String(performanceStats.maxConsecutiveLosses), "text-loss"],
  ];

  return (
    <Panel title="Performance stats">
      <div className="flex flex-col divide-y divide-border">
        {rows.map(([label, value, cls]) => (
          <div key={label} className="flex items-center justify-between py-2 text-sm">
            <span className="text-ink-muted">{label}</span>
            <span className={`num ${cls ?? ""}`}>{value}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function DistributionPanel({ performanceStats }: { performanceStats: PerformanceStats }) {
  const data = [
    { name: "Winners", value: performanceStats.winningTrades, color: "#2FD68A" },
    { name: "Losers", value: performanceStats.losingTrades, color: "#F5566B" },
  ];
  const hasTrades = performanceStats.totalTrades > 0;

  return (
    <Panel title="P&L distribution">
      {hasTrades ? (
        <div className="flex min-w-0 items-center gap-6">
          <div className="h-32 w-32 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  innerRadius={40}
                  outerRadius={60}
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                >
                  {data.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-2 text-sm">
            {data.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: d.color }} />
                <span className="text-ink-secondary">{d.name}</span>
                <span className="num text-ink-muted">
                  {d.value} ({((d.value / performanceStats.totalTrades) * 100).toFixed(1)}%)
                </span>
              </div>
            ))}
            <p className="mt-1 text-xs text-ink-muted">
              Total: {performanceStats.totalTrades} trades
            </p>
          </div>
        </div>
      ) : (
        <p className="py-8 text-center text-xs text-ink-muted">No trades yet</p>
      )}
    </Panel>
  );
}

function SessionPanel({ sessionPnl }: { sessionPnl: SessionPnl[] }) {
  return (
    <Panel title="P&L by session">
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sessionPnl} margin={{ left: -20, right: 8 }}>
            <CartesianGrid vertical={false} stroke="#1E2532" />
            <XAxis
              dataKey="session"
              tick={{ fill: "#5B6478", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#5B6478", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => formatUsdCompact(v)}
              width={48}
            />
            <Tooltip
              contentStyle={{
                background: "#141926",
                border: "1px solid #1E2532",
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(v: number) => [formatUsd(v), "P&L"]}
            />
            <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
              {sessionPnl.map((s) => (
                <Cell key={s.session} fill={s.pnl >= 0 ? "#2FD68A" : "#F5566B"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        {sessionPnl.length === 0 && (
          <div className="flex h-full items-center justify-center text-xs text-ink-muted">
            No trades yet
          </div>
        )}
      </div>
    </Panel>
  );
}

function DayOfWeekPanel({ dayOfWeekPnl }: { dayOfWeekPnl: DayOfWeekPnl[] }) {
  return (
    <Panel title="P&L by day of week">
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dayOfWeekPnl} layout="vertical" margin={{ left: 8, right: 24 }}>
            <CartesianGrid horizontal={false} stroke="#1E2532" />
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="day"
              tick={{ fill: "#5B6478", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={70}
            />
            <Tooltip
              contentStyle={{
                background: "#141926",
                border: "1px solid #1E2532",
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(v: number) => [formatUsd(v), "P&L"]}
            />
            <Bar dataKey="pnl" radius={[0, 4, 4, 0]} fill="#2FD68A" barSize={14} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}

function SetupsPanel({ setupWinRates }: { setupWinRates: SetupWinRate[] }) {
  return (
    <Panel title="Best setups (win rate)">
      <div className="flex flex-col divide-y divide-border">
        {setupWinRates.map((s, i) => (
          <div key={s.name} className="flex items-center justify-between py-2.5 text-sm">
            <div>
              <span className="text-ink-muted">{i + 1}.</span>{" "}
              <span className="text-ink-primary">{s.name}</span>
              <p className="text-xs text-ink-muted">{s.trades} trades</p>
            </div>
            <span className={`num font-medium ${s.winRate >= 50 ? "text-profit" : "text-loss"}`}>
              {s.winRate}%
            </span>
          </div>
        ))}
        {setupWinRates.length === 0 && (
          <p className="py-4 text-center text-xs text-ink-muted">No trades yet</p>
        )}
      </div>
    </Panel>
  );
}

export default function WeeklyAnalytics({
  equityCurve,
  performanceStats,
  sessionPnl,
  dayOfWeekPnl,
  setupWinRates,
}: {
  equityCurve: EquityPoint[];
  performanceStats: PerformanceStats;
  sessionPnl: SessionPnl[];
  dayOfWeekPnl: DayOfWeekPnl[];
  setupWinRates: SetupWinRate[];
}) {
  return (
    <section className="mx-6 mt-6 lg:mx-8">
      <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-ink-secondary">
        Weekly performance analytics
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <EquityPanel equityCurve={equityCurve} />
        <StatsPanel performanceStats={performanceStats} />
        <DistributionPanel performanceStats={performanceStats} />
        <SessionPanel sessionPnl={sessionPnl} />
        <DayOfWeekPanel dayOfWeekPnl={dayOfWeekPnl} />
        <SetupsPanel setupWinRates={setupWinRates} />
      </div>
    </section>
  );
}