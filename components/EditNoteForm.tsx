"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { updateNote, deleteNote, type NoteFormResult } from "@/lib/actions/notes";
import type { Note, Trade } from "@/lib/types";
import { formatUsd } from "@/lib/format";

const initialState: NoteFormResult = { error: null };

const inputClass =
    "w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-ink-primary outline-none focus:border-accent";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-60"
        >
            {pending ? "Saving..." : "Save changes"}
        </button>
    );
}

export default function EditNoteForm({ note, trades }: { note: Note; trades: Trade[] }) {
    const [state, formAction] = useFormState(updateNote, initialState);
    const router = useRouter();

    async function handleDelete() {
        if (!confirm("Delete this note? This can't be undone.")) return;
        await deleteNote(note.id);
        router.push("/notes");
    }

    return (
        <form action={formAction} className="rounded-xl border border-border bg-surface p-6">
            {state.error && (
                <div className="mb-6 rounded-lg border border-loss/40 bg-loss/10 px-4 py-3 text-sm text-loss">
                    {state.error}
                </div>
            )}

            <input type="hidden" name="noteId" value={note.id} />

            <div className="flex max-w-lg flex-col gap-4">
                <label className="flex flex-col gap-1.5">
                    <span className="text-xs text-ink-muted">Title</span>
                    <input name="title" defaultValue={note.title} className={inputClass} required />
                </label>

                <label className="flex flex-col gap-1.5">
                    <span className="text-xs text-ink-muted">What happened</span>
                    <textarea name="body" rows={5} defaultValue={note.body} className={inputClass} />
                </label>

                <label className="flex flex-col gap-1.5">
                    <span className="text-xs text-ink-muted">Possible solutions / how to fix it</span>
                    <textarea
                        name="resolution"
                        rows={4}
                        defaultValue={note.resolution}
                        placeholder="What would you do differently next time?"
                        className={inputClass}
                    />
                </label>

                <label className="flex flex-col gap-1.5">
                    <span className="text-xs text-ink-muted">Tags</span>
                    <input name="tags" defaultValue={note.tags.join(", ")} className={inputClass} />
                    <span className="text-xs text-ink-muted">Comma-separated.</span>
                </label>

                <label className="flex flex-col gap-1.5">
                    <span className="text-xs text-ink-muted">Link to a trade (optional)</span>
                    <select name="tradeId" defaultValue={note.tradeId ?? ""} className={inputClass}>
                        <option value="">No trade linked</option>
                        {trades.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.date} · {t.instrument} · {formatUsd(t.pnl, { sign: true })}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="pinned"
                        defaultChecked={note.pinned}
                        className="h-4 w-4 rounded border-border accent-accent"
                    />
                    <span className="text-sm text-ink-secondary">Pin to top</span>
                </label>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-6">
                <div className="flex items-center gap-3">
                    <SubmitButton />
                    <button
                        type="button"
                        onClick={() => router.push("/notes")}
                        className="rounded-lg border border-border px-5 py-2.5 text-sm text-ink-secondary hover:border-border-strong"
                    >
                        Cancel
                    </button>
                </div>
                <button
                    type="button"
                    onClick={handleDelete}
                    className="rounded-lg px-4 py-2.5 text-sm text-loss hover:bg-loss/10"
                >
                    Delete note
                </button>
            </div>
        </form>
    );
}