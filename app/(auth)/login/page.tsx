import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import useAuth from "@/features/hooks/useAuth";
import { LoginFormValues, loginSchema } from "@/features/schemas/login.schema";
import { apiClient } from "@/lib/api/api-client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { LoginResponseRequest } from "@/types/auth";
import { ApiResponse } from "@/types/common";
import { Input } from "@base-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function LoginPage() {

    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });


    const onSubmit = async (data: LoginFormValues) => {
        try {
            const response = await apiClient<ApiResponse<LoginResponseRequest>>(apiEndpoints.auth.login, {
                method: "POST",
                body: JSON.stringify(data);
            })
            if (response.data) {
                toast.success(`Welcome back, ${response.data.fullName}`);
                login(response.data);
            }
        } catch (error: any) {
            toast.error(error.message || "Invalid email or password.");
        }
    };



    return (
        <div className="w-full max-w-md mx-auto p-6 md:p-8 bg-card border rounded-2xl shadow-sm">

            <div className="mb-6 text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    Master English Grammar
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Sign In</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Enter your Credentials to access your dashboard
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                    <Label htmlFor="email">Email Adress</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="you@gmail.com"
                        autoComplete="email"
                        {...register("email")}
                    />
                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-xs font-medium text-primary hover:underline" >Forgot password?</Link>
                    <div className="relaative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="*********"
                            autoComplete="current-password"
                            {...register("password")}
                        />
                        <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                </div>

                <Button type="submit" className="w-full h-11 text-base font-medium mt-2" disabled={isSubmitting}>
                    {isSubmitting ? (<span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Signing In...
                    </span>) : ("Sign In")}
                </Button>
                <div className="pt-4 border-t text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                        Don't have an account yet?
                    </p>
                    <div className="flex justify-center gap-4 text-sm font-semibold">
                        <Link href="/register/student" className="text-primary hover:underline">
                            Register as Student
                        </Link>
                        <span className="text-muted-foreground">•</span>
                        <Link href="/register/teacher" className="text-primary hover:underline">
                            Register as Teacher
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
}