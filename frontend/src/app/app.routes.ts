import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'jobs',
    loadComponent: () => import('./features/jobs/jobs.component').then(m => m.JobsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'applications',
    loadComponent: () => import('./features/applications/applications.component').then(m => m.ApplicationsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'candidates',
    loadComponent: () => import('./features/candidates/candidates.component').then(m => m.CandidatesComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN', 'RECRUITER'] }
  },
  {
    path: 'screening',
    loadComponent: () => import('./features/screening/screening.component').then(m => m.ScreeningComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN', 'RECRUITER'] }
  },
  {
    path: 'interviews',
    loadComponent: () => import('./features/interviews/interviews.component').then(m => m.InterviewsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];