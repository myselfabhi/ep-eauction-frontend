export interface Lot {
  _id: string;
  auction: string; 
  name: string;
  description?: string;
  specifications?: string;
  documents: string[];
  reservePrice: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}
