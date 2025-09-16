import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, forkJoin, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

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
  updatedAt?: string;
  status?: string;
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  coverLetter: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  job?: Job;
  candidate?: any;
  resumeUrl?: string;
}

export interface Candidate {
  id: string;
  userId: string;
  skills: string[];
  experience: string;
  education: string;
  resumeUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Interview {
  id: string;
  applicationId: string;
  scheduledAt: string;
  duration: number;
  type: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ScreeningResult {
  id: string;
  applicationId: string;
  overallScore: number;
  technicalScore: number;
  experienceScore: number;
  culturalFitScore: number;
  recommendations: string[];
  status: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataIntegrationService {
  private readonly apiUrl = environment.apiUrl;
  private readonly headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  // Data caches
  private jobsSubject = new BehaviorSubject<Job[]>([]);
  private applicationsSubject = new BehaviorSubject<Application[]>([]);
  private candidatesSubject = new BehaviorSubject<Candidate[]>([]);

  public jobs$ = this.jobsSubject.asObservable();
  public applications$ = this.applicationsSubject.asObservable();
  public candidates$ = this.candidatesSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    });
  }

  // Jobs API
  getJobs(params?: any): Observable<Job[]> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }

    return this.http.get<Job[]>(`${this.apiUrl}/jobs`, {
      headers: this.getAuthHeaders(),
      params: httpParams
    }).pipe(
      tap(jobs => this.jobsSubject.next(jobs)),
      catchError(error => {
        console.error('Error fetching jobs:', error);
        return of([]);
      })
    );
  }

  getJob(id: string): Observable<Job | null> {
    return this.http.get<Job>(`${this.apiUrl}/jobs/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error fetching job:', error);
        return of(null);
      })
    );
  }

  createJob(jobData: Partial<Job>): Observable<Job | null> {
    return this.http.post<Job>(`${this.apiUrl}/jobs`, jobData, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(job => {
        if (job) {
          const currentJobs = this.jobsSubject.value;
          this.jobsSubject.next([...currentJobs, job]);
        }
      }),
      catchError(error => {
        console.error('Error creating job:', error);
        return of(null);
      })
    );
  }

  updateJob(id: string, jobData: Partial<Job>): Observable<Job | null> {
    return this.http.patch<Job>(`${this.apiUrl}/jobs/${id}`, jobData, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(updatedJob => {
        if (updatedJob) {
          const currentJobs = this.jobsSubject.value;
          const index = currentJobs.findIndex(job => job.id === id);
          if (index !== -1) {
            currentJobs[index] = updatedJob;
            this.jobsSubject.next([...currentJobs]);
          }
        }
      }),
      catchError(error => {
        console.error('Error updating job:', error);
        return of(null);
      })
    );
  }

  deleteJob(id: string): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/jobs/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => {
        const currentJobs = this.jobsSubject.value;
        this.jobsSubject.next(currentJobs.filter(job => job.id !== id));
      }),
      map(() => true),
      catchError(error => {
        console.error('Error deleting job:', error);
        return of(false);
      })
    );
  }

  // Applications API
  getApplications(params?: any): Observable<Application[]> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }

    return this.http.get<Application[]>(`${this.apiUrl}/applications`, {
      headers: this.getAuthHeaders(),
      params: httpParams
    }).pipe(
      tap(applications => this.applicationsSubject.next(applications)),
      catchError(error => {
        console.error('Error fetching applications:', error);
        return of([]);
      })
    );
  }

  getApplication(id: string): Observable<Application | null> {
    return this.http.get<Application>(`${this.apiUrl}/applications/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error fetching application:', error);
        return of(null);
      })
    );
  }

  getJobApplications(jobId: string): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/applications/job/${jobId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error fetching job applications:', error);
        return of([]);
      })
    );
  }

  createApplication(applicationData: Partial<Application>): Observable<Application | null> {
    return this.http.post<Application>(`${this.apiUrl}/applications`, applicationData, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(application => {
        if (application) {
          const currentApplications = this.applicationsSubject.value;
          this.applicationsSubject.next([...currentApplications, application]);
        }
      }),
      catchError(error => {
        console.error('Error creating application:', error);
        return of(null);
      })
    );
  }

  updateApplicationStatus(id: string, status: string): Observable<Application | null> {
    return this.http.patch<Application>(`${this.apiUrl}/applications/${id}/status`, { status }, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(updatedApplication => {
        if (updatedApplication) {
          const currentApplications = this.applicationsSubject.value;
          const index = currentApplications.findIndex(app => app.id === id);
          if (index !== -1) {
            currentApplications[index] = updatedApplication;
            this.applicationsSubject.next([...currentApplications]);
          }
        }
      }),
      catchError(error => {
        console.error('Error updating application status:', error);
        return of(null);
      })
    );
  }

  // Candidates API
  getCandidates(params?: any): Observable<Candidate[]> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }

    return this.http.get<Candidate[]>(`${this.apiUrl}/candidates`, {
      headers: this.getAuthHeaders(),
      params: httpParams
    }).pipe(
      tap(candidates => this.candidatesSubject.next(candidates)),
      catchError(error => {
        console.error('Error fetching candidates:', error);
        return of([]);
      })
    );
  }

  getCandidate(id: string): Observable<Candidate | null> {
    return this.http.get<Candidate>(`${this.apiUrl}/candidates/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error fetching candidate:', error);
        return of(null);
      })
    );
  }

  createCandidate(candidateData: Partial<Candidate>): Observable<Candidate | null> {
    return this.http.post<Candidate>(`${this.apiUrl}/candidates`, candidateData, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(candidate => {
        if (candidate) {
          const currentCandidates = this.candidatesSubject.value;
          this.candidatesSubject.next([...currentCandidates, candidate]);
        }
      }),
      catchError(error => {
        console.error('Error creating candidate:', error);
        return of(null);
      })
    );
  }

  // Interviews API
  getInterviews(applicationId: string): Observable<Interview[]> {
    return this.http.get<Interview[]>(`${this.apiUrl}/interviews/${applicationId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error fetching interviews:', error);
        return of([]);
      })
    );
  }

  scheduleInterview(interviewData: Partial<Interview>): Observable<Interview | null> {
    return this.http.post<Interview>(`${this.apiUrl}/interviews`, interviewData, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error scheduling interview:', error);
        return of(null);
      })
    );
  }

  updateInterview(id: string, interviewData: Partial<Interview>): Observable<Interview | null> {
    return this.http.put<Interview>(`${this.apiUrl}/interviews/${id}`, interviewData, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error updating interview:', error);
        return of(null);
      })
    );
  }

  cancelInterview(id: string): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/interviews/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(() => true),
      catchError(error => {
        console.error('Error canceling interview:', error);
        return of(false);
      })
    );
  }

  // Screening API
  runScreening(applicationId: string): Observable<ScreeningResult | null> {
    return this.http.post<ScreeningResult>(`${this.apiUrl}/screening/run/${applicationId}`, {}, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error running screening:', error);
        return of(null);
      })
    );
  }

  getScreeningResults(applicationId: string): Observable<ScreeningResult | null> {
    return this.http.get<ScreeningResult>(`${this.apiUrl}/screening/${applicationId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error fetching screening results:', error);
        return of(null);
      })
    );
  }

  getJobScreeningResults(jobId: string): Observable<ScreeningResult[]> {
    return this.http.get<ScreeningResult[]>(`${this.apiUrl}/screening/job/${jobId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error fetching job screening results:', error);
        return of([]);
      })
    );
  }

  // File Upload API
  uploadResume(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post(`${this.apiUrl}/uploads/resume`, formData, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      })
    }).pipe(
      catchError(error => {
        console.error('Error uploading resume:', error);
        return of(null);
      })
    );
  }

  uploadJobDescription(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post(`${this.apiUrl}/uploads/job-description`, formData, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      })
    }).pipe(
      catchError(error => {
        console.error('Error uploading job description:', error);
        return of(null);
      })
    );
  }

  downloadResume(filename: string): Observable<Blob | null> {
    return this.http.get(`${this.apiUrl}/uploads/resume/${filename}`, {
      headers: this.getAuthHeaders(),
      responseType: 'blob'
    }).pipe(
      catchError(error => {
        console.error('Error downloading resume:', error);
        return of(null);
      })
    );
  }

  // Utility methods
  refreshAllData(): Observable<any> {
    return forkJoin({
      jobs: this.getJobs(),
      applications: this.getApplications(),
      candidates: this.getCandidates()
    }).pipe(
      catchError(error => {
        console.error('Error refreshing data:', error);
        return of({ jobs: [], applications: [], candidates: [] });
      })
    );
  }

  clearCache(): void {
    this.jobsSubject.next([]);
    this.applicationsSubject.next([]);
    this.candidatesSubject.next([]);
  }
}
