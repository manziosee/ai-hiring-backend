import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ResumeSummary {
  keySkills: string[];
  experience: string;
  strengths: string[];
  matchScore: number;
  summary: string;
}

export interface RankedCandidate {
  id: string;
  matchScore: number;
  keyStrengths: string[];
  summary: string;
  candidate: any;
}

export interface SkillGapAnalysis {
  inDemandSkills: string[];
  hardToFillRoles: string[];
  averageTimeToHire: number;
  skillHeatmap: { [key: string]: { demand: number; supply: number } };
}

@Injectable({
  providedIn: 'root'
})
export class AiAnalysisService {
  private apiUrl = `${environment.apiUrl}/ai-analysis`;

  constructor(private http: HttpClient) {}

  getResumeSummary(applicationId: string): Observable<ResumeSummary> {
    return this.http.get<ResumeSummary>(`${this.apiUrl}/resume-summary/${applicationId}`)
      .pipe(catchError(this.handleError));
  }

  getRankedCandidates(jobId: string): Observable<RankedCandidate[]> {
    return this.http.get<RankedCandidate[]>(`${this.apiUrl}/rank-candidates/${jobId}`)
      .pipe(catchError(this.handleError));
  }

  getSkillGaps(): Observable<SkillGapAnalysis> {
    return this.http.get<SkillGapAnalysis>(`${this.apiUrl}/skill-gaps`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('AI Analysis Service Error:', error);
    return throwError(() => error);
  }
}