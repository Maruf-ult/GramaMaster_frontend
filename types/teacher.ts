import { EducationBoard, StudyGroup } from "./auth";

export interface RecentContestRequest{
    contestId:string;
    title:string;
    startAt:Date;
    endAt:Date;
    participantCount:number;
}

export interface TeacherAnalyticsRequest{
    totalStudent:number;
    totalProblemsCreated:number;
    aiGeneratedProblems:number;
    manualProblems:number;
    totalContests:number;
    runningContests:number;
    completedContests:number;
    averageStudentAccuracy:number;
    topicPerformances:topicPerformanceRequest[];
}

export interface TeacherDashboardRequest{
    totalTeams:number;
    totalStudents:number;
    totalContests:number;
    totalPracticeProblems:number;
    aiGeneratedProblems:number;
    activeContests:number;
    averageStudentAccuracy:number;
    recentContests:RecentContestRequest[];
    teams:teamSummaryRequest[];
}

export interface TeacherProfileRequest{
    id:string;
    userId:string;
    fullname:string;
    email:string;
    profileImageUrl?:string;
    sscResult:number;
    sscGroup:StudyGroup;
    sscBoard:EducationBoard;
    hscResult:number;
    hscGroup:StudyGroup;
    hscBoard:EducationBoard;
    department:string;
    university:string;
}

export interface teamSummaryRequest{
    teamId:string;
    teamName:string;
    studentCount:number;
}

export interface topicPerformanceRequest{
    topicId:string;
    topicName:string;
    questionSolved:number;
    averageAccuracy:number;
    weakStudents:number;
    strongStudents:number;
}

export interface UpdateTeacherProfileRequest{
    profileImageUrl?:string;
    department:string;
    university:string;
}