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
      {/* Debug Info - Remove in production */}
      {currentUser && (
        <div className="bg-blue-50 p-4 mb-4 rounded-md">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Current User: {currentUser.name} ({currentUser.role})</p>
              <p className="text-xs text-gray-600">ID: {currentUser.id}</p>
              <p className="text-xs text-gray-600">Login: {localStorage.getItem('loginTimestamp')}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleRefreshAuctions}
                className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
              >
                Refresh
              </button>
              <button
                onClick={handleForceLogout}
                className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
              >
                Force Logout
              </button>
            </div>
          </div>
        </div>
      )}
      
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
