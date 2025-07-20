import { Lot } from "./lot";
import { User } from "./user";

export interface Auction {
  _id: string;
  auctionId: string;
  title: string;
  description?: string;
  category?: string;
  lots: Lot[];
  documents: string[];
  invitedSuppliers: User[];
  reservePrice: number;
  currency: string;
  startTime: string;
  endTime: string;
  autoExtension: boolean;
  extensionMinutes: number;
  status: 'Scheduled' | 'Active' | 'Paused' | 'Ended';
  createdBy: User;
  costParams: {
    priceWeight: number;
    fobWeight: number;
    taxWeight: number;
    dutyWeight: number;
    performanceWeight: number;
    qualityRequirements?: string;
  };
  createdAt: string;
  updatedAt: string;
}
