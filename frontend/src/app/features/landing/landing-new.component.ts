import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Lever-Inspired Clean Header -->
    <header class="header">
      <div class="header-container">
        <div class="brand">
          <div class="brand-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <span class="brand-text">AI Hiring</span>
        </div>
        
        <nav class="nav-menu">
          <a href="#solutions" class="nav-item">Solutions</a>
          <a href="#customers" class="nav-item">Customers</a>
          <a href="#resources" class="nav-item">Resources</a>
          <a href="#pricing" class="nav-item">Pricing</a>
        </nav>
        
        <div class="header-actions">
          <a routerLink="/auth/login" class="btn-text">Sign In</a>
          <a routerLink="/auth/register" class="btn-primary">Request Demo</a>
        </div>
      </div>
    </header>

    <!-- Hero Section - Lever Style -->
    <section class="hero">
      <div class="hero-container">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-text">AI-Powered Recruitment Platform</span>
          </div>
          
          <h1 class="hero-title">
            Recruitment Software for 
            <span class="highlight">Dynamic Hiring Teams</span>
          </h1>
          
          <p class="hero-subtitle">
            AI-powered recruitment platform brings sourcing, tracking, and relationship building 
            together to keep your momentum going strong, no matter how fast your company is changing.
          </p>
          
          <div class="hero-actions">
            <a routerLink="/auth/register" class="btn-primary btn-large">
              Get a Demo
            </a>
            <a routerLink="/auth/login" class="btn-secondary btn-large">
              Sign In
            </a>
          </div>
          
          <div class="trust-indicators">
            <span class="trust-text">Trusted by teams that don't mess around</span>
            <div class="company-logos">
              <div class="logo-placeholder" *ngFor="let i of [1,2,3,4,5]">
                <div class="logo-icon">{{ i }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="hero-visual">
          <div class="dashboard-mockup">
            <div class="mockup-header">
              <div class="mockup-controls">
                <span class="control"></span>
                <span class="control"></span>
                <span class="control"></span>
              </div>
              <div class="mockup-title">AI Hiring Dashboard</div>
            </div>
            <div class="mockup-content">
              <div class="pipeline-preview">
                <div class="pipeline-stage" *ngFor="let stage of pipelineStages">
                  <div class="stage-header">
                    <span class="stage-name">{{ stage.name }}</span>
                    <span class="stage-count">{{ stage.count }}</span>
                  </div>
                  <div class="stage-bar">
                    <div class="stage-fill" [style.width.%]="stage.percentage"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section - Clean Cards -->
    <section class="features">
      <div class="features-container">
        <div class="section-header">
          <h2 class="section-title">Why AI Hiring?</h2>
          <p class="section-subtitle">
            Adaptable, AI-powered hiring software that flexes as your team grows, 
            your roles change, and your priorities shift.
          </p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card" *ngFor="let feature of features">
            <div class="feature-icon">
              <i [class]="feature.icon"></i>
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pipeline Demo Section -->
    <section class="pipeline-demo">
      <div class="demo-container">
        <div class="demo-content">
          <h2 class="demo-title">Tour Our Award-Winning Recruitment Software</h2>
          <p class="demo-subtitle">
            Whether you have 100 reqs or just one hard-to-fill role, AI Hiring gives you 
            adaptable, AI-powered hiring software.
          </p>
          
          <div class="pipeline-visualization">
            <div class="pipeline-flow">
              <div class="flow-stage" *ngFor="let stage of detailedPipeline; let i = index">
                <div class="stage-circle">
                  <i [class]="stage.icon"></i>
                </div>
                <div class="stage-info">
                  <h4 class="stage-title">{{ stage.title }}</h4>
                  <p class="stage-desc">{{ stage.description }}</p>
                  <div class="stage-metrics">
                    <span class="metric">{{ stage.count }} candidates</span>
                    <span class="metric">{{ stage.conversion }}% conversion</span>
                  </div>
                </div>
                <div class="stage-connector" *ngIf="i < detailedPipeline.length - 1">
                  <div class="connector-line"></div>
                  <div class="connector-arrow">→</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
      <div class="cta-container">
        <div class="cta-content">
          <h2 class="cta-title">Ready to Power Your Hiring Momentum?</h2>
          <p class="cta-subtitle">
            AI Hiring's scalable, AI-powered hiring platform flexes as your team grows, 
            your roles change, and your priorities shift.
          </p>
          <div class="cta-actions">
            <a routerLink="/auth/register" class="btn-primary btn-large">
              Book a Demo
            </a>
            <a routerLink="/pricing" class="btn-secondary btn-large">
              View Pricing
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-content">
          <div class="footer-brand">
            <div class="brand">
              <div class="brand-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <span class="brand-text">AI Hiring</span>
            </div>
            <p class="footer-description">
              AI-powered recruitment platform for dynamic hiring teams.
            </p>
          </div>
          
          <div class="footer-links">
            <div class="link-group">
              <h4 class="link-title">Solutions</h4>
              <a href="#" class="link-item">Applicant Tracking</a>
              <a href="#" class="link-item">AI Interview Companion</a>
              <a href="#" class="link-item">Recruitment Analytics</a>
              <a href="#" class="link-item">Career Site Builder</a>
            </div>
            
            <div class="link-group">
              <h4 class="link-title">Resources</h4>
              <a href="#" class="link-item">Blog</a>
              <a href="#" class="link-item">Content Library</a>
              <a href="#" class="link-item">Events & Webinars</a>
              <a href="#" class="link-item">Partner Integrations</a>
            </div>
            
            <div class="link-group">
              <h4 class="link-title">Company</h4>
              <a href="#" class="link-item">About Us</a>
              <a href="#" class="link-item">Careers</a>
              <a href="#" class="link-item">Contact</a>
              <a href="#" class="link-item">Privacy Policy</a>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p class="copyright">© 2024 AI Hiring. All rights reserved.</p>
          <div class="social-links">
            <a href="#" class="social-link"><i class="fab fa-twitter"></i></a>
            <a href="#" class="social-link"><i class="fab fa-linkedin"></i></a>
            <a href="#" class="social-link"><i class="fab fa-github"></i></a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    /* Lever-Inspired Clean Design */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #2d3748;
    }

    /* Header */
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid #e2e8f0;
      z-index: 1000;
    }

    .header-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 72px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-icon {
      width: 32px;
      height: 32px;
      color: #10b981;
    }

    .brand-text {
      font-size: 20px;
      font-weight: 700;
      color: #1a202c;
    }

    .nav-menu {
      display: flex;
      gap: 32px;
    }

    .nav-item {
      color: #4a5568;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }

    .nav-item:hover {
      color: #10b981;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .btn-text {
      color: #4a5568;
      text-decoration: none;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 6px;
      transition: all 0.2s;
    }

    .btn-text:hover {
      background: #f7fafc;
      color: #10b981;
    }

    .btn-primary {
      background: #10b981;
      color: white;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      transition: all 0.2s;
      border: none;
      cursor: pointer;
    }

    .btn-primary:hover {
      background: #059669;
      transform: translateY(-1px);
    }

    .btn-secondary {
      background: transparent;
      color: #10b981;
      border: 2px solid #10b981;
      text-decoration: none;
      padding: 10px 22px;
      border-radius: 8px;
      font-weight: 600;
      transition: all 0.2s;
    }

    .btn-secondary:hover {
      background: #10b981;
      color: white;
    }

    .btn-large {
      padding: 16px 32px;
      font-size: 16px;
    }

    /* Hero Section */
    .hero {
      padding: 120px 0 80px;
      background: linear-gradient(135deg, #f8fffe 0%, #f0fdf4 100%);
    }

    .hero-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 80px;
      align-items: center;
    }

    .hero-badge {
      display: inline-block;
      background: #ecfdf5;
      color: #065f46;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 24px;
      border: 1px solid #a7f3d0;
    }

    .hero-title {
      font-size: 48px;
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: 24px;
      color: #1a202c;
    }

    .highlight {
      color: #10b981;
    }

    .hero-subtitle {
      font-size: 20px;
      color: #4a5568;
      margin-bottom: 32px;
      line-height: 1.6;
    }

    .hero-actions {
      display: flex;
      gap: 16px;
      margin-bottom: 48px;
    }

    .trust-indicators {
      text-align: left;
    }

    .trust-text {
      display: block;
      font-size: 14px;
      color: #718096;
      margin-bottom: 16px;
      font-weight: 500;
    }

    .company-logos {
      display: flex;
      gap: 16px;
    }

    .logo-placeholder {
      width: 48px;
      height: 48px;
      background: #f7fafc;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #e2e8f0;
    }

    .logo-icon {
      color: #a0aec0;
      font-weight: 600;
    }

    /* Dashboard Mockup */
    .dashboard-mockup {
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      border: 1px solid #e2e8f0;
    }

    .mockup-header {
      background: #f7fafc;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid #e2e8f0;
    }

    .mockup-controls {
      display: flex;
      gap: 6px;
    }

    .control {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #cbd5e0;
    }

    .control:first-child { background: #fc8181; }
    .control:nth-child(2) { background: #f6e05e; }
    .control:nth-child(3) { background: #68d391; }

    .mockup-title {
      font-size: 14px;
      font-weight: 600;
      color: #4a5568;
    }

    .mockup-content {
      padding: 24px;
    }

    .pipeline-preview {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .pipeline-stage {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .stage-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .stage-name {
      font-size: 14px;
      font-weight: 600;
      color: #2d3748;
    }

    .stage-count {
      font-size: 14px;
      color: #718096;
      background: #f7fafc;
      padding: 4px 8px;
      border-radius: 4px;
    }

    .stage-bar {
      height: 8px;
      background: #f1f5f9;
      border-radius: 4px;
      overflow: hidden;
    }

    .stage-fill {
      height: 100%;
      background: linear-gradient(90deg, #10b981, #059669);
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    /* Features Section */
    .features {
      padding: 80px 0;
      background: white;
    }

    .features-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .section-header {
      text-align: center;
      margin-bottom: 64px;
    }

    .section-title {
      font-size: 36px;
      font-weight: 700;
      color: #1a202c;
      margin-bottom: 16px;
    }

    .section-subtitle {
      font-size: 18px;
      color: #4a5568;
      max-width: 600px;
      margin: 0 auto;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 32px;
    }

    .feature-card {
      background: white;
      padding: 32px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      transition: all 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
      border-color: #10b981;
    }

    .feature-icon {
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, #10b981, #059669);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      color: white;
      font-size: 24px;
    }

    .feature-title {
      font-size: 20px;
      font-weight: 700;
      color: #1a202c;
      margin-bottom: 12px;
    }

    .feature-description {
      color: #4a5568;
      line-height: 1.6;
    }

    /* Pipeline Demo */
    .pipeline-demo {
      padding: 80px 0;
      background: #f8fffe;
    }

    .demo-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .demo-content {
      text-align: center;
    }

    .demo-title {
      font-size: 36px;
      font-weight: 700;
      color: #1a202c;
      margin-bottom: 16px;
    }

    .demo-subtitle {
      font-size: 18px;
      color: #4a5568;
      margin-bottom: 48px;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .pipeline-visualization {
      background: white;
      border-radius: 16px;
      padding: 48px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
      border: 1px solid #e2e8f0;
    }

    .pipeline-flow {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 24px;
    }

    .flow-stage {
      flex: 1;
      text-align: center;
      position: relative;
    }

    .stage-circle {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #10b981, #059669);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      color: white;
      font-size: 24px;
    }

    .stage-info {
      text-align: center;
    }

    .stage-title {
      font-size: 16px;
      font-weight: 700;
      color: #1a202c;
      margin-bottom: 8px;
    }

    .stage-desc {
      font-size: 14px;
      color: #4a5568;
      margin-bottom: 12px;
    }

    .stage-metrics {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .metric {
      font-size: 12px;
      color: #718096;
      background: #f7fafc;
      padding: 4px 8px;
      border-radius: 4px;
    }

    .stage-connector {
      position: absolute;
      top: 40px;
      right: -24px;
      width: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .connector-line {
      width: 100%;
      height: 2px;
      background: #e2e8f0;
    }

    .connector-arrow {
      position: absolute;
      color: #10b981;
      font-size: 20px;
      font-weight: bold;
    }

    /* CTA Section */
    .cta {
      padding: 80px 0;
      background: #1a202c;
    }

    .cta-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .cta-content {
      text-align: center;
    }

    .cta-title {
      font-size: 36px;
      font-weight: 700;
      color: white;
      margin-bottom: 16px;
    }

    .cta-subtitle {
      font-size: 18px;
      color: #a0aec0;
      margin-bottom: 32px;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .cta-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
    }

    /* Footer */
    .footer {
      background: #2d3748;
      padding: 48px 0 24px;
    }

    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .footer-content {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 48px;
      margin-bottom: 32px;
    }

    .footer-brand .brand {
      margin-bottom: 16px;
    }

    .footer-brand .brand-text {
      color: white;
    }

    .footer-description {
      color: #a0aec0;
      line-height: 1.6;
    }

    .footer-links {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 32px;
    }

    .link-title {
      font-size: 16px;
      font-weight: 700;
      color: white;
      margin-bottom: 16px;
    }

    .link-item {
      display: block;
      color: #a0aec0;
      text-decoration: none;
      margin-bottom: 8px;
      transition: color 0.2s;
    }

    .link-item:hover {
      color: #10b981;
    }

    .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 24px;
      border-top: 1px solid #4a5568;
    }

    .copyright {
      color: #a0aec0;
    }

    .social-links {
      display: flex;
      gap: 16px;
    }

    .social-link {
      color: #a0aec0;
      font-size: 18px;
      transition: color 0.2s;
    }

    .social-link:hover {
      color: #10b981;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .header-container {
        padding: 0 16px;
      }

      .nav-menu {
        display: none;
      }

      .hero-container {
        grid-template-columns: 1fr;
        gap: 48px;
        text-align: center;
      }

      .hero-title {
        font-size: 36px;
      }

      .hero-actions {
        flex-direction: column;
        align-items: center;
      }

      .pipeline-flow {
        flex-direction: column;
        gap: 32px;
      }

      .stage-connector {
        display: none;
      }

      .footer-content {
        grid-template-columns: 1fr;
        gap: 32px;
      }

      .footer-links {
        grid-template-columns: 1fr;
        gap: 24px;
      }

      .footer-bottom {
        flex-direction: column;
        gap: 16px;
        text-align: center;
      }
    }
  `]
})
export class LandingComponent implements OnInit, OnDestroy {
  pipelineStages = [
    { name: 'Applied', count: 247, percentage: 85 },
    { name: 'Screening', count: 156, percentage: 65 },
    { name: 'Interview', count: 89, percentage: 45 },
    { name: 'Offer', count: 34, percentage: 25 },
    { name: 'Hired', count: 12, percentage: 15 }
  ];

  features = [
    {
      icon: 'fas fa-robot',
      title: 'AI-Powered Matching',
      description: 'Advanced algorithms match candidates with perfect job opportunities based on skills, experience, and cultural fit.'
    },
    {
      icon: 'fas fa-chart-line',
      title: 'Real-time Analytics',
      description: 'Get insights into your hiring pipeline with comprehensive analytics and reporting tools.'
    },
    {
      icon: 'fas fa-users',
      title: 'Collaborative Hiring',
      description: 'Enable your entire team to collaborate seamlessly throughout the hiring process.'
    },
    {
      icon: 'fas fa-mobile-alt',
      title: 'Mobile Optimized',
      description: 'Access your hiring platform anywhere, anytime with our fully responsive mobile interface.'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Secure & Compliant',
      description: 'Enterprise-grade security with full compliance to data protection regulations.'
    },
    {
      icon: 'fas fa-rocket',
      title: 'Fast Implementation',
      description: 'Get up and running in minutes with our intuitive setup and onboarding process.'
    }
  ];

  detailedPipeline = [
    {
      icon: 'fas fa-file-alt',
      title: 'Applied',
      description: 'Candidates submit applications',
      count: 247,
      conversion: 85
    },
    {
      icon: 'fas fa-search',
      title: 'Screening',
      description: 'AI-powered initial screening',
      count: 156,
      conversion: 65
    },
    {
      icon: 'fas fa-video',
      title: 'Interview',
      description: 'Video and in-person interviews',
      count: 89,
      conversion: 45
    },
    {
      icon: 'fas fa-handshake',
      title: 'Offer',
      description: 'Job offers extended',
      count: 34,
      conversion: 25
    },
    {
      icon: 'fas fa-user-check',
      title: 'Hired',
      description: 'Successfully hired candidates',
      count: 12,
      conversion: 15
    }
  ];

  ngOnInit() {
    // Component initialization
  }

  ngOnDestroy() {
    // Cleanup
  }
}
