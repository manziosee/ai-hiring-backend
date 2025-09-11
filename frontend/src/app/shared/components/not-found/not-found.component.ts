import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="error-container">
      <div class="error-content">
        <div class="error-number">404</div>
        <h1>Page Not Found</h1>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <div class="error-actions">
          <button class="btn btn-primary" routerLink="/dashboard">
            <i class="fas fa-tachometer-alt"></i>
            Go to Dashboard
          </button>
          <button class="btn btn-secondary" routerLink="/">
            <i class="fas fa-home"></i>
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

    .error-number {
      font-size: 8rem;
      font-weight: 800;
      color: var(--primary-600);
      line-height: 1;
      margin-bottom: 16px;
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
export class NotFoundComponent {}