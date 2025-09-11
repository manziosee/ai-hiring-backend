export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'RECRUITER' | 'CANDIDATE';
  createdAt: string;
  updatedAt: string;
  candidateProfile?: Candidate;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  skills: string[];
  experience: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  creator?: User;
  applications?: Application[];
  _count?: {
    applications: number;
  };
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  resumeUrl?: string;
  skills: string[];
  yearsExp: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user?: User;
  applications?: Application[];
}

export interface Application {
  id: string;
  status: 'PENDING' | 'SUBMITTED' | 'SCREENING' | 'INTERVIEW' | 'OFFER' | 'ACCEPTED' | 'REJECTED';
  coverLetter?: string;
  createdAt: string;
  updatedAt: string;
  jobId: string;
  job?: Job;
  candidateId: string;
  candidate?: Candidate;
  userId: string;
  user?: User;
  screeningResults?: ScreeningResult[];
  interviews?: Interview[];
}

export interface ScreeningResult {
  id: string;
  stage: string;
  fitScore: number;
  details: any;
  createdAt: string;
  applicationId: string;
  application?: Application;
}

export interface Interview {
  id: string;
  scheduledAt: string;
  mode: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  applicationId: string;
  application?: Application;
  scheduledById: string;
  scheduledBy?: User;
}

export interface DashboardStats {
  totalJobs?: number;
  totalApplications?: number;
  totalCandidates?: number;
  totalUsers?: number;
  recentApplications?: Application[];
  topJobs?: Job[];
  screeningResults?: ScreeningResult[];
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface CreateJobDto {
  title: string;
  description: string;
  skills: string[];
  experience: number;
}

export interface CreateApplicationDto {
  jobId: string;
  coverLetter?: string;
}

export interface CreateCandidateDto {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  skills: string[];
  yearsExp: number;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
  role: 'ADMIN' | 'RECRUITER' | 'CANDIDATE';
}