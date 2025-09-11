import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  User, Job, Application, Candidate, Interview, ScreeningResult, 
  DashboardStats, AuthResponse, CreateJobDto, CreateApplicationDto, 
  CreateCandidateDto, LoginDto, RegisterDto 
} from '../models';

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
      ...(token && { Authorization: `Bearer ${token}` })
    });
  }

  // Auth endpoints
  login(credentials: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, credentials);
  }

  register(userData: RegisterDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, userData);
  }

  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/refresh`, {}, { headers: this.getHeaders() });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/logout`, {}, { headers: this.getHeaders() });
  }

  // Job endpoints
  getJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.baseUrl}/jobs`);
  }

  getJob(id: string): Observable<Job> {
    return this.http.get<Job>(`${this.baseUrl}/jobs/${id}`);
  }

  createJob(job: CreateJobDto): Observable<Job> {
    return this.http.post<Job>(`${this.baseUrl}/jobs`, job, { headers: this.getHeaders() });
  }

  updateJob(id: string, job: Partial<CreateJobDto>): Observable<Job> {
    return this.http.patch<Job>(`${this.baseUrl}/jobs/${id}`, job, { headers: this.getHeaders() });
  }

  deleteJob(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/jobs/${id}`, { headers: this.getHeaders() });
  }

  // Application endpoints
  getApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.baseUrl}/applications`, { headers: this.getHeaders() });
  }

  getJobApplications(jobId: string): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.baseUrl}/applications/job/${jobId}`, { headers: this.getHeaders() });
  }

  getApplication(id: string): Observable<Application> {
    return this.http.get<Application>(`${this.baseUrl}/applications/${id}`, { headers: this.getHeaders() });
  }

  createApplication(application: CreateApplicationDto): Observable<Application> {
    return this.http.post<Application>(`${this.baseUrl}/applications`, application, { headers: this.getHeaders() });
  }

  updateApplicationStatus(id: string, status: string): Observable<Application> {
    return this.http.patch<Application>(`${this.baseUrl}/applications/${id}/status`, { status }, { headers: this.getHeaders() });
  }

  // Candidate endpoints
  getCandidates(): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(`${this.baseUrl}/candidates`, { headers: this.getHeaders() });
  }

  getCandidate(id: string): Observable<Candidate> {
    return this.http.get<Candidate>(`${this.baseUrl}/candidates/${id}`, { headers: this.getHeaders() });
  }

  createCandidateProfile(candidate: CreateCandidateDto): Observable<Candidate> {
    return this.http.post<Candidate>(`${this.baseUrl}/candidates`, candidate, { headers: this.getHeaders() });
  }

  // Screening endpoints
  runScreening(applicationId: string): Observable<ScreeningResult> {
    return this.http.post<ScreeningResult>(`${this.baseUrl}/screening/run/${applicationId}`, {}, { headers: this.getHeaders() });
  }

  getScreeningResults(applicationId: string): Observable<ScreeningResult[]> {
    return this.http.get<ScreeningResult[]>(`${this.baseUrl}/screening/${applicationId}`, { headers: this.getHeaders() });
  }

  getJobScreeningResults(jobId: string): Observable<ScreeningResult[]> {
    return this.http.get<ScreeningResult[]>(`${this.baseUrl}/screening/job/${jobId}`, { headers: this.getHeaders() });
  }

  // Interview endpoints
  getInterviews(applicationId: string): Observable<Interview[]> {
    return this.http.get<Interview[]>(`${this.baseUrl}/interviews/${applicationId}`, { headers: this.getHeaders() });
  }

  scheduleInterview(interview: any): Observable<Interview> {
    return this.http.post<Interview>(`${this.baseUrl}/interviews`, interview, { headers: this.getHeaders() });
  }

  updateInterview(id: string, interview: any): Observable<Interview> {
    return this.http.put<Interview>(`${this.baseUrl}/interviews/${id}`, interview, { headers: this.getHeaders() });
  }

  cancelInterview(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/interviews/${id}`, { headers: this.getHeaders() });
  }

  // Dashboard endpoints
  getAdminDashboard(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/dashboard/admin`, { headers: this.getHeaders() });
  }

  getRecruiterDashboard(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/dashboard/recruiter`, { headers: this.getHeaders() });
  }

  getCandidateDashboard(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/dashboard/candidate`, { headers: this.getHeaders() });
  }

  // File upload
  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      ...(token && { Authorization: `Bearer ${token}` })
    });
    return this.http.post(`${this.baseUrl}/uploads`, formData, { headers });
  }
}