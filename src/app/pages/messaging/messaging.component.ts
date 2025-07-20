import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  tripId?: string;
  tripRoute?: string;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: Message;
  unreadCount: number;
  tripId?: string;
  tripRoute?: string;
}

@Component({
  selector: 'app-messaging',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="container-fluid py-4 messaging-container">
      <div class="row h-100">
        <!-- Conversations List -->
        <div class="col-md-4 col-lg-3 conversations-panel">
          <div class="card h-100">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Messages</h5>
              <span class="badge bg-eco-primary" *ngIf="totalUnreadCount > 0">
                {{ totalUnreadCount }}
              </span>
            </div>
            <div class="card-body p-0">
              <!-- Search Bar -->
              <div class="p-3 border-bottom">
                <div class="input-group">
                  <input 
                    type="text" 
                    class="form-control" 
                    placeholder="Rechercher une conversation..."
                    [(ngModel)]="searchTerm">
                  <span class="input-group-text">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                    </svg>
                  </span>
                </div>
              </div>

              <!-- Conversations List -->
              <div class="conversations-list">
                <div 
                  *ngFor="let conversation of filteredConversations" 
                  class="conversation-item"
                  [class.active]="selectedConversation?.id === conversation.id"
                  (click)="selectConversation(conversation)">
                  <div class="d-flex align-items-center p-3 border-bottom">
                    <div class="position-relative me-3">
                      <img 
                        [src]="conversation.participantAvatar" 
                        [alt]="conversation.participantName"
                        class="rounded-circle avatar">
                      <span 
                        *ngIf="conversation.unreadCount > 0" 
                        class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {{ conversation.unreadCount }}
                      </span>
                    </div>
                    <div class="flex-grow-1 min-width-0">
                      <div class="d-flex justify-content-between align-items-start">
                        <h6 class="mb-1 text-truncate">{{ conversation.participantName }}</h6>
                        <small class="text-muted">{{ formatTime(conversation.lastMessage.timestamp) }}</small>
                      </div>
                      <p class="mb-1 text-muted small text-truncate">{{ conversation.lastMessage.content }}</p>
                      <small class="text-eco-primary" *ngIf="conversation.tripRoute">
                        <svg width="12" height="12" class="me-1" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z"/>
                        </svg>
                        {{ conversation.tripRoute }}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Panel -->
        <div class="col-md-8 col-lg-9 chat-panel">
          <div class="card h-100" *ngIf="selectedConversation; else noConversation">
            <!-- Chat Header -->
            <div class="card-header d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center">
                <img 
                  [src]="selectedConversation.participantAvatar" 
                  [alt]="selectedConversation.participantName"
                  class="rounded-circle me-3"
                  style="width: 40px; height: 40px;">
                <div>
                  <h6 class="mb-0">{{ selectedConversation.participantName }}</h6>
                  <small class="text-muted" *ngIf="selectedConversation.tripRoute">
                    Trajet: {{ selectedConversation.tripRoute }}
                  </small>
                </div>
              </div>
              <div class="dropdown">
                <button class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                  Options
                </button>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#" (click)="viewTripDetails()">Voir le trajet</a></li>
                  <li><a class="dropdown-item" href="#" (click)="viewProfile()">Profil du contact</a></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item text-danger" href="#" (click)="blockUser()">Bloquer</a></li>
                </ul>
              </div>
            </div>

            <!-- Messages -->
            <div class="card-body messages-container" #messagesContainer>
              <div *ngFor="let message of currentMessages" class="message-wrapper">
                <div 
                  class="message"
                  [class.own-message]="message.senderId === currentUserId"
                  [class.other-message]="message.senderId !== currentUserId">
                  <div class="message-content">
                    {{ message.content }}
                  </div>
                  <div class="message-time">
                    {{ formatMessageTime(message.timestamp) }}
                    <svg 
                      *ngIf="message.senderId === currentUserId && message.isRead" 
                      width="12" height="12" 
                      class="ms-1 text-primary" 
                      fill="currentColor" 
                      viewBox="0 0 16 16">
                      <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Message Input -->
            <div class="card-footer">
              <form [formGroup]="messageForm" (ngSubmit)="sendMessage()">
                <div class="input-group">
                  <input 
                    type="text" 
                    class="form-control" 
                    formControlName="content"
                    placeholder="Tapez votre message..."
                    (keydown.enter)="sendMessage()">
                  <button 
                    class="btn btn-eco-primary" 
                    type="submit" 
                    [disabled]="!messageForm.valid || isSending">
                    <span *ngIf="isSending" class="spinner-border spinner-border-sm me-1"></span>
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M15.854.146a.5.5 0 0 1 .11.54L13.026 8l2.938 7.314a.5.5 0 0 1-.538.65l-12-2.5a.5.5 0 0 1-.384-.607L3.93 8 3.042.893a.5.5 0 0 1 .384-.607l12-2.5a.5.5 0 0 1 .428.26zM4.506 3L12 4.5 4.506 8 2.72 3.5 4.506 3zm7.494 9.5L4.506 13l1.786-4.5L12 11.5z"/>
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- No Conversation Selected -->
          <ng-template #noConversation>
            <div class="card h-100 d-flex align-items-center justify-content-center">
              <div class="text-center text-muted">
                <svg width="64" height="64" class="mb-3 text-muted" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"/>
                </svg>
                <h5>Sélectionnez une conversation</h5>
                <p>Choisissez une conversation dans la liste pour commencer à échanger.</p>
              </div>
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .messaging-container {
      height: calc(100vh - 140px);
      min-height: 600px;
    }
    
    .conversations-panel .card,
    .chat-panel .card {
      border: none;
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    }
    
    .conversations-list {
      max-height: calc(100vh - 280px);
      overflow-y: auto;
    }
    
    .conversation-item {
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .conversation-item:hover {
      background-color: #f8f9fa;
    }
    
    .conversation-item.active {
      background-color: rgba(76, 175, 80, 0.1);
      border-left: 3px solid var(--eco-primary);
    }
    
    .avatar {
      width: 48px;
      height: 48px;
      object-fit: cover;
    }
    
    .messages-container {
      height: calc(100vh - 320px);
      overflow-y: auto;
      padding: 1rem;
    }
    
    .message-wrapper {
      margin-bottom: 1rem;
    }
    
    .message {
      max-width: 70%;
      margin-bottom: 4px;
    }
    
    .own-message {
      margin-left: auto;
    }
    
    .own-message .message-content {
      background-color: var(--eco-primary);
      color: white;
      border-radius: 18px 18px 4px 18px;
      padding: 8px 16px;
      word-wrap: break-word;
    }
    
    .other-message .message-content {
      background-color: #e9ecef;
      color: #333;
      border-radius: 18px 18px 18px 4px;
      padding: 8px 16px;
      word-wrap: break-word;
    }
    
    .message-time {
      font-size: 0.75rem;
      color: #6c757d;
      text-align: right;
      margin-top: 2px;
    }
    
    .other-message .message-time {
      text-align: left;
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
    
    .text-eco-primary {
      color: var(--eco-primary) !important;
    }
    
    .bg-eco-primary {
      background-color: var(--eco-primary) !important;
    }
    
    .min-width-0 {
      min-width: 0;
    }
    
    .text-truncate {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `]
})
export class MessagingComponent implements OnInit {
  conversations: Conversation[] = [];
  selectedConversation: Conversation | null = null;
  currentMessages: Message[] = [];
  messageForm: FormGroup;
  searchTerm = '';
  isSending = false;
  currentUserId = 'user1'; // Should come from auth service

  constructor(private fb: FormBuilder) {
    this.messageForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit() {
    this.loadConversations();
  }

  get totalUnreadCount(): number {
    return this.conversations.reduce((total, conv) => total + conv.unreadCount, 0);
  }

  get filteredConversations(): Conversation[] {
    if (!this.searchTerm) return this.conversations;
    return this.conversations.filter(conv => 
      conv.participantName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      conv.lastMessage.content.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  loadConversations() {
    // Mock data - in real app, this would come from a service
    this.conversations = [
      {
        id: 'conv1',
        participantId: 'user2',
        participantName: 'Marie Dubois',
        participantAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
        tripId: 'trip1',
        tripRoute: 'Paris → Lyon',
        unreadCount: 2,
        lastMessage: {
          id: 'msg3',
          senderId: 'user2',
          senderName: 'Marie Dubois',
          senderAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
          content: 'Parfait ! À demain alors 👍',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          isRead: false
        }
      },
      {
        id: 'conv2',
        participantId: 'user3',
        participantName: 'Jean Martin',
        participantAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        tripId: 'trip2',
        tripRoute: 'Lyon → Marseille',
        unreadCount: 0,
        lastMessage: {
          id: 'msg5',
          senderId: 'user1',
          senderName: 'Vous',
          senderAvatar: '',
          content: 'Merci pour le trajet !',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          isRead: true
        }
      },
      {
        id: 'conv3',
        participantId: 'user4',
        participantName: 'Sophie Leroy',
        participantAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        tripId: 'trip3',
        tripRoute: 'Bordeaux → Toulouse',
        unreadCount: 1,
        lastMessage: {
          id: 'msg7',
          senderId: 'user4',
          senderName: 'Sophie Leroy',
          senderAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          content: 'Est-ce que vous pourriez passer me prendre à la gare ?',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          isRead: false
        }
      }
    ];
  }

  selectConversation(conversation: Conversation) {
    this.selectedConversation = conversation;
    this.loadMessages(conversation.id);
    
    // Mark conversation as read
    conversation.unreadCount = 0;
  }

  loadMessages(conversationId: string) {
    // Mock messages data
    const allMessages: { [key: string]: Message[] } = {
      'conv1': [
        {
          id: 'msg1',
          senderId: 'user1',
          senderName: 'Vous',
          senderAvatar: '',
          content: 'Bonjour Marie ! Je confirme notre rendez-vous demain à 8h pour le trajet Paris-Lyon.',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          isRead: true
        },
        {
          id: 'msg2',
          senderId: 'user2',
          senderName: 'Marie Dubois',
          senderAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
          content: 'Parfait ! Je serai à l\'heure. Avez-vous une place pour une valise ?',
          timestamp: new Date(Date.now() - 10 * 60 * 1000),
          isRead: true
        },
        {
          id: 'msg3',
          senderId: 'user2',
          senderName: 'Marie Dubois',
          senderAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
          content: 'Parfait ! À demain alors 👍',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          isRead: false
        }
      ],
      'conv2': [
        {
          id: 'msg4',
          senderId: 'user3',
          senderName: 'Jean Martin',
          senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          content: 'Merci pour ce super trajet ! Très agréable.',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          isRead: true
        },
        {
          id: 'msg5',
          senderId: 'user1',
          senderName: 'Vous',
          senderAvatar: '',
          content: 'Merci pour le trajet !',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          isRead: true
        }
      ],
      'conv3': [
        {
          id: 'msg6',
          senderId: 'user1',
          senderName: 'Vous',
          senderAvatar: '',
          content: 'Bonjour Sophie ! Je peux faire un petit détour par la gare, pas de problème.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          isRead: true
        },
        {
          id: 'msg7',
          senderId: 'user4',
          senderName: 'Sophie Leroy',
          senderAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          content: 'Est-ce que vous pourriez passer me prendre à la gare ?',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          isRead: false
        }
      ]
    };

    this.currentMessages = allMessages[conversationId] || [];
    
    // Mark messages as read
    this.currentMessages.forEach(msg => {
      if (msg.senderId !== this.currentUserId) {
        msg.isRead = true;
      }
    });
  }

  sendMessage() {
    if (this.messageForm.valid && this.selectedConversation) {
      this.isSending = true;
      const content = this.messageForm.get('content')?.value;
      
      const newMessage: Message = {
        id: 'msg' + Date.now(),
        senderId: this.currentUserId,
        senderName: 'Vous',
        senderAvatar: '',
        content: content,
        timestamp: new Date(),
        isRead: false
      };

      // Add to current messages
      this.currentMessages.push(newMessage);
      
      // Update conversation last message
      this.selectedConversation.lastMessage = newMessage;
      
      // Clear form
      this.messageForm.reset();
      
      // Simulate API call
      setTimeout(() => {
        this.isSending = false;
        newMessage.isRead = true; // Simulate read confirmation
      }, 1000);
    }
  }

  formatTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}j`;
    
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  }

  formatMessageTime(date: Date): string {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  viewTripDetails() {
    if (this.selectedConversation?.tripId) {
      // Navigate to trip details
      console.log('Navigate to trip:', this.selectedConversation.tripId);
    }
  }

  viewProfile() {
    if (this.selectedConversation?.participantId) {
      // Navigate to user profile
      console.log('Navigate to profile:', this.selectedConversation.participantId);
    }
  }

  blockUser() {
    if (this.selectedConversation) {
      if (confirm(`Êtes-vous sûr de vouloir bloquer ${this.selectedConversation.participantName} ?`)) {
        // Block user logic
        console.log('Block user:', this.selectedConversation.participantId);
      }
    }
  }
}
