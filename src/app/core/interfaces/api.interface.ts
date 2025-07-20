import type { TripSearchFilters } from './trip.interface';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ApiError[];
  meta?: ApiMeta;
  timestamp: Date;
}

export interface ApiError {
  code: string;
  message: string;
  field?: string;
  details?: any;
}

export interface ApiMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: ApiMeta;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: AuthUser;
  tokens: AuthTokens;
  expiresIn: number;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  acceptTerms: boolean;
  acceptNewsletter?: boolean;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  permissions: Permission[];
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  status: string;
  lastLoginAt?: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  conditions?: PermissionCondition[];
}

export interface PermissionCondition {
  field: string;
  operator: ConditionOperator;
  value: any;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface SearchRequest {
  departure: string;
  destination: string;
  date: string;
  passengers: number;
  filters?: TripSearchFilters;
}

export interface SearchResponse {
  trips: SearchTrip[];
  suggestions?: SearchSuggestion[];
  meta: SearchMeta;
}

export interface SearchTrip {
  id: string;
  driver: SearchDriver;
  vehicle: SearchVehicle;
  departure: SearchLocation;
  destination: SearchLocation;
  departureTime: Date;
  estimatedArrivalTime: Date;
  availableSeats: number;
  pricePerSeat: number;
  distance: number;
  duration: number;
  isEcological: boolean;
  rating: number;
  reviewCount: number;
  instantBooking: boolean;
  waypoints?: SearchLocation[];
}

export interface SearchDriver {
  id: string;
  username: string;
  firstName: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
  verificationLevel: string;
  responseTime: number;
}

export interface SearchVehicle {
  brand: string;
  model: string;
  color: string;
  year: number;
  energyType: string;
  isEcological: boolean;
  comfortLevel: string;
}

export interface SearchLocation {
  address: string;
  city: string;
  latitude: number;
  longitude: number;
}

export interface SearchSuggestion {
  type: SuggestionType;
  message: string;
  alternativeDate?: Date;
  alternativeLocation?: SearchLocation;
  tripCount?: number;
}

export interface SearchMeta {
  query: SearchRequest;
  totalResults: number;
  searchTime: number;
  filters: AppliedFilter[];
  suggestions: SearchSuggestion[];
}

export interface AppliedFilter {
  name: string;
  value: any;
  label: string;
}

export interface NotificationRequest {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  priority?: NotificationPriority;
  scheduledAt?: Date;
}

export interface NotificationResponse {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  priority: NotificationPriority;
  createdAt: Date;
  readAt?: Date;
  expiresAt?: Date;
}

export interface MessageRequest {
  recipientId: string;
  content: string;
  tripId?: string;
  messageType?: MessageType;
  attachments?: MessageAttachment[];
}

export interface MessageResponse {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  content: string;
  messageType: MessageType;
  isRead: boolean;
  readAt?: Date;
  tripId?: string;
  attachments?: MessageAttachment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageAttachment {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
}

export interface ConversationResponse {
  id: string;
  participants: ConversationParticipant[];
  lastMessage?: MessageResponse;
  unreadCount: number;
  tripId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationParticipant {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  isOnline: boolean;
  lastSeenAt?: Date;
}

export interface FileUploadResponse {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  uploadedAt: Date;
}

export interface StatisticsResponse {
  period: string;
  data: StatisticData[];
  summary: StatisticSummary;
}

export interface StatisticData {
  date: string;
  value: number;
  label?: string;
  metadata?: any;
}

export interface StatisticSummary {
  total: number;
  average: number;
  change: number;
  changePercentage: number;
  period: string;
}

export enum UserRole {
  USER = 'user',
  DRIVER = 'driver',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  EMPLOYEE = 'employee'
}

export enum ConditionOperator {
  EQUALS = 'eq',
  NOT_EQUALS = 'ne',
  GREATER_THAN = 'gt',
  GREATER_THAN_OR_EQUAL = 'gte',
  LESS_THAN = 'lt',
  LESS_THAN_OR_EQUAL = 'lte',
  IN = 'in',
  NOT_IN = 'nin',
  CONTAINS = 'contains',
  STARTS_WITH = 'starts_with',
  ENDS_WITH = 'ends_with'
}

export enum SuggestionType {
  ALTERNATIVE_DATE = 'alternative_date',
  ALTERNATIVE_LOCATION = 'alternative_location',
  NEARBY_TRIPS = 'nearby_trips',
  FLEXIBLE_SEARCH = 'flexible_search'
}

export enum NotificationType {
  BOOKING_CONFIRMED = 'booking_confirmed',
  BOOKING_CANCELLED = 'booking_cancelled',
  TRIP_REMINDER = 'trip_reminder',
  TRIP_STARTED = 'trip_started',
  TRIP_COMPLETED = 'trip_completed',
  PAYMENT_RECEIVED = 'payment_received',
  NEW_MESSAGE = 'new_message',
  REVIEW_RECEIVED = 'review_received',
  SYSTEM_UPDATE = 'system_update',
  SECURITY_ALERT = 'security_alert'
}

export enum NotificationPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  LOCATION = 'location',
  SYSTEM = 'system'
}

// Re-export from trip interface for API use
export type { TripSearchFilters } from './trip.interface';
