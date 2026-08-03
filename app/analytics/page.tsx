import Sidebar from "@/components/Sidebar";
import AccountSwitcher from "@/components/AccountSwitcher";
import StageComparisonPanel from "@/components/StageComparisonPanel";
import {
    getAccounts,
    getAccountRules,
    getTrades,
    computePerformanceStats,
    computeEquityCurve,
    computeSessionPnl,
    computeDayOfWeekPnl,
    computeSetupWinRates,
    computePnlByInstrument,
    computePnlByDirection,
    computeGradeBreakdown,
    computeDisciplineStats,
    splitTradesByStage,
    computeStageOutcomes,
} from "@/lib/queries";
import { DayOfWeekPanel, DirectionPanel, DisciplinePanel, EquityCurvePanel, GradePanel, InstrumentPanel, PerformanceStatsPanel, SessionPanel, SetupsPanel } from "@/components/AnalyticsPanels";


export default async function AnalyticsPage({
    searchParams,
}: {
    searchParams: Promise<{ account?: string; stage?: string }>;
}) {
    const { account: accountIdParam, stage: stageParam } = await searchParams;
    const accounts = await getAccounts();

    if (accounts.length === 0) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-canvas text-ink-primary">
                <div className="text-center">
                    <p className="text-lg font-medium">No accounts yet</p>
                    <p className="mt-2 text-sm text-ink-muted">
                        Add an account in Supabase to get started.
                    </p>
                </div>
            </div>
        );
    }

    const isAll = accountIdParam === "all";
    const activeAccount = accounts.find((a) => a.id === accountIdParam) ?? (isAll ? null : accounts[0]);
    const stageFilter = isAll && (stageParam === "eval" || stageParam === "funded") ? stageParam : "all";

    const allTrades = isAll ? await getTrades() : await getTrades({ accountId: activeAccount!.id });

    const trades = isAll
        ? stageFilter === "all"
            ? allTrades
            : allTrades.filter((t) => accounts.find((a) => a.id === t.accountId)?.stage === stageFilter)
        : allTrades;

    const startingBalance = isAll
        ? accounts
            .filter((a) => stageFilter === "all" || a.stage === stageFilter)
            .reduce((s, a) => s + a.balance, 0)
        : (await getAccountRules(activeAccount!.id)).balance;

    const performanceStats = computePerformanceStats(trades);
    const equityCurve = computeEquityCurve(trades, startingBalance);
    const sessionPnl = computeSessionPnl(trades);
    const dayOfWeekPnl = computeDayOfWeekPnl(trades);
    const setupWinRates = computeSetupWinRates(trades);
    const pnlByInstrument = computePnlByInstrument(trades);
    const pnlByDirection = computePnlByDirection(trades);
    const gradeBreakdown = computeGradeBreakdown(trades);
    const disciplineStats = computeDisciplineStats(trades);

    let stageComparison = null;
    if (isAll) {
        const { evalTrades, fundedTrades } = splitTradesByStage(accounts, allTrades);
        stageComparison = {
            evalStats: computePerformanceStats(evalTrades),
            fundedStats: computePerformanceStats(fundedTrades),
            evalTotalPnl: evalTrades.reduce((s, t) => s + t.pnl, 0),
            fundedTotalPnl: fundedTrades.reduce((s, t) => s + t.pnl, 0),
            evalOutcomes: computeStageOutcomes(accounts, "eval"),
            fundedOutcomes: computeStageOutcomes(accounts, "funded"),
        };
    }

    const stageQuery = isAll && stageFilter !== "all" ? `stage=${stageFilter}` : "";

    return (
        <div className="flex min-h-screen bg-canvas text-ink-primary">
            <Sidebar accounts={accounts} />

            <main className="flex-1 pb-10">
                <header className="flex flex-wrap items-center justify-between gap-4 px-6 pt-6 pb-2 lg:px-8">
                    <div>
                        <h1 className="text-xl font-medium tracking-tight">Analytics</h1>
                        <p className="mt-1 text-sm text-ink-muted">
                            {isAll ? "All accounts" : activeAccount!.name}
                            {isAll && stageFilter !== "all" ? ` · ${stageFilter === "eval" ? "Eval" : "Funded"} only` : ""} ·{" "}
                            {trades.length} trade{trades.length === 1 ? "" : "s"} all-time
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        {isAll && (
                            <div className="flex items-center gap-1 rounded-lg border border-border bg-surface p-1 text-sm">
                                {(["all", "eval", "funded"] as const).map((s) => (
                                    <a
                                        key={s}
                                        href={`/analytics?account=all${s === "all" ? "" : `&stage=${s}`}`}
                                        className={`rounded-md px-3 py-1.5 capitalize ${stageFilter === s ? "bg-accent/15 text-accent" : "text-ink-secondary hover:text-ink-primary"
                                            }`}
                                    >
                                        {s === "all" ? "All" : s === "eval" ? "Eval" : "Funded"}
                                    </a>
                                ))}
                            </div>
                        )}
                        <AccountSwitcher
                            accounts={accounts}
                            activeAccountId={isAll ? "all" : activeAccount!.id}
                            basePath="/analytics"
                            extraQuery={stageQuery}
                            allowAll
                        />
                    </div>
                </header>

                {stageComparison && (
                    <div className="mx-6 mt-6 lg:mx-8">
                        <StageComparisonPanel {...stageComparison} />
                    </div>
                )}

                <div className="mx-6 mt-6 grid grid-cols-1 gap-4 lg:mx-8 lg:grid-cols-3">
                    <EquityCurvePanel equityCurve={equityCurve} />
                    <PerformanceStatsPanel performanceStats={performanceStats} />
                    <InstrumentPanel pnlByInstrument={pnlByInstrument} />
                    <DirectionPanel pnlByDirection={pnlByDirection} />
                    <GradePanel gradeBreakdown={gradeBreakdown} />
                    <SessionPanel sessionPnl={sessionPnl} />
                    <DayOfWeekPanel dayOfWeekPnl={dayOfWeekPnl} />
                    <SetupsPanel setupWinRates={setupWinRates} />
                    <DisciplinePanel disciplineStats={disciplineStats} />
                </div>
            </main>
        </div>
    );
}