"use client"

import { ContestCard, TabKey } from "@/components/cards/ContestCard";
import { apiClient } from "@/lib/api/api-client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { getContestStatus } from "@/lib/utils/getContestStatus";
import { ApiResponse } from "@/types/common";
import { ContestCardRequest } from "@/types/contests";
import { cn } from "cn";
import { Loader2, Trophy } from "lucide-react";
import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ContestPage() {
  const router = useRouter();
  const [contests, setContests] = useState<ContestCardRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("ongoing");

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const res = await apiClient<ApiResponse<ContestCardRequest[]>>(apiEndpoints.contests.studentAvailable);
        if (res.success && res.data) {
          setContests(res.data);
        } else {
          toast.error(res.message || "Failed to load contests.");
        }
      } catch (error: any) {
        toast.error(error.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }
    fetchContests();
  }, []);

  const handleAction = (contest: ContestCardRequest) => {
    const status = getContestStatus(contest);
    if (status === "ongoing") {
      router.push(`/student/exams/${contest.id}`);
    } else if (status === "past" && contest.hasJoined) {
      router.push(`/student/exams/${contest.id}/review`);
    }
    ///register api call
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: "ongoing", label: "Ongoing" },
    { key: "upcoming", label: "Upcoming" },
    { key: "past", label: "Past" },
  ];

  const filtered = contests.filter((c) => getContestStatus(c) === activeTab);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  return (
    <div className="space-y-5 max-w-5xl">

      <div>
        <h1 className="text-xl font-bold">Contests</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Compete with other students in timed grammar challenges.
        </p>
      </div>

      <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
        {tabs.map((tab) => {
          const count = contests.filter((c) => getContestStatus(c) === tab.key).length;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5",
                activeTab === tab.key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
              <span className={cn(
                "text-[10px] px-1.5 py-0.5 rounded-full font-semibold",
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted-foreground/20 text-muted-foreground"
              )}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Trophy className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No {activeTab} contests right now.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((contest) => (
            <ContestCard
              key={contest.id}
              contest={contest}
              status={activeTab}
              onAction={handleAction}
            />
          ))}
        </div>
      )}
    </div>
  );
}