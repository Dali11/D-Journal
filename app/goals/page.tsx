import Link from "next/link";
import { Plus } from "lucide-react";
import EmptyAccountsState from "@/components/EmptyAccountsState";
import Sidebar from "@/components/Sidebar";
import AccountSwitcher from "@/components/AccountSwitcher";
import GoalCard from "@/components/GoalCard";
import { getAccounts, getGoals, getTrades } from "@/lib/queries";
import { computeGoalProgress } from "@/lib/goals";

export default async function GoalsPage({
    searchParams,
}: {
    searchParams: Promise<{ account?: string }>;
}) {
    const { account: accountIdParam } = await searchParams;
    const accounts = await getAccounts();
    const activeAccount = accounts.find((a) => a.id === accountIdParam) ?? accounts[0];

    if (!activeAccount) {
        return <EmptyAccountsState />;
    }

    const [goals, trades] = await Promise.all([
        getGoals(activeAccount.id),
        getTrades({ accountId: activeAccount.id }),
    ]);

    const progress = goals.map((g) => computeGoalProgress(g, trades));
    const performanceGoals = progress.filter((p) => p.goal.category === "performance");
    const processGoals = progress.filter((p) => p.goal.category === "process");

    return (
        <div className="flex min-h-screen bg-canvas text-ink-primary">
            <Sidebar accounts={accounts} />

            <main className="flex-1 pb-10">
                <header className="flex flex-wrap items-center justify-between gap-4 px-6 pt-6 pb-2 lg:px-8">
                    <div>
                        <h1 className="text-xl font-medium tracking-tight">Goals</h1>
                        <p className="mt-1 text-sm text-ink-muted">
                            {activeAccount.name} · {goals.length} goal{goals.length === 1 ? "" : "s"}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <AccountSwitcher accounts={accounts} activeAccountId={activeAccount.id} basePath="/goals" />
                        <Link
                            href={`/goals/new?account=${activeAccount.id}`}
                            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
                        >
                            <Plus size={15} />
                            Add goal
                        </Link>
                    </div>
                </header>

                <div className="mx-6 mt-6 lg:mx-8">
                    {goals.length === 0 ? (
                        <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-border bg-surface p-6">
                            <div className="text-center">
                                <p className="text-sm font-medium text-ink-secondary">No goals set yet</p>
                                <p className="mt-1 text-xs text-ink-muted">
                                    <Link href={`/goals/new?account=${activeAccount.id}`} className="text-accent hover:underline">
                                        Set your first goal
                                    </Link>{" "}
                                    — a performance target or a discipline habit.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-8">
                            <section>
                                <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-ink-muted">
                                    Performance targets
                                </h2>
                                {performanceGoals.length === 0 ? (
                                    <p className="text-sm text-ink-muted">No performance goals yet.</p>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                                        {performanceGoals.map((p) => (
                                            <GoalCard key={p.goal.id} progress={p} />
                                        ))}
                                    </div>
                                )}
                            </section>

                            <section>
                                <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-ink-muted">
                                    Process &amp; discipline
                                </h2>
                                {processGoals.length === 0 ? (
                                    <p className="text-sm text-ink-muted">No process goals yet.</p>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                                        {processGoals.map((p) => (
                                            <GoalCard key={p.goal.id} progress={p} />
                                        ))}
                                    </div>
                                )}
                            </section>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}