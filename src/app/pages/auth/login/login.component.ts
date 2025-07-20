import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-vh-100 d-flex align-items-center bg-light">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-5 col-lg-4">
            <div class="card shadow-sm border-0">
              <div class="card-body p-5">
                <div class="text-center mb-4">
                  <div class="d-flex align-items-center justify-content-center mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="40px"
                      viewBox="0 -960 960 960"
                      width="40px"
                      fill="currentColor"
                      class="text-eco-primary me-2"
                    >
                      <path
                        d="M216-176q-45-45-70.5-104T120-402q0-63 24-124.5T222-642q35-35 86.5-60t122-39.5Q501-756 591.5-759t202.5 7q8 106 5 195t-16.5 160.5q-13.5 71.5-38 125T684-182q-53 53-112.5 77.5T450-80q-65 0-127-25.5T216-176Zm112-16q29 17 59.5 24.5T450-160q46 0 91-18.5t86-59.5q18-18 36.5-50.5t32-85Q709-426 716-500.5t2-177.5q-49-2-110.5-1.5T485-670q-61 9-116 29t-90 55q-45 45-62 89t-17 85q0 59 22.5 103.5T262-246q42-80 111-153.5T534-520q-72 63-125.5 142.5T328-192Zm0 0Zm0 0Z"
                      />
                    </svg>
                    <span class="h3 mb-0">EcoRide</span>
                  </div>
                  <h1 class="h4 mb-2">Se connecter</h1>
                  <p class="text-muted">Bon retour parmi nous !</p>
                </div>

                <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" novalidate>
                  <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input 
                      type="email" 
                      class="form-control" 
                      [class.is-invalid]="hasFieldError('email')"
                      id="email"
                      formControlName="email"
                      placeholder="votre@email.com">
                    <div class="invalid-feedback" *ngIf="hasFieldError('email')">
                      {{ getFieldError('email') }}
                    </div>
                  </div>

                  <div class="mb-3">
                    <label for="password" class="form-label">Mot de passe</label>
                    <input 
                      type="password" 
                      class="form-control" 
                      [class.is-invalid]="hasFieldError('password')"
                      id="password"
                      formControlName="password"
                      placeholder="••••••••">
                    <div class="invalid-feedback" *ngIf="hasFieldError('password')">
                      {{ getFieldError('password') }}
                    </div>
                  </div>

                  <div class="d-flex justify-content-between align-items-center mb-4">
                    <div class="form-check">
                      <input 
                        type="checkbox" 
                        class="form-check-input" 
                        id="remember"
                        formControlName="remember">
                      <label class="form-check-label" for="remember">
                        Se souvenir de moi
                      </label>
                    </div>
                    <a href="/auth/forgot-password" class="text-eco-primary text-decoration-none">
                      Mot de passe oublié ?
                    </a>
                  </div>

                  <button 
                    type="submit" 
                    class="btn btn-eco-primary w-100 mb-3"
                    [disabled]="loginForm.invalid || isLoading">
                    <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                    {{ isLoading ? 'Connexion...' : 'Se connecter' }}
                  </button>

                  <div class="text-center">
                    <p class="mb-0">
                      Pas encore membre ? 
                      <a routerLink="/auth/register" class="text-eco-primary text-decoration-none">
                        Créer un compte
                      </a>
                    </p>
                  </div>
                </form>

                <!-- Social Login -->
                <div class="mt-4">
                  <div class="text-center text-muted mb-3">
                    <small>Ou se connecter avec</small>
                  </div>
                  <div class="d-grid gap-2">
                    <button type="button" class="btn btn-outline-secondary">
                      <svg width="18" height="18" class="me-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continuer avec Google
                    </button>
                    <button type="button" class="btn btn-outline-secondary">
                      <svg width="18" height="18" class="me-2" fill="#1877F2" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Continuer avec Facebook
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
    .card {
      border-radius: 1rem;
    }
    
    .btn-eco-primary {
      background-color: var(--eco-primary);
      border-color: var(--eco-primary);
      color: white;
    }
    
    .btn-eco-primary:hover {
      background-color: var(--eco-primary-dark);
      border-color: var(--eco-primary-dark);
    }
    
    .text-eco-primary {
      color: var(--eco-primary) !important;
    }
    
    .form-control:focus {
      border-color: var(--eco-primary);
      box-shadow: 0 0 0 0.2rem rgba(76, 175, 80, 0.25);
    }
    
    .form-check-input:checked {
      background-color: var(--eco-primary);
      border-color: var(--eco-primary);
    }
  `]
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  
  loginForm: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      
      const { email, password, remember } = this.loginForm.value;
      const loginRequest = {
        email,
        password,
        rememberMe: remember
      };

      this.authService.login(loginRequest).subscribe({
        next: (response) => {
          this.notificationService.showSuccess('Connexion réussie !');
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.notificationService.showError(error.message || 'Erreur lors de la connexion');
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  // Helper method to check if a field has errors and is touched
  hasFieldError(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  // Helper method to get field error message
  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return 'Ce champ est requis';
      }
      if (field.errors['email']) {
        return 'Format d\'email invalide';
      }
      if (field.errors['minlength']) {
        return 'Le mot de passe doit contenir au moins 6 caractères';
      }
    }
    return '';
  }
}
