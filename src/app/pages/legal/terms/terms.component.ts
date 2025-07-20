import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container py-5">
      <div class="text-center">
        <h1 class="text-eco-primary">TermsComponent</h1>
        <p class="lead text-muted">Cette page est en cours de développement.</p>
        <a routerLink="/" class="btn btn-primary">Retour à l'accueil</a>
      </div>
    </div>
  `,
  styles: [`
    .container {
      min-height: 60vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class TermsComponent {
}
