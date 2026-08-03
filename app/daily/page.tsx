import EmptyAccountsState from "@/components/EmptyAccountsState";
import Sidebar from "@/components/Sidebar";
import AccountSwitcher from "@/components/AccountSwitcher";
import DailyDateNav from "@/components/DailyDateNav";
import DailyAnalysisTabs from "@/components/DailyAnalysisTabs";
import { getAccounts, getDailyAnalysis, getDailyAnalysisScreenshots } from "@/lib/queries";

function todayIso(): string {
    return new Date().toISOString().slice(0, 10);
}

export default async function DailyAnalysisPage({
    searchParams,
}: {
    searchParams: Promise<{ account?: string; date?: string }>;
}) {
    const { account: accountIdParam, date: dateParam } = await searchParams;
    const accounts = await getAccounts();
    const activeAccount = accounts.find((a) => a.id === accountIdParam) ?? accounts[0];
    const date = dateParam ?? todayIso();

    if (!activeAccount) {
        return <EmptyAccountsState />;
    }

    const [analysis, allShots] = await Promise.all([
        getDailyAnalysis(activeAccount.id, date),
        getDailyAnalysisScreenshots(activeAccount.id, date),
    ]);
    const preShots = allShots.filter((x) => x.phase === "pre");
    const midShots = allShots.filter((x) => x.phase === "mid");
    const endShots = allShots.filter((x) => x.phase === "end");

    return (
        <div className="flex min-h-screen bg-canvas text-ink-primary">
            <Sidebar accounts={accounts} />

            <main className="flex-1 pb-10">
                <header className="flex flex-wrap items-center justify-between gap-4 px-6 pt-6 pb-2 lg:px-8">
                    <div>
                        <h1 className="text-xl font-medium tracking-tight">Daily analysis</h1>
                        <p className="mt-1 text-sm text-ink-muted">{activeAccount.name}</p>
                    </div>
                    <AccountSwitcher
                        accounts={accounts}
                        activeAccountId={activeAccount.id}
                        basePath="/daily"
                        extraQuery={`date=${date}`}
                    />
                </header>

                <div className="mx-6 mt-2 lg:mx-8">
                    <DailyDateNav accountId={activeAccount.id} date={date} />
                </div>

                <div className="mx-6 mt-6 lg:mx-8">
                    <DailyAnalysisTabs
                        accountId={activeAccount.id}
                        date={date}
                        analysis={analysis}
                        screenshotsByPhase={{ pre: preShots, mid: midShots, end: endShots }}
                    />
                </div>
            </main>
        </div>
    );
}