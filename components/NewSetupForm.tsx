"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { createSetup, SetupFormResult } from "@/lib/actions/setups";


const initialState: SetupFormResult = { error: null };

const colorOptions = [
    { label: "Purple", value: "#7C6CF2" },
    { label: "Green", value: "#2FD68A" },
    { label: "Violet", value: "#B980F0" },
    { label: "Blue", value: "#4EA1F5" },
    { label: "Amber", value: "#E8A33D" },
    { label: "Red", value: "#F5566B" },
];

function Field({
    label,
    children,
    required = false,
    hint,
}: {
    label: string;
    children: React.ReactNode;
    required?: boolean;
    hint?: string;
}) {
    return (
        <label className="flex flex-col gap-1.5">
            <span className="text-xs text-ink-muted">
                {label}
                {required && <span className="text-loss"> *</span>}
            </span>
            {children}
            {hint && <span className="text-xs text-ink-muted">{hint}</span>}
        </label>
    );
}

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
            {pending ? "Saving..." : "Add setup"}
        </button>
    );
}

export default function NewSetupForm() {
    const [state, formAction] = useFormState(createSetup, initialState);
    const router = useRouter();

    return (
        <form action={formAction} className="rounded-xl border border-border bg-surface p-6">
            {state.error && (
                <div className="mb-6 rounded-lg border border-loss/40 bg-loss/10 px-4 py-3 text-sm text-loss">
                    {state.error}
                </div>
            )}

            <div className="flex max-w-md flex-col gap-4">
                <Field label="Setup name" required hint="This should match what you type into the trade log's Setup field.">
                    <input name="name" placeholder="e.g. Trend continuation" className={inputClass} required />
                </Field>

                <Field label="Description">
                    <textarea
                        name="description"
                        rows={3}
                        placeholder="What is this setup and when does it apply?"
                        className={inputClass}
                    />
                </Field>

                <Field label="Entry criteria" hint="One rule per line — shown as a checklist.">
                    <textarea
                        name="criteria"
                        rows={4}
                        placeholder={"HTF bias aligned with direction\nValid entry confirmation\nNo major news in next 30 min"}
                        className={inputClass}
                    />
                </Field>

                <Field label="Color">
                    <div className="flex flex-wrap gap-2">
                        {colorOptions.map((c, i) => (
                            <label key={c.value} className="flex cursor-pointer items-center gap-1.5">
                                <input
                                    type="radio"
                                    name="color"
                                    value={c.value}
                                    defaultChecked={i === 0}
                                    className="peer sr-only"
                                />
                                <span
                                    className="h-6 w-6 rounded-full border-2 border-transparent peer-checked:border-white"
                                    style={{ backgroundColor: c.value }}
                                    title={c.label}
                                />
                            </label>
                        ))}
                    </div>
                </Field>
            </div>

            <div className="mt-6 flex items-center gap-3 border-t border-border pt-6">
                <SubmitButton />
                <button
                    type="button"
                    onClick={() => router.push("/setups")}
                    className="rounded-lg border border-border px-5 py-2.5 text-sm text-ink-secondary hover:border-border-strong"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}