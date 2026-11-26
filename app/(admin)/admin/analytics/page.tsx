"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Activity,
  BarChart3,
  BookOpen,
  Cpu,
  DollarSign,
  GraduationCap,
  Trophy,
  Users,
} from "lucide-react";
import { apiClient } from "@/lib/api/api-client";
import { apiEndpoints } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/common";
import type {
  AdminDashboardRequest,
  TopicStatisticsRequest,
} from "@/types/analytics";
import { DashboardSkeleton } from "@/components/ui/skeleton-card";

export default function AdminAnalyticsPage() {
  const [dashboard, setDashboard] = useState<AdminDashboardRequest | null>(null);
  const [topics, setTopics] = useState<TopicStatisticsRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [dashRes, topicsRes] = await Promise.all([
          apiClient<ApiResponse<AdminDashboardRequest>>(
            apiEndpoints.analytics.adminDashboard
          ),
          apiClient<ApiResponse<TopicStatisticsRequest[]>>(
            apiEndpoints.analytics.topics
          ),
        ]);

        if (dashRes.success && dashRes.data) {
          setDashboard(dashRes.data);
        }
        if (topicsRes.success && topicsRes.data) {
          setTopics(topicsRes.data);
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

  const stats = [
    {
      label: "Total Students",
      value: dashboard?.totalStudents ?? 0,
      icon: GraduationCap,
      color: "bg-blue-500/15 text-blue-600",
    },
    {
      label: "Total Teachers",
      value: dashboard?.totalTeachers ?? 0,
      icon: Users,
      color: "bg-violet-500/15 text-violet-600",
    },
    {
      label: "Total Contests",
      value: dashboard?.totalContests ?? 0,
      icon: Trophy,
      color: "bg-amber-500/15 text-amber-600",
    },
    {
      label: "Total Problems",
      value: dashboard?.totalProblems ?? 0,
      icon: BookOpen,
      color: "bg-emerald-500/15 text-emerald-600",
    },
    {
      label: "Practice Sessions",
      value: dashboard?.totalPracticeSessions ?? 0,
      icon: Activity,
      color: "bg-cyan-500/15 text-cyan-600",
    },
    {
      label: "AI Requests",
      value: dashboard?.totalAIRequests ?? 0,
      icon: Cpu,
      color: "bg-pink-500/15 text-pink-600",
    },
    {
      label: "Total AI Cost",
      value: `$${(dashboard?.totalAICost ?? 0).toFixed(2)}`,
      icon: DollarSign,
      color: "bg-orange-500/15 text-orange-600",
    },
  ];

  const monthly = dashboard?.monthlyStatistics ?? [];
  const maxMonthlyActivity = Math.max(
    1,
    ...monthly.map((m) => m.totalPractice + m.totalContests)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-primary" />
          Platform Analytics
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of user activity, topic accuracy, and AI usage across GramaMaster.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-border bg-card p-4 flex items-center gap-3"
          >
            <div
              className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center shrink-0`}
            >
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-xl font-bold">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Activity */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h2 className="font-semibold text-base">Monthly Activity</h2>
        {monthly.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            No monthly statistics available yet.
          </p>
        ) : (
          <div className="space-y-3">
            {monthly.map((m) => {
              const total = m.totalPractice + m.totalContests;
              const widthPercent = Math.round((total / maxMonthlyActivity) * 100);
              return (
                <div key={m.month} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">{m.month}</span>
                    <span className="text-muted-foreground">
                      {m.totalPractice} practices · {m.totalContests} contests · Avg{" "}
                      {m.averageScore.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${widthPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Topic Performance Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="font-semibold text-base">Topic Performance</h2>
        </div>
        {topics.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            No topic statistics available yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Topic</th>
                  <th className="text-right px-4 py-3 font-medium">Questions</th>
                  <th className="text-right px-4 py-3 font-medium">Correct</th>
                  <th className="text-right px-4 py-3 font-medium">Accuracy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {topics.map((t) => (
                  <tr key={t.topicId} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{t.topicName}</td>
                    <td className="px-4 py-3 text-right">{t.totalQuestions}</td>
                    <td className="px-4 py-3 text-right">{t.correctAnswers}</td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {t.accuracy.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* AI Usage Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="font-semibold text-base">AI Feature Usage</h2>
        </div>
        {!dashboard?.aiUsage || dashboard.aiUsage.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            No AI usage recorded yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Feature</th>
                  <th className="text-right px-4 py-3 font-medium">Requests</th>
                  <th className="text-right px-4 py-3 font-medium">Total Tokens</th>
                  <th className="text-right px-4 py-3 font-medium">Avg Tokens</th>
                  <th className="text-right px-4 py-3 font-medium">Total Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {dashboard.aiUsage.map((ai) => (
                  <tr key={ai.featureName} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{ai.featureName}</td>
                    <td className="px-4 py-3 text-right">{ai.totalRequests}</td>
                    <td className="px-4 py-3 text-right">
                      {ai.totalTokens.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {ai.averageTokens.toFixed(0)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      ${ai.totalCost.toFixed(4)}
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
