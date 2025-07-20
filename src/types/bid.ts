import { User } from './user';
import { Lot } from './lot';

export interface Bid {
  _id: string;
  auction: string;      // or Auction
  lot?: string | Lot;   // or Lot
  supplier: string | User;  // Updated to handle both string and User object
  amount: number;
  currency: string;
  fob: number;
  carton: number;       // Added carton field
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
