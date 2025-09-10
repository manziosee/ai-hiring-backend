import { Routes } from '@angular/router';

export const interviewRoutes: Routes = [
  { path: '', loadComponent: () => import('./interviews.component').then(m => m.InterviewsComponent) }
];