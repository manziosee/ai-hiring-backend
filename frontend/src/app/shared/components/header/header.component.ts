import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { User, UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule, 
    MatMenuModule, 
    MatBadgeModule
  ],
  template: `
    <mat-toolbar class="header-toolbar">
      <div class="header-container">
        <!-- Logo -->
        <div class="logo" routerLink="/">
          <mat-icon class="logo-icon">psychology</mat-icon>
          <span class="logo-text">AI Hire</span>
        </div>

        <!-- Navigation -->
        <nav class="nav-menu" *ngIf="isAuthenticated$ | async">
          <ng-container *ngIf="currentUser$ | async as user">
            <a mat-button routerLink="/dashboard" routerLinkActive="active">
              <mat-icon>dashboard</mat-icon>
              Dashboard
            </a>
            
            <a mat-button routerLink="/jobs" routerLinkActive="active">
              <mat-icon>work</mat-icon>
              Jobs
            </a>
            
            <a mat-button routerLink="/applications" routerLinkActive="active" 
               *ngIf="user.role === UserRole.RECRUITER || user.role === UserRole.ADMIN">
              <mat-icon matBadge="5" matBadgeColor="accent">assignment</mat-icon>
              Applications
            </a>
            
            <a mat-button routerLink="/candidates" routerLinkActive="active"
               *ngIf="user.role === UserRole.RECRUITER || user.role === UserRole.ADMIN">
              <mat-icon>people</mat-icon>
              Candidates
            </a>
            
            <a mat-button routerLink="/interviews" routerLinkActive="active">
              <mat-icon>event</mat-icon>
              Interviews
            </a>
            
            <a mat-button routerLink="/reports" routerLinkActive="active"
               *ngIf="user.role === UserRole.ADMIN">
              <mat-icon>analytics</mat-icon>
              Reports
            </a>
          </ng-container>
        </nav>

        <!-- Right Side Actions -->
        <div class="header-actions">
          <ng-container *ngIf="isAuthenticated$ | async; else loginActions">
            <!-- Notifications -->
            <button mat-icon-button [matMenuTriggerFor]="notificationsMenu">
              <mat-icon matBadge="3" matBadgeColor="accent">notifications</mat-icon>
            </button>

            <!-- User Menu -->
            <button mat-button [matMenuTriggerFor]="userMenu" class="user-button">
              <div class="user-avatar">
                <mat-icon>account_circle</mat-icon>
              </div>
              <span class="user-name" *ngIf="currentUser$ | async as user">
                {{ user.firstName }} {{ user.lastName }}
              </span>
            </button>
          </ng-container>

          <ng-template #loginActions>
            <a mat-button routerLink="/auth/login">Login</a>
            <a mat-raised-button color="primary" routerLink="/auth/register">Sign Up</a>
          </ng-template>
        </div>
      </div>
    </mat-toolbar>

    <!-- Notifications Menu -->
    <mat-menu #notificationsMenu="matMenu" class="notifications-menu">
      <div class="notifications-header">
        <h3>Notifications</h3>
        <button mat-button color="primary">Mark all read</button>
      </div>
      <mat-divider></mat-divider>
      <div class="notification-item" mat-menu-item>
        <mat-icon color="primary">assignment</mat-icon>
        <div class="notification-content">
          <p>New application received for Senior Developer position</p>
          <small>2 minutes ago</small>
        </div>
      </div>
      <div class="notification-item" mat-menu-item>
        <mat-icon color="accent">event</mat-icon>
        <div class="notification-content">
          <p>Interview scheduled for tomorrow at 2:00 PM</p>
          <small>1 hour ago</small>
        </div>
      </div>
      <mat-divider></mat-divider>
      <button mat-button class="view-all-btn">View All Notifications</button>
    </mat-menu>

    <!-- User Menu -->
    <mat-menu #userMenu="matMenu" class="user-menu">
      <button mat-menu-item routerLink="/profile">
        <mat-icon>person</mat-icon>
        <span>Profile</span>
      </button>
      <button mat-menu-item routerLink="/settings">
        <mat-icon>settings</mat-icon>
        <span>Settings</span>
      </button>
      <mat-divider></mat-divider>
      <button mat-menu-item (click)="logout()">
        <mat-icon>logout</mat-icon>
        <span>Logout</span>
      </button>
    </mat-menu>
  `,
  styles: [`
    .header-toolbar {
      background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
      color: white;
      padding: 0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
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
      color: var(--accent-500);
    }

    .nav-menu {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .nav-menu a {
      color: white;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .nav-menu a:hover,
    .nav-menu a.active {
      background: rgba(255,255,255,0.1);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .user-button {
      display: flex;
      align-items: center;
      gap: 8px;
      color: white;
      padding: 8px 16px;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .user-button:hover {
      background: rgba(255,255,255,0.1);
    }

    .user-avatar {
      display: flex;
      align-items: center;
    }

    .user-name {
      font-weight: 500;
    }

    .notifications-menu {
      min-width: 300px;
    }

    .notifications-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
    }

    .notifications-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }

    .notification-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 16px;
      border-bottom: 1px solid var(--gray-200);
    }

    .notification-content p {
      margin: 0;
      font-size: 14px;
      font-weight: 500;
    }

    .notification-content small {
      color: var(--gray-500);
      font-size: 12px;
    }

    .view-all-btn {
      width: 100%;
      text-align: center;
      color: var(--primary-600);
      font-weight: 500;
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
  `]
})
export class HeaderComponent implements OnInit {
  currentUser$: Observable<User | null>;
  isAuthenticated$: Observable<boolean>;
  UserRole = UserRole;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  }

  ngOnInit(): void {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}