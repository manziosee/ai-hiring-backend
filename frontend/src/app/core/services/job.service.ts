import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  salary: string;
  requirements: string[];
  benefits: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  candidateId: string;
  status: 'PENDING' | 'REVIEWING' | 'INTERVIEW' | 'ACCEPTED' | 'REJECTED';
  appliedAt: string;
  resumeUrl?: string;
  coverLetter?: string;
}

@Injectable({
  providedIn: 'root'
})
export class JobService {
  constructor(private apiService: ApiService) {}

  getJobs(params?: any): Observable<Job[]> {
    return this.apiService.get<Job[]>('/jobs', params);
  }

  getJob(id: string): Observable<Job> {
    return this.apiService.get<Job>(`/jobs/${id}`);
  }

  createJob(job: Partial<Job>): Observable<Job> {
    return this.apiService.post<Job>('/jobs', job);
  }

  updateJob(id: string, job: Partial<Job>): Observable<Job> {
    return this.apiService.put<Job>(`/jobs/${id}`, job);
  }

  deleteJob(id: string): Observable<void> {
    return this.apiService.delete<void>(`/jobs/${id}`);
  }

  applyToJob(jobId: string, application: Partial<JobApplication>): Observable<JobApplication> {
    return this.apiService.post<JobApplication>(`/jobs/${jobId}/apply`, application);
  }

  getApplications(jobId?: string): Observable<JobApplication[]> {
    const endpoint = jobId ? `/jobs/${jobId}/applications` : '/applications';
    return this.apiService.get<JobApplication[]>(endpoint);
  }

  updateApplicationStatus(applicationId: string, status: string): Observable<JobApplication> {
    return this.apiService.patch<JobApplication>(`/applications/${applicationId}`, { status });
  }
}