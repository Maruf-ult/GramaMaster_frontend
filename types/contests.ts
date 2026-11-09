import { Timestamp } from "next/dist/server/lib/cache-handlers/types";
import { User } from "./auth";

export type ContestType = "Global"|"Local"

export interface ContestAnalyticsRequest{
    contestId:string;
    title:string;
    totalParticipants:number;
    averageScore:number;
    highestScore:number;
    lowestScore:number;
    passRate:number;
    topics:TopicAnalyticsRequest[];
}


export interface ContestCardRequest{
    id:string;
    title:string;
    contestType:ContestType;
    curriculum:string;
    startAt:Date;
    durationMinutes:number;
    participantCount:number;
    isRunning:boolean;
    hasJoined:boolean;
}

export interface ContestDetailsRequest{
    id:string;
    title:string;
    description:string;
    curriculum:string;
    createdBy:string;
    teamName?:string;
    startAt:Date;
    endAt:Date;
    durationMinutes:number;
    totalProblems:number;
    hasJoined:boolean;
    hasSubmitted:boolean;
    isRunning:boolean;
}

export interface ContestRequest{
    id:string;
    title:string;
    description:string;
    contestType:ContestType;
    curriculum:string;
    createdBy:User;
    teamId?:string;
    teamName?:string;
    startAt:Date;
    endAt:Date;
    durationMinutes:number;
    totalProblems:number;
    totalParticipants:number;
}


export interface ContestLeaderBoardRequest{
    rank:number;
    studentId:string;
    studentName:string;
    profileImageUrl?:string;
    score:number;
    correctAnswers:number;
    totalQuestions:number;
    completionTime:Timestamp;
}

export interface ContestListRequest{
    id:string;
    title:string;
    contestType:ContestType;
    curriculum:string;
    startAt:Date;
    endAt:Date;
}

export interface ContestResultRequest{
    attemptId:string;
    contestId:string;
    contestTitle:string;
    score:number;
    correctAnswers:number;
    totalQuestions:number;
    rank:number;
    timeTaken:TimeRanges;
    problems:ProblemResultRequest[];
}

export interface CreateContestRequest{
    title:string;
    description:string;
    curriculumId:string;
    contestType:ContestType;
    teamId?:string;
    startAt:Date;
    endAt:Date;
    durationMinutes:number;
    problemIds:string[];
}

export interface UpdateContestRequest{
    title:string;
    description:string;
    startAt:Date;
    endAt:Date;
    durationMinutes:number;
    problemIds:string[];
}