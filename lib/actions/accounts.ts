"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type AccountFormResult = { error: string } | { error: null };

function num(formData: FormData, key: string): number | null {
    const raw = formData.get(key);
    if (raw === null || raw === "") return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
}

function str(formData: FormData, key: string): string | null {
    const raw = formData.get(key);
    if (raw === null) return null;
    const s = String(raw).trim();
    return s === "" ? null : s;
}

export async function createAccount(
    _prevState: AccountFormResult,
    formData: FormData
): Promise<AccountFormResult> {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "You must be signed in to add an account." };
    }

    const name = str(formData, "name");
    const balance = num(formData, "balance");
    const color = str(formData, "color") ?? "#7C6CF2";
    const consistencyRule = num(formData, "consistencyRule") ?? 40;
    const profitTarget = num(formData, "profitTarget") ?? 0;
    const maxDailyLoss = num(formData, "maxDailyLoss") ?? 0;

    if (!name) return { error: "Please enter an account name." };
    if (balance === null) return { error: "Please enter a starting balance." };

    const { data, error } = await supabase
        .from("accounts")
        .insert({
            user_id: user.id,
            name,
            balance,
            color,
            consistency_rule: consistencyRule,
            profit_target: profitTarget,
            max_daily_loss: maxDailyLoss,
        })
        .select("id")
        .single();

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/");
    redirect(`/?account=${data.id}`);
}