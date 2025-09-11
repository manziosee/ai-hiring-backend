import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatCardModule],
  template: `
    <div class="landing-container">
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">
            Transform Your Hiring with 
            <span class="gradient-text">AI Intelligence</span>
          </h1>
          <p class="hero-subtitle">
            Streamline recruitment, screen candidates intelligently, and find the perfect match 
            with our cutting-edge AI-powered hiring platform.
          </p>
          <div class="hero-actions">
            <button mat-raised-button color="primary" class="cta-button" routerLink="/auth/register">
              <mat-icon>rocket_launch</mat-icon>
              Get Started Free
            </button>
            <button mat-stroked-button class="demo-button" routerLink="/jobs">
              <mat-icon>play_circle</mat-icon>
              View Demo
            </button>
          </div>
        </div>
      </section>

      <section class="features-section">
        <div class="section-header">
          <h2>Why Choose Our Platform?</h2>
          <p>Powerful features designed to revolutionize your hiring process</p>
        </div>
        <div class="features-grid">
          <mat-card class="feature-card">
            <div class="feature-icon ai-icon">
              <mat-icon>psychology</mat-icon>
            </div>
            <h3>AI-Powered Screening</h3>
            <p>Automatically screen resumes and rank candidates using advanced machine learning algorithms.</p>
          </mat-card>
          
          <mat-card class="feature-card">
            <div class="feature-icon smart-icon">
              <mat-icon>auto_awesome</mat-icon>
            </div>
            <h3>Smart Matching</h3>
            <p>Find the perfect candidate-job fit with our intelligent matching system.</p>
          </mat-card>
          
          <mat-card class="feature-card">
            <div class="feature-icon analytics-icon">
              <mat-icon>analytics</mat-icon>
            </div>
            <h3>Real-time Analytics</h3>
            <p>Get insights into your hiring process with comprehensive analytics and reporting.</p>
          </mat-card>
        </div>
      </section>

      <section class="cta-section">
        <div class="cta-content">
          <h2>Ready to Transform Your Hiring?</h2>
          <p>Join thousands of companies already using our AI-powered platform</p>
          <button mat-raised-button color="primary" class="cta-button" routerLink="/auth/register">
            <mat-icon>rocket_launch</mat-icon>
            Start Free Trial
          </button>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .landing-container {
      min-height: 100vh;
    }

    .hero-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 100px 24px;
      text-align: center;
    }

    .hero-content {
      max-width: 800px;
      margin: 0 auto;
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: 700;
      line-height: 1.2;
      margin-bottom: 24px;
    }

    .gradient-text {
      background: linear-gradient(45deg, #ffd700, #ff6b6b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      line-height: 1.6;
      margin-bottom: 40px;
      opacity: 0.9;
    }

    .hero-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
    }

    .cta-button {
      height: 56px;
      padding: 0 32px;
      font-size: 16px;
      font-weight: 600;
      border-radius: 28px;
    }

    .demo-button {
      height: 56px;
      padding: 0 32px;
      font-size: 16px;
      border-radius: 28px;
      border-color: rgba(255,255,255,0.3);
      color: white;
    }

    .features-section {
      padding: 100px 24px;
      background: #f8f9fa;
    }

    .section-header {
      text-align: center;
      margin-bottom: 60px;
    }

    .section-header h2 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #333;
      margin-bottom: 16px;
    }

    .section-header p {
      font-size: 1.125rem;
      color: #666;
    }

    .features-grid {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 32px;
    }

    .feature-card {
      padding: 40px 32px;
      text-align: center;
      border-radius: 16px;
      transition: transform 0.3s;
    }

    .feature-card:hover {
      transform: translateY(-8px);
    }

    .feature-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      color: white;
    }

    .ai-icon { background: linear-gradient(135deg, #667eea, #764ba2); }
    .smart-icon { background: linear-gradient(135deg, #f093fb, #f5576c); }
    .analytics-icon { background: linear-gradient(135deg, #4facfe, #00f2fe); }

    .feature-icon mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .feature-card h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 16px;
    }

    .feature-card p {
      color: #666;
      line-height: 1.6;
    }

    .cta-section {
      padding: 100px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-align: center;
    }

    .cta-content h2 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 16px;
    }

    .cta-content p {
      font-size: 1.125rem;
      margin-bottom: 40px;
      opacity: 0.9;
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 2.5rem;
      }

      .hero-actions {
        flex-direction: column;
        align-items: center;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class LandingComponent {}