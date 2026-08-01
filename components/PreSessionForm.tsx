"use client";

import { useFormState, useFormStatus } from "react-dom";
import { savePreSession, type PhaseFormResult } from "@/lib/actions/dailyAnalysis";
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
            {pending ? "Saving..." : "Save pre-session"}
        </button>
    );
}

export default function PreSessionForm({
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
    const [state, formAction] = useFormState(savePreSession, initialState);

    return (
        <div className="rounded-xl border border-border bg-surface p-5">
            <p className="mb-4 text-xs font-medium uppercase tracking-wide text-ink-muted">
                Pre-session analysis
            </p>

            <form action={formAction} className="flex flex-col gap-4">
                <input type="hidden" name="accountId" value={accountId} />
                <input type="hidden" name="date" value={date} />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-1.5">
                        <span className="text-xs text-ink-muted">HTF bias</span>
                        <input
                            name="htfBias"
                            defaultValue={analysis.htfBias}
                            placeholder="e.g. Bullish above 29,100"
                            className={fieldClass}
                        />
                    </label>
                    <label className="flex flex-col gap-1.5">
                        <span className="text-xs text-ink-muted">News / events today</span>
                        <input
                            name="newsEvents"
                            defaultValue={analysis.newsEvents}
                            placeholder="e.g. CPI at 8:30 AM"
                            className={fieldClass}
                        />
                    </label>
                </div>

                <label className="flex flex-col gap-1.5">
                    <span className="text-xs text-ink-muted">Key levels</span>
                    <textarea name="keyLevels" rows={2} defaultValue={analysis.keyLevels} className={fieldClass} />
                </label>

                <label className="flex flex-col gap-1.5">
                    <span className="text-xs text-ink-muted">Plan for today</span>
                    <textarea
                        name="plan"
                        rows={3}
                        defaultValue={analysis.plan}
                        placeholder="What setups are you looking for, and what will keep you disciplined?"
                        className={fieldClass}
                    />
                </label>

                <PhaseScreenshotsPanel accountId={accountId} date={date} phase="pre" screenshots={screenshots} />

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