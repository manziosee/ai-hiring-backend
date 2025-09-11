import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="brand">
            <i class="fas fa-robot"></i>
            <h1>Join AI Hiring</h1>
          </div>
          <p>Create your account to get started</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label for="fullName">Full Name</label>
            <div class="input-wrapper">
              <i class="fas fa-user"></i>
              <input
                type="text"
                id="fullName"
                formControlName="fullName"
                placeholder="Enter your full name"
                [class.error]="registerForm.get('fullName')?.invalid && registerForm.get('fullName')?.touched"
              />
            </div>
            <div class="error-message" *ngIf="registerForm.get('fullName')?.invalid && registerForm.get('fullName')?.touched">
              <span *ngIf="registerForm.get('fullName')?.errors?.['required']">Full name is required</span>
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email Address</label>
            <div class="input-wrapper">
              <i class="fas fa-envelope"></i>
              <input
                type="email"
                id="email"
                formControlName="email"
                placeholder="Enter your email"
                [class.error]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
              />
            </div>
            <div class="error-message" *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
              <span *ngIf="registerForm.get('email')?.errors?.['required']">Email is required</span>
              <span *ngIf="registerForm.get('email')?.errors?.['email']">Please enter a valid email</span>
            </div>
          </div>

          <div class="form-group">
            <label for="role">I am a</label>
            <div class="role-selection">
              <div class="role-option" 
                   [class.selected]="registerForm.get('role')?.value === 'CANDIDATE'"
                   (click)="selectRole('CANDIDATE')">
                <i class="fas fa-user"></i>
                <div>
                  <h4>Job Seeker</h4>
                  <p>Looking for opportunities</p>
                </div>
              </div>
              <div class="role-option" 
                   [class.selected]="registerForm.get('role')?.value === 'RECRUITER'"
                   (click)="selectRole('RECRUITER')">
                <i class="fas fa-user-tie"></i>
                <div>
                  <h4>Recruiter</h4>
                  <p>Hiring talented candidates</p>
                </div>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <div class="input-wrapper">
              <i class="fas fa-lock"></i>
              <input
                [type]="showPassword ? 'text' : 'password'"
                id="password"
                formControlName="password"
                placeholder="Create a password"
                [class.error]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
              />
              <button
                type="button"
                class="password-toggle"
                (click)="togglePassword()"
              >
                <i [class]="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <div class="error-message" *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
              <span *ngIf="registerForm.get('password')?.errors?.['required']">Password is required</span>
              <span *ngIf="registerForm.get('password')?.errors?.['minlength']">Password must be at least 6 characters</span>
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <div class="input-wrapper">
              <i class="fas fa-lock"></i>
              <input
                type="password"
                id="confirmPassword"
                formControlName="confirmPassword"
                placeholder="Confirm your password"
                [class.error]="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched"
              />
            </div>
            <div class="error-message" *ngIf="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched">
              <span *ngIf="registerForm.get('confirmPassword')?.errors?.['required']">Please confirm your password</span>
              <span *ngIf="registerForm.get('confirmPassword')?.errors?.['passwordMismatch']">Passwords do not match</span>
            </div>
          </div>

          <div class="error-message" *ngIf="errorMessage">
            <i class="fas fa-exclamation-circle"></i>
            {{ errorMessage }}
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-lg auth-submit"
            [disabled]="registerForm.invalid || isLoading"
          >
            <span class="spinner" *ngIf="isLoading"></span>
            <i class="fas fa-user-plus" *ngIf="!isLoading"></i>
            {{ isLoading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>

        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/auth/login">Sign in here</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%);
      padding: var(--spacing-lg);
    }

    .auth-card {
      background: white;
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-2xl);
      padding: var(--spacing-3xl);
      width: 100%;
      max-width: 500px;
      animation: fadeIn 0.6s ease-out;
    }

    .auth-header {
      text-align: center;
      margin-bottom: var(--spacing-2xl);

      .brand {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--spacing-sm);
        margin-bottom: var(--spacing-md);

        i {
          font-size: 3rem;
          color: var(--primary-600);
          animation: pulse 2s infinite;
        }

        h1 {
          font-size: 1.75rem;
          color: var(--neutral-800);
          margin: 0;
        }
      }

      p {
        color: var(--neutral-600);
        font-size: 1rem;
        margin: 0;
      }
    }

    .auth-form {
      margin-bottom: var(--spacing-xl);
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;

      i {
        position: absolute;
        left: var(--spacing-md);
        color: var(--neutral-400);
        z-index: 1;
      }

      input {
        padding-left: 2.5rem;
        padding-right: 2.5rem;
      }

      .password-toggle {
        position: absolute;
        right: var(--spacing-md);
        background: none;
        border: none;
        color: var(--neutral-400);
        cursor: pointer;
        padding: 0;
        z-index: 1;

        &:hover {
          color: var(--neutral-600);
        }
      }
    }

    .role-selection {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-md);
    }

    .role-option {
      border: 2px solid var(--neutral-200);
      border-radius: var(--radius-lg);
      padding: var(--spacing-lg);
      cursor: pointer;
      transition: all var(--transition-fast);
      text-align: center;

      &:hover {
        border-color: var(--primary-300);
        background: var(--primary-50);
      }

      &.selected {
        border-color: var(--primary-500);
        background: var(--primary-50);
      }

      i {
        font-size: 2rem;
        color: var(--primary-600);
        margin-bottom: var(--spacing-sm);
      }

      h4 {
        font-size: 1rem;
        margin: 0 0 var(--spacing-xs) 0;
        color: var(--neutral-800);
      }

      p {
        font-size: 0.875rem;
        color: var(--neutral-600);
        margin: 0;
      }
    }

    .auth-submit {
      width: 100%;
      margin-top: var(--spacing-lg);
    }

    .auth-footer {
      text-align: center;
      padding-top: var(--spacing-lg);
      border-top: 1px solid var(--neutral-200);

      a {
        color: var(--primary-600);
        text-decoration: none;
        font-weight: 500;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    @media (max-width: 480px) {
      .auth-card {
        padding: var(--spacing-xl);
      }

      .role-selection {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['CANDIDATE', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else if (confirmPassword?.errors?.['passwordMismatch']) {
      delete confirmPassword.errors['passwordMismatch'];
      if (Object.keys(confirmPassword.errors).length === 0) {
        confirmPassword.setErrors(null);
      }
    }
    return null;
  }

  selectRole(role: string) {
    this.registerForm.patchValue({ role });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { confirmPassword, ...userData } = this.registerForm.value;

      this.authService.register(userData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        }
      });
    }
  }
}