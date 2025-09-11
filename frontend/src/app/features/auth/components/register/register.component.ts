import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppState } from '@core/store';
import * as AuthActions from '@core/store/auth/auth.actions';
import { AuthState } from '@core/models/auth.models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="register-container">
      <mat-card class="register-card">
        <mat-card-header>
          <mat-card-title>Create Account</mat-card-title>
          <mat-card-subtitle>Join our AI hiring platform</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <div class="name-row">
              <mat-form-field class="form-field half-width">
                <mat-label>First Name</mat-label>
                <input matInput formControlName="firstName" required>
                <mat-error *ngIf="registerForm.get('firstName')?.hasError('required')">
                  First name is required
                </mat-error>
              </mat-form-field>

              <mat-form-field class="form-field half-width">
                <mat-label>Last Name</mat-label>
                <input matInput formControlName="lastName" required>
                <mat-error *ngIf="registerForm.get('lastName')?.hasError('required')">
                  Last name is required
                </mat-error>
              </mat-form-field>
            </div>

            <mat-form-field class="form-field">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" required>
              <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
                Please enter a valid email
              </mat-error>
            </mat-form-field>

            <mat-form-field class="form-field">
              <mat-label>Role</mat-label>
              <mat-select formControlName="role" required>
                <mat-option value="CANDIDATE">Job Seeker</mat-option>
                <mat-option value="RECRUITER">Recruiter</mat-option>
              </mat-select>
              <mat-error *ngIf="registerForm.get('role')?.hasError('required')">
                Please select a role
              </mat-error>
            </mat-form-field>

            <mat-form-field class="form-field">
              <mat-label>Password</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'" 
                     formControlName="password" required>
              <button mat-icon-button matSuffix 
                      (click)="hidePassword = !hidePassword" 
                      type="button">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
                Password is required
              </mat-error>
              <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
                Password must be at least 6 characters
              </mat-error>
            </mat-form-field>

            <mat-form-field class="form-field">
              <mat-label>Confirm Password</mat-label>
              <input matInput [type]="hideConfirmPassword ? 'password' : 'text'" 
                     formControlName="confirmPassword" required>
              <button mat-icon-button matSuffix 
                      (click)="hideConfirmPassword = !hideConfirmPassword" 
                      type="button">
                <mat-icon>{{hideConfirmPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('required')">
                Please confirm your password
              </mat-error>
              <mat-error *ngIf="registerForm.hasError('passwordMismatch')">
                Passwords do not match
              </mat-error>
            </mat-form-field>

            <div class="error-message" *ngIf="authState$ | async as auth">
              {{ auth.error }}
            </div>

            <button mat-raised-button color="primary" type="submit" 
                    class="register-button" 
                    [disabled]="registerForm.invalid || (authState$ | async)?.loading">
              <mat-spinner diameter="20" *ngIf="(authState$ | async)?.loading"></mat-spinner>
              <span *ngIf="!(authState$ | async)?.loading">Create Account</span>
            </button>
          </form>
        </mat-card-content>
        
        <mat-card-actions>
          <p>Already have an account? 
            <a routerLink="/auth/login">Sign in here</a>
          </p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 16px;
    }

    .register-card {
      width: 100%;
      max-width: 500px;
    }

    .name-row {
      display: flex;
      gap: 16px;
    }

    .form-field {
      width: 100%;
      margin-bottom: 16px;
    }

    .half-width {
      width: calc(50% - 8px);
    }

    .register-button {
      width: 100%;
      height: 48px;
      margin-top: 16px;
    }

    .error-message {
      color: #f44336;
      text-align: center;
      margin: 16px 0;
    }

    mat-card-actions {
      text-align: center;
    }

    mat-card-actions a {
      color: #3f51b5;
      text-decoration: none;
    }

    mat-card-actions a:hover {
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  authState$: Observable<AuthState>;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    this.authState$ = this.store.select(state => state.auth);
  }

  ngOnInit(): void {
    this.store.dispatch(AuthActions.clearError());
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { confirmPassword, ...userData } = this.registerForm.value;
      this.store.dispatch(AuthActions.register({ userData }));
    }
  }
}