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
      <!-- Animated Background -->
      <div class="background-animation">
        <div class="gradient-orb orb-1"></div>
        <div class="gradient-orb orb-2"></div>
        <div class="gradient-orb orb-3"></div>
        <div class="floating-particles">
          <div class="particle" *ngFor="let p of particles; let i = index" [style.animation-delay.s]="i * 0.5"></div>
        </div>
      </div>

      <div class="dashboard-content">
        <div class="dashboard-header">
          <div class="welcome-section">
            <div class="welcome-badge">
              <i class="fas fa-sparkles"></i>
              <span>{{ getRoleDisplay() | titlecase }} Dashboard</span>
            </div>
            <h1>Welcome back, <span class="gradient-text">{{ currentUser?.fullName }}</span>!</h1>
            <p>Here's your personalized overview and latest updates</p>
          </div>
          <div class="quick-actions">
            <button class="btn btn-primary" *ngIf="authService.isRecruiter() || authService.isAdmin()" routerLink="/jobs/create">
              <i class="fas fa-plus"></i>
              Post New Job
            </button>
            <button class="btn btn-secondary" *ngIf="authService.isCandidate()" routerLink="/jobs">
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
              <div class="application-item" *ngFor="let app of stats?.recentApplications?.slice(0, 5)">
                <div class="application-info">
                  <h4>{{ app.job?.title }}</h4>
                  <p *ngIf="authService.isCandidate()">Applied {{ getTimeAgo(app.createdAt) }}</p>
                  <p *ngIf="!authService.isCandidate()">{{ app.candidate?.name || 'Unknown' }} • {{ getTimeAgo(app.createdAt) }}</p>
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
              <div class="job-item" *ngFor="let job of stats?.topJobs?.slice(0, 5)">
                <div class="job-info">
                  <h4>{{ job.title }}</h4>
                  <p>{{ job.experience || 0 }} years experience • {{ (job.skills?.slice(0, 3) || []).join(', ') || 'No skills listed' }}</p>
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
              <div class="screening-item" *ngFor="let result of stats?.screeningResults?.slice(0, 5)">
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
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      position: relative;
      overflow: hidden;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%);
    }

    .background-animation {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: 0;
      pointer-events: none;
    }

    .gradient-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(60px);
      opacity: 0.4;
      animation: float 12s ease-in-out infinite;
    }

    .orb-1 {
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, #ff9a9e, #fecfef);
      top: -200px;
      left: -200px;
      animation-delay: 0s;
    }

    .orb-2 {
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, #a8edea, #fed6e3);
      bottom: -250px;
      right: -250px;
      animation-delay: 6s;
    }

    .orb-3 {
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, #d299c2, #fef9d7);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation-delay: 3s;
    }

    .floating-particles {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .particle {
      position: absolute;
      width: 4px;
      height: 4px;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 50%;
      animation: particle-float 8s linear infinite;
    }

    .particle:nth-child(1) { left: 10%; }
    .particle:nth-child(2) { left: 20%; }
    .particle:nth-child(3) { left: 30%; }
    .particle:nth-child(4) { left: 40%; }
    .particle:nth-child(5) { left: 50%; }
    .particle:nth-child(6) { left: 60%; }
    .particle:nth-child(7) { left: 70%; }
    .particle:nth-child(8) { left: 80%; }
    .particle:nth-child(9) { left: 90%; }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-30px) rotate(180deg); }
    }

    @keyframes particle-float {
      0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
    }

    .dashboard-content {
      position: relative;
      z-index: 1;
      padding: 2rem;
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
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      padding: 2rem;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      transition: all 0.3s ease;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

      &:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        background: rgba(255, 255, 255, 0.15);
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
      font-size: 2.5rem;
      font-weight: 800;
      color: white;
      margin: 0;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .stat-content p {
      color: rgba(255, 255, 255, 0.9);
      margin: 0;
      font-weight: 600;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: var(--spacing-xl);
    }

    .dashboard-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    .dashboard-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    }

    .card-header {
      padding: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(255, 255, 255, 0.05);

      h2 {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin: 0;
        font-size: 1.25rem;
        color: white;
        font-weight: 700;

        i {
          color: #ffd89b;
        }
      }

      .view-all {
        color: rgba(255, 255, 255, 0.8);
        text-decoration: none;
        font-weight: 500;
        font-size: 0.875rem;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        transition: all 0.3s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }
      }
    }

    .card-body {
      padding: 1.5rem;
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
  particles = Array(9).fill(0);

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