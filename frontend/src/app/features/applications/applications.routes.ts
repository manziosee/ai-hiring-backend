import { Routes } from '@angular/router';

export const applicationRoutes: Routes = [
  { path: '', loadComponent: () => import('./applications.component').then(m => m.ApplicationsComponent) }
];