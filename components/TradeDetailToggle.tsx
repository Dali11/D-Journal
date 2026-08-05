"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import TradeReviewCard from "./TradeReviewCard";
import EditTradeForm from "./EditTradeForm";
import type { Account, Setup, Trade } from "@/lib/types";

export default function TradeDetailToggle({
    trade,
    accounts,
    setups,
}: {
    trade: Trade;
    accounts: Account[];
    setups: Setup[];
}) {
    const [mode, setMode] = useState<"view" | "edit">("view");
    const router = useRouter();

    if (mode === "edit") {
        return (
            <EditTradeForm
                trade={trade}
                accounts={accounts}
                setups={setups}
                onCancel={() => setMode("view")}
                onSaved={() => {
                    setMode("view");
                    router.refresh();
                }}
            />
        );
    }

    return (
        <div>
            <div className="mb-4 flex justify-end">
                <button
                    type="button"
                    onClick={() => setMode("edit")}
                    className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-ink-secondary hover:border-accent hover:text-accent"
                >
                    <Pencil size={13} />
                    Edit
                </button>
            </div>
            <TradeReviewCard trade={trade} accounts={accounts} />
        </div>
    );
}