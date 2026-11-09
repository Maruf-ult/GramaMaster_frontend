export interface ChatHistoryRequest{
    sessionId:string;
    messagees:ChatMessageRequest[]
}

export interface ChatMessageRequest{
    sender:string;
    message:string;
    createdAt:Date;
}

export interface ChatRequestRequest{
    sessionId:string;
    message:string;
}

export interface ChatResponseRequest{
    sessionId:string;
    response:string;
    createdAt:Date;
}

