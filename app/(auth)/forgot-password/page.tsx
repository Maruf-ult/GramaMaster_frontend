"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    forgotPasswordSchema,
    forgotPasswordValues,
} from "@/features/schemas/forgot-password.schema";
import { apiClient } from "@/lib/api/api-client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { ApiResponse } from "@/types/common";

export default function ForgotPasswordPage() {
    const [submitted, setSubmitted] = useState(false);
    const [submittedEmail, setSubmittedEmail] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<forgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" },
    });

    const onSubmit = async (data: forgotPasswordValues) => {
        try {
            await apiClient<ApiResponse<boolean>>(apiEndpoints.auth.forgotPassword, {
                method: "POST",
                body: JSON.stringify({ email: data.email }),
            });
            setSubmittedEmail(data.email);
            setSubmitted(true);
        } catch (error: any) {
            toast.error(error.message || "Something went wrong. Please try again.");
        }
    };

    if (submitted) {
        return (
            <div className="w-full max-w-md mx-auto p-8 bg-card border rounded-2xl shadow-sm text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-2xl font-bold">Check Your Email</h1>
                <p className="text-sm text-muted-foreground">
                    We sent a reset link to <strong>{submittedEmail}</strong>. Check your
                    inbox and follow the instructions.
                </p>
                <p className="text-xs text-muted-foreground">
                    Didn&apos;t receive it? Check spam or{" "}
                    <button
                        type="button"
                        onClick={() => setSubmitted(false)}
                        className="text-primary font-medium hover:underline"
                    >
                        try again
                    </button>
                    .
                </p>
                <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Sign In
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto p-6 md:p-8 bg-card border rounded-2xl shadow-sm">
            <div className="mb-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-3">
                    <Mail className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Forgot Password?</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Enter your registered email and we&apos;ll send you a reset link.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="you@gmail.com"
                        autoCapitalize="none"
                        {...register("email")}
                    />
                    {errors.email && (
                        <p className="text-xs text-destructive">{errors.email.message}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full h-11 font-medium"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Sending Reset Link...
                        </span>
                    ) : (
                        "Send Reset Link"
                    )}
                </Button>

                <Link
                    className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    href="/login"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Sign In
                </Link>
            </form>
        </div>
    );
}
