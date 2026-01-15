"use client";

import { AuthForm } from "@/components/auth/auth-form";
import { CodePrepLogo } from "@/components/icons";

export default function SignupPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
            <div className="mb-8 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <CodePrepLogo className="w-8 h-8" />
                    <h1 className="text-2xl font-headline font-bold">CodePrep</h1>
                </div>
                <p className="text-muted-foreground">Master coding interviews with AI</p>
            </div>

            <AuthForm mode="signup" />
        </div>
    );
}
