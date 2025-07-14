import { auctionService, bidService } from './api.service';
import { Auction } from '@/types/auction';
import { Bid } from '@/types/bid';

// Legacy functions for backward compatibility
export const fetchAuctions = async (): Promise<Auction[]> => {
  return auctionService.getAll();
};

export const fetchAuctionDetails = async (id: string): Promise<Auction> => {
  return auctionService.getById(id);
};

export const fetchAuctionMonitoring = async (id: string) => {
  return auctionService.getMonitoring(id);
};

export const fetchAuctionRanking = async (id: string): Promise<Bid[]> => {
  return bidService.getRanking(id);
};

export const pauseAuction = async (id: string) => {
  try {
    console.log('Pausing auction with ID:', id);
    const result = await auctionService.pause(id);
    console.log('Pause response:', result);
    return result;
  } catch (error) {
    console.error('Error pausing auction:', error);
    throw error;
  }
};

export const resumeAuction = async (id: string) => {
  try {
    console.log('Resuming auction with ID:', id);
    const result = await auctionService.resume(id);
    console.log('Resume response:', result);
    return result;
  } catch (error) {
    console.error('Error resuming auction:', error);
    throw error;
  }
};

// Export the centralized service for new code
export { auctionService };
