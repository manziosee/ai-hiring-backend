import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-candidates',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="candidates-container">
      <div class="header-section">
        <h1><mat-icon>people</mat-icon> Candidate Pool</h1>
        <p>Manage and review candidate profiles</p>
      </div>

      <div class="search-filters">
        <form [formGroup]="searchForm" class="search-form">
          <mat-form-field class="search-field">
            <mat-label>Search candidates...</mat-label>
            <input matInput formControlName="search" placeholder="Name, skills, experience">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
          
          <mat-form-field>
            <mat-label>Experience Level</mat-label>
            <mat-select formControlName="experience">
              <mat-option value="">All Levels</mat-option>
              <mat-option value="entry">Entry Level</mat-option>
              <mat-option value="mid">Mid Level</mat-option>
              <mat-option value="senior">Senior Level</mat-option>
            </mat-select>
          </mat-form-field>
          
          <mat-form-field>
            <mat-label>Skills</mat-label>
            <mat-select formControlName="skills" multiple>
              <mat-option value="javascript">JavaScript</mat-option>
              <mat-option value="typescript">TypeScript</mat-option>
              <mat-option value="react">React</mat-option>
              <mat-option value="angular">Angular</mat-option>
              <mat-option value="python">Python</mat-option>
            </mat-select>
          </mat-form-field>
        </form>
      </div>

      <div class="candidates-grid">
        <mat-card class="candidate-card" *ngFor="let candidate of candidates">
          <mat-card-header>
            <div mat-card-avatar class="candidate-avatar">
              <mat-icon>person</mat-icon>
            </div>
            <mat-card-title>{{candidate.name}}</mat-card-title>
            <mat-card-subtitle>{{candidate.title}} • {{candidate.experience}} years exp</mat-card-subtitle>
            <div class="rating-badge">
              <mat-chip [color]="getRatingColor(candidate.rating)">{{candidate.rating}}/5</mat-chip>
            </div>
          </mat-card-header>
          
          <mat-card-content>
            <div class="candidate-details">
              <div class="detail-item">
                <mat-icon>location_on</mat-icon>
                <span>{{candidate.location}}</span>
              </div>
              <div class="detail-item">
                <mat-icon>email</mat-icon>
                <span>{{candidate.email}}</span>
              </div>
              <div class="detail-item">
                <mat-icon>work</mat-icon>
                <span>{{candidate.applications}} applications</span>
              </div>
            </div>
            
            <div class="skills-section">
              <h4>Skills:</h4>
              <mat-chip-set>
                <mat-chip *ngFor="let skill of candidate.skills">{{skill}}</mat-chip>
              </mat-chip-set>
            </div>
            
            <p class="candidate-summary">{{candidate.summary}}</p>
          </mat-card-content>
          
          <mat-card-actions>
            <button mat-button color="primary">
              <mat-icon>visibility</mat-icon> View Profile
            </button>
            <button mat-button>
              <mat-icon>description</mat-icon> Resume
            </button>
            <button mat-raised-button color="primary">
              <mat-icon>message</mat-icon> Contact
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .candidates-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header-section h1 {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0 0 8px 0;
      color: #333;
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
      grid-template-columns: 2fr 1fr 1fr;
      gap: 16px;
    }

    .candidates-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 24px;
    }

    .candidate-card {
      border-radius: 12px;
      transition: transform 0.2s;
    }

    .candidate-card:hover {
      transform: translateY(-2px);
    }

    .candidate-avatar {
      background: #3f51b5;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .rating-badge {
      margin-top: 8px;
    }

    .candidate-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 16px;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
      font-size: 14px;
    }

    .skills-section h4 {
      margin: 16px 0 8px 0;
      color: #333;
      font-size: 14px;
    }

    .candidate-summary {
      color: #666;
      font-size: 14px;
      line-height: 1.4;
      margin-top: 12px;
    }
  `]
})
export class CandidatesComponent implements OnInit {
  searchForm: FormGroup;
  
  candidates = [
    {
      id: 1,
      name: 'Sarah Johnson',
      title: 'Senior Frontend Developer',
      experience: 5,
      location: 'San Francisco, CA',
      email: 'sarah.j@email.com',
      applications: 3,
      rating: 4.8,
      skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
      summary: 'Experienced frontend developer with expertise in modern web technologies and team leadership.'
    },
    {
      id: 2,
      name: 'Michael Chen',
      title: 'Full Stack Developer',
      experience: 3,
      location: 'New York, NY',
      email: 'michael.c@email.com',
      applications: 2,
      rating: 4.5,
      skills: ['JavaScript', 'Python', 'Django', 'AWS'],
      summary: 'Versatile full-stack developer with strong problem-solving skills and cloud experience.'
    }
  ];

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      search: [''],
      experience: [''],
      skills: [[]]
    });
  }

  ngOnInit(): void {
    this.searchForm.valueChanges.subscribe(values => {
      this.filterCandidates(values);
    });
  }

  getRatingColor(rating: number): string {
    if (rating >= 4.5) return 'primary';
    if (rating >= 4.0) return 'accent';
    return 'warn';
  }

  filterCandidates(filters: any): void {
    console.log('Filtering candidates:', filters);
  }
}