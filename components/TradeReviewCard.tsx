import { Copy } from "lucide-react";
import type { Account, Trade } from "@/lib/types";
import { formatUsd, pnlColor } from "@/lib/format";

function formatDateDisplay(iso: string) {
    const [y, m, d] = iso.split("-");
    return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function StatChip({ label, value, valueClass = "" }: { label: string; value: string; valueClass?: string }) {
    return (
        <div className="rounded-lg border border-border bg-canvas p-3">
            <p className="text-[11px] text-ink-muted">{label}</p>
            <p className={`num mt-1 text-sm ${valueClass}`}>{value}</p>
        </div>
    );
}

function Pill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "profit" | "loss" | "muted" }) {
    const toneClass =
        tone === "profit"
            ? "border-profit/30 text-profit"
            : tone === "loss"
                ? "border-loss/30 text-loss"
                : tone === "muted"
                    ? "border-border text-ink-muted"
                    : "border-border-strong text-ink-secondary";
    return (
        <span className={`rounded-md border px-2.5 py-1 text-xs ${toneClass}`}>
            {children}
        </span>
    );
}

export default function TradeReviewCard({
    trade,
    accounts,
}: {
    trade: Trade;
    accounts: Account[];
}) {
    const account = accounts.find((a) => a.id === trade.accountId);

    return (
        <div className="flex flex-col gap-4">
            {/* Hero */}
            <div className="rounded-xl border border-border bg-surface p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="num text-base font-medium">{trade.instrument}</span>
                            <Pill tone={trade.direction === "Long" ? "profit" : "loss"}>{trade.direction}</Pill>
                            {trade.grade && <Pill>Grade {trade.grade}</Pill>}
                        </div>
                        <p className="mt-1.5 text-sm text-ink-muted">
                            {formatDateDisplay(trade.date)} · {account?.name ?? "Unknown account"}
                            {trade.session && ` · ${trade.session}`}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className={`num text-3xl font-medium ${pnlColor(trade.pnl)}`}>
                            {formatUsd(trade.pnl, { sign: true })}
                        </p>
                        {trade.rrAchieved !== 0 && (
                            <p className="mt-1 text-xs text-ink-muted">{trade.rrAchieved}R achieved</p>
                        )}
                    </div>
                </div>
                <button className="mt-4 flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink-secondary">
                    ID: {trade.id}
                    <Copy size={12} />
                </button>
            </div>

            {/* Stat strip */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                <StatChip label="Entry" value={String(trade.entryPrice)} />
                <StatChip label="Exit" value={String(trade.exitPrice)} />
                <StatChip label="Contracts" value={String(trade.contracts)} />
                <StatChip label="Risk" value={formatUsd(trade.riskUsd)} valueClass="text-loss" />
                <StatChip label="Reward" value={formatUsd(trade.rewardUsd)} valueClass="text-profit" />
                <StatChip
                    label="Intraday low"
                    value={trade.intradayLow !== null ? formatUsd(trade.intradayLow, { sign: true }) : "—"}
                    valueClass={trade.intradayLow !== null ? "text-loss" : "text-ink-muted"}
                />
            </div>

            {/* Setup context */}
            <div className="rounded-xl border border-border bg-surface p-5">
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-muted">
                    Setup context
                </p>
                <div className="flex flex-wrap gap-2">
                    {trade.setup && <Pill>{trade.setup}</Pill>}
                    <Pill tone={trade.aPlusSetup === "Yes" ? "profit" : "muted"}>
                        {trade.aPlusSetup === "Yes" ? "A+ setup" : "Not A+ setup"}
                    </Pill>
                    <Pill>{trade.trendDirection}</Pill>
                    <Pill tone={trade.htfBias === "Bullish" ? "profit" : trade.htfBias === "Bearish" ? "loss" : "neutral"}>
                        {trade.htfBias} HTF
                    </Pill>
                    <Pill tone={trade.entryConfirmation === "Valid" ? "profit" : "loss"}>
                        {trade.entryConfirmation} entry
                    </Pill>
                    <Pill tone={trade.newsNearby === "Yes" ? "loss" : "muted"}>
                        {trade.newsNearby === "Yes" ? "News nearby" : "No news nearby"}
                    </Pill>
                </div>
            </div>

            {/* Psychology */}
            <div className="rounded-xl border border-border bg-surface p-5">
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-muted">
                    Psychology
                </p>
                <div className="flex flex-wrap gap-2">
                    {trade.confidenceBefore > 0 && <Pill>Confidence {trade.confidenceBefore}/10</Pill>}
                    {trade.emotionsBefore && <Pill>Before: {trade.emotionsBefore}</Pill>}
                    {trade.emotionsAfter && <Pill>After: {trade.emotionsAfter}</Pill>}
                    <Pill tone={trade.followedPlan === "Yes" ? "profit" : "loss"}>
                        {trade.followedPlan === "Yes" ? "Followed plan" : "Deviated from plan"}
                    </Pill>
                    {trade.revengeTrade === "Yes" && <Pill tone="loss">Revenge trade</Pill>}
                    {trade.fomo === "Yes" && <Pill tone="loss">FOMO entry</Pill>}
                </div>
                {trade.notes && (
                    <p className="mt-4 whitespace-pre-line rounded-lg bg-canvas p-3 text-sm text-ink-secondary">
                        {trade.notes}
                    </p>
                )}
            </div>

            {/* Screenshots */}
            {(trade.entryScreenshotUrl || trade.exitScreenshotUrl) && (
                <div className="rounded-xl border border-border bg-surface p-5">
                    <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-muted">
                        Screenshots
                    </p>
                    <div className="flex flex-wrap gap-4">
                        {trade.entryScreenshotUrl && (
                            <a href={trade.entryScreenshotUrl} target="_blank" rel="noopener noreferrer" className="block">
                                <p className="mb-1.5 text-xs text-ink-muted">Entry</p>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={trade.entryScreenshotUrl}
                                    alt="Entry screenshot"
                                    className="h-40 w-auto rounded-lg border border-border object-cover"
                                />
                            </a>
                        )}
                        {trade.exitScreenshotUrl && (
                            <a href={trade.exitScreenshotUrl} target="_blank" rel="noopener noreferrer" className="block">
                                <p className="mb-1.5 text-xs text-ink-muted">Exit</p>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={trade.exitScreenshotUrl}
                                    alt="Exit screenshot"
                                    className="h-40 w-auto rounded-lg border border-border object-cover"
                                />
                            </a>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}