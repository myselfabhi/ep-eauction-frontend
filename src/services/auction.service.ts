import api from '@/lib/api';
import { Auction } from '@/types/auction';
import { Bid } from '@/types/bid';

export const fetchAuctions = async (): Promise<Auction[]> => {
  const res = await api.get('/auction');
  return res.data;
};

export const fetchAuctionDetails = async (id: string): Promise<Auction> => {
  const res = await api.get(`/auction/${id}`);
  return res.data;
};

export const fetchAuctionMonitoring = async (id: string) => {
  const res = await api.get(`/auction/${id}/monitoring`);
  return res.data;
};

export const fetchAuctionRanking = async (id: string): Promise<Bid[]> => {
  const res = await api.get(`/bid/ranking/${id}`);
  return res.data;
};

export const pauseAuction = async (id: string) => {
  try {
    console.log('Pausing auction with ID:', id);
    const res = await api.post(`/auction/${id}/pause`);
    console.log('Pause response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error pausing auction:', error);
    throw error;
  }
};

export const resumeAuction = async (id: string) => {
  try {
    console.log('Resuming auction with ID:', id);
    const res = await api.post(`/auction/${id}/resume`);
    console.log('Resume response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error resuming auction:', error);
    throw error;
  }
};
