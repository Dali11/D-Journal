import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import AccountSwitcher from "@/components/AccountSwitcher";
import CalendarView from "@/components/CalendarView";
import { getAccounts, getTrades, computeDailyPnlCalendar } from "@/lib/queries";
import { resolveMonth, buildMonthGrid, groupTradesByDate, computeMonthSummary } from "@/lib/calendar";

export default async function CalendarPage({
    searchParams,
}: {
    searchParams: Promise<{ account?: string; month?: string }>;
}) {
    const { account: accountIdParam, month: monthParam } = await searchParams;
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

    const monthInfo = resolveMonth(monthParam);
    const trades = await getTrades({
        accountId: activeAccount.id,
        from: monthInfo.from,
        to: monthInfo.to,
    });

    const dailyPnl = computeDailyPnlCalendar(trades, monthInfo.from, monthInfo.to);
    const tradesByDate = groupTradesByDate(trades);
    const weeks = buildMonthGrid(monthInfo, dailyPnl, tradesByDate);
    const summary = computeMonthSummary(dailyPnl);

    const currentMonthParam = `${monthInfo.year}-${String(monthInfo.month + 1).padStart(2, "0")}`;
    const accountQuery = `account=${activeAccount.id}`;
    const prevHref = `/calendar?${accountQuery}&month=${monthInfo.prevParam}`;
    const nextHref = `/calendar?${accountQuery}&month=${monthInfo.nextParam}`;

    return (
        <div className="flex min-h-screen bg-canvas text-ink-primary">
            <Sidebar accounts={accounts} />

            <main className="flex-1 pb-10">
                <header className="flex flex-wrap items-center justify-between gap-4 px-6 pt-6 pb-2 lg:px-8">
                    <div>
                        <h1 className="text-xl font-medium tracking-tight">Calendar</h1>
                        <p className="mt-1 text-sm text-ink-muted">{activeAccount.name}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <AccountSwitcher
                            accounts={accounts}
                            activeAccountId={activeAccount.id}
                            basePath="/calendar"
                            extraQuery={`month=${currentMonthParam}`}
                        />
                        <div className="flex items-center gap-1 rounded-lg border border-border bg-surface px-2 py-1.5">
                            <Link href={prevHref} className="rounded p-1 text-ink-muted hover:bg-surface-hover hover:text-ink-primary" aria-label="Previous month">
                                <ChevronLeft size={16} />
                            </Link>
                            <span className="px-2 text-sm text-ink-secondary">{monthInfo.label}</span>
                            <Link href={nextHref} className="rounded p-1 text-ink-muted hover:bg-surface-hover hover:text-ink-primary" aria-label="Next month">
                                <ChevronRight size={16} />
                            </Link>
                        </div>
                        <Link
                            href="/trades/new"
                            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
                        >
                            <Plus size={15} />
                            New trade
                        </Link>
                    </div>
                </header>

                <div className="mx-6 mt-6 lg:mx-8">
                    <CalendarView weeks={weeks} tradesByDate={tradesByDate} summary={summary} />
                </div>
            </main>
        </div>
    );
}