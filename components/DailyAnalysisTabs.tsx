"use client";

import { useState } from "react";
import { Sunrise, Clock, Flag } from "lucide-react";
import PreSessionForm from "./PreSessionForm";
import MidSessionForm from "./MidSessionForm";
import EndOfDayForm from "./EndOfDayForm";
import type { DailyAnalysis, DailyAnalysisScreenshot } from "@/lib/types";

type Phase = "pre" | "mid" | "end";

const tabs: { value: Phase; label: string; icon: typeof Sunrise }[] = [
    { value: "pre", label: "Pre-session", icon: Sunrise },
    { value: "mid", label: "Mid-session", icon: Clock },
    { value: "end", label: "End of day", icon: Flag },
];

export default function DailyAnalysisTabs({
    accountId,
    date,
    analysis,
    screenshotsByPhase,
}: {
    accountId: string;
    date: string;
    analysis: DailyAnalysis;
    screenshotsByPhase: Record<Phase, DailyAnalysisScreenshot[]>;
}) {
    const [active, setActive] = useState<Phase>("pre");

    const filledPhase: Record<Phase, boolean> = {
        pre: Boolean(analysis.htfBias || analysis.keyLevels || analysis.newsEvents || analysis.plan),
        mid: Boolean(analysis.marketUpdate || analysis.emotionalState || analysis.deviations),
        end: Boolean(analysis.whatHappened || analysis.lessons || analysis.whatToRepeat || analysis.whatToImprove),
    };

    return (
        <div>
            <div className="mb-4 flex gap-2">
                {tabs.map(({ value, label, icon: Icon }) => (
                    <button
                        key={value}
                        type="button"
                        onClick={() => setActive(value)}
                        className={`flex flex-1 items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors ${active === value
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-border bg-surface text-ink-secondary hover:border-border-strong"
                            }`}
                    >
                        <Icon size={15} className={filledPhase[value] && active !== value ? "text-profit" : ""} />
                        {label}
                    </button>
                ))}
            </div>

            {active === "pre" && (
                <PreSessionForm
                    accountId={accountId}
                    date={date}
                    analysis={analysis}
                    screenshots={screenshotsByPhase.pre}
                />
            )}
            {active === "mid" && (
                <MidSessionForm
                    accountId={accountId}
                    date={date}
                    analysis={analysis}
                    screenshots={screenshotsByPhase.mid}
                />
            )}
            {active === "end" && (
                <EndOfDayForm
                    accountId={accountId}
                    date={date}
                    analysis={analysis}
                    screenshots={screenshotsByPhase.end}
                />
            )}
        </div>
    );
}