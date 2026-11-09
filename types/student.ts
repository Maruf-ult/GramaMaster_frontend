import { CurriculumType, EducationBoard, StudyGroup } from "./auth";

export interface StudentAnalyticsRequest{
    totalQuestionsSolved:number;
    correctAnswers:number;
    wrongAnswers:number;
    accuracy:number;
    averageTimePerQuestion:TimeRanges;
}

export interface StudentDashboardRequest{
    totalPracticeQuestions:number;
    totalContestsJoined:number;
    totalContestsCompleted:number;
    overallAccuracy:number;
    currentRank:number;
    weakTopics:StudentTopicProgressRequest[];
    strongTopics:StudentTopicProgressRequest[];
}

export interface StudentProfileRequest{
    id:string;
    fullName:string;
    email:string;
    profileImageUrl?:string;
    institutionName:string;
    curriculum:CurriculumType;
    group:StudyGroup;
    examBatchYear:number;
    board:EducationBoard;
}

export interface StudentProgressRequest{
    totalTopics:number;
    completedTopics:number;
    progressPercentage:number;
    topics:StudentTopicProgressRequest[];
}

export interface StudentTopicProgressRequest{
    topicId:string;
    topicName:string;
    totalSolved:number;
    correctAnswers:number;
    wrongAnswers:number;
    accuracy:number;
    progressPercentage:number;
    difficultyRecommendation:string;
}

export interface UpdateStudentProfileRequest{
    profileImageUrl?:string;
    institutionName:string;
    group:StudyGroup;
    board:EducationBoard;
}