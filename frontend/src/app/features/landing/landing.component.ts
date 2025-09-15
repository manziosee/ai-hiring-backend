import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="landing-container">
      <!-- Animated Background -->
      <div class="background-animation">
        <div class="gradient-orb orb-1"></div>
        <div class="gradient-orb orb-2"></div>
        <div class="gradient-orb orb-3"></div>
        <div class="gradient-orb orb-4"></div>
        <div class="floating-particles">
          <div class="particle" *ngFor="let p of particles; let i = index" [style.animation-delay.s]="i * 0.3"></div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="navbar">
        <div class="nav-content">
          <div class="nav-brand">
            <div class="brand-logo">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              </svg>
            </div>
            <span>AI Hiring</span>
          </div>
          <div class="nav-links">
            <a href="#features" class="nav-link">Features</a>
            <a href="#how-it-works" class="nav-link">How It Works</a>
            <a href="#pricing" class="nav-link">Pricing</a>
            <a href="#contact" class="nav-link">Contact</a>
          </div>
          <div class="nav-actions">
            <a routerLink="/auth/login" class="btn btn-outline">Sign In</a>
            <a routerLink="/auth/register" class="btn btn-primary">Get Started</a>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="hero-text">
            <div class="hero-badge" [class.animate]="isVisible">
              <i class="fas fa-sparkles"></i>
              <span>AI-Powered Recruitment Platform</span>
              <div class="badge-glow"></div>
            </div>
            <h1 class="hero-title" [class.animate]="isVisible">
              Find Your Perfect
              <span class="gradient-text typing-effect">{{ typedText }}</span>
              <span class="cursor" [class.blink]="showCursor">|</span>
              with AI Intelligence
            </h1>
            <p class="hero-description" [class.animate]="isVisible">
              Revolutionary recruitment platform that uses artificial intelligence to match candidates 
              with their dream jobs and help recruiters find the perfect talent faster than ever.
            </p>
            <div class="hero-actions" [class.animate]="isVisible">
              <a routerLink="/auth/register" class="btn btn-primary btn-lg btn-pulse">
                <i class="fas fa-rocket"></i>
                <span>Start Your Journey</span>
                <div class="btn-particles">
                  <div class="particle" *ngFor="let p of buttonParticles; let i = index" [style.animation-delay.ms]="i * 100"></div>
                </div>
              </a>
              <button class="btn btn-secondary btn-lg btn-glow" (click)="playDemo()">
                <i class="fas fa-play"></i>
                <span>Watch Demo</span>
                <div class="btn-ripple"></div>
              </button>
            </div>
            <div class="hero-stats" [class.animate]="isVisible">
              <div class="stat-item" *ngFor="let stat of stats; let i = index" [style.animation-delay.ms]="i * 200">
                <div class="stat-number" [attr.data-target]="stat.number">{{ animatedStats[i] || '0' }}</div>
                <div class="stat-label">{{ stat.label }}</div>
                <div class="stat-icon">
                  <i [class]="stat.icon"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="hero-visual">
            <div class="dashboard-preview">
              <div class="preview-header">
                <div class="preview-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div class="preview-title">AI Hiring Dashboard</div>
              </div>
              <div class="preview-content">
                <div class="preview-sidebar">
                  <div class="sidebar-item active">
                    <i class="fas fa-tachometer-alt"></i>
                    <span>Dashboard</span>
                  </div>
                  <div class="sidebar-item">
                    <i class="fas fa-briefcase"></i>
                    <span>Jobs</span>
                  </div>
                  <div class="sidebar-item">
                    <i class="fas fa-users"></i>
                    <span>Candidates</span>
                  </div>
                  <div class="sidebar-item">
                    <i class="fas fa-brain"></i>
                    <span>AI Screening</span>
                  </div>
                </div>
                <div class="preview-main">
                  <div class="preview-cards">
                    <div class="preview-card">
                      <div class="card-icon">
                        <i class="fas fa-chart-line"></i>
                      </div>
                      <div class="card-content">
                        <div class="card-number">2,847</div>
                        <div class="card-label">Applications</div>
                      </div>
                    </div>
                    <div class="preview-card">
                      <div class="card-icon">
                        <i class="fas fa-user-check"></i>
                      </div>
                      <div class="card-content">
                        <div class="card-number">1,234</div>
                        <div class="card-label">Matches</div>
                      </div>
                    </div>
                  </div>
                  <div class="preview-chart">
                    <div class="chart-bars">
                      <div class="chart-bar" style="height: 60%"></div>
                      <div class="chart-bar" style="height: 80%"></div>
                      <div class="chart-bar" style="height: 45%"></div>
                      <div class="chart-bar" style="height: 90%"></div>
                      <div class="chart-bar" style="height: 70%"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section id="features" class="features-section">
        <div class="section-content">
          <div class="section-header">
            <h2>Powerful Features for Modern Recruitment</h2>
            <p>Everything you need to revolutionize your hiring process</p>
            <div class="section-decoration">
              <div class="decoration-line"></div>
              <div class="decoration-icon">
                <i class="fas fa-gem"></i>
              </div>
              <div class="decoration-line"></div>
            </div>
          </div>
          <div class="features-grid">
            <div class="feature-card" *ngFor="let feature of features; let i = index" 
                 [style.animation-delay.ms]="i * 200"
                 (mouseenter)="onFeatureHover(i)"
                 (mouseleave)="onFeatureLeave(i)"
                 [class.hovered]="hoveredFeature === i">
              <div class="feature-icon" [ngClass]="feature.iconClass">
                <i [class]="feature.icon"></i>
                <div class="icon-bg-animation"></div>
              </div>
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
              <div class="feature-benefits">
                <div class="benefit" *ngFor="let benefit of feature.benefits; let j = index" 
                     [style.animation-delay.ms]="j * 100">
                  <i class="fas fa-check"></i>
                  <span>{{ benefit }}</span>
                </div>
              </div>
              <div class="feature-overlay"></div>
              <div class="feature-number">{{ (i + 1).toString().padStart(2, '0') }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- How It Works Section -->
      <section id="how-it-works" class="how-it-works-section">
        <div class="section-content">
          <div class="section-header">
            <h2>How AI Hiring Works</h2>
            <p>Simple steps to transform your recruitment process</p>
          </div>
          <div class="steps-container">
            <div class="step-item" *ngFor="let step of steps; let i = index">
              <div class="step-number">{{ i + 1 }}</div>
              <div class="step-content">
                <div class="step-icon">
                  <i [class]="step.icon"></i>
                </div>
                <h3>{{ step.title }}</h3>
                <p>{{ step.description }}</p>
              </div>
              <div class="step-connector" *ngIf="i < steps.length - 1"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonials Section -->
      <section class="testimonials-section">
        <div class="section-content">
          <div class="section-header">
            <h2>What Our Users Say</h2>
            <p>Join thousands of satisfied recruiters and candidates</p>
            <div class="testimonial-stats">
              <div class="stat-badge">
                <i class="fas fa-users"></i>
                <span>10,000+ Happy Users</span>
              </div>
              <div class="stat-badge">
                <i class="fas fa-star"></i>
                <span>4.9/5 Rating</span>
              </div>
            </div>
          </div>
          <div class="testimonials-carousel">
            <div class="testimonials-track" [style.transform]="'translateX(' + (-currentTestimonial * 100) + '%)'">
              <div class="testimonial-slide" *ngFor="let testimonial of testimonials; let i = index">
                <div class="testimonial-card" [class.active]="i === currentTestimonial">
                  <div class="testimonial-content">
                    <div class="quote-icon">
                      <i class="fas fa-quote-left"></i>
                    </div>
                    <p>{{ testimonial.content }}</p>
                    <div class="rating">
                      <i class="fas fa-star" *ngFor="let star of [1,2,3,4,5]" 
                         [style.animation-delay.ms]="star * 100"></i>
                    </div>
                  </div>
                  <div class="testimonial-author">
                    <div class="author-avatar">
                      <img [src]="testimonial.avatar" [alt]="testimonial.name">
                      <div class="avatar-ring"></div>
                    </div>
                    <div class="author-info">
                      <div class="author-name">{{ testimonial.name }}</div>
                      <div class="author-role">{{ testimonial.role }}</div>
                    </div>
                  </div>
                  <div class="testimonial-bg-pattern"></div>
                </div>
              </div>
            </div>
            <div class="carousel-controls">
              <button class="carousel-btn prev" (click)="previousTestimonial()">
                <i class="fas fa-chevron-left"></i>
              </button>
              <div class="carousel-dots">
                <button class="dot" *ngFor="let t of testimonials; let i = index" 
                        [class.active]="i === currentTestimonial"
                        (click)="goToTestimonial(i)"></button>
              </div>
              <button class="carousel-btn next" (click)="nextTestimonial()">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="cta-content">
          <div class="cta-text">
            <h2>Ready to Transform Your Hiring?</h2>
            <p>Join thousands of companies already using AI Hiring to find the perfect candidates</p>
          </div>
          <div class="cta-actions">
            <a routerLink="/auth/register" class="btn btn-primary btn-lg">
              <i class="fas fa-rocket"></i>
              Get Started Free
            </a>
            <a href="#contact" class="btn btn-outline btn-lg">
              <i class="fas fa-phone"></i>
              Contact Sales
            </a>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <div class="footer-content">
          <div class="footer-brand">
            <div class="brand-logo">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              </svg>
            </div>
            <span>AI Hiring</span>
          </div>
          <div class="footer-links">
            <div class="footer-section">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#integrations">Integrations</a>
            </div>
            <div class="footer-section">
              <h4>Company</h4>
              <a href="#about">About</a>
              <a href="#careers">Careers</a>
              <a href="#contact">Contact</a>
            </div>
            <div class="footer-section">
              <h4>Resources</h4>
              <a href="#blog">Blog</a>
              <a href="#help">Help Center</a>
              <a href="#api">API Docs</a>
            </div>
          </div>
          <div class="footer-social">
            <a href="#" class="social-link">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="#" class="social-link">
              <i class="fab fa-linkedin"></i>
            </a>
            <a href="#" class="social-link">
              <i class="fab fa-github"></i>
            </a>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2024 AI Hiring. All rights reserved.</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .landing-container {
      min-height: 100vh;
      position: relative;
      overflow-x: hidden;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%);
    }

    .background-animation {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: 0;
      pointer-events: none;
    }

    .gradient-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.4;
      animation: float 15s ease-in-out infinite;
    }

    .orb-1 {
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, #ff9a9e, #fecfef);
      top: -250px;
      left: -250px;
      animation-delay: 0s;
    }

    .orb-2 {
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, #a8edea, #fed6e3);
      bottom: -300px;
      right: -300px;
      animation-delay: 5s;
    }

    .orb-3 {
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, #d299c2, #fef9d7);
      top: 30%;
      right: 20%;
      animation-delay: 10s;
    }

    .orb-4 {
      width: 450px;
      height: 450px;
      background: radial-gradient(circle, #89f7fe, #66a6ff);
      bottom: 40%;
      left: 15%;
      animation-delay: 7s;
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
      animation: particle-float 10s linear infinite;
    }

    .particle:nth-child(1) { left: 5%; }
    .particle:nth-child(2) { left: 15%; }
    .particle:nth-child(3) { left: 25%; }
    .particle:nth-child(4) { left: 35%; }
    .particle:nth-child(5) { left: 45%; }
    .particle:nth-child(6) { left: 55%; }
    .particle:nth-child(7) { left: 65%; }
    .particle:nth-child(8) { left: 75%; }
    .particle:nth-child(9) { left: 85%; }
    .particle:nth-child(10) { left: 95%; }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-50px) rotate(180deg); }
    }

    @keyframes particle-float {
      0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
    }

    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      padding: 1rem 0;
    }

    .nav-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: white;
      font-size: 1.5rem;
      font-weight: 800;
    }

    .brand-logo {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #ff6b6b, #ee5a24);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .brand-logo svg {
      width: 24px;
      height: 24px;
    }

    .nav-links {
      display: flex;
      gap: 2rem;
    }

    .nav-link {
      color: rgba(255, 255, 255, 0.9);
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s ease;
      padding: 0.5rem 1rem;
      border-radius: 8px;
    }

    .nav-link:hover {
      color: white;
      background: rgba(255, 255, 255, 0.1);
    }

    .nav-actions {
      display: flex;
      gap: 1rem;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
      border: none;
      cursor: pointer;
      font-size: 0.875rem;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }

    .btn-outline {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .btn-outline:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.9);
      color: #667eea;
    }

    .btn-secondary:hover {
      background: white;
      transform: translateY(-2px);
    }

    .btn-lg {
      padding: 1rem 2rem;
      font-size: 1rem;
    }

    .hero-section {
      padding: 8rem 2rem 4rem;
      position: relative;
      z-index: 1;
    }

    .hero-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 2rem;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: 800;
      color: white;
      line-height: 1.1;
      margin-bottom: 1.5rem;
    }

    .gradient-text {
      background: linear-gradient(135deg, #ffd89b, #19547b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-description {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.9);
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
      margin-bottom: 3rem;
    }

    .hero-stats {
      display: flex;
      gap: 2rem;
    }

    .stat-item {
      text-align: center;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 800;
      color: white;
      display: block;
    }

    .stat-label {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.8);
    }

    .hero-visual {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .dashboard-preview {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 20px;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
      overflow: hidden;
      width: 100%;
      max-width: 500px;
      animation: float 6s ease-in-out infinite;
    }

    .preview-header {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .preview-dots {
      display: flex;
      gap: 0.5rem;
    }

    .preview-dots span {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
    }

    .preview-title {
      font-weight: 600;
    }

    .preview-content {
      display: flex;
      height: 300px;
    }

    .preview-sidebar {
      width: 200px;
      background: #f8fafc;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .sidebar-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      border-radius: 8px;
      font-size: 0.875rem;
      color: #64748b;
      transition: all 0.3s ease;
    }

    .sidebar-item.active {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
    }

    .preview-main {
      flex: 1;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .preview-cards {
      display: flex;
      gap: 1rem;
    }

    .preview-card {
      flex: 1;
      background: white;
      border-radius: 12px;
      padding: 1rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .card-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .card-number {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1e293b;
    }

    .card-label {
      font-size: 0.75rem;
      color: #64748b;
    }

    .preview-chart {
      flex: 1;
      background: white;
      border-radius: 12px;
      padding: 1rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .chart-bars {
      display: flex;
      align-items: end;
      gap: 0.5rem;
      height: 100px;
    }

    .chart-bar {
      flex: 1;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 4px 4px 0 0;
      animation: chart-grow 2s ease-out;
    }

    @keyframes chart-grow {
      from { height: 0; }
    }

    .features-section,
    .how-it-works-section,
    .testimonials-section {
      padding: 6rem 2rem;
      position: relative;
      z-index: 1;
    }

    .section-content {
      max-width: 1200px;
      margin: 0 auto;
    }

    .section-header {
      text-align: center;
      margin-bottom: 4rem;
    }

    .section-header h2 {
      font-size: 2.5rem;
      font-weight: 800;
      color: white;
      margin-bottom: 1rem;
    }

    .section-header p {
      font-size: 1.125rem;
      color: rgba(255, 255, 255, 0.9);
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
    }

    .feature-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      padding: 2rem;
      transition: all 0.3s ease;
      animation: fadeInUp 0.6s ease-out;
    }

    .feature-card:hover {
      transform: translateY(-10px);
      background: rgba(255, 255, 255, 0.15);
    }

    .feature-icon {
      width: 60px;
      height: 60px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: white;
      margin-bottom: 1.5rem;
    }

    .feature-icon.ai { background: linear-gradient(135deg, #667eea, #764ba2); }
    .feature-icon.matching { background: linear-gradient(135deg, #f093fb, #f5576c); }
    .feature-icon.analytics { background: linear-gradient(135deg, #4facfe, #00f2fe); }
    .feature-icon.automation { background: linear-gradient(135deg, #43e97b, #38f9d7); }

    .feature-card h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      margin-bottom: 1rem;
    }

    .feature-card p {
      color: rgba(255, 255, 255, 0.9);
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .feature-benefits {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .benefit {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.875rem;
    }

    .benefit i {
      color: #43e97b;
    }

    .steps-container {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 2rem;
      position: relative;
    }

    .step-item {
      flex: 1;
      text-align: center;
      position: relative;
    }

    .step-number {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      margin: 0 auto 1.5rem;
      box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
    }

    .step-icon {
      width: 80px;
      height: 80px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      color: white;
      margin: 0 auto 1.5rem;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .step-content h3 {
      font-size: 1.25rem;
      font-weight: 700;
      color: white;
      margin-bottom: 1rem;
    }

    .step-content p {
      color: rgba(255, 255, 255, 0.9);
      line-height: 1.6;
    }

    .step-connector {
      position: absolute;
      top: 30px;
      right: -50%;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, #667eea, #764ba2);
      z-index: -1;
    }

    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
    }

    .testimonial-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      padding: 2rem;
      transition: all 0.3s ease;
    }

    .testimonial-card:hover {
      transform: translateY(-5px);
      background: rgba(255, 255, 255, 0.15);
    }

    .quote-icon {
      font-size: 2rem;
      color: rgba(255, 255, 255, 0.3);
      margin-bottom: 1rem;
    }

    .testimonial-content p {
      color: rgba(255, 255, 255, 0.9);
      font-size: 1.125rem;
      line-height: 1.6;
      margin-bottom: 1.5rem;
      font-style: italic;
    }

    .rating {
      display: flex;
      gap: 0.25rem;
      margin-bottom: 1.5rem;
    }

    .rating i {
      color: #ffd700;
    }

    .testimonial-author {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .author-avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      overflow: hidden;
    }

    .author-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .author-name {
      font-weight: 600;
      color: white;
    }

    .author-role {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.7);
    }

    .cta-section {
      padding: 6rem 2rem;
      position: relative;
      z-index: 1;
      text-align: center;
    }

    .cta-content {
      max-width: 800px;
      margin: 0 auto;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 32px;
      padding: 4rem;
    }

    .cta-text h2 {
      font-size: 2.5rem;
      font-weight: 800;
      color: white;
      margin-bottom: 1rem;
    }

    .cta-text p {
      font-size: 1.125rem;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 2rem;
    }

    .cta-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .footer {
      background: rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(20px);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding: 3rem 2rem 1rem;
      position: relative;
      z-index: 1;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 2fr 1fr;
      gap: 3rem;
      align-items: start;
    }

    .footer-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: white;
      font-size: 1.5rem;
      font-weight: 800;
    }

    .footer-links {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }

    .footer-section h4 {
      color: white;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .footer-section a {
      display: block;
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      margin-bottom: 0.5rem;
      transition: color 0.3s ease;
    }

    .footer-section a:hover {
      color: white;
    }

    .footer-social {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }

    .social-link {
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .social-link:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }

    .footer-bottom {
      max-width: 1200px;
      margin: 2rem auto 0;
      padding-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      text-align: center;
      color: rgba(255, 255, 255, 0.7);
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 1024px) {
      .hero-content {
        grid-template-columns: 1fr;
        text-align: center;
      }

      .nav-links {
        display: none;
      }

      .steps-container {
        flex-direction: column;
        align-items: center;
      }

      .step-connector {
        display: none;
      }

      .footer-content {
        grid-template-columns: 1fr;
        text-align: center;
      }

      .footer-social {
        justify-content: center;
      }
    }

    @media (max-width: 640px) {
      .hero-title {
        font-size: 2.5rem;
      }

      .hero-actions {
        flex-direction: column;
        align-items: center;
      }

      .hero-stats {
        justify-content: center;
      }

      .cta-actions {
        flex-direction: column;
        align-items: center;
      }

      .nav-content {
        padding: 0 1rem;
      }

      .nav-actions {
        gap: 0.5rem;
      }

      .btn {
        padding: 0.5rem 1rem;
        font-size: 0.75rem;
      }
    }
    
    /* Enhanced Animation Styles */
    .hero-badge.animate {
      animation: badgeGlow 2s ease-in-out infinite alternate;
    }
    
    @keyframes badgeGlow {
      0% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.3); }
      100% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(102, 126, 234, 0.4); }
    }
    
    .typing-effect {
      position: relative;
    }
    
    .cursor {
      display: inline-block;
      margin-left: 2px;
      opacity: 1;
      transition: opacity 0.1s;
    }
    
    .cursor.blink {
      animation: blink 1s infinite;
    }
    
    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }
    
    .btn-pulse {
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    
    .btn-glow:hover {
      box-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
    }
    
    .btn-particles {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      overflow: hidden;
      border-radius: inherit;
    }
    
    .btn-particles .particle {
      position: absolute;
      width: 3px;
      height: 3px;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 50%;
      animation: buttonParticle 3s linear infinite;
    }
    
    @keyframes buttonParticle {
      0% {
        transform: translateY(100%) rotate(0deg);
        opacity: 0;
      }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% {
        transform: translateY(-100%) rotate(360deg);
        opacity: 0;
      }
    }
    
    .stat-item {
      opacity: 0;
      transform: translateY(20px);
      animation: statFadeIn 0.8s ease-out forwards;
    }
    
    @keyframes statFadeIn {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .stat-icon {
      position: absolute;
      top: -10px;
      right: -10px;
      width: 20px;
      height: 20px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
    }
    
    .feature-card {
      position: relative;
      overflow: hidden;
    }
    
    .feature-card.hovered .icon-bg-animation {
      animation: iconPulse 0.6s ease-out;
    }
    
    @keyframes iconPulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }
    
    .feature-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      transform: translateX(-100%);
      transition: transform 0.6s ease;
    }
    
    .feature-card:hover .feature-overlay {
      transform: translateX(100%);
    }
    
    .feature-number {
      position: absolute;
      top: 1rem;
      right: 1rem;
      font-size: 3rem;
      font-weight: 800;
      color: rgba(255, 255, 255, 0.1);
      line-height: 1;
    }
    
    .section-decoration {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-top: 1rem;
    }
    
    .decoration-line {
      width: 50px;
      height: 2px;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
    }
    
    .decoration-icon {
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, 0.8);
    }
    
    .testimonials-carousel {
      position: relative;
      overflow: hidden;
      border-radius: 20px;
    }
    
    .testimonials-track {
      display: flex;
      transition: transform 0.5s ease-in-out;
    }
    
    .testimonial-slide {
      min-width: 100%;
      padding: 0 1rem;
    }
    
    .testimonial-card {
      position: relative;
      overflow: hidden;
    }
    
    .testimonial-card.active {
      transform: scale(1.02);
    }
    
    .testimonial-bg-pattern {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1), transparent);
      pointer-events: none;
    }
    
    .avatar-ring {
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      animation: avatarGlow 3s ease-in-out infinite alternate;
    }
    
    @keyframes avatarGlow {
      0% { border-color: rgba(255, 255, 255, 0.3); }
      100% { border-color: rgba(102, 126, 234, 0.6); }
    }
    
    .carousel-controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2rem;
      margin-top: 2rem;
    }
    
    .carousel-btn {
      width: 50px;
      height: 50px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }
    
    .carousel-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.1);
    }
    
    .carousel-dots {
      display: flex;
      gap: 0.5rem;
    }
    
    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .dot.active {
      background: rgba(255, 255, 255, 0.8);
      transform: scale(1.2);
    }
    
    .testimonial-stats {
      display: flex;
      gap: 2rem;
      justify-content: center;
      margin-top: 1rem;
    }
    
    .stat-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.1);
      padding: 0.5rem 1rem;
      border-radius: 20px;
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.875rem;
    }
  `]
})
export class LandingComponent implements OnInit, OnDestroy {
  particles = Array(10).fill(0);

  // Animation and UI state properties
  isVisible = false;
  typedText = '';
  showCursor = true;
  buttonParticles = Array(6).fill(0);
  hoveredFeature: number | null = null;
  currentTestimonial = 0;

  // Stats data and animation
  stats = [
    { number: 10000, label: 'Active Users', icon: 'fas fa-users' },
    { number: 500, label: 'Companies', icon: 'fas fa-building' },
    { number: 25000, label: 'Jobs Posted', icon: 'fas fa-briefcase' },
    { number: 98, label: 'Success Rate', icon: 'fas fa-chart-line' }
  ];
  animatedStats: number[] = [0, 0, 0, 0];

  // Typing effect properties
  private typingTexts = ['Candidates', 'Jobs', 'Opportunities', 'Matches'];
  private currentTextIndex = 0;
  private currentCharIndex = 0;
  private typingInterval: any;
  private cursorInterval: any;
  private testimonialInterval: any;

  // Animation intervals
  private statsAnimationTimeout: any;

  features = [
    {
      icon: 'fas fa-brain',
      iconClass: 'ai',
      title: 'AI-Powered Screening',
      description: 'Advanced machine learning algorithms analyze resumes and match candidates with perfect job opportunities.',
      benefits: ['Smart resume parsing', 'Skill matching', 'Automated scoring']
    },
    {
      icon: 'fas fa-users',
      iconClass: 'matching',
      title: 'Perfect Matching',
      description: 'Our intelligent system connects the right candidates with the right opportunities based on skills and culture fit.',
      benefits: ['Culture fit analysis', 'Skill compatibility', 'Experience matching']
    },
    {
      icon: 'fas fa-chart-line',
      iconClass: 'analytics',
      title: 'Advanced Analytics',
      description: 'Get deep insights into your hiring process with comprehensive analytics and performance metrics.',
      benefits: ['Hiring metrics', 'Performance tracking', 'ROI analysis']
    },
    {
      icon: 'fas fa-robot',
      iconClass: 'automation',
      title: 'Process Automation',
      description: 'Automate repetitive tasks and focus on what matters most - finding the perfect candidates.',
      benefits: ['Automated workflows', 'Smart notifications', 'Bulk operations']
    }
  ];

  steps = [
    {
      icon: 'fas fa-user-plus',
      title: 'Create Account',
      description: 'Sign up as a recruiter or candidate and set up your profile in minutes.'
    },
    {
      icon: 'fas fa-upload',
      title: 'Upload & Post',
      description: 'Candidates upload resumes, recruiters post job openings with detailed requirements.'
    },
    {
      icon: 'fas fa-magic',
      title: 'AI Matching',
      description: 'Our AI analyzes and matches candidates with suitable positions automatically.'
    },
    {
      icon: 'fas fa-handshake',
      title: 'Connect & Hire',
      description: 'Review matches, conduct interviews, and make successful hires faster than ever.'
    }
  ];

  testimonials = [
    {
      content: 'AI Hiring transformed our recruitment process. We reduced hiring time by 60% and found better candidates.',
      name: 'Sarah Johnson',
      role: 'HR Director at TechCorp',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      content: 'The AI matching is incredible. I found my dream job within a week of signing up. Highly recommended!',
      name: 'Michael Chen',
      role: 'Software Engineer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      content: 'Best recruitment platform we have used. The analytics help us make data-driven hiring decisions.',
      name: 'Emily Rodriguez',
      role: 'Talent Acquisition Manager',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    }
  ];

  ngOnInit() {
    // Initialize animations after component loads
    setTimeout(() => {
      this.isVisible = true;
      this.startTypingEffect();
      this.animateStats();
      this.startTestimonialCarousel();
    }, 500);
  }

  ngOnDestroy() {
    // Clean up intervals
    if (this.typingInterval) clearInterval(this.typingInterval);
    if (this.cursorInterval) clearInterval(this.cursorInterval);
    if (this.testimonialInterval) clearInterval(this.testimonialInterval);
    if (this.statsAnimationTimeout) clearTimeout(this.statsAnimationTimeout);
  }

  private startTypingEffect() {
    this.cursorInterval = setInterval(() => {
      this.showCursor = !this.showCursor;
    }, 500);

    this.typeCurrentText();
  }

  private typeCurrentText() {
    const currentText = this.typingTexts[this.currentTextIndex];

    if (this.currentCharIndex < currentText.length) {
      this.typedText += currentText[this.currentCharIndex];
      this.currentCharIndex++;
      this.typingInterval = setTimeout(() => this.typeCurrentText(), 100);
    } else {
      // Wait before starting to delete
      this.typingInterval = setTimeout(() => this.deleteCurrentText(), 2000);
    }
  }

  private deleteCurrentText() {
    if (this.currentCharIndex > 0) {
      this.typedText = this.typedText.slice(0, -1);
      this.currentCharIndex--;
      this.typingInterval = setTimeout(() => this.deleteCurrentText(), 50);
    } else {
      // Move to next text
      this.currentTextIndex = (this.currentTextIndex + 1) % this.typingTexts.length;
      this.typingInterval = setTimeout(() => this.typeCurrentText(), 500);
    }
  }

  private animateStats() {
    this.stats.forEach((stat, index) => {
      this.animateNumber(index, stat.number);
    });
  }

  private animateNumber(index: number, target: number) {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      current += increment;
      step++;

      if (step >= steps) {
        this.animatedStats[index] = target;
        clearInterval(timer);
      } else {
        this.animatedStats[index] = Math.floor(current);
      }
    }, duration / steps);
  }

  onFeatureHover(index: number) {
    this.hoveredFeature = index;
  }

  onFeatureLeave(index: number) {
    this.hoveredFeature = null;
  }

  previousTestimonial() {
    this.currentTestimonial = this.currentTestimonial === 0
      ? this.testimonials.length - 1
      : this.currentTestimonial - 1;
  }

  nextTestimonial() {
    this.currentTestimonial = (this.currentTestimonial + 1) % this.testimonials.length;
  }

  goToTestimonial(index: number) {
    this.currentTestimonial = index;
  }

  private startTestimonialCarousel() {
    this.testimonialInterval = setInterval(() => {
      this.nextTestimonial();
    }, 5000);
  }

  playDemo() {
    // Implement demo video functionality
    console.log('Playing demo video...');
  }
}