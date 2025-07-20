import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-trip-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container py-5" id="main-content">
      <div class="row">
        <div class="col-lg-8">
          <!-- Trip Header -->
          <div class="eco-card p-4 mb-4">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h1 class="h3 text-eco-primary mb-1">{{ trip.from }} → {{ trip.to }}</h1>
                <div class="text-muted">
                  <svg width="16" height="16" fill="currentColor" class="me-1">
                    <path d="M9 11H7v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6v4z"/>
                  </svg>
                  {{ trip.date }} à {{ trip.time }} • {{ trip.duration }}
                </div>
              </div>
              <div class="text-end">
                <div class="display-6 fw-bold text-eco-primary">{{ trip.price }}€</div>
                <small class="text-muted">par personne</small>
              </div>
            </div>
            
            <!-- Trip Route -->
            <div class="row g-3 mb-4">
              <div class="col-6">
                <div class="d-flex align-items-center">
                  <div class="route-point departure me-3"></div>
                  <div>
                    <div class="fw-medium">{{ trip.departureLocation }}</div>
                    <small class="text-muted">{{ trip.time }}</small>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div class="d-flex align-items-center">
                  <div class="route-point arrival me-3"></div>
                  <div>
                    <div class="fw-medium">{{ trip.arrivalLocation }}</div>
                    <small class="text-muted">{{ trip.arrivalTime }}</small>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Trip Tags -->
            <div class="d-flex gap-2 flex-wrap mb-3">
              <span class="eco-badge" *ngFor="let tag of trip.tags">{{ tag }}</span>
            </div>
            
            <!-- Driver Info -->
            <div class="border-top pt-3">
              <div class="d-flex align-items-center">
                <div class="driver-avatar me-3">
                  {{ trip.driver.name.charAt(0) }}
                </div>
                <div class="flex-grow-1">
                  <div class="d-flex align-items-center">
                    <span class="fw-medium fs-5">{{ trip.driver.name }}</span>
                    <span *ngIf="trip.driver.verified" class="eco-badge ms-2">
                      <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05L7.477 10.57a.75.75 0 0 1-1.06-.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l1.665 1.665 4.660-4.699z"/>
                      </svg>
                      Conducteur vérifié
                    </span>
                  </div>
                  <div class="rating-stars mb-2">
                    <span *ngFor="let star of [1,2,3,4,5]" 
                          [class]="star <= trip.driver.rating ? 'text-warning' : 'text-muted'">★</span>
                    <span class="ms-1 text-muted">({{ trip.driver.rating }} • {{ trip.driver.reviewsCount }} avis)</span>
                  </div>
                  <p class="text-muted mb-0">{{ trip.driver.bio }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Car Information -->
          <div class="eco-card p-4 mb-4">
            <h4 class="h5 mb-3 text-eco-primary">
              <svg width="20" height="20" fill="currentColor" class="me-2">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H16V4c0-.55-.45-1-1-1h-2c-.55 0-1 .45-1 1v1H8V4c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1v1H2.5c-.66 0-1.22.42-1.42 1.01L0 8v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1V8l-1.08-1.99zM6.5 12C5.67 12 5 11.33 5 10.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm7 0c-.83 0-1.5-.67-1.5-1.5S12.67 9 13.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 7l1.5-1.5h7L15 7H5z"/>
              </svg>
              Véhicule
            </h4>
            <div class="row align-items-center">
              <div class="col-md-8">
                <h5 class="mb-1">{{ trip.car.model }}</h5>
                <p class="text-muted mb-2">{{ trip.car.color }} • {{ trip.car.year }}</p>
                <div class="d-flex gap-3">
                  <span class="text-muted">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16" class="me-1">
                      <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/>
                    </svg>
                    {{ trip.seatsTotal }} places
                  </span>
                  <span class="text-success fw-medium">
                    {{ trip.seatsAvailable }} disponibles
                  </span>
                </div>
              </div>
              <div class="col-md-4 text-md-end">
                <div class="car-image bg-light rounded d-flex align-items-center justify-content-center" style="height: 80px;">
                  <svg width="60" height="40" fill="var(--eco-primary)">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H16V4c0-.55-.45-1-1-1h-2c-.55 0-1 .45-1 1v1H8V4c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1v1H2.5c-.66 0-1.22.42-1.42 1.01L0 8v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1V8l-1.08-1.99zM6.5 12C5.67 12 5 11.33 5 10.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm7 0c-.83 0-1.5-.67-1.5-1.5S12.67 9 13.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 7l1.5-1.5h7L15 7H5z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Additional Information -->
          <div class="eco-card p-4">
            <h4 class="h5 mb-3 text-eco-primary">Informations supplémentaires</h4>
            <div class="row g-3">
              <div class="col-md-6">
                <h6>Règles du trajet</h6>
                <ul class="list-unstyled mb-0">
                  <li class="mb-1" *ngFor="let rule of trip.rules">
                    <svg width="12" height="12" fill="var(--eco-success)" class="me-2" viewBox="0 0 16 16">
                      <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05L7.477 10.57a.75.75 0 0 1-1.06-.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l1.665 1.665 4.660-4.699z"/>
                    </svg>
                    {{ rule }}
                  </li>
                </ul>
              </div>
              <div class="col-md-6">
                <h6>Détails pratiques</h6>
                <ul class="list-unstyled mb-0">
                  <li class="mb-1">
                    <strong>Bagages :</strong> {{ trip.luggageInfo }}
                  </li>
                  <li class="mb-1">
                    <strong>Arrêts :</strong> {{ trip.stops }}
                  </li>
                  <li class="mb-1">
                    <strong>Réservation :</strong> {{ trip.bookingPolicy }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Booking Sidebar -->
        <div class="col-lg-4">
          <div class="eco-card p-4 sticky-top" style="top: 100px;">
            <h4 class="h5 mb-3 text-eco-primary">Réserver ce trajet</h4>
            
            <!-- Passenger Selection -->
            <div class="mb-3">
              <label class="form-label">Nombre de passagers</label>
              <select class="form-select" [(ngModel)]="selectedPassengers">
                <option value="1">1 passager</option>
                <option value="2" *ngIf="trip.seatsAvailable >= 2">2 passagers</option>
                <option value="3" *ngIf="trip.seatsAvailable >= 3">3 passagers</option>
                <option value="4" *ngIf="trip.seatsAvailable >= 4">4 passagers</option>
              </select>
            </div>
            
            <!-- Price Calculation -->
            <div class="mb-4">
              <div class="d-flex justify-content-between mb-2">
                <span>{{ selectedPassengers }} passager{{ selectedPassengers > 1 ? 's' : '' }}</span>
                <span>{{ trip.price * selectedPassengers }}€</span>
              </div>
              <div class="d-flex justify-content-between fw-bold border-top pt-2">
                <span>Total</span>
                <span class="text-eco-primary">{{ trip.price * selectedPassengers }}€</span>
              </div>
            </div>
            
            <!-- Booking Button -->
            <button class="btn btn-primary w-100 mb-3" routerLink="/booking/{{ trip.id }}">
              <svg width="20" height="20" fill="currentColor" class="me-2">
                <path d="M9 11H7v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6v4z"/>
              </svg>
              Réserver maintenant
            </button>
            
            <!-- Contact Driver -->
            <button class="btn btn-outline-primary w-100 mb-3">
              <svg width="20" height="20" fill="currentColor" class="me-2">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
              Contacter le conducteur
            </button>
            
            <!-- Trust Indicators -->
            <div class="border-top pt-3 mt-3">
              <h6 class="mb-2">Sécurité & Confiance</h6>
              <div class="d-flex align-items-center mb-2">
                <svg width="16" height="16" fill="var(--eco-success)" class="me-2" viewBox="0 0 16 16">
                  <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05L7.477 10.57a.75.75 0 0 1-1.06-.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l1.665 1.665 4.660-4.699z"/>
                </svg>
                <small>Identité vérifiée</small>
              </div>
              <div class="d-flex align-items-center mb-2">
                <svg width="16" height="16" fill="var(--eco-success)" class="me-2" viewBox="0 0 16 16">
                  <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05L7.477 10.57a.75.75 0 0 1-1.06-.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l1.665 1.665 4.660-4.699z"/>
                </svg>
                <small>Numéro de téléphone vérifié</small>
              </div>
              <div class="d-flex align-items-center">
                <svg width="16" height="16" fill="var(--eco-success)" class="me-2" viewBox="0 0 16 16">
                  <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05L7.477 10.57a.75.75 0 0 1-1.06-.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l1.665 1.665 4.660-4.699z"/>
                </svg>
                <small>Expérience de conduite confirmée</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .route-point {
      width: 12px;
      height: 12px;
      border-radius: 6px;
      flex-shrink: 0;
    }
    
    .route-point.departure {
      background-color: var(--eco-primary);
    }
    
    .route-point.arrival {
      background-color: var(--eco-secondary);
    }
    
    .driver-avatar {
      width: 60px;
      height: 60px;
      border-radius: 16px;
      background: linear-gradient(135deg, var(--eco-primary), var(--eco-primary-light));
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 1.5rem;
    }
    
    .sticky-top {
      top: 100px !important;
    }
    
    @media (max-width: 991px) {
      .sticky-top {
        position: relative !important;
        top: auto !important;
      }
    }
  `]
})
export class TripDetailsComponent implements OnInit {
  tripId: string = '';
  selectedPassengers: number = 1;
  
  // Mock trip data - would come from a service
  trip = {
    id: '1',
    from: 'Paris',
    to: 'Lyon',
    date: '20 janvier 2024',
    time: '08:30',
    arrivalTime: '13:00',
    duration: '4h30',
    price: 25,
    departureLocation: 'Gare de Lyon, Paris 12e',
    arrivalLocation: 'Gare Part-Dieu, Lyon 3e',
    seatsTotal: 4,
    seatsAvailable: 2,
    driver: {
      name: 'Marie Dubois',
      rating: 4.8,
      reviewsCount: 47,
      verified: true,
      bio: 'Conductrice expérimentée, j\'effectue régulièrement le trajet Paris-Lyon pour le travail. Véhicule confortable et conduite paisible.'
    },
    car: {
      model: 'Renault Clio',
      color: 'Bleu',
      year: '2020'
    },
    tags: ['Non-fumeur', 'Animaux acceptés', 'Musique OK', 'Climatisation'],
    rules: [
      'Ponctualité exigée (5 min de retard max)',
      'Pas de tabac dans le véhicule',
      'Respect mutuel et convivialité'
    ],
    luggageInfo: '1 bagage cabine par personne',
    stops: 'Arrêt possible à Mâcon (+10€)',
    bookingPolicy: 'Confirmation instantanée'
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.tripId = this.route.snapshot.paramMap.get('id') || '1';
    // Here you would typically load the trip data based on tripId
  }
}
