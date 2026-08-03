import NewNoteForm from "@/components/NewNoteForm";
import EmptyAccountsState from "@/components/EmptyAccountsState";
import Sidebar from "@/components/Sidebar";
import { getAccounts, getTrades } from "@/lib/queries";

export default async function NewNotePage({
    searchParams,
}: {
    searchParams: Promise<{ account?: string; tradeId?: string }>;
}) {
    const { account: accountIdParam, tradeId } = await searchParams;
    const accounts = await getAccounts();
    const activeAccount = accounts.find((a) => a.id === accountIdParam) ?? accounts[0];

    if (!activeAccount) {
        return <EmptyAccountsState />;
    }

    const trades = await getTrades({ accountId: activeAccount.id });

    return (
        <div className="flex min-h-screen bg-canvas text-ink-primary">
            <Sidebar accounts={accounts} />

            <main className="flex-1 pb-10">
                <div className="px-6 pt-6 lg:px-8">
                    <h1 className="text-2xl font-semibold">New note</h1>
                    <p className="mt-1 text-sm text-ink-muted">
                        Jot down a thought for {activeAccount.name}. Tag it, and link it to a trade if it's about a
                        specific one.
                    </p>
                </div>

                <div className="mx-6 mt-6 lg:mx-8">
                    <NewNoteForm accountId={activeAccount.id} trades={trades} defaultTradeId={tradeId ?? ""} />
                </div>
            </main>
        </div>
    );
}