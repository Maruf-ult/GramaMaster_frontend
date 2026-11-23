"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
    Loader2, Search, Users, ShieldCheck,
    ShieldOff, Trash2, Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api/api-client";
import { apiEndpoints } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/common";
import type { UserRequest } from "@/types/user";
import type { UserRole } from "@/types/auth";
import { cn } from "@/lib/utils";


const ROLE_COLORS: Record<UserRole, string> = {
    Student: "bg-blue-500/15 text-blue-600",
    Teacher: "bg-violet-500/15 text-violet-600",
    Admin: "bg-orange-500/15 text-orange-600",
};

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState<UserRole | "All">("All");
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await apiClient<ApiResponse<UserRequest[]>>(apiEndpoints.users.getAll);
                if (res.success && res.data) {
                    setUsers(res.data);
                } else {
                    toast.error(res.message || "Failed to laod users.");
                }

            } catch (error: any) {
                toast.error(error.message || "Something went wrong.")
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, []);

    const handleToggleStatus = async (user: UserRequest) => {
        setActionLoading(user.id);
        try {
            const res = await apiClient<ApiResponse<boolean>>(apiEndpoints.users.updateStatus(user.id), {
                method: "PATCH", body: JSON.stringify({ isActive: !user.isActive })
            });
            if (res.success) {
                setUsers((prev) =>
                    prev.map((u) => u.id === user.id ? { ...u, isActive: !u.isActive } : u)
                );
                toast.success(`${user.fullname} ${!user.isActive ? "activated" : "deactivated"}`);
            } else {
                toast.error(res.message || "Failed to update status.");
            }
        } catch (error: any) {
            toast.error(error.message || "Something went wrong.");
        } finally {
            setActionLoading(null);
        }
    }

    const handleDelete = async (user: UserRequest) => {
        if (!confirm(`Permanently delete ${user.fullname}? This cannot be undone.`))
            return;
        setActionLoading(user.id + "_delete");
        try {
            const res = await apiClient<ApiResponse<boolean>>(apiEndpoints.users.delete(user.id), { method: "DELETE" });
            if (res.success) {
                setUsers((prev) => prev.filter((u) => u.id !== user.id));
                toast.success(`${user.fullname} deleted.`);
            } else {
                toast.error(res.message || "Failed to delete user.");
            }
        } catch (error: any) {
            toast.error(error.message || "Something went wrong.");
        } finally {
            setActionLoading(null);
        }
    }

    const filtered = users.filter((u) => {
        const matchSearch = u.fullname.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
        const matchRole = roleFilter === "All" || u.role === roleFilter;
        return matchSearch && matchRole;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        );
    }
    return (
        <div className="space-y-5 max-w-6xl">

            <div>
                <h1 className="text-xl font-bold">User Management</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                    {users.length} users total · {users.filter((u) => u.isActive).length} active
                </p>
            </div>

            <div className="flex flex-wrap gap-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 w-64"
                    />
                </div>
                <div className="flex gap-1 items-center">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    {(["All", "Student", "Teacher", "Admin"] as const).map((role) => (
                        <button
                            key={role}
                            onClick={() => setRoleFilter(role)}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                                roleFilter === role
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "border-border text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {role}
                        </button>
                    ))}
                </div>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-border bg-muted/30">
                            <tr>
                                {["Name", "Email", "Role", "Status", "Joined", "Actions"].map((h) => (
                                    <th key={h} className="text-left text-xs font-medium text-muted-foreground px-4 py-3 uppercase tracking-wide">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-muted-foreground text-sm">
                                        <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                        No users match your search.
                                    </td>
                                </tr>
                            )}
                            {filtered.map((user) => (
                                <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                                    <td className="px-4 py-3 text-sm font-medium">{user.fullname}</td>
                                    <td className="px-4 py-3 text-sm text-muted-foreground">{user.email}</td>
                                    <td className="px-4 py-3">
                                        <span className={cn(
                                            "text-xs px-2 py-0.5 rounded-full font-medium",
                                            ROLE_COLORS[user.role]
                                        )}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={cn(
                                            "text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 w-fit",
                                            user.isActive
                                                ? "bg-green-500/15 text-green-600"
                                                : "bg-red-500/15 text-red-500"
                                        )}>
                                            <span className={cn(
                                                "w-1.5 h-1.5 rounded-full",
                                                user.isActive ? "bg-green-500" : "bg-red-500"
                                            )} />
                                            {user.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-muted-foreground">
                                        {new Date(user.createdAt).toLocaleDateString("en-BD", {
                                            day: "2-digit", month: "short", year: "numeric",
                                        })}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                onClick={() => handleToggleStatus(user)}
                                                disabled={actionLoading === user.id}
                                                title={user.isActive ? "Deactivate" : "Activate"}
                                                className={cn(
                                                    "w-7 h-7 rounded-lg flex items-center justify-center transition-colors",
                                                    user.isActive
                                                        ? "text-muted-foreground hover:text-orange-500 hover:bg-orange-500/10"
                                                        : "text-muted-foreground hover:text-green-500 hover:bg-green-500/10"
                                                )}
                                            >
                                                {actionLoading === user.id
                                                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    : user.isActive
                                                        ? <ShieldOff className="w-3.5 h-3.5" />
                                                        : <ShieldCheck className="w-3.5 h-3.5" />
                                                }
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user)}
                                                disabled={actionLoading === user.id + "_delete"}
                                                title="Delete user"
                                                className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                            >
                                                {actionLoading === user.id + "_delete"
                                                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    : <Trash2 className="w-3.5 h-3.5" />
                                                }
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}