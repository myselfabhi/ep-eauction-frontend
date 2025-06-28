'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { getSocket, joinAuctionRoom, disconnectSocket } from '@/lib/socket';
import { 
  fetchAuctionDetails, 
  fetchAuctionMonitoring, 
  fetchAuctionRanking,
  pauseAuction,
  resumeAuction
} from '@/services/auction.service';
import { Auction } from '@/types/auction';
import { Bid } from '@/types/bid';
import { User } from '@/types/user';
import Loader from '@/components/shared/Loader';

interface MonitoringData {
  auction: Auction;
  participationCount: number;
  bidTimeline: Array<{
    supplier: string;
    amount: number;
    createdAt: string;
  }>;
}

export default function EPMonitorAuctionPage() {
  const { id } = useParams();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // State
  const [auction, setAuction] = useState<Auction | null>(null);
  const [monitoringData, setMonitoringData] = useState<MonitoringData | null>(null);
  const [rankedBids, setRankedBids] = useState<Bid[]>([]);
  const [selectedLot, setSelectedLot] = useState<string>('');
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [highlightedBidId, setHighlightedBidId] = useState<string | null>(null);
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Load auction data
  useEffect(() => {
    const loadAuctionData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError('');

        // Fetch auction details
        const auctionData = await fetchAuctionDetails(id as string);
        setAuction(auctionData);

        // Set selected lot to first lot if available
        if (auctionData.lots && auctionData.lots.length > 0) {
          setSelectedLot(auctionData.lots[0]._id);
        }

        // Calculate time remaining
        const now = new Date().getTime();
        const endTime = new Date(auctionData.endTime).getTime();
        const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
        setTimeRemaining(remaining);

        // Set pause state
        setIsPaused(auctionData.status === 'Paused');

        // Load monitoring data
        const monitoring = await fetchAuctionMonitoring(id as string);
        setMonitoringData(monitoring);

        // Load ranking data
        const ranking = await fetchAuctionRanking(id as string);
        setRankedBids(ranking);

      } catch (err) {
        console.error('Failed to load auction data:', err);
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

    socket.on('connect', () => {
      console.log('Connected to auction monitoring');
    });

    socket.on('newBid', (data: { bid: Bid }) => {
      if (isPaused) return;
      
      // Highlight the new bid
      setHighlightedBidId(data.bid._id);
      setTimeout(() => setHighlightedBidId(null), 2000);

      // Refresh ranking data
      fetchAuctionRanking(id as string).then(setRankedBids);
      
      // Refresh monitoring data
      fetchAuctionMonitoring(id as string).then(setMonitoringData);

      // Auto-scroll to bottom
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

  // Timer countdown
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

  // Handle pause/resume
  const handlePauseResume = async () => {
    if (!id || !auction || isActionLoading) return;

    try {
      setIsActionLoading(true);
      console.log('Current auction status:', auction.status);
      
      if (auction.status === 'Paused') {
        console.log('Attempting to resume auction...');
        const result = await resumeAuction(id as string);
        console.log('Resume result:', result);
        
        // Update local state
        setIsPaused(false);
        setAuction(prev => prev ? { ...prev, status: 'Active' } : null);
        
        // Clear any error state
        setError('');
        setSuccessMessage('Auction resumed successfully');
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } else if (auction.status === 'Active') {
        console.log('Attempting to pause auction...');
        const result = await pauseAuction(id as string);
        console.log('Pause result:', result);
        
        // Update local state
        setIsPaused(true);
        setAuction(prev => prev ? { ...prev, status: 'Paused' } : null);
        
        // Clear any error state
        setError('');
        setSuccessMessage('Auction paused successfully');
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        console.log('Auction cannot be paused/resumed in current status:', auction.status);
        setError(`Cannot pause/resume auction in ${auction.status} status`);
      }
    } catch (err) {
      console.error('Failed to pause/resume auction:', err);
      const action = auction.status === 'Paused' ? 'resume' : 'pause';
      setError(`Failed to ${action} auction: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Format time
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // Get supplier display name
  const getSupplierName = (supplier: string | User) => {
    if (typeof supplier === 'string') return supplier;
    return supplier.name || supplier.profile?.companyName || 'Unknown Supplier';
  };

  // Calculate summary data
  const getSummaryData = () => {
    if (!rankedBids.length || !auction) return null;

    const bestBid = rankedBids[0];
    const previousCost = auction.reservePrice;
    const currentBestCost = bestBid.totalCost;
    const savings = previousCost - currentBestCost;
    const activeBidders = new Set(rankedBids.map(bid => 
      typeof bid.supplier === 'string' ? bid.supplier : bid.supplier._id
    )).size;

    return {
      bestLandedCost: `${auction.currency} ${currentBestCost.toFixed(2)}`,
      estimatedSavings: `${auction.currency} ${savings.toFixed(2)}`,
      previousCost: `${auction.currency} ${previousCost.toFixed(2)}`,
      activeBidders,
      participationRate: auction.invitedSuppliers.length > 0 
        ? Math.round((activeBidders / auction.invitedSuppliers.length) * 100)
        : 0
    };
  };

  // Filter bids by selected lot
  const getFilteredBids = () => {
    if (!selectedLot) return rankedBids;
    return rankedBids.filter(bid => bid.lot === selectedLot);
  };

  if (loading) {
    return (
      <main className="p-8 bg-white min-h-screen text-gray-900">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader />
        </div>
      </main>
    );
  }

  if (error || !auction) {
    return (
      <main className="p-8 bg-white min-h-screen text-gray-900">
        <div className="text-center text-red-600">
          <h1 className="text-xl font-bold mb-2">Error</h1>
          <p>{error || 'Auction not found'}</p>
        </div>
      </main>
    );
  }

  const summary = getSummaryData();
  const filteredBids = getFilteredBids();

  return (
    <main className="p-8 bg-white min-h-screen text-gray-900">
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <span>/</span>
          <button 
            onClick={() => window.location.href = '/ep-member/dashboard'}
            className="hover:text-blue-600 transition-colors"
          >
            Dashboard
          </button>
          <span>/</span>
          <span className="text-gray-900 font-medium">Auction Monitor</span>
        </nav>
      </div>

      {/* Auction Header */}
      <h1 className="text-2xl font-bold mb-1">{auction.title}</h1>
      <div className="flex flex-wrap gap-4 text-sm mb-4">
        <span>Auction #: <b>{auction._id}</b></span>
        <span>Status: <b className={`${
          auction.status === 'Active' ? 'text-green-600' : 
          auction.status === 'Paused' ? 'text-yellow-600' : 
          'text-red-600'
        }`}>{auction.status}</b></span>
        <span>Invited suppliers: {auction.invitedSuppliers.length}</span>
        <span>Started: {new Date(auction.startTime).toLocaleString()}</span>
        <span>Closing: {new Date(auction.endTime).toLocaleString()}</span>
      </div>

      {/* Paused Auction Alert */}
      {auction.status === 'Paused' && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800">
                Auction is currently paused
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
  Suppliers cannot place new bids while the auction is paused. Click &quot;Resume Auction&quot; to continue.
</p>

            </div>
            <button
              onClick={handlePauseResume}
              disabled={isActionLoading}
              className="flex-shrink-0 px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isActionLoading ? 'Processing...' : 'Resume Auction'}
            </button>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800">
                {successMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Auction Control */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <button
            onClick={handlePauseResume}
            disabled={auction.status === 'Ended' || isActionLoading}
            className={`px-4 py-2 rounded text-sm border transition-colors ${
              isPaused 
                ? 'bg-green-100 border-green-300 text-green-700 hover:bg-green-200'
                : 'bg-yellow-100 border-yellow-300 text-yellow-700 hover:bg-yellow-200'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isActionLoading ? 'Processing...' : (isPaused ? 'Resume Auction' : 'Pause Auction')}
          </button>
        </div>
        <div className={`text-sm font-semibold border px-3 py-1 rounded ${
          auction.status === 'Active' && !isPaused
            ? 'text-red-500 border-red-500'
            : 'text-gray-500 border-gray-500'
        }`}>
          {auction.status === 'Active' && !isPaused 
            ? `Live - ${formatTime(timeRemaining)} Time Remaining`
            : auction.status === 'Paused'
            ? 'Paused'
            : auction.status === 'Ended'
            ? 'Ended'
            : 'Scheduled'
          }
        </div>
      </div>

      {/* LOT Tabs */}
      {auction.lots && auction.lots.length > 0 && (
        <div className="flex gap-2 mb-4">
          {auction.lots.map((lot) => (
            <button
              key={lot._id}
              onClick={() => setSelectedLot(lot._id)}
              className={`px-4 py-1 rounded-full text-sm border transition-colors ${
                selectedLot === lot._id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
              }`}
            >
              {lot.name}
            </button>
          ))}
        </div>
      )}

      {/* Summary Cards */}
      {summary && (
        <div className="bg-gray-50 border rounded p-4 mb-6 grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div>
            <p className="mb-1 text-gray-600">Best Landed Cost</p>
            <p className="text-green-600 font-bold text-lg">{summary.bestLandedCost}</p>
          </div>
          <div>
            <p className="mb-1 text-gray-600">Estimated Savings</p>
            <p className="text-green-600 font-bold text-lg">{summary.estimatedSavings}</p>
          </div>
          <div>
            <p className="mb-1 text-gray-600">Previous Cost</p>
            <p className="text-black font-bold text-lg">{summary.previousCost}</p>
          </div>
          <div>
            <p className="mb-1 text-gray-600">Active Bidders</p>
            <p className="text-black font-bold text-lg">{summary.activeBidders}</p>
          </div>
          <div>
            <p className="mb-1 text-gray-600">Participation Rate</p>
            <p className="text-blue-600 font-bold text-lg">{summary.participationRate}%</p>
          </div>
        </div>
      )}

      {/* Bids Table */}
      <div className="bg-white border rounded overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b">
          <h3 className="font-semibold">Live Bids Ranking</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-2 font-medium">Rank</th>
                <th className="px-4 py-2 font-medium">Supplier</th>
                <th className="px-4 py-2 font-medium">Base Price</th>
                <th className="px-4 py-2 font-medium">FOB Cost</th>
                <th className="px-4 py-2 font-medium">Tax</th>
                <th className="px-4 py-2 font-medium">Duty</th>
                <th className="px-4 py-2 font-medium">Total Cost</th>
                <th className="px-4 py-2 font-medium">Score</th>
                <th className="px-4 py-2 font-medium">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {filteredBids.length > 0 ? (
                filteredBids.map((bid, index) => (
                  <tr
                    key={bid._id}
                    className={`border-t hover:bg-gray-50 transition-colors ${
                      highlightedBidId === bid._id ? 'bg-yellow-100' : ''
                    }`}
                  >
                    <td className="px-4 py-2 font-bold text-green-600">
                      #{index + 1}
                    </td>
                    <td className="px-4 py-2">
                      {getSupplierName(bid.supplier)}
                    </td>
                    <td className="px-4 py-2">
                      {auction.currency} {bid.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-2">
                      {auction.currency} {bid.fobCost.toFixed(2)}
                    </td>
                    <td className="px-4 py-2">
                      {auction.currency} {bid.tax.toFixed(2)}
                    </td>
                    <td className="px-4 py-2">
                      {auction.currency} {bid.duty.toFixed(2)}
                    </td>
                    <td className={`px-4 py-2 font-semibold ${
                      index === 0 ? 'text-green-600' : 'text-black'
                    }`}>
                      {auction.currency} {bid.totalCost.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {bid.score?.toFixed(2) || 'N/A'}
                    </td>
                    <td className="px-4 py-2 text-gray-500">
                      {new Date(bid.updatedAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    No bids yet for this {selectedLot ? 'lot' : 'auction'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div ref={bottomRef}></div>
      </div>

      {/* Bid Timeline */}
      {monitoringData && monitoringData.bidTimeline.length > 0 && (
        <div className="mt-6 bg-white border rounded overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b">
            <h3 className="font-semibold">Bid Activity Timeline</h3>
          </div>
          <div className="p-4 max-h-60 overflow-y-auto">
            {monitoringData.bidTimeline.map((bid, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                <span className="text-sm">
                  <strong>Supplier {bid.supplier}</strong> placed a bid of{' '}
                  <strong>{auction.currency} {bid.amount.toFixed(2)}</strong>
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(bid.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
