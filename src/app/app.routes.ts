import { Routes } from '@angular/router';

export const routes: Routes = [
  // Home page (US 1 - Landing page)
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'EcoRide - Accueil'
  },
  
  // Authentication routes (US 2 - User registration, US 11 - Login)
  {
    path: 'auth',
    children: [
      {
        path: 'register',
        loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent),
        title: 'EcoRide - Inscription'
      },
      {
        path: 'login',
        loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent),
        title: 'EcoRide - Connexion'
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./pages/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
        title: 'EcoRide - Mot de passe oublié'
      }
    ]
  },
  
  // Search and booking routes (US 3, 4, 5, 6)
  {
    path: 'search',
    loadComponent: () => import('./pages/search/search.component').then(m => m.SearchComponent),
    title: 'EcoRide - Rechercher un covoiturage'
  },
  {
    path: 'trip/:id',
    loadComponent: () => import('./pages/trip-details/trip-details.component').then(m => m.TripDetailsComponent),
    title: 'EcoRide - Détails du trajet'
  },
  {
    path: 'booking/:tripId',
    loadComponent: () => import('./pages/booking/booking.component').then(m => m.BookingComponent),
    title: 'EcoRide - Réservation'
  },
  
  // Driver routes (US 7, 8, 9)
  {
    path: 'offer',
    children: [
      {
        path: 'create',
        loadComponent: () => import('./pages/offer-trip/offer-trip.component').then(m => m.OfferTripComponent),
        title: 'EcoRide - Proposer un trajet'
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./pages/offer-trip/offer-trip.component').then(m => m.OfferTripComponent),
        title: 'EcoRide - Modifier le trajet'
      }
    ]
  },
  
  // Dashboard and profile (US 10, 12, 13)
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    title: 'EcoRide - Tableau de bord'
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    title: 'EcoRide - Mon profil'
  },
  {
    path: 'messaging',
    loadComponent: () => import('./pages/messaging/messaging.component').then(m => m.MessagingComponent),
    title: 'EcoRide - Messages'
  },
  
  // Legal and help pages
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent),
    title: 'EcoRide - À propos'
  },
  {
    path: 'help',
    loadComponent: () => import('./pages/help/help.component').then(m => m.HelpComponent),
    title: 'EcoRide - Aide'
  },
  {
    path: 'terms',
    loadComponent: () => import('./pages/legal/terms/terms.component').then(m => m.TermsComponent),
    title: 'EcoRide - Conditions d\'utilisation'
  },
  {
    path: 'privacy',
    loadComponent: () => import('./pages/legal/privacy/privacy.component').then(m => m.PrivacyComponent),
    title: 'EcoRide - Politique de confidentialité'
  },
  
  // Error routes
  {
    path: '404',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'EcoRide - Page non trouvée'
  },
  
  // Redirect unknown routes to 404
  {
    path: '**',
    redirectTo: '/404'
  }
];
