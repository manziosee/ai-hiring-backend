import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar" *ngIf="authService.isAuthenticated()">
      <div class="navbar-container">
        <div class="navbar-brand">
          <a routerLink="/dashboard" class="brand-link">
            <div class="brand-logo">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              </svg>
            </div>
            <span>AI Hiring</span>
          </a>
        </div>

        <div class="navbar-menu">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
            <i class="fas fa-tachometer-alt"></i>
            Dashboard
          </a>
          <a routerLink="/jobs" routerLinkActive="active" class="nav-link">
            <i class="fas fa-briefcase"></i>
            Jobs
          </a>
          <a routerLink="/applications" routerLinkActive="active" class="nav-link">
            <i class="fas fa-file-alt"></i>
            Applications
          </a>
          <a routerLink="/candidates" routerLinkActive="active" class="nav-link" *ngIf="authService.isRecruiter() || authService.isAdmin()">
            <i class="fas fa-users"></i>
            Candidates
          </a>
          <a routerLink="/screening" routerLinkActive="active" class="nav-link" *ngIf="authService.isRecruiter() || authService.isAdmin()">
            <i class="fas fa-search"></i>
            Screening
          </a>
          <a routerLink="/interviews" routerLinkActive="active" class="nav-link">
            <i class="fas fa-calendar"></i>
            Interviews
          </a>
        </div>

        <div class="navbar-user">
          <div class="user-menu" [class.open]="showUserMenu" (click)="toggleUserMenu()">
            <div class="user-avatar">
              <i class="fas fa-user"></i>
            </div>
            <span class="user-name">{{ authService.getCurrentUser()?.fullName }}</span>
            <i class="fas fa-chevron-down"></i>
            
            <div class="user-dropdown" *ngIf="showUserMenu">
              <a routerLink="/profile" class="dropdown-item" (click)="closeUserMenu()">
                <i class="fas fa-user-cog"></i>
                Profile
              </a>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item logout" (click)="logout()">
                <i class="fas fa-sign-out-alt"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }

    .navbar-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 70px;
    }

    .navbar-brand .brand-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: #1a202c;
      font-weight: 700;
      font-size: 1.25rem;
    }

    .brand-logo {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #667eea, #764ba2);
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

    .navbar-menu {
      display: flex;
      gap: 2rem;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      text-decoration: none;
      color: #4a5568;
      font-weight: 500;
      border-radius: 12px;
      transition: all 0.3s ease;
    }

    .nav-link:hover {
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
    }

    .nav-link.active {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
    }

    .user-menu {
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 1rem;
      background: rgba(102, 126, 234, 0.1);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .user-menu:hover {
      background: rgba(102, 126, 234, 0.2);
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .user-name {
      font-weight: 600;
      color: #2d3748;
    }

    .user-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 0.5rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(0, 0, 0, 0.1);
      min-width: 200px;
      overflow: hidden;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      text-decoration: none;
      color: #4a5568;
      background: none;
      border: none;
      width: 100%;
      text-align: left;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .dropdown-item:hover {
      background: #f7fafc;
    }

    .dropdown-item.logout {
      color: #e53e3e;
    }

    .dropdown-divider {
      height: 1px;
      background: #e2e8f0;
      margin: 0.5rem 0;
    }

    @media (max-width: 768px) {
      .navbar-container {
        padding: 0 1rem;
      }

      .navbar-menu {
        display: none;
      }

      .user-name {
        display: none;
      }
    }
  `]
})
export class NavbarComponent {
  showUserMenu = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  closeUserMenu() {
    this.showUserMenu = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
    this.closeUserMenu();
  }
}