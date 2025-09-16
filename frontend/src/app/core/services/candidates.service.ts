import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Candidate {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  skills: string[];
  experience: string;
  education: string;
  resumeUrl?: string;
  profileSummary?: string;
  location?: string;
  expectedSalary?: string;
  availabilityDate?: string;
  createdAt: string;
  updatedAt?: string;
  applicationsCount?: number;
  interviewsCount?: number;
  averageScore?: number;
}

export interface CandidateFilters {
  skills?: string[];
  experience?: string;
  location?: string;
  education?: string;
  availabilityDate?: string;
  salaryRange?: string;
  search?: string;
}

export interface CandidateStats {
  total: number;
  active: number;
  hired: number;
  averageExperience: number;
  topSkills: { skill: string; count: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class CandidatesService {
  private readonly apiUrl = `${environment.apiUrl}/candidates`;
  private candidatesSubject = new BehaviorSubject<Candidate[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);
  private statsSubject = new BehaviorSubject<CandidateStats | null>(null);

  public candidates$ = this.candidatesSubject.asObservable();
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

  loadCandidates(filters?: CandidateFilters): Observable<Candidate[]> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = (filters as any)[key];
        if (value !== null && value !== undefined && value !== '') {
          if (Array.isArray(value)) {
            params = params.set(key, value.join(','));
          } else {
            params = params.set(key, value.toString());
          }
        }
      });
    }

    return this.http.get<Candidate[]>(this.apiUrl, {
      headers: this.getAuthHeaders(),
      params
    }).pipe(
      tap(candidates => {
        this.candidatesSubject.next(candidates);
        this.updateStats(candidates);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        console.error('Error loading candidates:', error);
        this.errorSubject.next('Failed to load candidates');
        this.loadingSubject.next(false);
        return of([]);
      })
    );
  }

  getCandidate(id: string): Observable<Candidate | null> {
    return this.http.get<Candidate>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error fetching candidate:', error);
        return of(null);
      })
    );
  }

  createCandidate(candidateData: Partial<Candidate>): Observable<Candidate | null> {
    this.loadingSubject.next(true);
    
    return this.http.post<Candidate>(this.apiUrl, candidateData, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(candidate => {
        if (candidate) {
          const currentCandidates = this.candidatesSubject.value;
          this.candidatesSubject.next([candidate, ...currentCandidates]);
          this.updateStats([candidate, ...currentCandidates]);
        }
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        console.error('Error creating candidate:', error);
        this.errorSubject.next('Failed to create candidate profile');
        this.loadingSubject.next(false);
        return of(null);
      })
    );
  }

  updateCandidate(id: string, candidateData: Partial<Candidate>): Observable<Candidate | null> {
    this.loadingSubject.next(true);
    
    return this.http.patch<Candidate>(`${this.apiUrl}/${id}`, candidateData, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(updatedCandidate => {
        if (updatedCandidate) {
          const currentCandidates = this.candidatesSubject.value;
          const index = currentCandidates.findIndex(candidate => candidate.id === id);
          if (index !== -1) {
            currentCandidates[index] = updatedCandidate;
            this.candidatesSubject.next([...currentCandidates]);
            this.updateStats(currentCandidates);
          }
        }
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        console.error('Error updating candidate:', error);
        this.errorSubject.next('Failed to update candidate profile');
        this.loadingSubject.next(false);
        return of(null);
      })
    );
  }

  searchCandidates(query: string): Observable<Candidate[]> {
    const filters: CandidateFilters = { search: query };
    return this.loadCandidates(filters);
  }

  getCandidatesBySkills(skills: string[]): Observable<Candidate[]> {
    const filters: CandidateFilters = { skills };
    return this.loadCandidates(filters);
  }

  getCandidatesByLocation(location: string): Observable<Candidate[]> {
    const filters: CandidateFilters = { location };
    return this.loadCandidates(filters);
  }

  getCandidatesByExperience(experience: string): Observable<Candidate[]> {
    const filters: CandidateFilters = { experience };
    return this.loadCandidates(filters);
  }

  uploadCandidateResume(candidateId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('candidateId', candidateId);
    
    return this.http.post(`${environment.apiUrl}/uploads/resume`, formData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    }).pipe(
      tap(response => {
        // Update candidate with resume URL
        if (response && (response as any).url) {
          const currentCandidates = this.candidatesSubject.value;
          const index = currentCandidates.findIndex(c => c.id === candidateId);
          if (index !== -1) {
            currentCandidates[index].resumeUrl = (response as any).url;
            this.candidatesSubject.next([...currentCandidates]);
          }
        }
      }),
      catchError(error => {
        console.error('Error uploading resume:', error);
        this.errorSubject.next('Failed to upload resume');
        return of(null);
      })
    );
  }

  downloadCandidateResume(filename: string): Observable<Blob | null> {
    return this.http.get(`${environment.apiUrl}/uploads/resume/${filename}`, {
      headers: this.getAuthHeaders(),
      responseType: 'blob'
    }).pipe(
      catchError(error => {
        console.error('Error downloading resume:', error);
        return of(null);
      })
    );
  }

  private updateStats(candidates: Candidate[]): void {
    const skillsMap = new Map<string, number>();
    let totalExperience = 0;
    let experienceCount = 0;

    candidates.forEach(candidate => {
      // Count skills
      candidate.skills.forEach(skill => {
        skillsMap.set(skill, (skillsMap.get(skill) || 0) + 1);
      });

      // Calculate average experience
      const expYears = this.extractExperienceYears(candidate.experience);
      if (expYears > 0) {
        totalExperience += expYears;
        experienceCount++;
      }
    });

    const topSkills = Array.from(skillsMap.entries())
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const stats: CandidateStats = {
      total: candidates.length,
      active: candidates.filter(c => c.applicationsCount && c.applicationsCount > 0).length,
      hired: candidates.filter(c => c.averageScore && c.averageScore > 80).length,
      averageExperience: experienceCount > 0 ? Math.round(totalExperience / experienceCount) : 0,
      topSkills
    };

    this.statsSubject.next(stats);
  }

  private extractExperienceYears(experience: string): number {
    const match = experience.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  refreshCandidates(): void {
    this.loadCandidates().subscribe();
  }

  clearError(): void {
    this.errorSubject.next(null);
  }

  // Get cached candidates without making API call
  getCachedCandidates(): Candidate[] {
    return this.candidatesSubject.value;
  }

  // Get candidate from cache
  getCachedCandidate(id: string): Candidate | null {
    return this.candidatesSubject.value.find(candidate => candidate.id === id) || null;
  }

  // Get candidates stats
  getStats(): CandidateStats | null {
    return this.statsSubject.value;
  }
}
