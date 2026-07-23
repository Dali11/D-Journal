"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export type AuthResult = { error: string } | { error: null };

export async function signInWithPassword(
    _prev: AuthResult,
    formData: FormData
): Promise<AuthResult> {
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const redirectTo = String(formData.get("redirectTo") ?? "/");

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return { error: error.message };

    revalidatePath("/", "layout");
    redirect(redirectTo || "/");
}

export async function signInWithMagicLink(
    _prev: AuthResult,
    formData: FormData
): Promise<AuthResult> {
    const email = String(formData.get("email") ?? "");
    const origin = String(formData.get("origin") ?? "");

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            emailRedirectTo: `${origin}/auth/callback`,
        },
    });

    if (error) return { error: error.message };
    return { error: null };
}

export async function signUp(
    _prev: AuthResult,
    formData: FormData
): Promise<AuthResult> {
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const displayName = String(formData.get("displayName") ?? "");
    const origin = String(formData.get("origin") ?? "");

    const supabase = await createClient();
    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { display_name: displayName },
            emailRedirectTo: `${origin}/auth/callback`,
        },
    });

    if (error) return { error: error.message };
    return { error: null };
}

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    redirect("/login");
}