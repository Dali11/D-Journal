"use client";

import { useMemo, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { createGoal, type GoalFormResult } from "@/lib/actions/goals";
import { GOAL_METRICS } from "@/lib/goals";
import type { GoalCategory, GoalDirection, GoalMetric, GoalPeriod } from "@/lib/types";

const initialState: GoalFormResult = { error: null };

const inputClass =
    "w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-ink-primary outline-none focus:border-accent";

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
    return (
        <label className="flex flex-col gap-1.5">
            <span className="text-xs text-ink-muted">{label}</span>
            {children}
            {hint && <span className="text-xs text-ink-muted">{hint}</span>}
        </label>
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
            {pending ? "Saving..." : "Add goal"}
        </button>
    );
}

const unitSuffix: Record<string, string> = { usd: "$", percent: "%", ratio: "R", count: "trades" };

export default function NewGoalForm({ accountId }: { accountId: string }) {
    const [state, formAction] = useFormState(createGoal, initialState);
    const router = useRouter();

    const [category, setCategory] = useState<GoalCategory>("performance");
    const metricsForCategory = useMemo(
        () =>
            (Object.entries(GOAL_METRICS) as [GoalMetric, (typeof GOAL_METRICS)[GoalMetric]][]).filter(
                ([, def]) => def.category === category
            ),
        [category]
    );
    const [metric, setMetric] = useState<GoalMetric>(metricsForCategory[0]![0]);
    const metricDef = GOAL_METRICS[metric];
    const [direction, setDirection] = useState<GoalDirection>(metricDef.defaultDirection);
    const [targetValue, setTargetValue] = useState<number>(metricDef.defaultTarget);
    const [period, setPeriod] = useState<GoalPeriod>("month");

    function onCategoryChange(next: GoalCategory) {
        setCategory(next);
        const first = (Object.entries(GOAL_METRICS) as [GoalMetric, (typeof GOAL_METRICS)[GoalMetric]][]).find(
            ([, def]) => def.category === next
        )!;
        setMetric(first[0]);
        setDirection(first[1].defaultDirection);
        setTargetValue(first[1].defaultTarget);
    }

    function onMetricChange(next: GoalMetric) {
        setMetric(next);
        const def = GOAL_METRICS[next];
        setDirection(def.defaultDirection);
        setTargetValue(def.defaultTarget);
    }

    return (
        <form action={formAction} className="rounded-xl border border-border bg-surface p-6">
            {state.error && (
                <div className="mb-6 rounded-lg border border-loss/40 bg-loss/10 px-4 py-3 text-sm text-loss">
                    {state.error}
                </div>
            )}

            <input type="hidden" name="accountId" value={accountId} />
            <input type="hidden" name="category" value={category} />
            <input type="hidden" name="metric" value={metric} />
            <input type="hidden" name="direction" value={direction} />
            <input type="hidden" name="period" value={period} />

            <div className="flex max-w-lg flex-col gap-4">
                <Field label="Goal type">
                    <div className="flex rounded-lg border border-border p-1 text-sm">
                        {(["performance", "process"] as GoalCategory[]).map((c) => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => onCategoryChange(c)}
                                className={`flex-1 rounded-md py-1.5 capitalize ${category === c ? "bg-accent/15 text-accent" : "text-ink-muted"
                                    }`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </Field>

                <Field label="Metric">
                    <select
                        value={metric}
                        onChange={(e) => onMetricChange(e.target.value as GoalMetric)}
                        className={inputClass}
                    >
                        {metricsForCategory.map(([value, def]) => (
                            <option key={value} value={value}>
                                {def.label}
                            </option>
                        ))}
                    </select>
                </Field>

                <Field label="Title" hint="A short label shown on the goal card.">
                    <input
                        name="title"
                        placeholder={`e.g. ${metricDef.label} this month`}
                        className={inputClass}
                        required
                    />
                </Field>

                <div className="flex gap-4">
                    <Field label="Direction">
                        <div className="flex rounded-lg border border-border p-1 text-sm">
                            <button
                                type="button"
                                onClick={() => setDirection("at_least")}
                                className={`flex-1 rounded-md py-1.5 ${direction === "at_least" ? "bg-accent/15 text-accent" : "text-ink-muted"
                                    }`}
                            >
                                At least
                            </button>
                            <button
                                type="button"
                                onClick={() => setDirection("at_most")}
                                className={`flex-1 rounded-md py-1.5 ${direction === "at_most" ? "bg-accent/15 text-accent" : "text-ink-muted"
                                    }`}
                            >
                                At most
                            </button>
                        </div>
                    </Field>

                    <Field label={`Target (${unitSuffix[metricDef.unit]})`}>
                        <input
                            type="number"
                            step="any"
                            name="targetValue"
                            value={targetValue}
                            onChange={(e) => setTargetValue(Number(e.target.value))}
                            className={inputClass}
                            required
                        />
                    </Field>
                </div>

                <Field label="Tracking period">
                    <div className="flex flex-wrap rounded-lg border border-border p-1 text-sm">
                        {(["week", "month", "quarter", "all", "custom"] as GoalPeriod[]).map((p) => (
                            <button
                                key={p}
                                type="button"
                                onClick={() => setPeriod(p)}
                                className={`flex-1 rounded-md px-2 py-1.5 capitalize ${period === p ? "bg-accent/15 text-accent" : "text-ink-muted"
                                    }`}
                            >
                                {p === "all" ? "All time" : p}
                            </button>
                        ))}
                    </div>
                </Field>

                {period === "custom" && (
                    <div className="flex gap-4">
                        <Field label="From">
                            <input type="date" name="fromDate" className={`${inputClass} [color-scheme:dark]`} required />
                        </Field>
                        <Field label="To">
                            <input type="date" name="toDate" className={`${inputClass} [color-scheme:dark]`} required />
                        </Field>
                    </div>
                )}
            </div>

            <div className="mt-6 flex items-center gap-3 border-t border-border pt-6">
                <SubmitButton />
                <button
                    type="button"
                    onClick={() => router.push("/goals")}
                    className="rounded-lg border border-border px-5 py-2.5 text-sm text-ink-secondary hover:border-border-strong"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}