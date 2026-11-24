import { CreateTeamDialog } from "@/components/cards/CreateTeamDialog";
import { TeamAccordion } from "@/components/cards/TeamAccordion";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api/api-client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { ApiResponse } from "@/types/common";
import { TeamRequest } from "@/types/team";
import { Loader2, Plus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function TeacherStudentsPage() {
  const [teams, setTeams] = useState<TeamRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await apiClient<ApiResponse<TeamRequest[]>>(apiEndpoints.teams.teacher);
        if (res.success && res.data) {
          setTeams(res.data);
        } else {
          toast.error(res.message || "Failed to load teams.");
        }
      } catch (error: any) {
        toast.error(error.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  const handleTeamCreated = (team: TeamRequest) => {
    setTeams((prev) => [team, ...prev]);
  }

  const handleMemberRemoved = (teamId: string, studentId: string) => {
    setTeams((prev) =>
      prev.map((t) =>
        t.id === teamId ? {
          ...t,
          memberCount: t.memberCount - 1,
          members: t.members.filter((m) => m.studentId !== studentId),
        } : t))
  }

  const totalStudents = teams.reduce((sum, t) => sum + t.memberCount, 0);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  return (
    <>
      <div className="space-y-5 max-w-5xl">

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold">Students & Teams</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {teams.length} team{teams.length !== 1 ? "s" : ""} · {totalStudents} students enrolled
            </p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Team
          </Button>
        </div>

        {teams.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No teams yet. Create your first one!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {teams.map((team) => (
              <TeamAccordion
                key={team.id}
                team={team}
                onMemberRemoved={handleMemberRemoved}
              />
            ))}
          </div>
        )}
      </div>
      <CreateTeamDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreate={handleTeamCreated}
      />
    </>
  );
}