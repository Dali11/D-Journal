import NewSetupForm from "@/components/NewSetupForm";
import Sidebar from "@/components/Sidebar";

import { getAccounts } from "@/lib/queries";

export default async function NewSetupPage() {
    const accounts = await getAccounts();

    return (
        <div className="flex min-h-screen bg-canvas text-ink-primary">
            <Sidebar accounts={accounts} />

            <main className="flex-1 pb-10">
                <div className="px-6 pt-6 lg:px-8">
                    <h1 className="text-2xl font-semibold">Add setup</h1>
                    <p className="mt-1 text-sm text-ink-muted">
                        Define a strategy for your playbook. Tag trades with the same name to track its performance.
                    </p>
                </div>

                <div className="mx-6 mt-6 lg:mx-8">
                    <NewSetupForm    />
                </div>
            </main>
        </div>
    );
}