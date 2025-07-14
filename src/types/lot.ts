export interface Lot {
  _id: string;
  auction: string; 
  name: string;
  lotId?: string;
  hsCode?: string;
  productName?: string;
  material?: string;
  volume?: string;
  dimensions?: { l?: string; w?: string; h?: string };
  prevCost?: string;
  lotCount?: number | string;
  description?: string;
  specifications?: string;
  documents: string[];
  reservePrice: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}
