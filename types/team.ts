import { CurriculumType } from "./auth";

export interface CreateTeamRequest{
    name:string;
    description?:string;
}

export interface JoinTeamRequest{
    joinCode:string;
}

export interface TeamRequest{
    id:string;
    name:string;
    description?:string;
    joinCode:string;
    teacherId:string;
    teacherName:string;
    memberCount:number;
    createdAt:Date;
    members:TeamMemberRequest[];
}

export interface TeamMemberRequest{
    studentId:string;
    fullName:string;
    InstitutionName:string;
    curriculum:CurriculumType;
    profileImageUrl?:string;
    joinedAt:Date;
}

export interface UpdateTeamRequest{
    name:string;
    description?:string;
}