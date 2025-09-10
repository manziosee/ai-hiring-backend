import { Routes } from '@angular/router';

export const candidateRoutes: Routes = [
  { path: '', loadComponent: () => import('./candidates.component').then(m => m.CandidatesComponent) }
];