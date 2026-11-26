"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  GraduationCap,
  Loader2,
  Search,
  ShieldCheck,
  ShieldOff,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api/api-client";
import { apiEndpoints } from "@/lib/api/endpoints";
import type { ApiResponse, PageResultRequest } from "@/types/common";
import type { UserRequest } from "@/types/user";
import { TableSkeleton } from "@/components/ui/skeleton-card";

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<UserRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await apiClient<ApiResponse<PageResultRequest<UserRequest>>>(
          `${apiEndpoints.users.teachers}?pageNumber=1&pageSize=100`
        );
        if (res.success && res.data) {
          setTeachers(res.data.items ?? []);
        } else {
          toast.error(res.message || "Failed to load teachers.");
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Something went wrong.";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const handleToggleStatus = async (teacher: UserRequest) => {
    setActionLoading(teacher.id);
    try {
      const res = await apiClient<ApiResponse<boolean>>(
        `${apiEndpoints.users.updateStatus(teacher.id)}?isActive=${!teacher.isActive}`,
        { method: "PATCH" }
      );
      if (res.success) {
        setTeachers((prev) =>
          prev.map((t) =>
            t.id === teacher.id ? { ...t, isActive: !t.isActive } : t
          )
        );
        toast.success(
          `${teacher.fullname} ${!teacher.isActive ? "activated" : "deactivated"}.`
        );
      } else {
        toast.error(res.message || "Failed to update status.");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      toast.error(message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (teacher: UserRequest) => {
    if (
      !confirm(`Permanently delete ${teacher.fullname}? This cannot be undone.`)
    ) {
      return;
    }
    setActionLoading(teacher.id + "_delete");
    try {
      const res = await apiClient<ApiResponse<boolean>>(
        apiEndpoints.users.delete(teacher.id),
        { method: "DELETE" }
      );
      if (res.success) {
        setTeachers((prev) => prev.filter((t) => t.id !== teacher.id));
        toast.success(`${teacher.fullname} deleted.`);
      } else {
        toast.error(res.message || "Failed to delete teacher.");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      toast.error(message);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = teachers.filter(
    (t) =>
      t.fullname.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <TableSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-primary" />
          Manage Teachers
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review registered educators, toggle account access, or remove accounts.
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground py-10 text-center">
            No teachers found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Name</th>
                  <th className="text-left px-4 py-3 font-medium">Email</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{teacher.fullname}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {teacher.email}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          teacher.isActive
                            ? "bg-emerald-500/15 text-emerald-600"
                            : "bg-destructive/15 text-destructive"
                        }`}
                      >
                        {teacher.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={actionLoading === teacher.id}
                          onClick={() => handleToggleStatus(teacher)}
                          className="gap-1.5"
                        >
                          {actionLoading === teacher.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : teacher.isActive ? (
                            <ShieldOff className="w-3.5 h-3.5" />
                          ) : (
                            <ShieldCheck className="w-3.5 h-3.5" />
                          )}
                          {teacher.isActive ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={actionLoading === teacher.id + "_delete"}
                          onClick={() => handleDelete(teacher)}
                        >
                          {actionLoading === teacher.id + "_delete" ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
