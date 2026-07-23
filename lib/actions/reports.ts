"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ReportFormResult = { error: string | null; saved?: boolean };

function str(formData: FormData, key: string): string | null {
    const raw = formData.get(key);
    if (raw === null) return null;
    const s = String(raw).trim();
    return s === "" ? null : s;
}

export async function saveReportReflection(
    _prevState: ReportFormResult,
    formData: FormData
): Promise<ReportFormResult> {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: "You must be signed in to save a report." };

    const accountId = str(formData, "accountId");
    const fromDate = str(formData, "fromDate");
    const toDate = str(formData, "toDate");

    if (!accountId || !fromDate || !toDate) {
        return { error: "Missing account or date range." };
    }

    const { error } = await supabase.from("reports").upsert(
        {
            user_id: user.id,
            account_id: accountId,
            from_date: fromDate,
            to_date: toDate,
            title: str(formData, "title"),
            what_went_well: str(formData, "whatWentWell"),
            what_to_improve: str(formData, "whatToImprove"),
            focus_next: str(formData, "focusNext"),
            updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,account_id,from_date,to_date" }
    );

    if (error) return { error: error.message };

    revalidatePath("/reports");
    return { error: null, saved: true };
}
