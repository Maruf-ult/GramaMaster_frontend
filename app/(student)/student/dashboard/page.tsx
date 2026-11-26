"use client";

import useAuth from "@/features/hooks/useAuth";
import { apiClient } from "@/lib/api/api-client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { ApiResponse } from "@/types/common";
import { StudentDashboardRequest, StudentTopicProgressRequest } from "@/types/student";
import { AlertTriangle, ArrowRight, BookOpen, Loader2, Target, TrendingUp, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  sub?: string;
}

interface TopicBarProps {
  topic: StudentTopicProgressRequest;
  variant: "weak" | "strong";
}

function StatCard({ label, value, icon: Icon, color, sub }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </span>
        <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}

function TopicBar({ topic, variant }: TopicBarProps) {

  const barColor = variant === "weak" ? "bg-red-500" : "bg-green-500";
  const textColor = variant === "weak" ? "text-red-500" : "text-green-500";

  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="font-medium truncate">{topic.topicName}</span>
        <span className={`font-semibold ${textColor} shrink-0 ml-2`}>
          {topic.accuracy.toFixed(0)}%
        </span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-500`}
          style={{ width: `${topic.accuracy}%` }}
        />
      </div>
    </div>
  );
}

export default function StudentDashboardPage() {

  const { user } = useAuth();
  const [data, setData] = useState<StudentDashboardRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await apiClient<ApiResponse<StudentDashboardRequest>>(apiEndpoints.students.dashboard);
        if (response.success && response.data) {
          setData(response.data);
        } else {
          toast.error(response.message || "Failed to load dashboard.");
        }
      } catch (error: any) {
        toast.error(error.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();

  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-muted-foreground py-20">
        Could not load dashboard data.
      </div>
    );
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6 max-w-5xl">

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold">
            {greeting}, {user?.fullName?.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Here&apos;s your learning overview
          </p>
        </div>
        <Link
          href="/student/practice"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Start Practicing
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Questions Solved"
          value={data.totalPracticeQuestions}
          icon={BookOpen}
          color="bg-blue-500/15 text-blue-500"
        />
        <StatCard
          label="Overall Accuracy"
          value={`${data.overallAccuracy.toFixed(0)}%`}
          icon={Target}
          color="bg-green-500/15 text-green-500"
        />
        <StatCard
          label="Contests Joined"
          value={data.totalContestsJoined}
          icon={Trophy}
          color="bg-violet-500/15 text-violet-500"
          sub={`${data.totalContestsCompleted} completed`}
        />
        <StatCard
          label="Current Rank"
          value={`#${data.currentRank}`}
          icon={TrendingUp}
          color="bg-orange-500/15 text-orange-500"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <h2 className="text-sm font-semibold text-red-500">Needs Improvement</h2>
          </div>
          {data.weakTopics.length === 0 ? (
            <p className="text-xs text-muted-foreground">No weak topics found. Great job!</p>
          ) : (
            <div className="space-y-3">
              {data.weakTopics.map((t) => (
                <TopicBar key={t.topicId} topic={t} variant="weak" />
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <h2 className="text-sm font-semibold text-green-500">Strong Topics</h2>
          </div>
          {data.strongTopics.length === 0 ? (
            <p className="text-xs text-muted-foreground">Keep practicing to find your strengths!</p>
          ) : (
            <div className="space-y-3">
              {data.strongTopics.map((t) => (
                <TopicBar key={t.topicId} topic={t} variant="strong" />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm font-semibold">Ready for a challenge?</p>
          <p className="text-xs text-muted-foreground">Join a live contest and compete with other students.</p>
        </div>
        <Link
          href="/student/contests"
          className="px-4 py-2 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors shrink-0"
        >
          Browse Contests
        </Link>
      </div>
    </div>
  );
}

