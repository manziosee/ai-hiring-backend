import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ApiUser {
  id: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'RECRUITER' | 'CANDIDATE';
}

export interface AuthResponse {
  access_token: string;
  user: ApiUser;
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
  createdAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  coverLetter: string;
  status: string;
  createdAt: string;
  job?: Job;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    });
  }

  // Auth endpoints
  register(userData: any): Observable<AuthResponse> {
    console.log('ApiService.register called');
    console.log('API URL:', `${this.baseUrl}/auth/register`);
    console.log('User data:', userData);
    return this.http.post<AuthResponse>(
      `${this.baseUrl}/auth/register`,
      userData,
    );
  }

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.baseUrl}/auth/login`,
      credentials,
    );
  }

  // Job endpoints
  getJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.baseUrl}/jobs`);
  }

  getJob(id: string): Observable<Job> {
    return this.http.get<Job>(`${this.baseUrl}/jobs/${id}`, {
      headers: this.getHeaders(),
    });
  }

  createJob(jobData: any): Observable<Job> {
    return this.http.post<Job>(`${this.baseUrl}/jobs`, jobData, {
      headers: this.getHeaders(),
    });
  }

  // Application endpoints
  applyForJob(applicationData: any): Observable<Application> {
    return this.http.post<Application>(
      `${this.baseUrl}/applications`,
      applicationData,
      { headers: this.getHeaders() },
    );
  }

  createApplication(applicationData: any): Observable<Application> {
    return this.http.post<Application>(
      `${this.baseUrl}/applications`,
      applicationData,
      { headers: this.getHeaders() },
    );
  }

  getApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.baseUrl}/applications`, {
      headers: this.getHeaders(),
    });
  }

  updateApplicationStatus(
    applicationId: string,
    status: string,
  ): Observable<Application> {
    return this.http.patch<Application>(
      `${this.baseUrl}/applications/${applicationId}/status`,
      { status },
      { headers: this.getHeaders() },
    );
  }

  // Job management
  deleteJob(jobId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/jobs/${jobId}`, {
      headers: this.getHeaders(),
    });
  }

  // Screening
  runScreening(applicationId: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/screening/run/${applicationId}`,
      {},
      { headers: this.getHeaders() },
    );
  }

  getScreeningResults(applicationId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/screening/${applicationId}`, {
      headers: this.getHeaders(),
    });
  }

  getJobScreeningResults(jobId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/screening/job/${jobId}`, {
      headers: this.getHeaders(),
    });
  }

  // Analytics
  getHiringFunnelReport(): Observable<any> {
    return this.http.get(`${this.baseUrl}/analytics/hiring-funnel`, {
      headers: this.getHeaders(),
    });
  }

  // Candidates
  getCandidates(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/candidates`, {
      headers: this.getHeaders(),
    });
  }

  getCandidate(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/candidates/${id}`, {
      headers: this.getHeaders(),
    });
  }

  createCandidate(candidateData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/candidates`, candidateData, {
      headers: this.getHeaders(),
    });
  }

  // Interviews
  scheduleInterview(interviewData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/interviews`, interviewData, {
      headers: this.getHeaders(),
    });
  }

  getInterviews(applicationId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/interviews/${applicationId}`, {
      headers: this.getHeaders(),
    });
  }

  updateInterview(id: string, interviewData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/interviews/${id}`, interviewData, {
      headers: this.getHeaders(),
    });
  }

  cancelInterview(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/interviews/${id}`, {
      headers: this.getHeaders(),
    });
  }

  // File Uploads
  uploadResume(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/uploads/resume`, formData, {
      headers: this.getHeaders(),
    });
  }

  uploadJobDescription(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/uploads/job-description`, formData, {
      headers: this.getHeaders(),
    });
  }

  downloadResume(filename: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/uploads/resume/${filename}`, {
      headers: this.getHeaders(),
      responseType: 'blob',
    });
  }

  // Audit
  getAuditLogs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/audit/logs`, {
      headers: this.getHeaders(),
    });
  }

  getUserAuditLogs(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/audit/user/${userId}`, {
      headers: this.getHeaders(),
    });
  }

  getResourceAuditLogs(
    resource: string,
    resourceId: string,
  ): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/audit/resource/${resource}/${resourceId}`,
      { headers: this.getHeaders() },
    );
  }

  // Users
  getUsers(): Observable<ApiUser[]> {
    return this.http.get<ApiUser[]>(`${this.baseUrl}/users`, {
      headers: this.getHeaders(),
    });
  }

  getUser(id: string): Observable<ApiUser> {
    return this.http.get<ApiUser>(`${this.baseUrl}/users/${id}`, {
      headers: this.getHeaders(),
    });
  }

  updateUser(id: string, userData: any): Observable<ApiUser> {
    return this.http.patch<ApiUser>(`${this.baseUrl}/users/${id}`, userData, {
      headers: this.getHeaders(),
    });
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${id}`, {
      headers: this.getHeaders(),
    });
  }

  // Health
  getHealth(): Observable<any> {
    return this.http.get(`${this.baseUrl}/health`);
  }

  getHealthMetrics(): Observable<any> {
    return this.http.get(`${this.baseUrl}/health/metrics`);
  }

  // Auth additional endpoints
  logout(): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/auth/logout`,
      {},
      { headers: this.getHeaders() },
    );
  }

  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.baseUrl}/auth/refresh`,
      {},
      { headers: this.getHeaders() },
    );
  }

  // Dashboard endpoints
  getDashboard(role: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard/${role.toLowerCase()}`, {
      headers: this.getHeaders(),
    });
  }

  getAdminDashboard(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard/admin`, {
      headers: this.getHeaders(),
    });
  }

  getRecruiterDashboard(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard/recruiter`, {
      headers: this.getHeaders(),
    });
  }

  getCandidateDashboard(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard/candidate`, {
      headers: this.getHeaders(),
    });
  }

  // User endpoints
  getCurrentUser(): Observable<ApiUser> {
    return this.http.get<ApiUser>(`${this.baseUrl}/users/me`, {
      headers: this.getHeaders(),
    });
  }

  // Dashboard analytics
  getDashboardAnalytics(): Observable<any> {
    return this.http.get(`${this.baseUrl}/analytics/dashboard`, {
      headers: this.getHeaders(),
    });
  }

  // User activity
  getUserActivity(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/audit-logs/user-activity`, {
      headers: this.getHeaders(),
    });
  }
}
