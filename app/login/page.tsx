import LoginForm from "@/components/auth/LoginForm";

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ redirectTo?: string }>;
}) {
    const params = await searchParams;

    return (
        <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
            <div className="flex flex-col items-center">
                <p className="mb-1 text-lg font-medium text-ink-primary">Trade Journal</p>
                <p className="mb-8 text-sm text-ink-muted">Log in to your dashboard</p>
                <LoginForm redirectTo={params.redirectTo ?? "/"} />
            </div>
        </div>
    );
}