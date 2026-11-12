"use client"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { resetPasswordSchema, resetPasswordValues } from '@/features/schemas/reset-password.schema';
import { apiClient } from '@/lib/api/api-client';
import { apiEndpoints } from '@/lib/api/endpoints';
import { ApiResponse } from '@/types/common';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Eye, EyeOff, Loader, Loader2, Lock } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import React, { Suspense, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

function ResetPasswordForm() {

  const router = useRouter();
  const searchParams = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<resetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: searchParams.get("email") || "",
      token: searchParams.get("token") || "",
      newPassword: "",
      confirmPassword: "",
    }
  });

  const onSubmit = async (data: resetPasswordValues) => {
    try {
      await apiClient<ApiResponse<boolean>>(apiEndpoints.auth.resetPassword, {
        method: "POST",
        body: JSON.stringify(data),
      })
      setSuccess(true);
      toast.success("Password reset successfully!");
      setTimeout(() => router.push("/login"), 2500);
    } catch (error: any) {
      toast.error(error.message || "Failed to reset password. The link may have expired.");
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto p-8 bg-card border rounded-2xl shadow-sm text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-7 h-7 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-2xl font-bold">Password Reset!</h1>
        <p className="text-sm text-muted-foreground">
          Your password has been updated. Redirecting to Sign In...
        </p>
      </div>
    );
  }

  return (
    <div className='w-full max-w-md mx-auto p-8 bg-card border rounded-2xl shadow-sm text-center space-y-4'>
      <div className='mb-6 text-center'>
        <div className='w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3'>
          <Lock className='w-6 h-6 text-primary' />
        </div>
        <h1 className='text-2xl font-bold tracking-tight'>
          Create New Password
        </h1>
        <p className='text-sm text-muted-foreground mt-1'>
          Enter your email, the reset token from your email,and your new password
        </p>
      </div>


      <form onSubmit={handleSubmit(onSubmit)} className='spacce-y-4'>
        <div className='space-y-2.5'>
          <Label htmlFor='email'>Email Address</Label>
          <Input
            id='email'
            type='email'
            placeholder='you@gmail.com'
            autoComplete='email'
            {...register("email")}
          />
          {errors.email && (<p className='text-xs text-destructive'>{errors.email.message}</p>)}
        </div>
        <div className='space-y-1.5'>
          <Label htmlFor='token'>Reset Token</Label>
          <Input
            id='token'
            type='text'
            placeholder='Paste the token from your email'
            {...register("token")}
          />
          {errors.token && (<p className='text-xs text-destructive'>{errors.token.message}</p>)}
        </div>
        <div className='space-y-1.5'>
          <Label htmlFor='newPassword'>New Password</Label>
          <div className='relative'>
            <Input
              id='newPassword'
              type={showPassword ? "text" : "password"}
              placeholder='Min. 8 characters'
              {...register("newPassword")}
            />
            <button className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground' onClick={() => setShowPassword(!showPassword)} type='button'>
              {showPassword ? (
                <EyeOff className='w-4 h-4' />
              ) : (
                <Eye className='w-4 h-4' />
              )}
            </button>
          </div>
          {errors.newPassword && (<p className='text-xs text-destructive'>{errors.newPassword.message}</p>)}
        </div>
        <div className='space-y-1.5'>
          <Label htmlFor='confirmPassword'>Confirm New Password</Label>
          <div className='relative'>
            <Input
              id='confirmPassword'
              type={showConfirm ? "text" : "password"}
              placeholder='Re-enter new password'
              {...register("confirmPassword")}
            />
            <button className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground' onClick={() => setShowConfirm(!showConfirm)} type='button'>
              {showConfirm ? (<EyeOff className='w-4 h-4' />) : (<Eye className='h-4 w-4' />)}
            </button>
          </div>
          {errors.confirmPassword && (<p className='text-xs text-destructive'>{errors.confirmPassword.message}</p>)}
        </div>
        <Button className="w-full h-11 font-medium" type='submit' disabled={isSubmitting}>
          {isSubmitting ? (
            <span>
              <Loader2 className='w-4 h-4 animate-spin' />
              Resetting Password...
            </span>) : (
            "Reset Password"
          )}
        </Button>
        <Link className='flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors' href="/login">Back to Sign In</Link>
      </form>
    </div>
  );
}


export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className='w-full max-w-md mx-auto p-8 flex justify-center'>
          <Loader2 className='w-6 h-6 animate-spin text-muted-foreground' />
        </div>
      }>
      <ResetPasswordForm />
    </Suspense>
  );
}