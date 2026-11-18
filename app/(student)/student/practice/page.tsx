"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BookOpen, Loader2, Flame, TrendingUp } from "lucide-react";
import { apiClient } from "@/lib/api/api-client";
import { apiEndpoints } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/common";
import type { CurriculumRequest } from "@/types/curriculum";
import type { TopicRequest } from "@/types/topics";
import { cn } from "@/lib/utils";


const difficultyConfig = {
    Easy: { label: "Easy", class: "bg-green-500/15 text-green-600 hover:bg-green-500/30" },
    Medium: { label: "Medium", class: "bg-orange-500/15 text-orange-600 hover:bg-orange-500/30" },
    Hard: { label: "Hard", class: "bg-red-500/15 text-red-600 hover:bg-red-500/30" },
} as const;

type Difficulty = keyof typeof difficultyConfig;


export default function PracticePage() {
    const router = useRouter();

    const [curricula, setCurricula] = useState<CurriculumRequest[]>([]);
    const [topics, setTopics] = useState<TopicRequest[]>([]);
    const [selectedCurriculumId, setSelectedCurriculumId] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [currRes, topicRes] = await Promise.all([
                    apiClient<ApiResponse<CurriculumRequest[]>>(apiEndpoints.curriculumns.getAll),
                    apiClient<ApiResponse<TopicRequest[]>>(apiEndpoints.topics.getAll),
                ]);

                if (currRes.success && currRes.data) {
                    setCurricula(currRes.data);
                    if (currRes.data.length > 0) {
                        setSelectedCurriculumId(currRes.data[0].id);
                    }
                }

                if (topicRes.success && topicRes.data) {
                    setTopics(topicRes.data);
                }
            } catch (error: any) {
                toast.error(error.message || "Failed to load topics.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    const filteredTopics = selectedCurriculumId
        ? topics.filter((t) => t.curriculumId === selectedCurriculumId)
        : topics;

    const handleStart = (topicId: string, difficulty: Difficulty) => {
        router.push(`/student/practice/${topicId}?difficulty=${difficulty}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl">


            <div>
                <h1 className="text-xl font-bold">Practice</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                    Choose a topic and difficulty level to start practicing.
                </p>
            </div>


            {curricula.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                    {curricula.map((c) => (
                        <button
                            key={c.id}
                            onClick={() => setSelectedCurriculumId(c.id)}
                            className={cn(
                                "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
                                selectedCurriculumId === c.id
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
                            )}
                        >
                            {c.name}
                        </button>
                    ))}
                </div>
            )}


            {filteredTopics.length === 0 ? (
                <div className="text-center text-muted-foreground py-20">
                    No topics found for this curriculum.
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTopics.map((topic) => (
                        <TopicCard
                            key={topic.id}
                            topic={topic}
                            onStart={handleStart}
                        />
                    ))}
                </div>
            )}

        </div>
    );
}


function TopicCard({
    topic,
    onStart,
}: {
    topic: TopicRequest;
    onStart: (topicId: string, difficulty: Difficulty) => void;
}) {
    return (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3 hover:border-primary/50 transition-colors">

            <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <BookOpen className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                    <h3 className="text-sm font-semibold truncate">{topic.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {topic.description}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                    {topic.problemCount} questions
                </span>
                <span className="flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                    {topic.grammarRuleCount} rules
                </span>
            </div>

            <div className="flex gap-1.5 pt-1">
                {(["Easy", "Medium", "Hard"] as Difficulty[]).map((diff) => (
                    <button
                        key={diff}
                        onClick={() => onStart(topic.id, diff)}
                        className={cn(
                            "flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors",
                            difficultyConfig[diff].class
                        )}
                    >
                        {diff}
                    </button>
                ))}
            </div>
        </div>
    );
}