"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    CartesianGrid,
} from "recharts";
import type {
    DayOfWeekPnl,
    DisciplineRow,
    EquityPoint,
    GroupStat,
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

const axisTick = { fill: "#5B6478", fontSize: 11 };
const tooltipStyle = {
    background: "#141926",
    border: "1px solid #1E2532",
    borderRadius: 8,
    fontSize: 12,
};

export function EquityCurvePanel({ equityCurve }: { equityCurve: EquityPoint[] }) {
    const latest = equityCurve[equityCurve.length - 1]?.equity ?? 0;
    return (
        <Panel title="Equity curve" className="lg:col-span-3">
            <span className="num text-lg font-medium">{formatUsd(latest)}</span>
            <div className="mt-2 h-56">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={equityCurve} margin={{ left: -20, right: 8 }}>
                        <defs>
                            <linearGradient id="equityFillFull" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#7C6CF2" stopOpacity={0.35} />
                                <stop offset="100%" stopColor="#7C6CF2" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke="#1E2532" />
                        <XAxis dataKey="date" tick={axisTick} axisLine={false} tickLine={false} />
                        <YAxis
                            tick={axisTick}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => formatUsdCompact(v)}
                            width={52}
                            domain={["dataMin - 50", "dataMax + 50"]}
                        />
                        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [formatUsd(v), "Equity"]} />
                        <Area type="monotone" dataKey="equity" stroke="#7C6CF2" strokeWidth={2} fill="url(#equityFillFull)" />
                    </AreaChart>
                </ResponsiveContainer>
                {equityCurve.length === 0 && (
                    <div className="flex h-full items-center justify-center text-xs text-ink-muted">No trades yet</div>
                )}
            </div>
        </Panel>
    );
}

