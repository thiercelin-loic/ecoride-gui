import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { map, catchError, tap, retry, shareReplay } from 'rxjs/operators';
import type { 
  Trip, 
  TripSearchFilters, 
  SearchRequest, 
  SearchResponse, 
  ApiResponse,
  PaginatedResponse 
} from '../interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/trips`;
  
  // State management
  private readonly searchResults$ = new BehaviorSubject<SearchResponse | null>(null);
  private readonly recentSearches$ = new BehaviorSubject<SearchRequest[]>([]);
  private readonly favoriteTrips$ = new BehaviorSubject<Trip[]>([]);
  
  // Cache management
  private readonly cache = new Map<string, Observable<any>>();
  private readonly cacheExpiry = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.loadRecentSearches();
    this.loadFavoriteTrips();
  }

  // Public observables
  getSearchResults(): Observable<SearchResponse | null> {
    return this.searchResults$.asObservable();
  }

  getRecentSearches(): Observable<SearchRequest[]> {
    return this.recentSearches$.asObservable();
  }

  getFavoriteTrips(): Observable<Trip[]> {
    return this.favoriteTrips$.asObservable();
  }

  // Search operations
  searchTrips(searchRequest: SearchRequest): Observable<SearchResponse> {
    const cacheKey = `search-${JSON.stringify(searchRequest)}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const params = this.buildSearchParams(searchRequest);
    
    const request$ = this.http.get<ApiResponse<SearchResponse>>(`${this.baseUrl}/search`, { params })
      .pipe(
        map(response => response.data!),
        tap(result => {
          this.searchResults$.next(result);
          this.addToRecentSearches(searchRequest);
        }),
        retry(2),
        catchError(this.handleError),
        shareReplay(1)
      );

    this.cache.set(cacheKey, request$);
    
    // Clear cache after expiry
    setTimeout(() => this.cache.delete(cacheKey), this.cacheExpiry);
    
    return request$;
  }

  // Trip operations
  getTripById(id: string): Observable<Trip> {
    const cacheKey = `trip-${id}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const request$ = this.http.get<ApiResponse<Trip>>(`${this.baseUrl}/${id}`)
      .pipe(
        map(response => response.data!),
        retry(2),
        catchError(this.handleError),
        shareReplay(1)
      );

    this.cache.set(cacheKey, request$);
    setTimeout(() => this.cache.delete(cacheKey), this.cacheExpiry);
    
    return request$;
  }

  createTrip(trip: Partial<Trip>): Observable<Trip> {
    return this.http.post<ApiResponse<Trip>>(this.baseUrl, trip)
      .pipe(
        map(response => response.data!),
        tap(() => this.clearSearchCache()),
        catchError(this.handleError)
      );
  }

  updateTrip(id: string, trip: Partial<Trip>): Observable<Trip> {
    return this.http.put<ApiResponse<Trip>>(`${this.baseUrl}/${id}`, trip)
      .pipe(
        map(response => response.data!),
        tap(() => {
          this.clearSearchCache();
          this.cache.delete(`trip-${id}`);
        }),
        catchError(this.handleError)
      );
  }

  deleteTrip(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`)
      .pipe(
        map(() => void 0),
        tap(() => {
          this.clearSearchCache();
          this.cache.delete(`trip-${id}`);
        }),
        catchError(this.handleError)
      );
  }

  // Get recent trips for homepage
  getRecentTrips(limit = 10): Observable<Trip[]> {
    const cacheKey = `recent-trips-${limit}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('status', 'available')
      .set('sort', 'createdAt');

    const request$ = this.http.get<ApiResponse<Trip[]>>(`${this.baseUrl}/recent`, { params })
      .pipe(
        map(response => response.data || []),
        retry(2),
        catchError((error) => {
          console.error('Error fetching recent trips:', error);
          // Return empty array as fallback
          return of([]);
        }),
        shareReplay(1)
      );

    this.cache.set(cacheKey, request$);
    setTimeout(() => this.cache.delete(cacheKey), this.cacheExpiry);
    
    return request$;
  }

  // Driver trips
  getDriverTrips(driverId: string, page = 1, limit = 10): Observable<PaginatedResponse<Trip>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<PaginatedResponse<Trip>>(`${this.baseUrl}/driver/${driverId}`, { params })
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  // Passenger bookings
  getPassengerTrips(passengerId: string, page = 1, limit = 10): Observable<PaginatedResponse<Trip>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<PaginatedResponse<Trip>>(`${this.baseUrl}/passenger/${passengerId}`, { params })
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  // Favorites management
  addToFavorites(trip: Trip): void {
    const currentFavorites = this.favoriteTrips$.value;
    const exists = currentFavorites.find(t => t.id === trip.id);
    
    if (!exists) {
      const updatedFavorites = [...currentFavorites, trip];
      this.favoriteTrips$.next(updatedFavorites);
      this.saveFavoriteTrips(updatedFavorites);
    }
  }

  removeFromFavorites(tripId: string): void {
    const currentFavorites = this.favoriteTrips$.value;
    const updatedFavorites = currentFavorites.filter(t => t.id !== tripId);
    this.favoriteTrips$.next(updatedFavorites);
    this.saveFavoriteTrips(updatedFavorites);
  }

  isFavorite(tripId: string): boolean {
    return this.favoriteTrips$.value.some(t => t.id === tripId);
  }

  // Trip status operations
  startTrip(tripId: string): Observable<Trip> {
    return this.http.patch<ApiResponse<Trip>>(`${this.baseUrl}/${tripId}/start`, {})
      .pipe(
        map(response => response.data!),
        tap(() => this.cache.delete(`trip-${tripId}`)),
        catchError(this.handleError)
      );
  }

  completeTrip(tripId: string): Observable<Trip> {
    return this.http.patch<ApiResponse<Trip>>(`${this.baseUrl}/${tripId}/complete`, {})
      .pipe(
        map(response => response.data!),
        tap(() => this.cache.delete(`trip-${tripId}`)),
        catchError(this.handleError)
      );
  }

  cancelTrip(tripId: string, reason?: string): Observable<Trip> {
    const body = reason ? { reason } : {};
    return this.http.patch<ApiResponse<Trip>>(`${this.baseUrl}/${tripId}/cancel`, body)
      .pipe(
        map(response => response.data!),
        tap(() => {
          this.cache.delete(`trip-${tripId}`);
          this.clearSearchCache();
        }),
        catchError(this.handleError)
      );
  }

  // Search suggestions
  getSearchSuggestions(query: string): Observable<string[]> {
    if (!query || query.length < 2) {
      return of([]);
    }

    const params = new HttpParams().set('q', query);
    
    return this.http.get<ApiResponse<string[]>>(`${this.baseUrl}/suggestions`, { params })
      .pipe(
        map(response => response.data || []),
        catchError(() => of([]))
      );
  }

  // Popular destinations
  getPopularDestinations(): Observable<{city: string; count: number}[]> {
    const cacheKey = 'popular-destinations';
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const request$ = this.http.get<ApiResponse<{city: string; count: number}[]>>(`${this.baseUrl}/popular-destinations`)
      .pipe(
        map(response => response.data || []),
        catchError(() => of([])),
        shareReplay(1)
      );

    this.cache.set(cacheKey, request$);
    setTimeout(() => this.cache.delete(cacheKey), 30 * 60 * 1000); // 30 minutes cache
    
    return request$;
  }

  // Utility methods
  private buildSearchParams(searchRequest: SearchRequest): HttpParams {
    let params = new HttpParams()
      .set('departure', searchRequest.departure)
      .set('destination', searchRequest.destination)
      .set('date', searchRequest.date)
      .set('passengers', searchRequest.passengers.toString());

    if (searchRequest.filters) {
      const filters = searchRequest.filters;
      
      if (filters.maxPrice) {
        params = params.set('maxPrice', filters.maxPrice.toString());
      }
      if (filters.minRating) {
        params = params.set('minRating', filters.minRating.toString());
      }
      if (filters.isEcological !== undefined) {
        params = params.set('isEcological', filters.isEcological.toString());
      }
      if (filters.vehicleType && filters.vehicleType.length > 0) {
        params = params.set('vehicleType', filters.vehicleType.join(','));
      }
      if (filters.departureTimeRange) {
        params = params.set('departureTimeStart', filters.departureTimeRange.start);
        params = params.set('departureTimeEnd', filters.departureTimeRange.end);
      }
      if (filters.maxDuration) {
        params = params.set('maxDuration', filters.maxDuration.toString());
      }
      if (filters.sortBy) {
        params = params.set('sortBy', filters.sortBy);
      }
      if (filters.sortOrder) {
        params = params.set('sortOrder', filters.sortOrder);
      }
    }

    return params;
  }

  private addToRecentSearches(searchRequest: SearchRequest): void {
    const currentSearches = this.recentSearches$.value;
    const exists = currentSearches.find(s => 
      s.departure === searchRequest.departure && 
      s.destination === searchRequest.destination &&
      s.date === searchRequest.date
    );

    if (!exists) {
      const updatedSearches = [searchRequest, ...currentSearches.slice(0, 9)]; // Keep last 10
      this.recentSearches$.next(updatedSearches);
      this.saveRecentSearches(updatedSearches);
    }
  }

  private clearSearchCache(): void {
    for (const [key] of this.cache.entries()) {
      if (key.startsWith('search-')) {
        this.cache.delete(key);
      }
    }
  }

  private loadRecentSearches(): void {
    try {
      const stored = localStorage.getItem('ecoride_recent_searches');
      if (stored) {
        const searches = JSON.parse(stored);
        this.recentSearches$.next(searches);
      }
    } catch (error) {
      console.warn('Failed to load recent searches from localStorage:', error);
    }
  }

  private saveRecentSearches(searches: SearchRequest[]): void {
    try {
      localStorage.setItem('ecoride_recent_searches', JSON.stringify(searches));
    } catch (error) {
      console.warn('Failed to save recent searches to localStorage:', error);
    }
  }

  private loadFavoriteTrips(): void {
    try {
      const stored = localStorage.getItem('ecoride_favorite_trips');
      if (stored) {
        const favorites = JSON.parse(stored);
        this.favoriteTrips$.next(favorites);
      }
    } catch (error) {
      console.warn('Failed to load favorite trips from localStorage:', error);
    }
  }

  private saveFavoriteTrips(trips: Trip[]): void {
    try {
      localStorage.setItem('ecoride_favorite_trips', JSON.stringify(trips));
    } catch (error) {
      console.warn('Failed to save favorite trips to localStorage:', error);
    }
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = 'Requête invalide';
          break;
        case 401:
          errorMessage = 'Non autorisé';
          break;
        case 403:
          errorMessage = 'Accès interdit';
          break;
        case 404:
          errorMessage = 'Ressource non trouvée';
          break;
        case 500:
          errorMessage = 'Erreur du serveur';
          break;
        default:
          errorMessage = `Erreur: ${error.status} - ${error.message}`;
      }
    }
    
    console.error('TripService Error:', error);
    return throwError(() => new Error(errorMessage));
  };
}
