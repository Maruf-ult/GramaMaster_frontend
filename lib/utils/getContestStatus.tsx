import { ContestCardRequest } from "@/types/contests";

export function getContestStatus(contest: ContestCardRequest): "upcoming" | "ongoing" | "past" {
    const now = new Date();
    const start = new Date(contest.startAt);
    const end = new Date(start.getTime() + contest.durationMinutes * 60 * 1000);
    if (now < start) return "upcoming";
    if (now >= start && now <= end) return "ongoing";
    return "past";
}