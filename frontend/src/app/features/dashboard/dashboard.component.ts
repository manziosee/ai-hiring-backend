import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

// Define ApiUser interface locally to avoid import issues
interface ApiUser {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
}

interface AdminStats {
  totalUsers: number;
  recruiters: number;
  candidates: number;
  totalJobs: number;
  totalApplications: number;
  systemUptime: string;
  activeInterviews: number;
  pendingApprovals: number;
  monthlyRevenue: number;
  storageUsed: number;
}

interface RecruiterStats {
  myActiveJobs: number;
  totalApplicationsReceived: number;
  interviewsScheduled: number;
  candidatesHired: number;
  avgTimeToHire: number;
  topSkillsInDemand: string[];
  applicationConversionRate: number;
  pendingReviews: number;
}

interface CandidateStats {
  applicationsSubmitted: number;
  interviewsScheduled: number;
  jobsViewed: number;
  profileViews: number;
  skillMatchScore: number;
  recommendedJobs: number;
  applicationResponseRate: number;
  lastLoginDays: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="modern-dashboard">
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
          <h1 class="hero-title">AI Hiring Dashboard</h1>
          <p class="hero-subtitle">
            Welcome to your comprehensive hiring management platform
          </p>
        </div>
      </div>

      <!-- Dashboard Content -->
      <div class="dashboard-content">
        <!-- ADMIN DASHBOARD -->
        <div *ngIf="userRole === 'ADMIN'" class="admin-dashboard">
          <!-- Admin Stats Grid -->
          <div class="stats-grid">
            <div class="stat-card">
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
                <div class="stat-value">{{ adminStats.totalUsers }}</div>
                <div class="stat-breakdown">
                  <div class="breakdown-item">
                    <span class="breakdown-label">Recruiters</span>
                    <span class="breakdown-value">{{ adminStats.recruiters }}</span>
                  </div>
                  <div class="breakdown-item">
                    <span class="breakdown-label">Candidates</span>
                    <span class="breakdown-value">{{ adminStats.candidates }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="stat-card revenue-card">
              <div class="stat-icon">
                <i class="fas fa-dollar-sign"></i>
              </div>
              <div class="stat-content">
                <div class="stat-header">
                  <h3>Monthly Revenue</h3>
                  <div class="stat-trend positive">
                    <i class="fas fa-arrow-up"></i>
                    <span>+8%</span>
                  </div>
                </div>
                <div class="stat-value">\${{ adminStats.monthlyRevenue | number }}</div>
                <div class="stat-detail">Target: \$150,000</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-briefcase"></i>
              </div>
              <div class="stat-content">
                <div class="stat-header">
                  <h3>Active Jobs</h3>
                  <div class="stat-trend warning">
                    <i class="fas fa-minus"></i>
                    <span>-2%</span>
                  </div>
                </div>
                <div class="stat-value">{{ adminStats.totalJobs }}</div>
                <div class="stat-detail">{{ adminStats.activeInterviews }} interviews scheduled</div>
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
                    <div class="action-badge urgent">{{ adminStats.pendingApprovals }}</div>
                    <div class="action-text">
                      <div class="action-title">Pending Approvals</div>
                      <div class="action-subtitle">Job postings awaiting review</div>
                    </div>
                  </div>
                  <button class="action-btn secondary" (click)="navigateTo('/admin/alerts')">
                    <i class="fas fa-bell"></i>
                    Check
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
                <div class="stat-detail">Active Jobs</div>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-file-alt"></i>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ recruiterStats.totalApplicationsReceived }}</div>
                <div class="stat-detail">Applications</div>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-calendar"></i>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ recruiterStats.interviewsScheduled }}</div>
                <div class="stat-detail">Interviews</div>
              </div>
            </div>
          </div>

          <div class="action-panels">
            <div class="action-panel">
              <div class="panel-header">
                <div class="panel-icon management">
                  <i class="fas fa-tasks"></i>
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
                      <div class="management-subtitle">Manage candidates</div>
                    </div>
                  </button>
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
          </div>

          <div class="action-panels">
            <div class="action-panel">
              <div class="panel-header">
                <div class="panel-icon urgent">
                  <i class="fas fa-search"></i>
                </div>
                <h3>Job Search</h3>
              </div>
              <div class="panel-content">
                <div class="action-item">
                  <div class="action-info">
                    <div class="action-badge urgent">!</div>
                    <div class="action-text">
                      <div class="action-title">Browse Jobs</div>
                      <div class="action-subtitle">Find your next opportunity</div>
                    </div>
                  </div>
                  <button class="action-btn primary" (click)="navigateTo('/jobs')">
                    <i class="fas fa-arrow-right"></i>
                    Search
                  </button>
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
export class DashboardComponent implements OnInit {
  userRole: string | null = null;
  user: ApiUser | null = null;
  particles = Array(6).fill(0);
  loading = false;

  adminStats: AdminStats = {
    totalUsers: 0,
    recruiters: 0,
    candidates: 0,
    totalJobs: 0,
    totalApplications: 0,
    systemUptime: '0 days',
    activeInterviews: 0,
    pendingApprovals: 0,
    monthlyRevenue: 0,
    storageUsed: 0,
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
  };

  candidateStats: CandidateStats = {
    applicationsSubmitted: 0,
    interviewsScheduled: 0,
    jobsViewed: 0,
    profileViews: 0,
    skillMatchScore: 0,
    recommendedJobs: 0,
    applicationResponseRate: 0,
    lastLoginDays: 0,
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadDashboardData();
  }

  private loadUserData(): void {
    this.user = this.authService.getCurrentUser();
    this.userRole = this.authService.getUserRole();
  }

  navigateTo(route: string): void {
    void this.router.navigate([route]);
  }

  private loadDashboardData(): void {
    this.loading = true;
    
    // Load role-specific mock data
    if (this.userRole === 'ADMIN') {
      this.adminStats = {
        totalUsers: 1247,
        recruiters: 89,
        candidates: 1158,
        totalJobs: 342,
        totalApplications: 5678,
        systemUptime: '127 days',
        activeInterviews: 45,
        pendingApprovals: 12,
        monthlyRevenue: 125000,
        storageUsed: 78.5,
      };
    } else if (this.userRole === 'RECRUITER') {
      this.recruiterStats = {
        myActiveJobs: 8,
        totalApplicationsReceived: 156,
        interviewsScheduled: 23,
        candidatesHired: 5,
        avgTimeToHire: 18,
        topSkillsInDemand: ['JavaScript', 'Python', 'React', 'Node.js'],
        applicationConversionRate: 15.2,
        pendingReviews: 12,
      };
    } else if (this.userRole === 'CANDIDATE') {
      this.candidateStats = {
        applicationsSubmitted: 24,
        interviewsScheduled: 3,
        jobsViewed: 89,
        profileViews: 156,
        skillMatchScore: 87,
        recommendedJobs: 12,
        applicationResponseRate: 45,
        lastLoginDays: 2,
      };
    }
    
    this.loading = false;
  }
}
