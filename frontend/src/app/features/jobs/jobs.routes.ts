import { Routes } from '@angular/router';

export const jobRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./jobs.component').then(m => m.JobsComponent)
  }
];