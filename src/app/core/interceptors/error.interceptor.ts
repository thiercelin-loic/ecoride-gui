import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { LoadingService } from '../../shared/services/loading.service';
import { NotificationService } from '../../shared/services/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  
  constructor(
    private loadingService: LoadingService,
    private notificationService: NotificationService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Show loading for non-background requests
    if (!req.headers.has('X-Background-Request')) {
      this.loadingService.show();
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      }),
      finalize(() => {
        if (!req.headers.has('X-Background-Request')) {
          this.loadingService.hide();
        }
      })
    );
  }

  private handleError(error: HttpErrorResponse): void {
    let errorMessage = 'Une erreur est survenue';
    let errorTitle = 'Erreur';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      switch (error.status) {
        case 0:
          errorTitle = 'Problème de connexion';
          errorMessage = 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.';
          break;
        case 400:
          errorTitle = 'Requête invalide';
          errorMessage = error.error?.message || 'Les données envoyées ne sont pas valides.';
          break;
        case 401:
          errorTitle = 'Non autorisé';
          errorMessage = 'Vous devez vous connecter pour accéder à cette ressource.';
          break;
        case 403:
          errorTitle = 'Accès interdit';
          errorMessage = 'Vous n\'avez pas les permissions nécessaires.';
          break;
        case 404:
          errorTitle = 'Ressource non trouvée';
          errorMessage = 'La ressource demandée n\'existe pas.';
          break;
        case 409:
          errorTitle = 'Conflit';
          errorMessage = error.error?.message || 'Cette action ne peut pas être effectuée.';
          break;
        case 422:
          errorTitle = 'Données invalides';
          errorMessage = this.formatValidationErrors(error.error?.errors) || 
                        error.error?.message || 
                        'Les données fournies ne sont pas valides.';
          break;
        case 429:
          errorTitle = 'Trop de tentatives';
          errorMessage = 'Vous avez effectué trop de tentatives. Veuillez réessayer plus tard.';
          break;
        case 500:
          errorTitle = 'Erreur du serveur';
          errorMessage = 'Une erreur interne du serveur est survenue. Nous travaillons à la résoudre.';
          break;
        case 502:
        case 503:
        case 504:
          errorTitle = 'Service indisponible';
          errorMessage = 'Le service est temporairement indisponible. Veuillez réessayer plus tard.';
          break;
        default:
          errorMessage = error.error?.message || `Erreur ${error.status}: ${error.statusText}`;
      }
    }

    // Don't show notification for certain errors or auth requests
    if (!this.shouldSuppressNotification(error)) {
      this.notificationService.showError(errorMessage, errorTitle);
    }

    console.error('HTTP Error:', {
      status: error.status,
      statusText: error.statusText,
      url: error.url,
      error: error.error,
      message: errorMessage
    });
  }

  private formatValidationErrors(errors: any): string | null {
    if (!errors || typeof errors !== 'object') {
      return null;
    }

    const errorMessages: string[] = [];
    
    for (const [field, messages] of Object.entries(errors)) {
      if (Array.isArray(messages)) {
        errorMessages.push(...messages);
      } else if (typeof messages === 'string') {
        errorMessages.push(messages);
      }
    }

    return errorMessages.length > 0 ? errorMessages.join(', ') : null;
  }

  private shouldSuppressNotification(error: HttpErrorResponse): boolean {
    // Suppress notifications for these cases
    return (
      error.status === 401 || // Handled by auth interceptor
      error.url?.includes('/auth/refresh') || // Token refresh failures
      error.headers.has('X-Suppress-Error-Toast') // Explicit suppression
    );
  }
}
