"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import NoteCard from "./NoteCard";
import type { Note } from "@/lib/types";

export default function NotesBoard({ notes }: { notes: Note[] }) {
    const [search, setSearch] = useState("");
    const [activeTag, setActiveTag] = useState<string | null>(null);
    const [linkedOnly, setLinkedOnly] = useState(false);

    const allTags = useMemo(() => {
        const set = new Set<string>();
        notes.forEach((n) => n.tags.forEach((t) => set.add(t)));
        return Array.from(set).sort();
    }, [notes]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return notes.filter((n) => {
            if (activeTag && !n.tags.includes(activeTag)) return false;
            if (linkedOnly && !n.linkedTrade) return false;
            if (q && !`${n.title} ${n.body}`.toLowerCase().includes(q)) return false;
            return true;
        });
    }, [notes, search, activeTag, linkedOnly]);

    return (
        <div>
            <div className="flex flex-wrap items-center gap-2">
                <div className="flex min-w-[200px] flex-1 items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2">
                    <Search size={14} className="text-ink-muted" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search notes"
                        className="w-full bg-transparent text-sm text-ink-primary placeholder:text-ink-muted outline-none"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                    <button
                        type="button"
                        onClick={() => setActiveTag(null)}
                        className={`rounded-md px-3 py-1.5 text-xs ${activeTag === null ? "bg-accent/15 text-accent" : "border border-border text-ink-secondary hover:border-border-strong"
                            }`}
                    >
                        All
                    </button>
                    {allTags.map((tag) => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                            className={`rounded-md px-3 py-1.5 text-xs ${activeTag === tag ? "bg-accent/15 text-accent" : "border border-border text-ink-secondary hover:border-border-strong"
                                }`}
                        >
                            {tag}
                        </button>
                    ))}
                    <button
                        type="button"
                        onClick={() => setLinkedOnly((v) => !v)}
                        className={`rounded-md px-3 py-1.5 text-xs ${linkedOnly ? "bg-accent/15 text-accent" : "border border-border text-ink-secondary hover:border-border-strong"
                            }`}
                    >
                        Linked to trade
                    </button>
                </div>
            </div>

            <div className="mt-6">
                {filtered.length === 0 ? (
                    <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-border bg-surface p-6">
                        <p className="text-sm text-ink-muted">
                            {notes.length === 0 ? "No notes yet." : "No notes match your filters."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {filtered.map((note) => (
                            <NoteCard key={note.id} note={note} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}