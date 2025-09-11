import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { DashboardStats, User, Job, Application } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <div class="welcome-section">
          <h1>Welcome back, {{ currentUser?.fullName }}!</h1>
          <p>Here's what's happening with your {{ getRoleDisplay() }} dashboard</p>
        </div>
        <div class="quick-actions">
          <button class="btn btn-primary" *ngIf="authService.isRecruiter() || authService.isAdmin()" routerLink="/jobs/create">
            <i class="fas fa-plus"></i>
            Post New Job
          </button>
          <button class="btn btn-outline" *ngIf="authService.isCandidate()" routerLink="/jobs">
            <i class="fas fa-search"></i>
            Browse Jobs
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid" *ngIf="stats">
        <div class="stat-card" *ngIf="authService.isAdmin()">
          <div class="stat-icon admin">
            <i class="fas fa-users"></i>
          </div>
          <div class="stat-content">
            <h3>{{ stats.totalUsers || 0 }}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon jobs">
            <i class="fas fa-briefcase"></i>
          </div>
          <div class="stat-content">
            <h3>{{ stats.totalJobs || 0 }}</h3>
            <p>{{ authService.isCandidate() ? 'Available Jobs' : 'Total Jobs' }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon applications">
            <i class="fas fa-file-alt"></i>
          </div>
          <div class="stat-content">
            <h3>{{ stats.totalApplications || 0 }}</h3>
            <p>{{ authService.isCandidate() ? 'My Applications' : 'Total Applications' }}</p>
          </div>
        </div>

        <div class="stat-card" *ngIf="authService.isRecruiter() || authService.isAdmin()">
          <div class="stat-icon candidates">
            <i class="fas fa-user-graduate"></i>
          </div>
          <div class="stat-content">
            <h3>{{ stats.totalCandidates || 0 }}</h3>
            <p>Total Candidates</p>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="dashboard-grid">
        <!-- Recent Applications -->
        <div class="dashboard-card">
          <div class="card-header">
            <h2>
              <i class="fas fa-clock"></i>
              Recent Applications
            </h2>
            <a routerLink="/applications" class="view-all">View All</a>
          </div>
          <div class="card-body">
            <div class="applications-list" *ngIf="stats?.recentApplications?.length; else noApplications">
              <div class="application-item" *ngFor="let app of stats.recentApplications.slice(0, 5)">
                <div class="application-info">
                  <h4>{{ app.job?.title }}</h4>
                  <p *ngIf="authService.isCandidate()">Applied {{ getTimeAgo(app.createdAt) }}</p>
                  <p *ngIf="!authService.isCandidate()">{{ app.candidate?.name }} • {{ getTimeAgo(app.createdAt) }}</p>
                </div>
                <div class="application-status">
                  <span class="badge" [ngClass]="getStatusClass(app.status)">
                    {{ app.status }}
                  </span>
                </div>
              </div>
            </div>
            <ng-template #noApplications>
              <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>No applications yet</p>
              </div>
            </ng-template>
          </div>
        </div>

        <!-- Top Jobs / Job Performance -->
        <div class="dashboard-card">
          <div class="card-header">
            <h2>
              <i class="fas fa-star"></i>
              {{ authService.isCandidate() ? 'Recommended Jobs' : 'Top Performing Jobs' }}
            </h2>
            <a routerLink="/jobs" class="view-all">View All</a>
          </div>
          <div class="card-body">
            <div class="jobs-list" *ngIf="stats?.topJobs?.length; else noJobs">
              <div class="job-item" *ngFor="let job of stats.topJobs.slice(0, 5)">
                <div class="job-info">
                  <h4>{{ job.title }}</h4>
                  <p>{{ job.experience }} years experience • {{ job.skills.slice(0, 3).join(', ') }}</p>
                  <small>Posted {{ getTimeAgo(job.createdAt) }}</small>
                </div>
                <div class="job-stats" *ngIf="!authService.isCandidate()">
                  <span class="applications-count">
                    {{ job._count?.applications || 0 }} applications
                  </span>
                </div>
                <div class="job-actions" *ngIf="authService.isCandidate()">
                  <button class="btn btn-sm btn-primary" (click)="applyToJob(job.id)">
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
            <ng-template #noJobs>
              <div class="empty-state">
                <i class="fas fa-briefcase"></i>
                <p>No jobs available</p>
              </div>
            </ng-template>
          </div>
        </div>

        <!-- AI Screening Results (Recruiters/Admins) -->
        <div class="dashboard-card" *ngIf="authService.isRecruiter() || authService.isAdmin()">
          <div class="card-header">
            <h2>
              <i class="fas fa-brain"></i>
              AI Screening Results
            </h2>
            <a routerLink="/screening" class="view-all">View All</a>
          </div>
          <div class="card-body">
            <div class="screening-list" *ngIf="stats?.screeningResults?.length; else noScreening">
              <div class="screening-item" *ngFor="let result of stats.screeningResults.slice(0, 5)">
                <div class="screening-info">
                  <h4>{{ result.application?.candidate?.name }}</h4>
                  <p>{{ result.application?.job?.title }}</p>
                  <small>{{ result.stage }} • {{ getTimeAgo(result.createdAt) }}</small>
                </div>
                <div class="screening-score">
                  <div class="score-circle" [ngClass]="getScoreClass(result.fitScore)">
                    {{ (result.fitScore * 100).toFixed(0) }}%
                  </div>
                </div>
              </div>
            </div>
            <ng-template #noScreening>
              <div class="empty-state">
                <i class="fas fa-search"></i>
                <p>No screening results yet</p>
              </div>
            </ng-template>
          </div>
        </div>

        <!-- Quick Stats Chart (Placeholder) -->
        <div class="dashboard-card">
          <div class="card-header">
            <h2>
              <i class="fas fa-chart-line"></i>
              Activity Overview
            </h2>
          </div>
          <div class="card-body">
            <div class="chart-placeholder">
              <i class="fas fa-chart-bar"></i>
              <p>Analytics chart coming soon</p>
              <small>Track your hiring metrics and performance</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: var(--spacing-xl);
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-2xl);
      padding-bottom: var(--spacing-xl);
      border-bottom: 1px solid var(--neutral-200);
    }

    .welcome-section h1 {
      font-size: 2.5rem;
      color: var(--neutral-800);
      margin-bottom: var(--spacing-sm);
    }

    .welcome-section p {
      color: var(--neutral-600);
      font-size: 1.125rem;
    }

    .quick-actions {
      display: flex;
      gap: var(--spacing-md);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--spacing-lg);
      margin-bottom: var(--spacing-2xl);
    }

    .stat-card {
      background: white;
      border-radius: var(--radius-lg);
      padding: var(--spacing-xl);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--neutral-200);
      display: flex;
      align-items: center;
      gap: var(--spacing-lg);
      transition: all var(--transition-fast);

      &:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
      }
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: var(--radius-xl);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: white;

      &.admin { background: linear-gradient(135deg, var(--error-500), var(--error-600)); }
      &.jobs { background: linear-gradient(135deg, var(--primary-500), var(--primary-600)); }
      &.applications { background: linear-gradient(135deg, var(--warning-500), var(--warning-600)); }
      &.candidates { background: linear-gradient(135deg, var(--success-500), var(--success-600)); }
    }

    .stat-content h3 {
      font-size: 2rem;
      font-weight: 700;
      color: var(--neutral-800);
      margin: 0;
    }

    .stat-content p {
      color: var(--neutral-600);
      margin: 0;
      font-weight: 500;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: var(--spacing-xl);
    }

    .dashboard-card {
      background: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--neutral-200);
      overflow: hidden;
    }

    .card-header {
      padding: var(--spacing-xl);
      border-bottom: 1px solid var(--neutral-200);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--neutral-50);

      h2 {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        margin: 0;
        font-size: 1.25rem;
        color: var(--neutral-800);

        i {
          color: var(--primary-600);
        }
      }

      .view-all {
        color: var(--primary-600);
        text-decoration: none;
        font-weight: 500;
        font-size: 0.875rem;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .card-body {
      padding: var(--spacing-xl);
    }

    .applications-list, .jobs-list, .screening-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .application-item, .job-item, .screening-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-md);
      border: 1px solid var(--neutral-200);
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);

      &:hover {
        background: var(--neutral-50);
        border-color: var(--primary-300);
      }
    }

    .application-info, .job-info, .screening-info {
      flex: 1;

      h4 {
        margin: 0 0 var(--spacing-xs) 0;
        color: var(--neutral-800);
        font-size: 1rem;
      }

      p {
        margin: 0 0 var(--spacing-xs) 0;
        color: var(--neutral-600);
        font-size: 0.875rem;
      }

      small {
        color: var(--neutral-500);
        font-size: 0.75rem;
      }
    }

    .applications-count {
      font-size: 0.875rem;
      color: var(--neutral-600);
      background: var(--neutral-100);
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius-full);
    }

    .score-circle {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.875rem;
      color: white;

      &.high { background: var(--success-500); }
      &.medium { background: var(--warning-500); }
      &.low { background: var(--error-500); }
    }

    .empty-state {
      text-align: center;
      padding: var(--spacing-2xl);
      color: var(--neutral-500);

      i {
        font-size: 3rem;
        margin-bottom: var(--spacing-md);
        opacity: 0.5;
      }

      p {
        margin: 0;
        font-size: 1.125rem;
      }
    }

    .chart-placeholder {
      text-align: center;
      padding: var(--spacing-3xl);
      color: var(--neutral-400);

      i {
        font-size: 4rem;
        margin-bottom: var(--spacing-md);
      }

      p {
        font-size: 1.125rem;
        margin-bottom: var(--spacing-sm);
      }

      small {
        font-size: 0.875rem;
      }
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: var(--spacing-md);
      }

      .dashboard-header {
        flex-direction: column;
        gap: var(--spacing-lg);
        align-items: stretch;
      }

      .dashboard-grid {
        grid-template-columns: 1fr;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  stats: DashboardStats | null = null;
  isLoading = true;

  constructor(
    public authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  loadDashboardData() {
    if (!this.currentUser) return;

    let dashboardCall;
    switch (this.currentUser.role) {
      case 'ADMIN':
        dashboardCall = this.apiService.getAdminDashboard();
        break;
      case 'RECRUITER':
        dashboardCall = this.apiService.getRecruiterDashboard();
        break;
      case 'CANDIDATE':
        dashboardCall = this.apiService.getCandidateDashboard();
        break;
      default:
        return;
    }

    dashboardCall.subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load dashboard data:', error);
        this.isLoading = false;
      }
    });
  }

  getRoleDisplay(): string {
    return this.currentUser?.role.toLowerCase() || 'user';
  }

  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'PENDING': 'badge-warning',
      'SUBMITTED': 'badge-primary',
      'SCREENING': 'badge-secondary',
      'INTERVIEW': 'badge-primary',
      'OFFER': 'badge-success',
      'ACCEPTED': 'badge-success',
      'REJECTED': 'badge-error'
    };
    return statusClasses[status] || 'badge-secondary';
  }

  getScoreClass(score: number): string {
    if (score >= 0.7) return 'high';
    if (score >= 0.5) return 'medium';
    return 'low';
  }

  applyToJob(jobId: string) {
    // Navigate to job details or open application modal
    console.log('Apply to job:', jobId);
  }
}