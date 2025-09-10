import { Routes } from '@angular/router';

export const screeningRoutes: Routes = [
  { path: '', loadComponent: () => import('./screening.component').then(m => m.ScreeningComponent) }
];