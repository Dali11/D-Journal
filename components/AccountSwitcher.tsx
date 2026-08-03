"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronDown, Plus } from "lucide-react";
import type { Account } from "@/lib/types";

export default function AccountSwitcher({
    accounts,
    activeAccountId,
    basePath = "/",
    extraQuery = "",
    allowAll = false,
}: {
    accounts: Account[];
    activeAccountId: string | null;
    /** Route to switch accounts on, e.g. "/calendar". Defaults to the dashboard. */
    basePath?: string;
    /** Extra query string (without leading "?"/"&") to preserve, e.g. "month=2026-07". */
    extraQuery?: string;
    /** Whether to offer a combined "All accounts" option. */
    allowAll?: boolean;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const isAll = allowAll && activeAccountId === "all";
    const active = accounts.find((a) => a.id === activeAccountId);

    useEffect(() => {
        function onClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    function goTo(accountId: string) {
        setOpen(false);
        const query = extraQuery ? `account=${accountId}&${extraQuery}` : `account=${accountId}`;
        router.push(`${basePath}?${query}`);
    }

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink-secondary hover:border-border-strong"
            >
                {isAll ? (
                    <>
                        <span className="h-2 w-2 rounded-full bg-accent" />
                        All accounts
                    </>
                ) : active ? (
                    <>
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: active.color }} />
                        {active.name}
                    </>
                ) : (
                    "Select account"
                )}
                <ChevronDown size={14} />
            </button>

            {open && (
                <div className="absolute left-0 top-full z-20 mt-2 w-64 rounded-lg border border-border bg-surface p-1.5 shadow-lg">
                    {allowAll && (
                        <button
                            type="button"
                            onClick={() => goTo("all")}
                            className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-surface-hover ${isAll ? "text-accent" : "text-ink-secondary"
                                }`}
                        >
                            <span className="h-2 w-2 rounded-full bg-accent" />
                            All accounts
                        </button>
                    )}
                    {allowAll && <div className="my-1 border-t border-border" />}
                    {accounts.map((a) => (
                        <button
                            key={a.id}
                            type="button"
                            onClick={() => goTo(a.id)}
                            className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-surface-hover ${!isAll && a.id === activeAccountId ? "text-accent" : "text-ink-secondary"
                                }`}
                        >
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: a.color }} />
                            {a.name}
                        </button>
                    ))}
                    <div className="mt-1 border-t border-border pt-1">
                        <Link
                            href="/accounts/new"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-accent hover:bg-surface-hover"
                        >
                            <Plus size={14} />
                            Add account
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}