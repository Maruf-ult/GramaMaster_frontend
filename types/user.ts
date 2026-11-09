import { UserRole } from "./auth";

export interface UserRequest{
    id:string;
    fullname:string;
    email:string;
    role:UserRole;
    isActive:boolean;
    createdAt:Date;
}