import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-candidates',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="candidates-container">
      <div class="candidates-header">
        <h1>
          <i class="fas fa-users"></i>
          Candidates
        </h1>
        <p>Manage and review candidate profiles</p>
      </div>

      <div class="candidates-content" *ngIf="!isLoading">
        <div class="candidates-grid" *ngIf="candidates.length > 0">
          <div class="candidate-card" *ngFor="let candidate of candidates">
            <div class="candidate-avatar">
              <i class="fas fa-user"></i>
            </div>
            <div class="candidate-info">
              <h3>{{ candidate.name || 'Unknown' }}</h3>
              <p class="candidate-email">{{ candidate.email || 'No email' }}</p>
              <div class="candidate-skills" *ngIf="candidate.skills">
                <span class="skill-tag" *ngFor="let skill of candidate.skills.slice(0, 3)">
                  {{ skill }}
                </span>
              </div>
            </div>
            <div class="candidate-actions">
              <button class="btn btn-sm btn-primary" (click)="viewCandidate(candidate.id)">
                <i class="fas fa-eye"></i>
                View Profile
              </button>
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="candidates.length === 0">
          <i class="fas fa-user-plus"></i>
          <h3>No candidates found</h3>
          <p>No candidate profiles have been created yet</p>
        </div>
      </div>

      <div class="loading-state" *ngIf="isLoading">
        <div class="spinner"></div>
        <p>Loading candidates...</p>
      </div>
    </div>
  `,
  styles: [`
    .candidates-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .candidates-header {
      margin-bottom: 2rem;
      text-align: center;
    }

    .candidates-header h1 {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      font-size: 2.5rem;
      color: #1a202c;
      margin-bottom: 0.5rem;
    }

    .candidates-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .candidate-card {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
      transition: all 0.3s ease;
      text-align: center;
    }

    .candidate-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    }

    .candidate-avatar {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
      color: white;
      font-size: 2rem;
    }

    .candidate-info h3 {
      font-size: 1.25rem;
      color: #1a202c;
      margin-bottom: 0.5rem;
    }

    .candidate-email {
      color: #718096;
      margin-bottom: 1rem;
    }

    .candidate-skills {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      justify-content: center;
      margin-bottom: 1rem;
    }

    .skill-tag {
      background: #e6fffa;
      color: #319795;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
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
      .candidates-container {
        padding: 1rem;
      }

      .candidates-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CandidatesComponent implements OnInit {
  candidates: any[] = [];
  isLoading = true;

  constructor(
    private apiService: ApiService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.loadCandidates();
  }

  loadCandidates() {
    this.apiService.getCandidates().subscribe({
      next: (candidates) => {
        this.candidates = candidates;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load candidates:', error);
        this.isLoading = false;
      }
    });
  }

  viewCandidate(id: string) {
    console.log('View candidate:', id);
  }
}