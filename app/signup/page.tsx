import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
            <div className="flex flex-col items-center">
                <p className="mb-1 text-lg font-medium text-ink-primary">Trade Journal</p>
                <p className="mb-8 text-sm text-ink-muted">Create your account</p>
                <SignupForm />
            </div>
        </div>
    );
}