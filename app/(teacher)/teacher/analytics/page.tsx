"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  BarChart2,
  BookOpen,
  Brain,
  CheckCircle2,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import { apiClient } from "@/lib/api/api-client";
import { apiEndpoints } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/common";
import type { TeacherAnalyticsRequest } from "@/types/teacher";
import { DashboardSkeleton } from "@/components/ui/skeleton-card";

export default function TeacherAnalyticsPage() {
  const [analytics, setAnalytics] = useState<TeacherAnalyticsRequest | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await apiClient<ApiResponse<TeacherAnalyticsRequest>>(
          apiEndpoints.teachers.analytics
        );
        if (res.success && res.data) {
          setAnalytics(res.data);
        } else {
          toast.error(res.message || "Failed to load analytics.");
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load analytics.";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  const statCards = [
    {
      label: "Total Students",
      value: analytics?.totalStudent ?? 0,
      icon: Users,
      color: "bg-blue-500/15 text-blue-600",
    },
    {
      label: "Problems Created",
      value: analytics?.totalProblemsCreated ?? 0,
      icon: BookOpen,
      color: "bg-violet-500/15 text-violet-600",
    },
    {
      label: "AI Generated",
      value: analytics?.aiGeneratedProblems ?? 0,
      icon: Brain,
      color: "bg-pink-500/15 text-pink-600",
    },
    {
      label: "Total Contests",
      value: analytics?.totalContests ?? 0,
      icon: Trophy,
      color: "bg-amber-500/15 text-amber-600",
    },
    {
      label: "Running Contests",
      value: analytics?.runningContests ?? 0,
      icon: CheckCircle2,
      color: "bg-emerald-500/15 text-emerald-600",
    },
    {
      label: "Avg. Student Accuracy",
      value: `${(analytics?.averageStudentAccuracy ?? 0).toFixed(1)}%`,
      icon: Target,
      color: "bg-cyan-500/15 text-cyan-600",
    },
  ];

  const topics = analytics?.topicPerformances ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <BarChart2 className="w-6 h-6 text-primary" />
          Class Analytics
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track student accuracy, problem usage, and topic-level strengths across your classes.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-border bg-card p-4 flex items-center gap-3"
          >
            <div
              className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center shrink-0`}
            >
              <card.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{card.label}</p>
              <p className="text-xl font-bold">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="font-semibold text-base">Topic Performance</h2>
        </div>
        {topics.length === 0 ? (
          <p className="text-sm text-muted-foreground py-10 text-center">
            No topic performance data available yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Topic</th>
                  <th className="text-right px-4 py-3 font-medium">
                    Questions Solved
                  </th>
                  <th className="text-right px-4 py-3 font-medium">
                    Avg Accuracy
                  </th>
                  <th className="text-right px-4 py-3 font-medium">
                    Strong Students
                  </th>
                  <th className="text-right px-4 py-3 font-medium">
                    Weak Students
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {topics.map((t) => (
                  <tr key={t.topicId} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{t.topicName}</td>
                    <td className="px-4 py-3 text-right">{t.questionSolved}</td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {t.averageAccuracy.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-right text-emerald-600 font-medium">
                      {t.strongStudents}
                    </td>
                    <td className="px-4 py-3 text-right text-rose-600 font-medium">
                      {t.weakStudents}
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
