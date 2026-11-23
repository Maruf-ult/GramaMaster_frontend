import { TopicStatisticsRequest } from "@/types/analytics";
import { cn } from "@/lib/utils"

export function AccuracyBar({ topic }: { topic: TopicStatisticsRequest }) {
  const pct = Math.min(100, Math.max(0, topic.accuracy));
  const color =
    pct >= 75 ? "bg-green-500"
      : pct >= 50 ? "bg-orange-500"
        : "bg-red-500";
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium truncate max-w-[55%]">{topic.topicName}</span>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-muted-foreground">{topic.correctAnswers}/{topic.totalQuestions}</span>
          <span className={cn(
            "font-semibold w-10 text-right",
            pct >= 75 ? "text-green-600" : pct >= 50 ? "text-orange-500" : "text-red-500"
          )}>
            {pct.toFixed(0)}%
          </span>
        </div>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", color)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
