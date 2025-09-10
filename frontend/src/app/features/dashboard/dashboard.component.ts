import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { Observable } from 'rxjs';
import { AuthService } from '@core/services/auth.service';
import { User } from '@core/models/auth.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule
  ],
  template: `
    <div class="dashboard-container">
      <div class="welcome-section" *ngIf="currentUser$ | async as user">
        <h1>Welcome back, {{user.firstName}}!</h1>
        <p>Here's what's happening with your {{user.role.toLowerCase()}} account</p>
      </div>

      <div class="stats-grid">
        <mat-card class="stat-card" *ngFor="let stat of getStatsForRole()">
          <mat-card-content>
            <div class="stat-icon">
              <mat-icon>{{stat.icon}}</mat-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{stat.value}}</div>
              <div class="stat-label">{{stat.label}}</div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="actions-grid">
          <mat-card class="action-card" *ngFor="let action of getActionsForRole()">
            <mat-card-content>
              <mat-icon>{{action.icon}}</mat-icon>
              <h3>{{action.title}}</h3>
              <p>{{action.description}}</p>
              <button mat-raised-button color="primary">{{action.buttonText}}</button>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <div class="recent-activity">
        <h2>Recent Activity</h2>
        <mat-card>
          <mat-card-content>
            <div class="activity-item" *ngFor="let activity of recentActivities">
              <mat-icon>{{activity.icon}}</mat-icon>
              <div class="activity-content">
                <div class="activity-title">{{activity.title}}</div>
                <div class="activity-time">{{activity.time}}</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .welcome-section {
      margin-bottom: 32px;
    }

    .welcome-section h1 {
      margin: 0 0 8px 0;
      color: #333;
    }

    .welcome-section p {
      margin: 0;
      color: #666;
      font-size: 16px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    .stat-card {
      padding: 16px;
    }

    .stat-card mat-card-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-icon {
      background: #3f51b5;
      color: white;
      border-radius: 50%;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 500;
      color: #333;
    }

    .stat-label {
      color: #666;
      font-size: 14px;
    }

    .quick-actions, .recent-activity {
      margin-bottom: 32px;
    }

    .quick-actions h2, .recent-activity h2 {
      margin-bottom: 16px;
      color: #333;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
    }

    .action-card {
      text-align: center;
      padding: 24px;
    }

    .action-card mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #3f51b5;
      margin-bottom: 16px;
    }

    .action-card h3 {
      margin: 0 0 8px 0;
      color: #333;
    }

    .action-card p {
      margin: 0 0 16px 0;
      color: #666;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 0;
      border-bottom: 1px solid #eee;
    }

    .activity-item:last-child {
      border-bottom: none;
    }

    .activity-item mat-icon {
      color: #666;
    }

    .activity-title {
      font-weight: 500;
      color: #333;
    }

    .activity-time {
      font-size: 12px;
      color: #999;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 16px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .actions-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser$: Observable<User | null>;
  recentActivities = [
    { icon: 'work', title: 'New job application received', time: '2 hours ago' },
    { icon: 'schedule', title: 'Interview scheduled for tomorrow', time: '4 hours ago' },
    { icon: 'assessment', title: 'Screening results available', time: '1 day ago' },
    { icon: 'person_add', title: 'New candidate registered', time: '2 days ago' }
  ];

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {}

  getStatsForRole() {
    const user = this.authService.getCurrentUser();
    if (!user) return [];

    switch (user.role) {
      case 'ADMIN':
        return [
          { icon: 'people', value: '1,234', label: 'Total Users' },
          { icon: 'work', value: '89', label: 'Active Jobs' },
          { icon: 'assignment', value: '456', label: 'Applications' },
          { icon: 'trending_up', value: '23%', label: 'Growth Rate' }
        ];
      case 'RECRUITER':
        return [
          { icon: 'work', value: '12', label: 'My Jobs' },
          { icon: 'assignment', value: '67', label: 'Applications' },
          { icon: 'schedule', value: '8', label: 'Interviews' },
          { icon: 'assessment', value: '34', label: 'Screenings' }
        ];
      case 'CANDIDATE':
        return [
          { icon: 'send', value: '5', label: 'Applications Sent' },
          { icon: 'schedule', value: '2', label: 'Interviews' },
          { icon: 'visibility', value: '23', label: 'Profile Views' },
          { icon: 'star', value: '4.8', label: 'Rating' }
        ];
      default:
        return [];
    }
  }

  getActionsForRole() {
    const user = this.authService.getCurrentUser();
    if (!user) return [];

    switch (user.role) {
      case 'ADMIN':
        return [
          {
            icon: 'people',
            title: 'Manage Users',
            description: 'View and manage all platform users',
            buttonText: 'Go to Users'
          },
          {
            icon: 'analytics',
            title: 'View Analytics',
            description: 'Check platform performance metrics',
            buttonText: 'View Reports'
          }
        ];
      case 'RECRUITER':
        return [
          {
            icon: 'add',
            title: 'Post New Job',
            description: 'Create a new job posting',
            buttonText: 'Create Job'
          },
          {
            icon: 'assessment',
            title: 'Screen Candidates',
            description: 'Review and screen job applications',
            buttonText: 'Start Screening'
          }
        ];
      case 'CANDIDATE':
        return [
          {
            icon: 'search',
            title: 'Find Jobs',
            description: 'Browse available job opportunities',
            buttonText: 'Search Jobs'
          },
          {
            icon: 'person',
            title: 'Update Profile',
            description: 'Keep your profile up to date',
            buttonText: 'Edit Profile'
          }
        ];
      default:
        return [];
    }
  }
}