import { formatDate } from "@/lib/utils/formateDate";
import { ContestCardRequest } from "@/types/contests";
import { CalendarClock, CheckCircle2, Clock, Globe, Lock, PlayCircle, Trophy, Users } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export type TabKey = "upcoming" | "ongoing" | "past";

interface ContestCardProps {
  contest: ContestCardRequest;
  status: TabKey;
  onAction: (contest: ContestCardRequest) => void;
}

export function ContestCard({ contest, status, onAction }: ContestCardProps) {
  const start = new Date(contest.startAt);
  const end = new Date(start.getTime() + contest.durationMinutes * 60 * 1000);

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3 hover:border-primary/50 transition-colors">

      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
            <Trophy className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold truncate">{contest.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{contest.curriculum}</p>
          </div>
        </div>

        <span className={cn(
          "shrink-0 flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border",
          contest.contestType === "Global"
            ? "border-blue-500/40 text-blue-500 bg-blue-500/10"
            : "border-violet-500/40 text-violet-500 bg-violet-500/10"
        )}>
          {contest.contestType === "Global"
            ? <Globe className="w-3 h-3" />
            : <Lock className="w-3 h-3" />
          }
          {contest.contestType}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <CalendarClock className="w-3.5 h-3.5 shrink-0" />
          <span>{formatDate(start)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>{contest.durationMinutes} min</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CalendarClock className="w-3.5 h-3.5 shrink-0" />
          <span>Ends {formatDate(end)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 shrink-0" />
          <span>{contest.participantCount} joined</span>
        </div>
      </div>

      {status === "ongoing" && (
        <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Live now
        </div>
      )}

      <div className="pt-1">
        {status === "past" ? (
          contest.hasJoined ? (
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => onAction(contest)}
            >
              <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
              View Results
            </Button>
          ) : (
            <Button size="sm" variant="ghost" disabled className="w-full text-muted-foreground">
              Contest Ended
            </Button>
          )
        ) : status === "ongoing" ? (
          <Button
            size="sm"
            className="w-full"
            onClick={() => onAction(contest)}
          >
            <PlayCircle className="w-4 h-4 mr-2" />
            {contest.hasJoined ? "Resume Exam" : "Join & Start"}
          </Button>
        ) : (
          <Button
            size="sm"
            variant={contest.hasJoined ? "outline" : "default"}
            className="w-full"
            onClick={() => onAction(contest)}
            disabled={contest.hasJoined}
          >
            {contest.hasJoined ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                Registered
              </>
            ) : (
              "Register"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}