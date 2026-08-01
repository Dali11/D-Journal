"use client";

import { useFormState, useFormStatus } from "react-dom";
import { saveEndOfDay, type PhaseFormResult } from "@/lib/actions/dailyAnalysis";
import PhaseScreenshotsPanel from "./PhaseScreenshotsPanel";
import type { DailyAnalysis, DailyAnalysisScreenshot } from "@/lib/types";

const initialState: PhaseFormResult = { error: null };

const fieldClass =
    "w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-ink-primary outline-none focus:border-accent";

function SaveButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-60"
        >
            {pending ? "Saving..." : "Save end of day"}
        </button>
    );
}

export default function EndOfDayForm({
    accountId,
    date,
    analysis,
    screenshots,
}: {
    accountId: string;
    date: string;
    analysis: DailyAnalysis;
    screenshots: DailyAnalysisScreenshot[];
}) {
    const [state, formAction] = useFormState(saveEndOfDay, initialState);

    return (
        <div className="rounded-xl border border-border bg-surface p-5">
            <p className="mb-4 text-xs font-medium uppercase tracking-wide text-ink-muted">
                End of day
            </p>

            <form action={formAction} className="flex flex-col gap-4">
                <input type="hidden" name="accountId" value={accountId} />
                <input type="hidden" name="date" value={date} />

                <label className="flex flex-col gap-1.5">
                    <span className="text-xs text-ink-muted">What happened</span>
                    <textarea
                        name="whatHappened"
                        rows={3}
                        defaultValue={analysis.whatHappened}
                        placeholder="Summarize how the session actually went."
                        className={fieldClass}
                    />
                </label>

                <label className="flex flex-col gap-1.5">
                    <span className="text-xs text-ink-muted">Lessons</span>
                    <textarea name="lessons" rows={3} defaultValue={analysis.lessons} className={fieldClass} />
                </label>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-1.5">
                        <span className="text-xs text-ink-muted">What to repeat</span>
                        <textarea
                            name="whatToRepeat"
                            rows={2}
                            defaultValue={analysis.whatToRepeat}
                            className={fieldClass}
                        />
                    </label>
                    <label className="flex flex-col gap-1.5">
                        <span className="text-xs text-ink-muted">What to improve</span>
                        <textarea
                            name="whatToImprove"
                            rows={2}
                            defaultValue={analysis.whatToImprove}
                            className={fieldClass}
                        />
                    </label>
                </div>

                <PhaseScreenshotsPanel accountId={accountId} date={date} phase="end" screenshots={screenshots} />

                <div className="flex items-center gap-3 pt-1">
                    <SaveButton />
                    {state.error && <p className="text-sm text-loss">{state.error}</p>}
                    {state.error === null && "saved" in state && state.saved && (
                        <p className="text-sm text-profit">Saved.</p>
                    )}
                </div>
            </form>
        </div>
    );
}