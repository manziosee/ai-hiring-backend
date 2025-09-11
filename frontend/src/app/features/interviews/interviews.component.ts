import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-interviews',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="interviews-container">
      <div class="header-section">
        <h1><mat-icon>event</mat-icon> Interview Management</h1>
        <p>Schedule and manage candidate interviews</p>
      </div>

      <mat-tab-group>
        <mat-tab label="Upcoming Interviews">
          <div class="interviews-grid">
            <mat-card class="interview-card" *ngFor="let interview of upcomingInterviews">
              <mat-card-header>
                <mat-card-title>{{interview.candidateName}}</mat-card-title>
                <mat-card-subtitle>{{interview.jobTitle}} • {{interview.scheduledAt | date:'medium'}}</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <div class="interview-details">
                  <div class="detail-item">
                    <mat-icon>schedule</mat-icon>
                    <span>{{interview.duration}} minutes</span>
                  </div>
                  <div class="detail-item">
                    <mat-icon>video_call</mat-icon>
                    <span>{{interview.mode}}</span>
                  </div>
                </div>
                <p *ngIf="interview.notes">{{interview.notes}}</p>
              </mat-card-content>
              <mat-card-actions>
                <button mat-raised-button color="primary">
                  <mat-icon>video_call</mat-icon> Join Interview
                </button>
                <button mat-button>
                  <mat-icon>edit</mat-icon> Reschedule
                </button>
              </mat-card-actions>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="Schedule New">
          <div class="schedule-form">
            <form [formGroup]="scheduleForm" (ngSubmit)="scheduleInterview()">
              <mat-form-field>
                <mat-label>Candidate</mat-label>
                <input matInput formControlName="candidateName" required>
              </mat-form-field>
              
              <mat-form-field>
                <mat-label>Job Position</mat-label>
                <input matInput formControlName="jobTitle" required>
              </mat-form-field>
              
              <mat-form-field>
                <mat-label>Interview Date & Time</mat-label>
                <input matInput [matDatepicker]="picker" formControlName="scheduledAt" required>
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>
              
              <mat-form-field>
                <mat-label>Duration (minutes)</mat-label>
                <input matInput type="number" formControlName="duration" required>
              </mat-form-field>
              
              <mat-form-field>
                <mat-label>Notes</mat-label>
                <textarea matInput formControlName="notes" rows="3"></textarea>
              </mat-form-field>
              
              <button mat-raised-button color="primary" type="submit" [disabled]="scheduleForm.invalid">
                <mat-icon>event</mat-icon> Schedule Interview
              </button>
            </form>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .interviews-container {
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

    .interviews-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 24px;
      padding: 24px 0;
    }

    .interview-card {
      border-radius: 12px;
    }

    .interview-details {
      display: flex;
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

    .schedule-form {
      max-width: 600px;
      padding: 24px;
    }

    .schedule-form mat-form-field {
      width: 100%;
      margin-bottom: 16px;
    }
  `]
})
export class InterviewsComponent implements OnInit {
  scheduleForm: FormGroup;
  
  upcomingInterviews = [
    {
      id: 1,
      candidateName: 'John Smith',
      jobTitle: 'Senior Frontend Developer',
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      duration: 60,
      mode: 'Video Call',
      notes: 'Technical interview focusing on React and TypeScript'
    }
  ];

  constructor(private fb: FormBuilder) {
    this.scheduleForm = this.fb.group({
      candidateName: ['', Validators.required],
      jobTitle: ['', Validators.required],
      scheduledAt: ['', Validators.required],
      duration: [60, [Validators.required, Validators.min(15)]],
      notes: ['']
    });
  }

  ngOnInit(): void {}

  scheduleInterview(): void {
    if (this.scheduleForm.valid) {
      console.log('Scheduling interview:', this.scheduleForm.value);
    }
  }
}