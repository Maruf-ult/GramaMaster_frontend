export interface CreateTopicRequest{
    name:string;
    description:string;
    curriculumId:string;
}

export interface TopicAnalyticsRequest{
    topicId:string;
    topicName:string;
    accuracy:number;
    totalAttempts:number;
}

export interface TopicRequest{
    id:string;
    name:string;
    description:string;
    curriculumId:string;
    curriculum:string;
    problemCount:number;
    grammarRuleCount:number;
}

export interface UpdateTopicRequest{
    name:string;
    description:string;
}