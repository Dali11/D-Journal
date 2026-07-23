"use client";

import { Printer } from "lucide-react";

export default function PrintReportButton() {
    return (
        <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm text-ink-secondary hover:border-border-strong print:hidden"
        >
            <Printer size={15} />
            Print / Save as PDF
        </button>
    );
}
