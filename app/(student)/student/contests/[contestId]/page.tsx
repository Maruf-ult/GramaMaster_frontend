"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Loader2, Trophy, Users, Clock, Globe, Lock,
  CalendarClock, ArrowLeft, Medal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api/api-client";
import { apiEndpoints } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/common";
import type { ContestDetailsRequest, ContestLeaderBoardRequest } from "@/types/contests";
import { cn } from "@/lib/utils";

function formatDate(d: Date | string) {
  return new Date(d).toLocaleString("en-BD", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function ContestDetailPage({ params }: { params: Promise<{ contestId: string }> }) {
  const { contestId } = use(params);
  const router = useRouter();
  const [contest, setContest] = useState<ContestDetailsRequest | null>(null);
  const [leaderboard, setLeaderboard] = useState<ContestLeaderBoardRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [contestRes, lbRes] = await Promise.all([
          apiClient<ApiResponse<ContestDetailsRequest>>(apiEndpoints.contests.getById(contestId)),
          apiClient<ApiResponse<ContestLeaderBoardRequest[]>>(apiEndpoints.contests.leaderboard(contestId)),
        ]);
        if (contestRes.success && contestRes.data) setContest(contestRes.data);
        else toast.error(contestRes.message || "Failed to load contest.");
        if (lbRes.success && lbRes.data) setLeaderboard(lbRes.data);
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

  const now = new Date();
  const start = new Date(contest.startAt);
  const end = new Date(contest.endAt);
  const isOngoing = now >= start && now <= end;
  const isPast = now > end;

  const medalColor = (rank: number) =>
    rank === 1 ? "text-yellow-500" : rank === 2 ? "text-slate-400" : rank === 3 ? "text-orange-400" : "text-muted-foreground";

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <button onClick={() => router.push("/student/contests")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Contests
      </button>

      {/* Header card */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold">{contest.title}</h1>
              <p className="text-sm text-muted-foreground">{contest.curriculum}</p>
            </div>
          </div>
          {isOngoing && (
            <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />Live
            </span>
          )}
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">{contest.description}</p>

        <div className="grid sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5"><CalendarClock className="w-3.5 h-3.5" /> Starts: {formatDate(contest.startAt)}</div>
          <div className="flex items-center gap-1.5"><CalendarClock className="w-3.5 h-3.5" /> Ends: {formatDate(contest.endAt)}</div>
          <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Duration: {contest.durationMinutes} min</div>
          <div className="flex items-center gap-1.5"><Trophy className="w-3.5 h-3.5" /> Problems: {contest.totalProblems}</div>
          <div className="flex items-center gap-1.5">
            {contest.teamName ? <Lock className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
            {contest.teamName ?? "Global"}
          </div>
          <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> By: {contest.createdBy}</div>
        </div>

        <div className="pt-1">
          {isOngoing && !contest.hasSubmitted ? (
            <Button className="w-full" onClick={() => router.push(`/student/exams/${contestId}`)}>
              {contest.hasJoined ? "Resume Exam" : "Join & Start Exam"}
            </Button>
          ) : isPast && contest.hasJoined ? (
            <Button variant="outline" className="w-full" onClick={() => router.push(`/student/exams/${contestId}/review`)}>
              View My Results
            </Button>
          ) : (
            <Button disabled className="w-full">{isPast ? "Contest Ended" : "Not Started Yet"}</Button>
          )}
        </div>
      </div>

      {/* Leaderboard */}
      {leaderboard.length > 0 && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center gap-2 font-semibold text-sm">
            <Medal className="w-4 h-4 text-primary" /> Leaderboard
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
                {leaderboard.map((entry) => (
                  <tr key={entry.studentId} className="border-b border-border last:border-0 hover:bg-muted/20">
                    <td className="px-4 py-3">
                      <span className={cn("font-bold text-sm", medalColor(entry.rank))}>
                        {entry.rank <= 3 ? ["🥇","🥈","🥉"][entry.rank - 1] : `#${entry.rank}`}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {entry.profileImageUrl ? (
                          <img src={entry.profileImageUrl} className="w-6 h-6 rounded-full object-cover" alt="" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                            {entry.studentName[0]}
                          </div>
                        )}
                        <span className="text-sm font-medium">{entry.studentName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold">{entry.score}</td>
                    <td className="px-4 py-3 text-sm text-green-600">{entry.correctAnswers}/{entry.totalQuestions}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{entry.completionTime}</td>
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
