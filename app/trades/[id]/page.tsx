import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Plus, Pin } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TradeDetailToggle from "@/components/TradeDetailToggle";
import TradeScreenshotsPanel from "@/components/TradeScreenshotsPanel";
import { getAccounts, getTradeById, getNotesForTrade, getTradeScreenshots, getSetups } from "@/lib/queries";

export default async function TradeDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const [accounts, trade, notes, screenshots, setups] = await Promise.all([
        getAccounts(),
        getTradeById(id),
        getNotesForTrade(id),
        getTradeScreenshots(id),
        getSetups(),
    ]);

    if (!trade) {
        notFound();
    }

    return (
        <div className="flex min-h-screen bg-canvas text-ink-primary">
            <Sidebar accounts={accounts} />

            <main className="flex-1 pb-10">
                <div className="px-6 pt-6 lg:px-8">
                    <Link
                        href="/trades"
                        className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink-secondary"
                    >
                        <ArrowLeft size={14} />
                        Back to trades
                    </Link>
                </div>

                <div className="mx-6 mt-4 lg:mx-8">
                    <TradeDetailToggle trade={trade} accounts={accounts} setups={setups} />
                </div>

                <div className="mx-6 mt-6 lg:mx-8">
                    <div className="rounded-xl border border-border bg-surface p-5">
                        <TradeScreenshotsPanel tradeId={trade.id} screenshots={screenshots} />
                    </div>
                </div>

                <div className="mx-6 mt-6 lg:mx-8">
                    <div className="rounded-xl border border-border bg-surface p-5">
                        <div className="flex items-center justify-between gap-3">
                            <h2 className="text-sm font-medium uppercase tracking-wide text-ink-muted">
                                Notes on this trade
                            </h2>
                            <Link
                                href={`/notes/new?account=${trade.accountId}&tradeId=${trade.id}`}
                                className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-ink-secondary hover:border-accent hover:text-accent"
                            >
                                <Plus size={13} />
                                Add note
                            </Link>
                        </div>

                        {notes.length === 0 ? (
                            <p className="mt-3 text-sm text-ink-muted">
                                No notes linked to this trade yet.
                            </p>
                        ) : (
                            <div className="mt-4 flex flex-col gap-2">
                                {notes.map((note) => (
                                    <Link
                                        key={note.id}
                                        href={`/notes/${note.id}`}
                                        className="flex items-start justify-between gap-3 rounded-lg border border-border bg-canvas px-3 py-2.5 hover:border-border-strong"
                                    >
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                {note.pinned && <Pin size={11} className="shrink-0 text-warn" />}
                                                <p className="truncate text-sm text-ink-primary">{note.title}</p>
                                            </div>
                                            {note.body && (
                                                <p className="mt-0.5 truncate text-xs text-ink-muted">{note.body}</p>
                                            )}
                                        </div>
                                        <span className="shrink-0 text-[11px] text-ink-muted">
                                            {new Date(note.createdAt).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}