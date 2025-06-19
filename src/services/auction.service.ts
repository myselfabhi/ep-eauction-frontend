import api from '@/lib/api';
import { Auction } from '@/types/auction';

export const fetchAuctions = async (): Promise<Auction[]> => {
  const res = await api.get('/auction');
  return res.data;
};
