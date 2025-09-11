export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  skillsRequired: string[];
  salaryMin: number;
  salaryMax: number;
  currency: string;
  location: JobLocation;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  department: string;
  companyId: string;
  companyName: string;
  postedBy: string;
  status: JobStatus;
  applicationsCount: number;
  createdAt: Date;
  updatedAt: Date;
  closingDate?: Date;
}

export interface JobLocation {
  city: string;
  state: string;
  country: string;
  remote: boolean;
  hybrid: boolean;
}

export enum EmploymentType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  FREELANCE = 'freelance',
  INTERNSHIP = 'internship'
}

export enum ExperienceLevel {
  ENTRY = 'entry',
  MID = 'mid',
  SENIOR = 'senior',
  LEAD = 'lead',
  EXECUTIVE = 'executive'
}

export enum JobStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  PAUSED = 'paused',
  CLOSED = 'closed'
}