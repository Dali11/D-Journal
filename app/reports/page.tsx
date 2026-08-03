import EmptyAccountsState from "@/components/EmptyAccountsState";
import Sidebar from "@/components/Sidebar";
import AccountSwitcher from "@/components/AccountSwitcher";
import ReportRangePicker from "@/components/ReportRangePicker";
import PrintReportButton from "@/components/PrintReportButton";
import ReportReflectionForm from "@/components/ReportReflectionForm";
import {
    getAccounts,
    getAccountRules,
    getTrades,
    getReport,
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
import { resolveRange } from "@/lib/reportRange";
import { formatUsd, pnlColor } from "@/lib/format";
import {
    DayOfWeekPanel,
    DirectionPanel,
    DisciplinePanel,
    EquityCurvePanel,
    GradePanel,
    InstrumentPanel,
    PerformanceStatsPanel,
    SessionPanel,
    SetupsPanel,
} from "@/components/AnalyticsPanels";

export default async function ReportsPage({
    searchParams,
}: {
    searchParams: Promise<{ account?: string; preset?: string; from?: string; to?: string }>;
}) {
    const { account: accountIdParam, preset, from, to } = await searchParams;
    const accounts = await getAccounts();
    const activeAccount = accounts.find((a) => a.id === accountIdParam) ?? accounts[0];

    if (!activeAccount) {
        return <EmptyAccountsState />;
    }

    const range = resolveRange({ preset, from, to });

    const [trades, accountRules, existingReport] = await Promise.all([
        getTrades({ accountId: activeAccount.id, from: range.from, to: range.to }),
        getAccountRules(activeAccount.id),
        getReport(activeAccount.id, range.from, range.to),
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

    const totalPnl = trades.reduce((s, t) => s + t.pnl, 0);
    const extraQuery = `preset=${range.preset}&from=${range.from}&to=${range.to}`;

    return (
        <div className="flex min-h-screen bg-canvas text-ink-primary print:bg-white print:text-black">
            <Sidebar accounts={accounts} />

            <main className="flex-1 pb-10 print:pb-0">
                <header className="flex flex-wrap items-center justify-between gap-4 px-6 pt-6 pb-2 lg:px-8 print:hidden">
                    <div>
                        <h1 className="text-xl font-medium tracking-tight">Reports</h1>
                        <p className="mt-1 text-sm text-ink-muted">
                            {activeAccount.name} · {range.label} · {trades.length} trade{trades.length === 1 ? "" : "s"}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <AccountSwitcher
                            accounts={accounts}
                            activeAccountId={activeAccount.id}
                            basePath="/reports"
                            extraQuery={extraQuery}
                        />
                        <PrintReportButton />
                    </div>
                </header>

                <div className="mx-6 mt-4 lg:mx-8 print:hidden">
                    <ReportRangePicker
                        accountId={activeAccount.id}
                        preset={range.preset}
                        from={range.from}
                        to={range.to}
                    />
                </div>

                {/* Printable letterhead — only shows in the print/PDF output */}
                <div className="mx-6 mt-6 hidden lg:mx-8 print:mx-8 print:block">
                    <h1 className="text-2xl font-semibold">{activeAccount.name} — Trading Report</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        {range.label} · {range.from} to {range.to}
                    </p>
                </div>

                <div className="mx-6 mt-6 rounded-xl border border-border bg-surface p-5 lg:mx-8 print:mx-8 print:border-none print:bg-transparent print:p-0">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="text-sm text-ink-muted print:text-gray-600">Total P&amp;L for period</p>
                        <p className={`num text-2xl font-medium ${pnlColor(totalPnl)}`}>
                            {formatUsd(totalPnl, { sign: true })}
                        </p>
                    </div>
                </div>

                <div className="mx-6 mt-6 grid grid-cols-1 gap-4 lg:mx-8 lg:grid-cols-3 print:mx-8 print:grid-cols-2 print:gap-3">
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

                <div className="mx-6 mt-6 lg:mx-8 print:mx-8 print:mt-8 print:break-before-page">
                    <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-ink-muted print:text-black">
                        Reflection
                    </h2>
                    <ReportReflectionForm
                        accountId={activeAccount.id}
                        from={range.from}
                        to={range.to}
                        initial={{
                            title: existingReport?.title ?? "",
                            whatWentWell: existingReport?.whatWentWell ?? "",
                            whatToImprove: existingReport?.whatToImprove ?? "",
                            focusNext: existingReport?.focusNext ?? "",
                        }}
                    />
                </div>
            </main>
        </div>
    );
}