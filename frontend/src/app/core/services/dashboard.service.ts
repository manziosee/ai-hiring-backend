import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdminStats {
  totalUsers: number;
  totalJobs: number;
  totalApplications: number;
  activeRecruiters: number;
  systemHealth: number;
  pendingApplications: number;
  systemAlerts: number;
  recentActivity: any[];
}

export interface RecruiterStats {
  myActiveJobs: number;
  totalApplicationsReceived: number;
  interviewsScheduled: number;
  candidatesHired: number;
  avgTimeToHire: number;
  topSkillsInDemand: string[];
  applicationConversionRate: number;
  pendingReviews: number;
  recentApplications: any[];
}

export interface CandidateStats {
  applicationsSubmitted: number;
  interviewsScheduled: number;
  jobsViewed: number;
  profileViews: number;
  skillMatchScore: number;
  recommendedJobs: number;
  applicationResponseRate: number;
  applicationsByStatus: any;
  recentJobs: any[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getAdminStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.apiUrl}/admin`);
  }

  getRecruiterStats(): Observable<RecruiterStats> {
    return this.http.get<RecruiterStats>(`${this.apiUrl}/recruiter`);
  }

  getCandidateStats(): Observable<CandidateStats> {
    return this.http.get<CandidateStats>(`${this.apiUrl}/candidate`);
  }

  getDashboardStats(role: string): Observable<AdminStats | RecruiterStats | CandidateStats> {
    switch (role) {
      case 'ADMIN':
        return this.getAdminStats();
      case 'RECRUITER':
        return this.getRecruiterStats();
      case 'CANDIDATE':
        return this.getCandidateStats();
      default:
        throw new Error(`Unknown role: ${role}`);
    }
  }
}
