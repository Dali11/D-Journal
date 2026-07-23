"use client";

import { useFormState, useFormStatus } from "react-dom";
import { saveReportReflection, type ReportFormResult } from "@/lib/actions/reports";

const initialState: ReportFormResult = { error: null };

const fieldClass =
    "rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-ink-primary outline-none focus:border-accent print:border-none print:bg-transparent print:p-0 print:text-black";

function SaveButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-60 print:hidden"
        >
            {pending ? "Saving…" : "Save reflection"}
        </button>
    );
}

export default function ReportReflectionForm({
    accountId,
    from,
    to,
    initial,
}: {
    accountId: string;
    from: string;
    to: string;
    initial: { title: string; whatWentWell: string; whatToImprove: string; focusNext: string };
}) {
    const [state, formAction] = useFormState(saveReportReflection, initialState);

    return (
        <form
            action={formAction}
            className="rounded-xl border border-border bg-surface p-6 print:border-none print:bg-transparent print:p-0"
        >
            <input type="hidden" name="accountId" value={accountId} />
            <input type="hidden" name="fromDate" value={from} />
            <input type="hidden" name="toDate" value={to} />

            <div className="flex flex-col gap-4">
                <label className="flex flex-col gap-1.5">
                    <span className="text-xs text-ink-muted print:hidden">Report title</span>
                    <input
                        name="title"
                        defaultValue={initial.title}
                        placeholder="e.g. Week of July 21"
                        className={`${fieldClass} print:text-lg print:font-medium`}
                    />
                </label>

                <label className="flex flex-col gap-1.5">
                    <span className="text-xs text-ink-muted">What went well</span>
                    <textarea name="whatWentWell" rows={3} defaultValue={initial.whatWentWell} className={fieldClass} />
                </label>

                <label className="flex flex-col gap-1.5">
                    <span className="text-xs text-ink-muted">What to improve</span>
                    <textarea name="whatToImprove" rows={3} defaultValue={initial.whatToImprove} className={fieldClass} />
                </label>

                <label className="flex flex-col gap-1.5">
                    <span className="text-xs text-ink-muted">Focus for next period</span>
                    <textarea name="focusNext" rows={3} defaultValue={initial.focusNext} className={fieldClass} />
                </label>
            </div>

            <div className="mt-4 flex items-center gap-3 print:hidden">
                <SaveButton />
                {state.error && <p className="text-sm text-loss">{state.error}</p>}
                {state.saved && !state.error && <p className="text-sm text-profit">Saved.</p>}
            </div>
        </form>
    );
}
