"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Trophy, CheckCircle2, XCircle, Clock, ArrowRight } from "lucide-react";
import { apiClient } from "@/lib/api/api-client";
import { apiEndpoints } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/common";
import type { ExamAttemptRequest } from "@/types/exams";
import { cn } from "@/lib/utils";

export default function StudentResultsPage() {
  const router = useRouter();
  const [attempts, setAttempts] = useState<ExamAttemptRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        // Fetch leaderboard or exam history — using student analytics as proxy
        const res = await apiClient<ApiResponse<ExamAttemptRequest[]>>(
          apiEndpoints.students.analytics
        );
        if (res.success && res.data) {
          setAttempts(Array.isArray(res.data) ? res.data : []);
        } else {
          setAttempts([]);
        }
      } catch (e: any) {
        toast.error(e.message || "Failed to load results.");
      } finally {
        setLoading(false);
      }
    };
    fetchAttempts();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
    </div>
  );

  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold">My Results</h1>
        <p className="text-sm text-muted-foreground mt-0.5">All your past exam attempts and scores.</p>
      </div>

      {attempts.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Trophy className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No exam results yet.</p>
          <button
            onClick={() => router.push("/student/contests")}
            className="mt-3 text-sm text-primary hover:underline flex items-center gap-1 mx-auto"
          >
            Browse contests <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {attempts.map((attempt) => {
            const pct = attempt.totalQuestions > 0
              ? Math.round((attempt.score / attempt.totalQuestions) * 100)
              : 0;
            return (
              <div
                key={attempt.id}
                className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-4 hover:border-primary/40 transition-colors cursor-pointer"
                onClick={() => router.push(`/student/exams/${attempt.contestId}/review?attemptId=${attempt.id}`)}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold",
                    pct >= 75 ? "bg-green-500/15 text-green-600" :
                    pct >= 50 ? "bg-orange-500/15 text-orange-600" :
                    "bg-red-500/15 text-red-500"
                  )}>
                    {pct}%
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Contest Attempt</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                        {attempt.score} correct
                      </span>
                      <span className="flex items-center gap-1">
                        <XCircle className="w-3 h-3 text-red-500" />
                        {attempt.totalQuestions - attempt.score} wrong
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(attempt.startedAt).toLocaleDateString("en-BD", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
