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
            <i class="fas fa-robot"></i>
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
      background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
      color: white;
      padding: 0;
      box-shadow: var(--shadow-lg);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .nav-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 var(--spacing-lg);
      height: 70px;
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      text-decoration: none;

      i {
        font-size: 2rem;
        color: var(--warning-400);
      }
    }

    .nav-links {
      display: flex;
      gap: var(--spacing-md);
      flex: 1;
      justify-content: center;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      padding: var(--spacing-sm) var(--spacing-md);
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);
      font-weight: 500;

      &:hover, &.active {
        background-color: rgba(255, 255, 255, 0.1);
        color: white;
        transform: translateY(-1px);
      }

      i {
        font-size: 0.875rem;
      }
    }

    .nav-user {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .user-name {
      font-weight: 600;
      font-size: 0.875rem;
    }

    .user-role {
      font-size: 0.75rem;
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
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute = event.url;
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