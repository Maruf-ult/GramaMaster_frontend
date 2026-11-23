import { apiClient } from "@/lib/api/api-client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { GrammarRuleRequest } from "@/types/grammarrules";
import { error } from "console";
import { BookOpen, ChevronDown, ChevronUp, Loader2, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function RuleCard({
    rule,
    onEdit,
    onDelete,
}: {
    rule: GrammarRuleRequest;
    onEdit: (rule: GrammarRuleRequest) => void;
    onDelete: (id: string) => void;
}) {
    const [expanded, setExpanded] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm(`Delete rule "${rule.title}"?`))
            return;
        setDeleting(true);
        try {
            await apiClient(apiEndpoints.grammars.delete(rule.id),
                { method: "DELETE" });
            toast.success("Rule deleted.");
            onDelete(rule.id);
        } catch (error: any) {
            toast.error(error.message || "Failed to delete.");
        } finally {
            setDeleting(false);
        }
    };
    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between p-4">
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="flex items-center gap-3 text-left flex-1 min-w-0"
                >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <BookOpen className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{rule.title}</p>
                        <p className="text-xs text-muted-foreground">{rule.topicName}</p>
                    </div>
                    {expanded
                        ? <ChevronUp className="w-4 h-4 text-muted-foreground ml-2 shrink-0" />
                        : <ChevronDown className="w-4 h-4 text-muted-foreground ml-2 shrink-0" />
                    }
                </button>
                <div className="flex items-center gap-1.5 ml-3 shrink-0">
                    <button
                        onClick={() => onEdit(rule)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    >
                        <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                        {deleting
                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            : <Trash2 className="w-3.5 h-3.5" />
                        }
                    </button>
                </div>
            </div>
            {expanded && (
                <div className="border-t border-border p-4 space-y-3">
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Rule</p>
                        <p className="text-sm leading-relaxed">{rule.content}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Example</p>
                        <p className="text-sm italic text-muted-foreground leading-relaxed">{rule.example}</p>
                    </div>
                </div>
            )}
        </div>
    );
}