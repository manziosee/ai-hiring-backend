import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  expanded?: boolean;
}

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="help-container">
      <!-- Header -->
      <div class="help-header">
        <div class="header-content">
          <nav class="breadcrumb">
            <a routerLink="/">Home</a>
            <i class="fas fa-chevron-right"></i>
            <span>Help Center</span>
          </nav>
          <h1>How can we help you?</h1>
          <p>Find answers to common questions and get the support you need</p>
          
          <!-- Search Bar -->
          <div class="search-container">
            <div class="search-box">
              <i class="fas fa-search"></i>
              <input 
                type="text" 
                placeholder="Search for help articles..."
                [(ngModel)]="searchQuery"
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <section class="quick-actions-section">
        <div class="section-content">
          <div class="quick-actions-grid">
            <div class="action-card">
              <div class="action-icon">
                <i class="fas fa-rocket"></i>
              </div>
              <h3>Getting Started</h3>
              <p>New to AI Hiring? Start here for a quick overview</p>
            </div>
            
            <div class="action-card">
              <div class="action-icon">
                <i class="fas fa-video"></i>
              </div>
              <h3>Video Tutorials</h3>
              <p>Watch step-by-step video guides</p>
            </div>
            
            <div class="action-card">
              <div class="action-icon">
                <i class="fas fa-headset"></i>
              </div>
              <h3>Contact Support</h3>
              <p>Get personalized help from our team</p>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="faq-section">
        <div class="section-content">
          <div class="section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Quick answers to the most common questions</p>
          </div>
          
          <div class="faq-list">
            <div class="faq-item" *ngFor="let faq of faqs">
              <div class="faq-question" (click)="toggleFAQ(faq)">
                <h4>{{ faq.question }}</h4>
                <div class="faq-toggle">
                  <i class="fas" [class.fa-plus]="!faq.expanded" [class.fa-minus]="faq.expanded"></i>
                </div>
              </div>
              <div class="faq-answer" [class.expanded]="faq.expanded">
                <div class="answer-content">
                  <p [innerHTML]="faq.answer"></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .help-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8fffe 0%, #f0fdf4 100%);
      font-family: 'Inter', sans-serif;
    }

    .help-header {
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

    .search-container {
      max-width: 600px;
      margin: 2rem auto 0;
    }

    .search-box {
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50px;
      padding: 1rem 1.5rem;
    }

    .search-box input {
      flex: 1;
      background: none;
      border: none;
      color: white;
      font-size: 1rem;
      outline: none;
      margin-left: 1rem;
    }

    .search-box input::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }

    .section-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .quick-actions-section {
      padding: 4rem 0;
    }

    .quick-actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .action-card {
      background: white;
      border-radius: 20px;
      padding: 2rem;
      text-align: center;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.1);
      transition: all 0.3s ease;
    }

    .action-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12);
    }

    .action-icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(45deg, #10b981, #059669);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      font-size: 2rem;
      color: white;
    }

    .action-card h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 1rem;
    }

    .action-card p {
      color: #6b7280;
      line-height: 1.6;
    }

    .faq-section {
      padding: 4rem 0;
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

    .faq-list {
      max-width: 800px;
      margin: 0 auto;
    }

    .faq-item {
      background: white;
      border-radius: 12px;
      margin-bottom: 1rem;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.1);
      overflow: hidden;
    }

    .faq-question {
      padding: 1.5rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: all 0.3s ease;
    }

    .faq-question:hover {
      background: rgba(16, 185, 129, 0.05);
    }

    .faq-question h4 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
      flex: 1;
    }

    .faq-toggle {
      width: 32px;
      height: 32px;
      background: rgba(16, 185, 129, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #059669;
    }

    .faq-answer {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
    }

    .faq-answer.expanded {
      max-height: 500px;
    }

    .answer-content {
      padding: 0 1.5rem 1.5rem;
      color: #6b7280;
      line-height: 1.6;
    }
  `]
})
export class HelpComponent implements OnInit {
  searchQuery = '';
  
  faqs: FAQ[] = [
    {
      id: '1',
      question: 'How do I get started with AI Hiring?',
      answer: 'Getting started is easy! Simply create an account, complete your profile, and you can begin posting jobs or applying to positions immediately.',
      category: 'Getting Started',
      expanded: false
    },
    {
      id: '2',
      question: 'How does the AI matching work?',
      answer: 'Our AI analyzes job requirements and candidate profiles to create intelligent matches based on skills, experience, and preferences.',
      category: 'AI Features',
      expanded: false
    },
    {
      id: '3',
      question: 'Is my data secure?',
      answer: 'Yes, we use enterprise-grade security measures to protect your data, including encryption and secure data centers.',
      category: 'Security',
      expanded: false
    }
  ];

  ngOnInit(): void {
    // Component initialization
  }

  toggleFAQ(faq: FAQ): void {
    faq.expanded = !faq.expanded;
  }
}
