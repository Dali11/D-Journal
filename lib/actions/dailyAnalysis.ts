"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { DailyAnalysisPhase } from "@/lib/types";

export type PhaseFormResult = { error: string } | { error: null; saved?: boolean };
export type ScreenshotFormResult = { error: string } | { error: null };

function str(formData: FormData, key: string): string | null {
    const raw = formData.get(key);
    if (raw === null) return null;
    const s = String(raw).trim();
    return s === "" ? null : s;
}

function file(formData: FormData, key: string): File | null {
    const raw = formData.get(key);
    if (!(raw instanceof File) || raw.size === 0) return null;
    return raw;
}

async function uploadDailyScreenshot(
    supabase: Awaited<ReturnType<typeof createClient>>,
    userId: string,
    picked: File,
    label: string
): Promise<{ url: string | null; error?: string }> {
    const ext = picked.name.split(".").pop()?.toLowerCase() || "png";
    const safeLabel = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40) || "screenshot";
    const path = `${userId}/daily/${crypto.randomUUID()}-${safeLabel}.${ext}`;

    const { error: uploadError } = await supabase.storage
        .from("trade-screenshots")
        .upload(path, picked, { contentType: picked.type || undefined, upsert: false });

    if (uploadError) {
        return { url: null, error: `Screenshot upload failed: ${uploadError.message}` };
    }

    const { data } = supabase.storage.from("trade-screenshots").getPublicUrl(path);
    return { url: data.publicUrl };
}

async function savePhase(
    formData: FormData,
    fields: Record<string, string>
): Promise<PhaseFormResult> {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: "You must be signed in to save this." };

    const accountId = str(formData, "accountId");
    const date = str(formData, "date");

    if (!accountId || !date) return { error: "Missing account or date." };

    const payload: Record<string, unknown> = {
        user_id: user.id,
        account_id: accountId,
        date,
        updated_at: new Date().toISOString(),
    };
    for (const [column, formKey] of Object.entries(fields)) {
        payload[column] = str(formData, formKey);
    }

    const { error } = await supabase
        .from("daily_analyses")
        .upsert(payload as never, { onConflict: "user_id,account_id,date" });

    if (error) return { error: error.message };

    revalidatePath("/daily");
    return { error: null, saved: true };
}

export async function savePreSession(
    _prevState: PhaseFormResult,
    formData: FormData
): Promise<PhaseFormResult> {
    return savePhase(formData, {
        htf_bias: "htfBias",
        key_levels: "keyLevels",
        news_events: "newsEvents",
        plan: "plan",
    });
}

export async function saveMidSession(
    _prevState: PhaseFormResult,
    formData: FormData
): Promise<PhaseFormResult> {
    return savePhase(formData, {
        market_update: "marketUpdate",
        emotional_state: "emotionalState",
        deviations: "deviations",
    });
}

export async function saveEndOfDay(
    _prevState: PhaseFormResult,
    formData: FormData
): Promise<PhaseFormResult> {
    return savePhase(formData, {
        what_happened: "whatHappened",
        lessons: "lessons",
        what_to_repeat: "whatToRepeat",
        what_to_improve: "whatToImprove",
    });
}

export async function addDailyAnalysisScreenshot(
    _prevState: ScreenshotFormResult,
    formData: FormData
): Promise<ScreenshotFormResult> {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: "You must be signed in to add a screenshot." };

    const accountId = str(formData, "accountId");
    const date = str(formData, "date");
    const phase = str(formData, "phase") as DailyAnalysisPhase | null;
    const label = str(formData, "label") ?? "Screenshot";
    const picked = file(formData, "file");

    if (!accountId || !date) return { error: "Missing account or date." };
    if (!phase || !["pre", "mid", "end"].includes(phase)) return { error: "Missing phase." };
    if (!picked) return { error: "Choose an image to upload." };

    const uploaded = await uploadDailyScreenshot(supabase, user.id, picked, label);
    if (uploaded.error) return { error: uploaded.error };
    if (!uploaded.url) return { error: "Upload failed." };

    const { count } = await supabase
        .from("daily_analysis_screenshots")
        .select("id", { count: "exact", head: true })
        .eq("account_id", accountId)
        .eq("date", date)
        .eq("phase", phase);

    const { error } = await supabase.from("daily_analysis_screenshots").insert({
        user_id: user.id,
        account_id: accountId,
        date,
        phase,
        url: uploaded.url,
        label,
        position: count ?? 0,
    });

    if (error) return { error: error.message };

    revalidatePath("/daily");
    return { error: null };
}

export async function deleteDailyAnalysisScreenshot(screenshotId: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("daily_analysis_screenshots").delete().eq("id", screenshotId);
    if (error) throw error;
    revalidatePath("/daily");
}