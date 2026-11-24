"use client";
import { RuleCard } from "@/components/cards/RuleCard";
import { RuleFormDialog } from "@/components/cards/RuleFormDialog";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api/api-client";
import { ApiResponse } from "@/types/common";
import { GrammarRuleRequest } from "@/types/grammarrules";
import { BookOpen, Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminGrammarRulesPage() {
    const [rules, setRules] = useState<GrammarRuleRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingRule, setEditingRule] = useState<GrammarRuleRequest | null>(null);
    useEffect(() => {
        const fetchRules = async () => {
            try {

                const res = await apiClient<ApiResponse<GrammarRuleRequest[]>>(
                    "/api/Grammars"
                );
                if (res.success && res.data) setRules(res.data);
                else toast.error(res.message || "Failed to load grammar rules.");
            } catch (error: any) {
                toast.error(error.message || "Something went wrong.");
            } finally {
                setLoading(false);
            }
        };
        fetchRules();
    }, []);
    const handleSaved = (rule: GrammarRuleRequest, isEdit: boolean) => {
        if (isEdit) {
            setRules((prev) => prev.map((r) => r.id === rule.id ? rule : r));
        } else {
            setRules((prev) => [rule, ...prev]);
        }
        setEditingRule(null);
    };
    const handleDelete = (id: string) => {
        setRules((prev) => prev.filter((r) => r.id !== id));
    };
    const handleEdit = (rule: GrammarRuleRequest) => {
        setEditingRule(rule);
        setDialogOpen(true);
    };
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        );
    }
    return (
        <>
            <div className="space-y-5 max-w-4xl">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-xl font-bold">Grammar Rules</h1>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            {rules.length} rules across all topics
                        </p>
                    </div>
                    <Button onClick={() => { setEditingRule(null); setDialogOpen(true); }}>
                        <Plus className="w-4 h-4 mr-2" />
                        New Rule
                    </Button>
                </div>
                {rules.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground">
                        <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">No grammar rules yet.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {rules.map((rule) => (
                            <RuleCard
                                key={rule.id}
                                rule={rule}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
            <RuleFormDialog
                open={dialogOpen}
                editing={editingRule}
                onClose={() => { setDialogOpen(false); setEditingRule(null); }}
                onSaved={handleSaved}
            />
        </>
    );
}