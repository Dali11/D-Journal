"use client";

import Link from "next/link";
import type { AccountBreakdownRow } from "@/lib/types";
import { formatUsd, pnlColor } from "@/lib/format";
import { SummaryRow } from "./RightPanel";

export default function AllAccountsSummaryPanel({ rows }: { rows: AccountBreakdownRow[] }) {
    const totalBalance = rows.reduce((s, r) => s + r.balance, 0);
    const totalPnl = rows.reduce((s, r) => s + r.pnl, 0);
    const totalTrades = rows.reduce((s, r) => s + r.tradeCount, 0);

    return (
        <div className="rounded-xl border border-border bg-surface p-6">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-ink-muted">
                Account summary
            </p>
            <p className="mb-4 text-sm text-ink-secondary">All accounts</p>

            <SummaryRow label="Combined balance" value={formatUsd(totalBalance)} />
            <SummaryRow label="Combined P&L" value={formatUsd(totalPnl, { sign: true })} valueClass={pnlColor(totalPnl)} />
            <SummaryRow label="Total trades" value={`${totalTrades}`} />

            <div className="mt-4 flex flex-col gap-1 border-t border-border pt-3">
                {rows.map((r) => (
                    <Link
                        key={r.accountId}
                        href={`/?account=${r.accountId}`}
                        className="flex items-center justify-between rounded-lg px-2 py-2 text-sm hover:bg-surface-hover"
                    >
                        <span className="flex items-center gap-2 text-ink-secondary">
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: r.color }} />
                            {r.name}
                        </span>
                        <span className="flex items-center gap-3">
                            <span className="text-xs text-ink-muted">
                                {r.tradeCount} trade{r.tradeCount === 1 ? "" : "s"}
                            </span>
                            <span className={`num text-sm font-medium ${pnlColor(r.pnl)}`}>
                                {formatUsd(r.pnl, { sign: true })}
                            </span>
                        </span>
                    </Link>
                ))}
                {rows.length === 0 && <p className="py-2 text-sm text-ink-muted">No accounts yet.</p>}
            </div>
        </div>
    );
}