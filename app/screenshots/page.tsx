import Link from "next/link";
import { ImageOff } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { getAccounts, getTrades } from "@/lib/queries";
import { formatUsd, pnlColor } from "@/lib/format";
import type { Direction } from "@/lib/types";

interface Shot {
    key: string;
    tradeId: string;
    kind: "Entry" | "Exit";
    url: string;
    date: string;
    instrument: string;
    direction: Direction;
    pnl: number;
}

const kindOptions = [
    { label: "All", value: "all" },
    { label: "Entry", value: "entry" },
    { label: "Exit", value: "exit" },
];

const outcomeOptions = [
    { label: "All", value: "all" },
    { label: "Winners", value: "win" },
    { label: "Losers", value: "loss" },
];

export default async function ScreenshotsPage({
    searchParams,
}: {
    searchParams: Promise<{ kind?: string; outcome?: string }>;
}) {
    const { kind = "all", outcome = "all" } = await searchParams;
    const [accounts, trades] = await Promise.all([getAccounts(), getTrades()]);

    const allShots: Shot[] = [];
    for (const t of trades) {
        if (t.entryScreenshotUrl) {
            allShots.push({
                key: `${t.id}-entry`,
                tradeId: t.id,
                kind: "Entry",
                url: t.entryScreenshotUrl,
                date: t.date,
                instrument: t.instrument,
                direction: t.direction,
                pnl: t.pnl,
            });
        }
        if (t.exitScreenshotUrl) {
            allShots.push({
                key: `${t.id}-exit`,
                tradeId: t.id,
                kind: "Exit",
                url: t.exitScreenshotUrl,
                date: t.date,
                instrument: t.instrument,
                direction: t.direction,
                pnl: t.pnl,
            });
        }
    }
    allShots.sort((a, b) => (a.date < b.date ? 1 : -1));

    const shots = allShots.filter((s) => {
        if (kind !== "all" && s.kind.toLowerCase() !== kind) return false;
        if (outcome === "win" && s.pnl <= 0) return false;
        if (outcome === "loss" && s.pnl >= 0) return false;
        return true;
    });

    const buildHref = (nextKind: string, nextOutcome: string) =>
        `/screenshots?kind=${nextKind}&outcome=${nextOutcome}`;

    return (
        <div className="flex min-h-screen bg-canvas text-ink-primary">
            <Sidebar accounts={accounts} />

            <main className="flex-1 pb-10">
                <header className="flex flex-wrap items-center justify-between gap-4 px-6 pt-6 pb-2 lg:px-8">
                    <div>
                        <h1 className="text-xl font-medium tracking-tight">Screenshots</h1>
                        <p className="mt-1 text-sm text-ink-muted">
                            {shots.length} screenshot{shots.length === 1 ? "" : "s"}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1 rounded-lg border border-border bg-surface p-1">
                            {kindOptions.map((o) => (
                                <Link
                                    key={o.value}
                                    href={buildHref(o.value, outcome)}
                                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${kind === o.value ? "bg-accent/15 text-accent" : "text-ink-muted hover:text-ink-secondary"
                                        }`}
                                >
                                    {o.label}
                                </Link>
                            ))}
                        </div>
                        <div className="flex items-center gap-1 rounded-lg border border-border bg-surface p-1">
                            {outcomeOptions.map((o) => (
                                <Link
                                    key={o.value}
                                    href={buildHref(kind, o.value)}
                                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${outcome === o.value ? "bg-accent/15 text-accent" : "text-ink-muted hover:text-ink-secondary"
                                        }`}
                                >
                                    {o.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </header>

                <div className="mx-6 mt-6 lg:mx-8">
                    {shots.length === 0 ? (
                        <div className="flex min-h-[300px] flex-col items-center justify-center gap-2 rounded-xl border border-border bg-surface p-6 text-center">
                            <ImageOff size={28} className="text-ink-muted" />
                            <p className="text-sm font-medium text-ink-secondary">
                                {allShots.length === 0 ? "No screenshots yet" : "No screenshots match this filter"}
                            </p>
                            <p className="text-xs text-ink-muted">
                                {allShots.length === 0
                                    ? "Attach entry/exit screenshots when logging a trade to see them here."
                                    : "Try a different filter."}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {shots.map((s) => (
                                <Link
                                    key={s.key}
                                    href={`/trades/${s.tradeId}`}
                                    className="group relative block overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-border-strong"
                                >
                                    <div className="aspect-[4/3] w-full overflow-hidden bg-canvas">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={s.url}
                                            alt={`${s.kind} screenshot for ${s.instrument} on ${s.date}`}
                                            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="absolute left-2 top-2 flex items-center gap-1.5">
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-[10px] font-medium text-white ${s.kind === "Entry" ? "bg-accent/90" : "bg-ink-muted/90"
                                                }`}
                                        >
                                            {s.kind}
                                        </span>
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-[10px] font-medium text-white ${s.direction === "Long" ? "bg-profit/90" : "bg-loss/90"
                                                }`}
                                        >
                                            {s.direction}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between px-3 py-2">
                                        <div>
                                            <p className="num text-xs text-ink-secondary">{s.instrument}</p>
                                            <p className="text-[10px] text-ink-muted">{s.date}</p>
                                        </div>
                                        <span className={`num text-xs font-medium ${pnlColor(s.pnl)}`}>
                                            {formatUsd(s.pnl, { sign: true })}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}