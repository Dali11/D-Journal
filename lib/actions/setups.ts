"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type SetupFormResult = { error: string } | { error: null };

function str(formData: FormData, key: string): string | null {
    const raw = formData.get(key);
    if (raw === null) return null;
    const s = String(raw).trim();
    return s === "" ? null : s;
}

export async function createSetup(
    _prevState: SetupFormResult,
    formData: FormData
): Promise<SetupFormResult> {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "You must be signed in to add a setup." };
    }

    const name = str(formData, "name");
    const description = str(formData, "description");
    const criteria = str(formData, "criteria");
    const color = str(formData, "color") ?? "#7C6CF2";

    if (!name) return { error: "Please enter a setup name." };

    const { error } = await supabase.from("setups").insert({
        user_id: user.id,
        name,
        description,
        criteria,
        color,
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/setups");
    redirect("/setups");
}