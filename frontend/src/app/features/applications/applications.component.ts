import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    MatProgressBarModule,
    MatBadgeModule
  ],
  template: `
    <div class="applications-container">
      <div class="header-section">
        <h1><mat-icon>assignment</mat-icon> My Applications</h1>
        <p>Track your job applications and their progress</p>
      </div>

      <mat-tab-group class="applications-tabs">
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>send</mat-icon>
            Active <span matBadge="{{activeApplications.length}}" matBadgeColor="primary"></span>
          </ng-template>
          
          <div class="applications-grid">
            <mat-card class="application-card" *ngFor="let app of activeApplications">
              <mat-card-header>
                <div mat-card-avatar class="company-avatar">
                  <mat-icon>business</mat-icon>
                </div>
                <mat-card-title>{{app.jobTitle}}</mat-card-title>
                <mat-card-subtitle>{{app.company}} • Applied {{app.appliedDate}}</mat-card-subtitle>
                <div class="status-chip">
                  <mat-chip [color]="getStatusColor(app.status)">{{app.status}}</mat-chip>
                </div>
              </mat-card-header>
              
              <mat-card-content>
                <div class="progress-section">
                  <h4>Application Progress</h4>
                  <mat-progress-bar [value]="getProgressValue(app.status)" color="primary"></mat-progress-bar>
                  <div class="progress-steps">
                    <div class="step" [class.active]="isStepActive(app.status, 'Applied')">Applied</div>
                    <div class="step" [class.active]="isStepActive(app.status, 'Screening')">Screening</div>
                    <div class="step" [class.active]="isStepActive(app.status, 'Interview')">Interview</div>
                    <div class="step" [class.active]="isStepActive(app.status, 'Decision')">Decision</div>
                  </div>
                </div>
                
                <div class="application-details">
                  <div class="detail-item">
                    <mat-icon>location_on</mat-icon>
                    <span>{{app.location}}</span>
                  </div>
                  <div class="detail-item">
                    <mat-icon>attach_money</mat-icon>
                    <span>{{app.salary}}</span>
                  </div>
                  <div class="detail-item">
                    <mat-icon>schedule</mat-icon>
                    <span>{{app.type}}</span>
                  </div>
                </div>
                
                <div class="next-steps" *ngIf="app.nextSteps">
                  <h4>Next Steps:</h4>
                  <p>{{app.nextSteps}}</p>
                </div>
              </mat-card-content>
              
              <mat-card-actions>
                <button mat-button color="primary">
                  <mat-icon>visibility</mat-icon> View Details
                </button>
                <button mat-button>
                  <mat-icon>message</mat-icon> Messages
                </button>
                <button mat-button *ngIf="app.status === 'Interview Scheduled'">
                  <mat-icon>event</mat-icon> Interview Details
                </button>
              </mat-card-actions>
            </mat-card>
          </div>
        </mat-tab>
        
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>history</mat-icon>
            All Applications
          </ng-template>
          
          <div class="applications-grid">
            <mat-card class="application-card" *ngFor="let app of allApplications">
              <mat-card-header>
                <div mat-card-avatar class="company-avatar">
                  <mat-icon>business</mat-icon>
                </div>
                <mat-card-title>{{app.jobTitle}}</mat-card-title>
                <mat-card-subtitle>{{app.company}} • Applied {{app.appliedDate}}</mat-card-subtitle>
                <div class="status-chip">
                  <mat-chip [color]="getStatusColor(app.status)">{{app.status}}</mat-chip>
                </div>
              </mat-card-header>
              
              <mat-card-content>
                <div class="application-summary">
                  <p>{{app.summary}}</p>
                </div>
              </mat-card-content>
              
              <mat-card-actions>
                <button mat-button color="primary">
                  <mat-icon>visibility</mat-icon> View Details
                </button>
              </mat-card-actions>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .applications-container {
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

    .applications-tabs {
      margin-bottom: 24px;
    }

    .applications-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 24px;
      padding: 24px 0;
    }

    .application-card {
      transition: transform 0.2s, box-shadow 0.2s;
      border-radius: 12px;
      overflow: hidden;
    }

    .application-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    }

    .company-avatar {
      background: #3f51b5;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .status-chip {
      margin-top: 8px;
    }

    .progress-section {
      margin-bottom: 16px;
    }

    .progress-section h4 {
      margin: 0 0 8px 0;
      color: #333;
      font-size: 14px;
      font-weight: 500;
    }

    .progress-steps {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;
    }

    .step {
      font-size: 12px;
      color: #999;
      padding: 4px 8px;
      border-radius: 12px;
      background: #f5f5f5;
    }

    .step.active {
      color: #3f51b5;
      background: #e8eaf6;
      font-weight: 500;
    }

    .application-details {
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

    .next-steps {
      background: #f8f9fa;
      padding: 12px;
      border-radius: 8px;
      margin-top: 16px;
    }

    .next-steps h4 {
      margin: 0 0 8px 0;
      color: #333;
      font-size: 14px;
      font-weight: 500;
    }

    .next-steps p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    .application-summary p {
      color: #666;
      line-height: 1.5;
      margin: 0;
    }

    @media (max-width: 768px) {
      .applications-container {
        padding: 16px;
      }

      .applications-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ApplicationsComponent implements OnInit {
  activeApplications = [
    {
      id: 1,
      jobTitle: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      salary: '$120k - $160k',
      type: 'Full Time',
      appliedDate: '3 days ago',
      status: 'Interview Scheduled',
      nextSteps: 'Technical interview scheduled for tomorrow at 2:00 PM PST',
      summary: 'Frontend developer position with focus on React and TypeScript'
    },
    {
      id: 2,
      jobTitle: 'AI/ML Engineer',
      company: 'DataTech Solutions',
      location: 'Remote',
      salary: '$140k - $180k',
      type: 'Full Time',
      appliedDate: '1 week ago',
      status: 'Under Review',
      nextSteps: 'Application is being reviewed by the hiring team',
      summary: 'Machine learning engineer role focusing on deep learning models'
    }
  ];

  allApplications = [
    ...this.activeApplications,
    {
      id: 3,
      jobTitle: 'Product Manager',
      company: 'Innovation Labs',
      location: 'New York, NY',
      salary: '$110k - $140k',
      type: 'Full Time',
      appliedDate: '2 weeks ago',
      status: 'Rejected',
      summary: 'Thank you for your interest. We decided to move forward with another candidate.'
    },
    {
      id: 4,
      jobTitle: 'Full Stack Developer',
      company: 'StartupXYZ',
      location: 'Austin, TX',
      salary: '$90k - $120k',
      type: 'Full Time',
      appliedDate: '1 month ago',
      status: 'Hired',
      summary: 'Congratulations! You have been selected for this position.'
    }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'interview scheduled': return 'primary';
      case 'under review': return 'accent';
      case 'hired': return 'primary';
      case 'rejected': return 'warn';
      default: return '';
    }
  }

  getProgressValue(status: string): number {
    switch (status.toLowerCase()) {
      case 'applied': return 25;
      case 'under review': return 50;
      case 'interview scheduled': return 75;
      case 'hired': return 100;
      default: return 0;
    }
  }

  isStepActive(currentStatus: string, step: string): boolean {
    const statusOrder = ['Applied', 'Screening', 'Interview', 'Decision'];
    const currentIndex = this.getStatusIndex(currentStatus);
    const stepIndex = statusOrder.indexOf(step);
    return stepIndex <= currentIndex;
  }

  private getStatusIndex(status: string): number {
    switch (status.toLowerCase()) {
      case 'applied': return 0;
      case 'under review': return 1;
      case 'interview scheduled': return 2;
      case 'hired': case 'rejected': return 3;
      default: return 0;
    }
  }
}