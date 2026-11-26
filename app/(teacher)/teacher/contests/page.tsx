"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Trophy, Plus, Pencil, Trash2, Globe, Lock, Clock, Users, ArrowRight, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api/api-client";
import { apiEndpoints } from "@/lib/api/endpoints";
import type { ApiResponse, PageResultRequest } from "@/types/common";
import type { ContestRequest } from "@/types/contests";
import { cn } from "@/lib/utils";

function formatDate(d: Date | string) {
  return new Date(d).toLocaleString("en-BD", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function TeacherContestsPage() {
  const router = useRouter();
  const [contests, setContests] = useState<ContestRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await apiClient<ApiResponse<PageResultRequest<ContestRequest>>>(
          `${apiEndpoints.contests.teacher}?pageNumber=1&pageSize=50`
        );
        if (res.success && res.data) setContests(res.data.items ?? []);
        else toast.error(res.message || "Failed to load contests.");
      } catch (e: any) {
        toast.error(e.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await apiClient<ApiResponse<boolean>>(apiEndpoints.contests.delete(id), { method: "DELETE" });
      if (res.success) {
        setContests(prev => prev.filter(c => c.id !== id));
        toast.success("Contest deleted.");
      } else toast.error(res.message || "Failed to delete.");
    } catch (e: any) {
      toast.error(e.message || "Something went wrong.");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold">My Contests</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{contests.length} contest{contests.length !== 1 ? "s" : ""} created</p>
        </div>
        <Button onClick={() => router.push("/teacher/contests/create")}>
          <Plus className="w-4 h-4 mr-2" /> New Contest
        </Button>
      </div>

      {contests.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Trophy className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No contests yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {contests.map(c => {
            const now = new Date();
            const start = new Date(c.startAt);
            const end = new Date(c.endAt);
            const isLive = now >= start && now <= end;
            return (
              <div key={c.id} className="rounded-xl border border-border bg-card p-4 space-y-3 hover:border-primary/40 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Trophy className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold truncate">{c.title}</h3>
                      <p className="text-xs text-muted-foreground">{c.curriculum}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {isLive && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-medium flex items-center gap-1",
                      c.contestType === "Global"
                        ? "border-blue-500/40 text-blue-500 bg-blue-500/10"
                        : "border-violet-500/40 text-violet-500 bg-violet-500/10")}>
                      {c.contestType === "Global" ? <Globe className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
                      {c.contestType}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1"><CalendarClock className="w-3 h-3" /> {formatDate(c.startAt)}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {c.durationMinutes} min</span>
                  <span className="flex items-center gap-1"><Trophy className="w-3 h-3" /> {c.totalProblems} problems</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {c.totalParticipants} joined</span>
                </div>

                <div className="flex gap-2 pt-1">
                  <Button size="sm" variant="outline" className="flex-1"
                    onClick={() => router.push(`/teacher/contests/${c.id}`)}>
                    <ArrowRight className="w-3.5 h-3.5 mr-1" /> View
                  </Button>
                  <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                    disabled={deleting === c.id}
                    onClick={() => handleDelete(c.id, c.title)}>
                    {deleting === c.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
