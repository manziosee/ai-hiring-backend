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
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="fade-in">
              Revolutionize Your Hiring with
              <span class="gradient-text">AI-Powered</span> Intelligence
            </h1>
            <p class="fade-in">
              Transform your recruitment process with cutting-edge AI technology. 
              Screen resumes instantly, match candidates perfectly, and hire the best talent faster than ever.
            </p>
            <div class="hero-actions fade-in">
              <button mat-raised-button color="primary" routerLink="/auth/register" class="cta-button">
                Get Started Free
                <mat-icon>arrow_forward</mat-icon>
              </button>
              <button mat-stroked-button routerLink="/auth/login" class="secondary-button">
                Sign In
              </button>
            </div>
          </div>
          <div class="hero-visual">
            <div class="ai-visualization">
              <div class="ai-circle pulse">
                <mat-icon>psychology</mat-icon>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section">
        <div class="section-header">
          <h2>Powerful Features for Modern Hiring</h2>
          <p>Everything you need to streamline your recruitment process</p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card card fade-in" *ngFor="let feature of features">
            <div class="feature-icon" [class]="feature.iconClass">
              <mat-icon>{{ feature.icon }}</mat-icon>
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="stats-section">
        <div class="stats-grid">
          <div class="stat-item" *ngFor="let stat of stats">
            <h3>{{ stat.value }}</h3>
            <p>{{ stat.label }}</p>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="cta-content">
          <h2>Ready to Transform Your Hiring?</h2>
          <p>Join thousands of companies already using AI Hire to find the best talent.</p>
          <button mat-raised-button color="primary" routerLink="/auth/register" class="cta-button">
            Start Your Free Trial
            <mat-icon>rocket_launch</mat-icon>
          </button>
        </div>
      </section>

      <!-- Footer -->
      <footer class="landing-footer">
        <div class="footer-content">
          <div class="footer-brand">
            <div class="logo">
              <mat-icon>psychology</mat-icon>
              <span>AI Hire</span>
            </div>
            <p>The future of intelligent recruitment.</p>
          </div>
          <div class="footer-links">
            <div class="link-group">
              <h4>Product</h4>
              <a href="#">Features</a>
              <a href="#">Pricing</a>
              <a href="#">Enterprise</a>
            </div>
            <div class="link-group">
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Careers</a>
              <a href="#">Contact</a>
            </div>
            <div class="link-group">
              <h4>Resources</h4>
              <a href="#">Blog</a>
              <a href="#">Help Center</a>
              <a href="#">API Docs</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2025 AI Hire. All rights reserved.</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .landing-container {
      width: 100%;
      overflow-x: hidden;
    }

    .hero-section {
      min-height: 100vh;
      display: flex;
      align-items: center;
      background: linear-gradient(135deg, var(--primary-50) 0%, var(--secondary-50) 100%);
      padding: 80px 24px 24px;
    }

    .hero-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 80px;
      align-items: center;
    }

    .hero-text h1 {
      font-size: 3.5rem;
      font-weight: 800;
      line-height: 1.2;
      margin: 0 0 24px 0;
      color: var(--gray-800);
    }

    .gradient-text {
      background: linear-gradient(135deg, var(--primary-600) 0%, var(--secondary-600) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-text p {
      font-size: 1.25rem;
      line-height: 1.6;
      color: var(--gray-600);
      margin: 0 0 32px 0;
    }

    .hero-actions {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .cta-button {
      height: 56px;
      padding: 0 32px;
      font-size: 16px;
      font-weight: 600;
      gap: 8px;
    }

    .secondary-button {
      height: 56px;
      padding: 0 32px;
      font-size: 16px;
      font-weight: 600;
    }

    .hero-visual {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .ai-visualization {
      position: relative;
      width: 300px;
      height: 300px;
    }

    .ai-circle {
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary-600) 0%, var(--secondary-600) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 50px auto;
      box-shadow: 0 20px 40px rgba(59, 130, 246, 0.3);
    }

    .ai-circle mat-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: white;
    }

    .pulse {
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% {
        transform: scale(1);
        box-shadow: 0 20px 40px rgba(59, 130, 246, 0.3);
      }
      50% {
        transform: scale(1.05);
        box-shadow: 0 25px 50px rgba(59, 130, 246, 0.4);
      }
      100% {
        transform: scale(1);
        box-shadow: 0 20px 40px rgba(59, 130, 246, 0.3);
      }
    }

    .features-section {
      padding: 120px 24px;
      background: white;
    }

    .section-header {
      text-align: center;
      max-width: 600px;
      margin: 0 auto 80px;
    }

    .section-header h2 {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 16px 0;
      color: var(--gray-800);
    }

    .section-header p {
      font-size: 1.125rem;
      color: var(--gray-600);
      margin: 0;
    }

    .features-grid {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 32px;
    }

    .feature-card {
      padding: 32px;
      text-align: center;
      border: 1px solid var(--gray-200);
      transition: all 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    }

    .feature-icon {
      width: 80px;
      height: 80px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
    }

    .feature-icon.primary {
      background: var(--primary-100);
      color: var(--primary-600);
    }

    .feature-icon.secondary {
      background: var(--secondary-100);
      color: var(--secondary-600);
    }

    .feature-icon.accent {
      background: #fef3c7;
      color: var(--warning-500);
    }

    .feature-icon.success {
      background: #dcfce7;
      color: var(--success-500);
    }

    .feature-icon mat-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
    }

    .feature-card h3 {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0 0 16px 0;
      color: var(--gray-800);
    }

    .feature-card p {
      color: var(--gray-600);
      line-height: 1.6;
      margin: 0;
    }

    .stats-section {
      padding: 80px 24px;
      background: var(--gray-900);
      color: white;
    }

    .stats-grid {
      max-width: 800px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 48px;
    }

    .stat-item {
      text-align: center;
    }

    .stat-item h3 {
      font-size: 3rem;
      font-weight: 800;
      margin: 0 0 8px 0;
      color: var(--primary-400);
    }

    .stat-item p {
      font-size: 1.125rem;
      margin: 0;
      color: var(--gray-300);
    }

    .cta-section {
      padding: 120px 24px;
      background: linear-gradient(135deg, var(--primary-600) 0%, var(--secondary-600) 100%);
      color: white;
      text-align: center;
    }

    .cta-content h2 {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 16px 0;
    }

    .cta-content p {
      font-size: 1.25rem;
      margin: 0 0 32px 0;
      opacity: 0.9;
    }

    .cta-content .cta-button {
      background: white;
      color: var(--primary-600);
    }

    .landing-footer {
      background: var(--gray-900);
      color: white;
      padding: 80px 24px 24px;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 80px;
    }

    .footer-brand .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 16px;
      color: var(--primary-400);
    }

    .footer-brand .logo mat-icon {
      font-size: 28px;
      color: var(--accent-500);
    }

    .footer-brand p {
      color: var(--gray-400);
      margin: 0;
    }

    .footer-links {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 40px;
    }

    .link-group h4 {
      font-weight: 600;
      margin: 0 0 16px 0;
      color: white;
    }

    .link-group a {
      display: block;
      color: var(--gray-400);
      text-decoration: none;
      margin-bottom: 8px;
      transition: color 0.3s ease;
    }

    .link-group a:hover {
      color: var(--primary-400);
    }

    .footer-bottom {
      max-width: 1200px;
      margin: 40px auto 0;
      padding-top: 24px;
      border-top: 1px solid var(--gray-800);
      text-align: center;
      color: var(--gray-400);
    }

    @media (max-width: 768px) {
      .hero-content {
        grid-template-columns: 1fr;
        gap: 40px;
        text-align: center;
      }

      .hero-text h1 {
        font-size: 2.5rem;
      }

      .hero-actions {
        flex-direction: column;
        align-items: center;
      }

      .hero-actions button {
        width: 100%;
        max-width: 280px;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 32px;
      }

      .footer-content {
        grid-template-columns: 1fr;
        gap: 40px;
        text-align: center;
      }

      .footer-links {
        grid-template-columns: 1fr;
        gap: 24px;
      }
    }
  `]
})
export class LandingComponent {
  features = [
    {
      icon: 'psychology',
      title: 'AI-Powered Screening',
      description: 'Automatically screen and rank candidates using advanced AI algorithms that analyze skills, experience, and job fit.',
      iconClass: 'primary'
    },
    {
      icon: 'speed',
      title: 'Instant Resume Parsing',
      description: 'Extract key information from resumes in seconds. Our AI understands context and identifies relevant skills automatically.',
      iconClass: 'secondary'
    },
    {
      icon: 'psychology',
      title: 'Smart Matching',
      description: 'Find the perfect candidates with our intelligent matching system that considers both hard and soft skills.',
      iconClass: 'accent'
    },
    {
      icon: 'analytics',
      title: 'Advanced Analytics',
      description: 'Get deep insights into your hiring process with comprehensive reports and performance metrics.',
      iconClass: 'success'
    },
    {
      icon: 'schedule',
      title: 'Automated Workflows',
      description: 'Streamline your recruitment process with automated interview scheduling and candidate communication.',
      iconClass: 'primary'
    },
    {
      icon: 'security',
      title: 'Enterprise Security',
      description: 'Your data is protected with enterprise-grade security, compliance, and privacy controls.',
      iconClass: 'secondary'
    }
  ];

  stats = [
    { value: '50,000+', label: 'Resumes Processed' },
    { value: '85%', label: 'Time Saved' },
    { value: '2,000+', label: 'Companies Trust Us' },
    { value: '95%', label: 'Accuracy Rate' }
  ];
}