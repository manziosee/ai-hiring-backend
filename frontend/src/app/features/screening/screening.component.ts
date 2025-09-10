import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatExpansionModule } from '@angular/material/expansion';
import { FileUploadComponent } from '../../shared/components/file-upload/file-upload.component';

@Component({
  selector: 'app-screening',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule,
    MatTabsModule,
    MatBadgeModule,
    MatExpansionModule,
    FileUploadComponent
  ],
  template: `
    <div class="screening-container">
      <div class="header-section">
        <h1><mat-icon>assessment</mat-icon> AI-Powered Screening</h1>
        <p>Intelligent candidate evaluation using advanced AI algorithms</p>
      </div>

      <mat-tab-group class="screening-tabs">
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>upload_file</mat-icon>
            Bulk Screening
          </ng-template>
          
          <div class="bulk-screening-section">
            <mat-card class="upload-card">
              <mat-card-header>
                <mat-card-title>Upload Resumes for Batch Processing</mat-card-title>
                <mat-card-subtitle>Upload multiple resumes to screen candidates automatically</mat-card-subtitle>
              </mat-card-header>
              
              <mat-card-content>
                <app-file-upload 
                  [multiple]="true"
                  [acceptedTypes]="'.pdf,.doc,.docx'"
                  [maxSizeMB]="10"
                  (filesSelected)="onFilesSelected($event)"
                  (uploadComplete)="onUploadComplete($event)">
                </app-file-upload>
              </mat-card-content>
              
              <mat-card-actions *ngIf="selectedFiles.length > 0">
                <button mat-raised-button color="primary" (click)="startBulkScreening()">
                  <mat-icon>psychology</mat-icon>
                  Start AI Screening ({{selectedFiles.length}} files)
                </button>
              </mat-card-actions>
            </mat-card>
          </div>
        </mat-tab>
        
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>people</mat-icon>
            Screening Results <span matBadge="{{screeningResults.length}}" matBadgeColor="primary"></span>
          </ng-template>
          
          <div class="results-section">
            <div class="results-grid">
              <mat-card class="result-card" *ngFor="let result of screeningResults">
                <mat-card-header>
                  <div mat-card-avatar class="candidate-avatar">
                    <mat-icon>person</mat-icon>
                  </div>
                  <mat-card-title>{{result.candidateName}}</mat-card-title>
                  <mat-card-subtitle>{{result.position}} • Screened {{result.screenedDate}}</mat-card-subtitle>
                  <div class="score-badge">
                    <mat-chip [color]="getScoreColor(result.overallScore)">{{result.overallScore}}% Match</mat-chip>
                  </div>
                </mat-card-header>
                
                <mat-card-content>
                  <div class="score-breakdown">
                    <div class="score-item">
                      <span class="score-label">Skills Match</span>
                      <div class="score-bar">
                        <mat-progress-bar [value]="result.skillsScore" color="primary"></mat-progress-bar>
                        <span class="score-value">{{result.skillsScore}}%</span>
                      </div>
                    </div>
                    
                    <div class="score-item">
                      <span class="score-label">Experience</span>
                      <div class="score-bar">
                        <mat-progress-bar [value]="result.experienceScore" color="accent"></mat-progress-bar>
                        <span class="score-value">{{result.experienceScore}}%</span>
                      </div>
                    </div>
                    
                    <div class="score-item">
                      <span class="score-label">Education</span>
                      <div class="score-bar">
                        <mat-progress-bar [value]="result.educationScore" color="warn"></mat-progress-bar>
                        <span class="score-value">{{result.educationScore}}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <mat-expansion-panel class="ai-insights">
                    <mat-expansion-panel-header>
                      <mat-panel-title>
                        <mat-icon>psychology</mat-icon>
                        AI Insights
                      </mat-panel-title>
                    </mat-expansion-panel-header>
                    
                    <div class="insights-content">
                      <div class="strengths">
                        <h4><mat-icon>thumb_up</mat-icon> Strengths</h4>
                        <ul>
                          <li *ngFor="let strength of result.strengths">{{strength}}</li>
                        </ul>
                      </div>
                      
                      <div class="concerns">
                        <h4><mat-icon>warning</mat-icon> Areas of Concern</h4>
                        <ul>
                          <li *ngFor="let concern of result.concerns">{{concern}}</li>
                        </ul>
                      </div>
                      
                      <div class="recommendations">
                        <h4><mat-icon>lightbulb</mat-icon> Recommendations</h4>
                        <p>{{result.recommendation}}</p>
                      </div>
                    </div>
                  </mat-expansion-panel>
                  
                  <div class="extracted-skills">
                    <h4>Extracted Skills:</h4>
                    <mat-chip-set>
                      <mat-chip *ngFor="let skill of result.extractedSkills">{{skill}}</mat-chip>
                    </mat-chip-set>
                  </div>
                </mat-card-content>
                
                <mat-card-actions>
                  <button mat-button color="primary">
                    <mat-icon>visibility</mat-icon> View Resume
                  </button>
                  <button mat-raised-button color="primary" *ngIf="result.overallScore >= 70">
                    <mat-icon>schedule</mat-icon> Schedule Interview
                  </button>
                  <button mat-button>
                    <mat-icon>message</mat-icon> Contact Candidate
                  </button>
                  <button mat-button color="warn">
                    <mat-icon>close</mat-icon> Reject
                  </button>
                </mat-card-actions>
              </mat-card>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .screening-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header-section {
      margin-bottom: 32px;
    }

    .header-section h1 {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0 0 8px 0;
      color: #333;
      font-size: 2rem;
    }

    .header-section p {
      margin: 0;
      color: #666;
      font-size: 16px;
    }

    .screening-tabs {
      margin-bottom: 24px;
    }

    .bulk-screening-section {
      padding: 24px 0;
    }

    .upload-card {
      max-width: 800px;
      margin: 0 auto;
    }

    .results-section {
      padding: 24px 0;
    }

    .results-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
      gap: 24px;
    }

    .result-card {
      transition: transform 0.2s, box-shadow 0.2s;
      border-radius: 12px;
      overflow: hidden;
    }

    .result-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    }

    .candidate-avatar {
      background: #3f51b5;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .score-badge {
      margin-top: 8px;
    }

    .score-breakdown {
      margin-bottom: 16px;
    }

    .score-item {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .score-label {
      min-width: 100px;
      font-size: 14px;
      color: #666;
      font-weight: 500;
    }

    .score-bar {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .score-bar mat-progress-bar {
      flex: 1;
      height: 8px;
      border-radius: 4px;
    }

    .score-value {
      min-width: 40px;
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }

    .ai-insights {
      margin: 16px 0;
    }

    .insights-content {
      padding: 16px 0;
    }

    .strengths, .concerns, .recommendations {
      margin-bottom: 16px;
    }

    .strengths h4, .concerns h4, .recommendations h4 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 8px 0;
      color: #333;
      font-size: 14px;
      font-weight: 500;
    }

    .strengths ul, .concerns ul {
      margin: 0;
      padding-left: 20px;
    }

    .strengths li {
      color: #4caf50;
    }

    .concerns li {
      color: #ff9800;
    }

    .recommendations p {
      margin: 0;
      color: #666;
      font-style: italic;
    }

    .extracted-skills h4 {
      margin: 16px 0 8px 0;
      color: #333;
      font-size: 14px;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .screening-container {
        padding: 16px;
      }

      .results-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ScreeningComponent implements OnInit {
  selectedFiles: File[] = [];
  screeningResults = [
    {
      id: 1,
      candidateName: 'John Smith',
      position: 'Senior Frontend Developer',
      screenedDate: '2 hours ago',
      overallScore: 87,
      skillsScore: 92,
      experienceScore: 85,
      educationScore: 84,
      strengths: [
        'Strong React and TypeScript experience',
        'Excellent problem-solving skills',
        'Leadership experience in previous roles'
      ],
      concerns: [
        'Limited backend development experience',
        'No experience with our specific tech stack'
      ],
      recommendation: 'Strong candidate with excellent frontend skills. Recommend for technical interview.',
      extractedSkills: ['React', 'TypeScript', 'JavaScript', 'CSS3', 'Node.js', 'Git']
    },
    {
      id: 2,
      candidateName: 'Sarah Johnson',
      position: 'AI/ML Engineer',
      screenedDate: '1 day ago',
      overallScore: 94,
      skillsScore: 96,
      experienceScore: 90,
      educationScore: 96,
      strengths: [
        'PhD in Machine Learning',
        'Extensive Python and TensorFlow experience',
        'Published research in AI journals'
      ],
      concerns: [
        'May be overqualified for the position',
        'Salary expectations might be high'
      ],
      recommendation: 'Exceptional candidate with strong academic and practical background. Highly recommended.',
      extractedSkills: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'AWS', 'Docker']
    }
  ];

  ngOnInit(): void {}

  onFilesSelected(files: File[]): void {
    this.selectedFiles = files;
  }

  onUploadComplete(files: File[]): void {
    console.log('Files uploaded:', files);
  }

  startBulkScreening(): void {
    console.log('Starting bulk screening for', this.selectedFiles.length, 'files');
  }

  getScoreColor(score: number): string {
    if (score >= 80) return 'primary';
    if (score >= 60) return 'accent';
    return 'warn';
  }
}