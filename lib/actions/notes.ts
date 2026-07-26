"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type NoteFormResult = { error: string } | { error: null };

function str(formData: FormData, key: string): string | null {
    const raw = formData.get(key);
    if (raw === null) return null;
    const s = String(raw).trim();
    return s === "" ? null : s;
}

function parseTags(raw: string | null): string[] {
    if (!raw) return [];
    return Array.from(
        new Set(
            raw
                .split(",")
                .map((t) => t.trim().toLowerCase())
                .filter(Boolean)
        )
    );
}

export async function createNote(
    _prevState: NoteFormResult,
    formData: FormData
): Promise<NoteFormResult> {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: "You must be signed in to add a note." };

    const accountId = str(formData, "accountId");
    const title = str(formData, "title");
    const body = str(formData, "body") ?? "";
    const resolution = str(formData, "resolution") ?? "";
    const tags = parseTags(str(formData, "tags"));
    const tradeId = str(formData, "tradeId");
    const pinned = formData.get("pinned") === "on";

    if (!accountId) return { error: "Select an account." };
    if (!title) return { error: "Give the note a title." };

    const { error } = await supabase.from("notes").insert({
        user_id: user.id,
        account_id: accountId,
        trade_id: tradeId,
        title,
        body,
        resolution,
        tags,
        pinned,
    });

    if (error) return { error: error.message };

    revalidatePath("/notes");
    redirect("/notes");
}

export async function updateNote(
    _prevState: NoteFormResult,
    formData: FormData
): Promise<NoteFormResult> {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: "You must be signed in to edit a note." };

    const noteId = str(formData, "noteId");
    const title = str(formData, "title");
    const body = str(formData, "body") ?? "";
    const resolution = str(formData, "resolution") ?? "";
    const tags = parseTags(str(formData, "tags"));
    const tradeId = str(formData, "tradeId");
    const pinned = formData.get("pinned") === "on";

    if (!noteId) return { error: "Missing note." };
    if (!title) return { error: "Give the note a title." };

    const { error } = await supabase
        .from("notes")
        .update({
            title,
            body,
            resolution,
            tags,
            trade_id: tradeId,
            pinned,
            updated_at: new Date().toISOString(),
        })
        .eq("id", noteId);

    if (error) return { error: error.message };

    revalidatePath("/notes");
    revalidatePath(`/notes/${noteId}`);
    redirect("/notes");
}

export async function deleteNote(noteId: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("notes").delete().eq("id", noteId);
    if (error) throw error;
    revalidatePath("/notes");
}

export async function toggleNotePinned(noteId: string, pinned: boolean): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
        .from("notes")
        .update({ pinned: !pinned, updated_at: new Date().toISOString() })
        .eq("id", noteId);
    if (error) throw error;
    revalidatePath("/notes");
}