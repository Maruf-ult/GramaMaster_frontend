"use client";

import { useEffect, useState, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
    Loader2, ChevronLeft, ChevronRight,
    CheckCircle2, XCircle, Lightbulb, Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api/api-client";
import { apiEndpoints } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/common";
import type { PracticeProblemnRequest, ProblemOptionRequest } from "@/types/problems";
import { cn } from "@/lib/utils";

interface AnswerState {
    selectedOptionId: string | null;
    isCorrect: boolean | null;
    explanation: string | null;
    submitted: boolean;
}

interface PracticeSubmitRequest {
    topicId: string;
    difficulty: string;
    answers: { problemId: string; selectedOptionId: string }[];
}


export default function PracticeArenaPage({
    params,
}: {
    params: Promise<{ topicId: string }>;
}) {
    const { topicId } = use(params);
    const router = useRouter();
    const searchParams = useSearchParams();
    const difficulty = searchParams.get("difficulty") || "Medium";

    const [problems, setProblems] = useState<PracticeProblemnRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, AnswerState>>({});
    const [submitting, setSubmitting] = useState(false);
    const [finished, setFinished] = useState(false);
    const [score, setScore] = useState({ correct: 0, total: 0 });


    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const res = await apiClient<ApiResponse<PracticeProblemnRequest[]>>(
                    `${apiEndpoints.practices.start}?topicId=${topicId}&difficulty=${difficulty}`
                );
                if (res.success && res.data) {
                    setProblems(res.data);
                } else {
                    toast.error(res.message || "Failed to load questions.");
                    router.back();
                }
            } catch (error: any) {
                toast.error(error.message || "Something went wrong.");
                router.back();
            } finally {
                setLoading(false);
            }
        };

        fetchProblems();
    }, [topicId, difficulty]);

    const currentProblem = problems[currentIndex];


    const handleSelectOption = (optionId: string) => {
        const problemId = currentProblem.id;

        if (answers[problemId]?.submitted) return;

        setAnswers((prev) => ({
            ...prev,
            [problemId]: {
                selectedOptionId: optionId,
                isCorrect: null,
                explanation: null,
                submitted: false,
            },
        }));
    };


    const handleCheckAnswer = () => {
        const problemId = currentProblem.id;
        const selected = answers[problemId]?.selectedOptionId;
        if (!selected) {
            toast.warning("Please select an option first.");
            return;
        }

        const selectedOption = currentProblem.options.find(
            (o) => o.id === selected
        );
        const isCorrect = selectedOption?.isCorrect ?? false;

        setAnswers((prev) => ({
            ...prev,
            [problemId]: {
                ...prev[problemId],
                isCorrect,
                explanation: isCorrect
                    ? "Correct! Well done."
                    : "Incorrect. Review the grammar rule for this topic.",
                submitted: true,
            },
        }));
    };


    const handleFinalSubmit = async () => {
        setSubmitting(true);
        try {
            const payload: PracticeSubmitRequest = {
                topicId,
                difficulty,
                answers: Object.entries(answers)
                    .filter(([, v]) => v.selectedOptionId)
                    .map(([problemId, v]) => ({
                        problemId,
                        selectedOptionId: v.selectedOptionId!,
                    })),
            };

            const res = await apiClient<ApiResponse<{ correctAnswers: number; totalQuestions: number }>>(
                apiEndpoints.practices.submit,
                {
                    method: "POST",
                    body: JSON.stringify(payload),
                }
            );

            if (res.success && res.data) {
                setScore({
                    correct: res.data.correctAnswers,
                    total: res.data.totalQuestions,
                });
            } else {
                const correct = Object.values(answers).filter((a) => a.isCorrect).length;
                setScore({ correct, total: problems.length });
            }
            setFinished(true);
        } catch (error: any) {
            toast.error(error.message || "Failed to submit. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (problems.length === 0) {
        return (
            <div className="text-center py-20 text-muted-foreground">
                No questions found for this topic and difficulty.
            </div>
        );
    }


    if (finished) {
        const percentage = Math.round((score.correct / score.total) * 100);
        return (
            <div className="max-w-md mx-auto text-center space-y-6 py-12">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Trophy className="w-8 h-8 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold">Practice Complete!</h1>
                    <p className="text-muted-foreground mt-1">Here&apos;s how you did</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-6 space-y-2">
                    <div className="text-4xl font-bold text-primary">{percentage}%</div>
                    <div className="text-sm text-muted-foreground">
                        {score.correct} out of {score.total} correct
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => router.push("/student/practice")}
                    >
                        Back to Topics
                    </Button>
                    <Button
                        className="flex-1"
                        onClick={() => router.push("/student/dashboard")}
                    >
                        Go to Dashboard
                    </Button>
                </div>
            </div>
        );
    }


    const currentAnswer = answers[currentProblem.id];
    const isLastQuestion = currentIndex === problems.length - 1;
    const allAnswered = problems.every((p) => answers[p.id]?.submitted);

    return (
        <div className="max-w-2xl mx-auto space-y-4">


            <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                    <h1 className="text-base font-bold">{currentProblem.topicName}</h1>
                    <span className={cn(
                        "text-xs font-medium px-2 py-0.5 rounded-full",
                        difficulty === "Easy" && "bg-green-500/15 text-green-600",
                        difficulty === "Medium" && "bg-orange-500/15 text-orange-600",
                        difficulty === "Hard" && "bg-red-500/15 text-red-600",
                    )}>
                        {difficulty}
                    </span>
                </div>
                <div className="text-xs text-muted-foreground">
                    Question {currentIndex + 1} of {problems.length}
                </div>
            </div>


            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / problems.length) * 100}%` }}
                />
            </div>


            <div className="flex gap-1.5 flex-wrap">
                {problems.map((p, i) => {
                    const a = answers[p.id];
                    return (
                        <button
                            key={p.id}
                            onClick={() => setCurrentIndex(i)}
                            className={cn(
                                "w-7 h-7 rounded-full text-xs font-bold border-2 transition-colors",
                                i === currentIndex
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : a?.submitted
                                        ? a.isCorrect
                                            ? "border-green-500 bg-green-500/15 text-green-600"
                                            : "border-red-500 bg-red-500/15 text-red-600"
                                        : a?.selectedOptionId
                                            ? "border-orange-400 text-orange-500"
                                            : "border-border text-muted-foreground"
                            )}
                        >
                            {i + 1}
                        </button>
                    );
                })}
            </div>


            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <p className="text-sm font-semibold leading-relaxed">
                    {currentProblem.questionText}
                </p>


                <div className="space-y-2">
                    {currentProblem.options.map((option, idx) => {
                        const letters = ["A", "B", "C", "D"];
                        const isSelected = currentAnswer?.selectedOptionId === option.id;
                        const isSubmitted = currentAnswer?.submitted;

                        let optionStyle = "border-border hover:border-primary hover:bg-primary/5";
                        if (isSubmitted) {
                            if (option.isCorrect) {
                                optionStyle = "border-green-500 bg-green-500/10";
                            } else if (isSelected && !option.isCorrect) {
                                optionStyle = "border-red-500 bg-red-500/10";
                            }
                        } else if (isSelected) {
                            optionStyle = "border-primary bg-primary/10";
                        }

                        return (
                            <button
                                key={option.id}
                                onClick={() => handleSelectOption(option.id)}
                                disabled={isSubmitted}
                                className={cn(
                                    "w-full flex items-center gap-3 p-3 rounded-lg border text-left text-sm transition-colors",
                                    optionStyle,
                                    isSubmitted && "cursor-default"
                                )}
                            >
                                <div className={cn(
                                    "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 text-xs font-bold",
                                    isSelected && !isSubmitted && "border-primary bg-primary text-primary-foreground",
                                    isSubmitted && option.isCorrect && "border-green-500 bg-green-500 text-white",
                                    isSubmitted && isSelected && !option.isCorrect && "border-red-500 bg-red-500 text-white",
                                    !isSelected && (!isSubmitted || !option.isCorrect) && "border-border",
                                )}>
                                    {letters[idx]}
                                </div>
                                {option.optionText}
                                {isSubmitted && option.isCorrect && (
                                    <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto shrink-0" />
                                )}
                                {isSubmitted && isSelected && !option.isCorrect && (
                                    <XCircle className="w-4 h-4 text-red-500 ml-auto shrink-0" />
                                )}
                            </button>
                        );
                    })}
                </div>


                {!currentAnswer?.submitted && (
                    <Button
                        className="w-full"
                        disabled={!currentAnswer?.selectedOptionId}
                        onClick={handleCheckAnswer}
                    >
                        Check Answer
                    </Button>
                )}


                {currentAnswer?.submitted && currentAnswer.explanation && (
                    <div className="rounded-lg border border-blue-500/40 bg-blue-500/8 p-3">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-500 mb-1">
                            <Lightbulb className="w-3.5 h-3.5" />
                            Explanation
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            {currentAnswer.explanation}
                        </p>
                    </div>
                )}
            </div>


            <div className="flex gap-3">
                <Button
                    variant="outline"
                    className="flex-1"
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex((i) => i - 1)}
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                </Button>

                {isLastQuestion ? (
                    <Button
                        className="flex-1"
                        disabled={submitting || !allAnswered}
                        onClick={handleFinalSubmit}
                    >
                        {submitting ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Submitting...
                            </span>
                        ) : (
                            "Submit All"
                        )}
                    </Button>
                ) : (
                    <Button
                        className="flex-1"
                        onClick={() => setCurrentIndex((i) => i + 1)}
                    >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                )}
            </div>

        </div>
    );
}