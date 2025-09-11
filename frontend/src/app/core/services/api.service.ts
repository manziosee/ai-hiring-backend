import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'RECRUITER' | 'CANDIDATE';
}

export interface AuthResponse {
  access_token: string;
  user: User;
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
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
  }

  // Auth endpoints
  register(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, userData);
  }

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, credentials);
  }

  // Job endpoints
  getJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.baseUrl}/jobs`);
  }

  getJob(id: string): Observable<Job> {
    return this.http.get<Job>(`${this.baseUrl}/jobs/${id}`, { headers: this.getHeaders() });
  }

  createJob(jobData: any): Observable<Job> {
    return this.http.post<Job>(`${this.baseUrl}/jobs`, jobData, { headers: this.getHeaders() });
  }

  // Application endpoints
  applyForJob(applicationData: any): Observable<Application> {
    return this.http.post<Application>(`${this.baseUrl}/applications`, applicationData, { headers: this.getHeaders() });
  }

  createApplication(applicationData: any): Observable<Application> {
    return this.http.post<Application>(`${this.baseUrl}/applications`, applicationData, { headers: this.getHeaders() });
  }

  getApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.baseUrl}/applications`, { headers: this.getHeaders() });
  }

  updateApplicationStatus(applicationId: string, status: string): Observable<Application> {
    return this.http.patch<Application>(`${this.baseUrl}/applications/${applicationId}/status`, { status }, { headers: this.getHeaders() });
  }

  // Job management
  deleteJob(jobId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/jobs/${jobId}`, { headers: this.getHeaders() });
  }

  // Screening
  runScreening(applicationId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/screening/run/${applicationId}`, {}, { headers: this.getHeaders() });
  }

  // Dashboard endpoints
  getDashboard(role: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard/${role.toLowerCase()}`, { headers: this.getHeaders() });
  }

  getAdminDashboard(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard/admin`, { headers: this.getHeaders() });
  }

  getRecruiterDashboard(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard/recruiter`, { headers: this.getHeaders() });
  }

  getCandidateDashboard(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard/candidate`, { headers: this.getHeaders() });
  }

  // User endpoints
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/me`, { headers: this.getHeaders() });
  }
}