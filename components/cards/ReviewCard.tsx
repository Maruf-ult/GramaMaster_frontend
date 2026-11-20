// "use client";
import { AnswerReviewRequest } from "@/types/exams";
import { cn } from "cn";
import { CheckCircle2, ChevronDown, ChevronUp, Lightbulb, XCircle } from "lucide-react";
import { useState } from "react";

export function ReviewCard({
    item,
    index,
}: {
    item: AnswerReviewRequest;
    index: number;
}) {
    const [expanded, setExpanded] = useState(false);
    return (
        <div className={cn(
            "rounded-xl border p-4 space-y-3 transition-colors",
            item.isCorrect
                ? "border-green-500/40 bg-green-500/5"
                : "border-red-500/40 bg-red-500/5"
        )}>
            {/* Question row */}
            <div className="flex items-start gap-2.5">
                <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                    item.isCorrect ? "bg-green-500" : "bg-red-500"
                )}>
                    {item.isCorrect
                        ? <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        : <XCircle className="w-3.5 h-3.5 text-white" />
                    }
                </div>
                <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-muted-foreground">Q{index + 1}</span>
                    <p className="text-sm font-medium mt-0.5 leading-relaxed">{item.question}</p>
                </div>
            </div>
            {/* Answers */}
            <div className="pl-8 space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                    <span className="text-muted-foreground w-24 shrink-0">Your answer:</span>
                    <span className={cn(
                        "font-medium",
                        item.isCorrect ? "text-green-600" : "text-red-500"
                    )}>
                        {item.studentAnswer || <span className="italic text-muted-foreground">Not answered</span>}
                    </span>
                </div>
                {!item.isCorrect && (
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground w-24 shrink-0">Correct answer:</span>
                        <span className="font-medium text-green-600">{item.correctAnswer}</span>
                    </div>
                )}
            </div>
            {/* AI Explanation accordion */}
            {item.aiExplanation && (
                <div className="pl-8">
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="flex items-center gap-1.5 text-xs font-medium text-blue-500 hover:text-blue-400 transition-colors"
                    >
                        <Lightbulb className="w-3.5 h-3.5" />
                        AI Explanation
                        {expanded
                            ? <ChevronUp className="w-3.5 h-3.5" />
                            : <ChevronDown className="w-3.5 h-3.5" />
                        }
                    </button>
                    {expanded && (
                        <div className="mt-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-xs text-muted-foreground leading-relaxed">
                            {item.aiExplanation}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}