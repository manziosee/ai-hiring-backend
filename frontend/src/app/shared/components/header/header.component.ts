import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User, UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header-toolbar">
      <div class="header-container">
        <!-- Logo -->
        <div class="logo" routerLink="/">
          <span class="logo-icon">🧠</span>
          <span class="logo-text">AI Hire</span>
        </div>

        <!-- Navigation -->
        <nav class="nav-menu" *ngIf="isAuthenticated">
          <ng-container *ngIf="currentUser">
            <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
              <span class="nav-icon">📊</span>
              <span class="nav-text">Dashboard</span>
            </a>
            <a routerLink="/jobs" routerLinkActive="active" class="nav-link">
              <span class="nav-icon">💼</span>
              <span class="nav-text">Jobs</span>
            </a>
            <a
              routerLink="/applications"
              routerLinkActive="active"
              class="nav-link"
              *ngIf="
                currentUser.role === UserRole.RECRUITER ||
                currentUser.role === UserRole.ADMIN
              "
            >
              <span class="nav-icon">📋</span>
              <span class="nav-text">Applications</span>
            </a>
            <a
              routerLink="/candidates"
              routerLinkActive="active"
              class="nav-link"
              *ngIf="
                currentUser.role === UserRole.RECRUITER ||
                currentUser.role === UserRole.ADMIN
              "
            >
              <span class="nav-icon">👥</span>
              <span class="nav-text">Candidates</span>
            </a>
            <a
              routerLink="/screening"
              routerLinkActive="active"
              class="nav-link"
              *ngIf="
                currentUser.role === UserRole.RECRUITER ||
                currentUser.role === UserRole.ADMIN
              "
            >
              <span class="nav-icon">🔍</span>
              <span class="nav-text">Screening</span>
            </a>
            <a routerLink="/interviews" routerLinkActive="active" class="nav-link">
              <span class="nav-icon">📅</span>
              <span class="nav-text">Interviews</span>
            </a>
            <a
              routerLink="/analytics"
              routerLinkActive="active"
              class="nav-link"
              *ngIf="currentUser.role === UserRole.ADMIN"
            >
              <span class="nav-icon">📊</span>
              <span class="nav-text">Analytics</span>
            </a>
          </ng-container>
        </nav>

        <!-- Right Side Actions -->
        <div class="header-actions">
          <ng-container *ngIf="isAuthenticated; else loginActions">
            <!-- User Info -->
            <div class="user-info" *ngIf="currentUser">
              <span class="user-name">{{ currentUser.firstName }} {{ currentUser.lastName }}</span>
              <span class="user-role">{{ currentUser.role }}</span>
            </div>
            <button class="logout-btn" (click)="logout()">Logout</button>
          </ng-container>

          <ng-template #loginActions>
            <a routerLink="/auth/login" class="login-btn">Login</a>
            <a routerLink="/auth/register" class="signup-btn">Sign Up</a>
          </ng-template>
        </div>
      </div>
    </header>
  `,
  styles: [
    `
      .header-toolbar {
        background: linear-gradient(
          135deg,
          #4f46e5 0%,
          #3730a3 100%
        );
        color: white;
        padding: 16px 0;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        position: sticky;
        top: 0;
        z-index: 1000;
      }

      .header-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 24px;
      }

      .logo {
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: 24px;
        font-weight: 700;
        text-decoration: none;
        color: white;
        transition: all 0.3s ease;
      }

      .logo:hover {
        transform: scale(1.05);
      }

      .logo-icon {
        margin-right: 8px;
        font-size: 28px;
      }

      .nav-menu {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .nav-link {
        color: white;
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 10px 14px;
        border-radius: 8px;
        transition: all 0.3s ease;
        text-decoration: none;
        font-size: 14px;
        font-weight: 500;
        white-space: nowrap;
      }

      .nav-link:hover {
        background: rgba(255, 255, 255, 0.15);
        transform: translateY(-1px);
      }

      .nav-link.active {
        background: rgba(255, 255, 255, 0.2);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .nav-icon {
        font-size: 16px;
        display: inline-block;
        width: 18px;
        text-align: center;
      }

      .nav-text {
        font-size: 13px;
        letter-spacing: 0.3px;
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .user-info {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        line-height: 1.2;
      }

      .user-name {
        font-weight: 600;
        font-size: 14px;
      }

      .user-role {
        font-size: 11px;
        opacity: 0.8;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .logout-btn,
      .login-btn,
      .signup-btn {
        padding: 8px 16px;
        border-radius: 8px;
        text-decoration: none;
        border: none;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.3s ease;
      }

      .logout-btn {
        background: rgba(255, 255, 255, 0.1);
        color: white;
      }

      .logout-btn:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      .login-btn {
        background: transparent;
        color: white;
      }

      .signup-btn {
        background: #10b981;
        color: white;
      }

      .signup-btn:hover {
        background: #059669;
      }

      @media (max-width: 768px) {
        .nav-menu {
          display: none;
        }

        .user-name {
          display: none;
        }

        .header-container {
          padding: 0 16px;
        }
      }
    `,
  ]
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  isAuthenticated = false;
  UserRole = UserRole;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Simple implementation without observables for now
    this.currentUser = this.authService.getCurrentUser();
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/']);
  }
}