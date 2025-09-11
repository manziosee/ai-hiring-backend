import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.dashboardRoutes)
  },
  {
    path: 'jobs',
    canActivate: [authGuard],
    loadChildren: () => import('./features/jobs/jobs.routes').then(m => m.jobRoutes)
  },
  {
    path: 'applications',
    canActivate: [authGuard],
    loadChildren: () => import('./features/applications/applications.routes').then(m => m.applicationRoutes)
  },
  {
    path: 'candidates',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'RECRUITER'] },
    loadChildren: () => import('./features/candidates/candidates.routes').then(m => m.candidateRoutes)
  },
  {
    path: 'screening',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'RECRUITER'] },
    loadChildren: () => import('./features/screening/screening.routes').then(m => m.screeningRoutes)
  },
  {
    path: 'interviews',
    canActivate: [authGuard],
    loadChildren: () => import('./features/interviews/interviews.routes').then(m => m.interviewRoutes)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadChildren: () => import('./features/profile/profile.routes').then(m => m.profileRoutes)
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes)
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];