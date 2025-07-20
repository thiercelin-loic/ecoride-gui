import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { trigger, transition, style, animate, query, group } from '@angular/animations';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { initializeSmoothLoading } from './shared/utils/smooth-loading';
import { SmoothTransitionService } from './shared/services/smooth-transition.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected title = 'EcoRide - Covoiturage Écologique';
  protected isLoading = true;
  protected loadingComplete = false;
  protected currentRoute = '';
  protected showBackButton = false;
  protected backRoute = '/';
  protected backLabel = 'Retour';

  private router = inject(Router);
  private smoothTransition = inject(SmoothTransitionService);

  ngOnInit() {
    // Initialize smooth loading utilities
    initializeSmoothLoading();
    
    // Smooth loading transition
    setTimeout(() => {
      this.loadingComplete = true;
      // Give time for fade-out animation to complete
      setTimeout(() => {
        this.isLoading = false;
      }, 800); // Match CSS transition duration
    }, 1200); // Slightly longer initial loading time for smoother experience

    // Add page transition animations and handle navigation context
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Update current route
        this.currentRoute = event.url;
        
        // Configure navbar based on route
        this.configureNavbar(event.url);
        
        // Use smooth transition service for navigation
        this.smoothTransition.withTransition(() => {
          // Smooth scroll to top on route change
          this.smoothTransition.smoothScrollTo('body', 0);
        }, 50);
        
        // End any existing transitions
        setTimeout(() => {
          this.smoothTransition.endTransition();
        }, 300);
      });
  }

  private configureNavbar(url: string): void {
    // Reset defaults
    this.showBackButton = false;
    this.backRoute = '/';
    this.backLabel = 'Retour';

    // Configure based on current route
    if (url.includes('/trip/')) {
      this.showBackButton = true;
      this.backRoute = '/search';
      this.backLabel = 'Retour aux résultats';
    } else if (url.includes('/booking/')) {
      this.showBackButton = true;
      this.backRoute = url.replace('/booking/', '/trip/');
      this.backLabel = 'Retour au trajet';
    } else if (url === '/profile' || url === '/messaging') {
      this.showBackButton = true;
      this.backRoute = '/dashboard';
      this.backLabel = 'Retour au tableau de bord';
    } else if (url.includes('/offer/edit/')) {
      this.showBackButton = true;
      this.backRoute = '/dashboard';
      this.backLabel = 'Retour au tableau de bord';
    } else if (url === '/offer/create') {
      this.showBackButton = true;
      this.backRoute = '/';
      this.backLabel = 'Retour à l\'accueil';
    } else if (url.includes('/auth/')) {
      this.showBackButton = true;
      this.backRoute = '/';
      this.backLabel = 'Retour à l\'accueil';
    } else if (url === '/terms' || url === '/privacy') {
      this.showBackButton = true;
      this.backRoute = '/about';
      this.backLabel = 'Retour à À propos';
    }
  }

  // Helper method for route animations
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
