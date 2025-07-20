import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Trip {
  id: string;
  departure: string;
  destination: string;
  departureAddress: string;
  destinationAddress: string;
  date: string;
  time: string;
  price: number;
  seatsAvailable: number;
  duration: string;
  distance: string;
  driver: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    reviewCount: number;
    preferences: {
      smoking: boolean;
      pets: boolean;
      music: boolean;
      conversation: string;
    };
  };
  vehicle: {
    make: string;
    model: string;
    color: string;
    year: number;
  };
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="container py-4">
      <div class="row">
        <!-- Booking Form -->
        <div class="col-lg-8 mb-4">
          <div class="card">
            <div class="card-header">
              <h4 class="mb-0">Réserver ce trajet</h4>
            </div>
            <div class="card-body">
              <!-- Trip Summary -->
              <div class="trip-summary mb-4 p-3 bg-light rounded">
                <div class="row align-items-center">
                  <div class="col-md-8">
                    <div class="d-flex align-items-center mb-2">
                      <svg width="20" height="20" class="me-2 text-eco-primary" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z"/>
                        <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
                      </svg>
                      <div>
                        <div class="fw-bold">{{ trip.departure }} → {{ trip.destination }}</div>
                        <small class="text-muted">{{ trip.date }} à {{ trip.time }}</small>
                      </div>
                    </div>
                    <div class="small text-muted">
                      Durée: {{ trip.duration }} • Distance: {{ trip.distance }}
                    </div>
                  </div>
                  <div class="col-md-4 text-md-end">
                    <div class="h4 text-eco-primary mb-0">{{ trip.price }}€</div>
                    <small class="text-muted">par personne</small>
                  </div>
                </div>
              </div>

              <!-- Booking Form -->
              <form [formGroup]="bookingForm" (ngSubmit)="submitBooking()">
                <!-- Passenger Selection -->
                <div class="mb-4">
                  <label class="form-label fw-bold">Nombre de passagers</label>
                  <div class="input-group" style="max-width: 200px;">
                    <button 
                      type="button" 
                      class="btn btn-outline-secondary"
                      (click)="decreasePassengers()"
                      [disabled]="bookingForm.get('passengers')?.value <= 1">
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                      </svg>
                    </button>
                    <input 
                      type="number" 
                      class="form-control text-center"
                      formControlName="passengers"
                      min="1"
                      [max]="trip.seatsAvailable"
                      readonly>
                    <button 
                      type="button" 
                      class="btn btn-outline-secondary"
                      (click)="increasePassengers()"
                      [disabled]="bookingForm.get('passengers')?.value >= trip.seatsAvailable">
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                      </svg>
                    </button>
                  </div>
                  <small class="text-muted">{{ trip.seatsAvailable }} places disponibles</small>
                </div>

                <!-- Pickup Point -->
                <div class="mb-4">
                  <label for="pickupPoint" class="form-label fw-bold">Point de prise en charge</label>
                  <select class="form-select" formControlName="pickupPoint">
                    <option value="">Sélectionnez un point de départ</option>
                    <option value="departure">{{ trip.departureAddress }}</option>
                    <option value="custom">Autre point (à négocier avec le conducteur)</option>
                  </select>
                </div>

                <!-- Drop-off Point -->
                <div class="mb-4">
                  <label for="dropoffPoint" class="form-label fw-bold">Point de dépose</label>
                  <select class="form-select" formControlName="dropoffPoint">
                    <option value="">Sélectionnez un point d'arrivée</option>
                    <option value="destination">{{ trip.destinationAddress }}</option>
                    <option value="custom">Autre point (à négocier avec le conducteur)</option>
                  </select>
                </div>

                <!-- Message to Driver -->
                <div class="mb-4">
                  <label for="message" class="form-label fw-bold">Message au conducteur (optionnel)</label>
                  <textarea 
                    class="form-control" 
                    id="message"
                    formControlName="message"
                    rows="3"
                    placeholder="Présentez-vous au conducteur, mentionnez des bagages volumineux, etc."></textarea>
                  <small class="text-muted">Ce message aidera le conducteur à mieux vous connaître.</small>
                </div>

                <!-- Contact Information -->
                <div class="mb-4">
                  <h6 class="fw-bold">Vos coordonnées</h6>
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label for="contactName" class="form-label">Nom complet *</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        id="contactName"
                        formControlName="contactName">
                    </div>
                    <div class="col-md-6 mb-3">
                      <label for="contactPhone" class="form-label">Téléphone *</label>
                      <input 
                        type="tel" 
                        class="form-control" 
                        id="contactPhone"
                        formControlName="contactPhone">
                    </div>
                  </div>
                </div>

                <!-- Terms -->
                <div class="mb-4">
                  <div class="form-check">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      formControlName="acceptTerms"
                      id="acceptTerms">
                    <label class="form-check-label" for="acceptTerms">
                      J'accepte les <a href="/terms" class="text-eco-primary">conditions d'utilisation</a> 
                      et la <a href="/privacy" class="text-eco-primary">politique de confidentialité</a> *
                    </label>
                  </div>
                </div>

                <!-- Submit Button -->
                <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button 
                    type="button" 
                    class="btn btn-outline-secondary"
                    routerLink="/search">
                    Retour à la recherche
                  </button>
                  <button 
                    type="submit" 
                    class="btn btn-eco-primary btn-lg"
                    [disabled]="bookingForm.invalid || isLoading">
                    <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                    {{ isLoading ? 'Réservation en cours...' : 'Réserver maintenant' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Trip & Driver Details -->
        <div class="col-lg-4">
          <!-- Driver Info -->
          <div class="card mb-4">
            <div class="card-header">
              <h6 class="mb-0">Votre conducteur</h6>
            </div>
            <div class="card-body">
              <div class="d-flex align-items-center mb-3">
                <img 
                  [src]="trip.driver.avatar" 
                  [alt]="trip.driver.name"
                  class="rounded-circle me-3"
                  width="60" 
                  height="60">
                <div>
                  <div class="fw-bold">{{ trip.driver.name }}</div>
                  <div class="d-flex align-items-center">
                    <span class="text-warning me-1">
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                      </svg>
                    </span>
                    <span class="fw-bold">{{ trip.driver.rating }}/5</span>
                    <small class="text-muted ms-1">({{ trip.driver.reviewCount }} avis)</small>
                  </div>
                </div>
              </div>

              <!-- Driver Preferences -->
              <div class="mb-3">
                <small class="text-muted d-block mb-2">Préférences du conducteur:</small>
                <div class="d-flex flex-wrap gap-1">
                  <span class="badge bg-light text-dark border">
                    <svg width="12" height="12" class="me-1" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14z"/>
                    </svg>
                    {{ getConversationLabel(trip.driver.preferences.conversation) }}
                  </span>
                  <span *ngIf="trip.driver.preferences.music" class="badge bg-light text-dark border">
                    <svg width="12" height="12" class="me-1" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M9 13c0 1.105-1.12 2-2.5 2S4 14.105 4 13s1.12-2 2.5-2 2.5.895 2.5 2z"/>
                      <path fill-rule="evenodd" d="M9 3v10a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1z"/>
                    </svg>
                    Musique OK
                  </span>
                  <span *ngIf="trip.driver.preferences.pets" class="badge bg-light text-dark border">
                    <svg width="12" height="12" class="me-1" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M4 4v-.5C4 2.119 5.119 1 6.5 1S9 2.119 9 3.5V4h.5c.881 0 1.6.719 1.6 1.6v8.8c0 .881-.719 1.6-1.6 1.6h-5c-.881 0-1.6-.719-1.6-1.6V5.6C3.4 4.719 4.119 4 5 4h-.5z"/>
                    </svg>
                    Animaux OK
                  </span>
                  <span *ngIf="!trip.driver.preferences.smoking" class="badge bg-light text-dark border">
                    <svg width="12" height="12" class="me-1" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14z"/>
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                    Non fumeur
                  </span>
                </div>
              </div>

              <button class="btn btn-outline-eco-primary btn-sm w-100">
                <svg width="14" height="14" class="me-1" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
                </svg>
                Voir le profil
              </button>
            </div>
          </div>

          <!-- Vehicle Info -->
          <div class="card mb-4">
            <div class="card-header">
              <h6 class="mb-0">Véhicule</h6>
            </div>
            <div class="card-body">
              <div class="d-flex align-items-center">
                <svg width="32" height="32" class="me-3 text-eco-primary" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M4 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm10 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2H6ZM4.862 4.276 3.906 6.19a.51.51 0 0 0 .497.731c.91-.073 2.35-.17 3.597-.17 1.247 0 2.688.097 3.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 10.691 4H5.309a.5.5 0 0 0-.447.276Z"/>
                  <path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679c.033.161.049.325.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.807.807 0 0 0 .381-.404l.792-1.848Z"/>
                </svg>
                <div>
                  <div class="fw-bold">{{ trip.vehicle.make }} {{ trip.vehicle.model }}</div>
                  <div class="text-muted">{{ trip.vehicle.color }} • {{ trip.vehicle.year }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Booking Summary -->
          <div class="card">
            <div class="card-header">
              <h6 class="mb-0">Récapitulatif</h6>
            </div>
            <div class="card-body">
              <div class="d-flex justify-content-between mb-2">
                <span>Prix par personne:</span>
                <span>{{ trip.price }}€</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span>Nombre de passagers:</span>
                <span>{{ bookingForm.get('passengers')?.value || 1 }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span>Frais de service:</span>
                <span>{{ servicesFee }}€</span>
              </div>
              <hr>
              <div class="d-flex justify-content-between fw-bold">
                <span>Total:</span>
                <span class="text-eco-primary">{{ totalPrice }}€</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .btn-eco-primary {
      background-color: var(--eco-primary);
      border-color: var(--eco-primary);
      color: white;
    }
    
    .btn-eco-primary:hover {
      background-color: var(--eco-primary-dark);
      border-color: var(--eco-primary-dark);
      color: white;
    }
    
    .btn-outline-eco-primary {
      color: var(--eco-primary);
      border-color: var(--eco-primary);
    }
    
    .btn-outline-eco-primary:hover {
      background-color: var(--eco-primary);
      border-color: var(--eco-primary);
      color: white;
    }
    
    .text-eco-primary {
      color: var(--eco-primary) !important;
    }
    
    .trip-summary {
      border-left: 4px solid var(--eco-primary);
    }
    
    .card {
      border: none;
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    }
  `]
})
export class BookingComponent implements OnInit {
  trip: Trip = {
    id: '1',
    departure: 'Paris',
    destination: 'Lyon',
    departureAddress: 'Gare de Lyon, Paris 12e',
    destinationAddress: 'Gare Part-Dieu, Lyon 3e',
    date: '20 Juillet 2025',
    time: '08:30',
    price: 35,
    seatsAvailable: 2,
    duration: '4h30',
    distance: '465 km',
    driver: {
      id: '1',
      name: 'Pierre Martin',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      rating: 4.8,
      reviewCount: 23,
      preferences: {
        smoking: false,
        pets: true,
        music: true,
        conversation: 'medium'
      }
    },
    vehicle: {
      make: 'Renault',
      model: 'Mégane',
      color: 'Gris',
      year: 2020
    }
  };

  bookingForm: FormGroup;
  isLoading = false;
  servicesFee = 2.5;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.bookingForm = this.fb.group({
      passengers: [1, [Validators.required, Validators.min(1)]],
      pickupPoint: ['', [Validators.required]],
      dropoffPoint: ['', [Validators.required]],
      message: [''],
      contactName: ['Marie Dupont', [Validators.required]],
      contactPhone: ['06 12 34 56 78', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    });
  }

  ngOnInit() {
    // Get trip ID from route params
    const tripId = this.route.snapshot.paramMap.get('id');
    if (tripId) {
      this.loadTrip(tripId);
    }
  }

  get totalPrice(): number {
    const passengers = this.bookingForm.get('passengers')?.value || 1;
    return (this.trip.price * passengers) + this.servicesFee;
  }

  loadTrip(tripId: string) {
    // In a real app, load trip data from service
    console.log('Loading trip:', tripId);
  }

  increasePassengers() {
    const current = this.bookingForm.get('passengers')?.value || 1;
    if (current < this.trip.seatsAvailable) {
      this.bookingForm.patchValue({ passengers: current + 1 });
    }
  }

  decreasePassengers() {
    const current = this.bookingForm.get('passengers')?.value || 1;
    if (current > 1) {
      this.bookingForm.patchValue({ passengers: current - 1 });
    }
  }

  getConversationLabel(level: string): string {
    switch (level) {
      case 'low': return 'Calme';
      case 'medium': return 'Bavardage modéré';
      case 'high': return 'Bavard';
      default: return level;
    }
  }

  submitBooking() {
    if (this.bookingForm.valid) {
      this.isLoading = true;
      
      setTimeout(() => {
        console.log('Booking submitted:', {
          trip: this.trip,
          booking: this.bookingForm.value,
          totalPrice: this.totalPrice
        });
        
        alert('Votre demande de réservation a été envoyée au conducteur !');
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      }, 2000);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.bookingForm.controls).forEach(key => {
        this.bookingForm.get(key)?.markAsTouched();
      });
    }
  }
}
