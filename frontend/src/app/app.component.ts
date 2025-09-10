import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { NavigationComponent } from './core/components/navigation/navigation.component';
import { AuthService } from './core/services/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    NavigationComponent
  ],
  template: `
    <div *ngIf="showNavigation; else noNavLayout">
      <app-navigation>
        <router-outlet></router-outlet>
      </app-navigation>
    </div>
    
    <ng-template #noNavLayout>
      <router-outlet></router-outlet>
    </ng-template>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'AI Hiring Platform';
  showNavigation = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        const navEvent = event as NavigationEnd;
        const hideNavRoutes = ['/', '/auth/login', '/auth/register'];
        this.showNavigation = !hideNavRoutes.includes(navEvent.url) && this.authService.isAuthenticated();
      });
  }
}