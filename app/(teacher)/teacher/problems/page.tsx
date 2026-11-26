"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  BookOpen,
  Brain,
  Loader2,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api/api-client";
import { apiEndpoints } from "@/lib/api/endpoints";
import type { ApiResponse, PageResultRequest } from "@/types/common";
import type { DifficultyType } from "@/types/ai";
import type { ProblemRequest } from "@/types/problems";
import { TableSkeleton } from "@/components/ui/skeleton-card";
import { AIGeneratePanel } from "@/components/cards/AIGenaratePanel";

const DIFFICULTY_STYLES: Record<DifficultyType, string> = {
  Easy: "bg-emerald-500/15 text-emerald-600",
  Medium: "bg-amber-500/15 text-amber-600",
  Hard: "bg-rose-500/15 text-rose-600",
};

export default function TeacherProblemsPage() {
  const [problems, setProblems] = useState<ProblemRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyType | "All">("All");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showAiPanel, setShowAiPanel] = useState(false);

  const fetchProblems = async () => {
    try {
      const res = await apiClient<
        ApiResponse<ProblemRequest[] | PageResultRequest<ProblemRequest>>
      >(apiEndpoints.problems.teacher);
      if (res.success && res.data) {
        const items = Array.isArray(res.data)
          ? res.data
          : res.data.items ?? [];
        setProblems(items);
      } else {
        toast.error(res.message || "Failed to load problems.");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load problems.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleDelete = async (problem: ProblemRequest) => {
    if (!confirm("Delete this problem? This cannot be undone.")) return;
    setDeletingId(problem.id);
    try {
      const res = await apiClient<ApiResponse<boolean>>(
        apiEndpoints.problems.delete(problem.id),
        { method: "DELETE" }
      );
      if (res.success) {
        setProblems((prev) => prev.filter((p) => p.id !== problem.id));
        toast.success("Problem deleted.");
      } else {
        toast.error(res.message || "Failed to delete problem.");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete problem.";
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = problems.filter((p) => {
    const matchesSearch =
      p.questionText.toLowerCase().includes(search.toLowerCase()) ||
      p.topic.toLowerCase().includes(search.toLowerCase());
    const matchesDiff =
      difficultyFilter === "All" || p.difficulty === difficultyFilter;
    return matchesSearch && matchesDiff;
  });

  if (loading) {
    return <TableSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            Problem Bank
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse, filter, and manage your grammar questions or generate new ones with AI.
          </p>
        </div>
        <Button
          onClick={() => setShowAiPanel((prev) => !prev)}
          variant={showAiPanel ? "outline" : "default"}
          className="gap-2"
        >
          <Sparkles className="w-4 h-4" />
          {showAiPanel ? "Hide AI Generator" : "AI Generate Questions"}
        </Button>
      </div>

      {showAiPanel && (
        <AIGeneratePanel
          onAddProblems={() => {
            fetchProblems();
          }}
        />
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search question or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          {(["All", "Easy", "Medium", "Hard"] as const).map((diff) => (
            <Button
              key={diff}
              variant={difficultyFilter === diff ? "default" : "outline"}
              size="sm"
              onClick={() => setDifficultyFilter(diff)}
            >
              {diff}
            </Button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground py-10 text-center">
            No problems found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Question</th>
                  <th className="text-left px-4 py-3 font-medium">Topic</th>
                  <th className="text-left px-4 py-3 font-medium">Type</th>
                  <th className="text-left px-4 py-3 font-medium">Difficulty</th>
                  <th className="text-left px-4 py-3 font-medium">Source</th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((problem) => (
                  <tr key={problem.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 max-w-md">
                      <p className="line-clamp-2 font-medium">
                        {problem.questionText}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {problem.topic}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {problem.problemType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          DIFFICULTY_STYLES[problem.difficulty]
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {problem.isAiGenerated ? (
                        <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
                          <Brain className="w-3.5 h-3.5" /> AI
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Manual
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={deletingId === problem.id}
                        onClick={() => handleDelete(problem)}
                      >
                        {deletingId === problem.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
