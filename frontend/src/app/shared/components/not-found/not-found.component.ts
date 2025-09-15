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
        <div class="error-icon">🔍</div>
        <div class="error-number">404</div>
        <h1>Oops! Page Not Found</h1>
        <p>
          The page you're looking for seems to have wandered off. Don't worry,
          even the best explorers get lost sometimes!
        </p>
        <div class="error-actions">
          <button class="btn btn-primary" routerLink="/dashboard">
            <span class="btn-icon">📊</span>
            <span>Go to Dashboard</span>
          </button>
          <button class="btn btn-secondary" routerLink="/">
            <span class="btn-icon">🏠</span>
            <span>Back to Home</span>
          </button>
          <button class="btn btn-outline" routerLink="/jobs">
            <span class="btn-icon">💼</span>
            <span>Browse Jobs</span>
          </button>
        </div>
        <div class="helpful-links">
          <h3>Popular Pages</h3>
          <div class="links-grid">
            <a routerLink="/jobs" class="link-card">
              <span class="link-icon">💼</span>
              <span>Jobs</span>
            </a>
            <a routerLink="/applications" class="link-card">
              <span class="link-icon">📋</span>
              <span>Applications</span>
            </a>
            <a routerLink="/interviews" class="link-card">
              <span class="link-icon">📅</span>
              <span>Interviews</span>
            </a>
            <a routerLink="/profile" class="link-card">
              <span class="link-icon">👤</span>
              <span>Profile</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .error-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      .error-content {
        text-align: center;
        max-width: 500px;
        background: white;
        padding: 48px 32px;
        border-radius: 20px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      }

      .error-icon {
        font-size: 4rem;
        margin-bottom: 16px;
        animation: bounce 2s infinite;
      }

      .error-number {
        font-size: 6rem;
        font-weight: 800;
        background: linear-gradient(135deg, #667eea, #764ba2);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        line-height: 1;
        margin-bottom: 16px;
      }

      h1 {
        font-size: 2rem;
        font-weight: 700;
        margin: 0 0 16px 0;
        color: #1f2937;
      }

      p {
        color: #6b7280;
        margin: 0 0 32px 0;
        font-size: 1.125rem;
        line-height: 1.6;
      }

      .error-actions {
        display: flex;
        gap: 12px;
        justify-content: center;
        flex-wrap: wrap;
        margin-bottom: 40px;
      }

      .btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 20px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 500;
        transition: all 0.3s ease;
        border: none;
        cursor: pointer;
      }

      .btn-primary {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
      }

      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
      }

      .btn-secondary {
        background: #f3f4f6;
        color: #374151;
      }

      .btn-secondary:hover {
        background: #e5e7eb;
        transform: translateY(-2px);
      }

      .btn-outline {
        background: transparent;
        color: #667eea;
        border: 2px solid #667eea;
      }

      .btn-outline:hover {
        background: #667eea;
        color: white;
        transform: translateY(-2px);
      }

      .helpful-links {
        margin-top: 32px;
        padding-top: 32px;
        border-top: 1px solid #e5e7eb;
      }

      .helpful-links h3 {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0 0 20px 0;
        color: #374151;
      }

      .links-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }

      .link-card {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        background: #f9fafb;
        border-radius: 8px;
        text-decoration: none;
        color: #374151;
        transition: all 0.3s ease;
        font-size: 14px;
      }

      .link-card:hover {
        background: #f3f4f6;
        transform: translateY(-1px);
      }

      .link-icon {
        font-size: 16px;
      }

      @keyframes bounce {
        0%,
        20%,
        50%,
        80%,
        100% {
          transform: translateY(0);
        }
        40% {
          transform: translateY(-10px);
        }
        60% {
          transform: translateY(-5px);
        }
      }

      @media (max-width: 640px) {
        .error-content {
          padding: 32px 24px;
          margin: 16px;
        }

        .error-number {
          font-size: 4rem;
        }

        .links-grid {
          grid-template-columns: 1fr;
        }

        .error-actions {
          flex-direction: column;
        }
      }
    `,
  ],
})
export class NotFoundComponent {}
