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
      <!-- Enhanced Hero Section -->
      <div class="hero-section">
        <div class="hero-background">
          <div class="gradient-orb orb-1"></div>
          <div class="gradient-orb orb-2"></div>
          <div class="floating-particles">
            <div
              class="particle"
              *ngFor="let p of particles; let i = index"
              [style.animation-delay.s]="i * 0.5"
            ></div>
          </div>
        </div>
        <div class="hero-content">
          <div class="hero-text">
            <div class="hero-icon">
              <i class="fas fa-briefcase"></i>
            </div>
            <h1>
              {{ authService.isCandidate() ? 'Browse Jobs' : 'Manage Jobs' }}
            </h1>
            <p>
              {{
                authService.isCandidate()
                  ? 'Find your next opportunity'
                  : 'Post and manage job openings'
              }}
            </p>
          </div>
          <div class="hero-actions">
            <button
              class="create-job-btn"
              *ngIf="authService.isRecruiter() || authService.isAdmin()"
              (click)="showCreateModal = true"
            >
              <div class="btn-glow"></div>
              <i class="fas fa-plus"></i>
              <span>Post New Job</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Enhanced Filters -->
      <div class="filters-section">
        <div class="filters-container">
          <div class="filter-card">
            <div class="filter-icon">
              <i class="fas fa-search"></i>
            </div>
            <div class="filter-content">
              <label>Search Jobs</label>
              <div class="search-input">
                <input
                  type="text"
                  [(ngModel)]="searchTerm"
                  (input)="filterJobs()"
                  placeholder="Search by title, skills, or description..."
                />
                <div class="input-glow"></div>
              </div>
            </div>
          </div>

          <div class="filter-card">
            <div class="filter-icon">
              <i class="fas fa-clock"></i>
            </div>
            <div class="filter-content">
              <label>Experience Level</label>
              <select [(ngModel)]="experienceFilter" (change)="filterJobs()">
                <option value="">All Levels</option>
                <option value="0-2">Entry Level (0-2 years)</option>
                <option value="3-5">Mid Level (3-5 years)</option>
                <option value="6-10">Senior Level (6-10 years)</option>
                <option value="10+">Expert Level (10+ years)</option>
              </select>
            </div>
          </div>

          <div class="filter-card">
            <div class="filter-icon">
              <i class="fas fa-code"></i>
            </div>
            <div class="filter-content">
              <label>Skills</label>
              <input
                type="text"
                [(ngModel)]="skillsFilter"
                (input)="filterJobs()"
                placeholder="e.g. JavaScript, Python, React"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Modern Jobs List -->
      <div class="jobs-list" *ngIf="!isLoading">
        <div
          class="modern-job-card"
          *ngFor="let job of filteredJobs"
          [class.applied]="hasApplied(job.id)"
        >
          <!-- Company Logo Section -->
          <div class="company-logo">
            <div class="logo-placeholder">
              <i class="fas fa-building"></i>
            </div>
          </div>

          <!-- Job Content -->
          <div class="job-content">
            <!-- Job Title and Company -->
            <div class="job-header-info">
              <h3 class="job-title">{{ job.title }}</h3>
              <div class="job-company-info">
                <span class="company-name">{{ job.company || 'Tech Company' }}</span>
                <span class="location-separator">|</span>
                <span class="job-location">{{ job.location || 'Kigali' }}</span>
                <span class="location-separator">|</span>
                <span class="publish-date">Published on {{ formatDate(job.createdAt) }}</span>
                <span class="location-separator">|</span>
                <span class="deadline">Deadline {{ formatDeadline(job.createdAt) }}</span>
              </div>
              <div class="experience-level">
                Entry level ({{ job.experience || '1' }} to {{ (job.experience || 1) + 2 }} years of experience)
              </div>
              <div class="job-type-badge">Job</div>
            </div>

            <!-- Admin/Recruiter Actions -->
            <div
              class="admin-actions"
              *ngIf="authService.isRecruiter() || authService.isAdmin()"
            >
              <button class="action-btn edit-btn" (click)="editJob(job)" title="Edit Job">
                <i class="fas fa-edit"></i>
              </button>
              <button class="action-btn delete-btn" (click)="deleteJob(job.id)" title="Delete Job">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>

          <!-- Candidate Action Buttons -->
          <div class="candidate-actions" *ngIf="authService.isCandidate()">
            <button class="view-details-btn" [routerLink]="['/jobs', job.id]">
              <i class="fas fa-eye"></i>
              View Details
            </button>
            <button
              class="apply-btn"
              *ngIf="!hasApplied(job.id)"
              (click)="applyToJob(job)"
              [disabled]="isApplying"
            >
              <i class="fas fa-paper-plane" *ngIf="!isApplying"></i>
              <span class="spinner" *ngIf="isApplying"></span>
              {{ isApplying ? 'Applying...' : 'Apply' }}
            </button>
            <div class="applied-status" *ngIf="hasApplied(job.id)">
              <i class="fas fa-check-circle"></i>
              Applied
            </div>
          </div>

          <!-- Job Stats for Recruiters -->
          <div class="job-stats" *ngIf="!authService.isCandidate()">
            <div class="stat-item">
              <i class="fas fa-users"></i>
              <span>{{ job._count?.applications || 0 }} applications</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Loading State -->
      <div class="loading-state" *ngIf="isLoading">
        <div class="loading-animation">
          <div class="loading-spinner"></div>
          <div class="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <h3>Loading amazing opportunities...</h3>
        <p>Please wait while we fetch the latest jobs</p>
      </div>

      <!-- Enhanced Empty State -->
      <div class="empty-state" *ngIf="!isLoading && filteredJobs.length === 0">
        <div class="empty-icon">
          <i class="fas fa-briefcase"></i>
          <div class="icon-glow"></div>
        </div>
        <h3>No jobs found</h3>
        <p>
          {{
            searchTerm || experienceFilter || skillsFilter
              ? 'Try adjusting your filters to see more opportunities'
              : 'No jobs available at the moment. Check back soon!'
          }}
        </p>
        <button
          class="create-first-job-btn"
          *ngIf="authService.isRecruiter() || authService.isAdmin()"
          (click)="showCreateModal = true"
        >
          <div class="btn-glow"></div>
          <i class="fas fa-plus"></i>
          <span>Post First Job</span>
        </button>
      </div>
    </div>

    <!-- Create Job Modal -->
    <div
      class="modal-overlay"
      *ngIf="showCreateModal"
      (click)="closeModal($event)"
    >
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
            <input
              type="text"
              id="title"
              [(ngModel)]="newJob.title"
              name="title"
              required
              placeholder="e.g. Senior Frontend Developer"
            />
          </div>

          <div class="form-group">
            <label for="description">Job Description *</label>
            <textarea
              id="description"
              [(ngModel)]="newJob.description"
              name="description"
              required
              rows="6"
              placeholder="Describe the role, responsibilities, and requirements..."
            ></textarea>
          </div>

          <div class="form-group">
            <label for="experience">Required Experience (years) *</label>
            <input
              type="number"
              id="experience"
              [(ngModel)]="newJob.experience"
              name="experience"
              required
              min="0"
              max="20"
            />
          </div>

          <div class="form-group">
            <label for="skills">Required Skills *</label>
            <input
              type="text"
              id="skills"
              [(ngModel)]="skillsInput"
              name="skills"
              required
              placeholder="Enter skills separated by commas (e.g. JavaScript, React, Node.js)"
            />
            <small>Separate multiple skills with commas</small>
          </div>

          <div class="modal-actions">
            <button
              type="button"
              class="btn btn-secondary"
              (click)="showCreateModal = false"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="isCreating"
            >
              <span class="spinner" *ngIf="isCreating"></span>
              <i class="fas fa-plus" *ngIf="!isCreating"></i>
              {{ isCreating ? 'Creating...' : 'Create Job' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .jobs-container {
        min-height: 100vh;
        background: linear-gradient(135deg, #f8fffe 0%, #f0fdf4 100%);
      }

      /* Hero Section */
      .hero-section {
        position: relative;
        background: linear-gradient(
          135deg,
          #059669 0%,
          #047857 30%,
          #065f46 70%,
          #064e3b 100%
        );
        min-height: 300px;
        overflow: hidden;
        margin-bottom: 40px;
      }

      .hero-background {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }

      .gradient-orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(40px);
        opacity: 0.6;
        animation: float-orb 8s ease-in-out infinite;
      }

      .orb-1 {
        width: 200px;
        height: 200px;
        background: radial-gradient(
          circle,
          rgba(16, 185, 129, 0.4),
          transparent
        );
        top: -100px;
        left: 10%;
        animation-delay: 0s;
      }

      .orb-2 {
        width: 150px;
        height: 150px;
        background: radial-gradient(
          circle,
          rgba(5, 150, 105, 0.3),
          transparent
        );
        bottom: -75px;
        right: 20%;
        animation-delay: 4s;
      }

      @keyframes float-orb {
        0%,
        100% {
          transform: translate(0, 0) scale(1);
        }
        25% {
          transform: translate(15px, -15px) scale(1.1);
        }
        50% {
          transform: translate(-10px, -25px) scale(0.9);
        }
        75% {
          transform: translate(-15px, 10px) scale(1.05);
        }
      }

      .floating-particles {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
      }

      .particle {
        position: absolute;
        width: 3px;
        height: 3px;
        background: rgba(255, 255, 255, 0.4);
        border-radius: 50%;
        animation: float-particle 10s ease-in-out infinite;
      }

      .particle:nth-child(1) {
        left: 10%;
        top: 20%;
      }
      .particle:nth-child(2) {
        left: 20%;
        top: 60%;
      }
      .particle:nth-child(3) {
        left: 30%;
        top: 40%;
      }
      .particle:nth-child(4) {
        left: 50%;
        top: 70%;
      }
      .particle:nth-child(5) {
        left: 70%;
        top: 30%;
      }
      .particle:nth-child(6) {
        left: 80%;
        top: 80%;
      }

      @keyframes float-particle {
        0%,
        100% {
          transform: translateY(0px) rotate(0deg);
          opacity: 0.4;
        }
        25% {
          transform: translateY(-20px) rotate(90deg);
          opacity: 0.8;
        }
        50% {
          transform: translateY(-40px) rotate(180deg);
          opacity: 1;
        }
        75% {
          transform: translateY(-20px) rotate(270deg);
          opacity: 0.8;
        }
      }

      .hero-content {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        max-width: 1400px;
        margin: 0 auto;
        padding: 60px 32px;
        min-height: 300px;
        z-index: 2;
      }

      .hero-text {
        flex: 1;
      }

      .hero-icon {
        width: 80px;
        height: 80px;
        background: linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.25),
          rgba(255, 255, 255, 0.1)
        );
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 24px;
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .hero-icon i {
        font-size: 36px;
        color: white;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
      }

      .hero-text h1 {
        font-size: 48px;
        font-weight: 800;
        color: white;
        margin: 0 0 16px 0;
        background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .hero-text p {
        font-size: 20px;
        color: rgba(255, 255, 255, 0.9);
        margin: 0;
        line-height: 1.6;
      }

      .hero-actions {
        margin-left: 40px;
      }

      .create-job-btn {
        position: relative;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 32px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        border: none;
        border-radius: 16px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
        backdrop-filter: blur(20px);
        overflow: hidden;
      }

      .create-job-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 35px rgba(16, 185, 129, 0.4);
      }

      .btn-glow {
        position: absolute;
        top: -50%;
        left: -50%;
        right: -50%;
        bottom: -50%;
        background: radial-gradient(
          circle,
          rgba(255, 255, 255, 0.2) 0%,
          transparent 70%
        );
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .create-job-btn:hover .btn-glow {
        opacity: 1;
      }

      /* Filters Section */
      .filters-section {
        max-width: 1400px;
        margin: 0 auto 40px auto;
        padding: 0 32px;
      }

      .filters-container {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr;
        gap: 24px;
      }

      .filter-card {
        background: white;
        border-radius: 20px;
        padding: 24px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        border: 1px solid rgba(16, 185, 129, 0.1);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .filter-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
        border-color: rgba(16, 185, 129, 0.2);
      }

      .filter-icon {
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, #10b981, #059669);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 16px;
      }

      .filter-icon i {
        font-size: 20px;
        color: white;
      }

      .filter-content label {
        display: block;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 12px;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .search-input {
        position: relative;
      }

      .search-input input,
      .filter-content input,
      .filter-content select {
        width: 100%;
        padding: 14px 16px;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        font-size: 14px;
        transition: all 0.3s ease;
        background: #f9fafb;
      }

      .search-input input:focus,
      .filter-content input:focus,
      .filter-content select:focus {
        outline: none;
        border-color: #10b981;
        background: white;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
      }

      .input-glow {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 12px;
        background: linear-gradient(
          135deg,
          rgba(16, 185, 129, 0.1),
          rgba(5, 150, 105, 0.05)
        );
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
      }

      .search-input input:focus + .input-glow {
        opacity: 1;
      }

      /* Modern Jobs List */
      .jobs-list {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 32px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .modern-job-card {
        background: white;
        border: 2px solid #10b981;
        border-radius: 12px;
        padding: 20px;
        display: flex;
        align-items: center;
        gap: 20px;
        transition: all 0.3s ease;
        position: relative;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .modern-job-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(16, 185, 129, 0.2);
        border-color: #059669;
      }

      .modern-job-card.applied {
        border-color: #059669;
        background: linear-gradient(135deg, white 0%, #f0fdf4 100%);
      }

      /* Company Logo */
      .company-logo {
        flex-shrink: 0;
        width: 80px;
        height: 80px;
      }

      .logo-placeholder {
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #10b981, #059669);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 24px;
      }

      /* Job Content */
      .job-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .job-header-info {
        position: relative;
      }

      .job-title {
        font-size: 20px;
        font-weight: 700;
        color: #10b981;
        margin: 0 0 8px 0;
        line-height: 1.2;
      }

      .job-company-info {
        font-size: 14px;
        color: #6b7280;
        margin-bottom: 4px;
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }

      .company-name {
        color: #1f2937;
        font-weight: 500;
      }

      .location-separator {
        color: #d1d5db;
      }

      .job-location, .publish-date, .deadline {
        color: #6b7280;
      }

      .experience-level {
        font-size: 14px;
        color: #4b5563;
        margin-bottom: 8px;
      }

      .job-type-badge {
        display: inline-block;
        background: #f3f4f6;
        color: #374151;
        padding: 4px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      /* Admin Actions */
      .admin-actions {
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        gap: 8px;
      }

      .action-btn {
        width: 32px;
        height: 32px;
        border: none;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 14px;
      }

      .edit-btn {
        background: #f59e0b;
        color: white;
      }

      .edit-btn:hover {
        background: #d97706;
        transform: scale(1.1);
      }

      .delete-btn {
        background: #ef4444;
        color: white;
      }

      .delete-btn:hover {
        background: #dc2626;
        transform: scale(1.1);
      }

      /* Candidate Actions */
      .candidate-actions {
        display: flex;
        flex-direction: column;
        gap: 8px;
        align-items: flex-end;
        min-width: 120px;
      }

      .view-details-btn {
        background: #6b7280;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 6px;
        text-decoration: none;
        width: 100%;
        justify-content: center;
      }

      .view-details-btn:hover {
        background: #4b5563;
        transform: translateY(-1px);
      }

      .apply-btn {
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 6px;
        width: 100%;
        justify-content: center;
        position: relative;
        overflow: hidden;
      }

      .apply-btn:hover:not(:disabled) {
        background: linear-gradient(135deg, #059669, #047857);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      }

      .apply-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }

      .applied-status {
        background: #d1fae5;
        color: #065f46;
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 6px;
        width: 100%;
        justify-content: center;
      }

      /* Job Stats */
      .job-stats {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 8px;
        min-width: 120px;
      }

      .stat-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 14px;
        color: #6b7280;
      }

      .stat-item i {
        color: #10b981;
      }

      /* Spinner Animation */
      .spinner {
        width: 14px;
        height: 14px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top: 2px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .job-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 20px;
      }

      .job-title {
        font-size: 20px;
        font-weight: 700;
        color: #1f2937;
        margin: 0 0 8px 0;
        line-height: 1.3;
      }

      .company-name {
        font-size: 16px;
        color: #10b981;
        font-weight: 600;
        margin: 0;
      }

      .job-status {
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .status-open {
        background: linear-gradient(135deg, #d1fae5, #a7f3d0);
        color: #065f46;
      }

      .status-closed {
        background: linear-gradient(135deg, #fee2e2, #fecaca);
        color: #991b1b;
      }

      .job-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        margin-bottom: 20px;
      }

      .meta-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: #6b7280;
      }

      .meta-item i {
        width: 16px;
        color: #10b981;
      }

      .job-description {
        color: #4b5563;
        line-height: 1.6;
        margin-bottom: 20px;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .job-skills {
        margin-bottom: 24px;
      }

      .skills-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .skill-tag {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        background: linear-gradient(135deg, #f0fdf4, #dcfce7);
        color: #166534;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
        border: 1px solid rgba(16, 185, 129, 0.2);
      }

      .skill-tag i {
        font-size: 10px;
      }

      .job-actions {
        display: flex;
        gap: 12px;
      }

      .action-btn {
        flex: 1;
        padding: 12px 20px;
        border: none;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .btn-primary {
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
      }

      .btn-primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
      }

      .btn-secondary {
        background: white;
        color: #10b981;
        border: 2px solid #10b981;
      }

      .btn-secondary:hover {
        background: #10b981;
        color: white;
        transform: translateY(-1px);
      }

      /* Loading and Empty States */
      .loading-state,
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 400px;
        text-align: center;
        padding: 60px 20px;
      }

      .loading-icon,
      .empty-icon {
        width: 80px;
        height: 80px;
        background: linear-gradient(135deg, #10b981, #059669);
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 24px;
        position: relative;
      }

      .loading-icon {
        animation: pulse-glow 2s ease-in-out infinite;
      }

      .loading-icon i,
      .empty-icon i {
        font-size: 36px;
        color: white;
      }

      @keyframes pulse-glow {
        0%,
        100% {
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
          transform: scale(1);
        }
        50% {
          box-shadow: 0 0 40px rgba(16, 185, 129, 0.6);
          transform: scale(1.05);
        }
      }

      .loading-text,
      .empty-text {
        font-size: 18px;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 8px;
      }

      .loading-subtext,
      .empty-subtext {
        font-size: 14px;
        color: #6b7280;
        max-width: 400px;
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        .hero-content {
          flex-direction: column;
          text-align: center;
          padding: 40px 20px;
        }

        .hero-actions {
          margin-left: 0;
          margin-top: 24px;
        }

        .hero-text h1 {
          font-size: 36px;
        }

        .filters-container {
          grid-template-columns: 1fr;
          gap: 16px;
        }

        .jobs-list {
          padding: 0 16px;
        }

        .modern-job-card {
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
          padding: 16px;
        }

        .company-logo {
          width: 60px;
          height: 60px;
        }

        .candidate-actions {
          width: 100%;
          flex-direction: row;
          align-items: center;
          min-width: auto;
        }

        .job-stats {
          width: 100%;
          align-items: flex-start;
          min-width: auto;
        }

        .admin-actions {
          position: static;
          margin-top: 8px;
        }
      }

      @media (max-width: 480px) {
        .hero-text h1 {
          font-size: 28px;
        }

        .hero-text p {
          font-size: 16px;
        }

        .filters-section,
        .jobs-list {
          padding: 0 16px;
        }

        .filter-card {
          padding: 20px;
        }

        .job-company-info {
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
        }

        .location-separator {
          display: none;
        }
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

      .loading-state,
      .empty-state {
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
    `,
  ],
})
export class JobsComponent implements OnInit {
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  isLoading = true;
  isApplying = false;
  isCreating = false;

  // Animation particles
  particles = Array(6).fill(0);

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
    skills: [] as string[],
  };
  skillsInput = '';

  // Applied jobs tracking
  appliedJobs: Set<string> = new Set();

  constructor(
    private apiService: ApiService,
    public authService: AuthService,
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
      },
    });
  }

  loadUserApplications() {
    this.apiService.getApplications().subscribe({
      next: (applications) => {
        this.appliedJobs = new Set(applications.map((app) => app.jobId));
      },
      error: (error) => {
        console.error('Failed to load applications:', error);
      },
    });
  }

  filterJobs() {
    this.filteredJobs = this.jobs.filter((job) => {
      const matchesSearch =
        !this.searchTerm ||
        job.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        job.skills?.some((skill) =>
          skill.toLowerCase().includes(this.searchTerm.toLowerCase()),
        );

      const matchesExperience =
        !this.experienceFilter ||
        this.matchesExperienceFilter(job.experience || 0);

      const matchesSkills =
        !this.skillsFilter ||
        job.skills?.some((skill) =>
          skill.toLowerCase().includes(this.skillsFilter.toLowerCase()),
        );

      return matchesSearch && matchesExperience && matchesSkills;
    });
  }

  matchesExperienceFilter(experience: number): boolean {
    switch (this.experienceFilter) {
      case '0-2':
        return experience <= 2;
      case '3-5':
        return experience >= 3 && experience <= 5;
      case '6-10':
        return experience >= 6 && experience <= 10;
      case '10+':
        return experience > 10;
      default:
        return true;
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
      coverLetter: `I am interested in the ${job.title} position and believe my skills align well with your requirements.`,
    };

    this.apiService.createApplication(application).subscribe({
      next: (response) => {
        this.appliedJobs.add(job.id);
        this.isApplying = false;
      },
      error: (error) => {
        console.error('Failed to apply:', error);
        this.isApplying = false;
      },
    });
  }

  createJob() {
    if (!this.newJob.title || !this.newJob.description) return;

    this.isCreating = true;
    this.newJob.skills = this.skillsInput
      .split(',')
      .map((skill) => skill.trim())
      .filter((skill) => skill);

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
      },
    });
  }

  editJob(job: Job) {
    console.log('Edit job:', job);
  }

  deleteJob(jobId: string) {
    if (confirm('Are you sure you want to delete this job?')) {
      this.apiService.deleteJob(jobId).subscribe({
        next: () => {
          this.loadJobs();
          this.showCreateModal = false;
          this.resetForm();
        },
        error: (error) => {
          console.error('Error creating job:', error);
        }
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatDeadline(createdDate: string): string {
    const created = new Date(createdDate);
    const deadline = new Date(created);
    deadline.setDate(deadline.getDate() + 30); // 30 days from creation
    return deadline.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  resetForm() {
    this.newJob = {
      title: '',
      description: '',
      experience: 0,
      skills: [],
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
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  }
}
