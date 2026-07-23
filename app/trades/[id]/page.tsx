import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TradeDetails from "@/components/TradeDetails";
import { getAccounts, getTradeById } from "@/lib/queries";

export default async function TradeDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const [accounts, trade] = await Promise.all([getAccounts(), getTradeById(id)]);

    if (!trade) {
        notFound();
    }

    return (
        <div className="flex min-h-screen bg-canvas text-ink-primary">
            <Sidebar accounts={accounts} />

            <main className="flex-1 pb-10">
                <div className="px-6 pt-6 lg:px-8">
                    <Link
                        href="/trades"
                        className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink-secondary"
                    >
                        <ArrowLeft size={14} />
                        Back to trades
                    </Link>
                </div>

                <div className="mx-6 mt-4 lg:mx-8">
                    <TradeDetails trade={trade} accounts={accounts} />
                </div>
            </main>
        </div>
    );
}