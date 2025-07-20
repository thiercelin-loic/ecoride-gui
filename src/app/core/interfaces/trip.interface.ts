export interface Trip {
  id: string;
  driverId: string;
  driver: TripDriver;
  vehicle: TripVehicle;
  departure: Location;
  destination: Location;
  waypoints?: Location[];
  departureTime: Date;
  estimatedArrivalTime: Date;
  actualDepartureTime?: Date;
  actualArrivalTime?: Date;
  availableSeats: number;
  totalSeats: number;
  pricePerSeat: number;
  currency: string;
  distance: number;
  estimatedDuration: number;
  actualDuration?: number;
  status: TripStatus;
  isEcological: boolean;
  preferences: TripPreferences;
  description?: string;
  rules?: string[];
  isRecurring: boolean;
  recurringPattern?: RecurringPattern;
  createdAt: Date;
  updatedAt: Date;
  bookings: Booking[];
  reviews: TripReview[];
  cancellationPolicy: CancellationPolicy;
  maxLuggage?: number;
  allowSmoking: boolean;
  allowPets: boolean;
  allowMusic: boolean;
  flexibilityMinutes: number;
}

export interface TripDriver {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
  verificationLevel: string;
  responseTime: number;
  languages?: string[];
}

export interface TripVehicle {
  id: string;
  brand: string;
  model: string;
  color: string;
  year: number;
  energyType: string;
  isEcological: boolean;
  seatsCount: number;
  comfortLevel: ComfortLevel;
  features?: VehicleFeature[];
}

export interface Location {
  id?: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  latitude: number;
  longitude: number;
  type?: LocationType;
  description?: string;
}

export interface Booking {
  id: string;
  tripId: string;
  trip?: Trip; // Optional trip reference for populated data
  passengerId: string;
  passenger: TripPassenger;
  seatsBooked: number;
  totalPrice: number;
  currency: string;
  status: BookingStatus;
  pickupLocation?: Location;
  dropoffLocation?: Location;
  specialRequests?: string;
  bookingDate: Date;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  cancellationReason?: string;
  cancellationDate?: Date;
  refundAmount?: number;
  review?: PassengerReview;
  createdAt: Date;
  updatedAt: Date;
}

export interface TripPassenger {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
  verificationLevel: string;
  phone?: string;
}

export interface TripPreferences {
  smokingAllowed: boolean;
  petsAllowed: boolean;
  musicAllowed: boolean;
  chattingLevel: ChattingLevel;
  luggagePolicy: LuggagePolicy;
  maxDetourDistance: number;
  allowInstantBooking: boolean;
}

export interface RecurringPattern {
  frequency: RecurringFrequency;
  daysOfWeek?: number[];
  endDate?: Date;
  occurrences?: number;
  exceptions?: Date[];
}

export interface TripReview {
  id: string;
  tripId: string;
  reviewerId: string;
  reviewedId: string;
  reviewerType: ReviewerType;
  rating: number;
  comment?: string;
  categories: ReviewCategory[];
  isPublic: boolean;
  isVerified: boolean;
  helpfulVotes: number;
  reportCount: number;
  status: ReviewStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface PassengerReview {
  punctuality: number;
  communication: number;
  cleanliness: number;
  overall: number;
  comment?: string;
}

export interface CancellationPolicy {
  freeCancellationHours: number;
  partialRefundHours: number;
  noRefundHours: number;
  partialRefundPercentage: number;
  cancellationFee: number;
}

export interface TripSearchFilters {
  departure?: string;
  destination?: string;
  date?: Date;
  dateFlexibility?: number;
  passengers?: number;
  maxPrice?: number;
  minRating?: number;
  isEcological?: boolean;
  vehicleType?: string[];
  departureTimeRange?: TimeRange;
  maxDuration?: number;
  amenities?: string[];
  driverGender?: string;
  instantBooking?: boolean;
  sortBy?: TripSortOption;
  sortOrder?: SortOrder;
}

export interface TimeRange {
  start: string; // HH:mm format
  end: string;   // HH:mm format
}

export interface VehicleFeature {
  name: string;
  icon: string;
  description?: string;
}

export enum TripStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  FULL = 'full',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  SUSPENDED = 'suspended'
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PAID = 'paid',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  NO_SHOW = 'no_show',
  REFUNDED = 'refunded'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded'
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  PAYPAL = 'paypal',
  BANK_TRANSFER = 'bank_transfer',
  DIGITAL_WALLET = 'digital_wallet',
  CREDITS = 'credits'
}

export enum LocationType {
  ADDRESS = 'address',
  LANDMARK = 'landmark',
  TRAIN_STATION = 'train_station',
  AIRPORT = 'airport',
  BUS_STATION = 'bus_station',
  METRO_STATION = 'metro_station',
  PARKING = 'parking'
}

export enum ComfortLevel {
  BASIC = 'basic',
  COMFORT = 'comfort',
  PREMIUM = 'premium',
  LUXURY = 'luxury'
}

export enum ChattingLevel {
  NONE = 'none',
  MINIMAL = 'minimal',
  MODERATE = 'moderate',
  SOCIAL = 'social'
}

export enum LuggagePolicy {
  SMALL_BAG_ONLY = 'small_bag_only',
  MEDIUM_LUGGAGE = 'medium_luggage',
  LARGE_LUGGAGE = 'large_luggage',
  NO_LUGGAGE = 'no_luggage'
}

export enum RecurringFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  CUSTOM = 'custom'
}

export enum ReviewerType {
  DRIVER = 'driver',
  PASSENGER = 'passenger'
}

export enum ReviewCategory {
  PUNCTUALITY = 'punctuality',
  COMMUNICATION = 'communication',
  CLEANLINESS = 'cleanliness',
  DRIVING = 'driving',
  VEHICLE_CONDITION = 'vehicle_condition',
  FRIENDLINESS = 'friendliness',
  SAFETY = 'safety'
}

export enum ReviewStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  REPORTED = 'reported'
}

export enum TripSortOption {
  PRICE_LOW_TO_HIGH = 'price_asc',
  PRICE_HIGH_TO_LOW = 'price_desc',
  DEPARTURE_TIME = 'departure_time',
  DURATION = 'duration',
  RATING = 'rating',
  DISTANCE = 'distance',
  CREATION_DATE = 'created_at'
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}
