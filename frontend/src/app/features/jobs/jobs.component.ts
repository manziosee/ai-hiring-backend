import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatBadgeModule,
    MatPaginatorModule
  ],
  template: `
    <div class="jobs-container">
      <div class="header-section">
        <div class="title-section">
          <h1><mat-icon>work</mat-icon> Job Opportunities</h1>
          <p>Discover your next career opportunity with AI-powered matching</p>
        </div>
        <button mat-raised-button color="primary" *ngIf="canCreateJob()" class="create-job-btn">
          <mat-icon>add</mat-icon> Post New Job
        </button>
      </div>

      <div class="search-filters">
        <form [formGroup]="searchForm" class="search-form">
          <mat-form-field class="search-field">
            <mat-label>Search jobs...</mat-label>
            <input matInput formControlName="search" placeholder="Job title, company, keywords">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
          
          <mat-form-field class="filter-field">
            <mat-label>Location</mat-label>
            <mat-select formControlName="location">
              <mat-option value="">All Locations</mat-option>
              <mat-option value="remote">Remote</mat-option>
              <mat-option value="new-york">New York</mat-option>
              <mat-option value="san-francisco">San Francisco</mat-option>
              <mat-option value="london">London</mat-option>
            </mat-select>
          </mat-form-field>
          
          <mat-form-field class="filter-field">
            <mat-label>Job Type</mat-label>
            <mat-select formControlName="type">
              <mat-option value="">All Types</mat-option>
              <mat-option value="full-time">Full Time</mat-option>
              <mat-option value="part-time">Part Time</mat-option>
              <mat-option value="contract">Contract</mat-option>
              <mat-option value="internship">Internship</mat-option>
            </mat-select>
          </mat-form-field>
          
          <mat-form-field class="filter-field">
            <mat-label>Experience Level</mat-label>
            <mat-select formControlName="experience">
              <mat-option value="">All Levels</mat-option>
              <mat-option value="entry">Entry Level</mat-option>
              <mat-option value="mid">Mid Level</mat-option>
              <mat-option value="senior">Senior Level</mat-option>
              <mat-option value="lead">Lead/Principal</mat-option>
            </mat-select>
          </mat-form-field>
        </form>
      </div>

      <div class="jobs-grid">
        <mat-card class="job-card" *ngFor="let job of jobs">
          <mat-card-header>
            <div mat-card-avatar class="company-avatar">
              <mat-icon>business</mat-icon>
            </div>
            <mat-card-title>{{job.title}}</mat-card-title>
            <mat-card-subtitle>{{job.company}} • {{job.location}}</mat-card-subtitle>
            <div class="job-badges">
              <mat-chip-set>
                <mat-chip [color]="getJobTypeColor(job.type)">{{job.type}}</mat-chip>
                <mat-chip *ngIf="job.remote" color="accent">Remote</mat-chip>
                <mat-chip *ngIf="job.urgent" color="warn">Urgent</mat-chip>
              </mat-chip-set>
            </div>
          </mat-card-header>
          
          <mat-card-content>
            <p class="job-description">{{job.description}}</p>
            
            <div class="job-details">
              <div class="detail-item">
                <mat-icon>attach_money</mat-icon>
                <span>{{job.salary}}</span>
              </div>
              <div class="detail-item">
                <mat-icon>schedule</mat-icon>
                <span>{{job.postedDate}}</span>
              </div>
              <div class="detail-item">
                <mat-icon>people</mat-icon>
                <span>{{job.applicants}} applicants</span>
              </div>
            </div>
            
            <div class="skills-section">
              <h4>Required Skills:</h4>
              <mat-chip-set>
                <mat-chip *ngFor="let skill of job.skills">{{skill}}</mat-chip>
              </mat-chip-set>
            </div>
          </mat-card-content>
          
          <mat-card-actions>
            <button mat-button color="primary">
              <mat-icon>visibility</mat-icon> View Details
            </button>
            <button mat-raised-button color="primary" *ngIf="!canCreateJob()">
              <mat-icon>send</mat-icon> Apply Now
            </button>
            <button mat-button *ngIf="canCreateJob()">
              <mat-icon>edit</mat-icon> Edit
            </button>
            <button mat-button *ngIf="canCreateJob()">
              <mat-icon>assessment</mat-icon> View Applications
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
      
      <mat-paginator 
        [length]="totalJobs" 
        [pageSize]="pageSize" 
        [pageSizeOptions]="[5, 10, 25, 100]"
        class="jobs-paginator">
      </mat-paginator>
    </div>
  `,
  styles: [`
    .jobs-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .title-section h1 {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0 0 8px 0;
      color: #333;
      font-size: 2rem;
    }

    .title-section p {
      margin: 0;
      color: #666;
      font-size: 16px;
    }

    .create-job-btn {
      height: 48px;
      padding: 0 24px;
    }

    .search-filters {
      background: white;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 32px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .search-form {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 16px;
      align-items: center;
    }

    .search-field {
      width: 100%;
    }

    .filter-field {
      width: 100%;
    }

    .jobs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .job-card {
      transition: transform 0.2s, box-shadow 0.2s;
      border-radius: 12px;
      overflow: hidden;
    }

    .job-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    }

    .company-avatar {
      background: #3f51b5;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .job-badges {
      margin-top: 8px;
    }

    .job-description {
      color: #666;
      line-height: 1.5;
      margin-bottom: 16px;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .job-details {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 16px;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
      font-size: 14px;
    }

    .detail-item mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .skills-section h4 {
      margin: 0 0 8px 0;
      color: #333;
      font-size: 14px;
      font-weight: 500;
    }

    .jobs-paginator {
      background: white;
      border-radius: 8px;
    }

    @media (max-width: 768px) {
      .jobs-container {
        padding: 16px;
      }

      .header-section {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .search-form {
        grid-template-columns: 1fr;
      }

      .jobs-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class JobsComponent implements OnInit {
  searchForm: FormGroup;
  jobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      type: 'Full Time',
      remote: true,
      urgent: false,
      salary: '$120k - $160k',
      postedDate: '2 days ago',
      applicants: 23,
      description: 'We are looking for a skilled Frontend Developer to join our dynamic team. You will be responsible for building user-facing features using modern frameworks.',
      skills: ['React', 'TypeScript', 'Angular', 'Vue.js', 'CSS3']
    },
    {
      id: 2,
      title: 'AI/ML Engineer',
      company: 'DataTech Solutions',
      location: 'Remote',
      type: 'Full Time',
      remote: true,
      urgent: true,
      salary: '$140k - $180k',
      postedDate: '1 day ago',
      applicants: 45,
      description: 'Join our AI team to develop cutting-edge machine learning models and algorithms. Experience with deep learning frameworks required.',
      skills: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'AWS']
    },
    {
      id: 3,
      title: 'Product Manager',
      company: 'Innovation Labs',
      location: 'New York, NY',
      type: 'Full Time',
      remote: false,
      urgent: false,
      salary: '$110k - $140k',
      postedDate: '3 days ago',
      applicants: 67,
      description: 'Lead product strategy and roadmap for our flagship products. Work closely with engineering and design teams to deliver exceptional user experiences.',
      skills: ['Product Strategy', 'Agile', 'Analytics', 'User Research', 'Roadmapping']
    }
  ];
  
  totalJobs = 150;
  pageSize = 10;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.searchForm = this.fb.group({
      search: [''],
      location: [''],
      type: [''],
      experience: ['']
    });
  }

  ngOnInit(): void {
    this.searchForm.valueChanges.subscribe(values => {
      this.filterJobs(values);
    });
  }

  canCreateJob(): boolean {
    return this.authService.hasRole(['ADMIN', 'RECRUITER']);
  }

  getJobTypeColor(type: string): string {
    switch (type.toLowerCase()) {
      case 'full time': return 'primary';
      case 'part time': return 'accent';
      case 'contract': return 'warn';
      default: return '';
    }
  }

  filterJobs(filters: any): void {
    console.log('Filtering jobs with:', filters);
  }
}