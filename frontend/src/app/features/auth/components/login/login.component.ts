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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppState } from '@core/store';
import * as AuthActions from '@core/store/auth/auth.actions';
import { AuthState } from '@core/models/auth.models';

@Component({
  selector: 'app-login',
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
    MatProgressSpinnerModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Welcome Back</mat-card-title>
          <mat-card-subtitle>Sign in to your account</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field class="form-field">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" required>
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                Please enter a valid email
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
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                Password is required
              </mat-error>
            </mat-form-field>

            <div class="error-message" *ngIf="authState$ | async as auth">
              {{ auth.error }}
            </div>

            <button mat-raised-button color="primary" type="submit" 
                    class="login-button" 
                    [disabled]="loginForm.invalid || (authState$ | async)?.loading">
              <mat-spinner diameter="20" *ngIf="(authState$ | async)?.loading"></mat-spinner>
              <span *ngIf="!(authState$ | async)?.loading">Sign In</span>
            </button>
          </form>
        </mat-card-content>
        
        <mat-card-actions>
          <p>Don't have an account? 
            <a routerLink="/auth/register">Sign up here</a>
          </p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 16px;
    }

    .login-card {
      width: 100%;
      max-width: 400px;
    }

    .form-field {
      width: 100%;
      margin-bottom: 16px;
    }

    .login-button {
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
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hidePassword = true;
  authState$: Observable<AuthState>;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.authState$ = this.store.select(state => state.auth);
  }

  ngOnInit(): void {
    this.store.dispatch(AuthActions.clearError());
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.store.dispatch(AuthActions.login({ 
        credentials: this.loginForm.value 
      }));
    }
  }
}