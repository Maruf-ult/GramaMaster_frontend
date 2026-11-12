"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "sonner";
import {
  UploadCloud,
  User,
  Loader2,
  GraduationCap,
  Eye,
  EyeOff,
  Building2,
  Award,
  Lock,
} from "lucide-react";

import {
  teacherRegisterFormValues,
  teacherRegisterSchema,
} from "@/features/schemas/teacher-register.schema";
import useAuth from "@/features/hooks/useAuth";
import { apiClient } from "@/lib/api/api-client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { EducationBoard, LoginResponseRequest } from "@/types/auth";
import { ApiResponse, UploadImageResponse } from "@/types/common";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const boards: EducationBoard[] = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Jashore",
  "Cumilla",
  "Barisal",
  "Sylhet",
  "Dinajpur",
  "Mymensingh",
  "Madrasah",
  "Technical",
];

export default function TeacherRegisterPage() {
  const { login } = useAuth();
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<teacherRegisterFormValues>({
    resolver: zodResolver(teacherRegisterSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      department: "",
      university: "",
      sscResult: 5.0,
      sscGroup: "Science",
      sscBoard: "Dhaka",
      hscResult: 5.0,
      hscGroup: "Science",
      hscBoard: "Dhaka",
      profileImageUrl: "",
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5 MB");
      return;
    }

    setImagePreview(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploadingImage(true);
      const res = await apiClient<ApiResponse<UploadImageResponse>>(
        apiEndpoints.upload.profileImage,
        {
          method: "POST",
          body: formData,
        }
      );

      if (res.data?.imageUrl) {
        setValue("profileImageUrl", res.data.imageUrl, { shouldValidate: true });
        toast.success("Profile photo uploaded successfully!");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload profile photo");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const onSubmit = async (data: teacherRegisterFormValues) => {
    try {
      const response = await apiClient<ApiResponse<LoginResponseRequest>>(
        apiEndpoints.auth.registerTeacher,
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      );

      if (response.data) {
        toast.success("Teacher account created! Welcome to GramaMaster.");
        login(response.data);
      }
    } catch (error: any) {
      toast.error(error.message || "Teacher registration failed. Please check your data.");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 md:p-10 bg-card border rounded-3xl shadow-sm">
      {/* Header */}
      <div className="mb-8 text-center sm:text-left border-b pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
          <GraduationCap className="w-4 h-4" />
          Educator Portal
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Teacher Registration</h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Join GramaMaster to create grammar contests, manage student teams, and monitor academic progress.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Section 1: Profile & Photo */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold tracking-wide text-foreground uppercase text-muted-foreground flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Personal Information
          </h2>

          <div className="flex items-center gap-5 p-4 border rounded-2xl bg-muted/20">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-muted flex items-center justify-center border shadow-sm shrink-0">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-muted-foreground/60" />
              )}
              {isUploadingImage && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
            </div>

            <div>
              <Label
                htmlFor="teacher-avatar"
                className="cursor-pointer inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline bg-background px-3 py-1.5 border rounded-lg shadow-xs"
              >
                <UploadCloud className="w-4 h-4" />
                {imagePreview ? "Change Photo" : "Upload Profile Photo"}
              </Label>
              <Input
                id="teacher-avatar"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                Supported formats: JPG, PNG, WEBP (Max 5 MB)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                {...register("fullName")}
                placeholder="e.g. Dr. Rafiqul Islam"
              />
              {errors.fullName && (
                <p className="text-xs text-destructive">{errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="teacher@example.com"
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Security */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold tracking-wide text-foreground uppercase text-muted-foreground flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" />
            Security
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  {...register("password")}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Professional Affiliation */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold tracking-wide text-foreground uppercase text-muted-foreground flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            Current Institution
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="university">University / College</Label>
              <Input
                id="university"
                {...register("university")}
                placeholder="e.g. University of Dhaka"
              />
              {errors.university && (
                <p className="text-xs text-destructive">{errors.university.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                {...register("department")}
                placeholder="e.g. Department of English"
              />
              {errors.department && (
                <p className="text-xs text-destructive">{errors.department.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 4: Academic Background */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold tracking-wide text-foreground uppercase text-muted-foreground flex items-center gap-2">
            <Award className="w-4 h-4 text-primary" />
            Academic Qualifications
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SSC Card */}
            <div className="p-5 border rounded-2xl space-y-4 bg-muted/10">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-semibold text-sm">SSC Qualification</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium">
                  Class 10
                </span>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">GPA (1.00 - 5.00)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min={1}
                    max={5}
                    placeholder="5.00"
                    {...register("sscResult", { valueAsNumber: true })}
                  />
                  {errors.sscResult && (
                    <p className="text-xs text-destructive">{errors.sscResult.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Study Group</Label>
                  <Select
                    value={watch("sscGroup")}
                    onValueChange={(v) => setValue("sscGroup", v as any, { shouldValidate: true })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Science">Science</SelectItem>
                      <SelectItem value="Arts">Arts</SelectItem>
                      <SelectItem value="BusinessStudies">Business Studies</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.sscGroup && (
                    <p className="text-xs text-destructive">{errors.sscGroup.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Education Board</Label>
                  <Select
                    value={watch("sscBoard")}
                    onValueChange={(v) => setValue("sscBoard", v as any, { shouldValidate: true })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Board" />
                    </SelectTrigger>
                    <SelectContent>
                      {boards.map((b) => (
                        <SelectItem key={b} value={b}>
                          {b} Board
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.sscBoard && (
                    <p className="text-xs text-destructive">{errors.sscBoard.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* HSC Card */}
            <div className="p-5 border rounded-2xl space-y-4 bg-muted/10">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-semibold text-sm">HSC Qualification</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium">
                  Class 12
                </span>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">GPA (1.00 - 5.00)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min={1}
                    max={5}
                    placeholder="5.00"
                    {...register("hscResult", { valueAsNumber: true })}
                  />
                  {errors.hscResult && (
                    <p className="text-xs text-destructive">{errors.hscResult.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Study Group</Label>
                  <Select
                    value={watch("hscGroup")}
                    onValueChange={(v) => setValue("hscGroup", v as any, { shouldValidate: true })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Science">Science</SelectItem>
                      <SelectItem value="Arts">Arts</SelectItem>
                      <SelectItem value="BusinessStudies">Business Studies</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.hscGroup && (
                    <p className="text-xs text-destructive">{errors.hscGroup.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Education Board</Label>
                  <Select
                    value={watch("hscBoard")}
                    onValueChange={(v) => setValue("hscBoard", v as any, { shouldValidate: true })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Board" />
                    </SelectTrigger>
                    <SelectContent>
                      {boards.map((b) => (
                        <SelectItem key={b} value={b}>
                          {b} Board
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.hscBoard && (
                    <p className="text-xs text-destructive">{errors.hscBoard.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 text-base font-semibold shadow-md transition-all hover:scale-[1.005]"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" /> Creating Teacher Account...
            </span>
          ) : (
            "Complete Teacher Registration"
          )}
        </Button>

        {/* Navigation Switchers */}
        <div className="pt-2 text-center space-y-2 text-sm text-muted-foreground">
          <p>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Sign In
            </Link>
          </p>
          <p>
            Are you a student?{" "}
            <Link href="/register/student" className="font-semibold text-primary hover:underline">
              Register as Student instead
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
