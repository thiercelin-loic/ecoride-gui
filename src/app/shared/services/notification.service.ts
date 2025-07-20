import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  actions?: NotificationAction[];
  createdAt: Date;
}

export interface NotificationAction {
  text: string;
  action: () => void;
  style?: 'primary' | 'secondary' | 'danger';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications$ = new BehaviorSubject<Notification[]>([]);
  private defaultDuration = 5000; // 5 seconds

  getNotifications(): Observable<Notification[]> {
    return this.notifications$.asObservable();
  }

  showSuccess(message: string, title?: string, duration?: number): string {
    return this.show('success', message, title, duration);
  }

  showError(message: string, title?: string, duration?: number): string {
    return this.show('error', message, title, duration || 8000); // Errors stay longer
  }

  showWarning(message: string, title?: string, duration?: number): string {
    return this.show('warning', message, title, duration);
  }

  showInfo(message: string, title?: string, duration?: number): string {
    return this.show('info', message, title, duration);
  }

  show(
    type: Notification['type'], 
    message: string, 
    title?: string, 
    duration?: number,
    actions?: NotificationAction[]
  ): string {
    const notification: Notification = {
      id: this.generateId(),
      type,
      title,
      message,
      duration: duration ?? this.defaultDuration,
      actions,
      createdAt: new Date()
    };

    const current = this.notifications$.value;
    this.notifications$.next([...current, notification]);

    // Auto-remove notification after duration
    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        this.remove(notification.id);
      }, notification.duration);
    }

    return notification.id;
  }

  remove(id: string): void {
    const current = this.notifications$.value;
    const updated = current.filter(n => n.id !== id);
    this.notifications$.next(updated);
  }

  clear(): void {
    this.notifications$.next([]);
  }

  // Predefined notifications for common scenarios
  showNetworkError(): string {
    return this.showError(
      'Problème de connexion. Vérifiez votre connexion internet.',
      'Erreur de réseau'
    );
  }

  showLoginSuccess(username: string): string {
    return this.showSuccess(
      `Bienvenue ${username} !`,
      'Connexion réussie'
    );
  }

  showBookingConfirmed(): string {
    return this.showSuccess(
      'Votre réservation a été confirmée avec succès.',
      'Réservation confirmée'
    );
  }

  showTripCancelled(): string {
    return this.showWarning(
      'Le trajet a été annulé. Vous serez remboursé sous 48h.',
      'Trajet annulé'
    );
  }

  showProfileUpdated(): string {
    return this.showSuccess(
      'Votre profil a été mis à jour.',
      'Profil sauvegardé'
    );
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
