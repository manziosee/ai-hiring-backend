import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-candidates',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="container"><h1>Candidates</h1><p>Candidates feature coming soon...</p></div>`,
  styles: [`.container { padding: 24px; }`]
})
export class CandidatesComponent {}