export type DifficultyType = "Easy" | "Medium" | "Hard";

export type ProblemType = 
  | "MCQ" 
  | "FillBlank" 
  | "Narration" 
  | "Modifier" 
  | "Connectors" 
  | "SentenceCompletion"
  | "RightFormVerb"
  | "SynonymAntonym"
  | "Punctuation";

export interface AIExplanationRequest {
  problemId: string;
  studentAnswer: string;
  correctAnswer: string;
  explanation: string;
}

export interface AIQuestionDto {
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: DifficultyType;
  problemType: ProblemType;
}

export interface AIUsageRequest {
  featureName: string;
  totalRequests: number;
  totalTokens: number;
  totalCost: number;
  averageTokens: number;
}

export interface GenerateQuestionsRequest {
  topicId: string;
  curriculumId: string;
  problemType: ProblemType;
  difficultyType: DifficultyType;
  count: number;
  saveToDatabase: boolean;
}

export interface TopicRecommendationDto {
  title: string;
  recommendation: string;
  weakTopics: WeakTopicRequest[];
}

export interface WeakTopicRequest {
  topicId: string;
  topicName: string;
  accuracy: number;
  totalAttempts: number;
}
