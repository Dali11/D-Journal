"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { updateTrade, type TradeFormResult } from "@/lib/actions/trades";
import type { Account, Setup, Trade } from "@/lib/types";

const initialState: TradeFormResult = { error: null };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="flex flex-col gap-1.5">
            <span className="text-xs text-ink-muted">{label}</span>
            {children}
        </label>
    );
}

const inputClass =
    "num w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-ink-primary outline-none focus:border-accent";
const selectClass =
    "w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-ink-primary outline-none focus:border-accent";

function SectionCard({ index, title, children }: { index: number; title: string; children: React.ReactNode }) {
    return (
        <div className="flex-1 min-w-[220px]">
            <p className="mb-4 text-xs font-medium uppercase tracking-wide text-ink-muted">
                {index}. {title}
            </p>
            <div className="flex flex-col gap-4">{children}</div>
        </div>
    );
}

function SaveButton() {
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

export default function EditTradeForm({
    trade,
    accounts,
    setups = [],
    onCancel,
    onSaved,
}: {
    trade: Trade;
    accounts: Account[];
    setups?: Setup[];
    onCancel: () => void;
    onSaved: () => void;
}) {
    const [state, formAction] = useFormState(updateTrade, initialState);
    const hasMounted = useRef(false);

    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
            return;
        }
        if (state.error === null) {
            onSaved();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

    return (
        <form action={formAction} className="rounded-xl border border-border bg-surface p-6">
            {state.error && (
                <div className="mb-6 rounded-lg border border-loss/40 bg-loss/10 px-4 py-3 text-sm text-loss">
                    {state.error}
                </div>
            )}

            <input type="hidden" name="tradeId" value={trade.id} />

            <div className="flex flex-wrap gap-8">
                <SectionCard index={1} title="Trade information">
                    <Field label="Date">
                        <input type="date" name="date" defaultValue={trade.date} className={inputClass} required />
                    </Field>
                    <Field label="Account">
                        <select name="accountId" defaultValue={trade.accountId} className={selectClass} required>
                            {accounts.map((a) => (
                                <option key={a.id} value={a.id}>
                                    {a.name}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Instrument">
                        <input name="instrument" defaultValue={trade.instrument} className={inputClass} required />
                    </Field>
                    <Field label="Instrument label">
                        <input name="instrumentLabel" defaultValue={trade.instrumentLabel} className={inputClass} />
                    </Field>
                    <Field label="Session">
                        <input name="session" defaultValue={trade.session} className={inputClass} />
                    </Field>
                    <Field label="Session time">
                        <input name="sessionTime" defaultValue={trade.sessionTime} className={inputClass} />
                    </Field>
                    <Field label="Entry time">
                        <input type="time" step="1" name="entryTime" defaultValue={trade.entryTime} className={inputClass} />
                    </Field>
                    <Field label="Exit time">
                        <input type="time" step="1" name="exitTime" defaultValue={trade.exitTime} className={inputClass} />
                    </Field>
                </SectionCard>

                <SectionCard index={2} title="Execution">
                    <Field label="Direction">
                        <select name="direction" defaultValue={trade.direction} className={selectClass} required>
                            <option value="Long">Long</option>
                            <option value="Short">Short</option>
                        </select>
                    </Field>
                    <Field label="Contracts">
                        <input type="number" name="contracts" step="1" min="1" defaultValue={trade.contracts} className={inputClass} required />
                    </Field>
                    <Field label="Entry price">
                        <input type="number" name="entryPrice" step="0.01" defaultValue={trade.entryPrice} className={inputClass} required />
                    </Field>
                    <Field label="Exit price">
                        <input type="number" name="exitPrice" step="0.01" defaultValue={trade.exitPrice} className={inputClass} required />
                    </Field>
                    <Field label="Risk (USD)">
                        <input type="number" name="riskUsd" step="0.01" defaultValue={trade.riskUsd} className={inputClass} />
                    </Field>
                    <Field label="Risk (pts)">
                        <input type="number" name="riskPts" step="0.01" defaultValue={trade.riskPts} className={inputClass} />
                    </Field>
                    <Field label="Reward (USD)">
                        <input type="number" name="rewardUsd" step="0.01" defaultValue={trade.rewardUsd} className={inputClass} />
                    </Field>
                    <Field label="Reward (pts)">
                        <input type="number" name="rewardPts" step="0.01" defaultValue={trade.rewardPts} className={inputClass} />
                    </Field>
                    <Field label="R:R achieved">
                        <input type="number" name="rrAchieved" step="0.01" defaultValue={trade.rrAchieved} className={inputClass} />
                    </Field>
                    <Field label="P&L (USD)">
                        <input type="number" name="pnl" step="0.01" defaultValue={trade.pnl} className={inputClass} required />
                    </Field>
                    <Field label="Intraday low (USD)">
                        <input
                            type="number"
                            name="intradayLow"
                            step="0.01"
                            defaultValue={trade.intradayLow ?? ""}
                            placeholder="Only if worse than close"
                            className={inputClass}
                        />
                    </Field>
                </SectionCard>

                <SectionCard index={3} title="Setup checklist">
                    <Field label="Setup name">
                        <input name="setup" list="setup-options" defaultValue={trade.setup ?? ""} className={inputClass} />
                        <datalist id="setup-options">
                            {setups.map((s) => (
                                <option key={s.id} value={s.name} />
                            ))}
                        </datalist>
                    </Field>
                    <Field label="A+ setup?">
                        <select name="aPlusSetup" defaultValue={trade.aPlusSetup} className={selectClass}>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </Field>
                    <Field label="Trend direction">
                        <select name="trendDirection" defaultValue={trade.trendDirection} className={selectClass}>
                            <option value="Uptrend">Uptrend</option>
                            <option value="Downtrend">Downtrend</option>
                            <option value="Range">Range</option>
                        </select>
                    </Field>
                    <Field label="HTF bias">
                        <select name="htfBias" defaultValue={trade.htfBias} className={selectClass}>
                            <option value="Bullish">Bullish</option>
                            <option value="Bearish">Bearish</option>
                            <option value="Neutral">Neutral</option>
                        </select>
                    </Field>
                    <Field label="Entry confirmation">
                        <select name="entryConfirmation" defaultValue={trade.entryConfirmation} className={selectClass}>
                            <option value="Valid">Valid</option>
                            <option value="Invalid">Invalid</option>
                        </select>
                    </Field>
                    <Field label="News nearby?">
                        <select name="newsNearby" defaultValue={trade.newsNearby} className={selectClass}>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </Field>
                    <Field label="Grade">
                        <select name="grade" defaultValue={trade.grade} className={selectClass}>
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
                        <input type="number" name="confidenceBefore" min="1" max="10" defaultValue={trade.confidenceBefore} className={inputClass} />
                    </Field>
                    <Field label="Emotions before">
                        <input name="emotionsBefore" defaultValue={trade.emotionsBefore} className={inputClass} />
                    </Field>
                    <Field label="Emotions after">
                        <input name="emotionsAfter" defaultValue={trade.emotionsAfter} className={inputClass} />
                    </Field>
                    <Field label="Followed plan?">
                        <select name="followedPlan" defaultValue={trade.followedPlan} className={selectClass}>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </Field>
                    <Field label="Revenge trade?">
                        <select name="revengeTrade" defaultValue={trade.revengeTrade} className={selectClass}>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </Field>
                    <Field label="FOMO?">
                        <select name="fomo" defaultValue={trade.fomo} className={selectClass}>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </Field>
                    <Field label="Notes">
                        <textarea name="notes" rows={3} defaultValue={trade.notes} className={inputClass} />
                    </Field>
                </SectionCard>
            </div>

            <div className="mt-6 border-t border-border pt-6">
                <p className="mb-4 text-xs font-medium uppercase tracking-wide text-ink-muted">
                    5. Screenshots
                </p>
                <div className="flex flex-wrap gap-6">
                    <Field label="Replace entry screenshot">
                        <input
                            type="file"
                            name="entryScreenshot"
                            accept="image/*"
                            className="w-full text-sm text-ink-secondary file:mr-3 file:rounded-lg file:border file:border-border file:bg-canvas file:px-3 file:py-2 file:text-sm file:text-ink-primary hover:file:border-border-strong"
                        />
                    </Field>
                    <Field label="Replace exit screenshot">
                        <input
                            type="file"
                            name="exitScreenshot"
                            accept="image/*"
                            className="w-full text-sm text-ink-secondary file:mr-3 file:rounded-lg file:border file:border-border file:bg-canvas file:px-3 file:py-2 file:text-sm file:text-ink-primary hover:file:border-border-strong"
                        />
                    </Field>
                </div>
                <p className="mt-2 text-xs text-ink-muted">Leave blank to keep the existing image.</p>
            </div>

            <div className="mt-6 flex items-center gap-3 border-t border-border pt-6">
                <SaveButton />
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-lg border border-border px-5 py-2.5 text-sm text-ink-secondary hover:border-border-strong"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}