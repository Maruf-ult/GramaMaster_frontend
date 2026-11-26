"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Loader2, LayoutDashboard, Trophy, BookOpen,
  Users, BarChart2, TrendingUp, ArrowRight,
} from "lucide-react";
import { apiClient } from "@/lib/api/api-client";
import { apiEndpoints } from "@/lib/api/endpoints";
import useAuth from "@/features/hooks/useAuth";
import type { ApiResponse } from "@/types/common";
import type { TeacherDashboardRequest, RecentContestRequest, teamSummaryRequest } from "@/types/teacher";
import { cn } from "@/lib/utils";

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: React.ElementType; color: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
        <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

export default function TeacherDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<TeacherDashboardRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await apiClient<ApiResponse<TeacherDashboardRequest>>(apiEndpoints.teachers.dashboard);
        if (res.success && res.data) setData(res.data);
        else toast.error(res.message || "Failed to load dashboard.");
      } catch (e: any) {
        toast.error(e.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;
  if (!data) return <div className="text-center py-16 text-muted-foreground">Could not load dashboard.</div>;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Greeting */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold">{greeting}, {user?.fullName?.split(" ")[0]} 👋</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Here&apos;s your classroom overview.</p>
        </div>
        <button
          onClick={() => router.push("/teacher/contests/create")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Create Contest <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Teams" value={data.totalTeams} icon={Users} color="bg-blue-500/15 text-blue-500" />
        <StatCard label="Students" value={data.totalStudents} icon={LayoutDashboard} color="bg-violet-500/15 text-violet-500" />
        <StatCard label="Contests" value={data.totalContests} icon={Trophy} color="bg-orange-500/15 text-orange-500" />
        <StatCard label="Avg. Accuracy" value={`${data.averageStudentAccuracy?.toFixed(0) ?? 0}%`} icon={TrendingUp} color="bg-green-500/15 text-green-500" />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Recent Contests */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <Trophy className="w-4 h-4 text-primary" /> Recent Contests
          </div>
          {!data.recentContests?.length ? (
            <p className="text-xs text-muted-foreground">No contests yet.</p>
          ) : (
            <div className="space-y-2">
              {data.recentContests.map((c: RecentContestRequest) => (
                <div key={c.contestId} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/teacher/contests/${c.contestId}`)}>
                  <div>
                    <p className="text-xs font-semibold truncate max-w-[180px]">{c.title}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(c.startAt).toLocaleDateString("en-BD", { day: "2-digit", month: "short" })} · {c.participantCount} students
                    </p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                </div>
              ))}
            </div>
          )}
          <button onClick={() => router.push("/teacher/contests")} className="text-xs text-primary hover:underline flex items-center gap-1 mt-1">
            All contests <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Teams summary */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <Users className="w-4 h-4 text-primary" /> Your Teams
          </div>
          {!data.teams?.length ? (
            <p className="text-xs text-muted-foreground">No teams yet. Create one from the Students page.</p>
          ) : (
            <div className="space-y-2">
              {data.teams.map((t: teamSummaryRequest) => (
                <div key={t.teamId} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30">
                  <p className="text-xs font-semibold">{t.teamName}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                    {t.studentCount} students
                  </span>
                </div>
              ))}
            </div>
          )}
          <button onClick={() => router.push("/teacher/students")} className="text-xs text-primary hover:underline flex items-center gap-1 mt-1">
            Manage students <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { label: "Manage Students", icon: Users, href: "/teacher/students", color: "bg-blue-500/10 text-blue-600" },
          { label: "Create Contest", icon: Trophy, href: "/teacher/contests/create", color: "bg-orange-500/10 text-orange-600" },
          { label: "View Analytics", icon: BarChart2, href: "/teacher/analytics", color: "bg-green-500/10 text-green-600" },
        ].map(({ label, icon: Icon, href, color }) => (
          <button key={href} onClick={() => router.push(href)}
            className={cn("flex items-center gap-2.5 p-3.5 rounded-xl border border-border hover:border-primary/40 transition-colors text-left", color)}>
            <Icon className="w-4 h-4 shrink-0" />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
