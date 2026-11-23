import { TeamRequest } from "@/types/team";
import { useState } from "react";
import { StudentRow } from "./StudentRow";
import { ChevronDown, ChevronUp, GraduationCap, Users } from "lucide-react";
import { JoinCodeCard } from "./JoinCodeCard";

export function TeamAccordion({ team, onMemberRemoved }: {
    team: TeamRequest;
    onMemberRemoved: (teamId: string, studentId: string) => void;
}) {
    const [open, setOpen] = useState(false);

    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden">

            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors text-left"
            >
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Users className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold">{team.name}</p>
                        {team.description && (
                            <p className="text-xs text-muted-foreground">{team.description}</p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-muted-foreground">
                        {team.memberCount} student{team.memberCount !== 1 ? "s" : ""}
                    </span>
                    {open
                        ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        : <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    }
                </div>
            </button>

            {open && (
                <div className="border-t border-border">

                    <div className="p-4 border-b border-border">
                        <JoinCodeCard code={team.joinCode} teamName={team.name} />
                    </div>

                    {team.members.length === 0 ? (
                        <div className="p-6 text-center text-sm text-muted-foreground">
                            <GraduationCap className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            No students yet. Share the join code above.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5 uppercase tracking-wide">Student</th>
                                        <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5 uppercase tracking-wide">Institution</th>
                                        <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5 uppercase tracking-wide">Curriculum</th>
                                        <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5 uppercase tracking-wide">Joined</th>
                                        <th className="px-4 py-2.5" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {team.members.map((m) => (
                                        <StudentRow
                                            key={m.studentId}
                                            member={m}
                                            teamId={team.id}
                                            onRemove={onMemberRemoved}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );

}