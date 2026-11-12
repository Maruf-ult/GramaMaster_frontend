"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "sonner";
import { UploadCloud, CheckCircle2, User, Loader2 } from "lucide-react";

import { studentRegisterSchema, StudentRegisterFormValues } from "@/features/schemas/student-register.schema";
import { apiClient } from "@/lib/api/api-client";
import { apiEndpoints } from "@/lib/api/endpoints";
import useAuth from "@/features/hooks/useAuth";
import { ApiResponse, UploadImageResponse } from "@/types/common";
import { LoginResponseRequest, EducationBoard } from "@/types/auth";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const boards: EducationBoard[] = [
  "Dhaka", "Chattogram", "Rajshahi", "Jashore", "Cumilla",
  "Barisal", "Sylhet", "Dinajpur", "Mymensingh", "Madrasah", "Technical"
];

export default function StudentRegisterPage() {
  const { login } = useAuth();
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<StudentRegisterFormValues>({
    resolver: zodResolver(studentRegisterSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      institutionName: "",
      curriculumType: "SSC",
      group: "Science",
      examBatchYear: new Date().getFullYear(),
      board: "Dhaka",
      profileImageUrl: "",
    },
  });

  // Handle Profile Image Upload
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size must be less than 5 MB");
      return;
    }

    // Local instant preview
    setImagePreview(URL.createObjectURL(file));

    // Upload to ASP.NET Core server
    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploadingImage(true);
      const res = await apiClient<ApiResponse<UploadImageResponse>>(apiEndpoints.upload.profileImage, {
        method: "POST",
        body: formData,
      });

      if (res.data?.imageUrl) {
        setValue("profileImageUrl", res.data.imageUrl);
        toast.success("Profile photo uploaded!");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const onSubmit = async (data: StudentRegisterFormValues) => {
    try {
      const response = await apiClient<ApiResponse<LoginResponseRequest>>(
        apiEndpoints.auth.registerStudent,
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      );

      if (response.data) {
        toast.success("Account created successfully! Welcome to GramaMaster.");
        // Auto-login: stores tokens & redirects straight to /student/dashboard
        login(response.data);
      }
    } catch (error: any) {
      toast.error(error.message || "Registration failed. Please check your information.");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 md:p-8 bg-card border rounded-2xl shadow-sm">
      <div className="mb-6 text-center sm:text-left">
        <h1 className="text-2xl font-bold tracking-tight">Student Registration</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Create your account to start practicing board-standard English grammar.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Photo Upload */}
        <div className="flex items-center gap-4 p-3 border rounded-xl bg-muted/30">
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted flex items-center justify-center border">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-muted-foreground" />
            )}
            {isUploadingImage && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="avatar-upload" className="cursor-pointer text-sm font-medium text-primary hover:underline flex items-center gap-1.5">
              <UploadCloud className="w-4 h-4" />
              {imagePreview ? "Change Photo" : "Upload Profile Photo (Optional)"}
            </Label>
            <Input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            <p className="text-xs text-muted-foreground mt-0.5">JPG, PNG, or WEBP up to 5 MB</p>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Full Name</Label>
            <Input {...register("fullName")} placeholder="e.g. Tanvir Ahmed" />
            {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Email Address</Label>
            <Input {...register("email")} type="email" placeholder="student@example.com" />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
        </div>

        {/* Passwords */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Password</Label>
            <Input {...register("password")} type="password" placeholder="Min. 8 characters" />
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Confirm Password</Label>
            <Input {...register("confirmPassword")} type="password" placeholder="Re-enter password" />
            {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
          </div>
        </div>

        {/* Academic Info */}
        <div className="space-y-1.5">
          <Label>School / College Name</Label>
          <Input {...register("institutionName")} placeholder="e.g. Dhaka College" />
          {errors.institutionName && <p className="text-xs text-destructive">{errors.institutionName.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>Curriculum</Label>
            <Select
              value={watch("curriculumType")}
              onValueChange={(v) => setValue("curriculumType", v as any, { shouldValidate: true })}
            >
              <SelectTrigger className="w-full"><SelectValue placeholder="Curriculum" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="SSC">SSC</SelectItem>
                <SelectItem value="HSC">HSC</SelectItem>
                <SelectItem value="Dakhil">Dakhil</SelectItem>
              </SelectContent>
            </Select>
            {errors.curriculumType && <p className="text-xs text-destructive">{errors.curriculumType.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Study Group</Label>
            <Select
              value={watch("group")}
              onValueChange={(v) => setValue("group", v as any, { shouldValidate: true })}
            >
              <SelectTrigger className="w-full"><SelectValue placeholder="Group" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Science">Science</SelectItem>
                <SelectItem value="Arts">Arts</SelectItem>
                <SelectItem value="BusinessStudies">Business Studies</SelectItem>
              </SelectContent>
            </Select>
            {errors.group && <p className="text-xs text-destructive">{errors.group.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Exam Year</Label>
            <Input
              type="number"
              min={2015}
              max={new Date().getFullYear() + 2}
              {...register("examBatchYear", { valueAsNumber: true })}
            />
            {errors.examBatchYear && <p className="text-xs text-destructive">{errors.examBatchYear.message}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Education Board</Label>
          <Select
            value={watch("board")}
            onValueChange={(v) => setValue("board", v as any, { shouldValidate: true })}
          >
            <SelectTrigger className="w-full"><SelectValue placeholder="Select Education Board" /></SelectTrigger>
            <SelectContent>
              {boards.map((b) => (
                <SelectItem key={b} value={b}>{b} Board</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.board && <p className="text-xs text-destructive">{errors.board.message}</p>}
        </div>

        <Button type="submit" className="w-full h-11 text-base font-medium" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Creating Account...
            </span>
          ) : (
            "Complete Student Registration"
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}