export interface Auction {
  id: string;
  title: string;
  status: 'Live' | 'Scheduled' | 'Completed';
  timeline: string;
  suppliers: string;
  lots: string;
}
