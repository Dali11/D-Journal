import Link from "next/link";
import { Plus } from "lucide-react";
import EmptyAccountsState from "@/components/EmptyAccountsState";
import Sidebar from "@/components/Sidebar";
import AccountSwitcher from "@/components/AccountSwitcher";
import NotesBoard from "@/components/NotesBoard";
import { getAccounts, getNotes } from "@/lib/queries";

export default async function NotesPage({
    searchParams,
}: {
    searchParams: Promise<{ account?: string }>;
}) {
    const { account: accountIdParam } = await searchParams;
    const accounts = await getAccounts();
    const activeAccount = accounts.find((a) => a.id === accountIdParam) ?? accounts[0];

    if (!activeAccount) {
        return <EmptyAccountsState />;
    }

    const notes = await getNotes(activeAccount.id);

    return (
        <div className="flex min-h-screen bg-canvas text-ink-primary">
            <Sidebar accounts={accounts} />

            <main className="flex-1 pb-10">
                <header className="flex flex-wrap items-center justify-between gap-4 px-6 pt-6 pb-2 lg:px-8">
                    <div>
                        <h1 className="text-xl font-medium tracking-tight">Notes</h1>
                        <p className="mt-1 text-sm text-ink-muted">
                            {activeAccount.name} · {notes.length} note{notes.length === 1 ? "" : "s"}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <AccountSwitcher accounts={accounts} activeAccountId={activeAccount.id} basePath="/notes" />
                        <Link
                            href={`/notes/new?account=${activeAccount.id}`}
                            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
                        >
                            <Plus size={15} />
                            New note
                        </Link>
                    </div>
                </header>

                <div className="mx-6 mt-6 lg:mx-8">
                    <NotesBoard notes={notes} />
                </div>
            </main>
        </div>
    );
}