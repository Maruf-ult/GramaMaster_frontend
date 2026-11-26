"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Loader2, Users, Trophy, BookOpen, BarChart2,
  TrendingUp, ArrowRight, DollarSign,
} from "lucide-react";
import { apiClient } from "@/lib/api/api-client";
import { apiEndpoints } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/common";
import type { AdminDashboardRequest, MonthlyProgressRequest } from "@/types/analytics";
import { cn } from "@/lib/utils";

function StatCard({ label, value, icon: Icon, color, sub }: { label: string; value: string | number; icon: React.ElementType; color: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
        <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}><Icon className="w-4 h-4" /></div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<AdminDashboardRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await apiClient<ApiResponse<AdminDashboardRequest>>(apiEndpoints.analytics.adminDashboard);
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

  const maxScore = Math.max(...(data.monthlyStatistics?.map(m => m.averageScore) ?? [1]), 1);

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Platform-wide overview.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Students" value={data.totalStudents} icon={Users} color="bg-blue-500/15 text-blue-500" />
        <StatCard label="Teachers" value={data.totalTeachers} icon={Users} color="bg-violet-500/15 text-violet-500" />
        <StatCard label="Contests" value={data.totalContests} icon={Trophy} color="bg-orange-500/15 text-orange-500" />
        <StatCard label="Problems" value={data.totalProblems} icon={BookOpen} color="bg-green-500/15 text-green-500" />
        <StatCard label="Practice Sessions" value={data.totalPracticeSessions} icon={BarChart2} color="bg-cyan-500/15 text-cyan-500" />
        <StatCard label="AI Requests" value={data.totalAIRequests} icon={TrendingUp} color="bg-pink-500/15 text-pink-500" />
        <StatCard label="AI Cost" value={`$${data.totalAICost?.toFixed(4) ?? "0.00"}`} icon={DollarSign} color="bg-yellow-500/15 text-yellow-600" sub="Total API spend" />
      </div>

      {/* Monthly progress bar chart */}
      {data.monthlyStatistics?.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <BarChart2 className="w-4 h-4 text-primary" /> Monthly Activity
          </div>
          <div className="flex items-end gap-2 h-32 overflow-x-auto">
            {data.monthlyStatistics.map((m: MonthlyProgressRequest) => {
              const h = Math.max(8, (m.averageScore / maxScore) * 100);
              return (
                <div key={m.month} className="flex flex-col items-center gap-1 min-w-[40px]">
                  <div
                    className="w-8 rounded-t-md bg-primary/70 hover:bg-primary transition-colors cursor-default"
                    style={{ height: `${h}%` }}
                    title={`Avg: ${m.averageScore.toFixed(1)}`}
                  />
                  <span className="text-[9px] text-muted-foreground font-mono">{m.month.slice(0, 3)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AI usage */}
      {data.aiUsage?.length > 0 && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border font-semibold text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" /> AI Feature Usage
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/30">
                <tr>
                  {["Feature", "Requests", "Tokens", "Avg Tokens", "Cost"].map(h => (
                    <th key={h} className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.aiUsage.map(a => (
                  <tr key={a.featureName} className="border-b border-border last:border-0 hover:bg-muted/20">
                    <td className="px-4 py-3 text-sm font-medium">{a.featureName}</td>
                    <td className="px-4 py-3 text-sm">{a.totalRequests}</td>
                    <td className="px-4 py-3 text-sm">{a.totalTokens.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm">{a.averageTokens.toFixed(0)}</td>
                    <td className="px-4 py-3 text-sm font-mono">${a.totalCost.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick nav */}
      <div className="grid sm:grid-cols-4 gap-3">
        {[
          { label: "Users", href: "/admin/users", icon: Users, color: "bg-blue-500/10 text-blue-600" },
          { label: "Topics", href: "/admin/topics", icon: BookOpen, color: "bg-green-500/10 text-green-600" },
          { label: "Grammar Rules", href: "/admin/questions", icon: BookOpen, color: "bg-violet-500/10 text-violet-600" },
          { label: "Analytics", href: "/admin/analytics", icon: BarChart2, color: "bg-orange-500/10 text-orange-600" },
        ].map(({ label, href, icon: Icon, color }) => (
          <button key={href} onClick={() => router.push(href)}
            className={cn("flex items-center gap-2 p-3.5 rounded-xl border border-border hover:border-primary/40 transition-colors text-left text-sm font-medium", color)}>
            <Icon className="w-4 h-4 shrink-0" />{label}
          </button>
        ))}
      </div>
    </div>
  );
}
