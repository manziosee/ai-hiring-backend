import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import {
  AnalyticsService,
  DashboardMetrics,
} from '../../core/services/analytics.service';
import { User, UserRole } from '../../core/models/user.model';

interface DashboardStats {
  totalApplications: number;
  totalJobs: number;
  totalCandidates: number;
  totalInterviews?: number;
  screeningSuccessRate?: number;
  averageFitScore?: number;
}

interface Activity {
  id: string;
  text: string;
  icon: string;
  timestamp: Date;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="modern-dashboard">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="greeting">
            <h1>Welcome to AI Hiring Platform</h1>
            <p class="subtitle">
              Streamline your recruitment process with intelligent automation
            </p>
          </div>
          <div class="hero-stats">
            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-file-alt"></i>
              </div>
              <div class="stat-info">
                <span class="stat-number">{{ stats.totalApplications }}</span>
                <span class="stat-label">Applications</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-briefcase"></i>
              </div>
              <div class="stat-info">
                <span class="stat-number">{{ stats.totalJobs }}</span>
                <span class="stat-label">Active Jobs</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-users"></i>
              </div>
              <div class="stat-info">
                <span class="stat-number">{{ stats.totalCandidates }}</span>
                <span class="stat-label">Candidates</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Admin Dashboard -->
      <div *ngIf="currentUser?.role === UserRole.ADMIN" class="role-dashboard">
        <h3 class="role-title">🔧 Admin Control Panel</h3>
        <div class="quick-actions">
          <button class="action-btn primary" (click)="navigateTo('/users')">
            <span class="btn-icon">👥</span>
            <span class="btn-text">Manage Users</span>
            <span class="btn-badge">{{ stats.totalCandidates }}</span>
          </button>
          <button
            class="action-btn secondary"
            (click)="navigateTo('/analytics')"
          >
            <span class="btn-icon">📊</span>
            <span class="btn-text">Analytics</span>
          </button>
          <button
            class="action-btn secondary"
            (click)="navigateTo('/settings')"
          >
            <span class="btn-icon">⚙️</span>
            <span class="btn-text">System Settings</span>
          </button>
          <button class="action-btn accent" (click)="navigateTo('/reports')">
            <span class="btn-icon">📈</span>
            <span class="btn-text">Reports</span>
          </button>
        </div>
      </div>

      <!-- Recruiter Dashboard -->
      <div
        *ngIf="currentUser?.role === UserRole.RECRUITER"
        class="role-dashboard"
      >
        <h3 class="role-title">🎯 Recruiter Hub</h3>
        <div class="quick-actions">
          <button
            class="action-btn primary"
            (click)="navigateTo('/jobs/create')"
          >
            <span class="btn-icon">💼</span>
            <span class="btn-text">Post New Job</span>
          </button>
          <button
            class="action-btn secondary"
            (click)="navigateTo('/applications')"
          >
            <span class="btn-icon">📋</span>
            <span class="btn-text">Review Applications</span>
            <span class="btn-badge">{{ stats.totalApplications }}</span>
          </button>
          <button
            class="action-btn secondary"
            (click)="navigateTo('/candidates')"
          >
            <span class="btn-icon">👥</span>
            <span class="btn-text">Browse Candidates</span>
          </button>
          <button class="action-btn accent" (click)="navigateTo('/interviews')">
            <span class="btn-icon">📅</span>
            <span class="btn-text">Schedule Interviews</span>
            <span class="btn-badge">{{ stats.totalInterviews }}</span>
          </button>
        </div>
      </div>

      <!-- Candidate Dashboard -->
      <div
        *ngIf="currentUser?.role === UserRole.CANDIDATE"
        class="role-dashboard"
      >
        <h3 class="role-title">🚀 Your Career Journey</h3>
        <div class="quick-actions">
          <button class="action-btn primary" (click)="navigateTo('/jobs')">
            <span class="btn-icon">🔍</span>
            <span class="btn-text">Browse Jobs</span>
            <span class="btn-badge">{{ stats.totalJobs }}</span>
          </button>
          <button class="action-btn secondary" (click)="navigateTo('/profile')">
            <span class="btn-icon">📄</span>
            <span class="btn-text">Update Profile</span>
          </button>
          <button
            class="action-btn secondary"
            (click)="navigateTo('/applications')"
          >
            <span class="btn-icon">📊</span>
            <span class="btn-text">My Applications</span>
            <span class="btn-badge">{{ myApplicationsCount }}</span>
          </button>
          <button class="action-btn accent" (click)="navigateTo('/interviews')">
            <span class="btn-icon">📅</span>
            <span class="btn-text">My Interviews</span>
          </button>
        </div>
      </div>

