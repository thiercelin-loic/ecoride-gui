import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  expanded?: boolean;
}

interface HelpCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  articles: number;
}

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container py-4">
      <!-- Header -->
      <div class="text-center mb-5">
        <h1 class="h2 text-eco-primary mb-3">Centre d'aide</h1>
        <p class="lead text-muted">Trouvez rapidement les réponses à vos questions</p>
      </div>

      <!-- Search Bar -->
      <div class="row justify-content-center mb-5">
        <div class="col-lg-6">
          <div class="input-group input-group-lg">
            <input 
              type="text" 
              class="form-control" 
              placeholder="Rechercher dans l'aide..."
              [(ngModel)]="searchTerm"
              (input)="filterFAQ()">
            <span class="input-group-text">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg>
            </span>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="row mb-5">
        <div class="col-md-4 mb-3">
          <div class="card h-100 quick-action-card">
            <div class="card-body text-center">
              <div class="mb-3">
                <svg width="48" height="48" class="text-eco-primary" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                  <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
                </svg>
              </div>
              <h5>Nous contacter</h5>
              <p class="text-muted">Besoin d'aide personnalisée ? Notre équipe est là pour vous aider.</p>
              <button class="btn btn-eco-primary" (click)="contactSupport()">Contacter</button>
            </div>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="card h-100 quick-action-card">
            <div class="card-body text-center">
              <div class="mb-3">
                <svg width="48" height="48" class="text-warning" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
              </div>
              <h5>Signaler un problème</h5>
              <p class="text-muted">Rencontrez-vous un problème technique ou un comportement inapproprié ?</p>
              <button class="btn btn-warning" (click)="reportIssue()">Signaler</button>
            </div>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="card h-100 quick-action-card">
            <div class="card-body text-center">
              <div class="mb-3">
                <svg width="48" height="48" class="text-info" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
                </svg>
              </div>
              <h5>Guide du débutant</h5>
              <p class="text-muted">Nouveau sur EcoRide ? Découvrez comment utiliser notre plateforme.</p>
              <button class="btn btn-info" (click)="openGuide()">Commencer</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Help Categories -->
      <div class="row mb-5">
        <div class="col-12">
          <h3 class="mb-4">Catégories d'aide</h3>
        </div>
        <div class="col-lg-4 col-md-6 mb-3" *ngFor="let category of helpCategories">
          <div class="card h-100 category-card" (click)="selectCategory(category.id)">
            <div class="card-body">
              <div class="d-flex align-items-start">
                <div class="me-3">
                  <div [innerHTML]="category.icon" class="category-icon"></div>
                </div>
                <div class="flex-grow-1">
                  <h6 class="card-title">{{ category.title }}</h6>
                  <p class="card-text text-muted small">{{ category.description }}</p>
                  <small class="text-eco-primary">{{ category.articles }} articles</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="row">
        <div class="col-12">
          <h3 class="mb-4">Questions fréquentes</h3>
          
          <!-- Category Filter -->
          <div class="mb-4">
            <div class="btn-group" role="group">
              <button 
                type="button" 
                class="btn"
                [class]="selectedCategory === 'all' ? 'btn-eco-primary' : 'btn-outline-secondary'"
                (click)="filterByCategory('all')">
                Toutes
              </button>
              <button 
                type="button" 
                class="btn"
                [class]="selectedCategory === 'booking' ? 'btn-eco-primary' : 'btn-outline-secondary'"
                (click)="filterByCategory('booking')">
                Réservations
              </button>
              <button 
                type="button" 
                class="btn"
                [class]="selectedCategory === 'payment' ? 'btn-eco-primary' : 'btn-outline-secondary'"
                (click)="filterByCategory('payment')">
                Paiements
              </button>
              <button 
                type="button" 
                class="btn"
                [class]="selectedCategory === 'safety' ? 'btn-eco-primary' : 'btn-outline-secondary'"
                (click)="filterByCategory('safety')">
                Sécurité
              </button>
              <button 
                type="button" 
                class="btn"
                [class]="selectedCategory === 'account' ? 'btn-eco-primary' : 'btn-outline-secondary'"
                (click)="filterByCategory('account')">
                Compte
              </button>
            </div>
          </div>

          <!-- FAQ Items -->
          <div class="accordion" id="faqAccordion">
            <div class="accordion-item" *ngFor="let faq of filteredFAQ; let i = index">
              <h2 class="accordion-header">
                <button 
                  class="accordion-button"
                  [class.collapsed]="!faq.expanded"
                  type="button"
                  (click)="toggleFAQ(faq)">
                  {{ faq.question }}
                </button>
              </h2>
              <div class="accordion-collapse collapse" [class.show]="faq.expanded">
                <div class="accordion-body">
                  <div [innerHTML]="faq.answer"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- No Results -->
          <div *ngIf="filteredFAQ.length === 0" class="text-center py-5">
            <svg width="64" height="64" class="text-muted mb-3" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
            <h5>Aucun résultat trouvé</h5>
            <p class="text-muted">Essayez de modifier vos termes de recherche ou contactez notre support.</p>
            <button class="btn btn-eco-primary" (click)="contactSupport()">Contacter le support</button>
          </div>
        </div>
      </div>

      <!-- Contact Section -->
      <div class="row mt-5">
        <div class="col-12">
          <div class="card bg-light">
            <div class="card-body text-center">
              <h5>Vous ne trouvez pas la réponse à votre question ?</h5>
              <p class="text-muted">Notre équipe de support est disponible pour vous aider.</p>
              <div class="row justify-content-center">
                <div class="col-md-3 mb-2">
                  <button class="btn btn-outline-eco-primary w-100" (click)="openChat()">
                    <svg width="16" height="16" class="me-1" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894z"/>
                    </svg>
                    Chat en direct
                  </button>
                </div>
                <div class="col-md-3 mb-2">
                  <button class="btn btn-outline-eco-primary w-100" (click)="sendEmail()">
                    <svg width="16" height="16" class="me-1" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
                    </svg>
                    Envoyer un email
                  </button>
                </div>
                <div class="col-md-3 mb-2">
                  <button class="btn btn-outline-eco-primary w-100" (click)="callSupport()">
                    <svg width="16" height="16" class="me-1" fill="currentColor" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
                    </svg>
                    Nous appeler
                  </button>
                </div>
              </div>
              <small class="text-muted d-block mt-3">
                Support disponible du lundi au vendredi de 9h à 18h
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
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
    
    .text-eco-primary {
      color: var(--eco-primary) !important;
    }
    
    .quick-action-card {
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
      border: none;
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    }
    
    .quick-action-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    }
    
    .category-card {
      cursor: pointer;
      transition: transform 0.2s;
      border: none;
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    }
    
    .category-card:hover {
      transform: translateY(-1px);
      box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.15);
    }
    
    .category-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(76, 175, 80, 0.1);
      border-radius: 8px;
    }
    
    .accordion-button {
      padding: 1rem 1.25rem;
      font-weight: 500;
    }
    
    .accordion-button:not(.collapsed) {
      background-color: rgba(76, 175, 80, 0.1);
      color: var(--eco-primary);
      border-color: var(--eco-primary);
    }
    
    .accordion-button:focus {
      box-shadow: 0 0 0 0.25rem rgba(76, 175, 80, 0.25);
    }
    
    .accordion-item {
      border: 1px solid #dee2e6;
      margin-bottom: 0.5rem;
      border-radius: 0.375rem;
    }
    
    .accordion-item:first-of-type .accordion-button {
      border-radius: 0.375rem 0.375rem 0 0;
    }
    
    .accordion-item:last-of-type .accordion-collapse {
      border-radius: 0 0 0.375rem 0.375rem;
    }
  `]
})
export class HelpComponent implements OnInit {
  searchTerm = '';
  selectedCategory = 'all';
  filteredFAQ: FAQItem[] = [];
  
  helpCategories: HelpCategory[] = [
    {
      id: 'getting-started',
      title: 'Premiers pas',
      description: 'Comment utiliser EcoRide pour la première fois',
      icon: '<svg width="24" height="24" class="text-eco-primary" fill="currentColor" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M6.271 5.055a.5.5 0 0 1 .52.016L11 6.73a.5.5 0 0 1 0 .882L6.791 9.271a.5.5 0 0 1-.791-.395V5.604a.5.5 0 0 1 .271-.549z"/></svg>',
      articles: 8
    },
    {
      id: 'booking',
      title: 'Réservations',
      description: 'Gérer vos réservations de trajets',
      icon: '<svg width="24" height="24" class="text-eco-primary" fill="currentColor" viewBox="0 0 16 16"><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/></svg>',
      articles: 12
    },
    {
      id: 'payment',
      title: 'Paiements',
      description: 'Questions sur les paiements et remboursements',
      icon: '<svg width="24" height="24" class="text-eco-primary" fill="currentColor" viewBox="0 0 16 16"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1H0V4z"/><path d="M0 7v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7H0zm3 2h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1z"/></svg>',
      articles: 6
    },
    {
      id: 'safety',
      title: 'Sécurité',
      description: 'Conseils de sécurité et signalements',
      icon: '<svg width="24" height="24" class="text-eco-primary" fill="currentColor" viewBox="0 0 16 16"><path d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z"/></svg>',
      articles: 5
    },
    {
      id: 'account',
      title: 'Mon compte',
      description: 'Gestion de votre profil et paramètres',
      icon: '<svg width="24" height="24" class="text-eco-primary" fill="currentColor" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/></svg>',
      articles: 9
    },
    {
      id: 'technical',
      title: 'Problèmes techniques',
      description: 'Résoudre les problèmes de l\'application',
      icon: '<svg width="24" height="24" class="text-eco-primary" fill="currentColor" viewBox="0 0 16 16"><path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/><path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54A.505.505 0 0 1 1.5 13h13a.5.5 0 0 1 .5-.5v-9a.5.5 0 0 1-.5-.5h-13z"/></svg>',
      articles: 4
    }
  ];

  faqItems: FAQItem[] = [
    {
      id: 'faq1',
      question: 'Comment réserver un trajet ?',
      answer: 'Pour réserver un trajet :<br>1. Recherchez votre trajet en indiquant vos villes de départ et d\'arrivée<br>2. Sélectionnez le trajet qui vous convient<br>3. Choisissez le nombre de passagers<br>4. Confirmez votre réservation et effectuez le paiement<br>5. Vous recevrez une confirmation par email',
      category: 'booking'
    },
    {
      id: 'faq2',
      question: 'Comment proposer un trajet ?',
      answer: 'Pour proposer un trajet :<br>1. Cliquez sur "Proposer un trajet" dans le menu<br>2. Renseignez votre itinéraire et vos horaires<br>3. Indiquez le nombre de places disponibles et le prix<br>4. Ajoutez une description si nécessaire<br>5. Publiez votre annonce',
      category: 'booking'
    },
    {
      id: 'faq3',
      question: 'Comment fonctionne le paiement ?',
      answer: 'Le paiement s\'effectue de manière sécurisée :<br>• Les passagers paient en ligne lors de la réservation<br>• L\'argent est bloqué jusqu\'à la fin du trajet<br>• Le conducteur reçoit le paiement après confirmation du trajet<br>• En cas d\'annulation, le remboursement est automatique',
      category: 'payment'
    },
    {
      id: 'faq4',
      question: 'Que faire en cas de problème pendant le trajet ?',
      answer: 'En cas de problème :<br>1. Essayez de résoudre le problème à l\'amiable<br>2. Contactez notre support via l\'application<br>3. Pour les urgences, contactez les services d\'urgence<br>4. Signalez l\'incident après le trajet pour améliorer la communauté',
      category: 'safety'
    },
    {
      id: 'faq5',
      question: 'Comment modifier mon profil ?',
      answer: 'Pour modifier votre profil :<br>1. Accédez à "Mon profil" dans le menu<br>2. Cliquez sur "Modifier" à côté de la section à changer<br>3. Effectuez vos modifications<br>4. Sauvegardez les changements<br>Votre profil sera mis à jour immédiatement.',
      category: 'account'
    },
    {
      id: 'faq6',
      question: 'L\'application ne fonctionne pas correctement',
      answer: 'Si vous rencontrez des problèmes techniques :<br>1. Vérifiez votre connexion internet<br>2. Redémarrez l\'application<br>3. Vérifiez que vous avez la dernière version<br>4. Redémarrez votre appareil<br>5. Si le problème persiste, contactez notre support',
      category: 'technical'
    },
    {
      id: 'faq7',
      question: 'Puis-je annuler ma réservation ?',
      answer: 'Vous pouvez annuler votre réservation :<br>• Gratuitement jusqu\'à 24h avant le départ<br>• Avec des frais de 2€ entre 24h et 2h avant le départ<br>• Impossible d\'annuler moins de 2h avant le départ<br>Le remboursement est automatique selon les conditions d\'annulation.',
      category: 'booking'
    },
    {
      id: 'faq8',
      question: 'Comment contacter un autre utilisateur ?',
      answer: 'Pour contacter un utilisateur :<br>1. Accédez à votre réservation ou trajet proposé<br>2. Cliquez sur "Contacter" à côté du nom de l\'utilisateur<br>3. Utilisez la messagerie intégrée<br>Les numéros de téléphone ne sont communiqués qu\'après confirmation de la réservation.',
      category: 'safety'
    }
  ];

  constructor() {}

  ngOnInit() {
    this.filteredFAQ = [...this.faqItems];
  }

  filterFAQ() {
    this.filteredFAQ = this.faqItems.filter(faq => {
      const matchesSearch = !this.searchTerm || 
        faq.question.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCategory = this.selectedCategory === 'all' || faq.category === this.selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.filterFAQ();
  }

  toggleFAQ(faq: FAQItem) {
    faq.expanded = !faq.expanded;
  }

  selectCategory(categoryId: string) {
    this.selectedCategory = categoryId.replace('getting-started', 'booking');
    this.filterFAQ();
  }

  contactSupport() {
    alert('Redirection vers le formulaire de contact...');
  }

  reportIssue() {
    alert('Redirection vers le formulaire de signalement...');
  }

  openGuide() {
    alert('Ouverture du guide du débutant...');
  }

  openChat() {
    alert('Ouverture du chat en direct...');
  }

  sendEmail() {
    window.open('mailto:support@ecoride.fr?subject=Demande d\'aide');
  }

  callSupport() {
    alert('Numéro de support : +33 1 23 45 67 89');
  }
}
