import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  template: `
    <div class="error-container">
      <div class="error-content">
        <mat-icon class="error-icon">block</mat-icon>
        <h1>Access Denied</h1>
        <p>You don't have permission to access this page.</p>
        <div class="error-actions">
          <button mat-raised-button color="primary" routerLink="/dashboard">
            <mat-icon>dashboard</mat-icon>
            Go to Dashboard
          </button>
          <button mat-button routerLink="/">
            <mat-icon>home</mat-icon>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .error-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: var(--gray-50);
    }

    .error-content {
      text-align: center;
      max-width: 400px;
    }

    .error-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: var(--error-500);
      margin-bottom: 24px;
    }

    h1 {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 16px 0;
      color: var(--gray-800);
    }

    p {
      color: var(--gray-600);
      margin: 0 0 32px 0;
      font-size: 1.125rem;
    }

    .error-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }

    button {
      gap: 8px;
    }
  `]
})
export class UnauthorizedComponent {}