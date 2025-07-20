import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { TripService } from '../../core/services/trip.service';
import { NotificationService } from '../../shared/services/notification.service';
import type { SearchResponse } from '../../core/interfaces';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  private readonly tripService = inject(TripService);
  private readonly notificationService = inject(NotificationService);
  private readonly destroy$ = new Subject<void>();
  
  searchForm: FormGroup;
  isLoading = false;
  searchResults: SearchResponse | null = null;
  today: string; // For date input min attribute
  
  // Default trips will be removed once real API is connected
  defaultTrips = [
    {
      id: '1',
      from: 'Paris',
      to: 'Lyon',
      date: '2024-01-20',
      time: '08:30',
      duration: '4h30',
      price: 25,
      driver: { name: 'Marie Dubois', rating: 4.8, verified: true },
      seatsAvailable: 2,
      car: { model: 'Renault Clio', color: 'Bleu' },
      tags: ['Non-fumeur', 'Animaux acceptés', 'Musique OK']
    },
    {
      id: '2',
      from: 'Paris',
      to: 'Lyon',
      date: '2024-01-20',
      time: '14:15',
      duration: '4h45',
      price: 28,
      driver: { name: 'Pierre Martin', rating: 4.9, verified: true },
      seatsAvailable: 3,
      car: { model: 'Peugeot 308', color: 'Gris' },
      tags: ['Non-fumeur', 'Climatisation']
    }
  ];

  constructor(private fb: FormBuilder) {
    // Initialize today's date for date input min attribute
    this.today = new Date().toISOString().split('T')[0];
    
    this.searchForm = this.fb.group({
      from: ['Paris', [Validators.required, Validators.minLength(2)]],
      to: ['Lyon', [Validators.required, Validators.minLength(2)]],
      date: [this.today, [Validators.required]],
      passengers: [1, [Validators.required, Validators.min(1), Validators.max(8)]]
    });
  }

  ngOnInit(): void {
    // Subscribe to search results from the service
    this.tripService.getSearchResults()
      .pipe(takeUntil(this.destroy$))
      .subscribe(results => {
        this.searchResults = results;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(): void {
    if (this.searchForm.valid) {
      this.isLoading = true;
      
      const searchRequest = {
        departure: this.searchForm.value.from,
        destination: this.searchForm.value.to,
        date: this.searchForm.value.date,
        passengers: this.searchForm.value.passengers,
        filters: {} // Could be extended with additional filters
      };

      this.tripService.searchTrips(searchRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (results) => {
            this.searchResults = results;
            if (results.trips.length === 0) {
              this.notificationService.showInfo('Aucun trajet trouvé pour cette recherche');
            }
          },
          error: (error) => {
            this.notificationService.showError(error.message || 'Erreur lors de la recherche');
            this.isLoading = false;
          },
          complete: () => {
            this.isLoading = false;
          }
        });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.searchForm.controls).forEach(key => {
        this.searchForm.get(key)?.markAsTouched();
      });
    }
  }

  // Helper methods for validation
  hasFieldError(fieldName: string): boolean {
    const field = this.searchForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.searchForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return 'Ce champ est requis';
      }
      if (field.errors['minlength']) {
        return 'Veuillez saisir au moins 2 caractères';
      }
      if (field.errors['min']) {
        return 'Le nombre de passagers doit être au moins 1';
      }
      if (field.errors['max']) {
        return 'Le nombre de passagers ne peut pas dépasser 8';
      }
    }
    return '';
  }

  // Get the trips to display (from search results or default)
  get tripsToDisplay() {
    if (this.searchResults?.trips) {
      // Transform SearchTrip to match template expectations
      return this.searchResults.trips.map(trip => ({
        id: trip.id,
        from: trip.departure.city,
        to: trip.destination.city,
        date: new Date(trip.departureTime).toLocaleDateString('fr-FR'),
        time: new Date(trip.departureTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        duration: this.formatDuration(trip.duration),
        price: trip.pricePerSeat,
        driver: {
          name: trip.driver.firstName,
          rating: trip.driver.rating,
          verified: trip.driver.verificationLevel !== 'basic'
        },
        seatsAvailable: trip.availableSeats,
        car: {
          model: trip.vehicle.model,
          color: trip.vehicle.color
        },
        tags: [] // This would need to be added to the SearchTrip interface or derived from vehicle/preferences
      }));
    }
    return this.defaultTrips;
  }

  // Helper method to format duration from minutes to human readable
  private formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins.toString().padStart(2, '0')}`;
  }

  trackByTripId(index: number, trip: any): string {
    return trip.id;
  }
}
