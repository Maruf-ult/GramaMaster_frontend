import { RuleForm, ruleSchema } from "@/features/schemas/ruleSchema";
import { apiClient } from "@/lib/api/api-client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { ApiResponse } from "@/types/common";
import { CreateGrammarRuleRequest, GrammarRuleRequest, UpdateGrammarRuleRequest } from "@/types/grammarrules";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function RuleFormDialog({
    open,
    editing,
    onClose,
    onSaved,
}: {
    open: boolean;
    editing: GrammarRuleRequest | null;
    onClose: () => void;
    onSaved: (rule: GrammarRuleRequest, isEdit: boolean) => void;
}) {
    const isEdit = !!editing;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<RuleForm>({
        resolver: zodResolver(ruleSchema),
        defaultValues: editing ? { topicId: editing.topicId, title: editing.title, content: editing.content, example: editing.example } : { topicId: "", title: "", content: "", example: "" },
    });

    useEffect(() => {
        if (editing) {
            reset({
                topicId: editing.topicId,
                title: editing.title,
                content: editing.content,
                example: editing.example,
            });
        } else {
            reset({ topicId: "", title: "", content: "", example: "" });
        }
    }, [editing, reset]);

    const onSubmit = async (data: RuleForm) => {
        try {
            if (isEdit && editing) {
                const payload: UpdateGrammarRuleRequest = {
                    title: data.title,
                    content: data.content,
                    example: data.example,
                };
                const res = await apiClient<ApiResponse<GrammarRuleRequest>>(apiEndpoints.grammars.update(editing.id), { method: "PUT", body: JSON.stringify(payload) });
                if (res.success && res.data) {
                    toast.success("Rule updated!");
                    onSaved(res.data, true);
                    onClose();
                } else {
                    toast.error(res.message || "Failed to update.");
                }
            } else {
                const payload: CreateGrammarRuleRequest = data;
                const res = await apiClient<ApiResponse<GrammarRuleRequest>>(
                    apiEndpoints.grammars.topic(data.topicId),
                    { method: "POST", body: JSON.stringify(payload) }
                );
                if (res.success && res.data) {
                    toast.success("Grammar rule created!");
                    onSaved(res.data, false);
                    onClose();
                    reset();
                } else {
                    toast.error(res.message || "Failed to create.");
                }
            }
        } catch (error: any) {
            toast.error(error.message || "Something went wrong.");
        }
    };
    if (!open) return null;
    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="w-full max-w-lg bg-background border border-border rounded-2xl shadow-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-bold">
                            {isEdit ? "Edit Grammar Rule" : "New Grammar Rule"}
                        </h2>
                        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {!isEdit && (
                            <div className="space-y-1.5">
                                <Label htmlFor="topicId">Topic ID</Label>
                                <Input id="topicId" placeholder="paste topic ID" {...register("topicId")} />
                                {errors.topicId && <p className="text-xs text-destructive">{errors.topicId.message}</p>}
                            </div>
                        )}
                        <div className="space-y-1.5">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" placeholder="e.g. Subject-Verb Agreement" {...register("title")} />
                            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="content">Rule Content</Label>
                            <textarea
                                id="content"
                                rows={4}
                                placeholder="Explain the grammar rule clearly..."
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                                {...register("content")}
                            />
                            {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="example">Example</Label>
                            <Input
                                id="example"
                                placeholder="e.g. The team wins every match."
                                {...register("example")}
                            />
                            {errors.example && <p className="text-xs text-destructive">{errors.example.message}</p>}
                        </div>
                        <div className="flex gap-2 pt-1">
                            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit" className="flex-1" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Saving...
                                    </span>
                                ) : isEdit ? "Save Changes" : "Create Rule"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}