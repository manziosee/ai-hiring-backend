import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Integration {
  name: string;
  description: string;
  icon: string;
  category: string;
  popular?: boolean;
  comingSoon?: boolean;
}

@Component({
  selector: 'app-integrations',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="integrations-container">
      <!-- Header -->
      <div class="integrations-header">
        <div class="header-content">
          <nav class="breadcrumb">
            <a routerLink="/">Home</a>
            <i class="fas fa-chevron-right"></i>
            <span>Integrations</span>
          </nav>
          <h1>Connect Your Favorite Tools</h1>
          <p>Seamlessly integrate AI Hiring with your existing workflow and tools to maximize efficiency.</p>
        </div>
      </div>

      <!-- Categories Filter -->
      <section class="filter-section">
        <div class="section-content">
          <div class="filter-tabs">
            <button 
              class="filter-tab"
              [class.active]="selectedCategory === 'all'"
              (click)="filterByCategory('all')">
              All Integrations
            </button>
            <button 
              class="filter-tab"
              [class.active]="selectedCategory === category"
              *ngFor="let category of categories"
              (click)="filterByCategory(category)">
              {{ category }}
            </button>
          </div>
        </div>
      </section>

      <!-- Integrations Grid -->
      <section class="integrations-section">
        <div class="section-content">
          <div class="integrations-grid">
            <div class="integration-card" 
                 *ngFor="let integration of filteredIntegrations"
                 [class.popular]="integration.popular"
                 [class.coming-soon]="integration.comingSoon">
              
              <div class="popular-badge" *ngIf="integration.popular">
                <i class="fas fa-star"></i>
                Popular
              </div>
              
              <div class="coming-soon-badge" *ngIf="integration.comingSoon">
                Coming Soon
              </div>
              
              <div class="integration-icon">
                <i [class]="integration.icon"></i>
              </div>
              
              <div class="integration-info">
                <h3>{{ integration.name }}</h3>
                <p>{{ integration.description }}</p>
                <div class="integration-category">{{ integration.category }}</div>
              </div>
              
              <div class="integration-action">
                <button class="connect-btn" [disabled]="integration.comingSoon">
                  <span *ngIf="!integration.comingSoon">
                    <i class="fas fa-plug"></i>
                    Connect
                  </span>
                  <span *ngIf="integration.comingSoon">
                    <i class="fas fa-clock"></i>
                    Coming Soon
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- API Section -->
      <section class="api-section">
        <div class="section-content">
          <div class="api-content">
            <div class="api-info">
              <h2>Build Custom Integrations</h2>
              <p>Use our powerful API to create custom integrations with your existing systems and workflows.</p>
              
              <div class="api-features">
                <div class="api-feature">
                  <i class="fas fa-code"></i>
                  <div>
                    <h4>RESTful API</h4>
                    <p>Simple, well-documented REST API with comprehensive endpoints</p>
                  </div>
                </div>
                
                <div class="api-feature">
                  <i class="fas fa-shield-alt"></i>
                  <div>
                    <h4>Secure Authentication</h4>
                    <p>OAuth 2.0 and API key authentication with rate limiting</p>
                  </div>
                </div>
                
                <div class="api-feature">
                  <i class="fas fa-sync"></i>
                  <div>
                    <h4>Real-time Webhooks</h4>
                    <p>Get instant notifications when events occur in your hiring pipeline</p>
                  </div>
                </div>
                
                <div class="api-feature">
                  <i class="fas fa-book"></i>
                  <div>
                    <h4>Comprehensive Docs</h4>
                    <p>Detailed documentation with code examples and SDKs</p>
                  </div>
                </div>
              </div>
              
              <div class="api-actions">
                <button class="api-btn primary" routerLink="/api-docs">
                  <i class="fas fa-book"></i>
                  View API Docs
                </button>
                <button class="api-btn secondary">
                  <i class="fas fa-key"></i>
                  Get API Key
                </button>
              </div>
            </div>
            
            <div class="api-visual">
              <div class="code-example">
                <div class="code-header">
                  <div class="code-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span>API Example</span>
                </div>
                <pre><code>curl -X POST \\
  https://api.aihiring.com/v1/jobs \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Senior Developer",
    "description": "We are looking for...",
    "requirements": ["React", "Node.js"],
    "location": "Remote"
  }'</code></pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Request Integration -->
      <section class="request-section">
        <div class="section-content">
          <div class="request-content">
            <h2>Don't See Your Tool?</h2>
            <p>We're constantly adding new integrations. Let us know what tools you'd like to see integrated with AI Hiring.</p>
            
            <div class="request-form">
              <div class="form-group">
                <input 
                  type="text" 
                  placeholder="Tool name (e.g., Slack, Jira, etc.)"
                  [(ngModel)]="requestedTool"
                  class="request-input"
                >
              </div>
              <button class="request-btn" (click)="requestIntegration()">
                <i class="fas fa-paper-plane"></i>
                Request Integration
              </button>
            </div>
            
            <div class="success-message" *ngIf="requestSubmitted">
              <i class="fas fa-check-circle"></i>
              Thank you! We've received your integration request.
            </div>
          </div>
        </div>
      </section>

      <!-- Benefits Section -->
      <section class="benefits-section">
        <div class="section-content">
          <div class="section-header">
            <h2>Why Use Integrations?</h2>
            <p>Streamline your hiring process by connecting all your tools</p>
          </div>
          
          <div class="benefits-grid">
            <div class="benefit-card">
              <div class="benefit-icon">
                <i class="fas fa-clock"></i>
              </div>
              <h3>Save Time</h3>
              <p>Eliminate manual data entry and reduce context switching between tools</p>
            </div>
            
            <div class="benefit-card">
              <div class="benefit-icon">
                <i class="fas fa-sync-alt"></i>
              </div>
              <h3>Stay Synchronized</h3>
              <p>Keep all your hiring data in sync across all platforms automatically</p>
            </div>
            
            <div class="benefit-card">
              <div class="benefit-icon">
                <i class="fas fa-chart-line"></i>
              </div>
              <h3>Better Insights</h3>
              <p>Get comprehensive analytics by combining data from all your tools</p>
            </div>
            
            <div class="benefit-card">
              <div class="benefit-icon">
                <i class="fas fa-users"></i>
              </div>
              <h3>Team Collaboration</h3>
              <p>Enable seamless collaboration across your entire hiring team</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .integrations-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8fffe 0%, #f0fdf4 100%);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    /* Header */
    .integrations-header {
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
      transition: color 0.3s ease;
    }

    .breadcrumb a:hover {
      color: white;
    }

    .header-content h1 {
      font-size: 3rem;
      font-weight: 800;
      margin-bottom: 1rem;
    }

    .header-content p {
      font-size: 1.25rem;
      opacity: 0.9;
      max-width: 600px;
      margin: 0 auto;
    }

    /* Common Section Styles */
    .section-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .section-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .section-header h2 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 1rem;
    }

    .section-header p {
      font-size: 1.125rem;
      color: #6b7280;
    }

    /* Filter Section */
    .filter-section {
      padding: 2rem 0;
      background: white;
      border-bottom: 1px solid rgba(16, 185, 129, 0.1);
    }

    .filter-tabs {
      display: flex;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .filter-tab {
      background: transparent;
      border: 2px solid rgba(16, 185, 129, 0.2);
      color: #6b7280;
      padding: 0.75rem 1.5rem;
      border-radius: 25px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .filter-tab.active,
    .filter-tab:hover {
      background: linear-gradient(45deg, #10b981, #059669);
      color: white;
      border-color: transparent;
    }

    /* Integrations Section */
    .integrations-section {
      padding: 4rem 0;
    }

    .integrations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 2rem;
    }

    .integration-card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.1);
      position: relative;
      transition: all 0.3s ease;
    }

    .integration-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
    }

    .integration-card.popular {
      border-color: #10b981;
    }

    .integration-card.coming-soon {
      opacity: 0.7;
    }

    .popular-badge,
    .coming-soon-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .popular-badge {
      background: linear-gradient(45deg, #10b981, #059669);
      color: white;
    }

    .coming-soon-badge {
      background: #f3f4f6;
      color: #6b7280;
    }

    .integration-icon {
      width: 80px;
      height: 80px;
      background: rgba(16, 185, 129, 0.1);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.5rem;
      font-size: 2rem;
      color: #059669;
    }

    .integration-info h3 {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 0.75rem;
    }

    .integration-info p {
      color: #6b7280;
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    .integration-category {
      background: rgba(16, 185, 129, 0.1);
      color: #059669;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      display: inline-block;
      margin-bottom: 1.5rem;
    }

    .connect-btn {
      background: linear-gradient(45deg, #10b981, #059669);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
      justify-content: center;
    }

    .connect-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }

    .connect-btn:disabled {
      background: #e5e7eb;
      color: #9ca3af;
      cursor: not-allowed;
    }

    /* API Section */
    .api-section {
      padding: 4rem 0;
      background: rgba(16, 185, 129, 0.05);
    }

    .api-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
    }

    .api-info h2 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 1rem;
    }

    .api-info p {
      color: #6b7280;
      font-size: 1.125rem;
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    .api-features {
      display: grid;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .api-feature {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
    }

    .api-feature i {
      color: #10b981;
      font-size: 1.5rem;
      margin-top: 0.25rem;
      flex-shrink: 0;
    }

    .api-feature h4 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 0.5rem;
    }

    .api-feature p {
      color: #6b7280;
      font-size: 0.875rem;
      margin: 0;
    }

    .api-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .api-btn {
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border: none;
    }

    .api-btn.primary {
      background: linear-gradient(45deg, #10b981, #059669);
      color: white;
    }

    .api-btn.secondary {
      background: white;
      color: #059669;
      border: 2px solid #10b981;
    }

    .api-btn:hover {
      transform: translateY(-2px);
    }

    .api-btn.primary:hover {
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }

    .api-btn.secondary:hover {
      background: #10b981;
      color: white;
    }

    /* Code Example */
    .code-example {
      background: #1f2937;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    }

    .code-header {
      background: #374151;
      padding: 1rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #d1d5db;
      font-size: 0.875rem;
    }

    .code-dots {
      display: flex;
      gap: 0.5rem;
    }

    .code-dots span {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #6b7280;
    }

    .code-dots span:first-child {
      background: #ef4444;
    }

    .code-dots span:nth-child(2) {
      background: #f59e0b;
    }

    .code-dots span:last-child {
      background: #10b981;
    }

    .code-example pre {
      padding: 1.5rem;
      margin: 0;
      color: #f9fafb;
      font-family: 'Monaco', 'Menlo', monospace;
      font-size: 0.875rem;
      line-height: 1.6;
      overflow-x: auto;
    }

    /* Request Section */
    .request-section {
      padding: 4rem 0;
    }

    .request-content {
      text-align: center;
      max-width: 600px;
      margin: 0 auto;
    }

    .request-content h2 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 1rem;
    }

    .request-content p {
      color: #6b7280;
      font-size: 1.125rem;
      margin-bottom: 2rem;
    }

    .request-form {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .form-group {
      flex: 1;
    }

    .request-input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
    }

    .request-input:focus {
      outline: none;
      border-color: #10b981;
    }

    .request-btn {
      background: linear-gradient(45deg, #10b981, #059669);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      white-space: nowrap;
    }

    .request-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }

    .success-message {
      background: #dcfce7;
      color: #166534;
      padding: 1rem;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    /* Benefits Section */
    .benefits-section {
      padding: 4rem 0;
      background: rgba(16, 185, 129, 0.05);
    }

    .benefits-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
    }

    .benefit-card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      text-align: center;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.1);
      transition: all 0.3s ease;
    }

    .benefit-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
    }

    .benefit-icon {
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

    .benefit-card h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 1rem;
    }

    .benefit-card p {
      color: #6b7280;
      line-height: 1.6;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .api-content {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
    }

    @media (max-width: 768px) {
      .header-content h1 {
        font-size: 2.5rem;
      }

      .integrations-grid {
        grid-template-columns: 1fr;
      }

      .filter-tabs {
        flex-direction: column;
        align-items: center;
      }

      .request-form {
        flex-direction: column;
      }

      .api-actions {
        flex-direction: column;
      }

      .api-btn {
        justify-content: center;
      }
    }
  `]
})
export class IntegrationsComponent implements OnInit {
  selectedCategory = 'all';
  requestedTool = '';
  requestSubmitted = false;

  categories = ['ATS', 'Communication', 'Analytics', 'CRM', 'HRIS', 'Development'];

  integrations: Integration[] = [
    {
      name: 'Slack',
      description: 'Get real-time notifications about new applications and hiring updates',
      icon: 'fab fa-slack',
      category: 'Communication',
      popular: true
    },
    {
      name: 'Microsoft Teams',
      description: 'Collaborate with your team and receive hiring notifications',
      icon: 'fab fa-microsoft',
      category: 'Communication',
      popular: true
    },
    {
      name: 'Greenhouse',
      description: 'Sync candidates and jobs with your existing ATS workflow',
      icon: 'fas fa-seedling',
      category: 'ATS',
      popular: true
    },
    {
      name: 'Workday',
      description: 'Integrate with your HRIS for seamless employee onboarding',
      icon: 'fas fa-briefcase',
      category: 'HRIS'
    },
    {
      name: 'BambooHR',
      description: 'Connect your HR management system with AI Hiring',
      icon: 'fas fa-users',
      category: 'HRIS'
    },
    {
      name: 'Salesforce',
      description: 'Manage candidate relationships in your existing CRM',
      icon: 'fab fa-salesforce',
      category: 'CRM'
    },
    {
      name: 'Google Analytics',
      description: 'Track hiring metrics and candidate source effectiveness',
      icon: 'fab fa-google',
      category: 'Analytics'
    },
    {
      name: 'GitHub',
      description: 'Evaluate developer candidates based on their code contributions',
      icon: 'fab fa-github',
      category: 'Development'
    },
    {
      name: 'LinkedIn Recruiter',
      description: 'Import candidates directly from LinkedIn Recruiter',
      icon: 'fab fa-linkedin',
      category: 'ATS'
    },
    {
      name: 'Zoom',
      description: 'Schedule and conduct video interviews seamlessly',
      icon: 'fas fa-video',
      category: 'Communication',
      comingSoon: true
    },
    {
      name: 'Jira',
      description: 'Create hiring tasks and track progress in your project management tool',
      icon: 'fab fa-jira',
      category: 'Development',
      comingSoon: true
    },
    {
      name: 'HubSpot',
      description: 'Manage candidate relationships and track hiring pipeline',
      icon: 'fab fa-hubspot',
      category: 'CRM',
      comingSoon: true
    }
  ];

  filteredIntegrations: Integration[] = [];

  ngOnInit(): void {
    this.filteredIntegrations = this.integrations;
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    if (category === 'all') {
      this.filteredIntegrations = this.integrations;
    } else {
      this.filteredIntegrations = this.integrations.filter(
        integration => integration.category === category
      );
    }
  }

  requestIntegration(): void {
    if (this.requestedTool.trim()) {
      this.requestSubmitted = true;
      this.requestedTool = '';
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        this.requestSubmitted = false;
      }, 5000);
    }
  }
}
