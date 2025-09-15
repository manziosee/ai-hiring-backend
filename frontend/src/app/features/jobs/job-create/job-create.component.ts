import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-job-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="job-create-container">
      <!-- Animated Background -->
      <div class="background-animation">
        <div class="gradient-orb orb-1"></div>
        <div class="gradient-orb orb-2"></div>
        <div class="gradient-orb orb-3"></div>
        <div class="floating-particles">
          <div
            class="particle"
            *ngFor="let p of particles; let i = index"
            [style.animation-delay.s]="i * 0.3"
          ></div>
        </div>
      </div>

      <div class="job-create-content">
        <div class="page-header">
          <div class="header-content">
            <button class="back-btn" (click)="goBack()">
              <i class="fas fa-arrow-left"></i>
              Back to Dashboard
            </button>
            <div class="header-text">
              <h1><i class="fas fa-plus-circle"></i> Create New Job Posting</h1>
              <p>Fill out the details below to post a new job opportunity</p>
            </div>
          </div>
        </div>

        <div class="form-container">
          <form [formGroup]="jobForm" (ngSubmit)="onSubmit()" class="job-form">
            <!-- Basic Information -->
            <div class="form-section">
              <div class="section-header">
                <h2><i class="fas fa-info-circle"></i> Basic Information</h2>
                <p>Essential details about the position</p>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label for="title">Job Title *</label>
                  <input
                    type="text"
                    id="title"
                    formControlName="title"
                    placeholder="e.g. Senior Frontend Developer"
                    [class.error]="isFieldInvalid('title')"
                  />
                  <div class="error-message" *ngIf="isFieldInvalid('title')">
                    Job title is required
                  </div>
                </div>

                <div class="form-group">
                  <label for="department">Department</label>
                  <select id="department" formControlName="department">
                    <option value="">Select Department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="HR">Human Resources</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="location">Location *</label>
                  <input
                    type="text"
                    id="location"
                    formControlName="location"
                    placeholder="e.g. San Francisco, CA or Remote"
                    [class.error]="isFieldInvalid('location')"
                  />
                  <div class="error-message" *ngIf="isFieldInvalid('location')">
                    Location is required
                  </div>
                </div>

                <div class="form-group">
                  <label for="type">Employment Type *</label>
                  <select
                    id="type"
                    formControlName="type"
                    [class.error]="isFieldInvalid('type')"
                  >
                    <option value="">Select Type</option>
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="INTERNSHIP">Internship</option>
                  </select>
                  <div class="error-message" *ngIf="isFieldInvalid('type')">
                    Employment type is required
                  </div>
                </div>

                <div class="form-group">
                  <label for="experience">Experience Level *</label>
                  <select
                    id="experience"
                    formControlName="experience"
                    [class.error]="isFieldInvalid('experience')"
                  >
                    <option value="">Select Experience</option>
                    <option value="0">Entry Level (0-1 years)</option>
                    <option value="2">Junior (2-3 years)</option>
                    <option value="4">Mid-Level (4-6 years)</option>
                    <option value="7">Senior (7-10 years)</option>
                    <option value="11">Lead/Principal (10+ years)</option>
                  </select>
                  <div
                    class="error-message"
                    *ngIf="isFieldInvalid('experience')"
                  >
                    Experience level is required
                  </div>
                </div>

                <div class="form-group">
                  <label for="salary">Salary Range</label>
                  <div class="salary-inputs">
                    <input
                      type="number"
                      formControlName="salaryMin"
                      placeholder="Min"
                      min="0"
                    />
                    <span class="salary-separator">to</span>
                    <input
                      type="number"
                      formControlName="salaryMax"
                      placeholder="Max"
                      min="0"
                    />
                    <select formControlName="salaryCurrency">
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- Job Description -->
            <div class="form-section">
              <div class="section-header">
                <h2><i class="fas fa-file-alt"></i> Job Description</h2>
                <p>Detailed information about the role and responsibilities</p>
              </div>

              <div class="form-group">
                <label for="description">Job Description *</label>
                <textarea
                  id="description"
                  formControlName="description"
                  rows="8"
                  placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                  [class.error]="isFieldInvalid('description')"
                ></textarea>
                <div
                  class="error-message"
                  *ngIf="isFieldInvalid('description')"
                >
                  Job description is required
                </div>
              </div>

              <div class="form-group">
                <label for="requirements">Requirements</label>
                <textarea
                  id="requirements"
                  formControlName="requirements"
                  rows="6"
                  placeholder="List the key requirements, qualifications, and must-have skills..."
                ></textarea>
              </div>

              <div class="form-group">
                <label for="benefits">Benefits & Perks</label>
                <textarea
                  id="benefits"
                  formControlName="benefits"
                  rows="4"
                  placeholder="Describe the benefits, perks, and what makes your company a great place to work..."
                ></textarea>
              </div>
            </div>

            <!-- Skills & Qualifications -->
            <div class="form-section">
              <div class="section-header">
                <h2><i class="fas fa-cogs"></i> Skills & Qualifications</h2>
                <p>Technical and soft skills required for this position</p>
              </div>

              <div class="form-group">
                <label>Required Skills</label>
                <div class="skills-input">
                  <input
                    type="text"
                    [(ngModel)]="newSkill"
                    [ngModelOptions]="{ standalone: true }"
                    placeholder="Type a skill and press Enter"
                    (keyup.enter)="addSkill()"
                  />
                  <button
                    type="button"
                    class="add-skill-btn"
                    (click)="addSkill()"
                  >
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
                <div class="skills-list" *ngIf="skills.length > 0">
                  <div
                    class="skill-tag"
                    *ngFor="let skill of skills; let i = index"
                  >
                    <span>{{ skill }}</span>
                    <button type="button" (click)="removeSkill(i)">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label for="education">Education Level</label>
                  <select id="education" formControlName="education">
                    <option value="">Select Education</option>
                    <option value="HIGH_SCHOOL">High School</option>
                    <option value="ASSOCIATE">Associate Degree</option>
                    <option value="BACHELOR">Bachelor's Degree</option>
                    <option value="MASTER">Master's Degree</option>
                    <option value="PHD">PhD</option>
                    <option value="BOOTCAMP">Bootcamp/Certification</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="remote">Remote Work</label>
                  <select id="remote" formControlName="remote">
                    <option value="false">On-site Only</option>
                    <option value="true">Remote Friendly</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Application Settings -->
            <div class="form-section">
              <div class="section-header">
                <h2><i class="fas fa-settings"></i> Application Settings</h2>
                <p>Configure how candidates can apply for this position</p>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label for="deadline">Application Deadline</label>
                  <input
                    type="date"
                    id="deadline"
                    formControlName="deadline"
                    [min]="minDate"
                  />
                </div>

                <div class="form-group">
                  <label for="status">Job Status</label>
                  <select id="status" formControlName="status">
                    <option value="DRAFT">Draft</option>
                    <option value="ACTIVE">Active</option>
                    <option value="PAUSED">Paused</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <div class="checkbox-group">
                  <label class="checkbox-label">
                    <input type="checkbox" formControlName="aiScreening" />
                    <span class="checkmark"></span>
                    Enable AI-powered screening for this position
                  </label>
                  <p class="checkbox-description">
                    Automatically screen applications using AI to identify the
                    best candidates
                  </p>
                </div>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="form-actions">
              <button
                type="button"
                class="btn btn-secondary"
                (click)="saveDraft()"
              >
                <i class="fas fa-save"></i>
                Save as Draft
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                [disabled]="jobForm.invalid || isSubmitting"
              >
                <i class="fas fa-rocket" *ngIf="!isSubmitting"></i>
                <i class="fas fa-spinner fa-spin" *ngIf="isSubmitting"></i>
                {{ isSubmitting ? 'Publishing...' : 'Publish Job' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .job-create-container {
        min-height: 100vh;
        position: relative;
        overflow: hidden;
        background: linear-gradient(
          135deg,
          #667eea 0%,
          #764ba2 25%,
          #f093fb 50%,
          #f5576c 75%,
          #4facfe 100%
        );
      }

      .background-animation {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        z-index: 0;
        pointer-events: none;
      }

      .gradient-orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(80px);
        opacity: 0.4;
        animation: float 15s ease-in-out infinite;
      }

      .orb-1 {
        width: 500px;
        height: 500px;
        background: radial-gradient(circle, #ff9a9e, #fecfef);
        top: -250px;
        left: -250px;
        animation-delay: 0s;
      }

      .orb-2 {
        width: 600px;
        height: 600px;
        background: radial-gradient(circle, #a8edea, #fed6e3);
        bottom: -300px;
        right: -300px;
        animation-delay: 5s;
      }

      .orb-3 {
        width: 400px;
        height: 400px;
        background: radial-gradient(circle, #d299c2, #fef9d7);
        top: 30%;
        right: 20%;
        animation-delay: 10s;
      }

      .floating-particles {
        position: absolute;
        width: 100%;
        height: 100%;
      }

      .particle {
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        animation: particle-float 10s linear infinite;
      }

      .particle:nth-child(1) {
        left: 5%;
      }
      .particle:nth-child(2) {
        left: 15%;
      }
      .particle:nth-child(3) {
        left: 25%;
      }
      .particle:nth-child(4) {
        left: 35%;
      }
      .particle:nth-child(5) {
        left: 45%;
      }
      .particle:nth-child(6) {
        left: 55%;
      }
      .particle:nth-child(7) {
        left: 65%;
      }
      .particle:nth-child(8) {
        left: 75%;
      }
      .particle:nth-child(9) {
        left: 85%;
      }
      .particle:nth-child(10) {
        left: 95%;
      }

      @keyframes float {
        0%,
        100% {
          transform: translateY(0px) rotate(0deg);
        }
        50% {
          transform: translateY(-50px) rotate(180deg);
        }
      }

      @keyframes particle-float {
        0% {
          transform: translateY(100vh) rotate(0deg);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% {
          transform: translateY(-100px) rotate(360deg);
          opacity: 0;
        }
      }

      .job-create-content {
        position: relative;
        z-index: 1;
        padding: 2rem;
        max-width: 1000px;
        margin: 0 auto;
      }

      .page-header {
        margin-bottom: 3rem;
      }

      .header-content {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .back-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.2);
        padding: 0.75rem 1.5rem;
        border-radius: 12px;
        text-decoration: none;
        font-weight: 500;
        transition: all 0.3s ease;
        cursor: pointer;
        width: fit-content;
        backdrop-filter: blur(10px);
      }

      .back-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
      }

      .header-text h1 {
        font-size: 2.5rem;
        font-weight: 800;
        color: white;
        margin: 0 0 0.5rem 0;
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .header-text p {
        font-size: 1.125rem;
        color: rgba(255, 255, 255, 0.9);
        margin: 0;
      }

      .form-container {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 24px;
        padding: 3rem;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
      }

      .form-section {
        margin-bottom: 3rem;
      }

      .form-section:last-of-type {
        margin-bottom: 2rem;
      }

      .section-header {
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .section-header h2 {
        font-size: 1.5rem;
        font-weight: 700;
        color: white;
        margin: 0 0 0.5rem 0;
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .section-header p {
        color: rgba(255, 255, 255, 0.8);
        margin: 0;
        font-size: 0.875rem;
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .form-group label {
        color: white;
        font-weight: 600;
        font-size: 0.875rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .form-group input,
      .form-group select,
      .form-group textarea {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        padding: 1rem;
        color: white;
        font-size: 0.875rem;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
      }

      .form-group input::placeholder,
      .form-group textarea::placeholder {
        color: rgba(255, 255, 255, 0.6);
      }

      .form-group input:focus,
      .form-group select:focus,
      .form-group textarea:focus {
        outline: none;
        border-color: rgba(255, 255, 255, 0.4);
        background: rgba(255, 255, 255, 0.15);
        box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
      }

      .form-group input.error,
      .form-group select.error,
      .form-group textarea.error {
        border-color: #ef4444;
        background: rgba(239, 68, 68, 0.1);
      }

      .error-message {
        color: #fca5a5;
        font-size: 0.75rem;
        font-weight: 500;
      }

      .salary-inputs {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .salary-inputs input {
        flex: 1;
      }

      .salary-separator {
        color: rgba(255, 255, 255, 0.8);
        font-weight: 500;
      }

      .salary-inputs select {
        width: 100px;
      }

      .skills-input {
        display: flex;
        gap: 0.5rem;
      }

      .skills-input input {
        flex: 1;
      }

      .add-skill-btn {
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 12px;
        color: white;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .add-skill-btn:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: scale(1.05);
      }

      .skills-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        margin-top: 1rem;
      }

      .skill-tag {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: rgba(255, 255, 255, 0.2);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.875rem;
        font-weight: 500;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.3);
      }

      .skill-tag button {
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.8);
        cursor: pointer;
        padding: 0;
        width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.3s ease;
      }

      .skill-tag button:hover {
        background: rgba(255, 255, 255, 0.2);
        color: white;
      }

      .checkbox-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .checkbox-label {
        display: flex;
        align-items: center;
        gap: 1rem;
        cursor: pointer;
        color: white;
        font-weight: 500;
      }

      .checkbox-label input[type='checkbox'] {
        display: none;
      }

      .checkmark {
        width: 20px;
        height: 20px;
        background: rgba(255, 255, 255, 0.1);
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 4px;
        position: relative;
        transition: all 0.3s ease;
      }

      .checkbox-label input[type='checkbox']:checked + .checkmark {
        background: #10b981;
        border-color: #10b981;
      }

      .checkbox-label input[type='checkbox']:checked + .checkmark::after {
        content: '✓';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-weight: bold;
        font-size: 12px;
      }

      .checkbox-description {
        color: rgba(255, 255, 255, 0.7);
        font-size: 0.75rem;
        margin: 0;
        margin-left: 3rem;
      }

      .form-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        padding-top: 2rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }

      .btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem 2rem;
        border-radius: 12px;
        font-weight: 600;
        font-size: 0.875rem;
        text-decoration: none;
        transition: all 0.3s ease;
        cursor: pointer;
        border: none;
      }

      .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .btn-primary {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
      }

      .btn-primary:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
      }

      .btn-secondary {
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.3);
        backdrop-filter: blur(10px);
      }

      .btn-secondary:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
      }

      @media (max-width: 768px) {
        .job-create-content {
          padding: 1rem;
        }

        .form-container {
          padding: 2rem;
        }

        .form-grid {
          grid-template-columns: 1fr;
        }

        .header-text h1 {
          font-size: 2rem;
        }

        .form-actions {
          flex-direction: column;
        }

        .salary-inputs {
          flex-direction: column;
          align-items: stretch;
        }

        .salary-separator {
          text-align: center;
        }
      }
    `,
  ],
})
export class JobCreateComponent implements OnInit {
  jobForm: FormGroup;
  isSubmitting = false;
  newSkill = '';
  skills: string[] = [];
  particles = Array(10).fill(0);
  minDate: string;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.minDate = new Date().toISOString().split('T')[0];
    this.jobForm = this.createForm();
  }

  ngOnInit() {
    // Initialize form with default values
  }

  createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      department: [''],
      location: ['', Validators.required],
      type: ['', Validators.required],
      experience: ['', Validators.required],
      salaryMin: [''],
      salaryMax: [''],
      salaryCurrency: ['USD'],
      description: ['', [Validators.required, Validators.minLength(50)]],
      requirements: [''],
      benefits: [''],
      education: [''],
      remote: ['false'],
      deadline: [''],
      status: ['ACTIVE'],
      aiScreening: [true],
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.jobForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  addSkill() {
    if (this.newSkill.trim() && !this.skills.includes(this.newSkill.trim())) {
      this.skills.push(this.newSkill.trim());
      this.newSkill = '';
    }
  }

  removeSkill(index: number) {
    this.skills.splice(index, 1);
  }

  saveDraft() {
    const formData = this.prepareFormData();
    formData.status = 'DRAFT';
    this.submitJob(formData);
  }

  onSubmit() {
    if (this.jobForm.valid) {
      const formData = this.prepareFormData();
      this.submitJob(formData);
    } else {
      this.markFormGroupTouched();
    }
  }

  prepareFormData() {
    const formValue = this.jobForm.value;
    return {
      ...formValue,
      skills: this.skills,
      experience: parseInt(formValue.experience as string) || 0,
      salaryMin: formValue.salaryMin
        ? parseInt(formValue.salaryMin as string)
        : null,
      salaryMax: formValue.salaryMax
        ? parseInt(formValue.salaryMax as string)
        : null,
      remote: formValue.remote === 'true' || formValue.remote === 'hybrid',
      deadline: formValue.deadline || null,
    };
  }

  submitJob(jobData: unknown) {
    this.isSubmitting = true;

    this.apiService.createJob(jobData as any).subscribe({
      next: (response) => {
        console.log('Job created successfully:', response);
        void this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Error creating job:', error);
        this.isSubmitting = false;
        // Handle error (show notification, etc.)
      },
    });
  }

  markFormGroupTouched() {
    Object.keys(this.jobForm.controls).forEach((key) => {
      const control = this.jobForm.get(key);
      control?.markAsTouched();
    });
  }

  goBack() {
    void this.router.navigate(['/dashboard']);
  }
}
