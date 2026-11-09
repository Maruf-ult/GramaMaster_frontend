import { UserRole } from "@/types/auth";

export const hasRole = (
    userRole:UserRole,
    allowedRoles:UserRole[]
):boolean =>{
    return allowedRoles.includes(userRole);
}