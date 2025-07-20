import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  birthDate: string;
  profileImage: string;
  preferences: {
    smoking: boolean;
    pets: boolean;
    music: boolean;
    conversation: 'low' | 'medium' | 'high';
  };
  vehicle?: {
    make: string;
    model: string;
    year: number;
    color: string;
    plate: string;
    seats: number;
  };
  stats: {
    totalTrips: number;
    rating: number;
    reviewCount: number;
    memberSince: string;
    co2Saved: number;
  };
  verifications: {
    phone: boolean;
    email: boolean;
    identity: boolean;
    license: boolean;
  };
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="container py-4">
      <div class="row">
        <!-- Profile Sidebar -->
        <div class="col-lg-4 mb-4">
          <div class="card">
            <div class="card-body text-center">
              <div class="position-relative d-inline-block mb-3">
                <img 
                  [src]="user.profileImage" 
                  [alt]="user.firstName + ' ' + user.lastName"
                  class="rounded-circle profile-image"
                  width="120" 
                  height="120">
                <button 
                  class="btn btn-sm btn-eco-primary position-absolute bottom-0 end-0 rounded-circle"
                  (click)="changeProfileImage()"
                  style="width: 30px; height: 30px; padding: 0;">
                  <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                  </svg>
                </button>
              </div>
              
              <h4 class="mb-1">{{ user.firstName }} {{ user.lastName }}</h4>
              <p class="text-muted mb-3">Membre depuis {{ user.stats.memberSince }}</p>
              
              <!-- Rating -->
              <div class="d-flex justify-content-center align-items-center mb-3">
                <div class="me-2">
                  <span *ngFor="let star of [1,2,3,4,5]" class="text-warning">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path [attr.d]="star <= user.stats.rating ? 'M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z' : 'M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.576-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z'"/>
                    </svg>
                  </span>
                </div>
                <span class="fw-bold">{{ user.stats.rating }}/5</span>
                <small class="text-muted ms-1">({{ user.stats.reviewCount }} avis)</small>
              </div>

              <!-- Verification Badges -->
              <div class="d-flex justify-content-center gap-2 mb-3">
                <span 
                  *ngIf="user.verifications.phone"
                  class="badge bg-success"
                  title="Téléphone vérifié">
                  <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
                  </svg>
                  Téléphone
                </span>
                <span 
                  *ngIf="user.verifications.email"
                  class="badge bg-success"
                  title="Email vérifié">
                  <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Z"/>
                  </svg>
                  Email
                </span>
                <span 
                  *ngIf="user.verifications.identity"
                  class="badge bg-success"
                  title="Identité vérifiée">
                  <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
                  </svg>
                  Identité
                </span>
              </div>

              <!-- Stats -->
              <div class="row text-center">
                <div class="col-4">
                  <div class="fw-bold text-eco-primary">{{ user.stats.totalTrips }}</div>
                  <small class="text-muted">Trajets</small>
                </div>
                <div class="col-4">
                  <div class="fw-bold text-success">{{ user.stats.co2Saved }}kg</div>
                  <small class="text-muted">CO₂ évité</small>
                </div>
                <div class="col-4">
                  <div class="fw-bold text-info">{{ user.stats.reviewCount }}</div>
                  <small class="text-muted">Avis</small>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="card mt-3">
            <div class="card-header">
              <h6 class="mb-0">Actions rapides</h6>
            </div>
            <div class="card-body">
              <div class="d-grid gap-2">
                <button class="btn btn-outline-eco-primary btn-sm">
                  <svg width="14" height="14" class="me-1" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                  </svg>
                  Supprimer le compte
                </button>
                <button class="btn btn-outline-secondary btn-sm">
                  <svg width="14" height="14" class="me-1" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8.5 1.5A1.5 1.5 0 0 0 7 0a1.5 1.5 0 0 0-1.5 1.5v1H4a.5.5 0 0 0 0 1v9a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V3.5a.5.5 0 0 0 0-1h-1.5v-1z"/>
                  </svg>
                  Télécharger mes données
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Profile Content -->
        <div class="col-lg-8">
          <!-- Navigation Tabs -->
          <ul class="nav nav-tabs mb-4">
            <li class="nav-item">
              <button 
                class="nav-link"
                [class.active]="activeTab === 'personal'"
                (click)="activeTab = 'personal'">
                Informations personnelles
              </button>
            </li>
            <li class="nav-item">
              <button 
                class="nav-link"
                [class.active]="activeTab === 'preferences'"
                (click)="activeTab = 'preferences'">
                Préférences
              </button>
            </li>
            <li class="nav-item">
              <button 
                class="nav-link"
                [class.active]="activeTab === 'vehicle'"
                (click)="activeTab = 'vehicle'">
                Mon véhicule
              </button>
            </li>
            <li class="nav-item">
              <button 
                class="nav-link"
                [class.active]="activeTab === 'security'"
                (click)="activeTab = 'security'">
                Sécurité
              </button>
            </li>
          </ul>

          <!-- Personal Information Tab -->
          <div *ngIf="activeTab === 'personal'" class="card">
            <div class="card-header">
              <h5 class="mb-0">Informations personnelles</h5>
            </div>
            <div class="card-body">
              <form [formGroup]="personalForm" (ngSubmit)="savePersonalInfo()">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="firstName" class="form-label">Prénom *</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="firstName"
                      formControlName="firstName">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="lastName" class="form-label">Nom *</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="lastName"
                      formControlName="lastName">
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="email" class="form-label">Email *</label>
                    <input 
                      type="email" 
                      class="form-control" 
                      id="email"
                      formControlName="email">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="phone" class="form-label">Téléphone *</label>
                    <input 
                      type="tel" 
                      class="form-control" 
                      id="phone"
                      formControlName="phone">
                  </div>
                </div>

                <div class="mb-3">
                  <label for="bio" class="form-label">Bio</label>
                  <textarea 
                    class="form-control" 
                    id="bio" 
                    rows="3"
                    formControlName="bio"
                    placeholder="Parlez-nous de vous..."></textarea>
                  <div class="form-text">Décrivez-vous en quelques mots pour que les autres utilisateurs apprennent à vous connaître.</div>
                </div>

                <div class="mb-3">
                  <label for="birthDate" class="form-label">Date de naissance</label>
                  <input 
                    type="date" 
                    class="form-control" 
                    id="birthDate"
                    formControlName="birthDate">
                </div>

                <button type="submit" class="btn btn-eco-primary">
                  Sauvegarder les modifications
                </button>
              </form>
            </div>
          </div>

          <!-- Preferences Tab -->
          <div *ngIf="activeTab === 'preferences'" class="card">
            <div class="card-header">
              <h5 class="mb-0">Préférences de voyage</h5>
            </div>
            <div class="card-body">
              <form [formGroup]="preferencesForm" (ngSubmit)="savePreferences()">
                <div class="mb-4">
                  <label class="form-label fw-bold">Tolérance à la conversation</label>
                  <div class="mt-2">
                    <div class="form-check">
                      <input class="form-check-input" type="radio" value="low" formControlName="conversation" id="conv1">
                      <label class="form-check-label" for="conv1">
                        <strong>Calme</strong> - Je préfère les trajets silencieux
                      </label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="radio" value="medium" formControlName="conversation" id="conv2">
                      <label class="form-check-label" for="conv2">
                        <strong>Modéré</strong> - Un peu de conversation, c'est sympa
                      </label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="radio" value="high" formControlName="conversation" id="conv3">
                      <label class="form-check-label" for="conv3">
                        <strong>Bavard</strong> - J'adore discuter pendant le trajet
                      </label>
                    </div>
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label fw-bold">Autres préférences</label>
                  <div class="mt-2">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" formControlName="smoking" id="smoking">
                      <label class="form-check-label" for="smoking">
                        Fumeur autorisé
                      </label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" formControlName="pets" id="pets">
                      <label class="form-check-label" for="pets">
                        Animaux autorisés
                      </label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" formControlName="music" id="music">
                      <label class="form-check-label" for="music">
                        Musique autorisée
                      </label>
                    </div>
                  </div>
                </div>

                <button type="submit" class="btn btn-eco-primary">
                  Sauvegarder les préférences
                </button>
              </form>
            </div>
          </div>

          <!-- Vehicle Tab -->
          <div *ngIf="activeTab === 'vehicle'" class="card">
            <div class="card-header">
              <h5 class="mb-0">Mon véhicule</h5>
            </div>
            <div class="card-body">
              <form [formGroup]="vehicleForm" (ngSubmit)="saveVehicle()">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="make" class="form-label">Marque</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="make"
                      formControlName="make"
                      placeholder="Renault, Peugeot...">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="model" class="form-label">Modèle</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="model"
                      formControlName="model"
                      placeholder="Clio, 308...">
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-4 mb-3">
                    <label for="year" class="form-label">Année</label>
                    <input 
                      type="number" 
                      class="form-control" 
                      id="year"
                      formControlName="year"
                      min="1990"
                      max="2025">
                  </div>
                  <div class="col-md-4 mb-3">
                    <label for="color" class="form-label">Couleur</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="color"
                      formControlName="color"
                      placeholder="Blanc, Rouge...">
                  </div>
                  <div class="col-md-4 mb-3">
                    <label for="seats" class="form-label">Places disponibles</label>
                    <select class="form-select" formControlName="seats">
                      <option value="1">1 place</option>
                      <option value="2">2 places</option>
                      <option value="3">3 places</option>
                      <option value="4">4 places</option>
                    </select>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="plate" class="form-label">Plaque d'immatriculation</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="plate"
                    formControlName="plate"
                    placeholder="AB-123-CD">
                  <div class="form-text">Cette information ne sera visible que par vos passagers confirmés.</div>
                </div>

                <button type="submit" class="btn btn-eco-primary">
                  Sauvegarder les informations du véhicule
                </button>
              </form>
            </div>
          </div>

          <!-- Security Tab -->
          <div *ngIf="activeTab === 'security'" class="card">
            <div class="card-header">
              <h5 class="mb-0">Sécurité et confidentialité</h5>
            </div>
            <div class="card-body">
              <div class="mb-4">
                <h6 class="fw-bold">Changer le mot de passe</h6>
                <form [formGroup]="passwordForm" (ngSubmit)="changePassword()">
                  <div class="mb-3">
                    <label for="currentPassword" class="form-label">Mot de passe actuel</label>
                    <input 
                      type="password" 
                      class="form-control" 
                      id="currentPassword"
                      formControlName="currentPassword">
                  </div>
                  <div class="mb-3">
                    <label for="newPassword" class="form-label">Nouveau mot de passe</label>
                    <input 
                      type="password" 
                      class="form-control" 
                      id="newPassword"
                      formControlName="newPassword">
                  </div>
                  <div class="mb-3">
                    <label for="confirmPassword" class="form-label">Confirmer le nouveau mot de passe</label>
                    <input 
                      type="password" 
                      class="form-control" 
                      id="confirmPassword"
                      formControlName="confirmPassword">
                  </div>
                  <button type="submit" class="btn btn-eco-primary">
                    Changer le mot de passe
                  </button>
                </form>
              </div>

              <hr>

              <div class="mb-4">
                <h6 class="fw-bold">Vérifications</h6>
                <div class="list-group">
                  <div class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>Téléphone</strong>
                      <div class="small text-muted">{{ user.phone }}</div>
                    </div>
                    <span class="badge bg-success" *ngIf="user.verifications.phone">Vérifié</span>
                    <button class="btn btn-sm btn-outline-eco-primary" *ngIf="!user.verifications.phone">
                      Vérifier
                    </button>
                  </div>
                  <div class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>Email</strong>
                      <div class="small text-muted">{{ user.email }}</div>
                    </div>
                    <span class="badge bg-success" *ngIf="user.verifications.email">Vérifié</span>
                    <button class="btn btn-sm btn-outline-eco-primary" *ngIf="!user.verifications.email">
                      Vérifier
                    </button>
                  </div>
                  <div class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>Identité</strong>
                      <div class="small text-muted">Pièce d'identité officielle</div>
                    </div>
                    <span class="badge bg-success" *ngIf="user.verifications.identity">Vérifié</span>
                    <button class="btn btn-sm btn-outline-eco-primary" *ngIf="!user.verifications.identity">
                      Vérifier
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-image {
      object-fit: cover;
      border: 3px solid var(--eco-primary);
    }
    
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
    
    .nav-tabs .nav-link {
      color: var(--eco-primary);
    }
    
    .nav-tabs .nav-link.active {
      background-color: var(--eco-primary);
      border-color: var(--eco-primary);
      color: white;
    }
    
    .card {
      border: none;
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    }
  `]
})
export class ProfileComponent implements OnInit {
  activeTab = 'personal';
  
  user: UserProfile = {
    id: '1',
    firstName: 'Marie',
    lastName: 'Dupont',
    email: 'marie.dupont@email.com',
    phone: '06 12 34 56 78',
    bio: 'Passionnée de voyages et de rencontres, j\'adore partager mes trajets en covoiturage. Toujours à l\'heure et de bonne humeur !',
    birthDate: '1990-05-15',
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b5cc?w=150&h=150&fit=crop&crop=face',
    preferences: {
      smoking: false,
      pets: true,
      music: true,
      conversation: 'medium'
    },
    vehicle: {
      make: 'Renault',
      model: 'Clio',
      year: 2020,
      color: 'Blanc',
      plate: 'AB-123-CD',
      seats: 3
    },
    stats: {
      totalTrips: 23,
      rating: 4.8,
      reviewCount: 15,
      memberSince: 'Mars 2023',
      co2Saved: 156
    },
    verifications: {
      phone: true,
      email: true,
      identity: true,
      license: false
    }
  };

  personalForm: FormGroup;
  preferencesForm: FormGroup;
  vehicleForm: FormGroup;
  passwordForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.personalForm = this.fb.group({
      firstName: [this.user.firstName, [Validators.required]],
      lastName: [this.user.lastName, [Validators.required]],
      email: [this.user.email, [Validators.required, Validators.email]],
      phone: [this.user.phone, [Validators.required]],
      bio: [this.user.bio],
      birthDate: [this.user.birthDate]
    });

    this.preferencesForm = this.fb.group({
      smoking: [this.user.preferences.smoking],
      pets: [this.user.preferences.pets],
      music: [this.user.preferences.music],
      conversation: [this.user.preferences.conversation]
    });

    this.vehicleForm = this.fb.group({
      make: [this.user.vehicle?.make],
      model: [this.user.vehicle?.model],
      year: [this.user.vehicle?.year],
      color: [this.user.vehicle?.color],
      plate: [this.user.vehicle?.plate],
      seats: [this.user.vehicle?.seats]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    // Load user data from service
  }

  changeProfileImage() {
    // Implement profile image change
    console.log('Change profile image');
  }

  savePersonalInfo() {
    if (this.personalForm.valid) {
      console.log('Save personal info:', this.personalForm.value);
      // Update user data
    }
  }

  savePreferences() {
    if (this.preferencesForm.valid) {
      console.log('Save preferences:', this.preferencesForm.value);
      // Update preferences
    }
  }

  saveVehicle() {
    if (this.vehicleForm.valid) {
      console.log('Save vehicle:', this.vehicleForm.value);
      // Update vehicle data
    }
  }

  changePassword() {
    if (this.passwordForm.valid) {
      console.log('Change password');
      // Handle password change
    }
  }
}
