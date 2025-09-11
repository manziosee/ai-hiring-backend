import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { User, UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatSidenavModule, 
    MatListModule, 
    MatIconModule, 
    MatButtonModule
  ],
  template: `
    <mat-nav-list class="sidebar-nav">
      <ng-container *ngIf="currentUser$ | async as user">
        
        <!-- Dashboard -->
        <a mat-list-item routerLink="/dashboard" routerLinkActive="active" class="nav-item">
          <mat-icon matListItemIcon>dashboard</mat-icon>
          <span matListItemTitle>Dashboard</span>
        </a>

        <!-- Jobs -->
        <a mat-list-item routerLink="/jobs" routerLinkActive="active" class="nav-item">
          <mat-icon matListItemIcon>work</mat-icon>
          <span matListItemTitle>Jobs</span>
        </a>

        <!-- Applications (Recruiters & Admins) -->
        <div *ngIf="user.role === UserRole.RECRUITER || user.role === UserRole.ADMIN">
          <a mat-list-item routerLink="/applications" routerLinkActive="active" class="nav-item">
            <mat-icon matListItemIcon>assignment</mat-icon>
            <span matListItemTitle>Applications</span>
            <span class="badge">12</span>
          </a>
          
          <a mat-list-item routerLink="/screening" routerLinkActive="active" class="nav-item">
            <mat-icon matListItemIcon>psychology</mat-icon>
            <span matListItemTitle>AI Screening</span>
          </a>
        </div>

        <!-- Candidates (Recruiters & Admins) -->
        <a mat-list-item routerLink="/candidates" routerLinkActive="active" class="nav-item"
           *ngIf="user.role === UserRole.RECRUITER || user.role === UserRole.ADMIN">
          <mat-icon matListItemIcon>people</mat-icon>
          <span matListItemTitle>Candidates</span>
        </a>

        <!-- Interviews -->
        <a mat-list-item routerLink="/interviews" routerLinkActive="active" class="nav-item">
          <mat-icon matListItemIcon>event</mat-icon>
          <span matListItemTitle>Interviews</span>
        </a>

        <!-- Communication -->
        <a mat-list-item routerLink="/messages" routerLinkActive="active" class="nav-item">
          <mat-icon matListItemIcon>message</mat-icon>
          <span matListItemTitle>Messages</span>
          <span class="badge accent">3</span>
        </a>

        <mat-divider class="nav-divider"></mat-divider>

        <!-- Admin Only -->
        <div *ngIf="user.role === UserRole.ADMIN">
          <h3 class="nav-section-title">Administration</h3>
          
          <a mat-list-item routerLink="/admin/users" routerLinkActive="active" class="nav-item">
            <mat-icon matListItemIcon>admin_panel_settings</mat-icon>
            <span matListItemTitle>User Management</span>
          </a>
          
          <a mat-list-item routerLink="/admin/reports" routerLinkActive="active" class="nav-item">
            <mat-icon matListItemIcon>analytics</mat-icon>
            <span matListItemTitle>Reports & Analytics</span>
          </a>
          
          <a mat-list-item routerLink="/admin/settings" routerLinkActive="active" class="nav-item">
            <mat-icon matListItemIcon>settings</mat-icon>
            <span matListItemTitle>System Settings</span>
          </a>
          
          <mat-divider class="nav-divider"></mat-divider>
        </div>

        <!-- File Management -->
        <a mat-list-item routerLink="/files" routerLinkActive="active" class="nav-item">
          <mat-icon matListItemIcon>folder</mat-icon>
          <span matListItemTitle>Files</span>
        </a>

        <!-- Profile & Settings -->
        <a mat-list-item routerLink="/profile" routerLinkActive="active" class="nav-item">
          <mat-icon matListItemIcon>person</mat-icon>
          <span matListItemTitle>Profile</span>
        </a>

        <a mat-list-item routerLink="/settings" routerLinkActive="active" class="nav-item">
          <mat-icon matListItemIcon>tune</mat-icon>
          <span matListItemTitle>Settings</span>
        </a>

      </ng-container>
    </mat-nav-list>
  `,
  styles: [`
    .sidebar-nav {
      padding: 16px 0;
      height: 100%;
    }

    .nav-item {
      border-radius: 8px;
      margin: 4px 8px;
      transition: all 0.3s ease;
      position: relative;
    }

    .nav-item:hover {
      background: var(--gray-100);
    }

    .nav-item.active {
      background: var(--primary-50);
      color: var(--primary-700);
    }

    .nav-item.active mat-icon {
      color: var(--primary-600);
    }

    .nav-section-title {
      padding: 16px 16px 8px 16px;
      margin: 0;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      color: var(--gray-500);
      letter-spacing: 0.5px;
    }

    .nav-divider {
      margin: 16px 0;
    }

    .badge {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      background: var(--primary-600);
      color: white;
      border-radius: 10px;
      padding: 2px 8px;
      font-size: 11px;
      font-weight: 600;
      min-width: 18px;
      text-align: center;
    }

    .badge.accent {
      background: var(--accent-500);
    }

    :host ::ng-deep .mat-mdc-list-item-content {
      padding: 0 16px !important;
    }

    :host ::ng-deep .mat-mdc-list-item {
      height: 48px !important;
    }
  `]
})
export class SidebarComponent implements OnInit {
  currentUser$: Observable<User | null>;
  UserRole = UserRole;

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {}
}