import { WeakTopicRequest } from "@/types/ai";
import { AlertTriangle, Lightbulb } from "lucide-react";

export function WeakTopicRow({
  topic,
  onExplain,
}: {
  topic: WeakTopicRequest;
  onExplain: (topicId: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 border-b border-border last:border-0">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-7 h-7 rounded-lg bg-red-500/15 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{topic.topicName}</p>
          <p className="text-xs text-muted-foreground">
            {topic.totalAttempts} attempts · {topic.accuracy.toFixed(0)}% accuracy
          </p>
        </div>
      </div>
      <button
        onClick={() => onExplain(topic.topicId)}
        className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-500 text-xs font-medium hover:bg-blue-500/20 transition-colors"
      >
        <Lightbulb className="w-3.5 h-3.5" />
        AI Help
      </button>
    </div>
  );
}