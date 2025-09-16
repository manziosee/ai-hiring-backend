import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface InterviewSlot {
  time: Date;
  available: boolean;
  duration: number;
}

export interface Interview {
  id: string;
  applicationId: string;
  interviewerId: string;
  scheduledAt: Date;
  type: 'PHONE' | 'VIDEO' | 'IN_PERSON';
  duration: number;
  status: string;
  application: any;
  interviewer: any;
}

@Injectable({
  providedIn: 'root'
})
export class InterviewSchedulingService {
  private apiUrl = `${environment.apiUrl}/interview-scheduling`;

  constructor(private http: HttpClient) {}

  scheduleInterview(data: {
    applicationId: string;
    interviewerId: string;
    scheduledAt: string;
    type: 'PHONE' | 'VIDEO' | 'IN_PERSON';
    duration: number;
  }): Observable<Interview> {
    return this.http.post<Interview>(`${this.apiUrl}/schedule`, data);
  }

  getAvailableSlots(interviewerId: string, date: string): Observable<InterviewSlot[]> {
    return this.http.get<InterviewSlot[]>(`${this.apiUrl}/available-slots/${interviewerId}?date=${date}`);
  }

  getMyInterviews(): Observable<Interview[]> {
    return this.http.get<Interview[]>(`${this.apiUrl}/my-interviews`);
  }
}