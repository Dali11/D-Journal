"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import {
    addDailyAnalysisScreenshot,
    deleteDailyAnalysisScreenshot,
    type ScreenshotFormResult,
} from "@/lib/actions/dailyAnalysis";
import type { DailyAnalysisPhase, DailyAnalysisScreenshot } from "@/lib/types";

const initialState: ScreenshotFormResult = { error: null };

function UploadTile() {
    const { pending } = useFormStatus();
    return (
        <label
            className={`flex h-20 w-28 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border-strong text-ink-muted hover:border-accent hover:text-accent ${pending ? "opacity-50" : ""
                }`}
        >
            <Plus size={16} />
            <span className="text-[10px]">{pending ? "Uploading..." : "Add"}</span>
            <input
                type="file"
                name="file"
                accept="image/*"
                className="hidden"
                disabled={pending}
                onChange={(e) => e.currentTarget.form?.requestSubmit()}
            />
        </label>
    );
}

export default function PhaseScreenshotsPanel({
    accountId,
    date,
    phase,
    screenshots,
}: {
    accountId: string;
    date: string;
    phase: DailyAnalysisPhase;
    screenshots: DailyAnalysisScreenshot[];
}) {
    const [state, formAction] = useFormState(addDailyAnalysisScreenshot, initialState);
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);
    const hasMounted = useRef(false);

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
        await deleteDailyAnalysisScreenshot(id);
        router.refresh();
    }

    return (
        <div>
            <p className="mb-2 text-[11px] text-ink-muted">Chart context</p>
            <div className="flex flex-wrap items-start gap-3">
                {screenshots.map((s) => (
                    <div key={s.id} className="group relative">
                        <a href={s.url} target="_blank" rel="noopener noreferrer">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={s.url}
                                alt={s.label}
                                className="h-20 w-28 rounded-lg border border-border object-cover"
                            />
                        </a>
                        <button
                            type="button"
                            onClick={() => handleDelete(s.id)}
                            className="absolute right-1 top-1 rounded-full bg-canvas/90 p-0.5 text-ink-muted opacity-0 transition-opacity hover:text-loss group-hover:opacity-100"
                            aria-label="Remove screenshot"
                        >
                            <X size={12} />
                        </button>
                    </div>
                ))}

                <form ref={formRef} action={formAction}>
                    <input type="hidden" name="accountId" value={accountId} />
                    <input type="hidden" name="date" value={date} />
                    <input type="hidden" name="phase" value={phase} />
                    <input type="hidden" name="label" value="Screenshot" />
                    <UploadTile />
                </form>
            </div>
            {state.error && <p className="mt-2 text-xs text-loss">{state.error}</p>}
        </div>
    );
}