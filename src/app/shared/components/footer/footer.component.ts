import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Footer -->
    <footer class="footer-eco">
      <div class="container">
        <div class="row g-4">
          <div class="col-lg-4">
            <div class="d-flex align-items-center mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="32px"
                viewBox="0 -960 960 960"
                width="32px"
                fill="currentColor"
                class="me-2"
              >
                <path
                  d="M216-176q-45-45-70.5-104T120-402q0-63 24-124.5T222-642q35-35 86.5-60t122-39.5Q501-756 591.5-759t202.5 7q8 106 5 195t-16.5 160.5q-13.5 71.5-38 125T684-182q-53 53-112.5 77.5T450-80q-65 0-127-25.5T216-176Zm112-16q29 17 59.5 24.5T450-160q46 0 91-18.5t86-59.5q18-18 36.5-50.5t32-85Q709-426 716-500.5t2-177.5q-49-2-110.5-1.5T485-670q-61 9-116 29t-90 55q-45 45-62 89t-17 85q0 59 22.5 103.5T262-246q42-80 111-153.5T534-520q-72 63-125.5 142.5T328-192Zm0 0Zm0 0Z"
                />
              </svg>
              <span class="h4 mb-0">EcoRide</span>
            </div>
            <p class="mb-3">La plateforme de covoiturage qui respecte la planète et votre budget.</p>
            <div class="d-flex gap-3">
              <a href="#" class="text-white" aria-label="Twitter">
                <svg width="24" height="24" fill="currentColor">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" class="text-white" aria-label="Facebook">
                <svg width="24" height="24" fill="currentColor">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" class="text-white" aria-label="Instagram">
                <svg width="24" height="24" fill="currentColor">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.749.099.12.112.225.085.346-.093.394-.402 1.394-.402 1.394-.051.225-.165.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378 0 0-.599 2.282-.744 2.840-.282 1.084-1.064 2.456-1.549 3.235C9.584 23.815 10.77 24.001 12.017 24.001c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div class="col-lg-2 col-md-6">
            <h5 class="mb-3">Navigation</h5>
            <ul class="list-unstyled">
              <li class="mb-2"><a routerLink="/">Accueil</a></li>
              <li class="mb-2"><a routerLink="/search">Rechercher</a></li>
              <li class="mb-2"><a routerLink="/offer/create">Proposer</a></li>
              <li class="mb-2"><a routerLink="/about">À propos</a></li>
            </ul>
          </div>
          
          <div class="col-lg-2 col-md-6">
            <h5 class="mb-3">Compte</h5>
            <ul class="list-unstyled">
              <li class="mb-2"><a routerLink="/auth/register">S'inscrire</a></li>
              <li class="mb-2"><a routerLink="/auth/login">Se connecter</a></li>
              <li class="mb-2"><a routerLink="/dashboard">Tableau de bord</a></li>
              <li class="mb-2"><a routerLink="/profile">Mon profil</a></li>
            </ul>
          </div>
          
          <div class="col-lg-2 col-md-6">
            <h5 class="mb-3">Support</h5>
            <ul class="list-unstyled">
              <li class="mb-2"><a routerLink="/help">Centre d'aide</a></li>
              <li class="mb-2"><a href="mailto:contact@ecoride.fr">Contact</a></li>
              <li class="mb-2"><a routerLink="/terms">CGU</a></li>
              <li class="mb-2"><a routerLink="/privacy">Confidentialité</a></li>
            </ul>
          </div>
          
          <div class="col-lg-2 col-md-6">
            <h5 class="mb-3">Impact</h5>
            <ul class="list-unstyled">
              <li class="mb-2">{{ stats.totalTrips | number }} trajets</li>
              <li class="mb-2">{{ stats.co2Saved | number }} kg CO2 économisés</li>
              <li class="mb-2">{{ stats.activeUsers | number }} utilisateurs</li>
              <li class="mb-2">{{ stats.citiesCovered | number }} villes</li>
            </ul>
          </div>
        </div>
        
        <hr class="my-4">
        
        <div class="row align-items-center">
          <div class="col-md-6">
            <p class="mb-0">&copy; 2024 EcoRide. Tous droits réservés.</p>
          </div>
          <div class="col-md-6 text-md-end">
            <p class="mb-0">Fait avec ❤️ pour la planète</p>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer-eco {
      background-color: var(--eco-primary-dark);
      color: white;
      padding: 3rem 0 1rem;
    }
    
    .footer-eco a {
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      transition: color var(--eco-transition-fast);
    }
    
    .footer-eco a:hover {
      color: white;
    }
    
    .footer-eco h5 {
      color: white;
      font-weight: 600;
    }
    
    .footer-eco .list-unstyled a {
      font-size: 0.9rem;
    }
  `]
})
export class FooterComponent {
  // Statistics for the footer
  stats = {
    totalTrips: 12547,
    co2Saved: 8943,
    activeUsers: 45321,
    citiesCovered: 1250
  };
}
