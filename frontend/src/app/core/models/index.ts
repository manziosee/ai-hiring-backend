export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'RECRUITER' | 'CANDIDATE';
}

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string;
  location: string;
  salaryRange: string;
  employmentType: string;
  department: string;
  company?: string;
  createdAt: string;
  experience?: number;
  skills?: string[];
  _count?: {
    applications: number;
  };
}

export interface CreateApplicationDto {
  jobId: string;
  coverLetter: string;
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  coverLetter: string;
  status: string;
  createdAt: string;
  job?: Job;
  candidate?: {
    name: string;
  };
}

export interface DashboardStats {
  totalUsers?: number;
  totalJobs?: number;
  totalApplications?: number;
  totalCandidates?: number;
  recentApplications?: Application[];
  topJobs?: Job[];
  screeningResults?: any[];
}