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
        <h1>
          <i class="fas fa-file-alt"></i>
          {{ authService.isCandidate() ? 'My Applications' : 'All Applications' }}
        </h1>
        <p>{{ authService.isCandidate() ? 'Track your job applications' : 'Manage candidate applications' }}</p>
      </div>

      <div class="applications-content" *ngIf="!isLoading">
        <div class="applications-grid" *ngIf="applications.length > 0">
          <div class="application-card" *ngFor="let app of applications">
            <div class="card-header">
              <div class="job-info">
                <h3>{{ app.job?.title }}</h3>
                <p class="company">{{ app.job?.department }}</p>
              </div>
              <div class="status-badge" [ngClass]="getStatusClass(app.status)">
                {{ app.status }}
              </div>
            </div>

            <div class="card-body">
              <div class="application-details">
                <div class="detail-item" *ngIf="!authService.isCandidate()">
                  <i class="fas fa-user"></i>
                  <span>{{ app.candidate?.name || 'Unknown Candidate' }}</span>
                </div>
                <div class="detail-item">
                  <i class="fas fa-calendar"></i>
                  <span>Applied {{ getTimeAgo(app.createdAt) }}</span>
                </div>
                <div class="detail-item">
                  <i class="fas fa-map-marker-alt"></i>
                  <span>{{ app.job?.location }}</span>
                </div>
              </div>

              <div class="cover-letter" *ngIf="app.coverLetter">
                <h4>Cover Letter</h4>
                <p>{{ app.coverLetter | slice:0:200 }}{{ app.coverLetter.length > 200 ? '...' : '' }}</p>
              </div>
            </div>

            <div class="card-actions" *ngIf="!authService.isCandidate()">
              <button class="btn btn-sm btn-primary" (click)="runScreening(app.id)" [disabled]="isProcessing">
                <i class="fas fa-brain"></i>
                Run AI Screening
              </button>
              <button class="btn btn-sm btn-secondary" (click)="updateStatus(app.id, 'INTERVIEW')">
                <i class="fas fa-calendar"></i>
                Schedule Interview
              </button>
              <button class="btn btn-sm btn-success" (click)="updateStatus(app.id, 'ACCEPTED')">
                <i class="fas fa-check"></i>
                Accept
              </button>
              <button class="btn btn-sm btn-error" (click)="updateStatus(app.id, 'REJECTED')">
                <i class="fas fa-times"></i>
                Reject
              </button>
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="applications.length === 0">
          <i class="fas fa-inbox"></i>
          <h3>No applications found</h3>
          <p>{{ authService.isCandidate() ? 'You haven\'t applied to any jobs yet' : 'No applications received yet' }}</p>
          <button class="btn btn-primary" routerLink="/jobs" *ngIf="authService.isCandidate()">
            <i class="fas fa-search"></i>
            Browse Jobs
          </button>
        </div>
      </div>

      <div class="loading-state" *ngIf="isLoading">
        <div class="spinner"></div>
        <p>Loading applications...</p>
      </div>
    </div>
  `,
  styles: [`
    .applications-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .applications-header {
      margin-bottom: 2rem;
      text-align: center;
    }

    .applications-header h1 {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      font-size: 2.5rem;
      color: #1a202c;
      margin-bottom: 0.5rem;
    }

    .applications-header p {
      color: #718096;
      font-size: 1.125rem;
    }

    .applications-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 1.5rem;
    }

    .application-card {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
      transition: all 0.3s ease;
    }

    .application-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .job-info h3 {
      font-size: 1.25rem;
      color: #1a202c;
      margin-bottom: 0.25rem;
    }

    .company {
      color: #718096;
      font-size: 0.875rem;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-pending { background: #fef5e7; color: #d69e2e; }
    .status-screening { background: #e6fffa; color: #319795; }
    .status-interview { background: #ebf8ff; color: #3182ce; }
    .status-accepted { background: #f0fff4; color: #38a169; }
    .status-rejected { background: #fed7d7; color: #e53e3e; }

    .application-details {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #4a5568;
      font-size: 0.875rem;
    }

    .detail-item i {
      color: #a0aec0;
      width: 16px;
    }

    .cover-letter {
      margin-bottom: 1rem;
    }

    .cover-letter h4 {
      font-size: 0.875rem;
      color: #2d3748;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .cover-letter p {
      color: #4a5568;
      line-height: 1.6;
      font-size: 0.875rem;
    }

    .card-actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      padding-top: 1rem;
      border-top: 1px solid #e2e8f0;
    }

    .empty-state, .loading-state {
      text-align: center;
      padding: 3rem;
      color: #718096;
    }

    .empty-state i, .loading-state i {
      font-size: 4rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .empty-state h3 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
      color: #2d3748;
    }

    @media (max-width: 768px) {
      .applications-container {
        padding: 1rem;
      }

      .applications-grid {
        grid-template-columns: 1fr;
      }

      .card-actions {
        flex-direction: column;
      }
    }
  `]
})
export class ApplicationsComponent implements OnInit {
  applications: Application[] = [];
  isLoading = true;
  isProcessing = false;

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
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load applications:', error);
        this.isLoading = false;
      }
    });
  }

  runScreening(applicationId: string) {
    this.isProcessing = true;
    this.apiService.runScreening(applicationId).subscribe({
      next: (result: any) => {
        console.log('Screening completed:', result);
        this.isProcessing = false;
      },
      error: (error: any) => {
        console.error('Screening failed:', error);
        this.isProcessing = false;
      }
    });
  }

  updateStatus(applicationId: string, newStatus: string) {
    this.apiService.updateApplicationStatus(applicationId, newStatus).subscribe({
      next: () => {
        this.loadApplications();
      },
      error: (error: any) => {
        console.error('Failed to update status:', error);
      }
    });
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
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