"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { signUp, type AuthResult } from "@/app/actions/auth";

const initialState: AuthResult = { error: null };

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-60"
        >
            {pending ? "Creating account…" : "Create account"}
        </button>
    );
}

const inputClass =
    "w-full rounded-lg border border-border bg-canvas px-3 py-2.5 text-sm text-ink-primary outline-none focus:border-accent";

export default function SignupForm() {
    const [state, formAction] = useFormState(signUp, initialState);
    const [submitted, setSubmitted] = useState(false);

    if (submitted && !state.error) {
        return (
            <div className="w-full max-w-sm text-center">
                <p className="text-sm text-profit">
                    Account created. Check your email to confirm, then log in.
                </p>
                <Link href="/login" className="mt-4 inline-block text-sm text-accent hover:underline">
                    Back to login
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full max-w-sm">
            <form
                action={async (formData) => {
                    formData.set("origin", window.location.origin);
                    await formAction(formData);
                    setSubmitted(true);
                }}
                className="flex flex-col gap-4"
            >
                <label className="flex flex-col gap-1.5 text-sm">
                    <span className="text-ink-secondary">Name</span>
                    <input className={inputClass} type="text" name="displayName" placeholder="Dalitso" required />
                </label>
                <label className="flex flex-col gap-1.5 text-sm">
                    <span className="text-ink-secondary">Email</span>
                    <input className={inputClass} type="email" name="email" placeholder="name@company.com" required />
                </label>
                <label className="flex flex-col gap-1.5 text-sm">
                    <span className="text-ink-secondary">Password</span>
                    <input className={inputClass} type="password" name="password" minLength={6} required />
                </label>
                {state.error && <p className="text-sm text-loss">{state.error}</p>}
                <SubmitButton />
            </form>

            <p className="mt-6 text-center text-sm text-ink-muted">
                Already have an account?{" "}
                <Link href="/login" className="text-accent hover:underline">
                    Log in
                </Link>
            </p>
        </div>
    );
}