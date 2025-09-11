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
    <div class="login-container">
      <!-- Animated Background -->
      <div class="background-animation">
        <div class="gradient-orb orb-1"></div>
        <div class="gradient-orb orb-2"></div>
        <div class="gradient-orb orb-3"></div>
        <div class="floating-particles">
          <div class="particle" *ngFor="let p of particles; let i = index" [style.animation-delay.s]="i * 0.5"></div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="login-content">
        <!-- Left Side - Branding -->
        <div class="branding-section">
          <div class="brand-container">
            <div class="brand-logo">
              <div class="logo-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                </svg>
              </div>
              <h1>AI Hiring</h1>
            </div>
            <div class="brand-tagline">
              <h2>Welcome Back!</h2>
              <p>Discover your next career opportunity with our AI-powered platform</p>
            </div>
            <div class="feature-highlights">
              <div class="feature-item">
                <i class="fas fa-brain"></i>
                <span>AI-Powered Matching</span>
              </div>
              <div class="feature-item">
                <i class="fas fa-rocket"></i>
                <span>Fast Applications</span>
              </div>
              <div class="feature-item">
                <i class="fas fa-shield-alt"></i>
                <span>Secure Platform</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side - Login Form -->
        <div class="form-section">
          <div class="form-container">
            <div class="form-header">
              <h3>Sign In</h3>
              <p>Enter your credentials to access your account</p>
            </div>

            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
              <div class="input-group">
                <label for="email">Email Address</label>
                <div class="input-container">
                  <div class="input-icon">
                    <i class="fas fa-envelope"></i>
                  </div>
                  <input
                    type="email"
                    id="email"
                    formControlName="email"
                    placeholder="Enter your email"
                    [class.error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                  />
                  <div class="input-focus-border"></div>
                </div>
                <div class="error-text" *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
                  <i class="fas fa-exclamation-circle"></i>
                  <span *ngIf="loginForm.get('email')?.errors?.['required']">Email is required</span>
                  <span *ngIf="loginForm.get('email')?.errors?.['email']">Please enter a valid email</span>
                </div>
              </div>

              <div class="input-group">
                <label for="password">Password</label>
                <div class="input-container">
                  <div class="input-icon">
                    <i class="fas fa-lock"></i>
                  </div>
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
                  <div class="input-focus-border"></div>
                </div>
                <div class="error-text" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                  <i class="fas fa-exclamation-circle"></i>
                  <span *ngIf="loginForm.get('password')?.errors?.['required']">Password is required</span>
                </div>
              </div>

              <div class="form-options">
                <label class="checkbox-container">
                  <input type="checkbox">
                  <span class="checkmark"></span>
                  Remember me
                </label>
                <a href="#" class="forgot-password">Forgot Password?</a>
              </div>

              <div class="error-message" *ngIf="errorMessage">
                <i class="fas fa-exclamation-triangle"></i>
                {{ errorMessage }}
              </div>

              <button
                type="submit"
                class="submit-btn"
                [disabled]="loginForm.invalid || isLoading"
                [class.loading]="isLoading"
              >
                <span class="btn-content">
                  <i class="fas fa-sign-in-alt" *ngIf="!isLoading"></i>
                  <div class="loading-spinner" *ngIf="isLoading"></div>
                  {{ isLoading ? 'Signing In...' : 'Sign In' }}
                </span>
                <div class="btn-glow"></div>
              </button>
            </form>

            <div class="divider">
              <span>or continue with</span>
            </div>

            <!-- Demo Accounts -->
            <div class="demo-section">
              <h4>Try Demo Accounts</h4>
              <div class="demo-cards">
                <button class="demo-card admin" (click)="loginAsDemo('admin')">
                  <div class="demo-icon">
                    <i class="fas fa-crown"></i>
                  </div>
                  <div class="demo-info">
                    <span class="demo-title">Admin</span>
                    <span class="demo-subtitle">Full Access</span>
                  </div>
                  <div class="demo-arrow">
                    <i class="fas fa-arrow-right"></i>
                  </div>
                </button>

                <button class="demo-card recruiter" (click)="loginAsDemo('recruiter')">
                  <div class="demo-icon">
                    <i class="fas fa-user-tie"></i>
                  </div>
                  <div class="demo-info">
                    <span class="demo-title">Recruiter</span>
                    <span class="demo-subtitle">Hire Talent</span>
                  </div>
                  <div class="demo-arrow">
                    <i class="fas fa-arrow-right"></i>
                  </div>
                </button>

                <button class="demo-card candidate" (click)="loginAsDemo('candidate')">
                  <div class="demo-icon">
                    <i class="fas fa-user-graduate"></i>
                  </div>
                  <div class="demo-info">
                    <span class="demo-title">Candidate</span>
                    <span class="demo-subtitle">Find Jobs</span>
                  </div>
                  <div class="demo-arrow">
                    <i class="fas fa-arrow-right"></i>
                  </div>
                </button>
              </div>
            </div>

            <div class="signup-link">
              <p>Don't have an account? <a routerLink="/auth/register">Create one now</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      position: relative;
      overflow: hidden;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .background-animation {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: 0;
    }

    .gradient-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(40px);
      opacity: 0.7;
      animation: float 8s ease-in-out infinite;
    }

    .orb-1 {
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, #ff6b6b, #ee5a24);
      top: -150px;
      left: -150px;
      animation-delay: 0s;
    }

    .orb-2 {
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, #4ecdc4, #44a08d);
      bottom: -200px;
      right: -200px;
      animation-delay: 4s;
    }

    .orb-3 {
      width: 250px;
      height: 250px;
      background: radial-gradient(circle, #a8edea, #fed6e3);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation-delay: 2s;
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
      animation: particle-float 6s linear infinite;
    }

    .particle:nth-child(1) { left: 10%; animation-delay: 0s; }
    .particle:nth-child(2) { left: 20%; animation-delay: 1s; }
    .particle:nth-child(3) { left: 30%; animation-delay: 2s; }
    .particle:nth-child(4) { left: 40%; animation-delay: 3s; }
    .particle:nth-child(5) { left: 50%; animation-delay: 4s; }
    .particle:nth-child(6) { left: 60%; animation-delay: 5s; }
    .particle:nth-child(7) { left: 70%; animation-delay: 0.5s; }
    .particle:nth-child(8) { left: 80%; animation-delay: 1.5s; }
    .particle:nth-child(9) { left: 90%; animation-delay: 2.5s; }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-30px) rotate(180deg); }
    }

    @keyframes particle-float {
      0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
    }

    .login-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      max-width: 1200px;
      width: 100%;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
      position: relative;
      z-index: 1;
      animation: slideIn 1s ease-out;
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translateY(50px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .branding-section {
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 100%);
      padding: 3rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      color: white;
      position: relative;
    }

    .brand-container {
      z-index: 2;
    }

    .brand-logo {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .logo-icon {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #ff6b6b, #ee5a24);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3);
      animation: glow 2s ease-in-out infinite alternate;
    }

    .logo-icon svg {
      width: 32px;
      height: 32px;
    }

    @keyframes glow {
      from { box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3); }
      to { box-shadow: 0 15px 40px rgba(255, 107, 107, 0.6); }
    }

    .brand-logo h1 {
      font-size: 2.5rem;
      font-weight: 800;
      margin: 0;
      background: linear-gradient(135deg, #ffffff, #f8f9fa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .brand-tagline h2 {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 1rem 0;
      line-height: 1.2;
    }

    .brand-tagline p {
      font-size: 1.125rem;
      opacity: 0.9;
      line-height: 1.6;
      margin: 0 0 2rem 0;
    }

    .feature-highlights {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
    }

    .feature-item:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateX(10px);
    }

    .feature-item i {
      font-size: 1.25rem;
      color: #ff6b6b;
    }

    .feature-item span {
      font-weight: 500;
    }

    .form-section {
      background: rgba(255, 255, 255, 0.95);
      padding: 3rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .form-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .form-header h3 {
      font-size: 2rem;
      font-weight: 700;
      color: #1a202c;
      margin: 0 0 0.5rem 0;
    }

    .form-header p {
      color: #718096;
      font-size: 1rem;
      margin: 0;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .input-group label {
      font-weight: 600;
      color: #2d3748;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .input-container {
      position: relative;
    }

    .input-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #a0aec0;
      z-index: 2;
      transition: color 0.3s ease;
    }

    .input-container input {
      width: 100%;
      height: 56px;
      padding: 0 3rem 0 3rem;
      border: 2px solid #e2e8f0;
      border-radius: 16px;
      background: #ffffff;
      font-size: 1rem;
      transition: all 0.3s ease;
      position: relative;
      z-index: 1;
    }

    .input-container input:focus {
      outline: none;
      border-color: #667eea;
      background: #f7fafc;
    }

    .input-container input:focus + .input-icon {
      color: #667eea;
    }

    .input-focus-border {
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 0;
      height: 2px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      transition: all 0.3s ease;
      transform: translateX(-50%);
      border-radius: 2px;
    }

    .input-container input:focus ~ .input-focus-border {
      width: 100%;
    }

    .password-toggle {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #a0aec0;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 8px;
      transition: all 0.3s ease;
      z-index: 2;
    }

    .password-toggle:hover {
      color: #667eea;
      background: rgba(102, 126, 234, 0.1);
    }

    .error-text {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #e53e3e;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0.5rem 0;
    }

    .checkbox-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      font-size: 0.875rem;
      color: #4a5568;
    }

    .checkbox-container input {
      display: none;
    }

    .checkmark {
      width: 20px;
      height: 20px;
      border: 2px solid #e2e8f0;
      border-radius: 4px;
      position: relative;
      transition: all 0.3s ease;
    }

    .checkbox-container input:checked ~ .checkmark {
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-color: #667eea;
    }

    .checkbox-container input:checked ~ .checkmark::after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 12px;
      font-weight: bold;
    }

    .forgot-password {
      color: #667eea;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      transition: color 0.3s ease;
    }

    .forgot-password:hover {
      color: #764ba2;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      background: rgba(229, 62, 62, 0.1);
      border: 1px solid rgba(229, 62, 62, 0.2);
      border-radius: 12px;
      color: #e53e3e;
      font-size: 0.875rem;
    }

    .submit-btn {
      position: relative;
      height: 56px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 16px;
      color: white;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      overflow: hidden;
      margin-top: 1rem;
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);
    }

    .submit-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .btn-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      position: relative;
      z-index: 2;
    }

    .btn-glow {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transition: left 0.5s ease;
    }

    .submit-btn:hover .btn-glow {
      left: 100%;
    }

    .loading-spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .divider {
      text-align: center;
      margin: 2rem 0;
      position: relative;
      color: #a0aec0;
      font-size: 0.875rem;
    }

    .divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: #e2e8f0;
    }

    .divider span {
      background: rgba(255, 255, 255, 0.95);
      padding: 0 1rem;
      position: relative;
      z-index: 1;
    }

    .demo-section h4 {
      text-align: center;
      color: #2d3748;
      font-weight: 600;
      margin: 0 0 1rem 0;
      font-size: 1rem;
    }

    .demo-cards {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .demo-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
      position: relative;
      overflow: hidden;
    }

    .demo-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transition: left 0.5s ease;
    }

    .demo-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      background: rgba(255, 255, 255, 0.9);
    }

    .demo-card:hover::before {
      left: 100%;
    }

    .demo-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    .demo-card.admin .demo-icon {
      background: linear-gradient(135deg, #f093fb, #f5576c);
    }

    .demo-card.recruiter .demo-icon {
      background: linear-gradient(135deg, #4facfe, #00f2fe);
    }

    .demo-card.candidate .demo-icon {
      background: linear-gradient(135deg, #43e97b, #38f9d7);
    }

    .demo-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .demo-title {
      font-weight: 600;
      color: #2d3748;
      font-size: 0.875rem;
    }

    .demo-subtitle {
      font-size: 0.75rem;
      color: #718096;
    }

    .demo-arrow {
      color: #a0aec0;
      transition: all 0.3s ease;
    }

    .demo-card:hover .demo-arrow {
      color: #667eea;
      transform: translateX(5px);
    }

    .signup-link {
      text-align: center;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #e2e8f0;
    }

    .signup-link p {
      color: #718096;
      margin: 0;
    }

    .signup-link a {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.3s ease;
    }

    .signup-link a:hover {
      color: #764ba2;
    }

    @media (max-width: 1024px) {
      .login-content {
        grid-template-columns: 1fr;
        max-width: 500px;
      }

      .branding-section {
        display: none;
      }

      .form-section {
        padding: 2rem;
      }
    }

    @media (max-width: 640px) {
      .login-container {
        padding: 1rem;
      }

      .form-section {
        padding: 1.5rem;
      }

      .form-header h3 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;
  particles = Array(9).fill(0);

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