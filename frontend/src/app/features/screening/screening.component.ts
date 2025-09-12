import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-screening',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="screening-container">
      <div class="screening-header">
        <h1>
          <i class="fas fa-brain"></i>
          AI Screening
        </h1>
        <p>AI-powered candidate screening and analysis</p>
      </div>

      <div class="screening-content" *ngIf="!isLoading">
        <div class="screening-grid" *ngIf="screeningResults.length > 0">
          <div class="screening-card" *ngFor="let result of screeningResults">
            <div class="screening-header-card">
              <div class="candidate-info">
                <h3>{{ result.candidate?.name || 'Unknown Candidate' }}</h3>
                <p>{{ result.job?.title || 'Unknown Position' }}</p>
              </div>
              <div class="screening-score" [ngClass]="getScoreClass(result.fitScore)">
                {{ (result.fitScore * 100).toFixed(0) }}%
              </div>
            </div>

            <div class="screening-details">
              <div class="detail-section">
                <h4>Skills Match</h4>
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="result.skillsMatch * 100"></div>
                </div>
                <span class="progress-text">{{ (result.skillsMatch * 100).toFixed(0) }}%</span>
              </div>

              <div class="detail-section">
                <h4>Experience Match</h4>
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="result.experienceMatch * 100"></div>
                </div>
                <span class="progress-text">{{ (result.experienceMatch * 100).toFixed(0) }}%</span>
              </div>

              <div class="detail-section" *ngIf="result.summary">
                <h4>AI Summary</h4>
                <p class="summary-text">{{ result.summary }}</p>
              </div>
            </div>

            <div class="screening-actions">
              <button class="btn btn-sm btn-success" (click)="approveCandidate(result.applicationId)">
                <i class="fas fa-check"></i>
                Approve
              </button>
              <button class="btn btn-sm btn-error" (click)="rejectCandidate(result.applicationId)">
                <i class="fas fa-times"></i>
                Reject
              </button>
              <button class="btn btn-sm btn-secondary" (click)="scheduleInterview(result.applicationId)">
                <i class="fas fa-calendar"></i>
                Interview
              </button>
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="screeningResults.length === 0">
          <i class="fas fa-search"></i>
          <h3>No screening results</h3>
          <p>No AI screening has been performed yet</p>
        </div>
      </div>

      <div class="loading-state" *ngIf="isLoading">
        <div class="spinner"></div>
        <p>Loading screening results...</p>
      </div>
    </div>
  `,
  styles: [`
    .screening-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .screening-header {
      margin-bottom: 2rem;
      text-align: center;
    }

    .screening-header h1 {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      font-size: 2.5rem;
      color: #1a202c;
      margin-bottom: 0.5rem;
    }

    .screening-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 1.5rem;
    }

    .screening-card {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
      transition: all 0.3s ease;
    }

    .screening-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    }

    .screening-header-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .candidate-info h3 {
      font-size: 1.25rem;
      color: #1a202c;
      margin-bottom: 0.25rem;
    }

    .candidate-info p {
      color: #718096;
      font-size: 0.875rem;
    }

    .screening-score {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      color: white;
      font-size: 1rem;
    }

    .screening-score.high { background: #38a169; }
    .screening-score.medium { background: #d69e2e; }
    .screening-score.low { background: #e53e3e; }

    .detail-section {
      margin-bottom: 1rem;
    }

    .detail-section h4 {
      font-size: 0.875rem;
      color: #2d3748;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: #e2e8f0;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 0.25rem;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(135deg, #667eea, #764ba2);
      transition: width 0.3s ease;
    }

    .progress-text {
      font-size: 0.75rem;
      color: #718096;
      font-weight: 600;
    }

    .summary-text {
      color: #4a5568;
      line-height: 1.6;
      font-size: 0.875rem;
    }

    .screening-actions {
      display: flex;
      gap: 0.5rem;
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

    @media (max-width: 768px) {
      .screening-container {
        padding: 1rem;
      }

      .screening-grid {
        grid-template-columns: 1fr;
      }

      .screening-actions {
        flex-direction: column;
      }
    }
  `]
})
export class ScreeningComponent implements OnInit {
  screeningResults: any[] = [];
  isLoading = true;

  constructor(
    private apiService: ApiService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.loadScreeningResults();
  }

  loadScreeningResults() {
    // Mock data for now since we need actual screening results
    setTimeout(() => {
      this.screeningResults = [
        {
          applicationId: '1',
          candidate: { name: 'John Doe' },
          job: { title: 'Software Engineer' },
          fitScore: 0.85,
          skillsMatch: 0.9,
          experienceMatch: 0.8,
          summary: 'Strong technical background with relevant experience in React and Node.js.'
        },
        {
          applicationId: '2',
          candidate: { name: 'Jane Smith' },
          job: { title: 'Product Manager' },
          fitScore: 0.72,
          skillsMatch: 0.75,
          experienceMatch: 0.7,
          summary: 'Good product management experience with some technical knowledge.'
        }
      ];
      this.isLoading = false;
    }, 1000);
  }

  getScoreClass(score: number): string {
    if (score >= 0.8) return 'high';
    if (score >= 0.6) return 'medium';
    return 'low';
  }

  approveCandidate(applicationId: string) {
    this.apiService.updateApplicationStatus(applicationId, 'ACCEPTED').subscribe({
      next: () => console.log('Candidate approved'),
      error: (error) => console.error('Failed to approve candidate:', error)
    });
  }

  rejectCandidate(applicationId: string) {
    this.apiService.updateApplicationStatus(applicationId, 'REJECTED').subscribe({
      next: () => console.log('Candidate rejected'),
      error: (error) => console.error('Failed to reject candidate:', error)
    });
  }

  scheduleInterview(applicationId: string) {
    const interviewData = {
      applicationId,
      scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'TECHNICAL',
      notes: 'Initial technical interview'
    };

    this.apiService.scheduleInterview(interviewData).subscribe({
      next: () => console.log('Interview scheduled'),
      error: (error) => console.error('Failed to schedule interview:', error)
    });
  }
}