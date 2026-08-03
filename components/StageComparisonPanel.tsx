import type { PerformanceStats } from "@/lib/types";
import type { StageOutcomes } from "@/lib/queries";
import { formatUsd, pnlColor } from "@/lib/format";

function Column({
    title,
    stats,
    totalPnl,
    outcomes,
    accentClass,
}: {
    title: string;
    stats: PerformanceStats;
    totalPnl: number;
    outcomes: StageOutcomes;
    accentClass: string;
}) {
    return (
        <div className="flex-1">
            <div className="mb-3 flex items-center justify-between">
                <p className={`text-sm font-medium ${accentClass}`}>{title}</p>
                <span className="text-xs text-ink-muted">
                    {outcomes.total} account{outcomes.total === 1 ? "" : "s"}
                </span>
            </div>

            <div className="mb-4 flex gap-2 text-xs">
                <span className="rounded bg-canvas px-2 py-1 text-ink-muted">{outcomes.active} active</span>
                <span className="rounded bg-profit/10 px-2 py-1 text-profit">{outcomes.passed} passed</span>
                <span className="rounded bg-loss/10 px-2 py-1 text-loss">{outcomes.failed} failed</span>
            </div>

            <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center justify-between">
                    <span className="text-ink-muted">Total P&L</span>
                    <span className={`num font-medium ${pnlColor(totalPnl)}`}>{formatUsd(totalPnl, { sign: true })}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-ink-muted">Win rate</span>
                    <span className="num">{stats.winRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-ink-muted">Profit factor</span>
                    <span className="num">{stats.profitFactor}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-ink-muted">Expectancy</span>
                    <span className="num">{formatUsd(stats.expectancy, { sign: true })}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-ink-muted">Trades</span>
                    <span className="num">{stats.totalTrades}</span>
                </div>
            </div>
        </div>
    );
}

export default function StageComparisonPanel({
    evalStats,
    fundedStats,
    evalTotalPnl,
    fundedTotalPnl,
    evalOutcomes,
    fundedOutcomes,
}: {
    evalStats: PerformanceStats;
    fundedStats: PerformanceStats;
    evalTotalPnl: number;
    fundedTotalPnl: number;
    evalOutcomes: StageOutcomes;
    fundedOutcomes: StageOutcomes;
}) {
    return (
        <div className="rounded-xl border border-border bg-surface p-5">
            <p className="mb-4 text-xs font-medium uppercase tracking-wide text-ink-muted">
                Eval vs funded
            </p>
            <div className="flex flex-col gap-6 sm:flex-row sm:divide-x sm:divide-border">
                <Column title="Eval / Challenge" stats={evalStats} totalPnl={evalTotalPnl} outcomes={evalOutcomes} accentClass="text-accent" />
                <div className="sm:pl-6">
                    <Column title="Funded" stats={fundedStats} totalPnl={fundedTotalPnl} outcomes={fundedOutcomes} accentClass="text-profit" />
                </div>
            </div>
        </div>
    );
}