export function PerformanceStatsPanel({ performanceStats }: { performanceStats: PerformanceStats }) {
    const rows: [string, string, string?][] = [
        ["Total trades", String(performanceStats.totalTrades)],
        ["Winning trades", `${performanceStats.winningTrades} (${performanceStats.winRate}%)`, "text-profit"],
        ["Losing trades", `${performanceStats.losingTrades} (${(100 - performanceStats.winRate).toFixed(1)}%)`, "text-loss"],
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

function GroupBarPanel({
    title,
    data,
    valueLabel = "P&L",
}: {
    title: string;
    data: GroupStat[];
    valueLabel?: string;
}) {
    return (
        <Panel title={title}>
            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24 }}>
                        <CartesianGrid horizontal={false} stroke="#1E2532" />
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="name" tick={axisTick} axisLine={false} tickLine={false} width={70} />
                        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [formatUsd(v), valueLabel]} />
                        <Bar dataKey="pnl" radius={[0, 4, 4, 0]} barSize={16}>
                            {data.map((d) => (
                                <Cell key={d.name} fill={d.pnl >= 0 ? "#2FD68A" : "#F5566B"} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
                {data.length === 0 && (
                    <div className="flex h-full items-center justify-center text-xs text-ink-muted">No trades yet</div>
                )}
            </div>
        </Panel>
    );
}

export function InstrumentPanel({ pnlByInstrument }: { pnlByInstrument: GroupStat[] }) {
    return <GroupBarPanel title="P&L by instrument" data={pnlByInstrument} />;
}

export function GradePanel({ gradeBreakdown }: { gradeBreakdown: GroupStat[] }) {
    return <GroupBarPanel title="P&L by grade" data={gradeBreakdown} />;
}

export function DirectionPanel({ pnlByDirection }: { pnlByDirection: GroupStat[] }) {
    return (
        <Panel title="Long vs short">
            <div className="grid grid-cols-2 gap-3">
                {pnlByDirection.map((d) => (
                    <div key={d.name} className="rounded-lg border border-border bg-canvas p-4">
                        <p className="text-xs text-ink-muted">{d.name}</p>
                        <p className={`num mt-1 text-lg font-medium ${pnlColor(d.pnl)}`}>
                            {formatUsd(d.pnl, { sign: true })}
                        </p>
                        <p className="mt-1 text-xs text-ink-muted">
                            {d.trades} trade{d.trades === 1 ? "" : "s"} · {d.winRate}% win
                        </p>
                    </div>
                ))}
            </div>
        </Panel>
    );
}

export function SessionPanel({ sessionPnl }: { sessionPnl: SessionPnl[] }) {
    return (
        <Panel title="P&L by session">
            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sessionPnl} margin={{ left: -20, right: 8 }}>
                        <CartesianGrid vertical={false} stroke="#1E2532" />
                        <XAxis dataKey="session" tick={axisTick} axisLine={false} tickLine={false} />
                        <YAxis
                            tick={axisTick}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => formatUsdCompact(v)}
                            width={48}
                        />
                        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [formatUsd(v), "P&L"]} />
                        <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                            {sessionPnl.map((s) => (
                                <Cell key={s.session} fill={s.pnl >= 0 ? "#2FD68A" : "#F5566B"} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
                {sessionPnl.length === 0 && (
                    <div className="flex h-full items-center justify-center text-xs text-ink-muted">No trades yet</div>
                )}
            </div>
        </Panel>
    );
}

export function DayOfWeekPanel({ dayOfWeekPnl }: { dayOfWeekPnl: DayOfWeekPnl[] }) {
    return (
        <Panel title="P&L by day of week">
            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dayOfWeekPnl} layout="vertical" margin={{ left: 8, right: 24 }}>
                        <CartesianGrid horizontal={false} stroke="#1E2532" />
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="day" tick={axisTick} axisLine={false} tickLine={false} width={70} />
                        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [formatUsd(v), "P&L"]} />
                        <Bar dataKey="pnl" radius={[0, 4, 4, 0]} barSize={14}>
                            {dayOfWeekPnl.map((d) => (
                                <Cell key={d.day} fill={d.pnl >= 0 ? "#2FD68A" : "#F5566B"} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Panel>
    );
}

export function SetupsPanel({ setupWinRates }: { setupWinRates: SetupWinRate[] }) {
    return (
        <Panel title="Setups (win rate)">
            <div className="flex flex-col divide-y divide-border">
                {setupWinRates.map((s, i) => (
                    <div key={s.name} className="flex items-center justify-between py-2.5 text-sm">
                        <div>
                            <span className="text-ink-muted">{i + 1}.</span> <span className="text-ink-primary">{s.name}</span>
                            <p className="text-xs text-ink-muted">{s.trades} trades</p>
                        </div>
                        <span className={`num font-medium ${s.winRate >= 50 ? "text-profit" : "text-loss"}`}>{s.winRate}%</span>
                    </div>
                ))}
                {setupWinRates.length === 0 && (
                    <p className="py-4 text-center text-xs text-ink-muted">No trades yet</p>
                )}
            </div>
        </Panel>
    );
}

export function DisciplinePanel({ disciplineStats }: { disciplineStats: DisciplineRow[] }) {
    return (
        <Panel title="Discipline & psychology" className="lg:col-span-3">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {disciplineStats.map((row) => (
                    <div key={row.label} className="rounded-lg border border-border bg-canvas p-4">
                        <p className="mb-3 text-sm text-ink-secondary">{row.label}</p>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-ink-muted">Yes</span>
                            <span className="num text-ink-secondary">{row.yesTrades} trades</span>
                        </div>
                        <p className={`num text-right text-sm ${pnlColor(row.yesAvgPnl)}`}>
                            {formatUsd(row.yesAvgPnl, { sign: true })} avg
                        </p>
                        <div className="mt-2 flex items-center justify-between text-sm">
                            <span className="text-ink-muted">No</span>
                            <span className="num text-ink-secondary">{row.noTrades} trades</span>
                        </div>
                        <p className={`num text-right text-sm ${pnlColor(row.noAvgPnl)}`}>
                            {formatUsd(row.noAvgPnl, { sign: true })} avg
                        </p>
                    </div>
                ))}
            </div>
        </Panel>
    );
}