'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardCardSection from '@/components/EPDashboard/DashboardCardSection';
import DashboardAuctionTable from '@/components/EPDashboard/DashboardAuctionTable';
import { fetchAuctions } from '@/services/auction.service';
import { Auction } from '@/types/auction';

export default function EPDashboard() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuctions = async () => {
      try {
        const data = await fetchAuctions();
        setAuctions(data);
      } catch (err) {
        console.error('Failed to load auctions:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAuctions();
  }, []);

  return (
    <DashboardLayout>
      <DashboardCardSection auctions={auctions} loading={loading} />
      <DashboardAuctionTable auctions={auctions} loading={loading} />
    </DashboardLayout>
  );
}
