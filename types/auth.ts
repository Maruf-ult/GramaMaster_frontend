export type CurriculumType = "SSC" | "HSC" | "Dakhil";
export type StudyGroup = "Science" | "Arts" | "BusinessStudies";
export type EducationBoard = 
  | "Dhaka" 
  | "Chattogram" 
  | "Rajshahi" 
  | "Jashore" 
  | "Cumilla" 
  | "Barisal" 
  | "Sylhet" 
  | "Dinajpur" 
  | "Mymensingh" 
  | "Madrasah" 
  | "Technical";

export interface User {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  profileImageUrl?: string;
}

export interface RegisterStudentRequest extends User {
  institutionName: string;
  curriculumType: CurriculumType;
  group: StudyGroup;
  examBatchYear: number;
  board: EducationBoard;
}

export interface RegisterTeacherRequest extends User {
  sscResult: number;
  sscGroup: StudyGroup;
  sscBoard: EducationBoard;
  hscResult: number;
  hscGroup: StudyGroup;
  hscBoard: EducationBoard;
  department: string;
  university: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export type UserRole = "Student" | "Teacher" | "Admin";

export interface LoginResponseDto {
  userId: string;
  fullName: string;
  email: string;
  profileImageUrl?: string;
  role: UserRole;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}
