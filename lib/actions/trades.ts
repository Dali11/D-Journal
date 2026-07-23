"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type TradeFormResult = { error: string } | { error: null };

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

function enumStr<T extends string>(
    formData: FormData,
    key: string,
    allowed: readonly T[]
): T | null {
    const raw = str(formData, key);
    if (raw === null) return null;
    return (allowed as readonly string[]).includes(raw) ? (raw as T) : null;
}

function file(formData: FormData, key: string): File | null {
    const raw = formData.get(key);
    if (!(raw instanceof File) || raw.size === 0) return null;
    return raw;
}

async function uploadScreenshot(
    supabase: Awaited<ReturnType<typeof createClient>>,
    userId: string,
    picked: File | null,
    label: "entry" | "exit"
): Promise<{ url: string | null; error?: string }> {
    if (!picked) return { url: null };

    const ext = picked.name.split(".").pop()?.toLowerCase() || "png";
    const path = `${userId}/${crypto.randomUUID()}-${label}.${ext}`;

    const { error: uploadError } = await supabase.storage
        .from("trade-screenshots")
        .upload(path, picked, { contentType: picked.type || undefined, upsert: false });

    if (uploadError) {
        return { url: null, error: `${label === "entry" ? "Entry" : "Exit"} screenshot upload failed: ${uploadError.message}` };
    }

    const { data } = supabase.storage.from("trade-screenshots").getPublicUrl(path);
    return { url: data.publicUrl };
}

export async function createTrade(
    _prevState: TradeFormResult,
    formData: FormData
): Promise<TradeFormResult> {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "You must be signed in to log a trade." };
    }

    const accountId = str(formData, "accountId");
    const date = str(formData, "date");
    const instrument = str(formData, "instrument");
    const direction = enumStr(formData, "direction", ["Long", "Short"] as const);
    const contracts = num(formData, "contracts");
    const entryPrice = num(formData, "entryPrice");
    const exitPrice = num(formData, "exitPrice");
    const pnl = num(formData, "pnl");

    // Required fields
    if (!accountId) return { error: "Please select an account." };
    if (!date) return { error: "Please enter a date." };
    if (!instrument) return { error: "Please enter an instrument." };
    if (!direction) {
        return { error: "Please select a direction." };
    }
    if (contracts === null) return { error: "Please enter contracts." };
    if (entryPrice === null) return { error: "Please enter an entry price." };
    if (exitPrice === null) return { error: "Please enter an exit price." };
    if (pnl === null) return { error: "Please enter the trade P&L." };

    const entryScreenshot = file(formData, "entryScreenshot");
    const exitScreenshot = file(formData, "exitScreenshot");

    const [entryUpload, exitUpload] = await Promise.all([
        uploadScreenshot(supabase, user.id, entryScreenshot, "entry"),
        uploadScreenshot(supabase, user.id, exitScreenshot, "exit"),
    ]);

    if (entryUpload.error) return { error: entryUpload.error };
    if (exitUpload.error) return { error: exitUpload.error };

    const { error } = await supabase.from("trades").insert({
        user_id: user.id,
        account_id: accountId,
        date,
        instrument,
        instrument_label: str(formData, "instrumentLabel"),
        session: str(formData, "session"),
        session_time: str(formData, "sessionTime"),
        entry_time: str(formData, "entryTime"),
        exit_time: str(formData, "exitTime"),
        direction,
        contracts,
        entry_price: entryPrice,
        exit_price: exitPrice,
        risk_usd: num(formData, "riskUsd"),
        risk_pts: num(formData, "riskPts"),
        reward_usd: num(formData, "rewardUsd"),
        reward_pts: num(formData, "rewardPts"),
        rr_achieved: num(formData, "rrAchieved"),
        pnl,
        setup: str(formData, "setup"),
        a_plus_setup: enumStr(formData, "aPlusSetup", ["Yes", "No"] as const),
        trend_direction: enumStr(formData, "trendDirection", ["Uptrend", "Downtrend", "Range"] as const),
        htf_bias: enumStr(formData, "htfBias", ["Bullish", "Bearish", "Neutral"] as const),
        entry_confirmation: enumStr(formData, "entryConfirmation", ["Valid", "Invalid"] as const),
        news_nearby: enumStr(formData, "newsNearby", ["Yes", "No"] as const),
        grade: enumStr(formData, "grade", ["A", "B", "C", "D", "F"] as const),
        confidence_before: num(formData, "confidenceBefore"),
        emotions_before: str(formData, "emotionsBefore"),
        emotions_after: str(formData, "emotionsAfter"),
        followed_plan: enumStr(formData, "followedPlan", ["Yes", "No"] as const),
        revenge_trade: enumStr(formData, "revengeTrade", ["Yes", "No"] as const),
        fomo: enumStr(formData, "fomo", ["Yes", "No"] as const),
        notes: str(formData, "notes"),
        entry_screenshot_url: entryUpload.url,
        exit_screenshot_url: exitUpload.url,
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/");
    redirect("/");
}