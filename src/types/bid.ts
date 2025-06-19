export interface Bid {
  _id: string;
  auction: string;      // or Auction
  lot?: string;         // or Lot
  supplier: string;     // or User
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
}
