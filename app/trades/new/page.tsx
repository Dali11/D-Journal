import Sidebar from "@/components/Sidebar";
import NewTradeForm from "@/components/NewTradeForm";
import { getAccounts, getSetups } from "@/lib/queries";

export default async function NewTradePage() {
    const [accounts, setups] = await Promise.all([getAccounts(), getSetups()]);

    return (
        <div className="flex min-h-screen bg-canvas text-ink-primary">
            <Sidebar accounts={accounts} />

            <main className="flex-1 pb-10">
                <div className="px-6 pt-6 lg:px-8">
                    <h1 className="text-2xl font-semibold">New trade</h1>
                    <p className="mt-1 text-sm text-ink-muted">Log a completed trade to your journal.</p>
                </div>

                <div className="mx-6 mt-6 lg:mx-8">
                    {accounts.length === 0 ? (
                        <div className="rounded-xl border border-border bg-surface p-6 text-sm text-ink-muted">
                            You need at least one account before logging a trade. Add one in Supabase first.
                        </div>
                    ) : (
                        <NewTradeForm accounts={accounts} setups={setups} />
                    )}
                </div>
            </main>
        </div>
    );
}