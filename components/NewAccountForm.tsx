"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { createAccount, type AccountFormResult } from "@/lib/actions/accounts";

const initialState: AccountFormResult = { error: null };

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
}: {
    label: string;
    children: React.ReactNode;
    required?: boolean;
}) {
    return (
        <label className="flex flex-col gap-1.5">
            <span className="text-xs text-ink-muted">
                {label}
                {required && <span className="text-loss"> *</span>}
            </span>
            {children}
        </label>
    );
}

const inputClass =
    "num w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-ink-primary outline-none focus:border-accent";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-60"
        >
            {pending ? "Saving..." : "Add account"}
        </button>
    );
}

export default function NewAccountForm() {
    const [state, formAction] = useFormState(createAccount, initialState);
    const router = useRouter();

    return (
        <form action={formAction} className="rounded-xl border border-border bg-surface p-6">
            {state.error && (
                <div className="mb-6 rounded-lg border border-loss/40 bg-loss/10 px-4 py-3 text-sm text-loss">
                    {state.error}
                </div>
            )}

            <div className="flex flex-col gap-4 max-w-md">
                <Field label="Account name" required>
                    <input name="name" placeholder="e.g. Tradeify Select 25K" className={inputClass} required />
                </Field>

                <Field label="Starting balance (USD)" required>
                    <input type="number" name="balance" step="0.01" placeholder="25000" className={inputClass} required />
                </Field>

                <Field label="Account type">
                    <div className="flex rounded-lg border border-border p-1 text-sm">
                        <label className="flex-1">
                            <input type="radio" name="stage" value="eval" defaultChecked className="peer sr-only" />
                            <span className="block cursor-pointer rounded-md py-1.5 text-center text-ink-muted peer-checked:bg-accent/15 peer-checked:text-accent">
                                Eval / Challenge
                            </span>
                        </label>
                        <label className="flex-1">
                            <input type="radio" name="stage" value="funded" className="peer sr-only" />
                            <span className="block cursor-pointer rounded-md py-1.5 text-center text-ink-muted peer-checked:bg-accent/15 peer-checked:text-accent">
                                Funded
                            </span>
                        </label>
                    </div>
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

                <div className="mt-2 border-t border-border pt-4">
                    <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-muted">
                        Prop-firm rules (optional)
                    </p>
                    <div className="flex flex-col gap-4">
                        <Field label="Consistency rule (%)">
                            <input type="number" name="consistencyRule" defaultValue={40} className={inputClass} />
                        </Field>
                        <Field label="Profit target (USD)">
                            <input type="number" name="profitTarget" step="0.01" placeholder="3000" className={inputClass} />
                        </Field>
                        <Field label="Max daily loss (USD)">
                            <input type="number" name="maxDailyLoss" step="0.01" placeholder="1000" className={inputClass} />
                        </Field>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center gap-3 border-t border-border pt-6">
                <SubmitButton />
                <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="rounded-lg border border-border px-5 py-2.5 text-sm text-ink-secondary hover:border-border-strong"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}