import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { DashboardService, AdminStats, RecruiterStats, CandidateStats } from '../../core/services/dashboard.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface ApiUser {
  id: string;
  email: string;
  role: string;
  fullName?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="modern-dashboard">
      <!-- Enhanced Header Navigation -->
      <div class="dashboard-header">
        <div class="header-content">
          <div class="logo-section">
            <div class="logo">
              <i class="fas fa-brain"></i>
              <span>AI Hire Pro</span>
            </div>
          </div>
          <nav class="header-nav">
            <a routerLink="/dashboard" class="nav-link active">
              <i class="fas fa-tachometer-alt"></i>
              Dashboard
            </a>
            <a routerLink="/jobs" class="nav-link">
              <i class="fas fa-briefcase"></i>
              Jobs
            </a>
            <a routerLink="/applications" class="nav-link">
              <i class="fas fa-file-alt"></i>
              Applications
            </a>
            <a routerLink="/candidates" class="nav-link" *ngIf="!authService.isCandidate()">
              <i class="fas fa-users"></i>
              Candidates
            </a>
            <a routerLink="/analytics" class="nav-link" *ngIf="!authService.isCandidate()">
              <i class="fas fa-chart-bar"></i>
              Analytics
            </a>
            <a routerLink="/ai-insights" class="nav-link" *ngIf="!authService.isCandidate()">
              <i class="fas fa-brain"></i>
              AI Insights
            </a>
            <a routerLink="/profile" class="nav-link">
              <i class="fas fa-user"></i>
              Profile
            </a>
          </nav>
          <div class="header-actions">
            <div class="user-info">
              <div class="user-avatar">
                <i class="fas fa-user-circle"></i>
              </div>
              <span class="user-name">{{ getUserName() }}</span>
              <span class="user-role">{{ userRole }}</span>
            </div>
            <button class="logout-btn" (click)="logout()">
              <i class="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Hero Section -->
      <div class="hero-section">
        <div class="hero-background">
          <div class="gradient-orb orb-1"></div>
          <div class="gradient-orb orb-2"></div>
          <div class="floating-particles">
            <div class="particle" *ngFor="let particle of particles"></div>
          </div>
        </div>
        <div class="hero-content">
          <div class="hero-icon">
            <i class="fas fa-tachometer-alt"></i>
          </div>
          <h1 class="hero-title">{{ getDashboardTitle() }}</h1>
          <p class="hero-subtitle">
            {{ getDashboardSubtitle() }}
          </p>
        </div>
      </div>

      <!-- Dashboard Content -->
      <div class="dashboard-content">
        <!-- ADMIN DASHBOARD -->
        <div *ngIf="userRole === 'ADMIN'" class="admin-dashboard">
          <!-- Admin Stats Grid -->
          <!-- Enhanced Admin Stats with Charts -->
          <div class="stats-grid">
            <div class="stat-card users-card">
              <div class="stat-icon">
                <i class="fas fa-users"></i>
              </div>
              <div class="stat-content">
                <div class="stat-header">
                  <h3>Total Users</h3>
                  <div class="stat-trend positive">
                    <i class="fas fa-arrow-up"></i>
                    <span>+12%</span>
                  </div>
                </div>
                <div class="stat-value">{{ adminStats.totalUsers || 0 }}</div>
                <div class="stat-breakdown">
                  <div class="breakdown-item">
                    <span class="breakdown-label">Recruiters</span>
                    <span class="breakdown-value">{{ adminStats.recruiters || 0 }}</span>
                  </div>
                  <div class="breakdown-item">
                    <span class="breakdown-label">Candidates</span>
                    <span class="breakdown-value">{{ adminStats.candidates || 0 }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="stat-card revenue-card">
              <div class="stat-icon">
                <i class="fas fa-chart-line"></i>
              </div>
              <div class="stat-content">
                <div class="stat-header">
                  <h3>System Performance</h3>
                  <div class="stat-trend positive">
                    <i class="fas fa-arrow-up"></i>
                    <span>+15%</span>
                  </div>
                </div>
                <div class="stat-value">{{ adminStats.systemHealth || 98 }}%</div>
                <div class="stat-detail">Uptime: 99.9%</div>
              </div>
            </div>

            <div class="stat-card jobs-card">
              <div class="stat-icon">
                <i class="fas fa-briefcase"></i>
              </div>
              <div class="stat-content">
                <div class="stat-header">
                  <h3>Active Jobs</h3>
                  <div class="stat-trend positive">
                    <i class="fas fa-arrow-up"></i>
                    <span>+5%</span>
                  </div>
                </div>
                <div class="stat-value">{{ adminStats.totalJobs || 0 }}</div>
                <div class="stat-detail">{{ adminStats.activeInterviews || 0 }} interviews scheduled</div>
              </div>
            </div>

            <div class="stat-card applications-card">
              <div class="stat-icon">
                <i class="fas fa-file-alt"></i>
              </div>
              <div class="stat-content">
                <div class="stat-header">
                  <h3>Applications</h3>
                  <div class="stat-trend positive">
                    <i class="fas fa-arrow-up"></i>
                    <span>+23%</span>
                  </div>
                </div>
                <div class="stat-value">{{ adminStats.totalApplications || 0 }}</div>
                <div class="stat-detail">{{ adminStats.pendingApplications || 0 }} pending review</div>
              </div>
            </div>
          </div>

          <!-- Charts Section -->
          <div class="charts-section">
            <div class="chart-container">
              <div class="chart-header">
                <h3>User Growth Analytics</h3>
                <div class="chart-controls">
                  <button class="chart-btn active" (click)="setChartPeriod('week')">Week</button>
                  <button class="chart-btn" (click)="setChartPeriod('month')">Month</button>
                  <button class="chart-btn" (click)="setChartPeriod('year')">Year</button>
                </div>
              </div>
              <div class="chart-content">
                <canvas id="userGrowthChart" width="400" height="200"></canvas>
              </div>
            </div>

            <div class="chart-container">
              <div class="chart-header">
                <h3>Application Status Distribution</h3>
              </div>
              <div class="chart-content">
                <canvas id="applicationStatusChart" width="400" height="200"></canvas>
              </div>
            </div>
          </div>

          <!-- Permission Management Panel -->
          <div class="permission-panel">
            <div class="panel-header">
              <div class="panel-icon permission">
                <i class="fas fa-shield-alt"></i>
              </div>
              <h3>Permission Management</h3>
            </div>
            <div class="panel-content">
              <div class="permission-grid">
                <div class="permission-card">
                  <div class="permission-header">
                    <h4>Recruiter Permissions</h4>
                    <div class="permission-toggle">
                      <input type="checkbox" id="recruiterPerms" [(ngModel)]="recruiterPermissions.canCreateJobs" (change)="updatePermissions('recruiter')">
                      <label for="recruiterPerms"></label>
                    </div>
                  </div>
                  <div class="permission-list">
                    <div class="permission-item">
                      <span>Create Jobs</span>
                      <input type="checkbox" [(ngModel)]="recruiterPermissions.canCreateJobs">
                    </div>
                    <div class="permission-item">
                      <span>Review Applications</span>
                      <input type="checkbox" [(ngModel)]="recruiterPermissions.canReviewApplications">
                    </div>
                    <div class="permission-item">
                      <span>Schedule Interviews</span>
                      <input type="checkbox" [(ngModel)]="recruiterPermissions.canScheduleInterviews">
                    </div>
                  </div>
                </div>

                <div class="permission-card">
                  <div class="permission-header">
                    <h4>Candidate Permissions</h4>
                    <div class="permission-toggle">
                      <input type="checkbox" id="candidatePerms" [(ngModel)]="candidatePermissions.canApply" (change)="updatePermissions('candidate')">
                      <label for="candidatePerms"></label>
                    </div>
                  </div>
                  <div class="permission-list">
                    <div class="permission-item">
                      <span>Apply to Jobs</span>
                      <input type="checkbox" [(ngModel)]="candidatePermissions.canApply">
                    </div>
                    <div class="permission-item">
                      <span>Upload Resume</span>
                      <input type="checkbox" [(ngModel)]="candidatePermissions.canUploadResume">
                    </div>
                    <div class="permission-item">
                      <span>View Applications</span>
                      <input type="checkbox" [(ngModel)]="candidatePermissions.canViewApplications">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Admin Action Panels -->
          <div class="action-panels">
            <div class="action-panel">
              <div class="panel-header">
                <div class="panel-icon urgent">
                  <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3>Urgent Actions</h3>
              </div>
              <div class="panel-content">
                <div class="action-item">
                  <div class="action-info">
                    <div class="action-badge urgent">{{ adminStats.pendingApprovals || 0 }}</div>
                    <div class="action-text">
                      <div class="action-title">Pending Approvals</div>
                      <div class="action-subtitle">Job postings awaiting review</div>
                    </div>
                  </div>
                  <button class="action-btn secondary" (click)="navigateTo('/jobs')">
                    <i class="fas fa-bell"></i>
                    Review
                  </button>
                </div>
                <div class="action-item">
                  <div class="action-info">
                    <div class="action-badge warning">{{ adminStats.systemAlerts || 0 }}</div>
                    <div class="action-text">
                      <div class="action-title">System Alerts</div>
                      <div class="action-subtitle">Monitoring notifications</div>
                    </div>
                  </div>
                  <button class="action-btn secondary" (click)="navigateTo('/analytics')">
                    <i class="fas fa-exclamation-triangle"></i>
                    View
                  </button>
                </div>
              </div>
            </div>
            
            <div class="action-panel">
              <div class="panel-header">
                <div class="panel-icon management">
                  <i class="fas fa-cogs"></i>
                </div>
                <h3>System Management</h3>
              </div>
              <div class="panel-content">
                <div class="management-grid">
                  <button class="management-card" (click)="navigateTo('/admin/users')">
                    <div class="management-icon">
                      <i class="fas fa-users-cog"></i>
                    </div>
                    <div class="management-text">
                      <div class="management-title">User Management</div>
                      <div class="management-subtitle">Manage users & permissions</div>
                    </div>
                  </button>
                  
                  <button class="management-card" (click)="navigateTo('/admin/analytics')">
                    <div class="management-icon">
                      <i class="fas fa-chart-bar"></i>
                    </div>
                    <div class="management-text">
                      <div class="management-title">Analytics</div>
                      <div class="management-subtitle">Analytics & insights</div>
                    </div>
                  </button>
                  
                  <button class="management-card" (click)="navigateTo('/admin/settings')">
                    <div class="management-icon">
                      <i class="fas fa-cog"></i>
                    </div>
                    <div class="management-text">
                      <div class="management-title">Settings</div>
                      <div class="management-subtitle">System configuration</div>
                    </div>
                  </button>
                  
                  <button class="management-card" (click)="navigateTo('/admin/reports')">
                    <div class="management-icon">
                      <i class="fas fa-file-alt"></i>
                    </div>
                    <div class="management-text">
                      <div class="management-title">Reports</div>
                      <div class="management-subtitle">Generate reports</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- RECRUITER DASHBOARD -->
        <div *ngIf="userRole === 'RECRUITER'" class="recruiter-dashboard">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-briefcase"></i>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ recruiterStats.myActiveJobs }}</div>
                <div class="stat-detail">Active Job Postings</div>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-users"></i>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ recruiterStats.totalApplicationsReceived }}</div>
                <div class="stat-detail">Applications Received</div>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-calendar-check"></i>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ recruiterStats.interviewsScheduled }}</div>
                <div class="stat-detail">Interviews Scheduled</div>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-user-check"></i>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ recruiterStats.candidatesHired }}</div>
                <div class="stat-detail">Candidates Hired</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-clock"></i>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ recruiterStats.avgTimeToHire }}</div>
                <div class="stat-detail">Avg. Days to Hire</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-percentage"></i>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ recruiterStats.applicationConversionRate }}%</div>
                <div class="stat-detail">Conversion Rate</div>
              </div>
            </div>
          </div>

          <div class="dashboard-panels">
            <!-- Quick Actions Panel -->
            <div class="action-panel">
              <div class="panel-header">
                <div class="panel-icon urgent">
                  <i class="fas fa-rocket"></i>
                </div>
                <h3>Quick Actions</h3>
              </div>
              <div class="panel-content">
                <div class="management-grid">
                  <button class="management-card" (click)="navigateTo('/jobs/create')">
                    <div class="management-icon">
                      <i class="fas fa-plus"></i>
                    </div>
                    <div class="management-text">
                      <div class="management-title">Post New Job</div>
                      <div class="management-subtitle">Create job posting</div>
                    </div>
                  </button>
                  
                  <button class="management-card" (click)="navigateTo('/applications')">
                    <div class="management-icon">
                      <i class="fas fa-inbox"></i>
                    </div>
                    <div class="management-text">
                      <div class="management-title">Review Applications</div>
                      <div class="management-subtitle">{{ recruiterStats.pendingReviews }} pending</div>
                    </div>
                  </button>

                  <button class="management-card" (click)="navigateTo('/interviews')">
                    <div class="management-icon">
                      <i class="fas fa-video"></i>
                    </div>
                    <div class="management-text">
                      <div class="management-title">Schedule Interview</div>
                      <div class="management-subtitle">Manage interviews</div>
                    </div>
                  </button>

                  <button class="management-card" (click)="navigateTo('/screening')">
                    <div class="management-icon">
                      <i class="fas fa-robot"></i>
                    </div>
                    <div class="management-text">
                      <div class="management-title">AI Screening</div>
                      <div class="management-subtitle">Automated review</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <!-- Recent Applications Panel -->
            <div class="action-panel">
              <div class="panel-header">
                <div class="panel-icon info">
                  <i class="fas fa-file-alt"></i>
                </div>
                <h3>Recent Applications</h3>
              </div>
              <div class="panel-content">
                <div class="recent-applications" *ngIf="recruiterStats.recentApplications?.length; else noApplications">
                  <div class="application-item" *ngFor="let app of recruiterStats.recentApplications">
                    <div class="application-info">
                      <div class="candidate-name">{{ app.candidate?.fullName }}</div>
                      <div class="job-title">{{ app.job?.title }}</div>
                      <div class="application-date">{{ formatDate(app.createdAt) }}</div>
                    </div>
                    <div class="application-status" [class]="'status-' + app.status.toLowerCase()">
                      {{ app.status }}
                    </div>
                  </div>
                </div>
                <ng-template #noApplications>
                  <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>No recent applications</p>
                  </div>
                </ng-template>
              </div>
            </div>

            <!-- Top Skills in Demand -->
            <div class="action-panel">
              <div class="panel-header">
                <div class="panel-icon success">
                  <i class="fas fa-chart-line"></i>
                </div>
                <h3>Top Skills in Demand</h3>
              </div>
              <div class="panel-content">
                <div class="skills-list">
                  <div class="skill-item" *ngFor="let skill of recruiterStats.topSkillsInDemand">
                    <span class="skill-name">{{ skill }}</span>
                    <div class="skill-bar">
                      <div class="skill-progress" [style.width.%]="getSkillDemandPercentage(skill)"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CANDIDATE DASHBOARD -->
        <div *ngIf="userRole === 'CANDIDATE'" class="candidate-dashboard">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-paper-plane"></i>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ candidateStats.applicationsSubmitted }}</div>
                <div class="stat-detail">Applications Submitted</div>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-handshake"></i>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ candidateStats.interviewsScheduled }}</div>
                <div class="stat-detail">Interviews Scheduled</div>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-star"></i>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ candidateStats.skillMatchScore }}%</div>
                <div class="stat-detail">Skill Match Score</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-eye"></i>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ candidateStats.profileViews }}</div>
                <div class="stat-detail">Profile Views</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-percentage"></i>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ candidateStats.applicationResponseRate }}%</div>
                <div class="stat-detail">Response Rate</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-lightbulb"></i>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ candidateStats.recommendedJobs }}</div>
                <div class="stat-detail">Recommended Jobs</div>
              </div>
            </div>
          </div>

          <div class="dashboard-panels">
            <!-- Quick Actions Panel -->
            <div class="action-panel">
              <div class="panel-header">
                <div class="panel-icon urgent">
                  <i class="fas fa-search"></i>
                </div>
                <h3>Job Search</h3>
              </div>
              <div class="panel-content">
                <div class="management-grid">
                  <button class="management-card" (click)="navigateTo('/jobs')">
                    <div class="management-icon">
                      <i class="fas fa-search"></i>
                    </div>
                    <div class="management-text">
                      <div class="management-title">Browse Jobs</div>
                      <div class="management-subtitle">{{ candidateStats.jobsViewed }} viewed</div>
                    </div>
                  </button>

                  <button class="management-card" (click)="navigateTo('/applications')">
                    <div class="management-icon">
                      <i class="fas fa-file-alt"></i>
                    </div>
                    <div class="management-text">
                      <div class="management-title">My Applications</div>
                      <div class="management-subtitle">Track progress</div>
                    </div>
                  </button>

                  <button class="management-card" (click)="navigateTo('/profile')">
                    <div class="management-icon">
                      <i class="fas fa-user-edit"></i>
                    </div>
                    <div class="management-text">
                      <div class="management-title">Update Profile</div>
                      <div class="management-subtitle">Improve visibility</div>
                    </div>
                  </button>

                  <button class="management-card" (click)="navigateTo('/interviews')">
                    <div class="management-icon">
                      <i class="fas fa-calendar"></i>
                    </div>
                    <div class="management-text">
                      <div class="management-title">Interviews</div>
                      <div class="management-subtitle">Upcoming schedule</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <!-- My Applications Status Panel -->
            <div class="action-panel">
              <div class="panel-header">
                <div class="panel-icon info">
                  <i class="fas fa-chart-pie"></i>
                </div>
                <h3>Application Status</h3>
              </div>
              <div class="panel-content">
                <div class="application-status-grid" *ngIf="candidateStats.applicationsByStatus">
                  <div class="status-item" *ngFor="let status of getApplicationStatusKeys()">
                    <div class="status-info">
                      <div class="status-count">{{ candidateStats.applicationsByStatus[status] || 0 }}</div>
                      <div class="status-label">{{ formatStatusLabel(status) }}</div>
                    </div>
                    <div class="status-bar">
                      <div class="status-progress" 
                           [style.width.%]="getStatusPercentage(status)"
                           [class]="'status-' + status.toLowerCase()">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Jobs Panel -->
            <div class="action-panel">
              <div class="panel-header">
                <div class="panel-icon success">
                  <i class="fas fa-briefcase"></i>
                </div>
                <h3>Recommended Jobs</h3>
              </div>
              <div class="panel-content">
                <div class="recent-jobs" *ngIf="candidateStats.recentJobs?.length; else noJobs">
                  <div class="job-item" *ngFor="let job of candidateStats.recentJobs">
                    <div class="job-info">
                      <div class="job-title">{{ job.title }}</div>
                      <div class="job-description">{{ truncateText(job.description, 100) }}</div>
                    </div>
                    <button class="job-apply-btn" (click)="navigateTo('/jobs/' + job.id)">
                      <i class="fas fa-arrow-right"></i>
                      View
                    </button>
                  </div>
                </div>
                <ng-template #noJobs>
                  <div class="empty-state">
                    <i class="fas fa-briefcase"></i>
                    <p>No recommended jobs available</p>
                    <button class="action-btn primary" (click)="navigateTo('/jobs')">
                      Browse All Jobs
                    </button>
                  </div>
                </ng-template>
              </div>
            </div>

            <!-- Profile Completion Panel -->
            <div class="action-panel">
              <div class="panel-header">
                <div class="panel-icon warning">
                  <i class="fas fa-user-cog"></i>
                </div>
                <h3>Profile Completion</h3>
              </div>
              <div class="panel-content">
                <div class="profile-completion">
                  <div class="completion-header">
                    <span class="completion-text">Profile Strength</span>
                    <span class="completion-percentage">{{ getProfileCompletionPercentage() }}%</span>
                  </div>
                  <div class="completion-bar">
                    <div class="completion-progress" [style.width.%]="getProfileCompletionPercentage()"></div>
                  </div>
                  <div class="completion-tips">
                    <div class="tip-item" *ngFor="let tip of getProfileTips()">
                      <i class="fas fa-lightbulb"></i>
                      <span>{{ tip }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modern-dashboard {
      min-height: 100vh;
      background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%);
      position: relative;
      overflow-x: hidden;
    }

    .hero-section {
      position: relative;
      height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .hero-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
    }

    .gradient-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(40px);
      opacity: 0.7;
      animation: float 6s ease-in-out infinite;
    }

    .orb-1 {
      width: 200px;
      height: 200px;
      background: linear-gradient(45deg, #10b981, #059669);
      top: 20%;
      left: 10%;
      animation-delay: 0s;
    }

    .orb-2 {
      width: 150px;
      height: 150px;
      background: linear-gradient(45deg, #059669, #047857);
      top: 60%;
      right: 15%;
      animation-delay: 3s;
    }

    .floating-particles {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }

    .particle {
      position: absolute;
      width: 4px;
      height: 4px;
      background: rgba(16, 185, 129, 0.6);
      border-radius: 50%;
      animation: particleFloat 8s linear infinite;
    }

    .particle:nth-child(1) { left: 10%; animation-delay: 0s; }
    .particle:nth-child(2) { left: 20%; animation-delay: 1s; }
    .particle:nth-child(3) { left: 30%; animation-delay: 2s; }
    .particle:nth-child(4) { left: 40%; animation-delay: 3s; }
    .particle:nth-child(5) { left: 60%; animation-delay: 4s; }
    .particle:nth-child(6) { left: 80%; animation-delay: 5s; }

    .hero-content {
      position: relative;
      z-index: 2;
      text-align: center;
      color: white;
    }

    .hero-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      color: #10b981;
    }

    .hero-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      background: linear-gradient(45deg, #10b981, #34d399);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-subtitle {
      font-size: 1.1rem;
      opacity: 0.9;
      margin: 0;
    }

    .dashboard-content {
      position: relative;
      z-index: 2;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      padding: 1.5rem;
      color: white;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px rgba(16, 185, 129, 0.2);
      border-color: rgba(16, 185, 129, 0.4);
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #10b981, #34d399);
    }

    .stat-icon {
      font-size: 2rem;
      color: #10b981;
      margin-bottom: 1rem;
    }

    .stat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .stat-header h3 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      opacity: 0.9;
    }

    .stat-trend {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.875rem;
      font-weight: 600;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
    }

    .stat-trend.positive {
      background: rgba(16, 185, 129, 0.2);
      color: #34d399;
    }

    .stat-trend.warning {
      background: rgba(245, 158, 11, 0.2);
      color: #fbbf24;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: #10b981;
    }

    .stat-detail {
      font-size: 0.875rem;
      opacity: 0.8;
    }

    .stat-breakdown {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .breakdown-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
    }

    .breakdown-label {
      font-size: 0.875rem;
      opacity: 0.8;
    }

    .breakdown-value {
      font-weight: 600;
      color: #10b981;
    }

    .action-panels {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
    }

    .action-panel {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      overflow: hidden;
      color: white;
    }

    .panel-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.05);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .panel-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
    }

    .panel-icon.urgent {
      background: linear-gradient(45deg, #ef4444, #dc2626);
    }

    .panel-icon.management {
      background: linear-gradient(45deg, #10b981, #059669);
    }

    .panel-header h3 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .panel-content {
      padding: 1.5rem;
    }

    .action-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .action-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex: 1;
    }

    .action-badge {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.875rem;
    }

    .action-badge.urgent {
      background: linear-gradient(45deg, #ef4444, #dc2626);
      color: white;
    }
    
    .action-badge.warning {
      background: linear-gradient(45deg, #f59e0b, #d97706);
      color: white;
    }

    .action-text {
      flex: 1;
    }

    .action-title {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .action-subtitle {
      font-size: 0.875rem;
      opacity: 0.8;
    }

    .action-btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
    }

    .action-btn.primary {
      background: linear-gradient(45deg, #10b981, #059669);
      color: white;
    }

    .action-btn.secondary {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .action-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
    }

    .management-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .management-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: left;
      color: white;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .management-card:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(16, 185, 129, 0.4);
      transform: translateY(-2px);
    }

    .management-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: linear-gradient(45deg, #10b981, #059669);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      color: white;
    }

    .management-text {
      flex: 1;
    }

    .management-title {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .management-subtitle {
      font-size: 0.875rem;
      opacity: 0.8;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      33% { transform: translateY(-20px) rotate(120deg); }
      66% { transform: translateY(10px) rotate(240deg); }
    }

    @keyframes particleFloat {
      0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 2rem;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .action-panels {
        grid-template-columns: 1fr;
      }
      
      .management-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit, AfterViewInit {
  user: ApiUser | null = null;
  loading = false;
  error: string | null = null;
  userRole: string = '';
  particles: any[] = Array.from({ length: 50 }, (_, i) => ({ id: i }));
  
  // Dashboard data
  adminStats: AdminStats & { recruiters?: number; candidates?: number; activeInterviews?: number; pendingApprovals?: number } = {
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    activeRecruiters: 0,
    systemHealth: 98,
    pendingApplications: 0,
    systemAlerts: 0,
    recentActivity: [],
    recruiters: 0,
    candidates: 0,
    activeInterviews: 0,
    pendingApprovals: 0
  };
  
  recruiterStats: RecruiterStats = {
    myActiveJobs: 0,
    totalApplicationsReceived: 0,
    interviewsScheduled: 0,
    candidatesHired: 0,
    avgTimeToHire: 0,
    topSkillsInDemand: [],
    applicationConversionRate: 0,
    pendingReviews: 0,
    recentApplications: []
  };
  
  candidateStats: CandidateStats = {
    applicationsSubmitted: 0,
    interviewsScheduled: 0,
    jobsViewed: 0,
    profileViews: 0,
    skillMatchScore: 0,
    recommendedJobs: 0,
    applicationResponseRate: 0,
    applicationsByStatus: {},
    recentJobs: []
  };
  
  // Chart instances
  userGrowthChart: Chart | null = null;
  applicationStatusChart: Chart | null = null;
  chartPeriod = 'month';
  
  // Permission management
  recruiterPermissions = {
    canCreateJobs: true,
    canReviewApplications: true,
    canScheduleInterviews: true
  };
  
  candidatePermissions = {
    canApply: true,
    canUploadResume: true,
    canViewApplications: true
  };

  constructor(
    public authService: AuthService,
    private router: Router,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadDashboardData();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.user?.role === 'ADMIN') {
        this.initializeCharts();
      }
    }, 100);
  }

  private loadUserData(): void {
    this.user = this.authService.getCurrentUser();
    this.userRole = this.user?.role || '';
  }

  private loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    const userRole = this.user?.role;
    if (!userRole) {
      this.error = 'User role not found';
      this.loading = false;
      return;
    }

    this.dashboardService.getDashboardStats(userRole).pipe(
      catchError(error => {
        this.error = 'Failed to load dashboard data';
        return of(null);
      }),
      finalize(() => this.loading = false)
    ).subscribe((stats: AdminStats | RecruiterStats | CandidateStats | null) => {
      if (stats) {
        switch (userRole) {
          case 'ADMIN':
            this.adminStats = { ...this.adminStats, ...stats as AdminStats };
            break;
          case 'RECRUITER':
            this.recruiterStats = stats as RecruiterStats;
            break;
          case 'CANDIDATE':
            this.candidateStats = stats as CandidateStats;
            break;
        }
      }
    });
  }

  getDashboardTitle(): string {
    switch (this.user?.role) {
      case 'ADMIN': return 'Admin Dashboard';
      case 'RECRUITER': return 'Recruiter Dashboard';
      case 'CANDIDATE': return 'Candidate Dashboard';
      default: return 'Dashboard';
    }
  }

  getDashboardSubtitle(): string {
    switch (this.user?.role) {
      case 'ADMIN': return 'Manage your hiring platform and monitor system performance';
      case 'RECRUITER': return 'Manage your job postings and candidate pipeline';
      case 'CANDIDATE': return 'Track your applications and discover opportunities';
      default: return 'Welcome to your hiring management platform';
    }
  }

  getUserName(): string {
    if (this.user?.fullName) {
      return this.user.fullName;
    }
    return this.user?.email?.split('@')[0] || 'User';
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
  
  setChartPeriod(period: string): void {
    this.chartPeriod = period;
    this.updateCharts();
  }
  
  updatePermissions(role: string): void {
    console.log(`Updating ${role} permissions:`, 
      role === 'recruiter' ? this.recruiterPermissions : this.candidatePermissions);
  }
  
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
  
  private initializeCharts(): void {
    this.createUserGrowthChart();
    this.createApplicationStatusChart();
  }
  
  private createUserGrowthChart(): void {
    const ctx = document.getElementById('userGrowthChart') as HTMLCanvasElement;
    if (!ctx) return;
    
    this.userGrowthChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'New Users',
          data: [12, 19, 8, 15, 25, 32],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(16, 185, 129, 0.1)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }
  
  private createApplicationStatusChart(): void {
    const ctx = document.getElementById('applicationStatusChart') as HTMLCanvasElement;
    if (!ctx) return;
    
    this.applicationStatusChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Pending', 'Interview', 'Accepted', 'Rejected'],
        datasets: [{
          data: [45, 25, 15, 15],
          backgroundColor: [
            '#f59e0b',
            '#3b82f6',
            '#10b981',
            '#ef4444'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true
            }
          }
        }
      }
    });
  }
  
  private updateCharts(): void {
    if (this.userGrowthChart) {
      const newData = this.chartPeriod === 'week' 
        ? [5, 8, 12, 15, 18, 22, 25]
        : this.chartPeriod === 'month'
        ? [12, 19, 8, 15, 25, 32]
        : [120, 190, 80, 150, 250, 320, 280, 340, 290, 380, 420, 450];
      
      this.userGrowthChart.data.datasets[0].data = newData;
      this.userGrowthChart.update();
    }
    
    if (this.applicationStatusChart) {
      this.applicationStatusChart.update();
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getSkillDemandPercentage(skill: string): number {
    const skillIndex = this.recruiterStats?.topSkillsInDemand?.indexOf(skill) || 0;
    return Math.max(90 - (skillIndex * 15), 30);
  }

  getApplicationStatusKeys(): string[] {
    return Object.keys(this.candidateStats?.applicationsByStatus || {});
  }

  formatStatusLabel(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  }

  getStatusPercentage(status: string): number {
    const total = Object.values(this.candidateStats?.applicationsByStatus || {})
      .reduce((sum: number, count: any) => sum + (count as number), 0);
    const statusCount = this.candidateStats?.applicationsByStatus?.[status] || 0;
    return total > 0 ? (statusCount / total) * 100 : 0;
  }

  truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  getProfileCompletionPercentage(): number {
    return 75;
  }

  getProfileTips(): string[] {
    return [
      'Add a professional photo',
      'Update your skills section',
      'Complete work experience',
      'Add portfolio links'
    ];
  }


}
