export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  dateOfBirth?: Date;
  rating: number;
  reviewCount: number;
  credits: number;
  emailVerified: boolean;
  phoneVerified: boolean;
  isDriver: boolean;
  isPassenger: boolean;
  createdAt: Date;
  updatedAt: Date;
  preferences?: UserPreferences;
  vehicles?: Vehicle[];
  status: UserStatus;
}

export interface UserPreferences {
  smokingAllowed: boolean;
  petsAllowed: boolean;
  musicAllowed: boolean;
  chattingAllowed: boolean;
  maxPassengers: number;
  customPreferences?: string[];
}

export interface Vehicle {
  id: string;
  userId: string;
  brand: string;
  model: string;
  color: string;
  licensePlate: string;
  year: number;
  seatsCount: number;
  energyType: EnergyType;
  isEcological: boolean;
  registrationDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  bio?: string;
  languages?: string[];
  interests?: string[];
  emergencyContact?: EmergencyContact;
  verificationLevel: VerificationLevel;
  socialLinks?: SocialLinks;
  statistiques: UserStatistics;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface SocialLinks {
  facebook?: string;
  linkedin?: string;
  instagram?: string;
}

export interface UserStatistics {
  totalTripsAsDriver: number;
  totalTripsAsPassenger: number;
  totalKilometers: number;
  co2Saved: number;
  monthlyTrips: number;
  averageRating: number;
  completionRate: number;
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification'
}

export enum EnergyType {
  GASOLINE = 'gasoline',
  DIESEL = 'diesel',
  ELECTRIC = 'electric',
  HYBRID = 'hybrid',
  HYDROGEN = 'hydrogen'
}

export enum VerificationLevel {
  BASIC = 'basic',
  VERIFIED = 'verified',
  PREMIUM = 'premium'
}
