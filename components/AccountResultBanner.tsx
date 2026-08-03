"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Lock, Unlock } from "lucide-react";
import { lockAccount, unlockAccount } from "@/lib/actions/accounts";
import type { AccountResult, AccountStatus } from "@/lib/types";

export default function AccountResultBanner({
    accountId,
    accountName,
    locked,
    status,
    lockedAt,
    detectedResult,
}: {
    accountId: string;
    accountName: string;
    locked: boolean;
    status: AccountStatus;
    lockedAt: string | null;
    detectedResult: AccountResult;
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    function handleLock(result: "passed" | "failed") {
        const verb = result === "passed" ? "PASSED" : "FAILED";
        const confirmed = confirm(
            `Lock "${accountName}" as ${verb}?\n\nThis marks the challenge as final and blocks new trades from being logged against this account. You can undo this later if needed.`
        );
        if (!confirmed) return;

        startTransition(async () => {
            const res = await lockAccount(accountId, result);
            if (res.error) {
                setError(res.error);
                return;
            }
            router.refresh();
        });
    }

    function handleUnlock() {
        const confirmed = confirm(`Unlock "${accountName}"? This reopens it for new trades.`);
        if (!confirmed) return;

        startTransition(async () => {
            const res = await unlockAccount(accountId);
            if (res.error) {
                setError(res.error);
                return;
            }
            router.refresh();
        });
    }

    if (locked) {
        const isPassed = status === "passed";
        return (
            <div
                className={`mx-6 mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4 lg:mx-8 ${isPassed ? "border-profit/30 bg-profit/5" : "border-loss/30 bg-loss/5"
                    }`}
            >
                <div className="flex items-center gap-3">
                    {isPassed ? (
                        <CheckCircle2 size={18} className="text-profit" />
                    ) : (
                        <XCircle size={18} className="text-loss" />
                    )}
                    <div>
                        <p className={`text-sm font-medium ${isPassed ? "text-profit" : "text-loss"}`}>
                            Locked as {isPassed ? "Passed" : "Failed"}
                        </p>
                        <p className="text-xs text-ink-muted">
                            {lockedAt &&
                                new Date(lockedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}{" "}
                            · New trades are blocked on this account.
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={handleUnlock}
                    disabled={isPending}
                    className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-ink-secondary hover:border-border-strong disabled:opacity-60"
                >
                    <Unlock size={12} />
                    Unlock
                </button>
            </div>
        );
    }

    if (!detectedResult) return null;

    const isPassed = detectedResult === "passed";
    return (
        <div
            className={`mx-6 mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4 lg:mx-8 ${isPassed ? "border-profit/30 bg-profit/5" : "border-loss/30 bg-loss/5"
                }`}
        >
            <div className="flex items-center gap-3">
                {isPassed ? (
                    <CheckCircle2 size={18} className="text-profit" />
                ) : (
                    <XCircle size={18} className="text-loss" />
                )}
                <div>
                    <p className={`text-sm font-medium ${isPassed ? "text-profit" : "text-loss"}`}>
                        This account looks {isPassed ? "passed" : "failed"} based on your rules
                    </p>
                    <p className="text-xs text-ink-muted">
                        {isPassed
                            ? "Profit target hit within the consistency rule."
                            : "Max daily loss or drawdown limit breached."}{" "}
                        Lock it in to keep this result for future analysis.
                    </p>
                </div>
            </div>
            <button
                type="button"
                onClick={() => handleLock(detectedResult)}
                disabled={isPending}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white disabled:opacity-60 ${isPassed ? "bg-profit hover:bg-profit/90" : "bg-loss hover:bg-loss/90"
                    }`}
            >
                <Lock size={12} />
                {isPending ? "Locking..." : `Lock as ${isPassed ? "Passed" : "Failed"}`}
            </button>
            {error && <p className="w-full text-xs text-loss">{error}</p>}
        </div>
    );
}