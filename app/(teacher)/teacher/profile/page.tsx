"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Camera, User, Save, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api/api-client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { getImageUrl } from "@/lib/utils";
import useAuth from "@/features/hooks/useAuth";
import type { ApiResponse } from "@/types/common";
import type { TeacherProfileRequest, UpdateTeacherProfileRequest } from "@/types/teacher";

const profileSchema = z.object({
  department: z.string().trim().min(2, "Department is required."),
  university: z.string().trim().min(2, "University is required."),
});
type ProfileForm = z.infer<typeof profileSchema>;

export default function TeacherProfilePage() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState<TeacherProfileRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<ProfileForm>({ resolver: zodResolver(profileSchema) });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient<ApiResponse<TeacherProfileRequest>>(apiEndpoints.teachers.getProfile);
        if (res.success && res.data) {
          setProfile(res.data);
          setPreviewUrl(res.data.profileImageUrl ?? "");
          reset({ department: res.data.department, university: res.data.university });
        } else toast.error(res.message || "Failed to load profile.");
      } catch (e: any) {
        toast.error(e.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [reset]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Max file size is 5MB."); return; }
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await apiClient<ApiResponse<{ imageUrl: string; fullUrl: string }>>(
        apiEndpoints.upload.profileImage, { method: "POST", body: form }
      );
      if (res.success && res.data) { setPreviewUrl(res.data.fullUrl); toast.success("Image uploaded!"); }
      else toast.error(res.message || "Upload failed.");
    } catch (e: any) { toast.error(e.message || "Upload failed."); }
    finally { setUploading(false); }
  };

  const onSubmit = async (data: ProfileForm) => {
    try {
      const payload: UpdateTeacherProfileRequest = {
        department: data.department,
        university: data.university,
        profileImageUrl: previewUrl || undefined,
      };
      const res = await apiClient<ApiResponse<TeacherProfileRequest>>(
        apiEndpoints.teachers.updateProfile, { method: "PUT", body: JSON.stringify(payload) }
      );
      if (res.success && res.data) {
        setProfile(res.data);
        updateUser({ profileImageUrl: res.data.profileImageUrl });
        toast.success("Profile updated!");
      } else toast.error(res.message || "Update failed.");
    } catch (e: any) { toast.error(e.message || "Something went wrong."); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;

  const initials = profile?.fullname?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() ?? "?";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold">My Profile</h1>
        <p className="text-sm text-muted-foreground mt-0.5">View and update your teacher profile.</p>
      </div>

      {/* Avatar + info */}
      <div className="rounded-xl border border-border bg-card p-6 flex flex-col sm:flex-row items-center gap-5">
        <div className="relative shrink-0">
          {previewUrl ? (
            <img src={getImageUrl(previewUrl)} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-border" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center border-2 border-border">
              <span className="text-primary-foreground text-xl font-bold">{initials}</span>
            </div>
          )}
          <label className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:bg-primary/90 border-2 border-background">
            {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
          </label>
        </div>
        <div>
          <p className="font-bold text-lg">{profile?.fullname}</p>
          <p className="text-sm text-muted-foreground">{profile?.email}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium flex items-center gap-1">
              <GraduationCap className="w-3 h-3" /> {profile?.department}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{profile?.university}</span>
          </div>
        </div>
      </div>

      {/* Academic qualifications (readonly) */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="font-semibold text-sm flex items-center gap-2"><GraduationCap className="w-4 h-4 text-primary" /> Academic Qualifications</div>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">SSC</p>
            <p className="font-medium">GPA {profile?.sscResult} · {profile?.sscGroup} · {profile?.sscBoard}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">HSC</p>
            <p className="font-medium">GPA {profile?.hscResult} · {profile?.hscGroup} · {profile?.hscBoard}</p>
          </div>
        </div>
      </div>

      {/* Edit form */}
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2 font-semibold text-sm mb-2">
          <User className="w-4 h-4 text-primary" /> Edit Information
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="department">Department</Label>
          <Input id="department" placeholder="e.g. English Literature" {...register("department")} />
          {errors.department && <p className="text-xs text-destructive">{errors.department.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="university">University / Institution</Label>
          <Input id="university" placeholder="e.g. University of Dhaka" {...register("university")} />
          {errors.university && <p className="text-xs text-destructive">{errors.university.message}</p>}
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Saving...</span>
            : <span className="flex items-center gap-2"><Save className="w-4 h-4" />Save Changes</span>}
        </Button>
      </form>
    </div>
  );
}
