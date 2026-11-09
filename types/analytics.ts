import { AIUsageRequest } from "./ai";

export interface AdminDashboardRequest{
    totalStudents:number;
    totalTeachers:number;
    totalContests:number;
    totalProblems:number;
    totalPracticeSessions:number;
    totalAIRequests:number;
    totalAICost:number;
    monthlyStatistics:MonthlyProgressRequest[];
    aiUsage:AIUsageRequest[];
}

export interface MonthlyProgressRequest{
    month:string;
    totalPractice:number;
    totalContests:number;
    averageScore:number;
}

export interface PerformanceTrendRequest{
    date:Date;
    score:number;
}

export interface StudentDashboardRequest{
   studentName:string;
   practiceCompleted:number;
   contestsJoined:number;
   averageScore:number;
   weakTopics:number;
   strongTopics:number;
   topicsStatistics:TopicStatisticsRequest[];
   performance:PerformanceTrendRequest[];
   monthlyProgress:MonthlyProgressRequest[];
}

export interface TeacherDashboardRequest{
    teacherName:string;
    totalTeams:number;
    totalStudents:number;
    totalContests:number;
    totalProblems:number;
    averageStudentScore:number;
    performance:PerformanceTrendRequest[];
}

export interface TopicStatisticsRequest{
    topicId:string;
    topicName:string;
    totalQuestions:number;
    correctAnswers:number;
    accuracy:number;
}