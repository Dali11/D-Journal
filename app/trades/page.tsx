import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { Plus, X } from "lucide-react";
import { getAccounts, getTrades } from "@/lib/queries";
import TradesTable from "@/components/TradesTable";

export default async function TradesPage({
    searchParams,
}: {
    searchParams: Promise<{ setup?: string }>;
}) {
    const { setup: setupFilter } = await searchParams;
    const [accounts, trades] = await Promise.all([getAccounts(), getTrades()]);

    // Most recent first
    let sorted = [...trades].sort((a, b) => (a.date < b.date ? 1 : -1));
    if (setupFilter) {
        sorted = sorted.filter((t) => (t.setup?.trim() || "") === setupFilter);
    }

    return (
        <div className="flex min-h-screen bg-canvas text-ink-primary">
            <Sidebar accounts={accounts} />

            <main className="flex-1 pb-10">
                <header className="flex flex-wrap items-center justify-between gap-4 px-6 pt-6 pb-2 lg:px-8">
                    <div>
                        <h1 className="text-xl font-medium tracking-tight">Trades</h1>
                        <p className="mt-1 flex items-center gap-2 text-sm text-ink-muted">
                            {sorted.length} trade{sorted.length === 1 ? "" : "s"}
                            {setupFilter ? " matching setup" : " logged"}
                            {setupFilter && (
                                <Link
                                    href="/trades"
                                    className="flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-xs text-accent hover:bg-accent/25"
                                >
                                    {setupFilter}
                                    <X size={11} />
                                </Link>
                            )}
                        </p>
                    </div>
                    <Link
                        href="/trades/new"
                        className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
                    >
                        <Plus size={15} />
                        New trade
                    </Link>
                </header>

                <div className="mx-6 mt-6 lg:mx-8">
                    {sorted.length === 0 ? (
                        <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-border bg-surface p-6">
                            <div className="text-center">
                                <p className="text-sm font-medium text-ink-secondary">
                                    {setupFilter ? "No trades tagged with this setup yet" : "No trades logged yet"}
                                </p>
                                <p className="mt-1 text-xs text-ink-muted">
                                    <Link href="/trades/new" className="text-accent hover:underline">
                                        Log your first trade
                                    </Link>{" "}
                                    to see it here.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <TradesTable trades={sorted} accounts={accounts} />
                    )}
                </div>
            </main>
        </div>
    );
}