export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  resumeUrl: string;
  coverLetter?: string;
  status: ApplicationStatus;
  aiScore: number;
  skillsMatched: string[];
  experienceMatch: number;
  submittedAt: Date;
  updatedAt: Date;
  notes: ApplicationNote[];
  interviews: Interview[];
}

export enum ApplicationStatus {
  SUBMITTED = 'submitted',
  SCREENING = 'screening',
  REVIEWED = 'reviewed',
  SHORTLISTED = 'shortlisted',
  INTERVIEW_SCHEDULED = 'interview_scheduled',
  INTERVIEWED = 'interviewed',
  OFFER_EXTENDED = 'offer_extended',
  HIRED = 'hired',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn'
}

export interface ApplicationNote {
  id: string;
  applicationId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
}

export interface Interview {
  id: string;
  applicationId: string;
  type: InterviewType;
  scheduledAt: Date;
  duration: number;
  interviewers: string[];
  meetingLink?: string;
  status: InterviewStatus;
  feedback?: InterviewFeedback;
}

export enum InterviewType {
  PHONE_SCREENING = 'phone_screening',
  VIDEO_INTERVIEW = 'video_interview',
  TECHNICAL_INTERVIEW = 'technical_interview',
  FINAL_INTERVIEW = 'final_interview',
  ON_SITE = 'on_site'
}

export enum InterviewStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled'
}

export interface InterviewFeedback {
  rating: number;
  technicalSkills: number;
  communication: number;
  culturalFit: number;
  comments: string;
  recommendation: InterviewRecommendation;
}

export enum InterviewRecommendation {
  STRONG_YES = 'strong_yes',
  YES = 'yes',
  NO = 'no',
  STRONG_NO = 'strong_no'
}