      <!-- Dashboard Content -->
      <div class="dashboard-content">
        <!-- Quick Actions -->
        <div class="content-card quick-actions">
          <h3><i class="fas fa-bolt"></i> Quick Actions</h3>
          <div class="actions-grid">
            <button
              class="action-btn"
              *ngIf="authService.isRecruiter() || authService.isAdmin()"
              routerLink="/jobs/create"
            >
              <i class="fas fa-plus-circle"></i>
              <span>Post New Job</span>
            </button>
            <button class="action-btn" routerLink="/applications">
              <i class="fas fa-file-alt"></i>
              <span>View Applications</span>
            </button>
            <button class="action-btn" routerLink="/candidates">
              <i class="fas fa-users"></i>
              <span>Browse Candidates</span>
            </button>
            <button class="action-btn" routerLink="/analytics">
              <i class="fas fa-chart-bar"></i>
              <span>View Analytics</span>
            </button>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="content-card recent-activity">
          <h3><i class="fas fa-clock"></i> Recent Activity</h3>
          <div class="activity-list">
            <div
              class="activity-item"
              *ngFor="let activity of recentActivities"
            >
              <div class="activity-icon">
                <i [class]="activity.icon"></i>
              </div>
              <div class="activity-content">
                <p class="activity-text">{{ activity.text }}</p>
                <span class="activity-time">{{
                  getTimeAgo(activity.timestamp)
                }}</span>
              </div>
            </div>
            <div class="no-activity" *ngIf="!recentActivities?.length">
              <p>No recent activity to display</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .modern-dashboard {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
    }

    .hero-section {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 20px;
      padding: 3rem;
      margin-bottom: 2rem;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(10px);
    }

    .greeting h1 {
      font-size: 2.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      font-size: 1.2rem;
      color: #6b7280;
      margin-bottom: 2rem;
    }

    .hero-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .stat-card {
      background: linear-gradient(135deg, #f8fafc, #e2e8f0);
      border-radius: 15px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.5rem;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
      display: block;
    }

    .stat-label {
      color: #6b7280;
      font-size: 0.9rem;
    }

    .dashboard-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
    }

    .content-card {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 20px;
      padding: 2rem;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(10px);
    }

    .content-card h3 {
      font-size: 1.3rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .content-card h3 i {
      color: #667eea;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
    }

    .action-btn {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border: none;
      border-radius: 12px;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
    }

    .action-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
    }

    .action-btn i {
      font-size: 1.5rem;
    }

    .activity-list {
      max-height: 400px;
      overflow-y: auto;
    }

    .activity-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem 0;
      border-bottom: 1px solid #e5e7eb;
    }

    .activity-item:last-child {
      border-bottom: none;
    }

    .activity-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
    }

    .activity-text {
      margin: 0 0 0.25rem 0;
      color: #1f2937;
      font-weight: 500;
    }

    .activity-time {
      color: #6b7280;
      font-size: 0.85rem;
    }

    .no-activity {
      text-align: center;
      color: #6b7280;
      font-style: italic;
    }
  }

  @media (min-width: 769px) and (max-width: 992px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .main-content {
      grid-template-columns: 1fr 300px;
    }
  }
`,
  ],
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalApplications: 0,
    totalJobs: 0,
    totalCandidates: 0,
    totalInterviews: 0,
  };

  recentActivities: Activity[] = [];
  loading = false;
  error: string | null = null;
  currentUser: User | null = null;
  myApplicationsCount = 0;
  UserRole = UserRole;

  constructor(
    private apiService: ApiService,
    public authService: AuthService,
    private analyticsService: AnalyticsService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const apiUser = this.authService.getCurrentUser();
    if (apiUser) {
      // Convert ApiUser to User format
      this.currentUser = {
        id: apiUser.id,
        email: apiUser.email,
        firstName: apiUser.fullName?.split(' ')[0] || '',
        lastName: apiUser.fullName?.split(' ').slice(1).join(' ') || '',
        role: apiUser.role as any,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      };
    }
    this.loadDashboardData();
  }

  navigateTo(route: string): void {
    void this.router.navigate([route]);
  }

  private loadDashboardData(): void {
    this.loading = true;

    // Load dashboard data based on user role
    const userRole = this.currentUser?.role?.toLowerCase() || 'candidate';
    this.apiService.getDashboard(userRole).subscribe({
      next: (data: any) => {
        console.log('Dashboard data received:', data);
        this.stats = {
          totalApplications: data.stats?.totalApplications || 0,
          totalJobs: data.stats?.totalJobs || 0,
          totalCandidates: data.stats?.totalUsers || 0,
          totalInterviews: data.stats?.totalInterviews || 0,
        };
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading dashboard data:', error);
        this.loadFallbackData();
      },
    });

    // Load recent activities from audit logs
    this.loadRecentActivities();
  }

  private getActivityIcon(action: string): string {
    if (action?.includes('job')) return 'fas fa-briefcase';
    if (action?.includes('application')) return 'fas fa-file-alt';
    if (action?.includes('interview')) return 'fas fa-calendar';
    if (action?.includes('user')) return 'fas fa-user';
    return 'fas fa-info-circle';
  }

  private loadFallbackData(): void {
    // Set default values on error
    this.stats = {
      totalApplications: 0,
      totalJobs: 0,
      totalCandidates: 0,
      totalInterviews: 0,
    };
    this.loading = false;
  }

  private loadRecentActivities(): void {
    // For now, set empty activities since the endpoint might not exist
    this.recentActivities = [];
  }

  getTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - timestamp.getTime()) / 1000,
    );

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  }
}
