import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="modern-header">
      <div class="header-content">
        <!-- Left: Logo Section -->
        <div class="header-left">
          <div class="brand-section" routerLink="/">
            <div class="logo-container">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div class="brand-text">
              <h1 class="brand-title">AI Hiring</h1>
              <p class="brand-subtitle">Smart Recruitment</p>
            </div>
          </div>
        </div>

        <!-- Center: Navigation Menu -->
        <nav class="header-center" *ngIf="isAuthenticated">
          <div class="nav-container">
            <ng-container *ngIf="currentUser">
              <a
                routerLink="/dashboard"
                routerLinkActive="active"
                class="nav-item"
              >
                <i class="fas fa-tachometer-alt"></i>
                <span>Dashboard</span>
              </a>
              <a routerLink="/jobs" routerLinkActive="active" class="nav-item">
                <i class="fas fa-briefcase"></i>
                <span>Jobs</span>
              </a>
              <a
                routerLink="/applications"
                routerLinkActive="active"
                class="nav-item"
                *ngIf="
                  currentUser.role === UserRole.RECRUITER ||
                  currentUser.role === UserRole.ADMIN
                "
              >
                <i class="fas fa-file-alt"></i>
                <span>Applications</span>
              </a>
              <a
                routerLink="/interviews"
                routerLinkActive="active"
                class="nav-item"
              >
                <i class="fas fa-calendar-check"></i>
                <span>Interviews</span>
              </a>
              <a
                routerLink="/analytics"
                routerLinkActive="active"
                class="nav-item"
                *ngIf="currentUser.role === UserRole.ADMIN"
              >
                <i class="fas fa-chart-line"></i>
                <span>Analytics</span>
              </a>
            </ng-container>
          </div>
        </nav>

        <!-- Right: User Profile & Actions -->
        <div class="header-right">
          <ng-container *ngIf="isAuthenticated; else authButtons">
            <div class="user-profile" *ngIf="currentUser">
              <div class="user-avatar">
                <i class="fas fa-user"></i>
              </div>
              <div class="user-details">
                <span class="user-name">{{ getUserDisplayName() }}</span>
                <span class="user-role">{{ currentUser.role }}</span>
              </div>
            </div>
            <button class="logout-btn" (click)="logout()">
              <i class="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </button>
          </ng-container>

          <ng-template #authButtons>
            <a routerLink="/auth/login" class="auth-btn login-btn">
              <i class="fas fa-sign-in-alt"></i>
              <span>Login</span>
            </a>
            <a routerLink="/auth/register" class="auth-btn signup-btn">
              <i class="fas fa-user-plus"></i>
              <span>Sign Up</span>
            </a>
          </ng-template>
        </div>
      </div>
    </header>
  `,
  styles: [
    `
      .modern-header {
        position: sticky;
        top: 0;
        z-index: 1000;
        background: #10b981;
        min-height: 70px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .header-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
        height: 70px;
      }

      .header-left {
        display: flex;
        align-items: center;
        flex: 0 0 auto;
        min-width: 200px;
      }

      .brand-section {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        cursor: pointer;
        text-decoration: none;
        color: white;
        transition: all 0.2s ease;
        padding: 0.5rem 0.75rem;
        border-radius: 8px;
      }

      .brand-section:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-1px);
      }

      .logo-container {
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.15);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .logo-container svg {
        width: 20px;
        height: 20px;
        color: white;
      }

      .brand-title {
        font-size: 1.5rem;
        font-weight: 600;
        margin: 0;
        color: white;
      }

      .brand-subtitle {
        font-size: 0.75rem;
        margin: 0;
        color: rgba(255, 255, 255, 0.8);
        font-weight: 400;
        letter-spacing: 0.5px;
      }

      .header-center {
        flex: 1;
        display: flex;
        justify-content: center;
        max-width: 500px;
        margin: 0 2rem;
      }

      .nav-container {
        display: flex;
        gap: 1.5rem;
        align-items: center;
      }

      .nav-item {
        color: rgba(255, 255, 255, 0.9);
        text-decoration: none;
        font-weight: 500;
        font-size: 0.9rem;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        border: 1px solid transparent;
      }

      .nav-item:hover {
        background: rgba(255, 255, 255, 0.15);
        color: white;
        border-color: rgba(255, 255, 255, 0.2);
      }

      .nav-item.active {
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border-color: rgba(255, 255, 255, 0.3);
      }

      .header-right {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex: 0 0 auto;
        min-width: 200px;
        justify-content: flex-end;
      }

      .user-profile {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: white;
        padding: 0.5rem 0.75rem;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.15);
      }

      .user-avatar {
        width: 32px;
        height: 32px;
        background: #059669;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .user-avatar i {
        font-size: 14px;
        color: white;
      }

      .user-details {
        display: flex;
        flex-direction: column;
        line-height: 1.2;
      }

      .user-name {
        font-weight: 600;
        font-size: 0.875rem;
        color: white;
        margin: 0;
      }

      .user-role {
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.7);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: 500;
        margin: 0;
      }

      .logout-btn,
      .auth-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        text-decoration: none;
        border: none;
        cursor: pointer;
        font-size: 0.875rem;
        font-weight: 500;
        transition: all 0.2s ease;
      }

      .logout-btn {
        background: #dc2626;
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .logout-btn:hover {
        background: #b91c1c;
        transform: translateY(-1px);
      }

      .login-btn {
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .login-btn:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      .signup-btn {
        background: #059669;
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .signup-btn:hover {
        background: #047857;
      }

      @media (max-width: 1024px) {
        .brand-subtitle {
          display: none;
        }
        
        .nav-item span {
          display: none;
        }
        
        .nav-item {
          padding: 0.5rem;
          min-width: 40px;
          justify-content: center;
        }
        
        .user-details {
          display: none;
        }
      }

      @media (max-width: 768px) {
        .header-content {
          padding: 0 1rem;
        }
        
        .header-center {
          margin: 0 1rem;
        }
        
        .nav-container {
          gap: 0.5rem;
        }
        
        .auth-btn span,
        .logout-btn span {
          display: none;
        }
      }
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
          45deg,
          rgba(16, 185, 129, 0.1) 0%,
          transparent 25%,
          transparent 75%,
          rgba(16, 185, 129, 0.1) 100%
        );
        animation: header-shimmer 8s ease-in-out infinite;
      }

      @keyframes header-shimmer {
        0%, 100% {
          opacity: 0.3;
          transform: translateX(-100%);
        }
        50% {
          opacity: 0.7;
          transform: translateX(100%);
        }
      }

      .header-background {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: 
          radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.5) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(5, 150, 105, 0.4) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(6, 95, 70, 0.4) 0%, transparent 50%),
          linear-gradient(135deg, rgba(16, 185, 129, 0.1), transparent 50%, rgba(16, 185, 129, 0.1));
        animation: background-pulse 6s ease-in-out infinite;
      }

      @keyframes background-pulse {
        0%, 100% {
          opacity: 0.8;
        }
        50% {
          opacity: 1;
        }
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
        left: -50px;
        animation-delay: 0s;
      }

      .orb-2 {
        width: 150px;
        height: 150px;
        background: radial-gradient(circle, rgba(5, 150, 105, 0.3), transparent);
        top: -75px;
        right: 20%;
        animation-delay: 3s;
      }

      .orb-3 {
        width: 180px;
        height: 180px;
        background: radial-gradient(circle, rgba(6, 95, 70, 0.3), transparent);
        bottom: -90px;
        right: -60px;
        animation-delay: 6s;
      }

      @keyframes float-orb {
        0%, 100% { transform: translate(0, 0) scale(1); }
        25% { transform: translate(10px, -10px) scale(1.1); }
        50% { transform: translate(-5px, -20px) scale(0.9); }
        75% { transform: translate(-10px, 5px) scale(1.05); }
      }

      .floating-particles {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
      }

      .particle {
        position: absolute;
        width: 3px;
        height: 3px;
        background: rgba(255, 255, 255, 0.4);
        border-radius: 50%;
        animation: float-particle 8s ease-in-out infinite;
      }

      .particle:nth-child(1) { left: 10%; top: 20%; animation-duration: 8s; }
      .particle:nth-child(2) { left: 20%; top: 60%; animation-duration: 10s; }
      .particle:nth-child(3) { left: 30%; top: 40%; animation-duration: 9s; }
      .particle:nth-child(4) { left: 50%; top: 70%; animation-duration: 11s; }
      .particle:nth-child(5) { left: 70%; top: 30%; animation-duration: 7s; }
      .particle:nth-child(6) { left: 80%; top: 80%; animation-duration: 9s; }
      .particle:nth-child(7) { left: 90%; top: 20%; animation-duration: 8s; }
      .particle:nth-child(8) { left: 95%; top: 50%; animation-duration: 10s; }

      @keyframes float-particle {
        0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
        25% { transform: translateY(-15px) rotate(90deg); opacity: 0.7; }
        50% { transform: translateY(-30px) rotate(180deg); opacity: 1; }
        75% { transform: translateY(-15px) rotate(270deg); opacity: 0.7; }
      }

      .header-content {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        max-width: 1400px;
        margin: 0 auto;
        padding: 24px 32px;
        min-height: 90px;
        z-index: 2;
      }

      .brand-section {
        display: flex;
        align-items: center;
        cursor: pointer;
        text-decoration: none;
        color: white;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .brand-section:hover {
        transform: translateY(-2px);
      }

      .logo-container {
        position: relative;
        width: 56px;
        height: 56px;
        margin-right: 20px;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.1));
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        overflow: hidden;
      }

      .brand-section:hover .logo-container {
        transform: rotate(5deg) scale(1.05);
        box-shadow: 
          0 12px 30px rgba(16, 185, 129, 0.4),
          0 0 60px rgba(16, 185, 129, 0.2),
          inset 0 0 20px rgba(255, 255, 255, 0.1);
      }

      .logo-glow {
        position: absolute;
        top: -50%;
        left: -50%;
        right: -50%;
        bottom: -50%;
        background: radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, transparent 70%);
        opacity: 0;
        transition: all 0.4s ease;
        z-index: -1;
      }

      .logo-pulse {
        position: absolute;
        top: -10px;
        left: -10px;
        right: -10px;
        bottom: -10px;
        border: 2px solid rgba(16, 185, 129, 0.3);
        border-radius: 20px;
        opacity: 0;
        animation: pulse-ring 2s ease-out infinite;
      }

      .brand-section:hover .logo-glow {
        opacity: 1;
        transform: scale(1.2);
      }

      .brand-section:hover .logo-pulse {
        opacity: 1;
      }

      @keyframes pulse-ring {
        0% {
          transform: scale(0.8);
          opacity: 1;
        }
        100% {
          transform: scale(1.4);
          opacity: 0;
        }
      }

      .ai-indicator {
        position: absolute;
        bottom: -2px;
        right: -2px;
        display: flex;
        gap: 2px;
        background: rgba(16, 185, 129, 0.9);
        padding: 2px 4px;
        border-radius: 8px;
        backdrop-filter: blur(10px);
      }

      .ai-dot {
        width: 3px;
        height: 3px;
        background: white;
        border-radius: 50%;
        animation: ai-pulse 1.5s ease-in-out infinite;
      }

      .ai-dot:nth-child(1) { animation-delay: 0s; }
      .ai-dot:nth-child(2) { animation-delay: 0.2s; }
      .ai-dot:nth-child(3) { animation-delay: 0.4s; }

      @keyframes ai-pulse {
        0%, 60%, 100% {
          opacity: 0.3;
          transform: scale(1);
        }
        30% {
          opacity: 1;
          transform: scale(1.2);
        }
      }

      .logo-container svg {
        width: 28px;
        height: 28px;
        color: white;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        z-index: 2;
      }

      .brand-text {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .brand-title {
        font-size: 28px;
        font-weight: 800;
        letter-spacing: -1px;
        line-height: 1;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .ai-text {
        background: linear-gradient(135deg, #10b981 0%, #34d399 50%, #6ee7b7 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        position: relative;
        animation: glow-text 3s ease-in-out infinite;
      }

      .hiring-text {
        background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      @keyframes glow-text {
        0%, 100% {
          filter: brightness(1) drop-shadow(0 0 5px rgba(16, 185, 129, 0.3));
        }
        50% {
          filter: brightness(1.2) drop-shadow(0 0 15px rgba(16, 185, 129, 0.6));
        }
      }

      .brand-subtitle {
        font-size: 12px;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.8);
        letter-spacing: 0.8px;
        line-height: 1;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 4px;
        background: linear-gradient(90deg, rgba(255, 255, 255, 0.8), rgba(16, 185, 129, 0.8), rgba(255, 255, 255, 0.8));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: subtitle-shimmer 4s ease-in-out infinite;
      }

      @keyframes subtitle-shimmer {
        0%, 100% {
          background-position: -200% center;
        }
        50% {
          background-position: 200% center;
        }
      }

      .navigation-menu {
        position: relative;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.06));
        padding: 12px;
        border-radius: 20px;
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.15);
        box-shadow: 
          0 8px 32px rgba(0, 0, 0, 0.15),
          inset 0 1px 0 rgba(255, 255, 255, 0.1),
          0 0 0 1px rgba(16, 185, 129, 0.1);
        overflow: hidden;
      }

      .navigation-menu::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(45deg, transparent 30%, rgba(16, 185, 129, 0.05) 50%, transparent 70%);
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .navigation-menu:hover::before {
        opacity: 1;
      }

      .nav-container {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .nav-item {
        position: relative;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 18px;
        border-radius: 14px;
        text-decoration: none;
        color: rgba(255, 255, 255, 0.9);
        font-size: 14px;
        font-weight: 500;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        overflow: hidden;
        white-space: nowrap;
        z-index: 2;
      }

      .nav-item::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
        transition: left 0.6s ease;
        z-index: -1;
      }

      .nav-item:hover {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(16, 185, 129, 0.1));
        color: white;
        transform: translateY(-2px) scale(1.02);
        box-shadow: 
          0 4px 12px rgba(16, 185, 129, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(16, 185, 129, 0.3);
      }

      .nav-item:hover::before {
        left: 100%;
      }

      .nav-item.active {
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.5), rgba(5, 150, 105, 0.4));
        color: white;
        box-shadow: 
          0 6px 20px rgba(16, 185, 129, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.3),
          0 0 20px rgba(16, 185, 129, 0.2);
        border: 1px solid rgba(16, 185, 129, 0.6);
        transform: translateY(-1px);
        position: relative;
      }

      .nav-item.active::after {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: linear-gradient(45deg, #10b981, #34d399, #10b981);
        border-radius: 16px;
        z-index: -1;
        opacity: 0.3;
        animation: active-glow 2s ease-in-out infinite;
      }

      @keyframes active-glow {
        0%, 100% {
          opacity: 0.3;
          transform: scale(1);
        }
        50% {
          opacity: 0.6;
          transform: scale(1.02);
        }
      }

      .nav-icon-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
      }

      .nav-icon-wrapper i {
        font-size: 16px;
        transition: all 0.3s ease;
        position: relative;
      }

      .nav-item:hover .nav-icon-wrapper i {
        transform: scale(1.2) rotate(5deg);
        filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.6));
      }

      .nav-item.active .nav-icon-wrapper i {
        transform: scale(1.1);
        filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.8));
        animation: icon-pulse 2s ease-in-out infinite;
      }

      @keyframes icon-pulse {
        0%, 100% {
          transform: scale(1.1);
        }
        50% {
          transform: scale(1.2);
        }
      }

      .nav-label {
        font-weight: 500;
        letter-spacing: 0.3px;
      }

      .nav-indicator {
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 0;
        height: 2px;
        background: linear-gradient(90deg, #10b981, #34d399);
        transform: translateX(-50%);
        transition: width 0.3s ease;
        border-radius: 1px;
      }

      .nav-item:hover .nav-indicator {
        width: 80%;
      }

      .nav-item.active .nav-indicator {
        width: 100%;
      }

      .user-section {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .user-profile {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 16px;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
        border-radius: 50px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(20px);
        transition: all 0.3s ease;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }

      .user-profile::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
        transition: left 0.5s ease;
      }

      .user-profile:hover {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
        transform: translateY(-2px);
        box-shadow: 
          0 8px 25px rgba(0, 0, 0, 0.2),
          0 0 20px rgba(16, 185, 129, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.2);
        border-color: rgba(16, 185, 129, 0.4);
      }

      .user-profile:hover::before {
        left: 100%;
      }

      .user-avatar {
        position: relative;
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #10b981, #059669);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }

      .avatar-glow {
        position: absolute;
        top: -3px;
        left: -3px;
        right: -3px;
        bottom: -3px;
        background: linear-gradient(135deg, #34d399, #10b981, #059669);
        border-radius: 50%;
        opacity: 0;
        transition: opacity 0.3s ease;
        animation: pulse-glow 2s ease-in-out infinite;
      }

      .user-profile:hover .avatar-glow {
        opacity: 1;
      }

      @keyframes pulse-glow {
        0% { transform: scale(1); opacity: 0.7; }
        50% { transform: scale(1.05); opacity: 1; }
        100% { transform: scale(1); opacity: 0.7; }
      }

      .user-avatar i {
        font-size: 18px;
        color: white;
        z-index: 2;
        position: relative;
      }

      .user-details {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        line-height: 1.2;
      }

      .user-name {
        font-weight: 600;
        font-size: 14px;
        color: white;
        margin: 0;
      }

      .user-role {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.7);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: 500;
        margin: 0;
      }

      .profile-menu-btn {
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.7);
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.3s ease;
      }

      .profile-menu-btn:hover {
        color: white;
        background: rgba(255, 255, 255, 0.1);
        transform: rotate(180deg);
      }

      .logout-button,
      .auth-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 20px;
        border-radius: 12px;
        text-decoration: none;
        border: none;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(20px);
        position: relative;
        overflow: hidden;
      }

      .logout-button::before,
      .auth-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.6s ease;
      }

      .logout-button {
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.25), rgba(220, 38, 38, 0.15));
        color: #fecaca;
        border: 1px solid rgba(239, 68, 68, 0.4);
      }

      .logout-button:hover {
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.4), rgba(220, 38, 38, 0.3));
        color: white;
        transform: translateY(-2px) scale(1.02);
        box-shadow: 
          0 6px 20px rgba(239, 68, 68, 0.3),
          0 0 20px rgba(239, 68, 68, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.2);
        border-color: rgba(239, 68, 68, 0.6);
      }

      .logout-button:hover::before {
        left: 100%;
      }

      .logout-button i {
        transition: transform 0.3s ease;
      }

      .logout-button:hover i {
        transform: rotate(-10deg) scale(1.1);
      }

      .login-btn {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.25);
      }

      .login-btn:hover {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15));
        transform: translateY(-2px) scale(1.02);
        box-shadow: 
          0 6px 20px rgba(255, 255, 255, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.3);
        border-color: rgba(255, 255, 255, 0.4);
      }

      .login-btn:hover::before {
        left: 100%;
      }

      .signup-btn {
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        border: 1px solid rgba(16, 185, 129, 0.4);
        box-shadow: 
          0 4px 12px rgba(16, 185, 129, 0.3),
          0 0 20px rgba(16, 185, 129, 0.1);
        position: relative;
      }

      .signup-btn::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, #34d399, #10b981);
        opacity: 0;
        transition: opacity 0.3s ease;
        border-radius: 12px;
      }

      .signup-btn:hover {
        transform: translateY(-2px) scale(1.02);
        box-shadow: 
          0 8px 25px rgba(16, 185, 129, 0.4),
          0 0 30px rgba(16, 185, 129, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.2);
        border-color: rgba(16, 185, 129, 0.6);
      }

      .signup-btn:hover::after {
        opacity: 1;
      }

      .signup-btn:hover::before {
        left: 100%;
      }

      .signup-btn span,
      .signup-btn i {
        position: relative;
        z-index: 2;
      }

      @media (max-width: 1024px) {
        .brand-subtitle {
          display: none;
        }
        
        .nav-label {
          display: none;
        }
        
        .nav-item {
          padding: 12px;
          min-width: 44px;
          justify-content: center;
        }
        
        .user-details {
          display: none;
        }
      }

      @media (max-width: 768px) {
        .header-content {
          padding: 16px 20px;
        }
        
        .brand-title {
          font-size: 24px;
        }
        
        .logo-container {
          width: 48px;
          height: 48px;
          margin-right: 16px;
        }
        
        .logo-container svg {
          width: 24px;
          height: 24px;
        }
        
        .navigation-menu {
          padding: 8px;
        }
        
        .nav-container {
          gap: 4px;
        }
        
        .nav-item {
          padding: 10px;
        }
        
        .auth-btn span,
        .logout-button span {
          display: none;
        }
      }
      }

      .logo {
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: 24px;
        font-weight: 800;
        text-decoration: none;
        color: white;
        transition: all 0.3s ease;
        font-family: var(--font-heading);
      }

      .logo:hover {
        transform: scale(1.05);
        filter: brightness(1.1);
      }

      .logo-icon {
        width: 32px;
        height: 32px;
        margin-right: 12px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(10px);
      }

      .logo-icon svg {
        width: 20px;
        height: 20px;
        color: white;
      }

      .logo-text {
        font-weight: 800;
        letter-spacing: -0.5px;
      }

      .nav-menu {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .nav-link {
        color: white;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        border-radius: 8px;
        transition: all 0.3s ease;
        text-decoration: none;
        font-size: 14px;
        font-weight: 500;
        white-space: nowrap;
        margin: 0 2px;
      }

      .nav-link:hover {
        background: rgba(255, 255, 255, 0.15);
        transform: translateY(-1px);
      }

      .nav-link.active {
        background: rgba(255, 255, 255, 0.2);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .nav-icon {
        font-size: 16px;
        display: inline-block;
        width: 18px;
        text-align: center;
      }

      .nav-text {
        font-size: 13px;
        letter-spacing: 0.3px;
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .user-info {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        line-height: 1.2;
      }

      .user-name {
        font-weight: 600;
        font-size: 14px;
      }

      .user-role {
        font-size: 11px;
        opacity: 0.8;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .logout-btn,
      .login-btn,
      .signup-btn {
        padding: 8px 16px;
        border-radius: 8px;
        text-decoration: none;
        border: none;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.3s ease;
      }

      .logout-btn {
        background: rgba(255, 255, 255, 0.1);
        color: white;
      }

      .logout-btn:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      .login-btn {
        background: transparent;
        color: white;
      }

      .signup-btn {
        background: #10b981;
        color: white;
      }

      .signup-btn:hover {
        background: #059669;
      }

      @media (max-width: 768px) {
        .nav-menu {
          gap: 4px;
        }

        .nav-text {
          display: none;
        }

        .nav-link {
          padding: 8px 10px;
          min-width: 40px;
          justify-content: center;
        }

        .user-name {
          display: none;
        }

        .header-container {
          padding: 0 16px;
        }
      }

      @media (max-width: 480px) {
        .nav-menu {
          gap: 2px;
        }

        .nav-link {
          padding: 6px 8px;
        }

        .nav-icon {
          font-size: 14px;
        }
      }
    `,
  ],
})
export class HeaderComponent implements OnInit {
  currentUser: any = null;
  isAuthenticated = false;
  UserRole = UserRole;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  getUserDisplayName(): string {
    if (!this.currentUser) return '';
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const user = this.currentUser;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (user.firstName && user.lastName) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return `${String(user.firstName)} ${String(user.lastName)}`;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return String(user.email || user.username || 'User');
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/']);
  }
}