import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
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
  applicationsCount?: number;
  viewsCount?: number;
}

export interface JobFilters {
  location?: string;
  department?: string;
  employmentType?: string;
  salaryMin?: number;
  salaryMax?: number;
  search?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class JobsService {
  private readonly apiUrl = `${environment.apiUrl}/jobs`;
  private jobsSubject = new BehaviorSubject<Job[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  public jobs$ = this.jobsSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  loadJobs(filters?: JobFilters): Observable<Job[]> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = (filters as any)[key];
        if (value !== null && value !== undefined && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<Job[]>(this.apiUrl, {
      headers: this.getAuthHeaders(),
      params
    }).pipe(
      tap(jobs => {
        this.jobsSubject.next(jobs);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        console.error('Error loading jobs:', error);
        this.errorSubject.next('Failed to load jobs');
        this.loadingSubject.next(false);
        return of([]);
      })
    );
  }

  getJob(id: string): Observable<Job | null> {
    return this.http.get<Job>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error fetching job:', error);
        return of(null);
      })
    );
  }

  createJob(jobData: Partial<Job>): Observable<Job | null> {
    this.loadingSubject.next(true);
    
    return this.http.post<Job>(this.apiUrl, jobData, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(job => {
        if (job) {
          const currentJobs = this.jobsSubject.value;
          this.jobsSubject.next([job, ...currentJobs]);
        }
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        console.error('Error creating job:', error);
        this.errorSubject.next('Failed to create job');
        this.loadingSubject.next(false);
        return of(null);
      })
    );
  }

  updateJob(id: string, jobData: Partial<Job>): Observable<Job | null> {
    this.loadingSubject.next(true);
    
    return this.http.patch<Job>(`${this.apiUrl}/${id}`, jobData, {
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
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        console.error('Error updating job:', error);
        this.errorSubject.next('Failed to update job');
        this.loadingSubject.next(false);
        return of(null);
      })
    );
  }

  deleteJob(id: string): Observable<boolean> {
    this.loadingSubject.next(true);
    
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => {
        const currentJobs = this.jobsSubject.value;
        this.jobsSubject.next(currentJobs.filter(job => job.id !== id));
        this.loadingSubject.next(false);
      }),
      map(() => true),
      catchError(error => {
        console.error('Error deleting job:', error);
        this.errorSubject.next('Failed to delete job');
        this.loadingSubject.next(false);
        return of(false);
      })
    );
  }

  searchJobs(query: string): Observable<Job[]> {
    const filters: JobFilters = { search: query };
    return this.loadJobs(filters);
  }

  getJobsByDepartment(department: string): Observable<Job[]> {
    const filters: JobFilters = { department };
    return this.loadJobs(filters);
  }

  getJobsByLocation(location: string): Observable<Job[]> {
    const filters: JobFilters = { location };
    return this.loadJobs(filters);
  }

  getActiveJobs(): Observable<Job[]> {
    const filters: JobFilters = { status: 'active' };
    return this.loadJobs(filters);
  }

  refreshJobs(): void {
    this.loadJobs().subscribe();
  }

  clearError(): void {
    this.errorSubject.next(null);
  }

  // Get cached jobs without making API call
  getCachedJobs(): Job[] {
    return this.jobsSubject.value;
  }

  // Get job from cache
  getCachedJob(id: string): Job | null {
    return this.jobsSubject.value.find(job => job.id === id) || null;
  }
}
