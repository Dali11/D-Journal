import Sidebar from "@/components/Sidebar";
import NewAccountForm from "@/components/NewAccountForm";
import { getAccounts } from "@/lib/queries";

export default async function NewAccountPage() {
    const accounts = await getAccounts();

    return (
        <div className="flex min-h-screen bg-canvas text-ink-primary">
            <Sidebar accounts={accounts} />

            <main className="flex-1 pb-10">
                <div className="px-6 pt-6 lg:px-8">
                    <h1 className="text-2xl font-semibold">Add account</h1>
                    <p className="mt-1 text-sm text-ink-muted">
                        Add a new trading or prop-firm account to track separately.
                    </p>
                </div>

                <div className="mx-6 mt-6 lg:mx-8">
                    <NewAccountForm />
                </div>
            </main>
        </div>
    );
}