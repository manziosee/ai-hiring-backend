import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="brand">
            <i class="fas fa-robot"></i>
            <h1>AI Hiring Platform</h1>
          </div>
          <p>Sign in to your account</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label for="email">Email Address</label>
            <div class="input-wrapper">
              <i class="fas fa-envelope"></i>
              <input
                type="email"
                id="email"
                formControlName="email"
                placeholder="Enter your email"
                [class.error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
              />
            </div>
            <div class="error-message" *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
              <span *ngIf="loginForm.get('email')?.errors?.['required']">Email is required</span>
              <span *ngIf="loginForm.get('email')?.errors?.['email']">Please enter a valid email</span>
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
                placeholder="Enter your password"
                [class.error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
              />
              <button
                type="button"
                class="password-toggle"
                (click)="togglePassword()"
              >
                <i [class]="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <div class="error-message" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
              <span *ngIf="loginForm.get('password')?.errors?.['required']">Password is required</span>
              <span *ngIf="loginForm.get('password')?.errors?.['minlength']">Password must be at least 6 characters</span>
            </div>
          </div>

          <div class="error-message" *ngIf="errorMessage">
            <i class="fas fa-exclamation-circle"></i>
            {{ errorMessage }}
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-lg auth-submit"
            [disabled]="loginForm.invalid || isLoading"
          >
            <span class="spinner" *ngIf="isLoading"></span>
            <i class="fas fa-sign-in-alt" *ngIf="!isLoading"></i>
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <div class="auth-footer">
          <p>Don't have an account? <a routerLink="/auth/register">Sign up here</a></p>
        </div>

        <!-- Demo Accounts -->
        <div class="demo-accounts">
          <h3>Demo Accounts</h3>
          <div class="demo-buttons">
            <button class="btn btn-outline btn-sm" (click)="loginAsDemo('admin')">
              <i class="fas fa-user-shield"></i>
              Admin Demo
            </button>
            <button class="btn btn-outline btn-sm" (click)="loginAsDemo('recruiter')">
              <i class="fas fa-user-tie"></i>
              Recruiter Demo
            </button>
            <button class="btn btn-outline btn-sm" (click)="loginAsDemo('candidate')">
              <i class="fas fa-user"></i>
              Candidate Demo
            </button>
          </div>
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
      max-width: 450px;
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

    .demo-accounts {
      margin-top: var(--spacing-xl);
      padding-top: var(--spacing-lg);
      border-top: 1px solid var(--neutral-200);
      text-align: center;

      h3 {
        font-size: 1rem;
        color: var(--neutral-600);
        margin-bottom: var(--spacing-md);
      }

      .demo-buttons {
        display: flex;
        gap: var(--spacing-sm);
        flex-wrap: wrap;
        justify-content: center;
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

      .demo-buttons {
        flex-direction: column;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Login failed. Please try again.';
        }
      });
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  loginAsDemo(role: string) {
    const demoCredentials = {
      admin: { email: 'admin@demo.com', password: 'admin123' },
      recruiter: { email: 'recruiter@demo.com', password: 'recruiter123' },
      candidate: { email: 'candidate@demo.com', password: 'candidate123' }
    };

    const credentials = demoCredentials[role as keyof typeof demoCredentials];
    if (credentials) {
      this.loginForm.patchValue(credentials);
      this.onSubmit();
    }
  }
}