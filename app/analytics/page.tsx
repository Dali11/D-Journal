import Sidebar from "@/components/Sidebar";
import AccountSwitcher from "@/components/AccountSwitcher";
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
} from "@/lib/queries";
import { DayOfWeekPanel, DirectionPanel, DisciplinePanel, EquityCurvePanel, GradePanel, InstrumentPanel, PerformanceStatsPanel, SessionPanel, SetupsPanel } from "@/components/AnalyticsPanels";


export default async function AnalyticsPage({
    searchParams,
}: {
    searchParams: Promise<{ account?: string }>;
}) {
    const { account: accountIdParam } = await searchParams;
    const accounts = await getAccounts();
    const activeAccount = accounts.find((a) => a.id === accountIdParam) ?? accounts[0];

    if (!activeAccount) {
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

    const [trades, accountRules] = await Promise.all([
        getTrades({ accountId: activeAccount.id }),
        getAccountRules(activeAccount.id),
    ]);

    const performanceStats = computePerformanceStats(trades);
    const equityCurve = computeEquityCurve(trades, accountRules.balance);
    const sessionPnl = computeSessionPnl(trades);
    const dayOfWeekPnl = computeDayOfWeekPnl(trades);
    const setupWinRates = computeSetupWinRates(trades);
    const pnlByInstrument = computePnlByInstrument(trades);
    const pnlByDirection = computePnlByDirection(trades);
    const gradeBreakdown = computeGradeBreakdown(trades);
    const disciplineStats = computeDisciplineStats(trades);

    return (
        <div className="flex min-h-screen bg-canvas text-ink-primary">
            <Sidebar accounts={accounts} />

            <main className="flex-1 pb-10">
                <header className="flex flex-wrap items-center justify-between gap-4 px-6 pt-6 pb-2 lg:px-8">
                    <div>
                        <h1 className="text-xl font-medium tracking-tight">Analytics</h1>
                        <p className="mt-1 text-sm text-ink-muted">
                            {activeAccount.name} · {trades.length} trade{trades.length === 1 ? "" : "s"} all-time
                        </p>
                    </div>
                    <AccountSwitcher accounts={accounts} activeAccountId={activeAccount.id} basePath="/analytics" />
                </header>

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