import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="container"><h1>Admin Panel</h1><p>Admin features coming soon...</p></div>`,
  styles: [`.container { padding: 24px; }`]
})
export class AdminComponent {}