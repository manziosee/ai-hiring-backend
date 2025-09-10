import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-interviews',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="container"><h1>Interviews</h1><p>Interviews feature coming soon...</p></div>`,
  styles: [`.container { padding: 24px; }`]
})
export class InterviewsComponent {}