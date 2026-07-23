import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import StatBar from "@/components/StatBar";
import RightPanel from "@/components/RightPanel";
import WeeklyAnalytics from "@/components/WeeklyAnalytics";
import DailyReviewBar from "@/components/DailyReviewBar";
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
  computeHeadline,
} from "@/lib/queries";

export default async function DashboardPage({
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
  const accountSummary = computeAccountSummary(accountRules, trades);
  const headline = computeHeadline(trades, accountRules.balance);

  const today = new Date().toISOString().slice(0, 10);
  const threeWeeksAgo = new Date();
  threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 20);
  const dailyPnlCalendar = computeDailyPnlCalendar(
    trades,
    threeWeeksAgo.toISOString().slice(0, 10),
    today
  );

  const dailyReview = await getDailyReview(today);

  return (
    <div className="flex min-h-screen bg-canvas text-ink-primary">
      <Sidebar accounts={accounts} />

      <main className="flex-1 pb-10">
        <PageHeader accounts={accounts} activeAccountId={activeAccount.id} />
        <StatBar headline={headline} performanceStats={performanceStats} />

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