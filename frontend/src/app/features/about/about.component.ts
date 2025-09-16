import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="about-container">
      <div class="about-header">
        <div class="header-content">
          <nav class="breadcrumb">
            <a routerLink="/">Home</a>
            <i class="fas fa-chevron-right"></i>
            <span>About Us</span>
          </nav>
          <h1>Revolutionizing Hiring with AI</h1>
          <p>We're on a mission to make hiring more efficient, fair, and intelligent through artificial intelligence.</p>
        </div>
      </div>

      <section class="mission-section">
        <div class="section-content">
          <div class="mission-grid">
            <div class="mission-content">
              <h2>Our Mission</h2>
              <p>At AI Hiring, we transform recruitment through cutting-edge AI, creating accurate, efficient, and unbiased hiring processes.</p>
              <div class="mission-stats">
                <div class="stat-item">
                  <div class="stat-number">10M+</div>
                  <div class="stat-label">Candidates Matched</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">50K+</div>
                  <div class="stat-label">Companies Served</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">95%</div>
                  <div class="stat-label">Success Rate</div>
                </div>
              </div>
            </div>
            <div class="mission-visual">
              <div class="visual-card">
                <div class="card-icon"><i class="fas fa-brain"></i></div>
                <h4>AI-Powered Matching</h4>
                <p>Advanced algorithms analyze skills and cultural fit</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="values-section">
        <div class="section-content">
          <h2>Our Values</h2>
          <div class="values-grid">
            <div class="value-card">
              <div class="value-icon"><i class="fas fa-lightbulb"></i></div>
              <h3>Innovation</h3>
              <p>Pushing AI boundaries to solve hiring challenges</p>
            </div>
            <div class="value-card">
              <div class="value-icon"><i class="fas fa-heart"></i></div>
              <h3>Fairness</h3>
              <p>Equal opportunities for all candidates</p>
            </div>
            <div class="value-card">
              <div class="value-icon"><i class="fas fa-shield-alt"></i></div>
              <h3>Trust</h3>
              <p>Highest security standards and transparency</p>
            </div>
          </div>
        </div>
      </section>

      <section class="contact-cta-section">
        <div class="section-content">
          <div class="cta-content">
            <h2>Ready to Transform Your Hiring?</h2>
            <p>Join thousands of companies using AI Hiring to find perfect candidates.</p>
            <div class="cta-buttons">
              <button class="cta-btn primary" routerLink="/contact">
                <i class="fas fa-envelope"></i>
                Get in Touch
              </button>
              <button class="cta-btn secondary" routerLink="/pricing">
                <i class="fas fa-eye"></i>
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .about-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8fffe 0%, #f0fdf4 100%);
      font-family: 'Inter', sans-serif;
    }

    .about-header {
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
      padding: 120px 0 80px;
      color: white;
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      text-align: center;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 2rem;
      font-size: 0.875rem;
    }

    .breadcrumb a {
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
    }

    .header-content h1 {
      font-size: 3rem;
      font-weight: 800;
      margin-bottom: 1rem;
    }

    .section-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .mission-section {
      padding: 4rem 0;
    }

    .mission-grid {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 4rem;
      align-items: center;
    }

    .mission-content h2 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 2rem;
    }

    .mission-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      margin-top: 3rem;
    }

    .stat-item {
      text-align: center;
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: 800;
      color: #059669;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      color: #6b7280;
      font-weight: 600;
    }

    .visual-card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.1);
    }

    .card-icon {
      width: 60px;
      height: 60px;
      background: linear-gradient(45deg, #10b981, #059669);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }

    .values-section {
      padding: 4rem 0;
      background: rgba(16, 185, 129, 0.05);
    }

    .values-section h2 {
      text-align: center;
      font-size: 2.5rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 3rem;
    }

    .values-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .value-card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      text-align: center;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
      transition: transform 0.3s ease;
    }

    .value-card:hover {
      transform: translateY(-8px);
    }

    .value-icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(45deg, #10b981, #059669);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 2rem;
      margin: 0 auto 1.5rem;
    }

    .value-card h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 1rem;
    }

    .contact-cta-section {
      padding: 4rem 0;
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
      color: white;
    }

    .cta-content {
      text-align: center;
      max-width: 800px;
      margin: 0 auto;
    }

    .cta-content h2 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .cta-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .cta-btn {
      padding: 1rem 2rem;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border: none;
    }

    .cta-btn.primary {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .cta-btn.secondary {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.2);
    }

    .cta-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }

    @media (max-width: 1024px) {
      .mission-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
    }

    @media (max-width: 768px) {
      .header-content h1 {
        font-size: 2.5rem;
      }
      .values-grid {
        grid-template-columns: 1fr;
      }
      .mission-stats {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AboutComponent implements OnInit {
  ngOnInit(): void {
    // Component initialization
  }
}
