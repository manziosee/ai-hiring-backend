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
    <div class="register-container">
      <!-- Animated Background -->
      <div class="background-animation">
        <div class="gradient-orb orb-1"></div>
        <div class="gradient-orb orb-2"></div>
        <div class="gradient-orb orb-3"></div>
        <div class="gradient-orb orb-4"></div>
        <div class="floating-elements">
          <div class="element" *ngFor="let e of elements; let i = index" [style.animation-delay.s]="i * 0.8"></div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="register-content">
        <div class="register-card">
          <!-- Header -->
          <div class="register-header">
            <div class="brand-logo">
              <div class="logo-container">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                </svg>
              </div>
              <h1>AI Hiring</h1>
            </div>
            <div class="header-content">
              <h2>Join Our Platform</h2>
              <p>Create your account and start your journey with AI-powered recruitment</p>
            </div>
          </div>

          <!-- Registration Form -->
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
            <!-- Personal Information -->
            <div class="form-section">
              <h3>Personal Information</h3>
              <div class="form-grid">
                <div class="input-group">
                  <label for="fullName">Full Name</label>
                  <div class="input-container">
                    <div class="input-icon">
                      <i class="fas fa-user"></i>
                    </div>
                    <input
                      type="text"
                      id="fullName"
                      formControlName="fullName"
                      placeholder="Enter your full name"
                      [class.error]="registerForm.get('fullName')?.invalid && registerForm.get('fullName')?.touched"
                    />
                    <div class="input-focus-line"></div>
                  </div>
                  <div class="error-text" *ngIf="registerForm.get('fullName')?.invalid && registerForm.get('fullName')?.touched">
                    <i class="fas fa-exclamation-circle"></i>
                    <span>Full name is required</span>
                  </div>
                </div>

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
                      [class.error]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
                    />
                    <div class="input-focus-line"></div>
                  </div>
                  <div class="error-text" *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
                    <i class="fas fa-exclamation-circle"></i>
                    <span *ngIf="registerForm.get('email')?.errors?.['required']">Email is required</span>
                    <span *ngIf="registerForm.get('email')?.errors?.['email']">Please enter a valid email</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Role Selection -->
            <div class="form-section">
              <h3>Choose Your Role</h3>
              <div class="role-selector">
                <div class="role-card" 
                     [class.selected]="registerForm.get('role')?.value === 'CANDIDATE'"
                     (click)="selectRole('CANDIDATE')">
                  <div class="role-header">
                    <div class="role-icon candidate">
                      <i class="fas fa-user-graduate"></i>
                    </div>
                    <div class="role-badge">Popular</div>
                  </div>
                  <div class="role-content">
                    <h4>Job Seeker</h4>
                    <p>Find your dream job with AI-powered matching and personalized recommendations</p>
                    <ul class="role-features">
                      <li><i class="fas fa-check"></i> Smart job recommendations</li>
                      <li><i class="fas fa-check"></i> Application tracking</li>
                      <li><i class="fas fa-check"></i> Resume optimization</li>
                      <li><i class="fas fa-check"></i> Interview preparation</li>
                    </ul>
                  </div>
                  <div class="selection-indicator">
                    <i class="fas fa-check-circle"></i>
                  </div>
                </div>

                <div class="role-card" 
                     [class.selected]="registerForm.get('role')?.value === 'RECRUITER'"
                     (click)="selectRole('RECRUITER')">
                  <div class="role-header">
                    <div class="role-icon recruiter">
                      <i class="fas fa-user-tie"></i>
                    </div>
                    <div class="role-badge">Pro</div>
                  </div>
                  <div class="role-content">
                    <h4>Recruiter</h4>
                    <p>Hire top talent with intelligent screening and advanced analytics tools</p>
                    <ul class="role-features">
                      <li><i class="fas fa-check"></i> AI candidate screening</li>
                      <li><i class="fas fa-check"></i> Advanced analytics</li>
                      <li><i class="fas fa-check"></i> Bulk job posting</li>
                      <li><i class="fas fa-check"></i> Team collaboration</li>
                    </ul>
                  </div>
                  <div class="selection-indicator">
                    <i class="fas fa-check-circle"></i>
                  </div>
                </div>
              </div>
            </div>

            <!-- Security -->
            <div class="form-section">
              <h3>Security</h3>
              <div class="form-grid">
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
                      placeholder="Create a strong password"
                      [class.error]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
                    />
                    <button
                      type="button"
                      class="password-toggle"
                      (click)="togglePassword()"
                    >
                      <i [class]="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                    <div class="input-focus-line"></div>
                  </div>
                  <div class="password-strength">
                    <div class="strength-bar">
                      <div class="strength-fill" [class]="getPasswordStrength()"></div>
                    </div>
                    <span class="strength-text">{{ getPasswordStrengthText() }}</span>
                  </div>
                  <div class="error-text" *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
                    <i class="fas fa-exclamation-circle"></i>
                    <span *ngIf="registerForm.get('password')?.errors?.['required']">Password is required</span>
                    <span *ngIf="registerForm.get('password')?.errors?.['minlength']">Password must be at least 6 characters</span>
                  </div>
                </div>

                <div class="input-group">
                  <label for="confirmPassword">Confirm Password</label>
                  <div class="input-container">
                    <div class="input-icon">
                      <i class="fas fa-shield-alt"></i>
                    </div>
                    <input
                      type="password"
                      id="confirmPassword"
                      formControlName="confirmPassword"
                      placeholder="Confirm your password"
                      [class.error]="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched"
                    />
                    <div class="input-focus-line"></div>
                  </div>
                  <div class="error-text" *ngIf="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched">
                    <i class="fas fa-exclamation-circle"></i>
                    <span *ngIf="registerForm.get('confirmPassword')?.errors?.['required']">Please confirm your password</span>
                    <span *ngIf="registerForm.get('confirmPassword')?.errors?.['passwordMismatch']">Passwords do not match</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Terms and Conditions -->
            <div class="terms-section">
              <label class="checkbox-container">
                <input type="checkbox" formControlName="acceptTerms">
                <span class="checkmark"></span>
                <span class="checkbox-text">
                  I agree to the <a href="#" class="terms-link">Terms of Service</a> and 
                  <a href="#" class="terms-link">Privacy Policy</a>
                </span>
              </label>
            </div>

            <!-- Error Message -->
            <div class="error-message" *ngIf="errorMessage">
              <i class="fas fa-exclamation-triangle"></i>
              {{ errorMessage }}
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="submit-btn"
              [disabled]="registerForm.invalid || isLoading"
              [class.loading]="isLoading"
            >
              <span class="btn-content">
                <i class="fas fa-rocket" *ngIf="!isLoading"></i>
                <div class="loading-spinner" *ngIf="isLoading"></div>
                {{ isLoading ? 'Creating Account...' : 'Create Account' }}
              </span>
              <div class="btn-shine"></div>
            </button>
          </form>

          <!-- Footer -->
          <div class="register-footer">
            <p>Already have an account? <a routerLink="/auth/login">Sign in here</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      position: relative;
      overflow: hidden;
      background: linear-gradient(135deg, #10b981 0%, #059669 25%, #047857 50%, #065f46 75%, #34d399 100%);
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
      filter: blur(60px);
      opacity: 0.6;
      animation: float 12s ease-in-out infinite;
    }

    .orb-1 {
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, #34d399, #10b981);
      top: -200px;
      left: -200px;
      animation-delay: 0s;
    }

    .orb-2 {
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, #6ee7b7, #059669);
      bottom: -250px;
      right: -250px;
      animation-delay: 4s;
    }

    .orb-3 {
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, #86efac, #d1fae5);
      top: 20%;
      right: 10%;
      animation-delay: 8s;
    }

    .orb-4 {
      width: 350px;
      height: 350px;
      background: radial-gradient(circle, #a7f3d0, #6ee7b7);
      bottom: 30%;
      left: 10%;
      animation-delay: 6s;
    }

    .floating-elements {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .element {
      position: absolute;
      width: 6px;
      height: 6px;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 50%;
      animation: element-float 8s linear infinite;
    }

    .element:nth-child(odd) {
      animation-direction: reverse;
    }

    .element:nth-child(1) { left: 5%; }
    .element:nth-child(2) { left: 15%; }
    .element:nth-child(3) { left: 25%; }
    .element:nth-child(4) { left: 35%; }
    .element:nth-child(5) { left: 45%; }
    .element:nth-child(6) { left: 55%; }
    .element:nth-child(7) { left: 65%; }
    .element:nth-child(8) { left: 75%; }
    .element:nth-child(9) { left: 85%; }
    .element:nth-child(10) { left: 95%; }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-40px) rotate(180deg); }
    }

    @keyframes element-float {
      0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
    }

    .register-content {
      width: 100%;
      max-width: 800px;
      position: relative;
      z-index: 1;
    }

    .register-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(30px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 32px;
      padding: 3rem;
      box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
      animation: slideUp 1s ease-out;
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(60px) scale(0.9); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .register-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .brand-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .logo-container {
      width: 70px;
      height: 70px;
      background: linear-gradient(135deg, #10b981, #059669);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 15px 35px rgba(16, 185, 129, 0.4);
      animation: pulse 2s ease-in-out infinite;
    }

    .logo-container svg {
      width: 36px;
      height: 36px;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); box-shadow: 0 15px 35px rgba(16, 185, 129, 0.4); }
      50% { transform: scale(1.05); box-shadow: 0 20px 45px rgba(16, 185, 129, 0.6); }
    }

    .brand-logo h1 {
      font-size: 2.5rem;
      font-weight: 800;
      margin: 0;
      background: linear-gradient(135deg, #10b981, #059669);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .header-content h2 {
      font-size: 2rem;
      font-weight: 700;
      color: #1a202c;
      margin: 0 0 1rem 0;
    }

    .header-content p {
      color: #718096;
      font-size: 1.125rem;
      margin: 0;
      line-height: 1.6;
    }

    .register-form {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .form-section {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-section h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #2d3748;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .form-section h3::before {
      content: '';
      width: 4px;
      height: 20px;
      background: linear-gradient(135deg, #10b981, #059669);
      border-radius: 2px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
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
      border-color: #10b981;
      background: #f0fdf4;
      box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
    }

    .input-container input:focus ~ .input-icon {
      color: #10b981;
    }

    .input-focus-line {
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 0;
      height: 3px;
      background: linear-gradient(135deg, #10b981, #059669);
      transition: all 0.3s ease;
      transform: translateX(-50%);
      border-radius: 3px;
    }

    .input-container input:focus ~ .input-focus-line {
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
      color: #10b981;
      background: rgba(16, 185, 129, 0.1);
    }

    .password-strength {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }

    .strength-bar {
      flex: 1;
      height: 4px;
      background: #e2e8f0;
      border-radius: 2px;
      overflow: hidden;
    }

    .strength-fill {
      height: 100%;
      transition: all 0.3s ease;
      border-radius: 2px;
    }

    .strength-fill.weak {
      width: 25%;
      background: #e53e3e;
    }

    .strength-fill.fair {
      width: 50%;
      background: #f56500;
    }

    .strength-fill.good {
      width: 75%;
      background: #38a169;
    }

    .strength-fill.strong {
      width: 100%;
      background: #22543d;
    }

    .strength-text {
      font-size: 0.75rem;
      font-weight: 500;
      color: #718096;
    }

    .error-text {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #e53e3e;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .role-selector {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .role-card {
      position: relative;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 100%);
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 20px;
      padding: 2rem;
      cursor: pointer;
      transition: all 0.4s ease;
      backdrop-filter: blur(20px);
      overflow: hidden;
    }

    .role-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
      transition: left 0.6s ease;
    }

    .role-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      border-color: rgba(16, 185, 129, 0.3);
    }

    .role-card:hover::before {
      left: 100%;
    }

    .role-card.selected {
      border-color: #10b981;
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%);
      box-shadow: 0 15px 35px rgba(16, 185, 129, 0.2);
    }

    .role-card.selected .selection-indicator {
      opacity: 1;
      transform: scale(1);
    }

    .role-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
    }

    .role-icon {
      width: 60px;
      height: 60px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.5rem;
    }

    .role-icon.candidate {
      background: linear-gradient(135deg, #34d399, #10b981);
    }

    .role-icon.recruiter {
      background: linear-gradient(135deg, #10b981, #059669);
    }

    .role-badge {
      background: linear-gradient(135deg, #065f46, #047857);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .role-content h4 {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1a202c;
      margin: 0 0 0.75rem 0;
    }

    .role-content p {
      color: #718096;
      font-size: 0.875rem;
      line-height: 1.6;
      margin: 0 0 1.5rem 0;
    }

    .role-features {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .role-features li {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: #4a5568;
    }

    .role-features i {
      color: #38a169;
      font-size: 0.75rem;
    }

    .selection-indicator {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #10b981, #059669);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 0.875rem;
      opacity: 0;
      transform: scale(0.8);
      transition: all 0.3s ease;
    }

    .terms-section {
      padding: 1.5rem;
      background: rgba(16, 185, 129, 0.05);
      border-radius: 16px;
      border: 1px solid rgba(16, 185, 129, 0.1);
    }

    .checkbox-container {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      cursor: pointer;
      font-size: 0.875rem;
      color: #4a5568;
      line-height: 1.6;
    }

    .checkbox-container input {
      display: none;
    }

    .checkmark {
      width: 20px;
      height: 20px;
      border: 2px solid #e2e8f0;
      border-radius: 6px;
      position: relative;
      transition: all 0.3s ease;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .checkbox-container input:checked ~ .checkmark {
      background: linear-gradient(135deg, #10b981, #059669);
      border-color: #10b981;
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

    .terms-link {
      color: #10b981;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.3s ease;
    }

    .terms-link:hover {
      color: #059669;
      text-decoration: underline;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      background: rgba(229, 62, 62, 0.1);
      border: 1px solid rgba(229, 62, 62, 0.2);
      border-radius: 16px;
      color: #e53e3e;
      font-size: 0.875rem;
    }

    .submit-btn {
      position: relative;
      height: 64px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      border: none;
      border-radius: 20px;
      color: white;
      font-weight: 700;
      font-size: 1.125rem;
      cursor: pointer;
      transition: all 0.4s ease;
      overflow: hidden;
      margin-top: 1rem;
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-3px);
      box-shadow: 0 20px 40px rgba(16, 185, 129, 0.4);
    }

    .submit-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .btn-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      position: relative;
      z-index: 2;
    }

    .btn-shine {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transition: left 0.6s ease;
    }

    .submit-btn:hover .btn-shine {
      left: 100%;
    }

    .loading-spinner {
      width: 24px;
      height: 24px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-top: 3px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .register-footer {
      text-align: center;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #e2e8f0;
    }

    .register-footer p {
      color: #718096;
      margin: 0;
    }

    .register-footer a {
      color: #10b981;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.3s ease;
    }

    .register-footer a:hover {
      color: #059669;
    }

    @media (max-width: 1024px) {
      .register-container {
        padding: 1rem;
      }

      .register-card {
        padding: 2rem;
      }

      .form-grid,
      .role-selector {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 640px) {
      .register-card {
        padding: 1.5rem;
      }

      .brand-logo {
        flex-direction: column;
        gap: 0.5rem;
      }

      .brand-logo h1 {
        font-size: 2rem;
      }

      .header-content h2 {
        font-size: 1.5rem;
      }

      .role-card {
        padding: 1.5rem;
      }
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;
  elements = Array(10).fill(0);

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
      role: ['CANDIDATE', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
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

  getPasswordStrength(): string {
    const password = this.registerForm.get('password')?.value || '';
    if (password.length === 0) return '';
    if (password.length < 6) return 'weak';
    if (password.length < 8) return 'fair';
    if (password.length < 12) return 'good';
    return 'strong';
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    const texts = {
      '': '',
      'weak': 'Weak',
      'fair': 'Fair',
      'good': 'Good',
      'strong': 'Strong'
    };
    return texts[strength as keyof typeof texts] || '';
  }

  onSubmit() {
    console.log('Form submitted', this.registerForm.value);
    console.log('Form valid:', this.registerForm.valid);
    
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { confirmPassword, acceptTerms, ...userData } = this.registerForm.value;
      console.log('Sending registration data:', userData);

      this.authService.register(userData).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.isLoading = false;
          this.errorMessage = error.error?.message || error.message || 'Registration failed. Please try again.';
        }
      });
    } else {
      console.log('Form is invalid:', this.registerForm.errors);
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        if (control && control.invalid) {
          console.log(`${key} errors:`, control.errors);
        }
      });
    }
  }
}