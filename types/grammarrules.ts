export interface CreateGrammarRuleRequest{
    topicId:string;
    title:string;
    content:string;
    example:string;
}

export interface GrammarRuleRequest{
    id:string;
    topicId:string;
    topicName:string;
    title:string;
    content:string;
    example:string;
}

export interface UpdateGrammarRuleRequest{
    title:string;
    content:string;
    example:string;
}