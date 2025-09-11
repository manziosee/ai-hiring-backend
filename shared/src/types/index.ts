// User Types
export enum UserRole {
  ADMIN = 'ADMIN',
  RECRUITER = 'RECRUITER',
  CANDIDATE = 'CANDIDATE'
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// Job Types
export interface Job {
  id: string;
  title: string;
  description: string;
  skills: string[];
  experience: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

// Application Types
export enum ApplicationStatus {
  PENDING = 'PENDING',
  SUBMITTED = 'SUBMITTED',
  SCREENING = 'SCREENING',
  INTERVIEW = 'INTERVIEW',
  OFFER = 'OFFER',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

export interface Application {
  id: string;
  status: ApplicationStatus;
  coverLetter?: string;
  createdAt: Date;
  updatedAt: Date;
  jobId: string;
  candidateId: string;
  userId: string;
}

// Dashboard Types
export interface AdminDashboard {
  stats: {
    totalUsers: number;
    totalJobs: number;
    totalApplications: number;
    usersByRole: Record<UserRole, number>;
  };
  recentUsers: User[];
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}