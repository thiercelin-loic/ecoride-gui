import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of, timer } from 'rxjs';
import { map, catchError, tap, switchMap, retry, shareReplay } from 'rxjs/operators';
import type { 
  User, 
  UserProfile, 
  AuthUser, 
  LoginRequest, 
  LoginResponse,
  RegisterRequest,
  ChangePasswordRequest,
  ApiResponse 
} from '../interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/auth`;
  
  // State management
  private readonly currentUser$ = new BehaviorSubject<AuthUser | null>(null);
  private readonly isAuthenticated$ = new BehaviorSubject<boolean>(false);
  private readonly isLoading$ = new BehaviorSubject<boolean>(false);
  
  // Token management
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenRefreshTimer: any;

  constructor() {
    this.initializeAuth();
  }

  // Public observables
  getCurrentUser(): Observable<AuthUser | null> {
    return this.currentUser$.asObservable();
  }

  getIsAuthenticated(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }

  getIsLoading(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }

  // Authentication methods
  login(credentials: LoginRequest): Observable<LoginResponse> {
    this.isLoading$.next(true);
    
    return this.http.post<ApiResponse<LoginResponse>>(`${this.baseUrl}/login`, credentials)
      .pipe(
        map(response => response.data!),
        tap(result => {
          this.handleAuthSuccess(result);
          if (credentials.rememberMe) {
            localStorage.setItem(environment.auth.rememberMeKey, 'true');
          }
        }),
        catchError(this.handleError),
        tap(() => this.isLoading$.next(false))
      );
  }

  register(userData: RegisterRequest): Observable<AuthUser> {
    this.isLoading$.next(true);
    
    return this.http.post<ApiResponse<AuthUser>>(`${this.baseUrl}/register`, userData)
      .pipe(
        map(response => response.data!),
        catchError(this.handleError),
        tap(() => this.isLoading$.next(false))
      );
  }

  logout(): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}/logout`, {
      refreshToken: this.refreshToken
    }).pipe(
      map(() => void 0),
      catchError(() => of(void 0)), // Don't fail logout on API error
      tap(() => this.handleLogout())
    );
  }

  refreshAccessToken(): Observable<string> {
    if (!this.refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<ApiResponse<{accessToken: string}>>(`${this.baseUrl}/refresh`, {
      refreshToken: this.refreshToken
    }).pipe(
      map(response => response.data!.accessToken),
      tap(newAccessToken => {
        this.accessToken = newAccessToken;
        this.saveTokens(newAccessToken, this.refreshToken!);
        this.scheduleTokenRefresh();
      }),
      catchError(error => {
        this.handleLogout();
        return throwError(() => error);
      })
    );
  }

  // Password management
  changePassword(passwordData: ChangePasswordRequest): Observable<void> {
    return this.http.patch<ApiResponse<void>>(`${this.baseUrl}/change-password`, passwordData)
      .pipe(
        map(() => void 0),
        catchError(this.handleError)
      );
  }

  requestPasswordReset(email: string): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}/forgot-password`, { email })
      .pipe(
        map(() => void 0),
        catchError(this.handleError)
      );
  }

  resetPassword(token: string, newPassword: string): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}/reset-password`, {
      token,
      newPassword
    }).pipe(
      map(() => void 0),
      catchError(this.handleError)
    );
  }

  // Email verification
  sendEmailVerification(): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}/send-verification`, {})
      .pipe(
        map(() => void 0),
        catchError(this.handleError)
      );
  }

  verifyEmail(token: string): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}/verify-email`, { token })
      .pipe(
        map(() => void 0),
        tap(() => {
          const currentUser = this.currentUser$.value;
          if (currentUser) {
            this.currentUser$.next({
              ...currentUser,
              isEmailVerified: true
            });
          }
        }),
        catchError(this.handleError)
      );
  }

  // User profile operations
  updateProfile(profileData: Partial<AuthUser>): Observable<AuthUser> {
    return this.http.patch<ApiResponse<AuthUser>>(`${this.baseUrl}/profile`, profileData)
      .pipe(
        map(response => response.data!),
        tap(updatedUser => this.currentUser$.next(updatedUser)),
        catchError(this.handleError)
      );
  }

  uploadAvatar(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('avatar', file);

    return this.http.post<ApiResponse<{avatarUrl: string}>>(`${this.baseUrl}/avatar`, formData)
      .pipe(
        map(response => response.data!.avatarUrl),
        tap(avatarUrl => {
          const currentUser = this.currentUser$.value;
          if (currentUser) {
            this.currentUser$.next({
              ...currentUser,
              avatar: avatarUrl
            });
          }
        }),
        catchError(this.handleError)
      );
  }

  // Account management
  deleteAccount(password: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/account`, {
      body: { password }
    }).pipe(
      map(() => void 0),
      tap(() => this.handleLogout()),
      catchError(this.handleError)
    );
  }

  // Session management
  checkSession(): Observable<AuthUser | null> {
    const token = this.getStoredToken();
    
    if (!token) {
      return of(null);
    }

    return this.http.get<ApiResponse<AuthUser>>(`${this.baseUrl}/me`)
      .pipe(
        map(response => response.data!),
        tap(user => {
          this.currentUser$.next(user);
          this.isAuthenticated$.next(true);
        }),
        catchError(() => {
          this.handleLogout();
          return of(null);
        })
      );
  }

  // Token utilities
  getAccessToken(): string | null {
    return this.accessToken || this.getStoredToken();
  }

  isTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  // Private methods
  private initializeAuth(): void {
    this.loadStoredTokens();
    
    if (this.accessToken && !this.isTokenExpired()) {
      this.checkSession().subscribe();
      this.scheduleTokenRefresh();
    } else if (this.refreshToken) {
      this.refreshAccessToken().subscribe({
        next: () => this.checkSession().subscribe(),
        error: () => this.handleLogout()
      });
    }
  }

  private handleAuthSuccess(authResponse: LoginResponse): void {
    this.accessToken = authResponse.tokens.accessToken;
    this.refreshToken = authResponse.tokens.refreshToken;
    
    this.currentUser$.next(authResponse.user);
    this.isAuthenticated$.next(true);
    
    this.saveTokens(this.accessToken, this.refreshToken);
    this.scheduleTokenRefresh();
  }

  private handleLogout(): void {
    this.currentUser$.next(null);
    this.isAuthenticated$.next(false);
    this.accessToken = null;
    this.refreshToken = null;
    
    this.clearStoredData();
    this.clearTokenRefreshTimer();
  }

  private saveTokens(accessToken: string, refreshToken: string): void {
    try {
      localStorage.setItem(environment.auth.tokenKey, accessToken);
      localStorage.setItem(environment.auth.refreshTokenKey, refreshToken);
    } catch (error) {
      console.warn('Failed to save tokens to localStorage:', error);
    }
  }

  private loadStoredTokens(): void {
    try {
      this.accessToken = localStorage.getItem(environment.auth.tokenKey);
      this.refreshToken = localStorage.getItem(environment.auth.refreshTokenKey);
    } catch (error) {
      console.warn('Failed to load tokens from localStorage:', error);
    }
  }

  private getStoredToken(): string | null {
    try {
      return localStorage.getItem(environment.auth.tokenKey);
    } catch {
      return null;
    }
  }

  private clearStoredData(): void {
    try {
      localStorage.removeItem(environment.auth.tokenKey);
      localStorage.removeItem(environment.auth.refreshTokenKey);
      localStorage.removeItem(environment.auth.rememberMeKey);
    } catch (error) {
      console.warn('Failed to clear stored data:', error);
    }
  }

  private scheduleTokenRefresh(): void {
    this.clearTokenRefreshTimer();
    
    if (!this.accessToken) return;

    try {
      const payload = JSON.parse(atob(this.accessToken.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      const refreshTime = expirationTime - Date.now() - (5 * 60 * 1000); // Refresh 5 minutes before expiry
      
      if (refreshTime > 0) {
        this.tokenRefreshTimer = timer(refreshTime).pipe(
          switchMap(() => this.refreshAccessToken())
        ).subscribe({
          error: () => this.handleLogout()
        });
      }
    } catch (error) {
      console.warn('Failed to schedule token refresh:', error);
    }
  }

  private clearTokenRefreshTimer(): void {
    if (this.tokenRefreshTimer) {
      this.tokenRefreshTimer.unsubscribe();
      this.tokenRefreshTimer = null;
    }
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = error.error?.message || 'Données invalides';
          break;
        case 401:
          errorMessage = 'Email ou mot de passe incorrect';
          break;
        case 403:
          errorMessage = 'Accès interdit';
          break;
        case 409:
          errorMessage = 'Cet email est déjà utilisé';
          break;
        case 422:
          errorMessage = 'Données invalides';
          break;
        case 429:
          errorMessage = 'Trop de tentatives, veuillez réessayer plus tard';
          break;
        case 500:
          errorMessage = 'Erreur du serveur';
          break;
        default:
          errorMessage = error.error?.message || 'Une erreur est survenue';
      }
    }
    
    console.error('AuthService Error:', error);
    return throwError(() => new Error(errorMessage));
  };
}
