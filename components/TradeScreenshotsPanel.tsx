"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { addTradeScreenshot, deleteTradeScreenshot, type ScreenshotFormResult } from "@/lib/actions/trades";
import type { TradeScreenshot } from "@/lib/types";

const initialState: ScreenshotFormResult = { error: null };

function AddButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-60"
        >
            {pending ? "Uploading..." : "Add screenshot"}
        </button>
    );
}

export default function TradeScreenshotsPanel({
    tradeId,
    screenshots,
}: {
    tradeId: string;
    screenshots: TradeScreenshot[];
}) {
    const [state, formAction] = useFormState(addTradeScreenshot, initialState);
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);
    const hasMounted = useRef(false);

    // Skip the very first render (initial state), refresh + reset only after
    // an actual successful submission.
    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
            return;
        }
        if (state.error === null) {
            formRef.current?.reset();
            router.refresh();
        }
    }, [state, router]);

    async function handleDelete(id: string) {
        if (!confirm("Remove this screenshot?")) return;
        await deleteTradeScreenshot(id, tradeId);
        router.refresh();
    }

    return (
        <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-wide text-ink-muted">
                Additional screenshots
            </p>

            {screenshots.length > 0 && (
                <div className="mb-5 flex flex-wrap gap-4">
                    {screenshots.map((s) => (
                        <div key={s.id} className="group relative">
                            <a href={s.url} target="_blank" rel="noopener noreferrer" className="block">
                                <p className="mb-1.5 text-xs text-ink-muted">{s.label}</p>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={s.url}
                                    alt={s.label}
                                    className="h-40 w-auto rounded-lg border border-border object-cover"
                                />
                            </a>
                            <button
                                type="button"
                                onClick={() => handleDelete(s.id)}
                                className="absolute right-1.5 top-6 rounded-full bg-canvas/90 p-1 text-ink-muted opacity-0 transition-opacity hover:text-loss group-hover:opacity-100"
                                aria-label="Remove screenshot"
                            >
                                <X size={13} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <form ref={formRef} action={formAction} className="flex flex-wrap items-end gap-2">
                <input type="hidden" name="tradeId" value={tradeId} />
                <div className="flex flex-col gap-1.5">
                    <span className="text-xs text-ink-muted">Label</span>
                    <input
                        name="label"
                        placeholder="e.g. Daily bias"
                        defaultValue="Screenshot"
                        className="rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-ink-primary outline-none focus:border-accent"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <span className="text-xs text-ink-muted">Image</span>
                    <input
                        type="file"
                        name="file"
                        accept="image/*"
                        required
                        className="text-sm text-ink-secondary file:mr-3 file:rounded-lg file:border file:border-border file:bg-canvas file:px-3 file:py-2 file:text-sm file:text-ink-primary hover:file:border-border-strong"
                    />
                </div>
                <AddButton />
            </form>

            {state.error && <p className="mt-2 text-sm text-loss">{state.error}</p>}
            <p className="mt-2 text-xs text-ink-muted">Attach as many as you want — no limit.</p>
        </div>
    );
}