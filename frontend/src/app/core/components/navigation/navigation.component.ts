import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/auth.models';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];
}

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule,
    MatBadgeModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #drawer class="sidenav" fixedInViewport
                   [attr.role]="'navigation'"
                   [mode]="'over'"
                   [opened]="false">
        <mat-toolbar>Menu</mat-toolbar>
        <mat-nav-list>
          <a mat-list-item 
             *ngFor="let item of getVisibleNavItems()" 
             [routerLink]="item.route"
             routerLinkActive="active-link"
             (click)="drawer.close()">
            <mat-icon matListItemIcon>{{item.icon}}</mat-icon>
            <span matListItemTitle>{{item.label}}</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>
      
      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <button
            type="button"
            aria-label="Toggle sidenav"
            mat-icon-button
            (click)="drawer.toggle()">
            <mat-icon aria-label="Side nav toggle icon">menu</mat-icon>
          </button>
          
          <span class="app-title">AI Hiring Platform</span>
          
          <span class="spacer"></span>
          
          <button mat-icon-button [matMenuTriggerFor]="notificationMenu">
            <mat-icon matBadge="3" matBadgeColor="warn">notifications</mat-icon>
          </button>
          
          <button mat-icon-button [matMenuTriggerFor]="userMenu">
            <mat-icon>account_circle</mat-icon>
          </button>
        </mat-toolbar>
        
        <div class="content">
          <ng-content></ng-content>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>

    <!-- User Menu -->
    <mat-menu #userMenu="matMenu">
      <div class="user-info" *ngIf="currentUser$ | async as user">
        <div class="user-name">{{user.firstName}} {{user.lastName}}</div>
        <div class="user-role">{{user.role}}</div>
      </div>
      <mat-divider></mat-divider>
      <button mat-menu-item routerLink="/profile">
        <mat-icon>person</mat-icon>
        <span>Profile</span>
      </button>
      <button mat-menu-item (click)="logout()">
        <mat-icon>logout</mat-icon>
        <span>Logout</span>
      </button>
    </mat-menu>

    <!-- Notification Menu -->
    <mat-menu #notificationMenu="matMenu">
      <div class="notification-header">Notifications</div>
      <mat-divider></mat-divider>
      <button mat-menu-item>
        <mat-icon>work</mat-icon>
        <span>New job application received</span>
      </button>
      <button mat-menu-item>
        <mat-icon>schedule</mat-icon>
        <span>Interview scheduled for tomorrow</span>
      </button>
      <button mat-menu-item>
        <mat-icon>assessment</mat-icon>
        <span>Screening results available</span>
      </button>
    </mat-menu>
  `,
  styles: [`
    .sidenav-container {
      height: 100%;
    }

    .sidenav {
      width: 250px;
    }

    .sidenav .mat-toolbar {
      background: inherit;
    }

    .app-title {
      font-weight: 500;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .content {
      padding: 16px;
      height: calc(100vh - 64px);
      overflow-y: auto;
    }

    .active-link {
      background-color: rgba(0, 0, 0, 0.04);
    }

    .user-info {
      padding: 16px;
      text-align: center;
    }

    .user-name {
      font-weight: 500;
      font-size: 16px;
    }

    .user-role {
      color: #666;
      font-size: 14px;
      text-transform: capitalize;
    }

    .notification-header {
      padding: 16px;
      font-weight: 500;
      color: #666;
    }
  `]
})
export class NavigationComponent implements OnInit {
  currentUser$: Observable<User | null>;

  private navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Jobs', icon: 'work', route: '/jobs' },
    { label: 'Applications', icon: 'assignment', route: '/applications' },
    { label: 'Candidates', icon: 'people', route: '/candidates', roles: ['ADMIN', 'RECRUITER'] },
    { label: 'Screening', icon: 'assessment', route: '/screening', roles: ['ADMIN', 'RECRUITER'] },
    { label: 'Interviews', icon: 'schedule', route: '/interviews' },
    { label: 'Profile', icon: 'person', route: '/profile' },
    { label: 'Admin', icon: 'admin_panel_settings', route: '/admin', roles: ['ADMIN'] }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {}

  getVisibleNavItems(): NavItem[] {
    return this.navItems.filter(item => {
      if (!item.roles) return true;
      return this.authService.hasRole(item.roles);
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}