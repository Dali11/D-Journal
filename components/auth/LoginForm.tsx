"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { signInWithPassword, signInWithMagicLink, type AuthResult } from "@/app/actions/auth";

const initialState: AuthResult = { error: null };

function SubmitButton({ label }: { label: string }) {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-60"
        >
            {pending ? "Please wait…" : label}
        </button>
    );
}

const inputClass =
    "w-full rounded-lg border border-border bg-canvas px-3 py-2.5 text-sm text-ink-primary outline-none focus:border-accent";

export default function LoginForm({ redirectTo }: { redirectTo: string }) {
    const [mode, setMode] = useState<"password" | "magic-link">("password");
    const [passwordState, passwordAction] = useFormState(signInWithPassword, initialState);
    const [magicState, magicAction] = useFormState(signInWithMagicLink, initialState);
    const [magicSent, setMagicSent] = useState(false);

    return (
        <div className="w-full max-w-sm">
            <div className="mb-6 flex rounded-lg border border-border p-1 text-sm">
                <button
                    type="button"
                    onClick={() => setMode("password")}
                    className={`flex-1 rounded-md py-1.5 ${mode === "password" ? "bg-accent/15 text-accent" : "text-ink-muted"}`}
                >
                    Password
                </button>
                <button
                    type="button"
                    onClick={() => setMode("magic-link")}
                    className={`flex-1 rounded-md py-1.5 ${mode === "magic-link" ? "bg-accent/15 text-accent" : "text-ink-muted"}`}
                >
                    Magic link
                </button>
            </div>

            {mode === "password" ? (
                <form action={passwordAction} className="flex flex-col gap-4">
                    <input type="hidden" name="redirectTo" value={redirectTo} />
                    <label className="flex flex-col gap-1.5 text-sm">
                        <span className="text-ink-secondary">Email</span>
                        <input className={inputClass} type="email" name="email" placeholder="name@company.com" required />
                    </label>
                    <label className="flex flex-col gap-1.5 text-sm">
                        <span className="text-ink-secondary">Password</span>
                        <input className={inputClass} type="password" name="password" required />
                    </label>
                    {passwordState.error && (
                        <p className="text-sm text-loss">{passwordState.error}</p>
                    )}
                    <SubmitButton label="Log in" />
                </form>
            ) : (
                <form
                    action={async (formData) => {
                        formData.set("origin", window.location.origin);
                        await magicAction(formData);
                        setMagicSent(true);
                    }}
                    className="flex flex-col gap-4"
                >
                    <label className="flex flex-col gap-1.5 text-sm">
                        <span className="text-ink-secondary">Email</span>
                        <input className={inputClass} type="email" name="email" placeholder="name@company.com" required />
                    </label>
                    {magicState.error && <p className="text-sm text-loss">{magicState.error}</p>}
                    {magicSent && !magicState.error && (
                        <p className="text-sm text-profit">Check your email for a login link.</p>
                    )}
                    <SubmitButton label="Send magic link" />
                </form>
            )}

            <p className="mt-6 text-center text-sm text-ink-muted">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-accent hover:underline">
                    Sign up
                </Link>
            </p>
        </div>
    );
}