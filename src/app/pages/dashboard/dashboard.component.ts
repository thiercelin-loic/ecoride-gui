import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Trip {
  id: string;
  departure: string;
  destination: string;
  date: string;
  time: string;
  price: number;
  seatsAvailable?: number;
  seatsBooked?: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  type: 'driver' | 'passenger';
  driverName?: string;
  passengerNames?: string[];
}

interface Notification {
  id: string;
  type: 'booking' | 'message' | 'trip' | 'system';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid py-4">
      <!-- Welcome Section -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h1 class="h3 mb-1">Bonjour, {{ user.firstName }} !</h1>
              <p class="text-muted mb-0">Voici un aperçu de vos activités EcoRide</p>
            </div>
            <div class="d-flex gap-2">
              <button routerLink="/offer/create" class="btn btn-eco-primary">
                <svg width="16" height="16" class="me-1" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
                Proposer un trajet
              </button>
              <button routerLink="/search" class="btn btn-outline-eco-primary">
                <svg width="16" height="16" class="me-1" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
                Rechercher
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="row mb-4">
        <div class="col-md-3 mb-3">
          <div class="card bg-eco-primary text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-title mb-1">Trajets effectués</h6>
                  <h3 class="mb-0">{{ stats.completedTrips }}</h3>
                </div>
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card bg-success text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-title mb-1">CO₂ économisé</h6>
                  <h3 class="mb-0">{{ stats.co2Saved }} kg</h3>
                </div>
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card bg-info text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-title mb-1">Économies</h6>
                  <h3 class="mb-0">{{ stats.moneySaved }}€</h3>
                </div>
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card bg-warning text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-title mb-1">Note moyenne</h6>
                  <h3 class="mb-0">{{ stats.averageRating }}/5</h3>
                </div>
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <!-- Recent Trips -->
        <div class="col-lg-8 mb-4">
          <div class="card h-100">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Mes trajets récents</h5>
              <a routerLink="/trips" class="btn btn-sm btn-outline-eco-primary">Voir tous</a>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Trajet</th>
                      <th>Date</th>
                      <th>Rôle</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let trip of recentTrips">
                      <td>
                        <div class="d-flex align-items-center">
                          <svg width="16" height="16" class="me-2 text-eco-primary" fill="currentColor" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
                          </svg>
                          <div>
                            <div class="fw-medium">{{ trip.departure }} → {{ trip.destination }}</div>
                            <small class="text-muted">{{ trip.time }}</small>
                          </div>
                        </div>
                      </td>
                      <td>{{ trip.date }}</td>
                      <td>
                        <span class="badge" [class]="trip.type === 'driver' ? 'bg-eco-primary' : 'bg-secondary'">
                          {{ trip.type === 'driver' ? 'Conducteur' : 'Passager' }}
                        </span>
                      </td>
                      <td>
                        <span class="badge" [ngClass]="{
                          'bg-success': trip.status === 'completed',
                          'bg-primary': trip.status === 'upcoming',
                          'bg-danger': trip.status === 'cancelled'
                        }">
                          {{ getStatusLabel(trip.status) }}
                        </span>
                      </td>
                      <td>
                        <div class="btn-group btn-group-sm">
                          <button 
                            [routerLink]="['/trip', trip.id]"
                            class="btn btn-outline-eco-primary btn-sm">
                            <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z"/>
                            </svg>
                          </button>
                          <button 
                            *ngIf="trip.status === 'upcoming'"
                            class="btn btn-outline-secondary btn-sm"
                            (click)="sendMessage(trip.id)">
                            <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Notifications & Quick Actions -->
        <div class="col-lg-4">
          <!-- Notifications -->
          <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Notifications</h5>
              <span class="badge bg-eco-primary">{{ unreadNotifications }}</span>
            </div>
            <div class="card-body p-0" style="max-height: 300px; overflow-y: auto;">
              <div 
                *ngFor="let notification of notifications.slice(0, 5)"
                class="p-3 border-bottom notification-item"
                [class.bg-light]="!notification.read"
                (click)="markAsRead(notification.id)">
                <div class="d-flex">
                  <div class="flex-shrink-0 me-3">
                    <div class="notification-icon" [ngClass]="getNotificationIconClass(notification.type)">
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path *ngIf="notification.type === 'booking'" d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path *ngIf="notification.type === 'message'" d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Z"/>
                        <path *ngIf="notification.type === 'trip'" d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3Z"/>
                      </svg>
                    </div>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-1 fs-6">{{ notification.title }}</h6>
                    <p class="mb-1 small text-muted">{{ notification.message }}</p>
                    <small class="text-muted">{{ notification.date }}</small>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-footer text-center">
              <a routerLink="/notifications" class="btn btn-sm btn-outline-eco-primary">
                Voir toutes les notifications
              </a>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Actions rapides</h5>
            </div>
            <div class="card-body">
              <div class="d-grid gap-2">
                <button routerLink="/profile" class="btn btn-outline-eco-primary">
                  <svg width="16" height="16" class="me-2" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
                  </svg>
                  Modifier mon profil
                </button>
                <button routerLink="/messaging" class="btn btn-outline-eco-primary">
                  <svg width="16" height="16" class="me-2" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Z"/>
                  </svg>
                  Mes messages
                </button>
                <button routerLink="/help" class="btn btn-outline-eco-primary">
                  <svg width="16" height="16" class="me-2" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
                  </svg>
                  Centre d'aide
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bg-eco-primary {
      background-color: var(--eco-primary) !important;
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
    
    .notification-item {
      cursor: pointer;
      transition: background-color 0.2s ease;
    }
    
    .notification-item:hover {
      background-color: var(--bs-gray-100) !important;
    }
    
    .notification-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    
    .notification-icon.booking {
      background-color: var(--eco-primary);
    }
    
    .notification-icon.message {
      background-color: #007bff;
    }
    
    .notification-icon.trip {
      background-color: #28a745;
    }
    
    .notification-icon.system {
      background-color: #6c757d;
    }
    
    .card {
      border: none;
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    }
    
    .table th {
      border-top: none;
      font-weight: 600;
      color: var(--eco-primary-dark);
    }
  `]
})
export class DashboardComponent implements OnInit {
  user = {
    firstName: 'Marie',
    lastName: 'Dupont'
  };

  stats = {
    completedTrips: 23,
    co2Saved: 156,
    moneySaved: 340,
    averageRating: 4.8
  };

  recentTrips: Trip[] = [
    {
      id: '1',
      departure: 'Paris',
      destination: 'Lyon',
      date: '15 Juil 2025',
      time: '08:30',
      price: 35,
      status: 'upcoming',
      type: 'driver',
      seatsAvailable: 2
    },
    {
      id: '2',
      departure: 'Lyon',
      destination: 'Marseille',
      date: '12 Juil 2025',
      time: '14:00',
      price: 25,
      status: 'completed',
      type: 'passenger',
      driverName: 'Pierre Martin'
    },
    {
      id: '3',
      departure: 'Paris',
      destination: 'Bordeaux',
      date: '10 Juil 2025',
      time: '09:15',
      price: 45,
      status: 'completed',
      type: 'driver',
      seatsBooked: 3
    }
  ];

  notifications: Notification[] = [
    {
      id: '1',
      type: 'booking',
      title: 'Nouvelle réservation',
      message: 'Jean a réservé une place pour Paris-Lyon',
      date: '2h',
      read: false
    },
    {
      id: '2',
      type: 'message',
      title: 'Nouveau message',
      message: 'Marie vous a envoyé un message',
      date: '4h',
      read: false
    },
    {
      id: '3',
      type: 'trip',
      title: 'Trajet confirmé',
      message: 'Votre trajet Lyon-Marseille est confirmé',
      date: '1 jour',
      read: true
    },
    {
      id: '4',
      type: 'system',
      title: 'Profil vérifié',
      message: 'Votre profil a été vérifié avec succès',
      date: '2 jours',
      read: true
    }
  ];

  get unreadNotifications(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  ngOnInit() {
    // In a real app, you would load user data and trips from a service
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'upcoming': return 'À venir';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  }

  getNotificationIconClass(type: string): string {
    return type;
  }

  markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }

  sendMessage(tripId: string) {
    // Navigate to messaging with trip context
    console.log('Send message for trip:', tripId);
  }
}
