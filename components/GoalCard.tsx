import { X } from "lucide-react";
import type { GoalProgress } from "@/lib/types";
import { GOAL_METRICS, formatMetricValue } from "@/lib/goals";
import { deleteGoal } from "@/lib/actions/goals";

const periodLabels: Record<string, string> = {
    week: "This week",
    month: "This month",
    quarter: "This quarter",
    all: "All time",
    custom: "Custom range",
};

export default function GoalCard({ progress }: { progress: GoalProgress }) {
    const { goal, currentValue, progressPct, achieved, tradesInPeriod } = progress;
    const def = GOAL_METRICS[goal.metric];
    const directionLabel = goal.direction === "at_least" ? "At least" : "At most";

    return (
        <div className="flex flex-col rounded-xl border border-border bg-surface p-5">
            <div className="flex items-start justify-between gap-2">
                <div>
                    <h3 className="text-sm font-medium text-ink-primary">{goal.title}</h3>
                    <p className="mt-0.5 text-xs text-ink-muted">
                        {def.label} · {directionLabel} {formatMetricValue(goal.metric, goal.targetValue)} ·{" "}
                        {goal.period === "custom" ? "Custom range" : periodLabels[goal.period]}
                    </p>
                </div>
                <form action={deleteGoal.bind(null, goal.id)}>
                    <button
                        type="submit"
                        className="rounded p-1 text-ink-muted hover:bg-surface-hover hover:text-loss"
                        aria-label="Delete goal"
                    >
                        <X size={14} />
                    </button>
                </form>
            </div>

            <div className="mt-4">
                <div className="flex items-baseline justify-between">
                    <p className={`num text-lg font-medium ${achieved ? "text-profit" : "text-ink-primary"}`}>
                        {formatMetricValue(goal.metric, currentValue)}
                    </p>
                    <p className="text-xs text-ink-muted">of {formatMetricValue(goal.metric, goal.targetValue)}</p>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-canvas">
                    <div
                        className={`h-full rounded-full ${achieved ? "bg-profit" : "bg-accent"}`}
                        style={{ width: `${progressPct}%` }}
                    />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs">
                    <span className={achieved ? "text-profit" : "text-ink-muted"}>
                        {achieved ? "Achieved" : "In progress"}
                    </span>
                    <span className="text-ink-muted">
                        {tradesInPeriod} trade{tradesInPeriod === 1 ? "" : "s"} in period
                    </span>
                </div>
            </div>
        </div>
    );
}