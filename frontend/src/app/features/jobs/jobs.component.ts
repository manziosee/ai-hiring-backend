import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Job, CreateApplicationDto } from '../../core/models';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="jobs-container">
      <div class="jobs-header">
        <div class="header-content">
          <h1>
            <i class="fas fa-briefcase"></i>
            {{ authService.isCandidate() ? 'Browse Jobs' : 'Manage Jobs' }}
          </h1>
          <p>{{ authService.isCandidate() ? 'Find your next opportunity' : 'Post and manage job openings' }}</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" *ngIf="authService.isRecruiter() || authService.isAdmin()" (click)="showCreateModal = true">
            <i class="fas fa-plus"></i>
            Post New Job
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <div class="filters-grid">
          <div class="filter-group">
            <label>Search Jobs</label>
            <div class="search-input">
              <i class="fas fa-search"></i>
              <input type="text" [(ngModel)]="searchTerm" (input)="filterJobs()" placeholder="Search by title, skills, or description...">
            </div>
          </div>
          <div class="filter-group">
            <label>Experience Level</label>
            <select [(ngModel)]="experienceFilter" (change)="filterJobs()">
              <option value="">All Levels</option>
              <option value="0-2">Entry Level (0-2 years)</option>
              <option value="3-5">Mid Level (3-5 years)</option>
              <option value="6-10">Senior Level (6-10 years)</option>
              <option value="10+">Expert Level (10+ years)</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Skills</label>
            <input type="text" [(ngModel)]="skillsFilter" (input)="filterJobs()" placeholder="e.g. JavaScript, Python, React">
          </div>
        </div>
      </div>

      <!-- Jobs Grid -->
      <div class="jobs-grid" *ngIf="!isLoading">
        <div class="job-card" *ngFor="let job of filteredJobs" [class.applied]="hasApplied(job.id)">
          <div class="job-header">
            <div class="job-title-section">
              <h3>{{ job.title }}</h3>
              <div class="job-meta">
                <span class="experience">
                  <i class="fas fa-clock"></i>
                  {{ job.experience }} years experience
                </span>
                <span class="posted-date">
                  <i class="fas fa-calendar"></i>
                  Posted {{ getTimeAgo(job.createdAt) }}
                </span>
              </div>
            </div>
            <div class="job-actions">
              <button class="btn btn-sm btn-secondary" *ngIf="authService.isRecruiter() || authService.isAdmin()" (click)="editJob(job)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-sm btn-error" *ngIf="authService.isRecruiter() || authService.isAdmin()" (click)="deleteJob(job.id)">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>

          <div class="job-description">
            <p>{{ job.description | slice:0:200 }}{{ job.description.length > 200 ? '...' : '' }}</p>
          </div>

          <div class="job-skills">
            <span class="skill-tag" *ngFor="let skill of job.skills?.slice(0, 5)">
              {{ skill }}
            </span>
            <span class="more-skills" *ngIf="job.skills && job.skills.length > 5">
              +{{ job.skills.length - 5 }} more
            </span>
          </div>

          <div class="job-footer">
            <div class="job-stats" *ngIf="!authService.isCandidate()">
              <span class="applications-count">
                <i class="fas fa-users"></i>
                {{ job._count?.applications || 0 }} applications
              </span>
            </div>
            <div class="job-actions-candidate" *ngIf="authService.isCandidate()">
              <button class="btn btn-outline btn-sm" [routerLink]="['/jobs', job.id]">
                <i class="fas fa-eye"></i>
                View Details
              </button>
              <button 
                class="btn btn-primary btn-sm" 
                *ngIf="!hasApplied(job.id)"
                (click)="applyToJob(job)"
                [disabled]="isApplying"
              >
                <span class="spinner" *ngIf="isApplying"></span>
                <i class="fas fa-paper-plane" *ngIf="!isApplying"></i>
                {{ isApplying ? 'Applying...' : 'Apply Now' }}
              </button>
              <span class="applied-badge" *ngIf="hasApplied(job.id)">
                <i class="fas fa-check"></i>
                Applied
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div class="loading-state" *ngIf="isLoading">
        <div class="spinner"></div>
        <p>Loading jobs...</p>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="!isLoading && filteredJobs.length === 0">
        <i class="fas fa-briefcase"></i>
        <h3>No jobs found</h3>
        <p>{{ searchTerm || experienceFilter || skillsFilter ? 'Try adjusting your filters' : 'No jobs available at the moment' }}</p>
        <button class="btn btn-primary" *ngIf="authService.isRecruiter() || authService.isAdmin()" (click)="showCreateModal = true">
          <i class="fas fa-plus"></i>
          Post First Job
        </button>
      </div>
    </div>

    <!-- Create Job Modal -->
    <div class="modal-overlay" *ngIf="showCreateModal" (click)="closeModal($event)">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>
            <i class="fas fa-plus"></i>
            Post New Job
          </h2>
          <button class="modal-close" (click)="showCreateModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <form (ngSubmit)="createJob()" class="modal-body">
          <div class="form-group">
            <label for="title">Job Title *</label>
            <input type="text" id="title" [(ngModel)]="newJob.title" name="title" required placeholder="e.g. Senior Frontend Developer">
          </div>
          
          <div class="form-group">
            <label for="description">Job Description *</label>
            <textarea id="description" [(ngModel)]="newJob.description" name="description" required rows="6" 
              placeholder="Describe the role, responsibilities, and requirements..."></textarea>
          </div>
          
          <div class="form-group">
            <label for="experience">Required Experience (years) *</label>
            <input type="number" id="experience" [(ngModel)]="newJob.experience" name="experience" required min="0" max="20">
          </div>
          
          <div class="form-group">
            <label for="skills">Required Skills *</label>
            <input type="text" id="skills" [(ngModel)]="skillsInput" name="skills" required 
              placeholder="Enter skills separated by commas (e.g. JavaScript, React, Node.js)">
            <small>Separate multiple skills with commas</small>
          </div>
          
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" (click)="showCreateModal = false">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="isCreating">
              <span class="spinner" *ngIf="isCreating"></span>
              <i class="fas fa-plus" *ngIf="!isCreating"></i>
              {{ isCreating ? 'Creating...' : 'Create Job' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .jobs-container {
      padding: var(--spacing-xl);
      max-width: 1400px;
      margin: 0 auto;
    }

    .jobs-header {
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

    .filters-section {
      background: white;
      border-radius: var(--radius-lg);
      padding: var(--spacing-xl);
      margin-bottom: var(--spacing-xl);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--neutral-200);
    }

    .filters-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: var(--spacing-lg);
    }

    .filter-group label {
      display: block;
      margin-bottom: var(--spacing-sm);
      font-weight: 600;
      color: var(--neutral-700);
    }

    .search-input {
      position: relative;

      i {
        position: absolute;
        left: var(--spacing-md);
        top: 50%;
        transform: translateY(-50%);
        color: var(--neutral-400);
      }

      input {
        padding-left: 2.5rem;
      }
    }

    .jobs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: var(--spacing-xl);
    }

    .job-card {
      background: white;
      border-radius: var(--radius-lg);
      padding: var(--spacing-xl);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--neutral-200);
      transition: all var(--transition-fast);
      position: relative;

      &:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-lg);
      }

      &.applied {
        border-color: var(--success-300);
        background: linear-gradient(135deg, white 0%, var(--success-50) 100%);
      }
    }

    .job-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-lg);
    }

    .job-title-section h3 {
      font-size: 1.5rem;
      color: var(--neutral-800);
      margin-bottom: var(--spacing-sm);
    }

    .job-meta {
      display: flex;
      gap: var(--spacing-lg);
      font-size: 0.875rem;
      color: var(--neutral-600);

      span {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
      }
    }

    .job-actions {
      display: flex;
      gap: var(--spacing-sm);
    }

    .job-description {
      margin-bottom: var(--spacing-lg);
      
      p {
        color: var(--neutral-700);
        line-height: 1.6;
        margin: 0;
      }
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

    .job-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: var(--spacing-lg);
      border-top: 1px solid var(--neutral-200);
    }

    .applications-count {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      color: var(--neutral-600);
      font-size: 0.875rem;
    }

    .job-actions-candidate {
      display: flex;
      gap: var(--spacing-sm);
      align-items: center;
    }

    .applied-badge {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      color: var(--success-700);
      font-weight: 600;
      font-size: 0.875rem;
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

    .empty-state h3 {
      font-size: 1.5rem;
      margin-bottom: var(--spacing-sm);
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
      padding: var(--spacing-lg);
    }

    .modal-content {
      background: white;
      border-radius: var(--radius-xl);
      width: 100%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: var(--shadow-2xl);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-xl);
      border-bottom: 1px solid var(--neutral-200);

      h2 {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        margin: 0;
        color: var(--neutral-800);
      }

      .modal-close {
        background: none;
        border: none;
        font-size: 1.25rem;
        color: var(--neutral-500);
        cursor: pointer;
        padding: var(--spacing-sm);
        border-radius: var(--radius-md);

        &:hover {
          background: var(--neutral-100);
          color: var(--neutral-700);
        }
      }
    }

    .modal-body {
      padding: var(--spacing-xl);
    }

    .modal-actions {
      display: flex;
      gap: var(--spacing-md);
      justify-content: flex-end;
      margin-top: var(--spacing-xl);
    }

    @media (max-width: 768px) {
      .jobs-container {
        padding: var(--spacing-md);
      }

      .jobs-header {
        flex-direction: column;
        gap: var(--spacing-lg);
      }

      .filters-grid {
        grid-template-columns: 1fr;
      }

      .jobs-grid {
        grid-template-columns: 1fr;
      }

      .job-header {
        flex-direction: column;
        gap: var(--spacing-md);
      }

      .job-footer {
        flex-direction: column;
        gap: var(--spacing-md);
        align-items: stretch;
      }
    }
  `]
})
export class JobsComponent implements OnInit {
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  isLoading = true;
  isApplying = false;
  isCreating = false;
  
  // Filters
  searchTerm = '';
  experienceFilter = '';
  skillsFilter = '';
  
  // Modal
  showCreateModal = false;
  newJob = {
    title: '',
    description: '',
    experience: 0,
    skills: [] as string[]
  };
  skillsInput = '';

  // Applied jobs tracking
  appliedJobs: Set<string> = new Set();

  constructor(
    private apiService: ApiService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.loadJobs();
    if (this.authService.isCandidate()) {
      this.loadUserApplications();
    }
  }

  loadJobs() {
    this.apiService.getJobs().subscribe({
      next: (jobs) => {
        this.jobs = jobs;
        this.filteredJobs = jobs;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load jobs:', error);
        this.isLoading = false;
      }
    });
  }

  loadUserApplications() {
    this.apiService.getApplications().subscribe({
      next: (applications) => {
        this.appliedJobs = new Set(applications.map(app => app.jobId));
      },
      error: (error) => {
        console.error('Failed to load applications:', error);
      }
    });
  }

  filterJobs() {
    this.filteredJobs = this.jobs.filter(job => {
      const matchesSearch = !this.searchTerm || 
        job.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        job.skills?.some(skill => skill.toLowerCase().includes(this.searchTerm.toLowerCase()));

      const matchesExperience = !this.experienceFilter || this.matchesExperienceFilter(job.experience || 0);
      
      const matchesSkills = !this.skillsFilter ||
        job.skills?.some(skill => skill.toLowerCase().includes(this.skillsFilter.toLowerCase()));

      return matchesSearch && matchesExperience && matchesSkills;
    });
  }

  matchesExperienceFilter(experience: number): boolean {
    switch (this.experienceFilter) {
      case '0-2': return experience <= 2;
      case '3-5': return experience >= 3 && experience <= 5;
      case '6-10': return experience >= 6 && experience <= 10;
      case '10+': return experience > 10;
      default: return true;
    }
  }

  hasApplied(jobId: string): boolean {
    return this.appliedJobs.has(jobId);
  }

  applyToJob(job: Job) {
    if (this.hasApplied(job.id)) return;

    this.isApplying = true;
    const application: CreateApplicationDto = {
      jobId: job.id,
      coverLetter: `I am interested in the ${job.title} position and believe my skills align well with your requirements.`
    };

    this.apiService.createApplication(application).subscribe({
      next: (response) => {
        this.appliedJobs.add(job.id);
        this.isApplying = false;
      },
      error: (error) => {
        console.error('Failed to apply:', error);
        this.isApplying = false;
      }
    });
  }

  createJob() {
    if (!this.newJob.title || !this.newJob.description) return;

    this.isCreating = true;
    this.newJob.skills = this.skillsInput.split(',').map(skill => skill.trim()).filter(skill => skill);

    this.apiService.createJob(this.newJob).subscribe({
      next: (job) => {
        this.jobs.unshift(job);
        this.filterJobs();
        this.resetForm();
        this.showCreateModal = false;
        this.isCreating = false;
      },
      error: (error) => {
        console.error('Failed to create job:', error);
        this.isCreating = false;
      }
    });
  }

  editJob(job: Job) {
    console.log('Edit job:', job);
  }

  deleteJob(jobId: string) {
    if (confirm('Are you sure you want to delete this job?')) {
      this.apiService.deleteJob(jobId).subscribe({
        next: () => {
          this.jobs = this.jobs.filter(job => job.id !== jobId);
          this.filterJobs();
        },
        error: (error) => {
          console.error('Failed to delete job:', error);
        }
      });
    }
  }

  resetForm() {
    this.newJob = {
      title: '',
      description: '',
      experience: 0,
      skills: []
    };
    this.skillsInput = '';
  }

  closeModal(event: Event) {
    if (event.target === event.currentTarget) {
      this.showCreateModal = false;
    }
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