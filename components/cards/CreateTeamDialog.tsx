"use client";

import { CreateTeamForm, createTeamSchema } from "@/features/schemas/createTeamSchema";
import { apiClient } from "@/lib/api/api-client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { ApiResponse } from "@/types/common";
import { CreateTeamRequest, TeamRequest } from "@/types/team";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { Input } from "@base-ui/react";
import { Label } from "../ui/label";

export function CreateTeamDialog(
    { open, onClose, onCreate
    }: { open: boolean; onClose: () => void; onCreate: (team: TeamRequest) => void; }) {

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CreateTeamForm>({ resolver: zodResolver(createTeamSchema) });

    const onSubmit = async (data: CreateTeamForm) => {
        try {
            const payload: CreateTeamRequest = {
                name: data.name,
                description: data.description || undefined,
            };
            const res = await apiClient<ApiResponse<TeamRequest>>(apiEndpoints.teams.create, { method: "POST", body: JSON.stringify(payload) });

            if (res.success && res.data) {
                toast.success("Team created!");
                onCreate(res.data);
                reset();
                onClose();
            } else {
                toast.error(res.message || "Failed to create team.");
            }

        } catch (error: any) {
            toast.error(error.message || "Something went wrong.");
        }
    };

    if (!open) return null;

    return (
        <>
            <div
                className="fixed inset-0 z-40 bg-black/50"
                onClick={onClose}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-background border border-border rounded-2xl shadow-2xl p-6 space-y-4">
                    <h2 className="text-base font-bold">Create New Team</h2>
                    <p className="text-sm text-muted-foreground">
                        A join code will be generated automatically for your students.
                    </p>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="name">Team Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g. HSC 2025 Batch"
                                {...register("name")}
                            />
                            {errors.name && (
                                <p className="text-xs text-destructive">{errors.name.message}</p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="description">Description (optional)</Label>
                            <Input
                                id="description"
                                placeholder="e.g. Science group students"
                                {...register("description")}
                            />
                        </div>
                        <div className="flex gap-2 pt-1">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1"
                                onClick={() => { reset(); onClose(); }}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className="flex-1" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Creating...
                                    </span>
                                ) : "Create Team"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );

}