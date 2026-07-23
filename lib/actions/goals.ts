"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type GoalFormResult = { error: string } | { error: null };

function str(formData: FormData, key: string): string | null {
    const raw = formData.get(key);
    if (raw === null) return null;
    const s = String(raw).trim();
    return s === "" ? null : s;
}

function num(formData: FormData, key: string): number | null {
    const raw = formData.get(key);
    if (raw === null || raw === "") return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
}

export async function createGoal(
    _prevState: GoalFormResult,
    formData: FormData
): Promise<GoalFormResult> {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: "You must be signed in to add a goal." };

    const accountId = str(formData, "accountId");
    const category = str(formData, "category");
    const metric = str(formData, "metric");
    const title = str(formData, "title");
    const targetValue = num(formData, "targetValue");
    const direction = str(formData, "direction");
    const period = str(formData, "period");
    const fromDate = str(formData, "fromDate");
    const toDate = str(formData, "toDate");

    const categories = ["performance", "process"] as const;
    const directions = ["at_least", "at_most"] as const;
    const periods = ["week", "month", "quarter", "all", "custom"] as const;

    if (!accountId) return { error: "Select an account." };
    if (!category || !categories.includes(category as (typeof categories)[number])) {
        return { error: "Choose a metric to track." };
    }
    if (!metric) return { error: "Choose a metric to track." };
    if (!title) return { error: "Give the goal a short title." };
    if (targetValue === null) return { error: "Enter a target value." };
    if (!direction || !directions.includes(direction as (typeof directions)[number])) {
        return { error: "Missing direction." };
    }
    if (!period || !periods.includes(period as (typeof periods)[number])) {
        return { error: "Missing period." };
    }
    if (period === "custom" && (!fromDate || !toDate)) {
        return { error: "Pick a start and end date for a custom period." };
    }

    const { error } = await supabase.from("goals").insert({
        user_id: user.id,
        account_id: accountId,
        category: category as (typeof categories)[number],
        metric,
        title,
        target_value: targetValue,
        direction: direction as (typeof directions)[number],
        period: period as (typeof periods)[number],
        from_date: period === "custom" ? fromDate : null,
        to_date: period === "custom" ? toDate : null,
    });

    if (error) return { error: error.message };

    revalidatePath("/goals");
    redirect("/goals");
}

export async function deleteGoal(goalId: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("goals").delete().eq("id", goalId);
    if (error) throw error;
    revalidatePath("/goals");
}