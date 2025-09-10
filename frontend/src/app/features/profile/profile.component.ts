import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="container"><h1>Profile</h1><p>Profile feature coming soon...</p></div>`,
  styles: [`.container { padding: 24px; }`]
})
export class ProfileComponent {}