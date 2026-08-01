"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

function shiftDate(date: string, days: number): string {
    const d = new Date(`${date}T00:00:00`);
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
}

function formatDisplayDate(date: string): string {
    const d = new Date(`${date}T00:00:00`);
    return d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" });
}

function todayIso(): string {
    return new Date().toISOString().slice(0, 10);
}

export default function DailyDateNav({ accountId, date }: { accountId: string; date: string }) {
    const router = useRouter();

    function go(nextDate: string) {
        router.push(`/daily?account=${accountId}&date=${nextDate}`);
    }

    return (
        <div className="flex items-center gap-3">
            <button
                type="button"
                onClick={() => go(shiftDate(date, -1))}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-ink-secondary hover:border-border-strong"
                aria-label="Previous day"
            >
                <ChevronLeft size={15} />
            </button>
            <div>
                <p className="text-lg font-medium">{formatDisplayDate(date)}</p>
            </div>
            <button
                type="button"
                onClick={() => go(shiftDate(date, 1))}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-ink-secondary hover:border-border-strong"
                aria-label="Next day"
            >
                <ChevronRight size={15} />
            </button>
            {date !== todayIso() && (
                <button
                    type="button"
                    onClick={() => go(todayIso())}
                    className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-ink-secondary hover:border-border-strong"
                >
                    Today
                </button>
            )}
        </div>
    );
}