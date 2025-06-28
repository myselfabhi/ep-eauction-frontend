'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/shared/DashboardLayout';
import DashboardCardSection from '@/components/EPDashboard/DashboardCardSection';
import DashboardAuctionTable from '@/components/EPDashboard/DashboardAuctionTable';
import Loader from '@/components/shared/Loader';
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
      {loading ? (
        <div className="flex flex-1 items-center justify-center min-h-[300px]">
          <Loader />
        </div>
      ) : (
        <>
          <DashboardCardSection auctions={auctions} loading={loading} />
          <DashboardAuctionTable auctions={auctions} loading={loading} />
        </>
      )}
    </DashboardLayout>
  );
}
