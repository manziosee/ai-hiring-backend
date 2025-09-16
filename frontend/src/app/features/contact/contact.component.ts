import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="contact-container">
      <!-- Header -->
      <div class="contact-header">
        <div class="header-content">
          <nav class="breadcrumb">
            <a routerLink="/">Home</a>
            <i class="fas fa-chevron-right"></i>
            <span>Contact Us</span>
          </nav>
          <h1>Get in Touch</h1>
          <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>
      </div>

      <!-- Contact Info & Form -->
      <section class="contact-section">
        <div class="section-content">
          <div class="contact-grid">
            <!-- Contact Information -->
            <div class="contact-info">
              <h2>Contact Information</h2>
              <p>Ready to transform your hiring process with AI? Get in touch with our team.</p>
              
              <div class="contact-methods">
                <div class="contact-method">
                  <div class="method-icon">
                    <i class="fas fa-map-marker-alt"></i>
                  </div>
                  <div class="method-content">
                    <h4>Office Address</h4>
                    <p>123 Innovation Drive<br>San Francisco, CA 94105<br>United States</p>
                  </div>
                </div>
                
                <div class="contact-method">
                  <div class="method-icon">
                    <i class="fas fa-phone"></i>
                  </div>
                  <div class="method-content">
                    <h4>Phone</h4>
                    <p>+1 (555) 123-4567</p>
                    <small>Mon-Fri, 9AM-6PM PST</small>
                  </div>
                </div>
                
                <div class="contact-method">
                  <div class="method-icon">
                    <i class="fas fa-envelope"></i>
                  </div>
                  <div class="method-content">
                    <h4>Email</h4>
                    <p>hello@aihiring.com</p>
                    <small>We'll respond within 24 hours</small>
                  </div>
                </div>
                
                <div class="contact-method">
                  <div class="method-icon">
                    <i class="fas fa-comments"></i>
                  </div>
                  <div class="method-content">
                    <h4>Live Chat</h4>
                    <p>Available 24/7</p>
                    <button class="chat-btn">
                      <i class="fas fa-comment"></i>
                      Start Chat
                    </button>
                  </div>
                </div>
              </div>

              <!-- Social Links -->
              <div class="social-links">
                <h4>Follow Us</h4>
                <div class="social-icons">
                  <a href="#" class="social-link">
                    <i class="fab fa-twitter"></i>
                  </a>
                  <a href="#" class="social-link">
                    <i class="fab fa-linkedin"></i>
                  </a>
                  <a href="#" class="social-link">
                    <i class="fab fa-github"></i>
                  </a>
                  <a href="#" class="social-link">
                    <i class="fab fa-youtube"></i>
                  </a>
                </div>
              </div>
            </div>

            <!-- Contact Form -->
            <div class="contact-form-container">
              <div class="form-header">
                <h2>Send us a Message</h2>
                <p>Fill out the form below and we'll get back to you shortly.</p>
              </div>
              
              <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="contact-form">
                <div class="form-row">
                  <div class="form-group">
                    <label for="firstName">First Name *</label>
                    <input 
                      type="text" 
                      id="firstName"
                      formControlName="firstName"
                      [class.error]="contactForm.get('firstName')?.invalid && contactForm.get('firstName')?.touched"
                    >
                    <div class="error-message" *ngIf="contactForm.get('firstName')?.invalid && contactForm.get('firstName')?.touched">
                      First name is required
                    </div>
                  </div>
                  
                  <div class="form-group">
                    <label for="lastName">Last Name *</label>
                    <input 
                      type="text" 
                      id="lastName"
                      formControlName="lastName"
                      [class.error]="contactForm.get('lastName')?.invalid && contactForm.get('lastName')?.touched"
                    >
                    <div class="error-message" *ngIf="contactForm.get('lastName')?.invalid && contactForm.get('lastName')?.touched">
                      Last name is required
                    </div>
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="email">Email Address *</label>
                  <input 
                    type="email" 
                    id="email"
                    formControlName="email"
                    [class.error]="contactForm.get('email')?.invalid && contactForm.get('email')?.touched"
                  >
                  <div class="error-message" *ngIf="contactForm.get('email')?.invalid && contactForm.get('email')?.touched">
                    <span *ngIf="contactForm.get('email')?.errors?.['required']">Email is required</span>
                    <span *ngIf="contactForm.get('email')?.errors?.['email']">Please enter a valid email</span>
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="company">Company</label>
                  <input 
                    type="text" 
                    id="company"
                    formControlName="company"
                  >
                </div>
                
                <div class="form-group">
                  <label for="phone">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone"
                    formControlName="phone"
                  >
                </div>
                
                <div class="form-group">
                  <label for="subject">Subject *</label>
                  <select 
                    id="subject"
                    formControlName="subject"
                    [class.error]="contactForm.get('subject')?.invalid && contactForm.get('subject')?.touched"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="sales">Sales & Pricing</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership</option>
                    <option value="demo">Request Demo</option>
                    <option value="other">Other</option>
                  </select>
                  <div class="error-message" *ngIf="contactForm.get('subject')?.invalid && contactForm.get('subject')?.touched">
                    Please select a subject
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="message">Message *</label>
                  <textarea 
                    id="message"
                    formControlName="message"
                    rows="6"
                    placeholder="Tell us more about your inquiry..."
                    [class.error]="contactForm.get('message')?.invalid && contactForm.get('message')?.touched"
                  ></textarea>
                  <div class="error-message" *ngIf="contactForm.get('message')?.invalid && contactForm.get('message')?.touched">
                    Message is required
                  </div>
                </div>
                
                <div class="form-group checkbox-group">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      formControlName="newsletter"
                    >
                    <span class="checkmark"></span>
                    Subscribe to our newsletter for updates and insights
                  </label>
                </div>
                
                <div class="form-actions">
                  <button 
                    type="submit" 
                    class="submit-btn"
                    [disabled]="contactForm.invalid || isSubmitting"
                  >
                    <span *ngIf="!isSubmitting">
                      <i class="fas fa-paper-plane"></i>
                      Send Message
                    </span>
                    <span *ngIf="isSubmitting">
                      <i class="fas fa-spinner fa-spin"></i>
                      Sending...
                    </span>
                  </button>
                </div>
                
                <div class="success-message" *ngIf="isSubmitted">
                  <i class="fas fa-check-circle"></i>
                  Thank you! Your message has been sent successfully. We'll get back to you soon.
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="faq-section">
        <div class="section-content">
          <div class="section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Quick answers to common questions</p>
          </div>
          
          <div class="faq-grid">
            <div class="faq-item">
              <h4>How quickly do you respond to inquiries?</h4>
              <p>We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call us directly.</p>
            </div>
            
            <div class="faq-item">
              <h4>Do you offer free demos?</h4>
              <p>Yes! We offer personalized demos to show you how AI Hiring can transform your recruitment process. Schedule one today.</p>
            </div>
            
            <div class="faq-item">
              <h4>What support options are available?</h4>
              <p>We offer 24/7 live chat, email support, phone support during business hours, and comprehensive documentation.</p>
            </div>
            
            <div class="faq-item">
              <h4>Can I integrate with my existing systems?</h4>
              <p>Absolutely! We offer integrations with popular ATS, HRIS, and other HR tools. Our API makes custom integrations easy.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Office Locations -->
      <section class="locations-section">
        <div class="section-content">
          <div class="section-header">
            <h2>Our Offices</h2>
            <p>Visit us at one of our global locations</p>
          </div>
          
          <div class="locations-grid">
            <div class="location-card">
              <div class="location-image">
                <i class="fas fa-building"></i>
              </div>
              <h4>San Francisco HQ</h4>
              <p>123 Innovation Drive<br>San Francisco, CA 94105</p>
              <div class="location-hours">
                <small>Mon-Fri: 9AM-6PM PST</small>
              </div>
            </div>
            
            <div class="location-card">
              <div class="location-image">
                <i class="fas fa-building"></i>
              </div>
              <h4>New York Office</h4>
              <p>456 Tech Avenue<br>New York, NY 10001</p>
              <div class="location-hours">
                <small>Mon-Fri: 9AM-6PM EST</small>
              </div>
            </div>
            
            <div class="location-card">
              <div class="location-image">
                <i class="fas fa-building"></i>
              </div>
              <h4>London Office</h4>
              <p>789 Innovation Street<br>London, UK EC1A 1BB</p>
              <div class="location-hours">
                <small>Mon-Fri: 9AM-6PM GMT</small>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .contact-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8fffe 0%, #f0fdf4 100%);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    /* Header */
    .contact-header {
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
    }

    /* Contact Section */
    .contact-section {
      padding: 4rem 0;
    }

    .section-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: 4rem;
      align-items: start;
    }

    /* Contact Info */
    .contact-info {
      background: white;
      border-radius: 20px;
      padding: 2.5rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.1);
      height: fit-content;
    }

    .contact-info h2 {
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 1rem;
    }

    .contact-info > p {
      color: #6b7280;
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    .contact-methods {
      margin-bottom: 2rem;
    }

    .contact-method {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .method-icon {
      width: 50px;
      height: 50px;
      background: linear-gradient(45deg, #10b981, #059669);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    .method-content h4 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 0.5rem;
    }

    .method-content p {
      color: #6b7280;
      margin-bottom: 0.25rem;
      line-height: 1.5;
    }

    .method-content small {
      color: #9ca3af;
      font-size: 0.875rem;
    }

    .chat-btn {
      background: linear-gradient(45deg, #10b981, #059669);
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .chat-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }

    .social-links {
      border-top: 1px solid rgba(16, 185, 129, 0.1);
      padding-top: 2rem;
    }

    .social-links h4 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 1rem;
    }

    .social-icons {
      display: flex;
      gap: 1rem;
    }

    .social-link {
      width: 40px;
      height: 40px;
      background: rgba(16, 185, 129, 0.1);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #059669;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .social-link:hover {
      background: linear-gradient(45deg, #10b981, #059669);
      color: white;
      transform: translateY(-2px);
    }

    /* Contact Form */
    .contact-form-container {
      background: white;
      border-radius: 20px;
      padding: 2.5rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.1);
    }

    .form-header {
      margin-bottom: 2rem;
    }

    .form-header h2 {
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 0.5rem;
    }

    .form-header p {
      color: #6b7280;
    }

    .contact-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      padding: 0.75rem 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.3s ease;
      background: white;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #10b981;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }

    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
      border-color: #ef4444;
    }

    .error-message {
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .checkbox-group {
      flex-direction: row;
      align-items: center;
      gap: 0.75rem;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      font-size: 0.875rem;
      color: #6b7280;
    }

    .checkbox-label input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: #10b981;
    }

    .form-actions {
      margin-top: 1rem;
    }

    .submit-btn {
      background: linear-gradient(45deg, #10b981, #059669);
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 12px;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      width: 100%;
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
    }

    .submit-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .success-message {
      background: #dcfce7;
      color: #166534;
      padding: 1rem;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    /* FAQ Section */
    .faq-section {
      padding: 4rem 0;
      background: rgba(16, 185, 129, 0.05);
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

    .faq-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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

    /* Locations Section */
    .locations-section {
      padding: 4rem 0;
    }

    .locations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .location-card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      text-align: center;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.1);
      transition: all 0.3s ease;
    }

    .location-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
    }

    .location-image {
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

    .location-card h4 {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 1rem;
    }

    .location-card p {
      color: #6b7280;
      margin-bottom: 1rem;
      line-height: 1.5;
    }

    .location-hours small {
      color: #9ca3af;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .contact-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
    }

    @media (max-width: 768px) {
      .header-content h1 {
        font-size: 2.5rem;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .contact-info,
      .contact-form-container {
        padding: 2rem;
      }

      .faq-grid,
      .locations-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  isSubmitting = false;
  isSubmitted = false;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      company: [''],
      phone: [''],
      subject: ['', Validators.required],
      message: ['', Validators.required],
      newsletter: [false]
    });
  }

  ngOnInit(): void {
    // Component initialization
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      
      // Simulate form submission
      setTimeout(() => {
        this.isSubmitting = false;
        this.isSubmitted = true;
        this.contactForm.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          this.isSubmitted = false;
        }, 5000);
      }, 2000);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
  }
}
