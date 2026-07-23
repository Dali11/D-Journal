export interface RangeInfo {
    from: string; // ISO yyyy-mm-dd
    to: string; // ISO yyyy-mm-dd
    label: string;
    preset: string; // "week" | "last_week" | "month" | "last_month" | "last30" | "all" | "custom"
}

function pad(n: number): string {
    return String(n).padStart(2, "0");
}

function iso(d: Date): string {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function startOfWeek(d: Date): Date {
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay());
    return start;
}

const ALL_TIME_START = "2000-01-01";

export function resolveRange(params: {
    preset?: string;
    from?: string;
    to?: string;
}): RangeInfo {
    const now = new Date();
    const preset = params.preset ?? "month";

    if (preset === "custom" && params.from && params.to) {
        return { from: params.from, to: params.to, label: `${params.from} – ${params.to}`, preset: "custom" };
    }

    if (preset === "week") {
        const start = startOfWeek(now);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        return { from: iso(start), to: iso(end), label: "This week", preset };
    }

    if (preset === "last_week") {
        const start = startOfWeek(now);
        start.setDate(start.getDate() - 7);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        return { from: iso(start), to: iso(end), label: "Last week", preset };
    }

    if (preset === "last_month") {
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const end = new Date(now.getFullYear(), now.getMonth(), 0);
        return {
            from: iso(start),
            to: iso(end),
            label: start.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
            preset,
        };
    }

    if (preset === "quarter") {
        const q = Math.floor(now.getMonth() / 3);
        const start = new Date(now.getFullYear(), q * 3, 1);
        const end = new Date(now.getFullYear(), q * 3 + 3, 0);
        return { from: iso(start), to: iso(end), label: `Q${q + 1} ${now.getFullYear()}`, preset };
    }

    if (preset === "last30") {
        const end = now;
        const start = new Date(now);
        start.setDate(now.getDate() - 29);
        return { from: iso(start), to: iso(end), label: "Last 30 days", preset };
    }

    if (preset === "all") {
        return { from: ALL_TIME_START, to: iso(now), label: "All time", preset };
    }

    // default: "month" -> this calendar month
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return {
        from: iso(start),
        to: iso(end),
        label: start.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        preset: "month",
    };
}