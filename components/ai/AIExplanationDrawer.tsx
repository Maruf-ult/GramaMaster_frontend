"use client";

import { apiClient } from "@/lib/api/api-client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { AIExplanationRequest } from "@/types/ai";
import { ApiResponse } from "@/types/common";
import { cn } from "@/lib/utils";
import { AwardIcon, CheckCircle2, Lightbulb, Loader2, X, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface AIExplanationDrawerProps {
  answerSubmissionId: string | null;
  onClose: () => void;
}

export function AIExplanationDrawer({ answerSubmissionId, onClose }: AIExplanationDrawerProps) {
  const [data, setData] = useState<AIExplanationRequest | null>(null);
  const [loading, setLoading] = useState(false);

  const isOpen = !!answerSubmissionId;

  useEffect(() => {
    if (!answerSubmissionId) {
      setData(null);
      return;
    }
    const fetchExplanation = async () => {
      setLoading(true);
      try {
        const res = await apiClient<ApiResponse<AIExplanationRequest>>(apiEndpoints.ai.explainAnswer(answerSubmissionId));
        if (res.success && res.data) {
          setData(res.data);
        } else {
          toast.error(res.message || "Failed to load explanation.");
          onClose();
        }
      } catch (error: any) {
        toast.error(error.message || "Something went wrong.");
        onClose();
      } finally {
        setLoading(false);
      }
    }
    fetchExplanation();
  }, [answerSubmissionId]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity duration-200",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed right-0 top-0 h-full z-50 w-full max-w-md",
          "bg-background border-l border-border shadow-2xl",
          "flex flex-col transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >

        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2 text-primary">
            <Lightbulb className="w-5 h-5" />
            <span className="font-semibold text-sm">AI Explanation</span>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {loading && (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin" />
              <p className="text-sm">Generating explanation...</p>
            </div>
          )}
          {!loading && data && (
            <>

              <div className={cn(
                "flex items-center gap-2.5 p-3 rounded-lg border text-sm font-medium",
                data.studentAnswer === data.correctAnswer
                  ? "border-green-500/40 bg-green-500/10 text-green-600"
                  : "border-red-500/40 bg-red-500/10 text-red-600"
              )}>
                {data.studentAnswer === data.correctAnswer
                  ? <CheckCircle2 className="w-4 h-4 shrink-0" />
                  : <XCircle className="w-4 h-4 shrink-0" />
                }
                {data.studentAnswer === data.correctAnswer
                  ? "Correct answer!"
                  : "Incorrect — see the explanation below"
                }
              </div>
              <div className="rounded-xl border border-border bg-card p-4 space-y-3 text-sm">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Your Answer
                  </p>
                  <p className={cn(
                    "font-medium",
                    data.studentAnswer === data.correctAnswer
                      ? "text-green-600"
                      : "text-red-500"
                  )}>
                    {data.studentAnswer || <span className="italic text-muted-foreground">Not answered</span>}
                  </p>
                </div>
                {data.studentAnswer !== data.correctAnswer && (
                  <div className="space-y-1 pt-3 border-t border-border">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Correct Answer
                    </p>
                    <p className="font-medium text-green-600">{data.correctAnswer}</p>
                  </div>
                )}
              </div>
              <div className="rounded-xl border border-blue-500/30 bg-blue-500/8 p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-500">
                  <Lightbulb className="w-3.5 h-3.5" />
                  Grammar Explanation
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {data.explanation}
                </p>
              </div>
            </>
          )}
        </div>
        <div className="shrink-0 px-5 py-4 border-t border-border">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
          >
            Close
          </button>
        </div>
      </aside>
    </>
  );
}