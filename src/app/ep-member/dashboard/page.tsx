'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/shared/DashboardLayout';
import DashboardCardSection from '@/components/EPDashboard/DashboardCardSection';
import DashboardAuctionTable from '@/components/EPDashboard/DashboardAuctionTable';
import Loader from '@/components/shared/Loader';
import { fetchAuctions } from '@/services/auction.service';
import { Auction } from '@/types/auction';
import { getCurrentUser, validateSession, clearSession } from '@/lib/session';

type DashboardUser = {
  id: string;
  name: string;
  role: string;
  email: string;
};

export default function EPDashboard() {
  const router = useRouter();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<DashboardUser | null>(null);

  useEffect(() => {
    const loadAuctions = async () => {
      try {
        // Validate session first
        if (!validateSession()) {
          console.log('Invalid session, redirecting to login');
          router.push('/auth/login');
          return;
        }

        // Get current user using session utility
        const user = getCurrentUser();
        if (user) {
          setCurrentUser(user);
          console.log('Current user:', user);
        }
        
        const data = await fetchAuctions();
        console.log('Fetched auctions:', data);
        // Sort by createdAt descending
        const sortedAuctions = Array.isArray(data)
          ? data.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          : data;
        setAuctions(sortedAuctions);
      } catch (err) {
        console.error('Failed to load auctions:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAuctions();
  }, [router]);

  const handleForceLogout = () => {
    clearSession(); // Use session utility
    router.push('/auth/login');
  };

  const handleRefreshAuctions = async () => {
    setLoading(true);
    try {
      const data = await fetchAuctions();
      // Sort by createdAt descending
      const sortedAuctions = Array.isArray(data)
        ? data.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        : data;
      setAuctions(sortedAuctions);
    } catch (err) {
      console.error('Failed to refresh auctions:', err);
    } finally {
      setLoading(false);
    }
  };

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
