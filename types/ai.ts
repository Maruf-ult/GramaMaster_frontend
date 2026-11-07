export type DifficultyType = "Easy" | "Medium" | "Hard";
export type ProblemType =   "MCQ" | "FillBlank" | "Narration" | "Modifier" | "Connectors" | "SentenceCompletion"|"RightFormVerb"|"SynonymAntonym"|"Punctuation";

export interface AIExplanationRequest{
    ProblemId:string;
    StudentAnswer:string;
    CorrectAnswer:string;
    Explanation:string;
}

export interface AIQuestionDto{
    QuestionText:string;
    Options:string[];
    CorrectAnswer:string;
    Explanation:string;
    Difficulty:DifficultyType;
    ProblemType:ProblemType;
}

export interface AIUsageRequest{
    FeatureName:string;
    TotalRequests:number;
    TotalTokens:number;
    TotalCost:number;
    AverageTokens:number;
}
