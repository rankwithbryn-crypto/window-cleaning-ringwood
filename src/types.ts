/**
 * Types and interfaces for Window Cleaning Ringwood App
 */

export type ServiceType = 'residential' | 'commercial' | 'solar' | 'gutter';

export interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  suburb: string;
  serviceType: ServiceType;
  storyCount: 1 | 2 | 3;
  windowCount: number;
  hasScreens: boolean;
  hasTracks: boolean;
  hasSills: boolean;
  preferredDate: string;
  preferredTimeSlot: string; // 'morning' | 'afternoon'
  estimatedPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  notes?: string;
}

export interface SuburbAvailability {
  name: string;
  available: boolean;
  region: string;
  estimatedTravelFee: number;
}
