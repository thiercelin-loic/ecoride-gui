import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, tap, catchError, shareReplay } from 'rxjs/operators';
import type { 
  Booking,
  ApiResponse,
  PaginatedResponse 
} from '../interfaces';
import { BookingStatus, PaymentStatus } from '../interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/bookings`;
  
  // State management
  private readonly userBookings$ = new BehaviorSubject<Booking[]>([]);
  private readonly driverBookings$ = new BehaviorSubject<Booking[]>([]);
  private readonly pendingBookings$ = new BehaviorSubject<Booking[]>([]);

  constructor() {
    this.loadUserBookings();
  }

  // Public observables
  getUserBookings(): Observable<Booking[]> {
    return this.userBookings$.asObservable();
  }

  getDriverBookings(): Observable<Booking[]> {
    return this.driverBookings$.asObservable();
  }

  getPendingBookings(): Observable<Booking[]> {
    return this.pendingBookings$.asObservable();
  }

  // Booking operations
  createBooking(tripId: string, seatsBooked: number, specialRequests?: string): Observable<Booking> {
    const bookingData = {
      tripId,
      seatsBooked,
      specialRequests
    };

    return this.http.post<ApiResponse<Booking>>(this.baseUrl, bookingData)
      .pipe(
        map(response => response.data!),
        tap(booking => this.addBookingToState(booking)),
        catchError(this.handleError)
      );
  }

  getBookingById(id: string): Observable<Booking> {
    return this.http.get<ApiResponse<Booking>>(`${this.baseUrl}/${id}`)
      .pipe(
        map(response => response.data!),
        catchError(this.handleError)
      );
  }

  updateBooking(id: string, updates: Partial<Booking>): Observable<Booking> {
    return this.http.patch<ApiResponse<Booking>>(`${this.baseUrl}/${id}`, updates)
      .pipe(
        map(response => response.data!),
        tap(booking => this.updateBookingInState(booking)),
        catchError(this.handleError)
      );
  }

  cancelBooking(id: string, reason?: string): Observable<Booking> {
    const cancelData = reason ? { reason } : {};
    
    return this.http.patch<ApiResponse<Booking>>(`${this.baseUrl}/${id}/cancel`, cancelData)
      .pipe(
        map(response => response.data!),
        tap(booking => this.updateBookingInState(booking)),
        catchError(this.handleError)
      );
  }

  // Driver operations
  confirmBooking(id: string): Observable<Booking> {
    return this.http.patch<ApiResponse<Booking>>(`${this.baseUrl}/${id}/confirm`, {})
      .pipe(
        map(response => response.data!),
        tap(booking => this.updateBookingInState(booking)),
        catchError(this.handleError)
      );
  }

  rejectBooking(id: string, reason: string): Observable<Booking> {
    return this.http.patch<ApiResponse<Booking>>(`${this.baseUrl}/${id}/reject`, { reason })
      .pipe(
        map(response => response.data!),
        tap(booking => this.updateBookingInState(booking)),
        catchError(this.handleError)
      );
  }

  // Payment operations
  processPayment(bookingId: string, paymentMethod: string, paymentDetails: any): Observable<Booking> {
    const paymentData = {
      paymentMethod,
      paymentDetails
    };

    return this.http.post<ApiResponse<Booking>>(`${this.baseUrl}/${bookingId}/payment`, paymentData)
      .pipe(
        map(response => response.data!),
        tap(booking => this.updateBookingInState(booking)),
        catchError(this.handleError)
      );
  }

  refundBooking(bookingId: string, amount?: number): Observable<Booking> {
    const refundData = amount ? { amount } : {};
    
    return this.http.post<ApiResponse<Booking>>(`${this.baseUrl}/${bookingId}/refund`, refundData)
      .pipe(
        map(response => response.data!),
        tap(booking => this.updateBookingInState(booking)),
        catchError(this.handleError)
      );
  }

  // History and filtering
  getBookingHistory(page = 1, limit = 10, status?: BookingStatus): Observable<PaginatedResponse<Booking>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<PaginatedResponse<Booking>>(`${this.baseUrl}/history`, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getDriverBookingHistory(driverId: string, page = 1, limit = 10): Observable<PaginatedResponse<Booking>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<PaginatedResponse<Booking>>(`${this.baseUrl}/driver/${driverId}`, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Statistics
  getBookingStatistics(): Observable<{
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    totalEarnings: number;
    totalSavings: number;
  }> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/statistics`)
      .pipe(
        map(response => response.data!),
        catchError(this.handleError)
      );
  }

  // Real-time updates
  getBookingUpdates(): Observable<Booking> {
    // This would typically use WebSocket or Server-Sent Events
    // For now, we'll use polling
    return new Observable(observer => {
      const interval = setInterval(() => {
        this.loadUserBookings().subscribe({
          next: () => {
            // Emit latest booking updates
            const latestBookings = this.userBookings$.value;
            const recentBooking = latestBookings[0];
            if (recentBooking) {
              observer.next(recentBooking);
            }
          },
          error: err => observer.error(err)
        });
      }, 30000); // Poll every 30 seconds

      return () => clearInterval(interval);
    });
  }

  // Utility methods
  canCancelBooking(booking: Booking): boolean {
    const now = new Date();
    const departureTime = new Date(booking.trip?.departureTime || '');
    const hoursDifference = (departureTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    return booking.status === BookingStatus.CONFIRMED && 
           hoursDifference >= 2; // Can cancel up to 2 hours before departure
  }

  calculateCancellationFee(booking: Booking): number {
    const now = new Date();
    const departureTime = new Date(booking.trip?.departureTime || '');
    const hoursDifference = (departureTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursDifference >= 24) {
      return 0; // Free cancellation
    } else if (hoursDifference >= 2) {
      return booking.totalPrice * 0.1; // 10% fee
    } else {
      return booking.totalPrice; // No refund
    }
  }

  getBookingStatusText(status: BookingStatus): string {
    const statusTexts = {
      [BookingStatus.PENDING]: 'En attente',
      [BookingStatus.CONFIRMED]: 'Confirmé',
      [BookingStatus.PAID]: 'Payé',
      [BookingStatus.CANCELLED]: 'Annulé',
      [BookingStatus.COMPLETED]: 'Terminé',
      [BookingStatus.NO_SHOW]: 'Absent',
      [BookingStatus.REFUNDED]: 'Remboursé'
    };
    return statusTexts[status] || status;
  }

  getPaymentStatusText(status: PaymentStatus): string {
    const statusTexts = {
      [PaymentStatus.PENDING]: 'En attente',
      [PaymentStatus.PROCESSING]: 'En cours',
      [PaymentStatus.COMPLETED]: 'Terminé',
      [PaymentStatus.FAILED]: 'Échoué',
      [PaymentStatus.REFUNDED]: 'Remboursé',
      [PaymentStatus.PARTIALLY_REFUNDED]: 'Partiellement remboursé'
    };
    return statusTexts[status] || status;
  }

  // Private methods
  private loadUserBookings(): Observable<Booking[]> {
    return this.http.get<ApiResponse<Booking[]>>(`${this.baseUrl}/user`)
      .pipe(
        map(response => response.data || []),
        tap(bookings => {
          this.userBookings$.next(bookings);
          this.updatePendingBookings(bookings);
        }),
        catchError(this.handleError),
        shareReplay(1)
      );
  }

  private updatePendingBookings(bookings: Booking[]): void {
    const pending = bookings.filter(b => b.status === BookingStatus.PENDING);
    this.pendingBookings$.next(pending);
  }

  private addBookingToState(booking: Booking): void {
    const currentBookings = this.userBookings$.value;
    const updatedBookings = [booking, ...currentBookings];
    this.userBookings$.next(updatedBookings);
    this.updatePendingBookings(updatedBookings);
  }

  private updateBookingInState(updatedBooking: Booking): void {
    const currentBookings = this.userBookings$.value;
    const updatedBookings = currentBookings.map(booking => 
      booking.id === updatedBooking.id ? updatedBooking : booking
    );
    this.userBookings$.next(updatedBookings);
    this.updatePendingBookings(updatedBookings);
  }

  private handleError = (error: any): Observable<never> => {
    console.error('BookingService Error:', error);
    throw error;
  };
}
