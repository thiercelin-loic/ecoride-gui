import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-offer-trip',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <!-- Header -->
          <div class="text-center mb-5">
            <h1 class="h2 text-eco-primary mb-3">Proposer un trajet</h1>
            <p class="lead text-muted">Partagez votre route et réduisez votre empreinte carbone</p>
          </div>

          <!-- Progress Steps -->
          <div class="progress-steps mb-5">
            <div class="d-flex justify-content-between">
              <div class="step" [class.active]="currentStep >= 1" [class.completed]="currentStep > 1">
                <div class="step-circle">1</div>
                <div class="step-label">Itinéraire</div>
              </div>
              <div class="step" [class.active]="currentStep >= 2" [class.completed]="currentStep > 2">
                <div class="step-circle">2</div>
                <div class="step-label">Date & Heure</div>
              </div>
              <div class="step" [class.active]="currentStep >= 3" [class.completed]="currentStep > 3">
                <div class="step-circle">3</div>
                <div class="step-label">Détails</div>
              </div>
              <div class="step" [class.active]="currentStep >= 4">
                <div class="step-circle">4</div>
                <div class="step-label">Confirmation</div>
              </div>
            </div>
          </div>

          <form [formGroup]="tripForm" (ngSubmit)="nextStep()">
            <!-- Step 1: Route -->
            <div *ngIf="currentStep === 1" class="card">
              <div class="card-header">
                <h5 class="mb-0">Étape 1: Définir votre itinéraire</h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-6 mb-4">
                    <label for="departure" class="form-label fw-bold">Ville de départ *</label>
                    <div class="input-group">
                      <span class="input-group-text">
                        <svg width="16" height="16" class="text-eco-primary" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z"/>
                          <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                        </svg>
                      </span>
                      <input 
                        type="text" 
                        class="form-control" 
                        id="departure"
                        formControlName="departure"
                        placeholder="Paris, Lyon, Marseille...">
                    </div>
                  </div>
                  <div class="col-md-6 mb-4">
                    <label for="destination" class="form-label fw-bold">Ville d'arrivée *</label>
                    <div class="input-group">
                      <span class="input-group-text">
                        <svg width="16" height="16" class="text-danger" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z"/>
                          <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
                        </svg>
                      </span>
                      <input 
                        type="text" 
                        class="form-control" 
                        id="destination"
                        formControlName="destination"
                        placeholder="Paris, Lyon, Marseille...">
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-4">
                    <label for="departureAddress" class="form-label">Adresse de départ précise</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="departureAddress"
                      formControlName="departureAddress"
                      placeholder="Gare, aéroport, centre-ville...">
                  </div>
                  <div class="col-md-6 mb-4">
                    <label for="destinationAddress" class="form-label">Adresse d'arrivée précise</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="destinationAddress"
                      formControlName="destinationAddress"
                      placeholder="Gare, aéroport, centre-ville...">
                  </div>
                </div>

                <div class="mb-4">
                  <label for="waypoints" class="form-label">Étapes intermédiaires (optionnel)</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="waypoints"
                    formControlName="waypoints"
                    placeholder="Dijon, Mâcon... (séparées par des virgules)">
                  <small class="text-muted">Mentionnez les villes principales par lesquelles vous passez</small>
                </div>

                <div class="alert alert-info">
                  <svg width="16" height="16" class="me-2" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                  </svg>
                  <strong>Conseil :</strong> Plus votre itinéraire est précis, plus il sera facile pour les passagers de vous trouver !
                </div>
              </div>
            </div>

            <!-- Step 2: Date & Time -->
            <div *ngIf="currentStep === 2" class="card">
              <div class="card-header">
                <h5 class="mb-0">Étape 2: Choisir la date et l'heure</h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-6 mb-4">
                    <label for="date" class="form-label fw-bold">Date du trajet *</label>
                    <input 
                      type="date" 
                      class="form-control" 
                      id="date"
                      formControlName="date"
                      [min]="minDate">
                  </div>
                  <div class="col-md-6 mb-4">
                    <label for="time" class="form-label fw-bold">Heure de départ *</label>
                    <input 
                      type="time" 
                      class="form-control" 
                      id="time"
                      formControlName="time">
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label fw-bold">Flexibilité horaire</label>
                  <div class="mt-2">
                    <div class="form-check">
                      <input class="form-check-input" type="radio" value="none" formControlName="flexibility" id="flex1">
                      <label class="form-check-label" for="flex1">
                        Heure fixe - Je pars exactement à l'heure prévue
                      </label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="radio" value="15min" formControlName="flexibility" id="flex2">
                      <label class="form-check-label" for="flex2">
                        ± 15 minutes - Petit décalage possible
                      </label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="radio" value="30min" formControlName="flexibility" id="flex3">
                      <label class="form-check-label" for="flex3">
                        ± 30 minutes - Flexibilité modérée
                      </label>
                    </div>
                  </div>
                </div>

                <div class="form-check mb-4">
                  <input class="form-check-input" type="checkbox" formControlName="recurring" id="recurring">
                  <label class="form-check-label" for="recurring">
                    <strong>Trajet récurrent</strong> - Je propose ce trajet régulièrement
                  </label>
                </div>
              </div>
            </div>

            <!-- Step 3: Details -->
            <div *ngIf="currentStep === 3" class="card">
              <div class="card-header">
                <h5 class="mb-0">Étape 3: Détails du trajet</h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-4 mb-4">
                    <label for="seats" class="form-label fw-bold">Places disponibles *</label>
                    <select class="form-select" formControlName="seats">
                      <option value="1">1 place</option>
                      <option value="2">2 places</option>
                      <option value="3">3 places</option>
                      <option value="4">4 places</option>
                    </select>
                  </div>
                  <div class="col-md-4 mb-4">
                    <label for="price" class="form-label fw-bold">Prix par passager *</label>
                    <div class="input-group">
                      <input 
                        type="number" 
                        class="form-control" 
                        id="price"
                        formControlName="price"
                        min="5"
                        max="100"
                        placeholder="25">
                      <span class="input-group-text">€</span>
                    </div>
                    <small class="text-muted">Prix recommandé: {{ suggestedPrice }}€</small>
                  </div>
                  <div class="col-md-4 mb-4">
                    <label for="distance" class="form-label">Distance estimée</label>
                    <div class="input-group">
                      <input 
                        type="number" 
                        class="form-control" 
                        id="distance"
                        formControlName="distance"
                        placeholder="350">
                      <span class="input-group-text">km</span>
                    </div>
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label fw-bold">Préférences pour ce trajet</label>
                  <div class="row mt-3">
                    <div class="col-md-6">
                      <div class="form-check mb-2">
                        <input class="form-check-input" type="checkbox" formControlName="smokingAllowed" id="smoking">
                        <label class="form-check-label" for="smoking">
                          Fumeur autorisé
                        </label>
                      </div>
                      <div class="form-check mb-2">
                        <input class="form-check-input" type="checkbox" formControlName="petsAllowed" id="pets">
                        <label class="form-check-label" for="pets">
                          Animaux autorisés
                        </label>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-check mb-2">
                        <input class="form-check-input" type="checkbox" formControlName="musicAllowed" id="music">
                        <label class="form-check-label" for="music">
                          Musique pendant le trajet
                        </label>
                      </div>
                      <div class="form-check mb-2">
                        <input class="form-check-input" type="checkbox" formControlName="luggageSpace" id="luggage">
                        <label class="form-check-label" for="luggage">
                          Espace pour bagages volumineux
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mb-4">
                  <label for="description" class="form-label fw-bold">Description du trajet (optionnel)</label>
                  <textarea 
                    class="form-control" 
                    id="description"
                    formControlName="description"
                    rows="4"
                    placeholder="Décrivez votre trajet, mentionnez des particularités, votre véhicule, etc."></textarea>
                  <small class="text-muted">Aidez les passagers à mieux comprendre votre offre</small>
                </div>

                <div class="alert alert-warning">
                  <svg width="16" height="16" class="me-2" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                  </svg>
                  <strong>Important :</strong> Le covoiturage est un partage de frais, pas un service commercial. Le prix doit couvrir une partie des frais du trajet (essence, péages, usure).
                </div>
              </div>
            </div>

            <!-- Step 4: Confirmation -->
            <div *ngIf="currentStep === 4" class="card">
              <div class="card-header">
                <h5 class="mb-0">Étape 4: Confirmation</h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-8">
                    <h6 class="fw-bold mb-3">Récapitulatif de votre trajet</h6>
                    
                    <div class="trip-summary p-3 bg-light rounded mb-4">
                      <div class="row">
                        <div class="col-md-6 mb-3">
                          <strong>Itinéraire :</strong><br>
                          {{ tripForm.get('departure')?.value }} → {{ tripForm.get('destination')?.value }}
                        </div>
                        <div class="col-md-6 mb-3">
                          <strong>Date & Heure :</strong><br>
                          {{ formatDate(tripForm.get('date')?.value) }} à {{ tripForm.get('time')?.value }}
                        </div>
                        <div class="col-md-6 mb-3">
                          <strong>Places disponibles :</strong><br>
                          {{ tripForm.get('seats')?.value }} passager(s)
                        </div>
                        <div class="col-md-6 mb-3">
                          <strong>Prix par passager :</strong><br>
                          {{ tripForm.get('price')?.value }}€
                        </div>
                      </div>
                    </div>

                    <div class="form-check mb-4">
                      <input class="form-check-input" type="checkbox" formControlName="acceptTerms" id="terms">
                      <label class="form-check-label" for="terms">
                        J'accepte les <a href="/terms" class="text-eco-primary">conditions d'utilisation</a> 
                        et la <a href="/privacy" class="text-eco-primary">politique de confidentialité</a> *
                      </label>
                    </div>

                    <div class="form-check mb-4">
                      <input class="form-check-input" type="checkbox" formControlName="notifications" id="notifications">
                      <label class="form-check-label" for="notifications">
                        Je souhaite recevoir des notifications pour ce trajet
                      </label>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="card bg-eco-light">
                      <div class="card-body text-center">
                        <h6 class="card-title">Impact écologique</h6>
                        <div class="eco-impact">
                          <div class="mb-2">
                            <svg width="24" height="24" class="text-success" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM8 1.5a6.5 6.5 0 0 1 4.484 11.3A6.5 6.5 0 0 1 8 1.5z"/>
                            </svg>
                          </div>
                          <div class="fw-bold text-success">{{ estimatedCO2Saving }} kg</div>
                          <small class="text-muted">de CO₂ économisés</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="d-flex justify-content-between mt-4">
              <button 
                type="button" 
                class="btn btn-outline-secondary"
                (click)="previousStep()"
                [disabled]="currentStep === 1">
                <svg width="16" height="16" class="me-1" fill="currentColor" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                </svg>
                Précédent
              </button>
              
              <button 
                type="submit" 
                class="btn btn-eco-primary"
                [disabled]="!isStepValid(currentStep) || (currentStep === 4 && isLoading)">
                <span *ngIf="isLoading && currentStep === 4" class="spinner-border spinner-border-sm me-2" role="status"></span>
                <span *ngIf="currentStep < 4">
                  Suivant
                  <svg width="16" height="16" class="ms-1" fill="currentColor" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                  </svg>
                </span>
                <span *ngIf="currentStep === 4">
                  {{ isLoading ? 'Publication en cours...' : 'Publier le trajet' }}
                </span>
              </button>
            </div>
          </form>
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
    
    .text-eco-primary {
      color: var(--eco-primary) !important;
    }
    
    .bg-eco-light {
      background-color: rgba(76, 175, 80, 0.1);
    }
    
    .progress-steps {
      padding: 0 2rem;
    }
    
    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      flex: 1;
    }
    
    .step:not(:last-child)::after {
      content: '';
      position: absolute;
      top: 16px;
      left: 50%;
      width: 100%;
      height: 2px;
      background-color: #dee2e6;
      z-index: 1;
    }
    
    .step.completed:not(:last-child)::after {
      background-color: var(--eco-primary);
    }
    
    .step-circle {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: #dee2e6;
      color: #6c757d;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      position: relative;
      z-index: 2;
      margin-bottom: 8px;
    }
    
    .step.active .step-circle {
      background-color: var(--eco-primary);
      color: white;
    }
    
    .step.completed .step-circle {
      background-color: var(--eco-primary);
      color: white;
    }
    
    .step-label {
      font-size: 0.875rem;
      color: #6c757d;
      text-align: center;
    }
    
    .step.active .step-label {
      color: var(--eco-primary);
      font-weight: 600;
    }
    
    .trip-summary {
      border-left: 4px solid var(--eco-primary);
    }
    
    .card {
      border: none;
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    }
    
    .eco-impact {
      padding: 1rem;
    }
  `]
})
export class OfferTripComponent implements OnInit {
  currentStep = 1;
  tripForm: FormGroup;
  isLoading = false;
  minDate = new Date().toISOString().split('T')[0];
  suggestedPrice = 25;
  estimatedCO2Saving = 45;

  constructor(private fb: FormBuilder, private router: Router) {
    this.tripForm = this.fb.group({
      // Step 1: Route
      departure: ['', [Validators.required]],
      destination: ['', [Validators.required]],
      departureAddress: [''],
      destinationAddress: [''],
      waypoints: [''],
      
      // Step 2: Date & Time
      date: ['', [Validators.required]],
      time: ['', [Validators.required]],
      flexibility: ['none'],
      recurring: [false],
      
      // Step 3: Details
      seats: [2, [Validators.required]],
      price: [25, [Validators.required, Validators.min(5)]],
      distance: [''],
      smokingAllowed: [false],
      petsAllowed: [false],
      musicAllowed: [true],
      luggageSpace: [false],
      description: [''],
      
      // Step 4: Confirmation
      acceptTerms: [false, [Validators.requiredTrue]],
      notifications: [true]
    });
  }

  ngOnInit() {
    // Set minimum date to today
    this.tripForm.patchValue({ date: this.minDate });
  }

  nextStep() {
    if (this.currentStep < 4 && this.isStepValid(this.currentStep)) {
      this.currentStep++;
    } else if (this.currentStep === 4) {
      this.submitTrip();
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  isStepValid(step: number): boolean {
    switch (step) {
      case 1:
        return !!(this.tripForm.get('departure')?.valid && this.tripForm.get('destination')?.valid);
      case 2:
        return !!(this.tripForm.get('date')?.valid && this.tripForm.get('time')?.valid);
      case 3:
        return !!(this.tripForm.get('seats')?.valid && this.tripForm.get('price')?.valid);
      case 4:
        return !!(this.tripForm.get('acceptTerms')?.valid);
      default:
        return false;
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  submitTrip() {
    if (this.tripForm.valid) {
      this.isLoading = true;
      
      setTimeout(() => {
        console.log('Trip submitted:', this.tripForm.value);
        alert('Votre trajet a été publié avec succès !');
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      }, 2000);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.tripForm.controls).forEach(key => {
        this.tripForm.get(key)?.markAsTouched();
      });
    }
  }
}
