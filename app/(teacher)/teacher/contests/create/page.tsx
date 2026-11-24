import { AIGeneratePanel } from "@/components/cards/AIGenaratePanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ContestForm, contestSchema } from "@/features/schemas/contestSchema";
import { apiClient } from "@/lib/api/api-client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { cn } from "@/lib/utils";
import { ApiResponse } from "@/types/common";
import { CreateContestRequest } from "@/types/contests";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Loader2, Plus, Trophy, X } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CreateContestPage() {
  const router = useRouter();
  const [problemIds, setProblemIds] = useState<string[]>([]);
  const [manualProblemId, setManualProblemId] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContestForm>({
    resolver: zodResolver(contestSchema),
    defaultValues: {
      contestType: "Global",
      durationMinutes: 30,
    },
  });

  const contestType = watch("contestType");

  const addProblemId = () => {
    const id = manualProblemId.trim();
    if (!id) return;
    if (problemIds.includes(id)) {
      toast.warning("Already added.");
      return;
    }
    setProblemIds((prev) => [...prev, id]);
    setManualProblemId("");
  };

  const removeProblemId = (id: string) => {
    setProblemIds((prev) => prev.filter((p) => p !== id));
  };

  const handleAIProblems = (ids: string[]) => {
    setProblemIds((prev) => {
      const existing = new Set(prev);
      return [...prev, ...ids.filter((id) => !existing.has(id))];
    });
  };

  const onSubmit = async (data: ContestForm) => {
    if (problemIds.length === 0) {
      toast.warning("Add at least one problem before creating the contest.");
      return;
    }
    try {
      const payload: CreateContestRequest = {
        title: data.title,
        description: data.description,
        curriculumId: data.curriculumId,
        contestType: data.contestType,
        teamId: data.contestType === "Local" ? data.teamId : undefined,
        startAt: new Date(data.startAt),
        endAt: new Date(data.endAt),
        durationMinutes: data.durationMinutes,
        problemIds,
      };
      const res = await apiClient<ApiResponse<{ id: string }>>(
        apiEndpoints.contests.create,
        { method: "POST", body: JSON.stringify(payload) }
      );
      if (res.success) {
        toast.success("Contest created!");
        router.push("/teacher/contests");
      } else {
        toast.error(res.message || "Failed to create contest.");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/teacher/contests")}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold">Create Contest</h1>
          <p className="text-sm text-muted-foreground">
            Configure the contest and add problems manually or via AI.
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <Trophy className="w-4 h-4 text-primary" />
            Contest Details
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="title">Contest Title</Label>
            <Input id="title" placeholder="e.g. Grammar Challenge — Week 3" {...register("title")} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              rows={3}
              placeholder="Describe what this contest covers..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              {...register("description")}
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="curriculumId">Curriculum ID</Label>
              <Input id="curriculumId" placeholder="paste curriculum ID" {...register("curriculumId")} />
              {errors.curriculumId && <p className="text-xs text-destructive">{errors.curriculumId.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Contest Type</Label>
              <div className="flex gap-2">
                {(["Global", "Local"] as const).map((type) => (
                  <label
                    key={type}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border cursor-pointer text-sm font-medium transition-colors",
                      contestType === type
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    )}
                  >
                    <input type="radio" value={type} {...register("contestType")} className="hidden" />
                    {type}
                  </label>
                ))}
              </div>
            </div>
          </div>
          {contestType === "Local" && (
            <div className="space-y-1.5">
              <Label htmlFor="teamId">Team ID (for Local contest)</Label>
              <Input id="teamId" placeholder="paste your team ID" {...register("teamId")} />
            </div>
          )}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="startAt">Start Date & Time</Label>
              <Input id="startAt" type="datetime-local" {...register("startAt")} />
              {errors.startAt && <p className="text-xs text-destructive">{errors.startAt.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="endAt">End Date & Time</Label>
              <Input id="endAt" type="datetime-local" {...register("endAt")} />
              {errors.endAt && <p className="text-xs text-destructive">{errors.endAt.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="durationMinutes">Duration (minutes)</Label>
              <Input id="durationMinutes" type="number" min={5} max={180} {...register("durationMinutes")} />
              {errors.durationMinutes && <p className="text-xs text-destructive">{errors.durationMinutes.message}</p>}
            </div>
          </div>
        </div>

        <AIGeneratePanel onAddProblems={handleAIProblems} />

        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <div className="text-sm font-semibold">Problem IDs ({problemIds.length} added)</div>
          <div className="flex gap-2">
            <Input
              placeholder="Paste a problem ID..."
              value={manualProblemId}
              onChange={(e) => setManualProblemId(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addProblemId(); } }}
            />
            <Button type="button" variant="outline" onClick={addProblemId}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {problemIds.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {problemIds.map((id) => (
                <div
                  key={id}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono"
                >
                  <span className="max-w-[120px] truncate">{id}</span>
                  <button
                    type="button"
                    onClick={() => removeProblemId(id)}
                    className="text-primary/60 hover:text-red-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => router.push("/teacher/contests")}
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </span>
            ) : "Create Contest"}
          </Button>
        </div>
      </form>
    </div>
  );
}