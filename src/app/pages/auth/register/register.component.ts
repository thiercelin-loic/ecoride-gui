import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-vh-100 d-flex align-items-center bg-light">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-6 col-lg-5">
            <div class="card shadow-sm border-0">
              <div class="card-body p-5">
                <div class="text-center mb-4">
                  <div
                    class="d-flex align-items-center justify-content-center mb-3"
                  >
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
                  <h1 class="h4 mb-2">Créer un compte</h1>
                  <p class="text-muted">Rejoignez la communauté EcoRide</p>
                </div>

                <form
                  [formGroup]="registerForm"
                  (ngSubmit)="onSubmit()"
                  novalidate
                >
                  <div class="mb-3">
                    <label for="username" class="form-label"
                      >Nom d'utilisateur *</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      [class.is-invalid]="hasFieldError('username')"
                      id="username"
                      formControlName="username"
                      placeholder="Votre nom d'utilisateur"
                    />
                    <div
                      class="invalid-feedback"
                      *ngIf="hasFieldError('username')"
                    >
                      {{ getFieldError('username') }}
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="firstName" class="form-label"
                          >Prénom *</label
                        >
                        <input
                          type="text"
                          class="form-control"
                          [class.is-invalid]="hasFieldError('firstName')"
                          id="firstName"
                          formControlName="firstName"
                          placeholder="Votre prénom"
                        />
                        <div
                          class="invalid-feedback"
                          *ngIf="hasFieldError('firstName')"
                        >
                          {{ getFieldError('firstName') }}
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="lastName" class="form-label">Nom *</label>
                        <input
                          type="text"
                          class="form-control"
                          [class.is-invalid]="hasFieldError('lastName')"
                          id="lastName"
                          formControlName="lastName"
                          placeholder="Votre nom"
                        />
                        <div
                          class="invalid-feedback"
                          *ngIf="hasFieldError('lastName')"
                        >
                          {{ getFieldError('lastName') }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="mb-3">
                    <label for="email" class="form-label">Email *</label>
                    <input
                      type="email"
                      class="form-control"
                      [class.is-invalid]="hasFieldError('email')"
                      id="email"
                      formControlName="email"
                      placeholder="votre@email.com"
                    />
                    <div
                      class="invalid-feedback"
                      *ngIf="hasFieldError('email')"
                    >
                      {{ getFieldError('email') }}
                    </div>
                  </div>

                  <div class="mb-3">
                    <label for="phone" class="form-label">Téléphone</label>
                    <input
                      type="tel"
                      class="form-control"
                      [class.is-invalid]="hasFieldError('phone')"
                      id="phone"
                      formControlName="phone"
                      placeholder="06 12 34 56 78"
                    />
                    <div
                      class="invalid-feedback"
                      *ngIf="hasFieldError('phone')"
                    >
                      {{ getFieldError('phone') }}
                    </div>
                    <div class="mb-3">
                      <label for="password" class="form-label"
                        >Mot de passe *</label
                      >
                      <input
                        type="password"
                        class="form-control"
                        [class.is-invalid]="hasFieldError('password')"
                        id="password"
                        formControlName="password"
                        placeholder="••••••••"
                      />
                      <div
                        class="invalid-feedback"
                        *ngIf="hasFieldError('password')"
                      >
                        {{ getFieldError('password') }}
                      </div>
                    </div>

                    <div class="mb-3">
                      <label for="confirmPassword" class="form-label"
                        >Confirmer le mot de passe *</label
                      >
                      <input
                        type="password"
                        class="form-control"
                        [class.is-invalid]="hasFieldError('confirmPassword')"
                        id="confirmPassword"
                        formControlName="confirmPassword"
                        placeholder="••••••••"
                      />
                      <div
                        class="invalid-feedback"
                        *ngIf="hasFieldError('confirmPassword')"
                      >
                        {{ getFieldError('confirmPassword') }}
                      </div>
                    </div>

                    <div class="mb-3 form-check">
                      <input
                        type="checkbox"
                        class="form-check-input"
                        [class.is-invalid]="hasFieldError('terms')"
                        id="terms"
                        formControlName="terms"
                      />
                      <label class="form-check-label" for="terms">
                        J'accepte les
                        <a href="/terms" class="text-eco-primary"
                          >conditions d'utilisation</a
                        >
                        et la
                        <a href="/privacy" class="text-eco-primary"
                          >politique de confidentialité</a
                        >
                        *
                      </label>
                      <div
                        class="invalid-feedback"
                        *ngIf="hasFieldError('terms')"
                      >
                        {{ getFieldError('terms') }}
                      </div>
                    </div>

                    <div class="mb-3 form-check">
                      <input
                        type="checkbox"
                        class="form-check-input"
                        id="newsletter"
                        formControlName="newsletter"
                      />
                      <label class="form-check-label" for="newsletter">
                        Je souhaite recevoir la newsletter EcoRide
                      </label>
                    </div>

                    <button
                      type="submit"
                      class="btn btn-eco-primary w-100 mb-3"
                      [disabled]="registerForm.invalid || isLoading"
                    >
                      <span
                        *ngIf="isLoading"
                        class="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      {{
                        isLoading ? 'Création en cours...' : 'Créer mon compte'
                      }}
                    </button>

                    <div class="text-center">
                      <p class="mb-0">
                        Déjà membre ?
                        <a
                          routerLink="/auth/login"
                          class="text-eco-primary text-decoration-none"
                        >
                          Se connecter
                        </a>
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
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
    `,
  ],
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);

  registerForm: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.pattern(/^(?:\+33|0)[1-9](?:[0-9]{8})$/)]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            this.passwordValidator,
          ],
        ],
        confirmPassword: ['', [Validators.required]],
        terms: [false, [Validators.requiredTrue]],
        newsletter: [false],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // Custom validator for password strength
  passwordValidator(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
    if (!value) return null;

    const hasNumber = /[0-9]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const valid = hasNumber && hasUpper && hasLower && hasSpecial;

    if (!valid) {
      return { passwordStrength: true };
    }

    return null;
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(form: AbstractControl): { [key: string]: any } | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;

      const {
        username,
        firstName,
        lastName,
        email,
        phone,
        password,
        terms,
        newsletter,
      } = this.registerForm.value;
      const registerRequest = {
        username,
        firstName,
        lastName,
        email,
        phone,
        password,
        acceptTerms: terms,
        acceptNewsletter: newsletter,
      };

      this.authService.register(registerRequest).subscribe({
        next: (user) => {
          this.notificationService.showSuccess(
            'Compte créé avec succès ! Vérifiez votre email pour confirmer votre compte.'
          );
          this.router.navigate(['/auth/login'], {
            queryParams: { email: user.email },
          });
        },
        error: (error) => {
          this.notificationService.showError(
            error.message || 'Erreur lors de la création du compte'
          );
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.registerForm.controls).forEach((key) => {
        this.registerForm.get(key)?.markAsTouched();
      });
    }
  }

  // Helper methods for validation
  hasFieldError(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return 'Ce champ est requis';
      }
      if (field.errors['email']) {
        return "Format d'email invalide";
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `Ce champ doit contenir au moins ${requiredLength} caractères`;
      }
      if (field.errors['pattern'] && fieldName === 'phone') {
        return 'Numéro de téléphone invalide (format: 06 12 34 56 78)';
      }
      if (field.errors['passwordStrength']) {
        return 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial';
      }
      if (field.errors['passwordMismatch']) {
        return 'Les mots de passe ne correspondent pas';
      }
      if (field.errors['required'] && fieldName === 'terms') {
        return "Vous devez accepter les conditions d'utilisation";
      }
    }
    return '';
  }
}
