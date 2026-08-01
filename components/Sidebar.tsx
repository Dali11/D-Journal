"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Calendar,
  ClipboardList,
  BarChart3,
  Settings,
  Camera,
  FileText,
  Target,
  StickyNote,
  Flame,
  Plus,
} from "lucide-react";
import type { Account } from "@/lib/types";
import { formatUsd } from "@/lib/format";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Trades", icon: ArrowLeftRight, href: "/trades" },
  { label: "Calendar", icon: Calendar, href: "/calendar" },
  { label: "Daily Analysis", icon: ClipboardList, href: "/daily" },
  { label: "Analytics", icon: BarChart3, href: "/analytics" },
  { label: "Setups", icon: Settings, href: "/setups" },
  { label: "Screenshots", icon: Camera, href: "/screenshots" },
  { label: "Reports", icon: FileText, href: "/reports" },
  { label: "Goals", icon: Target, href: "/goals" },
  { label: "Notes", icon: StickyNote, href: "/notes" },
];

export default function Sidebar({ accounts }: { accounts: Account[] }) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto border-r border-border bg-canvas lg:flex print:hidden">
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
          <BarChart3 size={18} />
        </div>
        <div>
          <p className="text-sm font-medium leading-none">Trade Journal</p>
          <p className="mt-1 text-xs text-ink-muted">Perform. Review. Improve.</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1 px-3">
        {navItems.map(({ label, icon: Icon, href }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${active
                ? "bg-accent/15 text-accent"
                : "text-ink-secondary hover:bg-surface-hover hover:text-ink-primary"
                }`}
            >
              <Icon size={17} strokeWidth={1.8} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 px-6">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-muted">
          Accounts
        </p>
        <div className="flex flex-col gap-3">
          {accounts.map((a) => (
            <Link
              key={a.id}
              href={`/?account=${a.id}`}
              className="flex items-center justify-between rounded-md text-sm hover:bg-surface-hover"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: a.color }}
                />
                <span className="text-ink-secondary">{a.name}</span>
              </div>
              <span className="num text-xs text-ink-muted">
                {formatUsd(a.balance)}
              </span>
            </Link>
          ))}
          {accounts.length === 0 && (
            <p className="text-xs text-ink-muted">No accounts yet</p>
          )}
          <Link
            href="/accounts/new"
            className="mt-1 flex items-center gap-1.5 text-xs text-accent hover:underline"
          >
            <Plus size={12} />
            Add account
          </Link>
        </div>
      </div>

      <div className="mt-auto p-4">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-warn/15 text-warn">
            <Flame size={18} />
          </div>
          <div>
            <p className="num text-lg font-medium leading-none">7</p>
            <p className="mt-1 text-xs text-profit">Winning days</p>
          </div>
        </div>
      </div>
    </aside>
  );
}