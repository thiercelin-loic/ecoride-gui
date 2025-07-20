import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { Trip } from '../../core/interfaces/trip.interface';
import { TripService } from '../../core/services/trip.service';
import { AuthService } from '../../core/services/auth.service';
import { LoadingService } from '../../shared/services/loading.service';
import { NotificationService } from '../../shared/services/notification.service';
import { SmoothTransitionService } from '../../shared/services/smooth-transition.service';
import { NoBlinkingDirective } from '../../shared/directives/no-blinking.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NoBlinkingDirective],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  searchForm: FormGroup;
  isSearching = false;
  isAuthenticated = false;
  
  // Recent trips from service
  recentTrips: Trip[] = [];
  
  // Statistics for the hero section - will be loaded from service in future
  stats = {
    totalTrips: 0,
    co2Saved: 0,
    activeUsers: 0,
    citiesCovered: 0
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private tripService: TripService,
    private authService: AuthService,
    private loadingService: LoadingService,
    private notificationService: NotificationService
  ) {
    this.searchForm = this.fb.group({
      from: ['', [Validators.required, Validators.minLength(2)]],
      to: ['', [Validators.required, Validators.minLength(2)]],
      date: ['', Validators.required],
      passengers: [1, [Validators.required, Validators.min(1), Validators.max(8)]]
    });
  }

  ngOnInit(): void {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    this.searchForm.patchValue({ date: today });
    
    // Subscribe to authentication state
    this.authService.getIsAuthenticated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAuthenticated => {
        this.isAuthenticated = isAuthenticated;
        if (isAuthenticated) {
          this.loadRecentTrips();
        } else {
          this.recentTrips = [];
        }
      });
    
    // Load statistics (always visible)
    this.loadStatistics();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadRecentTrips(): void {
    this.tripService.getRecentTrips(3)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (trips) => {
          this.recentTrips = trips;
        },
        error: (error) => {
          console.error('Error loading recent trips:', error);
          // Fallback to empty array - user can still search
          this.recentTrips = [];
        }
      });
  }

  private loadStatistics(): void {
    // In a real application, this would come from an analytics service
    // For now, we'll use placeholder data
    this.stats = {
      totalTrips: 12547,
      co2Saved: 8943,
      activeUsers: 45321,
      citiesCovered: 1250
    };
  }

  onSearch(): void {
    if (this.searchForm.valid) {
      this.isSearching = true;
      const searchParams = this.searchForm.value;
      
      // Navigate to search results page with parameters
      this.router.navigate(['/search'], { 
        queryParams: {
          from: searchParams.from,
          to: searchParams.to,
          date: searchParams.date,
          passengers: searchParams.passengers
        }
      }).then(() => {
        this.isSearching = false;
      }).catch((error) => {
        console.error('Navigation error:', error);
        this.isSearching = false;
        this.notificationService.showError('Erreur de navigation. Veuillez réessayer.');
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.searchForm.controls).forEach(key => {
      const control = this.searchForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.searchForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `Ce champ est requis`;
      if (field.errors['minlength']) return `Minimum ${field.errors['minlength'].requiredLength} caractères`;
      if (field.errors['min']) return `Minimum ${field.errors['min'].min} passager`;
      if (field.errors['max']) return `Maximum ${field.errors['max'].max} passagers`;
    }
    return '';
  }

  trackByTripId(index: number, trip: any): number {
    return trip.id;
  }
}
