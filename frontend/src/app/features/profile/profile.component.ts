import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { User } from '../../core/models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile-container">
      <div class="profile-header">
        <h1>
          <i class="fas fa-user-cog"></i>
          Profile Settings
        </h1>
        <p>Manage your account information and preferences</p>
      </div>

      <div class="profile-content">
        <div class="profile-card">
          <div class="profile-avatar">
            <div class="avatar-circle">
              <i class="fas fa-user"></i>
            </div>
            <button class="btn btn-secondary btn-sm">
              <i class="fas fa-camera"></i>
              Change Photo
            </button>
          </div>

          <form class="profile-form" (ngSubmit)="updateProfile()" *ngIf="user">
            <div class="form-section">
              <h3>Personal Information</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label for="fullName">Full Name</label>
                  <input type="text" id="fullName" [(ngModel)]="user.fullName" name="fullName" required>
                </div>
                <div class="form-group">
                  <label for="email">Email Address</label>
                  <input type="email" id="email" [(ngModel)]="user.email" name="email" required readonly>
                  <small>Email cannot be changed</small>
                </div>
              </div>
            </div>

            <div class="form-section">
              <h3>Account Details</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label for="role">Role</label>
                  <input type="text" id="role" [value]="user.role" readonly>
                  <small>Role is assigned by administrators</small>
                </div>
                <div class="form-group">
                  <label for="joinDate">Member Since</label>
                  <input type="text" id="joinDate" value="January 2024" readonly>
                </div>
              </div>
            </div>

            <div class="form-section">
              <h3>Security</h3>
              <div class="security-options">
                <button type="button" class="btn btn-outline">
                  <i class="fas fa-key"></i>
                  Change Password
                </button>
                <button type="button" class="btn btn-outline">
                  <i class="fas fa-shield-alt"></i>
                  Two-Factor Authentication
                </button>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary" (click)="resetForm()">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" [disabled]="isUpdating">
                <span class="spinner" *ngIf="isUpdating"></span>
                <i class="fas fa-save" *ngIf="!isUpdating"></i>
                {{ isUpdating ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>

        <div class="activity-card">
          <h3>
            <i class="fas fa-history"></i>
            Recent Activity
          </h3>
          <div class="activity-list">
            <div class="activity-item">
              <div class="activity-icon">
                <i class="fas fa-sign-in-alt"></i>
              </div>
              <div class="activity-content">
                <p>Logged in from Chrome on Windows</p>
                <small>2 hours ago</small>
              </div>
            </div>
            <div class="activity-item">
              <div class="activity-icon">
                <i class="fas fa-file-alt"></i>
              </div>
              <div class="activity-content">
                <p>Applied to Software Engineer position</p>
                <small>1 day ago</small>
              </div>
            </div>
            <div class="activity-item">
              <div class="activity-icon">
                <i class="fas fa-user-edit"></i>
              </div>
              <div class="activity-content">
                <p>Updated profile information</p>
                <small>3 days ago</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .profile-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .profile-header h1 {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      font-size: 2.5rem;
      color: #1a202c;
      margin-bottom: 0.5rem;
    }

    .profile-header p {
      color: #718096;
      font-size: 1.125rem;
    }

    .profile-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
    }

    .profile-card, .activity-card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
    }

    .profile-avatar {
      text-align: center;
      margin-bottom: 2rem;
    }

    .avatar-circle {
      width: 120px;
      height: 120px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
      color: white;
      font-size: 3rem;
    }

    .form-section {
      margin-bottom: 2rem;
    }

    .form-section h3 {
      font-size: 1.25rem;
      color: #2d3748;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #e2e8f0;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-weight: 600;
      color: #2d3748;
    }

    .form-group input {
      padding: 0.75rem;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
    }

    .form-group input:focus {
      outline: none;
      border-color: #667eea;
    }

    .form-group input:read-only {
      background: #f7fafc;
      color: #718096;
    }

    .form-group small {
      color: #718096;
      font-size: 0.875rem;
    }

    .security-options {
      display: flex;
      gap: 1rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      padding-top: 2rem;
      border-top: 1px solid #e2e8f0;
    }

    .activity-card h3 {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.25rem;
      color: #2d3748;
      margin-bottom: 1.5rem;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .activity-item {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      background: #f7fafc;
      border-radius: 12px;
    }

    .activity-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
    }

    .activity-content p {
      margin: 0 0 0.25rem 0;
      color: #2d3748;
      font-weight: 500;
    }

    .activity-content small {
      color: #718096;
    }

    @media (max-width: 768px) {
      .profile-container {
        padding: 1rem;
      }

      .profile-content {
        grid-template-columns: 1fr;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .security-options {
        flex-direction: column;
      }

      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  isUpdating = false;

  constructor(
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.user = { ...this.authService.getCurrentUser()! };
  }

  updateProfile() {
    if (!this.user) return;
    
    this.isUpdating = true;
    // Simulate API call
    setTimeout(() => {
      this.isUpdating = false;
      console.log('Profile updated:', this.user);
    }, 1000);
  }

  resetForm() {
    this.user = { ...this.authService.getCurrentUser()! };
  }
}