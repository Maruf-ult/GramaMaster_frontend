import { DifficultyType, ProblemType } from "./ai";

export interface CreateProblemRequest{
    topicId:string;
    contestId:string;
    problemType:ProblemType;
    difficulty:DifficultyType;
    questionText:string;
    correctAns:string;
    explanation:string;
    options:ProblemOptionRequest[];
}

export interface GenerateAiProblemnsRequest{
    topicId:string;
    problemType:ProblemType;
    difficulty:DifficultyType;
    count:number;
}

export interface PracticeProblemnRequest{
    id:string;
    topicName:string;
    problemType:ProblemType;
    difficulty:DifficultyType;
    questionText:string;
    options:ProblemOptionRequest[];
}

export interface ProblemDetailsRequest{
    id:string;
    topicId:string;
    topicName:string;
    problemType:ProblemType;
    difficulty:DifficultyType;
    questionText:string;
    correctAns:string;
    explanation:string;
    isAiGenerated:boolean;
    options:ProblemOptionRequest[];
}

export interface ProblemRequest{
    id:string;
    topic:string;
    problemType:ProblemType;
    difficulty:DifficultyType;
    questionText:string;
    isAiGenerated:boolean;
}

export interface ProblemOptionRequest{
    id:string;
    optionText:string;
    isCorrect:boolean;
}

export interface ProblemResultRequest{
    problemId:string;
    question:string;
    studentAnswer:string;
    correctAnswer:string;
    isCorrect:boolean;
    aiExplanation?:string;
}

export interface UpdateProblemRequest{
    topicId:string;
    problemType:ProblemType;
    difficultY:DifficultyType;
    questionText:string;
    correctAns:string;
    explanation:string;
    options:ProblemOptionRequest[];
}