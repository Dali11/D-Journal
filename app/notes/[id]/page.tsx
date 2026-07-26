import Link from "next/link";
import { ArrowLeft, Link2 } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import EditNoteForm from "@/components/EditNoteForm";
import { getAccounts, getNoteById, getTrades } from "@/lib/queries";
import { formatUsd, pnlColor } from "@/lib/format";

export default async function NoteDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const [accounts, note] = await Promise.all([getAccounts(), getNoteById(id)]);

    if (!note) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-canvas text-ink-primary">
                <div className="text-center">
                    <p className="text-lg font-medium">Note not found</p>
                    <Link href="/notes" className="mt-2 inline-block text-sm text-accent hover:underline">
                        Back to notes
                    </Link>
                </div>
            </div>
        );
    }

    const trades = await getTrades({ accountId: note.accountId });

    return (
        <div className="flex min-h-screen bg-canvas text-ink-primary">
            <Sidebar accounts={accounts} />

            <main className="flex-1 pb-10">
                <div className="px-6 pt-6 lg:px-8">
                    <Link href="/notes" className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink-primary">
                        <ArrowLeft size={14} />
                        Back to notes
                    </Link>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <h1 className="text-2xl font-semibold">{note.title}</h1>
                        {note.linkedTrade && note.tradeId && (
                            <Link
                                href={`/trades/${note.tradeId}`}
                                className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs hover:border-accent"
                            >
                                <Link2 size={12} className="text-ink-muted" />
                                <span className="text-ink-secondary">
                                    {note.linkedTrade.instrument} · {note.linkedTrade.date}
                                </span>
                                <span className={`num font-medium ${pnlColor(note.linkedTrade.pnl)}`}>
                                    {formatUsd(note.linkedTrade.pnl, { sign: true })}
                                </span>
                            </Link>
                        )}
                    </div>
                </div>

                <div className="mx-6 mt-6 lg:mx-8">
                    <EditNoteForm note={note} trades={trades} />
                </div>
            </main>
        </div>
    );
}