import Link from "next/link";
import { Plus, CheckCircle2 } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { getAccounts, getSetups, getTrades, computeSetupStats } from "@/lib/queries";
import { formatUsd, pnlColor } from "@/lib/format";

export default async function SetupsPage() {
    const [accounts, setups, trades] = await Promise.all([getAccounts(), getSetups(), getTrades()]);

    const setupStats = computeSetupStats(setups, trades);
    const taggedNames = new Set(setups.map((s) => s.name));
    const untaggedCount = trades.filter((t) => !t.setup?.trim() || !taggedNames.has(t.setup.trim())).length;

    return (
        <div className="flex min-h-screen bg-canvas text-ink-primary">
            <Sidebar accounts={accounts} />

            <main className="flex-1 pb-10">
                <header className="flex flex-wrap items-center justify-between gap-4 px-6 pt-6 pb-2 lg:px-8">
                    <div>
                        <h1 className="text-xl font-medium tracking-tight">Setups</h1>
                        <p className="mt-1 text-sm text-ink-muted">
                            {setups.length} strateg{setups.length === 1 ? "y" : "ies"} in your playbook
                        </p>
                    </div>
                    <Link
                        href="/setups/new"
                        className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
                    >
                        <Plus size={15} />
                        Add setup
                    </Link>
                </header>

                <div className="mx-6 mt-6 lg:mx-8">
                    {setupStats.length === 0 ? (
                        <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-border bg-surface p-6">
                            <div className="text-center">
                                <p className="text-sm font-medium text-ink-secondary">No setups defined yet</p>
                                <p className="mt-1 text-xs text-ink-muted">
                                    <Link href="/setups/new" className="text-accent hover:underline">
                                        Add your first setup
                                    </Link>{" "}
                                    to start building your playbook.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {setupStats.map((s) => (
                                <Link
                                    key={s.id}
                                    href={`/trades?setup=${encodeURIComponent(s.name)}`}
                                    className="flex flex-col rounded-xl border border-border bg-surface p-5 transition-colors hover:border-border-strong"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                                        <h2 className="text-sm font-medium text-ink-primary">{s.name}</h2>
                                    </div>
                                    {s.description && (
                                        <p className="mt-2 text-xs leading-relaxed text-ink-muted">{s.description}</p>
                                    )}

                                    {s.criteria.length > 0 && (
                                        <ul className="mt-3 flex flex-col gap-1.5">
                                            {s.criteria.slice(0, 4).map((c, i) => (
                                                <li key={i} className="flex items-start gap-1.5 text-xs text-ink-secondary">
                                                    <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-ink-muted" />
                                                    {c}
                                                </li>
                                            ))}
                                            {s.criteria.length > 4 && (
                                                <li className="pl-[19px] text-xs text-ink-muted">
                                                    +{s.criteria.length - 4} more
                                                </li>
                                            )}
                                        </ul>
                                    )}

                                    <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wide text-ink-muted">Trades</p>
                                            <p className="num text-sm font-medium">{s.trades}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wide text-ink-muted">Win rate</p>
                                            <p className={`num text-sm font-medium ${s.trades ? (s.winRate >= 50 ? "text-profit" : "text-loss") : ""}`}>
                                                {s.trades ? `${s.winRate}%` : "—"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wide text-ink-muted">Total P&L</p>
                                            <p className={`num text-sm font-medium ${pnlColor(s.totalPnl)}`}>
                                                {s.trades ? formatUsd(s.totalPnl, { sign: true }) : "—"}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {untaggedCount > 0 && (
                        <p className="mt-4 text-center text-xs text-ink-muted">
                            {untaggedCount} trade{untaggedCount === 1 ? "" : "s"} not tagged to a saved setup ·{" "}
                            <Link href="/trades" className="text-accent hover:underline">
                                View trades
                            </Link>
                        </p>
                    )}
                </div>
            </main>
        </div>
    );
}