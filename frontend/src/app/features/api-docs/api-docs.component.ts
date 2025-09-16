import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface APIEndpoint {
  method: string;
  path: string;
  description: string;
  parameters?: any[];
  response?: string;
  example?: string;
}

interface APISection {
  title: string;
  description: string;
  endpoints: APIEndpoint[];
}

@Component({
  selector: 'app-api-docs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="api-docs-container">
      <!-- Header -->
      <div class="api-header">
        <div class="header-content">
          <nav class="breadcrumb">
            <a routerLink="/">Home</a>
            <i class="fas fa-chevron-right"></i>
            <span>API Documentation</span>
          </nav>
          <h1>API Documentation</h1>
          <p>Complete reference for the AI Hiring Platform API</p>
          
          <div class="api-info">
            <div class="info-card">
              <h3>Base URL</h3>
              <code>https://api.aihiring.com/v1</code>
            </div>
            <div class="info-card">
              <h3>Authentication</h3>
              <code>Bearer Token</code>
            </div>
            <div class="info-card">
              <h3>Rate Limit</h3>
              <code>1000 requests/hour</code>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="api-nav">
        <div class="nav-content">
          <div class="nav-links">
            <a href="#authentication" class="nav-link">Authentication</a>
            <a href="#jobs" class="nav-link">Jobs</a>
            <a href="#applications" class="nav-link">Applications</a>
            <a href="#screening" class="nav-link">AI Screening</a>
            <a href="#users" class="nav-link">Users</a>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="api-content">
        <div class="content-wrapper">
          <!-- Getting Started -->
          <section class="api-section" id="getting-started">
            <h2>Getting Started</h2>
            <p>Welcome to the AI Hiring Platform API. This RESTful API allows you to integrate our AI-powered recruitment features into your applications.</p>
            
            <div class="code-example">
              <h4>Quick Start</h4>
              <pre><code>curl -H "Authorization: Bearer YOUR_API_KEY" \\
     -H "Content-Type: application/json" \\
     https://api.aihiring.com/v1/jobs</code></pre>
            </div>
          </section>

          <!-- Authentication -->
          <section class="api-section" id="authentication">
            <h2>Authentication</h2>
            <p>All API requests require authentication using a Bearer token in the Authorization header.</p>
            
            <div class="endpoint-card">
              <div class="endpoint-header">
                <span class="method post">POST</span>
                <span class="path">/auth/login</span>
              </div>
              <p>Authenticate and receive an access token</p>
              
              <div class="code-example">
                <h5>Request Body</h5>
                <pre><code>{
  "email": "user@example.com",
  "password": "your_password"
}</code></pre>
              </div>
              
              <div class="code-example">
                <h5>Response</h5>
                <pre><code>{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600,
  "user": {
    "id": "123",
    "email": "user@example.com",
    "role": "RECRUITER"
  }
}</code></pre>
              </div>
            </div>
          </section>

          <!-- Jobs API -->
          <section class="api-section" id="jobs">
            <h2>Jobs API</h2>
            <p>Manage job postings and retrieve job information.</p>
            
            <div class="endpoint-card">
              <div class="endpoint-header">
                <span class="method get">GET</span>
                <span class="path">/jobs</span>
              </div>
              <p>Retrieve all job postings</p>
              
              <div class="parameters">
                <h5>Query Parameters</h5>
                <div class="param-list">
                  <div class="param">
                    <code>page</code> <span class="optional">optional</span>
                    <p>Page number (default: 1)</p>
                  </div>
                  <div class="param">
                    <code>limit</code> <span class="optional">optional</span>
                    <p>Items per page (default: 20)</p>
                  </div>
                  <div class="param">
                    <code>skills</code> <span class="optional">optional</span>
                    <p>Filter by required skills</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="endpoint-card">
              <div class="endpoint-header">
                <span class="method post">POST</span>
                <span class="path">/jobs</span>
              </div>
              <p>Create a new job posting</p>
              
              <div class="code-example">
                <h5>Request Body</h5>
                <pre><code>{
  "title": "Senior Frontend Developer",
  "description": "We are looking for an experienced frontend developer...",
  "requirements": ["React", "TypeScript", "5+ years experience"],
  "location": "San Francisco, CA",
  "salary_min": 120000,
  "salary_max": 180000,
  "employment_type": "FULL_TIME"
}</code></pre>
              </div>
            </div>
          </section>

          <!-- Applications API -->
          <section class="api-section" id="applications">
            <h2>Applications API</h2>
            <p>Manage job applications and track application status.</p>
            
            <div class="endpoint-card">
              <div class="endpoint-header">
                <span class="method post">POST</span>
                <span class="path">/applications</span>
              </div>
              <p>Submit a job application</p>
              
              <div class="code-example">
                <h5>Request Body</h5>
                <pre><code>{
  "job_id": "job_123",
  "cover_letter": "I am excited to apply for this position...",
  "resume_url": "https://example.com/resume.pdf"
}</code></pre>
              </div>
            </div>

            <div class="endpoint-card">
              <div class="endpoint-header">
                <span class="method get">GET</span>
                <span class="path">/applications/{id}</span>
              </div>
              <p>Get application details</p>
            </div>
          </section>

          <!-- AI Screening API -->
          <section class="api-section" id="screening">
            <h2>AI Screening API</h2>
            <p>Use our AI-powered screening to evaluate candidates.</p>
            
            <div class="endpoint-card">
              <div class="endpoint-header">
                <span class="method post">POST</span>
                <span class="path">/screening/run</span>
              </div>
              <p>Run AI screening on an application</p>
              
              <div class="code-example">
                <h5>Request Body</h5>
                <pre><code>{
  "application_id": "app_123",
  "criteria": {
    "technical_skills": 0.8,
    "experience_match": 0.7,
    "cultural_fit": 0.6
  }
}</code></pre>
              </div>
              
              <div class="code-example">
                <h5>Response</h5>
                <pre><code>{
  "screening_id": "screen_456",
  "overall_score": 0.85,
  "breakdown": {
    "technical_skills": 0.9,
    "experience_match": 0.8,
    "cultural_fit": 0.85
  },
  "recommendations": [
    "Strong technical background in required technologies",
    "Experience level matches job requirements well"
  ],
  "status": "COMPLETED"
}</code></pre>
              </div>
            </div>
          </section>

          <!-- Error Handling -->
          <section class="api-section" id="errors">
            <h2>Error Handling</h2>
            <p>The API uses conventional HTTP response codes to indicate success or failure.</p>
            
            <div class="error-codes">
              <div class="error-code">
                <span class="code">200</span>
                <span class="description">OK - Request successful</span>
              </div>
              <div class="error-code">
                <span class="code">400</span>
                <span class="description">Bad Request - Invalid request parameters</span>
              </div>
              <div class="error-code">
                <span class="code">401</span>
                <span class="description">Unauthorized - Invalid or missing authentication</span>
              </div>
              <div class="error-code">
                <span class="code">403</span>
                <span class="description">Forbidden - Insufficient permissions</span>
              </div>
              <div class="error-code">
                <span class="code">404</span>
                <span class="description">Not Found - Resource not found</span>
              </div>
              <div class="error-code">
                <span class="code">429</span>
                <span class="description">Too Many Requests - Rate limit exceeded</span>
              </div>
              <div class="error-code">
                <span class="code">500</span>
                <span class="description">Internal Server Error - Server error</span>
              </div>
            </div>
          </section>

          <!-- SDKs -->
          <section class="api-section" id="sdks">
            <h2>SDKs & Libraries</h2>
            <p>Official SDKs and community libraries to help you integrate faster.</p>
            
            <div class="sdk-grid">
              <div class="sdk-card">
                <div class="sdk-icon">
                  <i class="fab fa-js-square"></i>
                </div>
                <h4>JavaScript/Node.js</h4>
                <p>Official JavaScript SDK with TypeScript support</p>
                <div class="sdk-install">
                  <code>npm install @aihiring/sdk</code>
                </div>
              </div>
              
              <div class="sdk-card">
                <div class="sdk-icon">
                  <i class="fab fa-python"></i>
                </div>
                <h4>Python</h4>
                <p>Python SDK with async support</p>
                <div class="sdk-install">
                  <code>pip install aihiring-python</code>
                </div>
              </div>
              
              <div class="sdk-card">
                <div class="sdk-icon">
                  <i class="fab fa-php"></i>
                </div>
                <h4>PHP</h4>
                <p>PHP SDK for Laravel and other frameworks</p>
                <div class="sdk-install">
                  <code>composer require aihiring/php-sdk</code>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .api-docs-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8fffe 0%, #f0fdf4 100%);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    /* Header */
    .api-header {
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
      padding: 120px 0 60px;
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
      margin-bottom: 3rem;
    }

    .api-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .info-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      padding: 1.5rem;
      text-align: center;
    }

    .info-card h3 {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      opacity: 0.9;
    }

    .info-card code {
      background: rgba(255, 255, 255, 0.2);
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-family: 'Monaco', 'Menlo', monospace;
      font-size: 0.875rem;
    }

    /* Navigation */
    .api-nav {
      background: white;
      border-bottom: 1px solid rgba(16, 185, 129, 0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .nav-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .nav-links {
      display: flex;
      gap: 2rem;
      overflow-x: auto;
      padding: 1rem 0;
    }

    .nav-link {
      color: #6b7280;
      text-decoration: none;
      font-weight: 600;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      transition: all 0.3s ease;
      white-space: nowrap;
    }

    .nav-link:hover {
      color: #059669;
      background: rgba(16, 185, 129, 0.1);
    }

    /* Content */
    .api-content {
      padding: 4rem 0;
    }

    .content-wrapper {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .api-section {
      margin-bottom: 4rem;
    }

    .api-section h2 {
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #10b981;
    }

    .api-section p {
      color: #6b7280;
      font-size: 1.125rem;
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    /* Endpoint Cards */
    .endpoint-card {
      background: white;
      border-radius: 12px;
      border: 1px solid rgba(16, 185, 129, 0.1);
      margin-bottom: 2rem;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    }

    .endpoint-header {
      background: rgba(16, 185, 129, 0.05);
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      border-bottom: 1px solid rgba(16, 185, 129, 0.1);
    }

    .method {
      padding: 0.25rem 0.75rem;
      border-radius: 6px;
      font-weight: 700;
      font-size: 0.875rem;
      text-transform: uppercase;
    }

    .method.get {
      background: #dbeafe;
      color: #1d4ed8;
    }

    .method.post {
      background: #dcfce7;
      color: #166534;
    }

    .method.put {
      background: #fef3c7;
      color: #92400e;
    }

    .method.delete {
      background: #fee2e2;
      color: #dc2626;
    }

    .path {
      font-family: 'Monaco', 'Menlo', monospace;
      font-weight: 600;
      color: #1f2937;
    }

    .endpoint-card p {
      padding: 0 1.5rem;
      margin: 1rem 0;
    }

    /* Code Examples */
    .code-example {
      margin: 1.5rem 0;
      padding: 0 1.5rem;
    }

    .code-example h4,
    .code-example h5 {
      color: #1f2937;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .code-example pre {
      background: #1f2937;
      color: #f9fafb;
      padding: 1.5rem;
      border-radius: 8px;
      overflow-x: auto;
      font-family: 'Monaco', 'Menlo', monospace;
      font-size: 0.875rem;
      line-height: 1.5;
    }

    /* Parameters */
    .parameters {
      padding: 0 1.5rem 1.5rem;
    }

    .parameters h5 {
      color: #1f2937;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .param-list {
      space-y: 1rem;
    }

    .param {
      padding: 1rem;
      background: rgba(16, 185, 129, 0.05);
      border-radius: 8px;
      margin-bottom: 1rem;
    }

    .param code {
      background: rgba(16, 185, 129, 0.1);
      color: #059669;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-weight: 600;
      margin-right: 0.5rem;
    }

    .optional {
      background: #f3f4f6;
      color: #6b7280;
      padding: 0.125rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .param p {
      margin: 0.5rem 0 0 0;
      color: #6b7280;
      font-size: 0.875rem;
    }

    /* Error Codes */
    .error-codes {
      background: white;
      border-radius: 12px;
      border: 1px solid rgba(16, 185, 129, 0.1);
      overflow: hidden;
    }

    .error-code {
      display: flex;
      align-items: center;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid rgba(16, 185, 129, 0.1);
    }

    .error-code:last-child {
      border-bottom: none;
    }

    .error-code .code {
      font-family: 'Monaco', 'Menlo', monospace;
      font-weight: 700;
      color: #059669;
      margin-right: 1rem;
      min-width: 60px;
    }

    .error-code .description {
      color: #6b7280;
    }

    /* SDKs */
    .sdk-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .sdk-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      border: 1px solid rgba(16, 185, 129, 0.1);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
    }

    .sdk-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    }

    .sdk-icon {
      font-size: 3rem;
      color: #059669;
      margin-bottom: 1rem;
    }

    .sdk-card h4 {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 0.5rem;
    }

    .sdk-card p {
      color: #6b7280;
      margin-bottom: 1.5rem;
      font-size: 1rem;
    }

    .sdk-install {
      background: #1f2937;
      color: #f9fafb;
      padding: 0.75rem 1rem;
      border-radius: 6px;
      font-family: 'Monaco', 'Menlo', monospace;
      font-size: 0.875rem;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .header-content h1 {
        font-size: 2.5rem;
      }

      .api-info {
        grid-template-columns: 1fr;
      }

      .nav-links {
        gap: 1rem;
      }

      .endpoint-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .sdk-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ApiDocsComponent implements OnInit {
  ngOnInit(): void {
    // Component initialization
  }
}
