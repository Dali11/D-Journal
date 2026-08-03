import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import StatBar from "@/components/StatBar";
import RightPanel from "@/components/RightPanel";
import AllAccountsSummaryPanel from "@/components/AllAccountsSummaryPanel";
import DailyPnlCalendarCard from "@/components/DailyPnlCalendarCard";
import WeeklyAnalytics from "@/components/WeeklyAnalytics";
import DailyReviewBar from "@/components/DailyReviewBar";
import AccountResultBanner from "@/components/AccountResultBanner";
import {
  getAccounts,
  getAccountRules,
  getTrades,
  getDailyReview,
  computePerformanceStats,
  computeEquityCurve,
  computeSessionPnl,
  computeDayOfWeekPnl,
  computeSetupWinRates,
  computeDailyPnlCalendar,
  computeAccountSummary,
  computeAccountBreakdown,
  computeHeadline,
  detectAccountResult,
} from "@/lib/queries";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ account?: string }>;
}) {
  const { account: accountIdParam } = await searchParams;
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

  const today = new Date().toISOString().slice(0, 10);
  const threeWeeksAgo = new Date();
  threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 20);
  const dailyReview = await getDailyReview(today);

  if (isAll) {
    const trades = await getTrades();
    const balances = accounts.reduce((s, a) => s + a.balance, 0);

    const performanceStats = computePerformanceStats(trades);
    const equityCurve = computeEquityCurve(trades, balances);
    const sessionPnl = computeSessionPnl(trades);
    const dayOfWeekPnl = computeDayOfWeekPnl(trades);
    const setupWinRates = computeSetupWinRates(trades);
    const accountBreakdown = computeAccountBreakdown(accounts, trades);
    const headline = computeHeadline(trades, balances);
    const dailyPnlCalendar = computeDailyPnlCalendar(
      trades,
      threeWeeksAgo.toISOString().slice(0, 10),
      today
    );

    return (
      <div className="flex min-h-screen bg-canvas text-ink-primary">
        <Sidebar accounts={accounts} />

        <main className="flex-1 pb-10">
          <PageHeader accounts={accounts} activeAccountId="all" allowAll />
          <StatBar headline={headline} performanceStats={performanceStats} />

          <div className="mx-6 mt-6 grid grid-cols-1 gap-6 lg:mx-8 lg:grid-cols-2">
            <AllAccountsSummaryPanel rows={accountBreakdown} />
            <DailyPnlCalendarCard dailyPnlCalendar={dailyPnlCalendar} />
          </div>

          <WeeklyAnalytics
            equityCurve={equityCurve}
            performanceStats={performanceStats}
            sessionPnl={sessionPnl}
            dayOfWeekPnl={dayOfWeekPnl}
            setupWinRates={setupWinRates}
          />
          <DailyReviewBar dailyReview={dailyReview} />
        </main>
      </div>
    );
  }

  const account = activeAccount!;
  const [trades, accountRules] = await Promise.all([
    getTrades({ accountId: account.id }),
    getAccountRules(account.id),
  ]);

  const performanceStats = computePerformanceStats(trades);
  const equityCurve = computeEquityCurve(trades, accountRules.balance);
  const sessionPnl = computeSessionPnl(trades);
  const dayOfWeekPnl = computeDayOfWeekPnl(trades);
  const setupWinRates = computeSetupWinRates(trades);
  const accountSummary = computeAccountSummary(accountRules, trades);
  const headline = computeHeadline(trades, accountRules.balance);
  const detectedResult = accountRules.locked ? null : detectAccountResult(accountRules, trades);
  const dailyPnlCalendar = computeDailyPnlCalendar(
    trades,
    threeWeeksAgo.toISOString().slice(0, 10),
    today
  );

  return (
    <div className="flex min-h-screen bg-canvas text-ink-primary">
      <Sidebar accounts={accounts} />

      <main className="flex-1 pb-10">
        <PageHeader accounts={accounts} activeAccountId={account.id} allowAll />
        <StatBar headline={headline} performanceStats={performanceStats} />

        <AccountResultBanner
          accountId={account.id}
          accountName={account.name}
          locked={accountRules.locked}
          status={accountRules.status}
          lockedAt={accountRules.lockedAt}
          detectedResult={detectedResult}
        />

        <div className="mx-6 mt-6 lg:mx-8">
          <RightPanel accountSummary={accountSummary} dailyPnlCalendar={dailyPnlCalendar} />
        </div>

        <WeeklyAnalytics
          equityCurve={equityCurve}
          performanceStats={performanceStats}
          sessionPnl={sessionPnl}
          dayOfWeekPnl={dayOfWeekPnl}
          setupWinRates={setupWinRates}
        />
        <DailyReviewBar dailyReview={dailyReview} />
      </main>
    </div>
  );
}