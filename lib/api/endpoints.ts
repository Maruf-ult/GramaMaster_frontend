export const apiEndpoints = {
  ai: {
    generateQuestions: "/api/AI/generate-questions" as const,
    explainAnswer: (answerSubmissionId: string) => `/api/AI/explain-answer/${answerSubmissionId}` as const,
    weakTopics: "/api/AI/weak-topics" as const,
    recommendations: "/api/AI/recommendations" as const
  },
  analytics: {
    adminDashboard: "/api/Analytics/admin-dashboard" as const,
    topics: "/api/Analytics/topics" as const,
    performanceTrend: "/api/Analytics/performance-trend" as const,
    monthlyProgress: "/api/Analytics/monthly-progress" as const
  },
  auth: {
    registerStudent: "/api/Auth/register/student" as const,
    registerTeacher: "/api/Auth/register/teacher" as const,
    login: "/api/Auth/login" as const,
    changePassword: "/api/Auth/change-password" as const,
    forgotPassword: "/api/Auth/forgot-password" as const,
    resetPassword: "/api/Auth/reset-password" as const,
    refreshToken: "/api/Auth/refresh-token" as const
  },
  chat: {
    message: "/api/Chat/message" as const,
    history: "/api/Chat/history" as const,
    session: (sessionId: string) => `/api/Chat/session/${sessionId}` as const
  },
  contests: {
    create: "/api/Contests" as const,
    update: (id: string) => `/api/Contests/${id}` as const,
    delete: (id: string) => `/api/Contests/${id}` as const,
    getById: (id: string) => `/api/Contests/${id}` as const,
    global: "/api/Contests/global" as const,
    teacher: "/api/Contests/teacher" as const,
    studentAvailable: "/api/Contests/student/available" as const,
    leaderboard: (id: string) => `/api/Contests/${id}/leaderboard` as const,
    analytics: (id: string) => `/api/Contests/${id}/analytics` as const
  },
  curriculumns: {
    getAll: "/api/Curriculumns" as const,
    getById: (id: string) => `/api/Curriculumns/${id}` as const
  },
  exams: {
    start: "/api/Exams/start" as const,
    submit: "/api/Exams/submit" as const,
    attempt: (attemptId: string) => `/api/Exams/attempt/${attemptId}` as const,
    leaderboard: (contestId: string) => `/api/Exams/leaderboard/${contestId}` as const,
    review: (attemptId: string) => `/api/Exams/attempt/${attemptId}/review` as const
  },
  grammars: {
    create: "/api/Grammars" as const,
    update: (id: string) => `/api/Grammars/${id}` as const,
    delete: (id: string) => `/api/Grammars/${id}` as const,
    getById: (id: string) => `/api/Grammars/${id}` as const,
    topic: (topicId: string) => `/api/Grammars/topic/${topicId}` as const
  },
  practices: {
    start: "/api/Practices/start" as const,
    submit: "/api/Practices/submit" as const,
    history: "/api/Practices/history" as const
  },
  problems: {
    create: "/api/Problems" as const,
    update: (problemId: string) => `/api/Problems/${problemId}` as const,
    delete: (problemId: string) => `/api/Problems/${problemId}` as const,
    getById: (problemId: string) => `/api/Problems/${problemId}` as const,
    contest: (contestId: string) => `/api/Problems/contest/${contestId}` as const,
    teacher: "/api/Problems/teacher" as const,
    search: "/api/Problems/search" as const,
    practice: "/api/Problems/practice" as const
  },
  students: {
    getProfile: "/api/Students/profile" as const,
    updateProfile: "/api/Students/profile" as const,
    dashboard: "/api/Students/dashboard" as const,
    analytics: "/api/Students/analytics" as const,
    progress: "/api/Students/progress" as const,
    topicProgress: "/api/Students/topic-progress" as const
  },
  teachers: {
    getProfile: "/api/Teachers/profile" as const,
    updateProfile: "/api/Teachers/profile" as const,
    dashboard: "/api/Teachers/dashboard" as const,
    analytics: "/api/Teachers/analytics" as const
  },
  teams: {
    create: "/api/Teams" as const,
    update: (teamId: string) => `/api/Teams/${teamId}` as const,
    delete: (teamId: string) => `/api/Teams/${teamId}` as const,
    getById: (teamId: string) => `/api/Teams/${teamId}` as const,
    teacher: "/api/Teams/teacher" as const,
    student: "/api/Teams/student" as const,
    join: "/api/Teams/join" as const,
    members: (teamId: string) => `/api/Teams/${teamId}/members` as const,
    removeStudent: (teamId: string, studentId: string) => `/api/Teams/${teamId}/students/${studentId}` as const
  },
  topics: {
    create: "/api/Topics" as const,
    getAll: "/api/Topics" as const,
    update: (topicId: string) => `/api/Topics/${topicId}` as const,
    delete: (topicId: string) => `/api/Topics/${topicId}` as const,
    getById: (topicId: string) => `/api/Topics/${topicId}` as const,
    curriculum: (curriculumId: string) => `/api/Topics/curriculum/${curriculumId}` as const
  },
  users: {
    getById: (id: string) => `/api/Users/${id}` as const,
    getByEmail: (email: string) => `/api/Users/email/${email}` as const,
    exists: (email: string) => `/api/Users/exists/${email}` as const,
    getAll: "/api/Users" as const,
    getByRole: (role: string) => `/api/Users/role/${role}` as const,
    teachers: "/api/Users/teachers" as const,
    students: "/api/Users/students" as const,
    teacherProfile: (userId: string) => `/api/Users/${userId}/teacher-profile` as const,
    studentProfile: (userId: string) => `/api/Users/${userId}/student-profile` as const,
    updateStatus: (userId: string) => `/api/Users/${userId}/status` as const,
    delete: (userId: string) => `/api/Users/${userId}` as const
  }
} as const;

export type ApiEndpoints = typeof apiEndpoints;
