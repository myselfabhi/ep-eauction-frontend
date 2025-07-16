import { User } from './user';

export interface Bid {
  _id: string;
  auction: string;      // or Auction
  lot?: string;         // or Lot
  supplier: string | User;  // Updated to handle both string and User object
  amount: number;
  currency: string;
  fobCost: number;
  tax: number;
  duty: number;
  totalCost: number;
  performanceScore?: number;
  status: 'Active' | 'Withdrawn';
  createdAt: string;
  updatedAt: string;
  score?: number;       // Added for ranking response
  product?: string;
  freight?: number;
}
