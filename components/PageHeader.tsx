"use client";

import Link from "next/link";
import { Calendar, Plus } from "lucide-react";
import type { Account } from "@/lib/types";
import AccountSwitcher from "@/components/AccountSwitcher";

export default function PageHeader({
  accounts,
  activeAccountId,
  allowAll = false,
}: {
  accounts: Account[];
  activeAccountId: string | null;
  allowAll?: boolean;
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 px-6 pt-6 pb-2 lg:px-8">
      <div>
        <h1 className="text-xl font-medium tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-ink-muted">Tuesday, July 15, 2026</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <AccountSwitcher accounts={accounts} activeAccountId={activeAccountId} allowAll={allowAll} />
        <button className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink-secondary hover:border-border-strong">
          <Calendar size={14} />
          Jul 8 – Jul 15, 2026
        </button>
        <Link
          href="/trades/new"
          className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
        >
          <Plus size={15} />
          New trade
        </Link>
      </div>
    </header>
  );
}