"use client";

import { ReviewCard } from "@/components/cards/ReviewCard";
import { ScoreRing } from "@/components/cards/ScoreRing";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api/api-client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { ApiResponse } from "@/types/common";
import { ExamResultRequest } from "@/types/exams";
import { cn } from "cn";
import { ArrowLeft, Loader2, Trophy } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { Suspense, use, useEffect, useState } from "react";
import { toast } from "sonner";

function ReviewContent({ examId }: { examId: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const attemptId = searchParams.get("attemptId") || "";

    const [result, setResult] = useState<ExamResultRequest | null>(null);
    const [loading, setLoading] = useState(false);
    const [filterMode, setFilterMode] = useState<"all" | "correct" | "wrong">("all");

    useEffect(() => {
        if (!attemptId) {
            toast.error("No attempt ID found.");
            router.push("/students/contests");
            return;
        }
        const fetchReview = async () => {
            try {
                const res = await apiClient<ApiResponse<ExamResultRequest>>(apiEndpoints.exams.review(attemptId));
                if (res.success && res.data) {
                    setResult(res.data);
                } else {
                    toast.error(res.message || "Failed to load review.");
                }
            } catch (error: any) {
                toast.error(error.message || "Something went wrong.")
            } finally {
                setLoading(false);
            }
        }

        fetchReview();

    }, [attemptId])
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        );
    }
    if (!result) {
        return (
            <div className="text-center py-20 text-muted-foreground">
                Could not load review data.
            </div>
        );
    }
    const filteredReviews = result.reviews.filter((r) => {
        if (filterMode === "correct") return r.isCorrect;
        if (filterMode === "wrong") return !r.isCorrect;
        return true;
    });
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <button
                onClick={() => router.push("/student/contests")}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Contests
            </button>

            <div className="rounded-2xl border border-border bg-card p-6 text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
                    <Trophy className="w-4 h-4 text-primary" />
                    Exam Completed
                </div>

                <div className="relative w-24 mx-auto">
                    <ScoreRing percentage={result.percentage} />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold">{result.percentage.toFixed(0)}%</span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="rounded-lg bg-muted/50 p-3">
                        <div className="text-xl font-bold text-green-600">{result.correctAnswers}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">Correct</div>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                        <div className="text-xl font-bold text-red-500">
                            {result.totalQuestions - result.correctAnswers}
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">Wrong</div>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                        <div className="text-xl font-bold">{result.score}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">Score</div>
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/student/practice")}
                >
                    Practice Weak Topics
                </Button>
            </div>

            <div className="flex gap-1.5">
                {(["all", "correct", "wrong"] as const).map((mode) => (
                    <button
                        key={mode}
                        onClick={() => setFilterMode(mode)}
                        className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium border capitalize transition-colors",
                            filterMode === mode
                                ? "bg-primary text-primary-foreground border-primary"
                                : "border-border text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {mode === "all" ? `All (${result.reviews.length})`
                            : mode === "correct" ? `✓ Correct (${result.reviews.filter(r => r.isCorrect).length})`
                                : `✗ Wrong (${result.reviews.filter(r => !r.isCorrect).length})`
                        }
                    </button>
                ))}
            </div>

            <div className="space-y-3">
                {filteredReviews.map((item, i) => (
                    <ReviewCard
                        key={item.problemId}
                        item={item}
                        index={result.reviews.indexOf(item)}
                    />
                ))}
            </div>
        </div>
    );
}

export default function ExamReviewPage({
    params,
}: {
    params: Promise<{ examId: string }>;
}) {
    const { examId } = use(params);
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
            }
        >
            <ReviewContent examId={examId} />
        </Suspense>
    );
}