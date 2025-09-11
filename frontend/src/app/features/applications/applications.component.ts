import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Application } from '../../core/models';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="applications-container">
      <div class="applications-header">
        <div class="header-content">
          <h1>
            <i class="fas fa-file-alt"></i>
            {{ authService.isCandidate() ? 'My Applications' : 'All Applications' }}
          </h1>
          <p>{{ authService.isCandidate() ? 'Track your job applications' : 'Manage candidate applications' }}</p>
        </div>
        <div class="header-stats">
          <div class="stat-item">
            <span class="stat-number">{{ applications.length }}</span>
            <span class="stat-label">Total Applications</span>
          </div>
          <div class="stat-item" *ngIf="authService.isCandidate()">
            <span class="stat-number">{{ getStatusCount('INTERVIEW') }}</span>
            <span class="stat-label">Interviews</span>
          </div>
        </div>
      </div>

      <!-- Status Filter -->
      <div class="filters-section">
        <div class="status-filters">
          <button 
            class="filter-btn" 
            [class.active]="selectedStatus === ''"
            (click)="filterByStatus('')"
          >
            All ({{ applications.length }})
          </button>
          <button 
            class="filter-btn" 
            [class.active]="selectedStatus === 'SUBMITTED'"
            (click)="filterByStatus('SUBMITTED')"
          >
            Submitted ({{ getStatusCount('SUBMITTED') }})
          </button>
          <button 
            class="filter-btn" 
            [class.active]="selectedStatus === 'SCREENING'"
            (click)="filterByStatus('SCREENING')"
          >
            Screening ({{ getStatusCount('SCREENING') }})
          </button>
          <button 
            class="filter-btn" 
            [class.active]="selectedStatus === 'INTERVIEW'"
            (click)="filterByStatus('INTERVIEW')"
          >
            Interview ({{ getStatusCount('INTERVIEW') }})
          </button>
          <button 
            class="filter-btn" 
            [class.active]="selectedStatus === 'OFFER'"
            (click)="filterByStatus('OFFER')"
          >
            Offer ({{ getStatusCount('OFFER') }})
          </button>
        </div>
      </div>

      <!-- Applications List -->
      <div class="applications-list" *ngIf="!isLoading">
        <div class="application-card" *ngFor="let application of filteredApplications">
          <div class="application-header">
            <div class="application-info">
              <h3>{{ application.job?.title }}</h3>
              <div class="application-meta">
                <span class="candidate-name" *ngIf="!authService.isCandidate()">
                  <i class="fas fa-user"></i>
                  {{ application.candidate?.name }}
                </span>
                <span class="application-date">
                  <i class="fas fa-calendar"></i>
                  Applied {{ getTimeAgo(application.createdAt) }}
                </span>
                <span class="experience">
                  <i class="fas fa-briefcase"></i>
                  {{ application.job?.experience }} years required
                </span>
              </div>
            </div>
            <div class="application-status">
              <span class="status-badge" [ngClass]="getStatusClass(application.status)">
                {{ application.status }}
              </span>
            </div>
          </div>

          <div class="application-body">
            <div class="job-skills" *ngIf="application.job?.skills?.length">
              <span class="skill-tag" *ngFor="let skill of application.job?.skills?.slice(0, 4)">
                {{ skill }}
              </span>
              <span class="more-skills" *ngIf="(application.job?.skills?.length || 0) > 4">
                +{{ (application.job?.skills?.length || 0) - 4 }} more
              </span>
            </div>
            
            <div class="cover-letter" *ngIf="application.coverLetter">
              <h4>Cover Letter</h4>
              <p>{{ application.coverLetter | slice:0:150 }}{{ application.coverLetter.length > 150 ? '...' : '' }}</p>
            </div>
          </div>

          <div class="application-actions">
            <button class="btn btn-outline btn-sm" [routerLink]="['/applications', application.id]">
              <i class="fas fa-eye"></i>
              View Details
            </button>
            
            <div class="recruiter-actions" *ngIf="authService.isRecruiter() || authService.isAdmin()">
              <button 
                class="btn btn-primary btn-sm" 
                *ngIf="application.status === 'SUBMITTED'"
                (click)="runScreening(application.id)"
                [disabled]="isScreening"
              >
                <span class="spinner" *ngIf="isScreening"></span>
                <i class="fas fa-brain" *ngIf="!isScreening"></i>
                {{ isScreening ? 'Screening...' : 'Run AI Screening' }}
              </button>
              
              <button 
                class="btn btn-success btn-sm" 
                *ngIf="application.status === 'SCREENING'"
                (click)="scheduleInterview(application.id)"
              >
                <i class="fas fa-calendar-plus"></i>
                Schedule Interview
              </button>
              
              <div class="status-dropdown" *ngIf="application.status !== 'REJECTED'">
                <select (change)="updateStatus(application.id, $event)" [value]="application.status">
                  <option value="SUBMITTED">Submitted</option>
                  <option value="SCREENING">Screening</option>
                  <option value="INTERVIEW">Interview</option>
                  <option value="OFFER">Offer</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Progress Timeline -->
          <div class="progress-timeline">
            <div class="timeline-step" [class.completed]="isStepCompleted('SUBMITTED', application.status)" [class.current]="application.status === 'SUBMITTED'">
              <div class="step-icon">
                <i class="fas fa-paper-plane"></i>
              </div>
              <span>Submitted</span>
            </div>
            <div class="timeline-step" [class.completed]="isStepCompleted('SCREENING', application.status)" [class.current]="application.status === 'SCREENING'">
              <div class="step-icon">
                <i class="fas fa-search"></i>
              </div>
              <span>Screening</span>
            </div>
            <div class="timeline-step" [class.completed]="isStepCompleted('INTERVIEW', application.status)" [class.current]="application.status === 'INTERVIEW'">
              <div class="step-icon">
                <i class="fas fa-users"></i>
              </div>
              <span>Interview</span>
            </div>
            <div class="timeline-step" [class.completed]="isStepCompleted('OFFER', application.status)" [class.current]="application.status === 'OFFER'">
              <div class="step-icon">
                <i class="fas fa-handshake"></i>
              </div>
              <span>Offer</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div class="loading-state" *ngIf="isLoading">
        <div class="spinner"></div>
        <p>Loading applications...</p>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="!isLoading && filteredApplications.length === 0">
        <i class="fas fa-inbox"></i>
        <h3>No applications found</h3>
        <p>{{ selectedStatus ? 'No applications with this status' : 'No applications yet' }}</p>
        <button class="btn btn-primary" routerLink="/jobs" *ngIf="authService.isCandidate()">
          <i class="fas fa-search"></i>
          Browse Jobs
        </button>
      </div>
    </div>
  `,
  styles: [`
    .applications-container {
      padding: var(--spacing-xl);
      max-width: 1400px;
      margin: 0 auto;
    }

    .applications-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-2xl);
      padding-bottom: var(--spacing-xl);
      border-bottom: 1px solid var(--neutral-200);
    }

    .header-content h1 {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      font-size: 2.5rem;
      color: var(--neutral-800);
      margin-bottom: var(--spacing-sm);

      i {
        color: var(--primary-600);
      }
    }

    .header-content p {
      color: var(--neutral-600);
      font-size: 1.125rem;
      margin: 0;
    }

    .header-stats {
      display: flex;
      gap: var(--spacing-xl);
    }

    .stat-item {
      text-align: center;

      .stat-number {
        display: block;
        font-size: 2rem;
        font-weight: 700;
        color: var(--primary-600);
      }

      .stat-label {
        font-size: 0.875rem;
        color: var(--neutral-600);
      }
    }

    .filters-section {
      background: white;
      border-radius: var(--radius-lg);
      padding: var(--spacing-lg);
      margin-bottom: var(--spacing-xl);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--neutral-200);
    }

    .status-filters {
      display: flex;
      gap: var(--spacing-sm);
      flex-wrap: wrap;
    }

    .filter-btn {
      padding: var(--spacing-sm) var(--spacing-md);
      border: 1px solid var(--neutral-300);
      background: white;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-fast);
      font-size: 0.875rem;

      &:hover {
        background: var(--neutral-50);
        border-color: var(--primary-300);
      }

      &.active {
        background: var(--primary-600);
        color: white;
        border-color: var(--primary-600);
      }
    }

    .applications-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xl);
    }

    .application-card {
      background: white;
      border-radius: var(--radius-lg);
      padding: var(--spacing-xl);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--neutral-200);
      transition: all var(--transition-fast);

      &:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
      }
    }

    .application-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-lg);
    }

    .application-info h3 {
      font-size: 1.5rem;
      color: var(--neutral-800);
      margin-bottom: var(--spacing-sm);
    }

    .application-meta {
      display: flex;
      gap: var(--spacing-lg);
      font-size: 0.875rem;
      color: var(--neutral-600);
      flex-wrap: wrap;

      span {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
      }
    }

    .status-badge {
      padding: var(--spacing-xs) var(--spacing-md);
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .application-body {
      margin-bottom: var(--spacing-lg);
    }

    .job-skills {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-lg);
    }

    .skill-tag {
      background: var(--primary-100);
      color: var(--primary-800);
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 500;
    }

    .more-skills {
      background: var(--neutral-100);
      color: var(--neutral-600);
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius-full);
      font-size: 0.75rem;
    }

    .cover-letter {
      h4 {
        font-size: 1rem;
        margin-bottom: var(--spacing-sm);
        color: var(--neutral-700);
      }

      p {
        color: var(--neutral-600);
        line-height: 1.6;
        margin: 0;
      }
    }

    .application-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-lg);
      padding-top: var(--spacing-lg);
      border-top: 1px solid var(--neutral-200);
    }

    .recruiter-actions {
      display: flex;
      gap: var(--spacing-sm);
      align-items: center;
    }

    .status-dropdown select {
      padding: var(--spacing-xs) var(--spacing-sm);
      border: 1px solid var(--neutral-300);
      border-radius: var(--radius-sm);
      font-size: 0.875rem;
    }

    .progress-timeline {
      display: flex;
      justify-content: space-between;
      position: relative;
      margin-top: var(--spacing-lg);
      padding-top: var(--spacing-lg);

      &::before {
        content: '';
        position: absolute;
        top: calc(var(--spacing-lg) + 20px);
        left: 10%;
        right: 10%;
        height: 2px;
        background: var(--neutral-200);
      }
    }

    .timeline-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-sm);
      position: relative;
      z-index: 1;

      .step-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--neutral-200);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--neutral-500);
        transition: all var(--transition-fast);
      }

      span {
        font-size: 0.75rem;
        color: var(--neutral-600);
        font-weight: 500;
      }

      &.completed .step-icon {
        background: var(--success-500);
        color: white;
      }

      &.current .step-icon {
        background: var(--primary-500);
        color: white;
        animation: pulse 2s infinite;
      }
    }

    .loading-state, .empty-state {
      text-align: center;
      padding: var(--spacing-3xl);
      color: var(--neutral-500);
    }

    .empty-state i {
      font-size: 4rem;
      margin-bottom: var(--spacing-lg);
      opacity: 0.5;
    }

    @media (max-width: 768px) {
      .applications-container {
        padding: var(--spacing-md);
      }

      .applications-header {
        flex-direction: column;
        gap: var(--spacing-lg);
      }

      .application-header {
        flex-direction: column;
        gap: var(--spacing-md);
      }

      .application-actions {
        flex-direction: column;
        gap: var(--spacing-md);
        align-items: stretch;
      }

      .progress-timeline {
        flex-wrap: wrap;
        gap: var(--spacing-md);
      }
    }
  `]
})
export class ApplicationsComponent implements OnInit {
  applications: Application[] = [];
  filteredApplications: Application[] = [];
  isLoading = true;
  isScreening = false;
  selectedStatus = '';

  constructor(
    private apiService: ApiService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.loadApplications();
  }

  loadApplications() {
    this.apiService.getApplications().subscribe({
      next: (applications) => {
        this.applications = applications;
        this.filteredApplications = applications;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load applications:', error);
        this.isLoading = false;
      }
    });
  }

  filterByStatus(status: string) {
    this.selectedStatus = status;
    if (status) {
      this.filteredApplications = this.applications.filter(app => app.status === status);
    } else {
      this.filteredApplications = this.applications;
    }
  }

  getStatusCount(status: string): number {
    return this.applications.filter(app => app.status === status).length;
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

  isStepCompleted(step: string, currentStatus: string): boolean {
    const steps = ['SUBMITTED', 'SCREENING', 'INTERVIEW', 'OFFER', 'ACCEPTED'];
    const stepIndex = steps.indexOf(step);
    const currentIndex = steps.indexOf(currentStatus);
    return currentIndex > stepIndex || (currentStatus === 'ACCEPTED' && step !== 'REJECTED');
  }

  runScreening(applicationId: string) {
    this.isScreening = true;
    this.apiService.runScreening(applicationId).subscribe({
      next: (result) => {
        this.isScreening = false;
        this.loadApplications(); // Refresh to show updated status
      },
      error: (error) => {
        console.error('Failed to run screening:', error);
        this.isScreening = false;
      }
    });
  }

  scheduleInterview(applicationId: string) {
    console.log('Schedule interview for:', applicationId);
  }

  updateStatus(applicationId: string, event: any) {
    const newStatus = event.target.value;
    this.apiService.updateApplicationStatus(applicationId, newStatus).subscribe({
      next: () => {
        this.loadApplications();
      },
      error: (error) => {
        console.error('Failed to update status:', error);
      }
    });
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
}