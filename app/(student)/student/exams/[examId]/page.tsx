"use client"
import { Button } from "@/components/ui/button";
import { useCountdownTimer } from "@/features/hooks/useCountdownTimer";
import { apiClient } from "@/lib/api/api-client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { ApiResponse } from "@/types/common";
import { ExamAttemptRequest, SubmitExamRequest } from "@/types/exams";
import { ProblemDetailsRequest } from "@/types/problems";
import { cn } from "cn";
import { AlertTriangle, ChevronLeft, ChevronRight, Clock, Loader2, Send } from "lucide-react";
import { useRouter } from "next/router";
import { use, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function ExamPage({ params }: { params: Promise<{ examId: string }>; }) {
    const { examId: contestId } = use(params);
    const router = useRouter();

    const [attempt, setAttempt] = useState<ExamAttemptRequest | null>(null);
    const [problems, setProblems] = useState<ProblemDetailsRequest[]>([]);
    const [loading, setLoading] = useState(true);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});

    const submittingRef = useRef(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const startExam = async () => {
            try {
                const res = await apiClient<ApiResponse<{
                    attempt: ExamAttemptRequest;
                    problems: ProblemDetailsRequest[];
                    durationMinutes: number;
                }>>(apiEndpoints.exams.start, {
                    method: "POST",
                    body: JSON.stringify({ contestId })
                });

                if (res.success && res.data) {
                    setAttempt(res.data.attempt);
                    setProblems(res.data.problems);
                } else {
                    toast.error(res.message || "Failed to start exam.");
                    router.push("/student/contests");
                }
            } catch (error: any) {
                toast.error(error.message || "Could not start exam.");
                router.push("/student/contests");
            } finally {
                setLoading(false);
            }
        }
        startExam();
    }, [contestId]);

    const handleSubmit = useCallback(async (auto = false) => {
        if (submittingRef.current || !attempt) return;
        submittingRef.current = true;
        setSubmitting(true);

        if (auto) toast.warning("Time's up! Auto-submitting your answers...");

        try {
            const payload: SubmitExamRequest = {
                attemptId: attempt.id, answers: Object.entries(answers).map(([problemId, studentAnswer]) => ({
                    problemId,
                    studentAnswer,
                }))
            };
            const res = await apiClient<ApiResponse<{ attemptId: string }>>(
                apiEndpoints.exams.submit,
                { method: "POST", body: JSON.stringify(payload) }
            );

            if (res.success) {
                toast.success("Exam submitted successfully!");
                router.push(`/student/exams/${contestId}/review?attemptId=${attempt.id}`);
            } else {
                toast.error(res.message || "Submission failed.");
                submittingRef.current = false;
                setSubmitting(false);
            }

        } catch (error: any) {
            toast.error(error.message || "Something went wrong.");
            submittingRef.current = false;
            setSubmitting(false);
        }

    }, [attempt, answers, contestId, router]);

    const durationMinutes = attempt ? 30 : 30;

    const { formatted, secondsLeft } = useCountdownTimer({
        durationMinutes,
        onExpire: () => handleSubmit(true),
    });
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Setting up your exam...</p>
            </div>
        );
    }
    if (!attempt || problems.length === 0) {
        return (
            <div className="text-center py-20 text-muted-foreground">
                No exam data found.
            </div>
        );
    }
    const currentProblem = problems[currentIndex];
    const selectedAnswer = answers[currentProblem.id] ?? null;
    const answeredCount = Object.keys(answers).length;
    const letters = ["A", "B", "C", "D", "E"];

    const timerColor =
        secondsLeft <= 60
            ? "text-red-500"
            : secondsLeft <= 300
                ? "text-orange-500"
                : "text-foreground";
    return (
        <div className="max-w-3xl mx-auto space-y-4">

            <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-border">
                <div>
                    <h1 className="text-base font-bold">Exam in Progress</h1>
                    <p className="text-xs text-muted-foreground">
                        {answeredCount} of {problems.length} answered
                    </p>
                </div>

                <div className={cn(
                    "flex items-center gap-2 text-xl font-mono font-bold px-4 py-2 rounded-xl border",
                    secondsLeft <= 60
                        ? "border-red-500/50 bg-red-500/10 text-red-500"
                        : secondsLeft <= 300
                            ? "border-orange-500/50 bg-orange-500/10 text-orange-500"
                            : "border-border bg-card text-foreground"
                )}>
                    <Clock className="w-5 h-5" />
                    {formatted}
                </div>
            </div>

            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${(answeredCount / problems.length) * 100}%` }}
                />
            </div>

            <div className="rounded-xl border border-border bg-card p-3">
                <p className="text-xs text-muted-foreground mb-2 font-medium">
                    Jump to question:
                </p>
                <div className="flex gap-1.5 flex-wrap">
                    {problems.map((p, i) => {
                        const isAnswered = !!answers[p.id];
                        const isCurrent = i === currentIndex;
                        return (
                            <button
                                key={p.id}
                                onClick={() => setCurrentIndex(i)}
                                className={cn(
                                    "w-7 h-7 rounded-md text-xs font-bold border transition-colors",
                                    isCurrent
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : isAnswered
                                            ? "bg-green-500/15 text-green-600 border-green-500/40"
                                            : "border-border text-muted-foreground hover:border-primary"
                                )}
                            >
                                {i + 1}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 space-y-4">

                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-muted-foreground">
                            Q{currentIndex + 1} / {problems.length}
                        </span>
                        <span className={cn(
                            "text-[10px] font-medium px-2 py-0.5 rounded-full",
                            currentProblem.difficulty === "Easy" && "bg-green-500/15 text-green-600",
                            currentProblem.difficulty === "Medium" && "bg-orange-500/15 text-orange-600",
                            currentProblem.difficulty === "Hard" && "bg-red-500/15 text-red-600",
                        )}>
                            {currentProblem.difficulty}
                        </span>
                    </div>
                    <span className="text-xs text-muted-foreground">{currentProblem.topicName}</span>
                </div>

                <p className="text-sm font-medium leading-relaxed">
                    {currentProblem.questionText}
                </p>

                <div className="space-y-2">
                    {currentProblem.options.map((option, idx) => {
                        const isSelected = selectedAnswer === option.id;
                        return (
                            <button
                                key={option.id}
                                onClick={() =>
                                    setAnswers((prev) => ({
                                        ...prev,
                                        [currentProblem.id]: option.id,
                                    }))
                                }
                                className={cn(
                                    "w-full flex items-center gap-3 p-3 rounded-lg border text-left text-sm transition-all",
                                    isSelected
                                        ? "border-primary bg-primary/10 text-foreground"
                                        : "border-border hover:border-primary/50 hover:bg-accent"
                                )}
                            >
                                <div className={cn(
                                    "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 text-xs font-bold transition-colors",
                                    isSelected
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-border text-muted-foreground"
                                )}>
                                    {letters[idx]}
                                </div>
                                {option.optionText}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex gap-3 items-center">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex((i) => i - 1)}
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Prev
                </Button>
                {/* Spacer */}
                <div className="flex-1" />
                {currentIndex < problems.length - 1 ? (
                    <Button
                        size="sm"
                        onClick={() => setCurrentIndex((i) => i + 1)}
                    >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                ) : (
                    <Button
                        size="sm"
                        variant="default"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={submitting}
                        onClick={() => handleSubmit(false)}
                    >
                        {submitting ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Submitting...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Send className="w-4 h-4" />
                                Submit Exam
                            </span>
                        )}
                    </Button>
                )}
            </div>

            {answeredCount < problems.length && (
                <div className="flex items-center gap-2 text-xs text-orange-500 bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>
                        You have {problems.length - answeredCount} unanswered question
                        {problems.length - answeredCount > 1 ? "s" : ""}. You can still submit.
                    </span>
                </div>
            )}
        </div>
    );
}