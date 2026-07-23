"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const presets = [
    { value: "week", label: "This week" },
    { value: "last_week", label: "Last week" },
    { value: "month", label: "This month" },
    { value: "last_month", label: "Last month" },
    { value: "last30", label: "Last 30 days" },
    { value: "all", label: "All time" },
];

export default function ReportRangePicker({
    accountId,
    preset,
    from,
    to,
}: {
    accountId: string;
    preset: string;
    from: string;
    to: string;
}) {
    const router = useRouter();
    const [customFrom, setCustomFrom] = useState(from);
    const [customTo, setCustomTo] = useState(to);

    function go(p: string, f?: string, t?: string) {
        const query = new URLSearchParams({ account: accountId, preset: p });
        if (p === "custom" && f && t) {
            query.set("from", f);
            query.set("to", t);
        }
        router.push(`/reports?${query.toString()}`);
    }

    return (
        <div className="flex flex-wrap items-center gap-2 print:hidden">
            <div className="flex flex-wrap items-center gap-1 rounded-lg border border-border bg-surface p-1">
                {presets.map((p) => (
                    <button
                        key={p.value}
                        type="button"
                        onClick={() => go(p.value)}
                        className={`rounded-md px-3 py-1.5 text-sm ${preset === p.value ? "bg-accent/15 text-accent" : "text-ink-secondary hover:text-ink-primary"
                            }`}
                    >
                        {p.label}
                    </button>
                ))}
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-2 py-1.5">
                <input
                    type="date"
                    value={customFrom}
                    onChange={(e) => setCustomFrom(e.target.value)}
                    className="rounded bg-transparent px-1 text-sm text-ink-secondary outline-none [color-scheme:dark]"
                />
                <span className="text-ink-muted">–</span>
                <input
                    type="date"
                    value={customTo}
                    onChange={(e) => setCustomTo(e.target.value)}
                    className="rounded bg-transparent px-1 text-sm text-ink-secondary outline-none [color-scheme:dark]"
                />
                <button
                    type="button"
                    onClick={() => go("custom", customFrom, customTo)}
                    className={`rounded-md px-2 py-1 text-sm ${preset === "custom" ? "bg-accent/15 text-accent" : "text-ink-secondary hover:text-ink-primary"
                        }`}
                >
                    Apply
                </button>
            </div>
        </div>
    );
}
