"use client";

import { apiClient } from "@/lib/api/api-client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { TeamMemberRequest } from "@/types/team";
import { Loader2, UserMinus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function StudentRow({ member, teamId, onRemove }: { member: TeamMemberRequest; teamId: string; onRemove: (teamId: string, studentId: string) => void; }) {

    const [removing, setRemoving] = useState(false);

    const handleRemove = async () => {
        if (!confirm(`Remove ${member.fullName} from this team?`))
            return;
        setRemoving(true);
        try {
            await apiClient(apiEndpoints.teams.removeStudent(teamId, member.studentId), {
                method: "DELETE",
            });
            toast.success(`${member.fullName} removed.`);
            onRemove(teamId, member.studentId);
        } catch (error: any) {
            toast.error(error.message || "Failed to remove student.");
        } finally {
            setRemoving(false);
        }
    }
    return (
        <tr className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
            <td className="py-3 px-4">
                <div className="flex items-center gap-2.5">
                    {member.profileImageUrl ? (
                        <img
                            src={member.profileImageUrl}
                            alt={member.fullName}
                            className="w-7 h-7 rounded-full object-cover border border-border shrink-0"
                        />
                    ) : (
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-primary">
                                {member.fullName[0]?.toUpperCase()}
                            </span>
                        </div>
                    )}
                    <span className="text-sm font-medium">{member.fullName}</span>
                </div>
            </td>
            <td className="py-3 px-4 text-sm text-muted-foreground">
                {member.InstitutionName}
            </td>
            <td className="py-3 px-4">
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 font-medium">
                    {member.curriculum}
                </span>
            </td>
            <td className="py-3 px-4 text-xs text-muted-foreground">
                {new Date(member.joinedAt).toLocaleDateString("en-BD", {
                    day: "2-digit", month: "short", year: "numeric",
                })}
            </td>
            <td className="py-3 px-4 text-right">
                <button
                    onClick={handleRemove}
                    disabled={removing}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                >
                    {removing
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <UserMinus className="w-3.5 h-3.5" />
                    }
                </button>
            </td>
        </tr>
    );
}