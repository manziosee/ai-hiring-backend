import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  buttonText: string;
  buttonClass: string;
}

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="pricing-container">
      <!-- Header -->
      <div class="pricing-header">
        <div class="header-content">
          <nav class="breadcrumb">
            <a routerLink="/">Home</a>
            <i class="fas fa-chevron-right"></i>
            <span>Pricing</span>
          </nav>
          <h1>Simple, Transparent Pricing</h1>
          <p>Choose the perfect plan for your hiring needs. No hidden fees, cancel anytime.</p>
          
          <!-- Billing Toggle -->
          <div class="billing-toggle">
            <span [class.active]="billingPeriod === 'monthly'">Monthly</span>
            <div class="toggle-switch" (click)="toggleBilling()">
              <div class="toggle-slider" [class.annual]="billingPeriod === 'annual'"></div>
            </div>
            <span [class.active]="billingPeriod === 'annual'">
              Annual 
              <span class="discount-badge">Save 20%</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Pricing Plans -->
      <section class="plans-section">
        <div class="section-content">
          <div class="plans-grid">
            <div class="plan-card" 
                 *ngFor="let plan of pricingPlans" 
                 [class.popular]="plan.popular">
              <div class="popular-badge" *ngIf="plan.popular">
                <i class="fas fa-star"></i>
                Most Popular
              </div>
              
              <div class="plan-header">
                <h3>{{ plan.name }}</h3>
                <div class="plan-price">
                  <span class="price">{{ plan.price }}</span>
                  <span class="period">{{ plan.period }}</span>
                </div>
                <p class="plan-description">{{ plan.description }}</p>
              </div>
              
              <div class="plan-features">
                <div class="feature-item" *ngFor="let feature of plan.features">
                  <i class="fas fa-check"></i>
                  <span>{{ feature }}</span>
                </div>
              </div>
              
              <div class="plan-action">
                <button [class]="plan.buttonClass">
                  {{ plan.buttonText }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Comparison -->
      <section class="comparison-section">
        <div class="section-content">
          <div class="section-header">
            <h2>Feature Comparison</h2>
            <p>Compare all features across our pricing plans</p>
          </div>
          
          <div class="comparison-table">
            <div class="table-header">
              <div class="feature-column">Features</div>
              <div class="plan-column">Starter</div>
              <div class="plan-column">Professional</div>
              <div class="plan-column">Enterprise</div>
            </div>
            
            <div class="table-row" *ngFor="let feature of comparisonFeatures">
              <div class="feature-name">{{ feature.name }}</div>
              <div class="feature-value" [innerHTML]="feature.starter"></div>
              <div class="feature-value" [innerHTML]="feature.professional"></div>
              <div class="feature-value" [innerHTML]="feature.enterprise"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="faq-section">
        <div class="section-content">
          <div class="section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about our pricing</p>
          </div>
          
          <div class="faq-grid">
            <div class="faq-item" *ngFor="let faq of faqs">
              <h4>{{ faq.question }}</h4>
              <p>{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Enterprise CTA -->
      <section class="enterprise-section">
        <div class="section-content">
          <div class="enterprise-content">
            <div class="enterprise-info">
              <h2>Need Something Custom?</h2>
              <p>For large organizations with specific requirements, we offer custom enterprise solutions with dedicated support and advanced features.</p>
              
              <div class="enterprise-features">
                <div class="enterprise-feature">
                  <i class="fas fa-shield-alt"></i>
                  <span>Advanced Security & Compliance</span>
                </div>
                <div class="enterprise-feature">
                  <i class="fas fa-headset"></i>
                  <span>Dedicated Customer Success Manager</span>
                </div>
                <div class="enterprise-feature">
                  <i class="fas fa-cogs"></i>
                  <span>Custom Integrations & Workflows</span>
                </div>
                <div class="enterprise-feature">
                  <i class="fas fa-chart-line"></i>
                  <span>Advanced Analytics & Reporting</span>
                </div>
              </div>
            </div>
            
            <div class="enterprise-cta">
              <button class="enterprise-btn" routerLink="/contact">
                <i class="fas fa-phone"></i>
                Contact Sales
              </button>
              <p class="enterprise-note">Get a custom quote tailored to your needs</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Trust Section -->
      <section class="trust-section">
        <div class="section-content">
          <div class="trust-content">
            <h2>Trusted by 50,000+ Companies</h2>
            <p>Join industry leaders who trust AI Hiring for their recruitment needs</p>
            
            <div class="trust-stats">
              <div class="trust-stat">
                <div class="stat-number">99.9%</div>
                <div class="stat-label">Uptime SLA</div>
              </div>
              <div class="trust-stat">
                <div class="stat-number">24/7</div>
                <div class="stat-label">Support Available</div>
              </div>
              <div class="trust-stat">
                <div class="stat-number">SOC 2</div>
                <div class="stat-label">Compliant</div>
              </div>
              <div class="trust-stat">
                <div class="stat-number">GDPR</div>
                <div class="stat-label">Ready</div>
              </div>
            </div>
            
            <div class="money-back">
              <i class="fas fa-shield-check"></i>
              <span>30-day money-back guarantee</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .pricing-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8fffe 0%, #f0fdf4 100%);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    /* Header */
    .pricing-header {
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
      margin-bottom: 3rem;
    }

    /* Billing Toggle */
    .billing-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border-radius: 50px;
      padding: 1rem 2rem;
      max-width: 400px;
      margin: 0 auto;
    }

    .billing-toggle span {
      font-weight: 600;
      opacity: 0.7;
      transition: opacity 0.3s ease;
    }

    .billing-toggle span.active {
      opacity: 1;
    }

    .discount-badge {
      background: #10b981;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.75rem;
      margin-left: 0.5rem;
    }

    .toggle-switch {
      width: 60px;
      height: 30px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 15px;
      position: relative;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .toggle-slider {
      width: 26px;
      height: 26px;
      background: white;
      border-radius: 50%;
      position: absolute;
      top: 2px;
      left: 2px;
      transition: transform 0.3s ease;
    }

    .toggle-slider.annual {
      transform: translateX(30px);
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

    /* Plans Section */
    .plans-section {
      padding: 4rem 0;
    }

    .plans-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .plan-card {
      background: white;
      border-radius: 20px;
      padding: 2.5rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
      border: 2px solid rgba(16, 185, 129, 0.1);
      position: relative;
      transition: all 0.3s ease;
    }

    .plan-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12);
    }

    .plan-card.popular {
      border-color: #10b981;
      transform: scale(1.05);
    }

    .plan-card.popular:hover {
      transform: scale(1.05) translateY(-8px);
    }

    .popular-badge {
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(45deg, #10b981, #059669);
      color: white;
      padding: 0.5rem 1.5rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .plan-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .plan-header h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 1rem;
    }

    .plan-price {
      margin-bottom: 1rem;
    }

    .price {
      font-size: 3rem;
      font-weight: 800;
      color: #059669;
    }

    .period {
      color: #6b7280;
      font-size: 1rem;
      margin-left: 0.5rem;
    }

    .plan-description {
      color: #6b7280;
      line-height: 1.6;
    }

    .plan-features {
      margin-bottom: 2rem;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
      color: #374151;
    }

    .feature-item i {
      color: #10b981;
      font-size: 0.875rem;
      width: 16px;
    }

    .plan-action button {
      width: 100%;
      padding: 1rem 2rem;
      border-radius: 12px;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;
    }

    .btn-primary {
      background: linear-gradient(45deg, #10b981, #059669);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
    }

    .btn-secondary {
      background: white;
      color: #059669;
      border: 2px solid #10b981;
    }

    .btn-secondary:hover {
      background: #10b981;
      color: white;
    }

    /* Comparison Table */
    .comparison-section {
      padding: 4rem 0;
      background: rgba(16, 185, 129, 0.05);
    }

    .comparison-table {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    }

    .table-header {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      background: linear-gradient(45deg, #10b981, #059669);
      color: white;
      font-weight: 600;
    }

    .table-header > div {
      padding: 1.5rem;
      text-align: center;
    }

    .feature-column {
      text-align: left !important;
    }

    .table-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      border-bottom: 1px solid rgba(16, 185, 129, 0.1);
    }

    .table-row:last-child {
      border-bottom: none;
    }

    .table-row > div {
      padding: 1rem 1.5rem;
      display: flex;
      align-items: center;
    }

    .feature-name {
      font-weight: 600;
      color: #1f2937;
    }

    .feature-value {
      justify-content: center;
      color: #6b7280;
    }

    /* FAQ Section */
    .faq-section {
      padding: 4rem 0;
    }

    .faq-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
    }

    .faq-item {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.1);
    }

    .faq-item h4 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 1rem;
    }

    .faq-item p {
      color: #6b7280;
      line-height: 1.6;
    }

    /* Enterprise Section */
    .enterprise-section {
      padding: 4rem 0;
      background: rgba(16, 185, 129, 0.05);
    }

    .enterprise-content {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 4rem;
      align-items: center;
    }

    .enterprise-info h2 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 1rem;
    }

    .enterprise-info p {
      color: #6b7280;
      font-size: 1.125rem;
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    .enterprise-features {
      display: grid;
      gap: 1rem;
    }

    .enterprise-feature {
      display: flex;
      align-items: center;
      gap: 1rem;
      color: #374151;
    }

    .enterprise-feature i {
      color: #10b981;
      font-size: 1.25rem;
      width: 24px;
    }

    .enterprise-cta {
      text-align: center;
    }

    .enterprise-btn {
      background: linear-gradient(45deg, #10b981, #059669);
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 12px;
      font-weight: 600;
      font-size: 1.125rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      width: 100%;
      margin-bottom: 1rem;
    }

    .enterprise-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
    }

    .enterprise-note {
      color: #6b7280;
      font-size: 0.875rem;
    }

    /* Trust Section */
    .trust-section {
      padding: 4rem 0;
    }

    .trust-content {
      text-align: center;
    }

    .trust-content h2 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 1rem;
    }

    .trust-content p {
      color: #6b7280;
      font-size: 1.125rem;
      margin-bottom: 3rem;
    }

    .trust-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .trust-stat {
      text-align: center;
    }

    .trust-stat .stat-number {
      font-size: 2rem;
      font-weight: 800;
      color: #059669;
      margin-bottom: 0.5rem;
    }

    .trust-stat .stat-label {
      color: #6b7280;
      font-weight: 600;
    }

    .money-back {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      color: #059669;
      font-weight: 600;
      font-size: 1.125rem;
    }

    .money-back i {
      font-size: 1.5rem;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .enterprise-content {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
    }

    @media (max-width: 768px) {
      .header-content h1 {
        font-size: 2.5rem;
      }

      .plans-grid {
        grid-template-columns: 1fr;
      }

      .plan-card.popular {
        transform: none;
      }

      .table-header,
      .table-row {
        grid-template-columns: 1fr;
      }

      .table-header > div,
      .table-row > div {
        text-align: left;
        border-bottom: 1px solid rgba(16, 185, 129, 0.1);
      }

      .faq-grid {
        grid-template-columns: 1fr;
      }

      .trust-stats {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class PricingComponent implements OnInit {
  billingPeriod: 'monthly' | 'annual' = 'monthly';

  pricingPlans: PricingPlan[] = [
    {
      name: 'Starter',
      price: '$29',
      period: '/month',
      description: 'Perfect for small teams getting started with AI hiring',
      features: [
        'Up to 50 job postings',
        'Basic AI candidate matching',
        'Standard support',
        'Basic analytics',
        'Email integration'
      ],
      buttonText: 'Start Free Trial',
      buttonClass: 'btn-secondary'
    },
    {
      name: 'Professional',
      price: '$99',
      period: '/month',
      description: 'Ideal for growing companies with advanced hiring needs',
      features: [
        'Unlimited job postings',
        'Advanced AI screening',
        'Priority support',
        'Advanced analytics & reporting',
        'API access',
        'Custom integrations',
        'Bulk candidate import'
      ],
      popular: true,
      buttonText: 'Start Free Trial',
      buttonClass: 'btn-primary'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large organizations with custom requirements',
      features: [
        'Everything in Professional',
        'Custom AI model training',
        'Dedicated account manager',
        'SLA guarantee',
        'Advanced security features',
        'Custom workflows',
        'On-premise deployment'
      ],
      buttonText: 'Contact Sales',
      buttonClass: 'btn-secondary'
    }
  ];

  comparisonFeatures = [
    {
      name: 'Job Postings',
      starter: '50',
      professional: 'Unlimited',
      enterprise: 'Unlimited'
    },
    {
      name: 'AI Candidate Matching',
      starter: '<i class="fas fa-check text-green-500"></i>',
      professional: '<i class="fas fa-check text-green-500"></i>',
      enterprise: '<i class="fas fa-check text-green-500"></i>'
    },
    {
      name: 'Advanced AI Screening',
      starter: '<i class="fas fa-times text-gray-400"></i>',
      professional: '<i class="fas fa-check text-green-500"></i>',
      enterprise: '<i class="fas fa-check text-green-500"></i>'
    },
    {
      name: 'API Access',
      starter: '<i class="fas fa-times text-gray-400"></i>',
      professional: '<i class="fas fa-check text-green-500"></i>',
      enterprise: '<i class="fas fa-check text-green-500"></i>'
    },
    {
      name: 'Custom Integrations',
      starter: '<i class="fas fa-times text-gray-400"></i>',
      professional: 'Limited',
      enterprise: 'Unlimited'
    },
    {
      name: 'Support',
      starter: 'Email',
      professional: 'Priority',
      enterprise: 'Dedicated Manager'
    }
  ];

  faqs = [
    {
      question: 'Can I change my plan anytime?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and we\'ll prorate any billing differences.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes, we offer a 14-day free trial for all plans. No credit card required to get started.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers for annual plans. Enterprise customers can also pay by invoice.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied, we\'ll refund your payment in full.'
    }
  ];

  ngOnInit(): void {
    // Component initialization
  }

  toggleBilling(): void {
    this.billingPeriod = this.billingPeriod === 'monthly' ? 'annual' : 'monthly';
    this.updatePricing();
  }

  private updatePricing(): void {
    if (this.billingPeriod === 'annual') {
      this.pricingPlans[0].price = '$23';
      this.pricingPlans[1].price = '$79';
    } else {
      this.pricingPlans[0].price = '$29';
      this.pricingPlans[1].price = '$99';
    }
  }
}
