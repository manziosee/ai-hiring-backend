import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-interviews',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="interviews-container">
      <div class="interviews-header">
        <h1>
          <i class="fas fa-calendar-alt"></i>
          Interviews
        </h1>
        <p>Manage interview schedules and feedback</p>
        <button class="btn btn-primary" (click)="showScheduleModal = true" *ngIf="authService.isRecruiter() || authService.isAdmin()">
          <i class="fas fa-plus"></i>
          Schedule Interview
        </button>
      </div>

      <div class="interviews-content" *ngIf="!isLoading">
        <div class="interviews-grid" *ngIf="interviews.length > 0">
          <div class="interview-card" *ngFor="let interview of interviews" [ngClass]="getStatusClass(interview.status)">
            <div class="interview-header">
              <div class="interview-info">
                <h3>{{ interview.candidate?.name || 'Unknown Candidate' }}</h3>
                <p class="position">{{ interview.job?.title || 'Unknown Position' }}</p>
                <p class="interview-type">{{ interview.type }} Interview</p>
              </div>
              <div class="interview-status">
                <span class="status-badge" [ngClass]="interview.status.toLowerCase()">
                  {{ interview.status }}
                </span>
              </div>
            </div>

            <div class="interview-details">
              <div class="detail-item">
                <i class="fas fa-calendar"></i>
                <span>{{ formatDate(interview.scheduledAt) }}</span>
              </div>
              <div class="detail-item">
                <i class="fas fa-clock"></i>
                <span>{{ formatTime(interview.scheduledAt) }}</span>
              </div>
              <div class="detail-item" *ngIf="interview.duration">
                <i class="fas fa-hourglass-half"></i>
                <span>{{ interview.duration }} minutes</span>
              </div>
            </div>

            <div class="interview-notes" *ngIf="interview.notes">
              <h4>Notes</h4>
              <p>{{ interview.notes }}</p>
            </div>

            <div class="interview-actions" *ngIf="authService.isRecruiter() || authService.isAdmin()">
              <button class="btn btn-sm btn-secondary" (click)="editInterview(interview)">
                <i class="fas fa-edit"></i>
                Edit
              </button>
              <button class="btn btn-sm btn-error" (click)="cancelInterview(interview.id)">
                <i class="fas fa-times"></i>
                Cancel
              </button>
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="interviews.length === 0">
          <i class="fas fa-calendar-times"></i>
          <h3>No interviews scheduled</h3>
          <p>No interviews have been scheduled yet</p>
        </div>
      </div>

      <div class="loading-state" *ngIf="isLoading">
        <div class="spinner"></div>
        <p>Loading interviews...</p>
      </div>
    </div>

    <!-- Schedule Interview Modal -->
    <div class="modal-overlay" *ngIf="showScheduleModal" (click)="closeModal($event)">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Schedule Interview</h2>
          <button class="modal-close" (click)="showScheduleModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <form (ngSubmit)="scheduleInterview()" class="modal-body">
          <div class="form-group">
            <label for="applicationId">Application</label>
            <select id="applicationId" [(ngModel)]="newInterview.applicationId" name="applicationId" required>
              <option value="">Select Application</option>
              <option value="1">John Doe - Software Engineer</option>
              <option value="2">Jane Smith - Product Manager</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="scheduledAt">Date & Time</label>
            <input type="datetime-local" id="scheduledAt" [(ngModel)]="newInterview.scheduledAt" name="scheduledAt" required>
          </div>
          
          <div class="form-group">
            <label for="type">Interview Type</label>
            <select id="type" [(ngModel)]="newInterview.type" name="type" required>
              <option value="PHONE">Phone Screen</option>
              <option value="TECHNICAL">Technical Interview</option>
              <option value="BEHAVIORAL">Behavioral Interview</option>
              <option value="FINAL">Final Interview</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="duration">Duration (minutes)</label>
            <input type="number" id="duration" [(ngModel)]="newInterview.duration" name="duration" min="15" max="180">
          </div>
          
          <div class="form-group">
            <label for="notes">Notes</label>
            <textarea id="notes" [(ngModel)]="newInterview.notes" name="notes" rows="3" 
              placeholder="Interview notes or special instructions..."></textarea>
          </div>
          
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" (click)="showScheduleModal = false">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="isScheduling">
              <span class="spinner" *ngIf="isScheduling"></span>
              <i class="fas fa-calendar-plus" *ngIf="!isScheduling"></i>
              {{ isScheduling ? 'Scheduling...' : 'Schedule Interview' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .interviews-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .interviews-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .interviews-header h1 {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 2.5rem;
      color: #1a202c;
    }

    .interviews-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 1.5rem;
    }

    .interview-card {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
      border-left: 4px solid #667eea;
      transition: all 0.3s ease;
    }

    .interview-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    }

    .interview-card.scheduled { border-left-color: #3182ce; }
    .interview-card.completed { border-left-color: #38a169; }
    .interview-card.cancelled { border-left-color: #e53e3e; }

    .interview-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .interview-info h3 {
      font-size: 1.25rem;
      color: #1a202c;
      margin-bottom: 0.25rem;
    }

    .position {
      color: #667eea;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .interview-type {
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

    .status-badge.scheduled { background: #ebf8ff; color: #3182ce; }
    .status-badge.completed { background: #f0fff4; color: #38a169; }
    .status-badge.cancelled { background: #fed7d7; color: #e53e3e; }

    .interview-details {
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

    .interview-notes {
      margin-bottom: 1rem;
    }

    .interview-notes h4 {
      font-size: 0.875rem;
      color: #2d3748;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .interview-notes p {
      color: #4a5568;
      line-height: 1.6;
      font-size: 0.875rem;
    }

    .interview-actions {
      display: flex;
      gap: 0.5rem;
      padding-top: 1rem;
      border-top: 1px solid #e2e8f0;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
    }

    .modal-content {
      background: white;
      border-radius: 16px;
      width: 100%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .modal-header h2 {
      margin: 0;
      color: #1a202c;
    }

    .modal-close {
      background: none;
      border: none;
      font-size: 1.25rem;
      color: #718096;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 8px;
    }

    .modal-close:hover {
      background: #f7fafc;
      color: #2d3748;
    }

    .modal-body {
      padding: 1.5rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #2d3748;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #667eea;
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 1.5rem;
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
      .interviews-container {
        padding: 1rem;
      }

      .interviews-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }

      .interviews-grid {
        grid-template-columns: 1fr;
      }

      .interview-actions {
        flex-direction: column;
      }
    }
  `]
})
export class InterviewsComponent implements OnInit {
  interviews: any[] = [];
  isLoading = true;
  showScheduleModal = false;
  isScheduling = false;
  
  newInterview = {
    applicationId: '',
    scheduledAt: '',
    type: 'TECHNICAL',
    duration: 60,
    notes: ''
  };

  constructor(
    private apiService: ApiService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.loadInterviews();
  }

  loadInterviews() {
    // Mock data for now
    setTimeout(() => {
      this.interviews = [
        {
          id: '1',
          candidate: { name: 'John Doe' },
          job: { title: 'Software Engineer' },
          scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'TECHNICAL',
          duration: 60,
          status: 'SCHEDULED',
          notes: 'Technical interview focusing on React and Node.js'
        },
        {
          id: '2',
          candidate: { name: 'Jane Smith' },
          job: { title: 'Product Manager' },
          scheduledAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'BEHAVIORAL',
          duration: 45,
          status: 'SCHEDULED',
          notes: 'Behavioral interview with product team'
        }
      ];
      this.isLoading = false;
    }, 1000);
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  scheduleInterview() {
    this.isScheduling = true;
    
    this.apiService.scheduleInterview(this.newInterview).subscribe({
      next: () => {
        this.isScheduling = false;
        this.showScheduleModal = false;
        this.resetForm();
        this.loadInterviews();
      },
      error: (error) => {
        console.error('Failed to schedule interview:', error);
        this.isScheduling = false;
      }
    });
  }

  editInterview(interview: any) {
    console.log('Edit interview:', interview);
  }

  cancelInterview(id: string) {
    if (confirm('Are you sure you want to cancel this interview?')) {
      this.apiService.cancelInterview(id).subscribe({
        next: () => {
          this.loadInterviews();
        },
        error: (error) => {
          console.error('Failed to cancel interview:', error);
        }
      });
    }
  }

  resetForm() {
    this.newInterview = {
      applicationId: '',
      scheduledAt: '',
      type: 'TECHNICAL',
      duration: 60,
      notes: ''
    };
  }

  closeModal(event: Event) {
    if (event.target === event.currentTarget) {
      this.showScheduleModal = false;
    }
  }
}