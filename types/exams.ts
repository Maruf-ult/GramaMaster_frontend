export interface AnswerReviewRequest{
    problemId:string;
    question:string;
    studentAnswer:string;
    correctAnswer:string;
    isCorrect:boolean;
    aiExplanation?:string;
}

export interface ExamAttemptRequest{
    id:string;
    contestId:string;
    startedAt:Date;
    submittedAt:Date;
    score:number;
    totalQuestions:number;
}

export interface ExamResultRequest{
    attemptId:string;
    score:number;
    correctAnswers:number;
    totalQuestions:number;
    percentage:number;
    reviews:AnswerReviewRequest[]; 
}

export interface LeaderboardRequest{
    rank:number;
    studentName:string;
    score:number;
    submittedAt:Date;
}

export interface StartExamRequest{
    contestId:string;
}

export interface SubmitAnswerRequest{
    problemId:string;
    studentAnswer:string;
}

export interface SubmitExamRequest{
    attemptId:string;
    answers:SubmitAnswerRequest[];
}