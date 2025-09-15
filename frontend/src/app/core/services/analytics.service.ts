import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DashboardMetrics {
  totalJobs: number;
  totalApplications: number;
  totalCandidates: number;
  totalInterviews: number;
  applicationStatusBreakdown: {
    status: string;
    count: number;
    percentage: number;
  }[];
  screeningSuccessRate: number;
  averageFitScore: number;
  topSkills: {
    skill: string;
    count: number;
  }[];
}

export interface HiringFunnelReport {
  stages: {
    stage: string;
    count: number;
    percentage: number;
    conversionRate?: number;
  }[];
  totalApplications: number;
  overallConversionRate: number;
}

export interface JobAnalytics {
  jobId: string;
  jobTitle: string;
  totalApplications: number;
  screeningResults: {
    status: string;
    count: number;
    percentage: number;
  }[];
  averageFitScore: number;
  topSkills: {
    skill: string;
    count: number;
  }[];
}

export interface UserAnalytics {
  userId: string;
  totalApplications: number;
  totalInterviews: number;
  applicationStatusBreakdown: {
    status: string;
    count: number;
    percentage: number;
  }[];
  averageFitScore: number;
}

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private readonly apiUrl = `${environment.apiUrl}/analytics`;

  constructor(private http: HttpClient) {}

  getDashboardMetrics(period: string = '30d'): Observable<DashboardMetrics> {
    const params = new HttpParams().set('period', period);
    return this.http.get<DashboardMetrics>(`${this.apiUrl}/dashboard`, {
      params,
    });
  }

  getHiringFunnelReport(
    period: string = '30d',
  ): Observable<HiringFunnelReport> {
    const params = new HttpParams().set('period', period);
    return this.http.get<HiringFunnelReport>(`${this.apiUrl}/hiring-funnel`, {
      params,
    });
  }

  getJobAnalytics(
    jobId: string,
    period: string = '30d',
  ): Observable<JobAnalytics> {
    const params = new HttpParams().set('period', period);
    return this.http.get<JobAnalytics>(`${this.apiUrl}/jobs/${jobId}`, {
      params,
    });
  }

  getUserAnalytics(
    userId: string,
    period: string = '30d',
  ): Observable<UserAnalytics> {
    const params = new HttpParams().set('period', period);
    return this.http.get<UserAnalytics>(`${this.apiUrl}/users/${userId}`, {
      params,
    });
  }
}
