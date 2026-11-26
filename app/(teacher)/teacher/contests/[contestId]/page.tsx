"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Trophy, Users, BarChart2, Medal, Clock, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api/api-client";
import { apiEndpoints } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/common";
import type { ContestDetailsRequest, ContestLeaderBoardRequest, ContestAnalyticsRequest } from "@/types/contests";
import { cn } from "@/lib/utils";

function formatDate(d: Date | string) {
  return new Date(d).toLocaleString("en-BD", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function TeacherContestDetailPage({ params }: { params: Promise<{ contestId: string }> }) {
  const { contestId } = use(params);
  const router = useRouter();
  const [contest, setContest] = useState<ContestDetailsRequest | null>(null);
  const [leaderboard, setLeaderboard] = useState<ContestLeaderBoardRequest[]>([]);
  const [analytics, setAnalytics] = useState<ContestAnalyticsRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [cRes, lbRes, aRes] = await Promise.all([
          apiClient<ApiResponse<ContestDetailsRequest>>(apiEndpoints.contests.getById(contestId)),
          apiClient<ApiResponse<ContestLeaderBoardRequest[]>>(apiEndpoints.contests.leaderboard(contestId)),
          apiClient<ApiResponse<ContestAnalyticsRequest>>(apiEndpoints.contests.analytics(contestId)),
        ]);
        if (cRes.success && cRes.data) setContest(cRes.data);
        else toast.error(cRes.message || "Failed to load contest.");
        if (lbRes.success && lbRes.data) setLeaderboard(lbRes.data);
        if (aRes.success && aRes.data) setAnalytics(aRes.data);
      } catch (e: any) {
        toast.error(e.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [contestId]);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;
  if (!contest) return <div className="text-center py-16 text-muted-foreground">Contest not found.</div>;

  const medalColor = (rank: number) =>
    rank === 1 ? "text-yellow-500" : rank === 2 ? "text-slate-400" : rank === 3 ? "text-orange-400" : "text-muted-foreground";

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <button onClick={() => router.push("/teacher/contests")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Contests
      </button>

      {/* Contest info */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold">{contest.title}</h1>
            <p className="text-sm text-muted-foreground">{contest.curriculum} · {contest.teamName ?? "Global"}</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{contest.description}</p>
        <div className="grid sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><CalendarClock className="w-3.5 h-3.5" /> {formatDate(contest.startAt)}</span>
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {contest.durationMinutes} min</span>
          <span className="flex items-center gap-1.5"><Trophy className="w-3.5 h-3.5" /> {contest.totalProblems} problems</span>
        </div>
      </div>

      {/* Analytics summary */}
      {analytics && (
        <div className="grid sm:grid-cols-4 gap-3">
          {[
            { label: "Participants", value: analytics.totalParticipants, color: "bg-blue-500/15 text-blue-500" },
            { label: "Avg. Score", value: analytics.averageScore.toFixed(1), color: "bg-green-500/15 text-green-500" },
            { label: "Highest Score", value: analytics.highestScore, color: "bg-violet-500/15 text-violet-500" },
            { label: "Pass Rate", value: `${analytics.passRate.toFixed(0)}%`, color: "bg-orange-500/15 text-orange-500" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-xl border border-border bg-card p-4 space-y-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">{label}</span>
              <div className={cn("text-xl font-bold px-2 py-0.5 rounded-lg w-fit", color)}>{value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Leaderboard */}
      {leaderboard.length > 0 && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center gap-2 font-semibold text-sm">
            <Medal className="w-4 h-4 text-primary" /> Leaderboard ({leaderboard.length} students)
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/30">
                <tr>
                  {["Rank", "Student", "Score", "Correct", "Time"].map(h => (
                    <th key={h} className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leaderboard.map(e => (
                  <tr key={e.studentId} className="border-b border-border last:border-0 hover:bg-muted/20">
                    <td className="px-4 py-3 font-bold text-sm"><span className={medalColor(e.rank)}>
                      {e.rank <= 3 ? ["🥇","🥈","🥉"][e.rank-1] : `#${e.rank}`}
                    </span></td>
                    <td className="px-4 py-3 text-sm font-medium">{e.studentName}</td>
                    <td className="px-4 py-3 text-sm font-semibold">{e.score}</td>
                    <td className="px-4 py-3 text-sm text-green-600">{e.correctAnswers}/{e.totalQuestions}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{e.completionTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
