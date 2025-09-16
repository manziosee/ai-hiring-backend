import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  coverLetter: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  job?: {
    id: string;
    title: string;
    department: string;
    location: string;
  };
  candidate?: {
    id: string;
    fullName: string;
    email: string;
    skills: string[];
  };
  resumeUrl?: string;
  screeningScore?: number;
  interviewsCount?: number;
}

export interface ApplicationFilters {
  status?: string;
  jobId?: string;
  candidateId?: string;
  dateFrom?: string;
  dateTo?: string;
  department?: string;
}

export interface ApplicationStats {
  total: number;
  pending: number;
  reviewed: number;
  interviewed: number;
  hired: number;
  rejected: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {
  private readonly apiUrl = `${environment.apiUrl}/applications`;
  private applicationsSubject = new BehaviorSubject<Application[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);
  private statsSubject = new BehaviorSubject<ApplicationStats | null>(null);

  public applications$ = this.applicationsSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();
  public stats$ = this.statsSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  loadApplications(filters?: ApplicationFilters): Observable<Application[]> {
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

    return this.http.get<Application[]>(this.apiUrl, {
      headers: this.getAuthHeaders(),
      params
    }).pipe(
      tap(applications => {
        this.applicationsSubject.next(applications);
        this.updateStats(applications);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        console.error('Error loading applications:', error);
        this.errorSubject.next('Failed to load applications');
        this.loadingSubject.next(false);
        return of([]);
      })
    );
  }

  getApplication(id: string): Observable<Application | null> {
    return this.http.get<Application>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error fetching application:', error);
        return of(null);
      })
    );
  }

  getJobApplications(jobId: string): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/job/${jobId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error fetching job applications:', error);
        return of([]);
      })
    );
  }

  createApplication(applicationData: Partial<Application>): Observable<Application | null> {
    this.loadingSubject.next(true);
    
    return this.http.post<Application>(this.apiUrl, applicationData, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(application => {
        if (application) {
          const currentApplications = this.applicationsSubject.value;
          this.applicationsSubject.next([application, ...currentApplications]);
          this.updateStats([application, ...currentApplications]);
        }
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        console.error('Error creating application:', error);
        this.errorSubject.next('Failed to submit application');
        this.loadingSubject.next(false);
        return of(null);
      })
    );
  }

  updateApplicationStatus(id: string, status: string, notes?: string): Observable<Application | null> {
    this.loadingSubject.next(true);
    
    const updateData = { status, ...(notes && { notes }) };
    
    return this.http.patch<Application>(`${this.apiUrl}/${id}/status`, updateData, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(updatedApplication => {
        if (updatedApplication) {
          const currentApplications = this.applicationsSubject.value;
          const index = currentApplications.findIndex(app => app.id === id);
          if (index !== -1) {
            currentApplications[index] = updatedApplication;
            this.applicationsSubject.next([...currentApplications]);
            this.updateStats(currentApplications);
          }
        }
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        console.error('Error updating application status:', error);
        this.errorSubject.next('Failed to update application status');
        this.loadingSubject.next(false);
        return of(null);
      })
    );
  }

  bulkUpdateStatus(applicationIds: string[], status: string): Observable<boolean> {
    this.loadingSubject.next(true);
    
    const updatePromises = applicationIds.map(id => 
      this.updateApplicationStatus(id, status).toPromise()
    );

    return new Observable(observer => {
      Promise.all(updatePromises).then(results => {
        const success = results.every(result => result !== null);
        this.loadingSubject.next(false);
        observer.next(success);
        observer.complete();
      }).catch(error => {
        console.error('Error bulk updating applications:', error);
        this.errorSubject.next('Failed to update applications');
        this.loadingSubject.next(false);
        observer.next(false);
        observer.complete();
      });
    });
  }

  getApplicationsByStatus(status: string): Observable<Application[]> {
    const filters: ApplicationFilters = { status };
    return this.loadApplications(filters);
  }

  getPendingApplications(): Observable<Application[]> {
    return this.getApplicationsByStatus('pending');
  }

  getReviewedApplications(): Observable<Application[]> {
    return this.getApplicationsByStatus('reviewed');
  }

  getInterviewedApplications(): Observable<Application[]> {
    return this.getApplicationsByStatus('interviewed');
  }

  searchApplications(query: string): Observable<Application[]> {
    // Implement search logic based on candidate name, job title, etc.
    const currentApplications = this.applicationsSubject.value;
    const filtered = currentApplications.filter(app => 
      app.job?.title.toLowerCase().includes(query.toLowerCase()) ||
      app.candidate?.fullName.toLowerCase().includes(query.toLowerCase()) ||
      app.candidate?.email.toLowerCase().includes(query.toLowerCase())
    );
    return of(filtered);
  }

  private updateStats(applications: Application[]): void {
    const stats: ApplicationStats = {
      total: applications.length,
      pending: applications.filter(app => app.status === 'pending').length,
      reviewed: applications.filter(app => app.status === 'reviewed').length,
      interviewed: applications.filter(app => app.status === 'interviewed').length,
      hired: applications.filter(app => app.status === 'hired').length,
      rejected: applications.filter(app => app.status === 'rejected').length
    };
    this.statsSubject.next(stats);
  }

  refreshApplications(): void {
    this.loadApplications().subscribe();
  }

  clearError(): void {
    this.errorSubject.next(null);
  }

  // Get cached applications without making API call
  getCachedApplications(): Application[] {
    return this.applicationsSubject.value;
  }

  // Get application from cache
  getCachedApplication(id: string): Application | null {
    return this.applicationsSubject.value.find(app => app.id === id) || null;
  }

  // Get applications stats
  getStats(): ApplicationStats | null {
    return this.statsSubject.value;
  }
}
