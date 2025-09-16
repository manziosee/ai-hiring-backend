import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorImage: string;
  publishDate: string;
  readTime: string;
  category: string;
  tags: string[];
  featured: boolean;
  image: string;
}

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="blog-container">
      <!-- Header -->
      <div class="blog-header">
        <div class="header-background">
          <div class="gradient-orb orb-1"></div>
          <div class="gradient-orb orb-2"></div>
        </div>
        <div class="header-content">
          <nav class="breadcrumb">
            <a routerLink="/">Home</a>
            <i class="fas fa-chevron-right"></i>
            <span>Blog</span>
          </nav>
          <h1>AI Hiring Insights</h1>
          <p>Stay updated with the latest trends in AI-powered recruitment and hiring strategies</p>
        </div>
      </div>

      <!-- Featured Post -->
      <section class="featured-section" *ngIf="featuredPost">
        <div class="section-content">
          <div class="featured-post">
            <div class="featured-image">
              <img [src]="featuredPost.image" [alt]="featuredPost.title">
              <div class="featured-badge">
                <i class="fas fa-star"></i>
                Featured
              </div>
            </div>
            <div class="featured-content">
              <div class="post-meta">
                <span class="category">{{ featuredPost.category }}</span>
                <span class="read-time">
                  <i class="fas fa-clock"></i>
                  {{ featuredPost.readTime }}
                </span>
              </div>
              <h2>{{ featuredPost.title }}</h2>
              <p>{{ featuredPost.excerpt }}</p>
              <div class="post-author">
                <img [src]="featuredPost.authorImage" [alt]="featuredPost.author">
                <div class="author-info">
                  <div class="author-name">{{ featuredPost.author }}</div>
                  <div class="publish-date">{{ featuredPost.publishDate }}</div>
                </div>
              </div>
              <button class="read-more-btn">
                <span>Read Full Article</span>
                <i class="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Categories Filter -->
      <section class="filter-section">
        <div class="section-content">
          <div class="filter-tabs">
            <button 
              class="filter-tab" 
              [class.active]="selectedCategory === 'all'"
              (click)="filterByCategory('all')">
              All Posts
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

      <!-- Blog Posts Grid -->
      <section class="posts-section">
        <div class="section-content">
          <div class="posts-grid">
            <article class="post-card" *ngFor="let post of filteredPosts; let i = index">
              <div class="post-image">
                <img [src]="post.image" [alt]="post.title">
                <div class="post-category">{{ post.category }}</div>
              </div>
              <div class="post-content">
                <div class="post-meta">
                  <span class="post-date">{{ post.publishDate }}</span>
                  <span class="post-read-time">
                    <i class="fas fa-clock"></i>
                    {{ post.readTime }}
                  </span>
                </div>
                <h3>{{ post.title }}</h3>
                <p>{{ post.excerpt }}</p>
                <div class="post-tags">
                  <span class="tag" *ngFor="let tag of post.tags.slice(0, 3)">{{ tag }}</span>
                </div>
                <div class="post-footer">
                  <div class="post-author">
                    <img [src]="post.authorImage" [alt]="post.author">
                    <span>{{ post.author }}</span>
                  </div>
                  <button class="read-btn">
                    <i class="fas fa-book-open"></i>
                    Read More
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- Newsletter Signup -->
      <section class="newsletter-section">
        <div class="section-content">
          <div class="newsletter-card">
            <div class="newsletter-icon">
              <i class="fas fa-envelope"></i>
            </div>
            <h3>Stay Updated</h3>
            <p>Get the latest AI hiring insights delivered to your inbox</p>
            <div class="newsletter-form">
              <input type="email" placeholder="Enter your email address" [(ngModel)]="newsletterEmail">
              <button class="subscribe-btn" (click)="subscribeNewsletter()">
                <i class="fas fa-paper-plane"></i>
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .blog-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8fffe 0%, #f0fdf4 100%);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    /* Header */
    .blog-header {
      position: relative;
      background: linear-gradient(135deg, #059669 0%, #047857 30%, #065f46 70%, #064e3b 100%);
      padding: 120px 0 80px;
      overflow: hidden;
    }

    .header-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }

    .gradient-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(40px);
      opacity: 0.6;
      animation: float-orb 8s ease-in-out infinite;
    }

    .orb-1 {
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.4), transparent);
      top: -100px;
      left: 10%;
    }

    .orb-2 {
      width: 150px;
      height: 150px;
      background: radial-gradient(circle, rgba(5, 150, 105, 0.3), transparent);
      bottom: -75px;
      right: 20%;
      animation-delay: 4s;
    }

    @keyframes float-orb {
      0%, 100% { transform: translate(0, 0) scale(1); }
      25% { transform: translate(15px, -15px) scale(1.1); }
      50% { transform: translate(-10px, -25px) scale(0.9); }
      75% { transform: translate(-15px, 10px) scale(1.05); }
    }

    .header-content {
      position: relative;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
      text-align: center;
      color: white;
      z-index: 2;
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

    .breadcrumb i {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.75rem;
    }

    .header-content h1 {
      font-size: 3.5rem;
      font-weight: 800;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .header-content p {
      font-size: 1.25rem;
      opacity: 0.9;
      max-width: 600px;
      margin: 0 auto;
    }

    /* Featured Section */
    .featured-section {
      padding: 4rem 0;
    }

    .section-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .featured-post {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      background: white;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.1);
    }

    .featured-image {
      position: relative;
      overflow: hidden;
    }

    .featured-image img {
      width: 100%;
      height: 400px;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .featured-post:hover .featured-image img {
      transform: scale(1.05);
    }

    .featured-badge {
      position: absolute;
      top: 1.5rem;
      left: 1.5rem;
      background: linear-gradient(45deg, #f59e0b, #d97706);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .featured-content {
      padding: 3rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .post-meta {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .category {
      background: rgba(16, 185, 129, 0.1);
      color: #059669;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .read-time {
      color: #6b7280;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .featured-content h2 {
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 1rem;
      line-height: 1.3;
    }

    .featured-content p {
      color: #6b7280;
      font-size: 1.125rem;
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    .post-author {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .post-author img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
    }

    .author-info {
      flex: 1;
    }

    .author-name {
      font-weight: 600;
      color: #1f2937;
    }

    .publish-date {
      color: #6b7280;
      font-size: 0.875rem;
    }

    .read-more-btn {
      background: linear-gradient(45deg, #10b981, #059669);
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      align-self: flex-start;
    }

    .read-more-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
    }

    /* Filter Section */
    .filter-section {
      padding: 2rem 0;
      background: rgba(16, 185, 129, 0.05);
    }

    .filter-tabs {
      display: flex;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .filter-tab {
      background: white;
      border: 2px solid rgba(16, 185, 129, 0.2);
      color: #059669;
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
      transform: translateY(-2px);
    }

    /* Posts Grid */
    .posts-section {
      padding: 4rem 0;
    }

    .posts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
    }

    .post-card {
      background: white;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.1);
      transition: all 0.3s ease;
    }

    .post-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12);
      border-color: rgba(16, 185, 129, 0.2);
    }

    .post-image {
      position: relative;
      overflow: hidden;
    }

    .post-image img {
      width: 100%;
      height: 200px;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .post-card:hover .post-image img {
      transform: scale(1.05);
    }

    .post-category {
      position: absolute;
      top: 1rem;
      left: 1rem;
      background: rgba(16, 185, 129, 0.9);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .post-content {
      padding: 1.5rem;
    }

    .post-content .post-meta {
      margin-bottom: 1rem;
    }

    .post-date {
      color: #6b7280;
      font-size: 0.875rem;
    }

    .post-read-time {
      color: #6b7280;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .post-content h3 {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 0.75rem;
      line-height: 1.4;
    }

    .post-content p {
      color: #6b7280;
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    .post-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .tag {
      background: rgba(16, 185, 129, 0.1);
      color: #059669;
      padding: 0.25rem 0.5rem;
      border-radius: 8px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .post-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .post-footer .post-author {
      margin-bottom: 0;
    }

    .post-footer .post-author img {
      width: 32px;
      height: 32px;
    }

    .post-footer .post-author span {
      font-size: 0.875rem;
      font-weight: 500;
      color: #1f2937;
    }

    .read-btn {
      background: rgba(16, 185, 129, 0.1);
      color: #059669;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .read-btn:hover {
      background: rgba(16, 185, 129, 0.2);
      transform: translateY(-1px);
    }

    /* Newsletter Section */
    .newsletter-section {
      padding: 4rem 0;
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
    }

    .newsletter-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 24px;
      padding: 3rem;
      text-align: center;
      color: white;
    }

    .newsletter-icon {
      width: 80px;
      height: 80px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      font-size: 2rem;
    }

    .newsletter-card h3 {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .newsletter-card p {
      font-size: 1.125rem;
      opacity: 0.9;
      margin-bottom: 2rem;
    }

    .newsletter-form {
      display: flex;
      max-width: 400px;
      margin: 0 auto;
      gap: 1rem;
    }

    .newsletter-form input {
      flex: 1;
      padding: 1rem;
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      font-size: 1rem;
    }

    .newsletter-form input::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }

    .newsletter-form input:focus {
      outline: none;
      border-color: rgba(255, 255, 255, 0.4);
    }

    .subscribe-btn {
      background: rgba(255, 255, 255, 0.2);
      border: 2px solid rgba(255, 255, 255, 0.3);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .subscribe-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .header-content h1 {
        font-size: 2.5rem;
      }

      .featured-post {
        grid-template-columns: 1fr;
      }

      .posts-grid {
        grid-template-columns: 1fr;
      }

      .newsletter-form {
        flex-direction: column;
      }
    }
  `]
})
export class BlogComponent implements OnInit {
  selectedCategory = 'all';
  newsletterEmail = '';
  
  categories = [
    'AI & Technology',
    'Recruitment Tips',
    'Industry Insights',
    'Case Studies',
    'Product Updates'
  ];

  featuredPost: BlogPost = {
    id: '1',
    title: 'The Future of AI in Recruitment: 2025 Trends and Predictions',
    excerpt: 'Discover how artificial intelligence is revolutionizing the hiring process and what to expect in the coming year.',
    content: '',
    author: 'Sarah Johnson',
    authorImage: '/assets/images/authors/sarah.jpg',
    publishDate: 'December 15, 2024',
    readTime: '8 min read',
    category: 'AI & Technology',
    tags: ['AI', 'Future', 'Trends', 'Recruitment'],
    featured: true,
    image: '/assets/images/blog/ai-future.jpg'
  };

  blogPosts: BlogPost[] = [
    {
      id: '2',
      title: 'How to Write Job Descriptions That Attract Top Talent',
      excerpt: 'Learn the art of crafting compelling job descriptions that stand out and attract the best candidates.',
      content: '',
      author: 'Michael Chen',
      authorImage: '/assets/images/authors/michael.jpg',
      publishDate: 'December 12, 2024',
      readTime: '6 min read',
      category: 'Recruitment Tips',
      tags: ['Job Descriptions', 'Hiring', 'Best Practices'],
      featured: false,
      image: '/assets/images/blog/job-descriptions.jpg'
    },
    {
      id: '3',
      title: 'Case Study: How TechCorp Reduced Hiring Time by 60%',
      excerpt: 'A detailed look at how one company transformed their recruitment process using AI-powered tools.',
      content: '',
      author: 'Emily Rodriguez',
      authorImage: '/assets/images/authors/emily.jpg',
      publishDate: 'December 10, 2024',
      readTime: '10 min read',
      category: 'Case Studies',
      tags: ['Case Study', 'Success Story', 'Efficiency'],
      featured: false,
      image: '/assets/images/blog/case-study.jpg'
    },
    {
      id: '4',
      title: 'Remote Hiring Best Practices in 2024',
      excerpt: 'Essential strategies for successfully hiring remote talent in today\'s distributed work environment.',
      content: '',
      author: 'David Kim',
      authorImage: '/assets/images/authors/david.jpg',
      publishDate: 'December 8, 2024',
      readTime: '7 min read',
      category: 'Industry Insights',
      tags: ['Remote Work', 'Hiring', 'Best Practices'],
      featured: false,
      image: '/assets/images/blog/remote-hiring.jpg'
    },
    {
      id: '5',
      title: 'New Feature: Advanced AI Screening Capabilities',
      excerpt: 'Introducing our latest AI screening features that make candidate evaluation more accurate and efficient.',
      content: '',
      author: 'Lisa Wang',
      authorImage: '/assets/images/authors/lisa.jpg',
      publishDate: 'December 5, 2024',
      readTime: '5 min read',
      category: 'Product Updates',
      tags: ['Product Update', 'AI Screening', 'Features'],
      featured: false,
      image: '/assets/images/blog/ai-screening.jpg'
    },
    {
      id: '6',
      title: 'Building Inclusive Hiring Practices with AI',
      excerpt: 'How artificial intelligence can help create more diverse and inclusive recruitment processes.',
      content: '',
      author: 'James Thompson',
      authorImage: '/assets/images/authors/james.jpg',
      publishDate: 'December 3, 2024',
      readTime: '9 min read',
      category: 'Industry Insights',
      tags: ['Diversity', 'Inclusion', 'AI', 'Ethics'],
      featured: false,
      image: '/assets/images/blog/inclusive-hiring.jpg'
    }
  ];

  filteredPosts: BlogPost[] = [];

  ngOnInit(): void {
    this.filteredPosts = this.blogPosts;
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    if (category === 'all') {
      this.filteredPosts = this.blogPosts;
    } else {
      this.filteredPosts = this.blogPosts.filter(post => post.category === category);
    }
  }

  subscribeNewsletter(): void {
    if (this.newsletterEmail) {
      // In a real app, this would make an API call
      console.log('Subscribing email:', this.newsletterEmail);
      alert('Thank you for subscribing to our newsletter!');
      this.newsletterEmail = '';
    }
  }
}
