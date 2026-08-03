import Link from "next/link";
import { Plus, BarChart3 } from "lucide-react";
import Sidebar from "./Sidebar";

export default function EmptyAccountsState() {
    return (
        <div className="flex min-h-screen bg-canvas text-ink-primary">
            <Sidebar accounts={[]} />
            <main className="flex flex-1 items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
                        <BarChart3 size={22} />
                    </div>
                    <p className="text-lg font-medium">No accounts yet</p>
                    <p className="mt-2 text-sm text-ink-muted">
                        Add your first account to start logging trades.
                    </p>
                    <Link
                        href="/accounts/new"
                        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-hover"
                    >
                        <Plus size={15} />
                        Create account
                    </Link>
                </div>
            </main>
        </div>
    );
}