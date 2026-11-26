"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  CalendarClock,
  Loader2,
  Search,
  Trash2,
  Trophy,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api/api-client";
import { apiEndpoints } from "@/lib/api/endpoints";
import type { ApiResponse, PageResultRequest } from "@/types/common";
import type { ContestRequest } from "@/types/contests";
import { formatDate } from "@/lib/utils/formateDate";
import { TableSkeleton } from "@/components/ui/skeleton-card";

export default function AdminContestsPage() {
  const [contests, setContests] = useState<ContestRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const res = await apiClient<
          ApiResponse<PageResultRequest<ContestRequest>>
        >(`${apiEndpoints.contests.global}?pageNumber=1&pageSize=50`);
        if (res.success && res.data) {
          setContests(res.data.items ?? []);
        } else {
          toast.error(res.message || "Failed to load contests.");
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load contests.";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  const handleDelete = async (contest: ContestRequest) => {
    if (!confirm(`Delete contest "${contest.title}"? This cannot be undone.`)) {
      return;
    }
    setDeletingId(contest.id);
    try {
      const res = await apiClient<ApiResponse<boolean>>(
        apiEndpoints.contests.delete(contest.id),
        { method: "DELETE" }
      );
      if (res.success) {
        setContests((prev) => prev.filter((c) => c.id !== contest.id));
        toast.success(`"${contest.title}" deleted.`);
      } else {
        toast.error(res.message || "Failed to delete contest.");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete contest.";
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = contests.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.curriculum.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <TableSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Trophy className="w-6 h-6 text-primary" />
          Global Contests
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor and moderate global grammar contests across the platform.
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
        <Input
          placeholder="Search contests or curriculum..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground py-10 text-center">
            No global contests found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Title</th>
                  <th className="text-left px-4 py-3 font-medium">Curriculum</th>
                  <th className="text-left px-4 py-3 font-medium">Schedule</th>
                  <th className="text-right px-4 py-3 font-medium">Problems</th>
                  <th className="text-right px-4 py-3 font-medium">
                    Participants
                  </th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((contest) => (
                  <tr key={contest.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{contest.title}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {contest.curriculum}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5 text-xs">
                        <CalendarClock className="w-3.5 h-3.5" />
                        {formatDate(contest.startAt)} ({contest.durationMinutes}m)
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {contest.totalProblems}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-muted-foreground" />
                        {contest.totalParticipants}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={deletingId === contest.id}
                        onClick={() => handleDelete(contest)}
                      >
                        {deletingId === contest.id ? (
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
