
export type CurriculumType = "SSC"|"HSC"|"Dakhil";
export type StudyGroup =  "Science" | "Arts" | "BusinessStudies";
export type EducationBoard =   "Dhaka" | "Chattogram" | "Rajshahi" | "Jashore" | "Cumilla" |
  "Barisal" | "Sylhet" | "Dinajpur" | "Mymensingh" | "Madrasah" | "Technical";

interface User{
    FullName:string;
    Email:string;
    Password:string;
    ConfirmPassword:string;
    ProfileImageUrl?:string;
}


export interface RegisterStudentRequest extends User{ 
     InstitutionName:string;
     CurriculumType :CurriculumType;
     Group:StudyGroup; 
    ExamBatchYear:number;
    Board: EducationBoard;  
}

export interface RegisterTeacherRequest extends User{
    SscResult:number;
    SscGroup:StudyGroup;
    SscBoard:EducationBoard;
    HscResult:number;
    HscGroup:StudyGroup;
    HscBoard:EducationBoard;
    Department:string;
    University:string;
}

export interface LoginRequest{
    Email:string;
    Password:string;
}

export interface ForgotPasswordRequest{
    Email:string;
}

export interface ChangePasswordRequest{
    CurrentPassword:string;
    NewPassword:string;
    ConfirmPassword:string;
}

export interface ResetPasswordRequest{
    Email:string;
    Token:string;
    NewPassword:string;
    ConfirmPassword:string;
}

export type UserRole = "Student" | "Teacher" | "Admin";

export interface LoginResponseDto{
    UserId:string;
    FullName:string;
    Email:string;
    ProfileImageUrl?:string;
    Role:UserRole;
    AccessToken:string;
    RefreshToken:string;
    ExpiresAt:Date;
}