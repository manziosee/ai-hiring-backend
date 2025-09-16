import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { User } from './core/models';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="app-container">
      <!-- Navigation Header -->
      <nav class="navbar" *ngIf="currentUser">
        <div class="nav-content">
          <div class="nav-brand">
            <div class="brand-logo">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              </svg>
            </div>
            <span>AI Hiring</span>
          </div>
          
          <div class="nav-links">
            <a routerLink="/dashboard" class="nav-link" [class.active]="isActive('/dashboard')">
              <i class="fas fa-tachometer-alt"></i>
              Dashboard
            </a>
            
            <a routerLink="/jobs" class="nav-link" [class.active]="isActive('/jobs')">
              <i class="fas fa-briefcase"></i>
              Jobs
            </a>
            
            <a routerLink="/applications" class="nav-link" [class.active]="isActive('/applications')" *ngIf="!authService.isRecruiter()">
              <i class="fas fa-file-alt"></i>
              Applications
            </a>
            
            <a routerLink="/candidates" class="nav-link" [class.active]="isActive('/candidates')" *ngIf="authService.isRecruiter() || authService.isAdmin()">
              <i class="fas fa-users"></i>
              Candidates
            </a>
            
            <a routerLink="/screening" class="nav-link" [class.active]="isActive('/screening')" *ngIf="authService.isRecruiter() || authService.isAdmin()">
              <i class="fas fa-search"></i>
              Screening
            </a>
            
            <a routerLink="/interviews" class="nav-link" [class.active]="isActive('/interviews')">
              <i class="fas fa-calendar-alt"></i>
              Interviews
            </a>
          </div>
          
          <div class="nav-user">
            <div class="user-info">
              <div class="user-avatar">
                <i class="fas fa-user"></i>
              </div>
              <div class="user-details">
                <span class="user-name">{{ currentUser.fullName }}</span>
                <span class="user-role badge" [ngClass]="getRoleBadgeClass()">{{ currentUser.role }}</span>
              </div>
            </div>
            <button class="btn btn-secondary btn-sm" (click)="logout()">
              <i class="fas fa-sign-out-alt"></i>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="main-content" [class.with-nav]="currentUser">
        <router-outlet></router-outlet>
      </main>

      <!-- Loading Overlay -->
      <div class="loading-overlay" *ngIf="isLoading">
        <div class="spinner"></div>
        <p>Loading...</p>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .navbar {
      background: #ffffff;
      color: #374151;
      padding: 0;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
      position: sticky;
      top: 0;
      z-index: 1000;
      border-bottom: 1px solid #e5e7eb;
    }

    .nav-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
      height: 64px;
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.25rem;
      font-weight: 700;
      color: #111827;
      text-decoration: none;
      cursor: pointer;
    }

    .brand-logo {
      width: 32px;
      height: 32px;
      background: #10b981;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .brand-logo svg {
      width: 24px;
      height: 24px;
    }

    .nav-links {
      display: flex;
      gap: 2rem;
      flex: 1;
      justify-content: center;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      color: #6b7280;
      text-decoration: none;
      border-radius: 6px;
      transition: all 0.2s ease;
      font-weight: 500;
      font-size: 0.875rem;
      position: relative;

      &:hover {
        color: #374151;
        background-color: #f9fafb;
      }

      &.active {
        color: #10b981;
        background-color: #ecfdf5;
      }

      &.active::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 50%;
        transform: translateX(-50%);
        width: 20px;
        height: 2px;
        background-color: #10b981;
        border-radius: 1px;
      }

      i {
        font-size: 0.875rem;
      }
    }

    .nav-user {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      background: #f3f4f6;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6b7280;
      border: 2px solid #e5e7eb;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
    }

    .user-name {
      font-weight: 600;
      font-size: 0.875rem;
      color: #111827;
    }

    .user-role {
      font-size: 0.75rem;
      padding: 0.125rem 0.5rem;
      border-radius: 12px;
      font-weight: 500;
    }

    .main-content {
      flex: 1;
      background-color: var(--neutral-50);
      
      &.with-nav {
        min-height: calc(100vh - 70px);
      }
    }

    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-md);
      z-index: 9999;
      color: white;
    }

    .role-admin { background-color: var(--error-500); }
    .role-recruiter { background-color: var(--primary-500); }
    .role-candidate { background-color: var(--success-500); }

    @media (max-width: 768px) {
      .nav-content {
        padding: 0 var(--spacing-md);
      }

      .nav-links {
        display: none;
      }

      .nav-brand span {
        display: none;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  currentUser: User | null = null;
  isLoading = false;
  currentRoute = '';

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      this.currentRoute = (event as NavigationEnd).url;
    });
  }

  isActive(route: string): boolean {
    return this.currentRoute.startsWith(route);
  }

  getRoleBadgeClass(): string {
    if (!this.currentUser) return '';
    return `role-${this.currentUser.role.toLowerCase()}`;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}