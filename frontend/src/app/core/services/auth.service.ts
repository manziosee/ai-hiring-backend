import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService, User, AuthResponse } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    if (token && user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  register(userData: any): Observable<AuthResponse> {
    return this.apiService.register(userData).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  login(credentials: any): Observable<AuthResponse> {
    return this.apiService.login(credentials).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  private handleAuthSuccess(response: AuthResponse): void {
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  isRecruiter(): boolean {
    return this.hasRole('RECRUITER');
  }

  isCandidate(): boolean {
    return this.hasRole('CANDIDATE');
  }
}