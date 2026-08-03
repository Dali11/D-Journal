import NewGoalForm from "@/components/NewGoalForm";
import EmptyAccountsState from "@/components/EmptyAccountsState";
import Sidebar from "@/components/Sidebar";
import { getAccounts } from "@/lib/queries";

export default async function NewGoalPage({
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

    return (
        <div className="flex min-h-screen bg-canvas text-ink-primary">
            <Sidebar accounts={accounts} />

            <main className="flex-1 pb-10">
                <div className="px-6 pt-6 lg:px-8">
                    <h1 className="text-2xl font-semibold">Add goal</h1>
                    <p className="mt-1 text-sm text-ink-muted">
                        Set a performance target or a process habit for {activeAccount.name}, tracked automatically
                        from your logged trades.
                    </p>
                </div>

                <div className="mx-6 mt-6 lg:mx-8">
                    <NewGoalForm accountId={activeAccount.id} />
                </div>
            </main>
        </div>
    );
}