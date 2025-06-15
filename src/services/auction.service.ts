import api from '@/lib/api';
import { Auction } from '@/types/auction';

export const getAllAuctions = async (): Promise<Auction[]> => {
  const res = await api.get('/auctions');
  return res.data;
};

export const createAuction = async (payload: Auction) => {
  return await api.post('/auctions', payload);
};
