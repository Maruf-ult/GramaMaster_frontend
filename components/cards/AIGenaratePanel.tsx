import { apiClient } from "@/lib/api/api-client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { AIQuestionDto, DifficultyType, GenerateQuestionsRequest, ProblemType } from "@/types/ai";
import { ApiResponse } from "@/types/common";
import { cn } from "@/lib/utils";
import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const PROBLEM_TYPES: ProblemType[] = [
    "MCQ", "FillBlank", "Narration", "Modifier",
    "Connectors", "SentenceCompletion", "RightFormVerb",
];
const DIFFICULTIES: DifficultyType[] = ["Easy", "Medium", "Hard"];


export function AIGeneratePanel({ onAddProblems, }: { onAddProblems: (ids: string[]) => void; }) {
    const [topicId, setTopicId] = useState("");
    const [curriculumId, setCurriculumId] = useState("");
    const [problemType, setProblemType] = useState<ProblemType>("MCQ");
    const [difficulty, setDifficulty] = useState<DifficultyType>("Medium");
    const [count, setCount] = useState(5);
    const [saveToDb, setSaveToDb] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [generated, setGenerated] = useState<AIQuestionDto[]>([]);

    const handleGenerate = async () => {
        if (!topicId.trim()) {
            toast.warning("Enter a topic ID first.");
            return;
        }
        setGenerating(true);
        try {
            const payload: GenerateQuestionsRequest = {
                topicId,
                curriculumId,
                problemType,
                difficultyType: difficulty,
                count,
                saveToDatabase: saveToDb,
            };
            const res = await apiClient<ApiResponse<{ problems: AIQuestionDto[]; problemIds: string[] }>>(
                apiEndpoints.ai.generateQuestions,
                { method: "POST", body: JSON.stringify(payload) }
            );
            if (res.success && res.data) {
                setGenerated(res.data.problems);

                if (saveToDb && res.data?.problemIds?.length) {
                    onAddProblems(res.data.problemIds);
                    toast.success(`${res.data.problemIds.length} AI questions generated and added!`);
                } else {
                    toast.success(`${res.data?.problems.length} questons generated.`);
                }
            } else {
                toast.error(res.message || "AI generation failed.");
            }
        } catch (error: any) {
            toast.error(error.message || "Something went wrong.");
        } finally {
            setGenerating(false);
        }
    }
    return (
        <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4 space-y-4">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-semibold">AI Question Generator</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                    <Label className="text-xs">Topic ID</Label>
                    <Input
                        placeholder="paste topic ID here"
                        value={topicId}
                        onChange={(e) => setTopicId(e.target.value)}
                    />
                </div>
                <div className="space-y-1.5">
                    <Label className="text-xs">Curriculum ID (optional)</Label>
                    <Input
                        placeholder="paste curriculum ID"
                        value={curriculumId}
                        onChange={(e) => setCurriculumId(e.target.value)}
                    />
                </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">

                <div className="space-y-1.5">
                    <Label className="text-xs">Problem Type</Label>
                    <select
                        value={problemType}
                        onChange={(e) => setProblemType(e.target.value as ProblemType)}
                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                    >
                        {PROBLEM_TYPES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1.5">
                    <Label className="text-xs">Difficulty</Label>
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as DifficultyType)}
                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                    >
                        {DIFFICULTIES.map((d) => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1.5">
                    <Label className="text-xs">Question Count</Label>
                    <Input
                        type="number"
                        min={1}
                        max={20}
                        value={count}
                        onChange={(e) => setCount(Number(e.target.value))}
                    />
                </div>
            </div>

            <label className="flex items-center gap-2 text-sm cursor-pointer w-fit">
                <input
                    type="checkbox"
                    checked={saveToDb}
                    onChange={(e) => setSaveToDb(e.target.checked)}
                    className="rounded"
                />
                <span>Save generated questions to database</span>
            </label>
            <Button
                type="button"
                onClick={handleGenerate}
                disabled={generating}
                className="bg-blue-600 hover:bg-blue-700 text-white"
            >
                {generating ? (
                    <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                    </span>
                ) : (
                    <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Generate Questions
                    </span>
                )}
            </Button>

            {generated.length > 0 && (
                <div className="space-y-2 mt-2">
                    <p className="text-xs font-semibold text-muted-foreground">
                        Preview ({generated.length} questions):
                    </p>
                    {generated.map((q, i) => (
                        <div
                            key={i}
                            className="text-xs p-3 rounded-lg bg-background border border-border space-y-1"
                        >
                            <p className="font-medium">{i + 1}. {q.questionText}</p>
                            <div className="flex flex-wrap gap-1.5">
                                {q.options.map((opt, j) => (
                                    <span
                                        key={j}
                                        className={cn(
                                            "px-2 py-0.5 rounded-full border text-[10px]",
                                            opt === q.correctAnswer
                                                ? "border-green-500/50 bg-green-500/10 text-green-600"
                                                : "border-border text-muted-foreground"
                                        )}
                                    >
                                        {opt}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}