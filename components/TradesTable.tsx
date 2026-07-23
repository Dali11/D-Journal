"use client";

import { useRouter } from "next/navigation";
import type { Account, Trade } from "@/lib/types";
import { formatUsd, pnlColor } from "@/lib/format";

export default function TradesTable({
    trades,
    accounts,
}: {
    trades: Trade[];
    accounts: Account[];
}) {
    const router = useRouter();
    const accountName = (id: string) => accounts.find((a) => a.id === id)?.name ?? "Unknown";

    return (
        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
            <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                    <tr className="border-b border-border text-xs uppercase tracking-wide text-ink-muted">
                        <th className="px-4 py-3 font-medium">Date</th>
                        <th className="px-4 py-3 font-medium">Account</th>
                        <th className="px-4 py-3 font-medium">Instrument</th>
                        <th className="px-4 py-3 font-medium">Direction</th>
                        <th className="px-4 py-3 font-medium text-right">Contracts</th>
                        <th className="px-4 py-3 font-medium text-right">Entry</th>
                        <th className="px-4 py-3 font-medium text-right">Exit</th>
                        <th className="px-4 py-3 font-medium text-right">R:R</th>
                        <th className="px-4 py-3 font-medium">Grade</th>
                        <th className="px-4 py-3 font-medium text-right">P&L</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {trades.map((t) => (
                        <tr
                            key={t.id}
                            onClick={() => router.push(`/trades/${t.id}`)}
                            className="cursor-pointer hover:bg-surface-hover"
                        >
                            <td className="num px-4 py-3 text-ink-secondary">{t.date}</td>
                            <td className="px-4 py-3 text-ink-secondary">{accountName(t.accountId)}</td>
                            <td className="px-4 py-3">
                                <span className="num">{t.instrument}</span>
                                {t.instrumentLabel && (
                                    <span className="ml-2 text-xs text-ink-muted">{t.instrumentLabel}</span>
                                )}
                            </td>
                            <td className="px-4 py-3">
                                <span
                                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${t.direction === "Long" ? "bg-profit/15 text-profit" : "bg-loss/15 text-loss"
                                        }`}
                                >
                                    {t.direction}
                                </span>
                            </td>
                            <td className="num px-4 py-3 text-right text-ink-secondary">{t.contracts}</td>
                            <td className="num px-4 py-3 text-right text-ink-secondary">{t.entryPrice}</td>
                            <td className="num px-4 py-3 text-right text-ink-secondary">{t.exitPrice}</td>
                            <td className="num px-4 py-3 text-right text-ink-secondary">
                                {t.rrAchieved ? `${t.rrAchieved}R` : "—"}
                            </td>
                            <td className="px-4 py-3">
                                <span className="num font-medium text-accent">{t.grade}</span>
                            </td>
                            <td className={`num px-4 py-3 text-right font-medium ${pnlColor(t.pnl)}`}>
                                {formatUsd(t.pnl, { sign: true })}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}