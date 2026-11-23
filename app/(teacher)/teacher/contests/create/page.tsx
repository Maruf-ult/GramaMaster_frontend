import { ContestForm, contestSchema } from "@/features/schemas/contestSchema";
import { apiClient } from "@/lib/api/api-client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { ApiResponse } from "@/types/common";
import { CreateContestRequest } from "@/types/contests";
import { zodResolver } from "@hookform/resolvers/zod";
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




}