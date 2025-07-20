'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { getSocket, joinAuctionRoom, disconnectSocket } from '@/lib/socket';
import {
  fetchAuctionDetails,
  fetchAuctionRanking,
  pauseAuction,
  resumeAuction,
} from '@/services/auction.service';
import { Auction } from '@/types/auction';
import { Bid } from '@/types/bid';
import { User } from '@/types/user';
import Loader from '@/components/shared/Loader';
import DashboardLayout from '@/components/shared/DashboardLayout';
import AuctionLotSummaryTable, { BidRowData } from '@/components/AuctionMonitor/AuctionLotSummaryTable';
import AuctionLotMonitorHeader from '@/components/AuctionMonitor/AuctionLotMonitorHeader';
import { Lot } from '@/types/lot';

export default function EPMonitorAuctionPage() {
  const { id } = useParams();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // State
  const [auction, setAuction] = useState<Auction | null>(null);
  const [rankedBids, setRankedBids] = useState<Bid[]>([]);
  const [selectedLot, setSelectedLot] = useState<string>('');
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    const loadAuctionData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError('');
        console.log('[Auction Monitor] Fetching auction details for ID:', id);
        const auctionData = await fetchAuctionDetails(id as string);
        console.log('[Auction Monitor] Auction details response:', auctionData);
        setAuction(auctionData);
        if (auctionData.lots && auctionData.lots.length > 0) {
          setSelectedLot(auctionData.lots[0]._id);
        }
        const now = new Date().getTime();
        const endTime = new Date(auctionData.endTime).getTime();
        setTimeRemaining(Math.max(0, Math.floor((endTime - now) / 1000)));
        setIsPaused(auctionData.status === 'Paused');
        const ranking = await fetchAuctionRanking(id as string);
        console.log('[Auction Monitor] Auction ranking response:', ranking);
        setRankedBids(ranking);
      } catch (err) {
        console.error('[Auction Monitor] Error loading auction data:', err);
        setError('Failed to load auction data');
      } finally {
        setLoading(false);
      }
    };
    loadAuctionData();
  }, [id]);

  // Real-time updates
  useEffect(() => {
    if (!id || !auction) return;
    const socket = getSocket();
    joinAuctionRoom(id as string);
    socket.on('newBid', () => {
      console.log('Received newBid event');
      if (isPaused) return;
      fetchAuctionRanking(id as string).then(setRankedBids);
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });
    socket.on('auctionStatusChanged', (data: { status: string }) => {
      setIsPaused(data.status === 'Paused');
      if (auction) {
        setAuction(prev => prev ? { ...prev, status: data.status as Auction['status'] } : null);
      }
    });
    return () => {
      disconnectSocket();
    };
  }, [id, auction, isPaused]);

  useEffect(() => {
    if (!auction || auction.status !== 'Active' || isPaused) return;
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [auction, isPaused]);

  // Pause/resume handlers
  const handlePause = async () => {
    if (!id || !auction || isActionLoading) return;
    setIsActionLoading(true);
    try {
      await pauseAuction(id as string);
      setIsPaused(true);
      setAuction(prev => prev ? { ...prev, status: 'Paused' } : null);
      setSuccessMessage('Auction paused successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch {
      setError('Failed to pause auction');
    }
    setIsActionLoading(false);
  };
  const handleResume = async () => {
    if (!id || !auction || isActionLoading) return;
    setIsActionLoading(true);
    try {
      await resumeAuction(id as string);
      setIsPaused(false);
      setAuction(prev => prev ? { ...prev, status: 'Active' } : null);
      setSuccessMessage('Auction resumed successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch {
      setError('Failed to resume auction');
    }
    setIsActionLoading(false);
  };

  function getSupplierName(supplier: string | User) {
    if (typeof supplier === 'string') return supplier;
    return supplier.name || supplier.profile?.companyName || 'Unknown Supplier';
  }

  // Summary for Table
  const getSummaryData = () => {
    if (!rankedBids.length || !auction) return null;
    const bestBid = rankedBids[0];
    const previousCost = auction.reservePrice;
    const currentBestCost = bestBid.totalCost;
    const savings = previousCost - currentBestCost;
    const activeBidders = new Set(
      rankedBids.map(bid =>
        typeof bid.supplier === 'string' ? bid.supplier : bid.supplier._id
      )
    ).size;
    return {
      bestLandedCost: `${auction.currency} ${currentBestCost.toFixed(2)}`,
      bestSupplier: rankedBids.length ? `#1 ${getSupplierName(rankedBids[0].supplier)}` : '-',
      estimatedSavings: `${auction.currency} ${savings.toFixed(2)}`,
      savingsNote: '',
      previousCost: `${auction.currency} ${previousCost.toFixed(2)}`,
      previousNote: '/ unit',
      activeBidders,
    };
  };

  // Format for Table
  function getFilteredBids(): BidRowData[] {
    if (!auction) return [];
    return rankedBids.map((bid, idx) => {
      // Type guard to check if lot is an object
      const isLotObject = bid.lot && typeof bid.lot === 'object' && 'lotId' in bid.lot;
      
      return {
        id: bid._id,
        rank: idx + 1,
        lotId: isLotObject ? (bid.lot as Lot).lotId || '' : '',
        product: isLotObject ? (bid.lot as Lot).name : '',
        supplier: getSupplierName(bid.supplier),
        fobCost: `${auction.currency} ${bid.fob?.toFixed(2) ?? '--'}`,
        freight: `${auction.currency} ${bid.carton?.toFixed(2) ?? '--'}`,
        duty: typeof bid.duty === 'number' ? `${bid.duty.toFixed(0)}%` : '--',
        landedCost: Number(bid.totalCost),
        bidTime: new Date(bid.updatedAt).toLocaleTimeString(),
      };
    });
  }

  // Loading/Error
  if (loading) {
    return (
      <DashboardLayout>
        <main className="p-8 bg-white min-h-screen text-gray-900">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader />
          </div>
        </main>
      </DashboardLayout>
    );
  }
  if (error || !auction) {
    return (
      <DashboardLayout>
        <main className="p-8 bg-white min-h-screen text-gray-900">
          <div className="text-center text-red-600">
            <h1 className="text-xl font-bold mb-2">Error</h1>
            <p>{error || 'Auction not found'}</p>
          </div>
        </main>
      </DashboardLayout>
    );
  }

  // Main UI
  return (
    <DashboardLayout>
      <div className="py-8 px-4 md:px-8 max-w-6xl mx-auto w-full">
        {isPaused && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-4 text-center font-semibold text-lg">
            Auction is currently <span className="text-yellow-900">Paused</span>. Bidding is disabled for all suppliers.
          </div>
        )}
        <AuctionLotMonitorHeader
          auctionTitle={auction.title}
          auctionCode={auction.auctionId}
          invitedSuppliersCount={auction.invitedSuppliers.length}
          status={auction.status === 'Active' ? 'Live' : auction.status}
          autoExtension={!!auction.autoExtension}
          endTime={auction.endTime}
          onPause={handlePause}
          onResume={handleResume}
          isPaused={isPaused}
          isActionLoading={isActionLoading}
          timeRemaining={timeRemaining}
          onViewDetails={() => {}}
          onViewSuppliers={() => {}}
        />

        <AuctionLotSummaryTable
          lots={auction.lots.map(lot => ({ id: lot._id, label: lot.name }))}
          selectedLotId={selectedLot}
          onSelectLot={setSelectedLot}
          summary={getSummaryData() || {
            bestLandedCost: '-',
            bestSupplier: '-',
            estimatedSavings: '-',
            savingsNote: '-',
            previousCost: '-',
            previousNote: '-',
            activeBidders: 0,
          }}
          bids={getFilteredBids()}
        />

        {/* Success/Error Message */}
        {successMessage && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-green-600 text-white rounded shadow font-medium">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-red-600 text-white rounded shadow font-medium">
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </DashboardLayout>
  );
}