"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { createTrade, type TradeFormResult } from "@/lib/actions/trades";
import type { Account, Setup } from "@/lib/types";

const initialState: TradeFormResult = { error: null };

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

const selectClass =
    "w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-ink-primary outline-none focus:border-accent";

function SectionCard({
    index,
    title,
    children,
}: {
    index: number;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex-1 min-w-[220px]">
            <p className="mb-4 text-xs font-medium uppercase tracking-wide text-ink-muted">
                {index}. {title}
            </p>
            <div className="flex flex-col gap-4">{children}</div>
        </div>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-60"
        >
            {pending ? "Saving..." : "Save trade"}
        </button>
    );
}

export default function NewTradeForm({ accounts, setups = [] }: { accounts: Account[]; setups?: Setup[] }) {
    const [state, formAction] = useFormState(createTrade, initialState);
    const router = useRouter();
    const today = new Date().toISOString().slice(0, 10);

    return (
        <form action={formAction} className="rounded-xl border border-border bg-surface p-6">
            {state.error && (
                <div className="mb-6 rounded-lg border border-loss/40 bg-loss/10 px-4 py-3 text-sm text-loss">
                    {state.error}
                </div>
            )}

            <div className="flex flex-wrap gap-8">
                <SectionCard index={1} title="Trade information">
                    <Field label="Date" required>
                        <input type="date" name="date" defaultValue={today} className={inputClass} required />
                    </Field>
                    <Field label="Account" required>
                        <select name="accountId" className={selectClass} required defaultValue="">
                            <option value="" disabled>
                                Select account
                            </option>
                            {accounts.map((a) => (
                                <option key={a.id} value={a.id}>
                                    {a.name}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Instrument" required>
                        <input name="instrument" placeholder="e.g. MNQ" className={inputClass} required />
                    </Field>
                    <Field label="Instrument label">
                        <input
                            name="instrumentLabel"
                            placeholder="e.g. Micro E-mini NASDAQ-100"
                            className={inputClass}
                        />
                    </Field>
                    <Field label="Session">
                        <input name="session" placeholder="e.g. NY AM" className={inputClass} />
                    </Field>
                    <Field label="Session time">
                        <input
                            name="sessionTime"
                            placeholder="e.g. 8:30 AM – 11:30 AM"
                            className={inputClass}
                        />
                    </Field>
                    <Field label="Entry time">
                        <input type="time" step="1" name="entryTime" className={inputClass} />
                    </Field>
                    <Field label="Exit time">
                        <input type="time" step="1" name="exitTime" className={inputClass} />
                    </Field>
                </SectionCard>

                <SectionCard index={2} title="Execution">
                    <Field label="Direction" required>
                        <select name="direction" className={selectClass} required defaultValue="">
                            <option value="" disabled>
                                Select direction
                            </option>
                            <option value="Long">Long</option>
                            <option value="Short">Short</option>
                        </select>
                    </Field>
                    <Field label="Contracts" required>
                        <input type="number" name="contracts" step="1" min="1" defaultValue={1} className={inputClass} required />
                    </Field>
                    <Field label="Entry price" required>
                        <input type="number" name="entryPrice" step="0.01" className={inputClass} required />
                    </Field>
                    <Field label="Exit price" required>
                        <input type="number" name="exitPrice" step="0.01" className={inputClass} required />
                    </Field>
                    <Field label="Risk (USD)">
                        <input type="number" name="riskUsd" step="0.01" className={inputClass} />
                    </Field>
                    <Field label="Risk (pts)">
                        <input type="number" name="riskPts" step="0.01" className={inputClass} />
                    </Field>
                    <Field label="Reward (USD)">
                        <input type="number" name="rewardUsd" step="0.01" className={inputClass} />
                    </Field>
                    <Field label="Reward (pts)">
                        <input type="number" name="rewardPts" step="0.01" className={inputClass} />
                    </Field>
                    <Field label="R:R achieved">
                        <input type="number" name="rrAchieved" step="0.01" className={inputClass} />
                    </Field>
                    <Field label="P&L (USD)" required>
                        <input type="number" name="pnl" step="0.01" className={inputClass} required />
                    </Field>
                </SectionCard>

                <SectionCard index={3} title="Setup checklist">
                    <Field label="Setup name">
                        <input
                            name="setup"
                            list="setup-options"
                            placeholder="e.g. Trend continuation"
                            className={inputClass}
                        />
                        <datalist id="setup-options">
                            {setups.map((s) => (
                                <option key={s.id} value={s.name} />
                            ))}
                        </datalist>
                    </Field>
                    <Field label="A+ setup?">
                        <select name="aPlusSetup" className={selectClass} defaultValue="">
                            <option value="">—</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </Field>
                    <Field label="Trend direction">
                        <select name="trendDirection" className={selectClass} defaultValue="">
                            <option value="">—</option>
                            <option value="Uptrend">Uptrend</option>
                            <option value="Downtrend">Downtrend</option>
                            <option value="Range">Range</option>
                        </select>
                    </Field>
                    <Field label="HTF bias">
                        <select name="htfBias" className={selectClass} defaultValue="">
                            <option value="">—</option>
                            <option value="Bullish">Bullish</option>
                            <option value="Bearish">Bearish</option>
                            <option value="Neutral">Neutral</option>
                        </select>
                    </Field>
                    <Field label="Entry confirmation">
                        <select name="entryConfirmation" className={selectClass} defaultValue="">
                            <option value="">—</option>
                            <option value="Valid">Valid</option>
                            <option value="Invalid">Invalid</option>
                        </select>
                    </Field>
                    <Field label="News nearby?">
                        <select name="newsNearby" className={selectClass} defaultValue="">
                            <option value="">—</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </Field>
                    <Field label="Grade">
                        <select name="grade" className={selectClass} defaultValue="">
                            <option value="">—</option>
                            {["A", "B", "C", "D", "F"].map((g) => (
                                <option key={g} value={g}>
                                    {g}
                                </option>
                            ))}
                        </select>
                    </Field>
                </SectionCard>

                <SectionCard index={4} title="Psychology">
                    <Field label="Confidence before (1–10)">
                        <input type="number" name="confidenceBefore" min="1" max="10" className={inputClass} />
                    </Field>
                    <Field label="Emotions before">
                        <input name="emotionsBefore" placeholder="e.g. Calm, Focused" className={inputClass} />
                    </Field>
                    <Field label="Emotions after">
                        <input name="emotionsAfter" placeholder="e.g. Satisfied" className={inputClass} />
                    </Field>
                    <Field label="Followed plan?">
                        <select name="followedPlan" className={selectClass} defaultValue="">
                            <option value="">—</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </Field>
                    <Field label="Revenge trade?">
                        <select name="revengeTrade" className={selectClass} defaultValue="">
                            <option value="">—</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </Field>
                    <Field label="FOMO?">
                        <select name="fomo" className={selectClass} defaultValue="">
                            <option value="">—</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </Field>
                    <Field label="Notes">
                        <textarea name="notes" rows={3} className={`${inputClass} font-sans`} />
                    </Field>
                </SectionCard>

                <SectionCard index={5} title="Screenshots">
                    <Field label="Entry screenshot">
                        <input
                            type="file"
                            name="entryScreenshot"
                            accept="image/*"
                            className="w-full text-sm text-ink-secondary file:mr-3 file:rounded-lg file:border file:border-border file:bg-canvas file:px-3 file:py-2 file:text-sm file:text-ink-primary hover:file:border-border-strong"
                        />
                    </Field>
                    <Field label="Exit screenshot">
                        <input
                            type="file"
                            name="exitScreenshot"
                            accept="image/*"
                            className="w-full text-sm text-ink-secondary file:mr-3 file:rounded-lg file:border file:border-border file:bg-canvas file:px-3 file:py-2 file:text-sm file:text-ink-primary hover:file:border-border-strong"
                        />
                    </Field>
                </SectionCard>
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