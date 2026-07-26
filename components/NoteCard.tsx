"use client";

import Link from "next/link";
import { Pin, PinOff, Trash2, Link2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteNote, toggleNotePinned } from "@/lib/actions/notes";
import { formatUsd, pnlColor } from "@/lib/format";
import type { Note } from "@/lib/types";

const tagPalette = [
    "bg-accent/15 text-accent",
    "bg-profit/10 text-profit",
    "bg-warn/10 text-warn",
];

function tagClass(tag: string) {
    let hash = 0;
    for (let i = 0; i < tag.length; i++) hash = (hash * 31 + tag.charCodeAt(i)) % tagPalette.length;
    return tagPalette[hash];
}

export default function NoteCard({ note }: { note: Note }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    function openDetail() {
        router.push(`/notes/${note.id}`);
    }

    function handleDelete(e: React.MouseEvent) {
        e.stopPropagation();
        if (!confirm("Delete this note?")) return;
        startTransition(async () => {
            await deleteNote(note.id);
            router.refresh();
        });
    }

    function handleTogglePin(e: React.MouseEvent) {
        e.stopPropagation();
        startTransition(async () => {
            await toggleNotePinned(note.id, note.pinned);
            router.refresh();
        });
    }

    return (
        <div
            role="link"
            tabIndex={0}
            onClick={openDetail}
            onKeyDown={(e) => (e.key === "Enter" ? openDetail() : undefined)}
            className={`flex cursor-pointer flex-col rounded-xl border bg-surface p-4 transition-opacity hover:border-border-strong ${note.pinned ? "border-warn/40" : "border-border"
                } ${isPending ? "opacity-60" : ""}`}
        >
            <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-medium text-ink-primary">{note.title}</h3>
                <div className="flex shrink-0 items-center gap-1">
                    <button
                        type="button"
                        onClick={handleTogglePin}
                        className="rounded p-1 text-ink-muted hover:bg-surface-hover hover:text-warn"
                        aria-label={note.pinned ? "Unpin note" : "Pin note"}
                    >
                        {note.pinned ? <Pin size={13} className="text-warn" /> : <PinOff size={13} />}
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="rounded p-1 text-ink-muted hover:bg-surface-hover hover:text-loss"
                        aria-label="Delete note"
                    >
                        <Trash2 size={13} />
                    </button>
                </div>
            </div>

            {note.body && (
                <p className="mt-2 line-clamp-4 whitespace-pre-line text-xs leading-relaxed text-ink-secondary">
                    {note.body}
                </p>
            )}

            {note.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {note.tags.map((tag) => (
                        <span key={tag} className={`rounded px-2 py-0.5 text-[11px] ${tagClass(tag)}`}>
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {note.linkedTrade && note.tradeId && (
                <Link
                    href={`/trades/${note.tradeId}`}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-3 flex w-fit items-center gap-1.5 rounded-md border border-border bg-canvas px-2 py-1 hover:border-accent"
                >
                    <Link2 size={11} className="text-ink-muted" />
                    <span className="text-[11px] text-ink-secondary">
                        {note.linkedTrade.instrument} · {note.linkedTrade.date}
                    </span>
                    <span className={`num text-[11px] font-medium ${pnlColor(note.linkedTrade.pnl)}`}>
                        {formatUsd(note.linkedTrade.pnl, { sign: true })}
                    </span>
                </Link>
            )}

            <p className="mt-3 text-[11px] text-ink-muted">
                {new Date(note.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
        </div>
    );
}