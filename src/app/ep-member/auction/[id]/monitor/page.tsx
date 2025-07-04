// 'use client';

// import { useParams } from 'next/navigation';
// import { useEffect, useState, useRef } from 'react';
// import { getSocket, joinAuctionRoom, disconnectSocket } from '@/lib/socket';
// import {
//   fetchAuctionDetails,
//   fetchAuctionMonitoring,
//   fetchAuctionRanking,
//   pauseAuction,
//   resumeAuction,
// } from '@/services/auction.service';
// import { Auction } from '@/types/auction';
// import { Bid } from '@/types/bid';
// import { User } from '@/types/user';
// import Loader from '@/components/shared/Loader';
// import DashboardLayout from '@/components/shared/DashboardLayout';
// import AuctionLotSummaryTable, { BidRow } from '@/components/AuctionMonitor/AuctionLotSummaryTable';
// import AuctionLotMonitorHeader from '@/components/AuctionMonitor/AuctionLotMonitorHeader';

// export default function EPMonitorAuctionPage() {
//   const { id } = useParams();
//   const bottomRef = useRef<HTMLDivElement | null>(null);

//   // State
//   const [auction, setAuction] = useState<Auction | null>(null);
//   const [setMonitoringData] = useState<any>(null);
//   const [rankedBids, setRankedBids] = useState<Bid[]>([]);
//   const [selectedLot, setSelectedLot] = useState<string>('');
//   const [timeRemaining, setTimeRemaining] = useState<number>(0);
//   const [isPaused, setIsPaused] = useState<boolean>(false);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>('');
//   const [highlightedBidId, setHighlightedBidId] = useState<string | null>(null);
//   const [isActionLoading, setIsActionLoading] = useState<boolean>(false);
//   const [successMessage, setSuccessMessage] = useState<string>('');

//   useEffect(() => {
//     const loadAuctionData = async () => {
//       if (!id) return;
//       try {
//         setLoading(true);
//         setError('');
//         const auctionData = await fetchAuctionDetails(id as string);
//         setAuction(auctionData);
//         if (auctionData.lots && auctionData.lots.length > 0) {
//           setSelectedLot(auctionData.lots[0]._id);
//         }
//         const now = new Date().getTime();
//         const endTime = new Date(auctionData.endTime).getTime();
//         setTimeRemaining(Math.max(0, Math.floor((endTime - now) / 1000)));
//         setIsPaused(auctionData.status === 'Paused');
//         setMonitoringData(await fetchAuctionMonitoring(id as string));
//         setRankedBids(await fetchAuctionRanking(id as string));
//       } catch {
//         setError('Failed to load auction data');
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadAuctionData();
//   }, [id]);

//   // Real-time updates
//   useEffect(() => {
//     if (!id || !auction) return;
//     const socket = getSocket();
//     joinAuctionRoom(id as string);
//     socket.on('newBid', (data: { bid: Bid }) => {
//       if (isPaused) return;
//       setHighlightedBidId(data.bid._id);
//       setTimeout(() => setHighlightedBidId(null), 2000);
//       fetchAuctionRanking(id as string).then(setRankedBids);
//       fetchAuctionMonitoring(id as string).then(setMonitoringData);
//       setTimeout(() => {
//         bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
//       }, 100);
//     });
//     socket.on('auctionStatusChanged', (data: { status: string }) => {
//       setIsPaused(data.status === 'Paused');
//       if (auction) {
//         setAuction(prev => prev ? { ...prev, status: data.status as Auction['status'] } : null);
//       }
//     });
//     return () => {
//       disconnectSocket();
//     };
//   }, [id, auction, isPaused]);

//   useEffect(() => {
//     if (!auction || auction.status !== 'Active' || isPaused) return;
//     const timer = setInterval(() => {
//       setTimeRemaining(prev => {
//         if (prev <= 0) {
//           clearInterval(timer);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//     return () => clearInterval(timer);
//   }, [auction, isPaused]);

//   // Pause/resume handlers
//   const handlePause = async () => {
//     if (!id || !auction || isActionLoading) return;
//     setIsActionLoading(true);
//     try {
//       await pauseAuction(id as string);
//       setIsPaused(true);
//       setAuction(prev => prev ? { ...prev, status: 'Paused' } : null);
//       setSuccessMessage('Auction paused successfully');
//       setTimeout(() => setSuccessMessage(''), 3000);
//     } catch {
//       setError('Failed to pause auction');
//     }
//     setIsActionLoading(false);
//   };
//   const handleResume = async () => {
//     if (!id || !auction || isActionLoading) return;
//     setIsActionLoading(true);
//     try {
//       await resumeAuction(id as string);
//       setIsPaused(false);
//       setAuction(prev => prev ? { ...prev, status: 'Active' } : null);
//       setSuccessMessage('Auction resumed successfully');
//       setTimeout(() => setSuccessMessage(''), 3000);
//     } catch {
//       setError('Failed to resume auction');
//     }
//     setIsActionLoading(false);
//   };

//   // Helper
//   function getSupplierName(supplier: string | User) {
//     if (typeof supplier === 'string') return supplier;
//     return supplier.name || supplier.profile?.companyName || 'Unknown Supplier';
//   }

//   // Summary for Table
//   const getSummaryData = () => {
//     if (!rankedBids.length || !auction) return null;
//     const bestBid = rankedBids[0];
//     const previousCost = auction.reservePrice;
//     const currentBestCost = bestBid.totalCost;
//     const savings = previousCost - currentBestCost;
//     const activeBidders = new Set(
//       rankedBids.map(bid =>
//         typeof bid.supplier === 'string' ? bid.supplier : bid.supplier._id
//       )
//     ).size;
//     return {
//       bestLandedCost: `${auction.currency} ${currentBestCost.toFixed(2)}`,
//       bestSupplier: rankedBids.length ? `#1 ${getSupplierName(rankedBids[0].supplier)}` : '-',
//       estimatedSavings: `${auction.currency} ${savings.toFixed(2)}`,
//       savingsNote: '',
//       previousCost: `${auction.currency} ${previousCost.toFixed(2)}`,
//       previousNote: '/ unit',
//       activeBidders,
//     };
//   };

//   // Format for Table
//   function getFilteredBids(): BidRow[] {
//     if (!auction || !selectedLot) return [];
//     const lotObj = auction.lots.find(l => l._id === selectedLot);
//     const productName = lotObj?.name ?? '';
//     return rankedBids
//       .filter(bid => bid.lot === selectedLot)
//       .map((bid, idx) => ({
//         id: bid._id,
//         rank: idx + 1,
//         lotId: bid.lot || '',
//         product: (bid as any).product || productName,
//         supplier: getSupplierName(bid.supplier),
//         fobCost: `${auction.currency} ${bid.fobCost?.toFixed(2) ?? '--'}`,
//         freight: `${auction.currency} ${(bid as any).freight?.toFixed(2) ?? '--'}`,
//         duty: typeof bid.duty === 'number' ? `${bid.duty.toFixed(0)}%` : '--',
//         landedCost: Number(bid.totalCost),
//         bidTime: new Date(bid.updatedAt).toLocaleTimeString(),
//       }));
//   }

//   // Loading/Error
//   if (loading) {
//     return (
//       <DashboardLayout>
//         <main className="p-8 bg-white min-h-screen text-gray-900">
//           <div className="flex items-center justify-center min-h-[400px]">
//             <Loader />
//           </div>
//         </main>
//       </DashboardLayout>
//     );
//   }
//   if (error || !auction) {
//     return (
//       <DashboardLayout>
//         <main className="p-8 bg-white min-h-screen text-gray-900">
//           <div className="text-center text-red-600">
//             <h1 className="text-xl font-bold mb-2">Error</h1>
//             <p>{error || 'Auction not found'}</p>
//           </div>
//         </main>
//       </DashboardLayout>
//     );
//   }

//   // Main UI
//   return (
//     <DashboardLayout>
//       <div className="py-8 px-4 md:px-8 max-w-6xl mx-auto w-full">
// <AuctionLotMonitorHeader
//   auctionTitle={auction.title}
//   auctionCode={auction._id}
//   invitedSuppliersCount={auction.invitedSuppliers.length}
//   status={auction.status === 'Active' ? 'Live' : auction.status}
//   autoExtension={!!auction.autoExtension}
//   endTime={auction.endTime}
//   onPause={handlePause}
//   onResume={handleResume}
//   isPaused={isPaused}
//   isActionLoading={isActionLoading}
//   timeRemaining={timeRemaining}
//   onViewDetails={() => {}} // implement as needed
//   onViewSuppliers={() => {}} // implement as needed
// />


//         <AuctionLotSummaryTable
//           lots={auction.lots.map(lot => ({ id: lot._id, label: lot.name }))}
//           selectedLotId={selectedLot}
//           onSelectLot={setSelectedLot}
//           summary={getSummaryData() || {
//             bestLandedCost: '-',
//             bestSupplier: '-',
//             estimatedSavings: '-',
//             savingsNote: '-',
//             previousCost: '-',
//             previousNote: '-',
//             activeBidders: 0,
//           }}
//           bids={getFilteredBids()}
//         />

//         {/* Success/Error Message */}
//         {successMessage && (
//           <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-green-600 text-white rounded shadow font-medium">
//             {successMessage}
//           </div>
//         )}
//         {error && (
//           <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-red-600 text-white rounded shadow font-medium">
//             {error}
//           </div>
//         )}

//       </div>
//     </DashboardLayout>
//   );
// }


'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { getSocket, joinAuctionRoom, disconnectSocket } from '@/lib/socket';
import {
  fetchAuctionDetails,
  fetchAuctionMonitoring,
  // fetchAuctionRanking,
  pauseAuction,
  resumeAuction,
} from '@/services/auction.service';
import { Auction } from '@/types/auction';
// import { Bid } from '@/types/bid';
// import { User } from '@/types/user';
import Loader from '@/components/shared/Loader';
import DashboardLayout from '@/components/shared/DashboardLayout';
import AuctionLotSummaryTable from '@/components/AuctionMonitor/AuctionLotSummaryTable';
import AuctionLotMonitorHeader from '@/components/AuctionMonitor/AuctionLotMonitorHeader';

export default function EPMonitorAuctionPage() {
  const { id } = useParams();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [auction, setAuction] = useState<Auction | null>(null);
  const [, setMonitoringData] = useState<Record<string, unknown> | null>(null);
  // const [ setRankedBids] = useState<Bid[]>([]);
  // const [ setSelectedLot] = useState<string>('');
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
        const auctionData = await fetchAuctionDetails(id as string);
        setAuction(auctionData);
        if (auctionData.lots && auctionData.lots.length > 0) {
          // setSelectedLot(auctionData.lots[0]._id);
        }
        const now = new Date().getTime();
        const endTime = new Date(auctionData.endTime).getTime();
        setTimeRemaining(Math.max(0, Math.floor((endTime - now) / 1000)));
        setIsPaused(auctionData.status === 'Paused');
        setMonitoringData(await fetchAuctionMonitoring(id as string));
        // setRankedBids(await fetchAuctionRanking(id as string));
      } catch {
        setError('Failed to load auction data');
      } finally {
        setLoading(false);
      }
    };
    loadAuctionData();
  }, [id]);

   useEffect(() => {
    if (!id || !auction) return;
    const socket = getSocket();
    joinAuctionRoom(id as string);
    // FIX: Removed the unused '_data' parameter completely.
    socket.on('newBid', async () => {
      if (isPaused) return;
      // await fetchAuctionRanking(id as string).then(setRankedBids);
      await fetchAuctionMonitoring(id as string).then(setMonitoringData);
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

  // function getSupplierName(supplier: string | User) {
  //   if (typeof supplier === 'string') return supplier;
  //   return supplier.name || supplier.profile?.companyName || 'Unknown Supplier';
  // }

  // const getSummaryData = () => {
  //   if (!rankedBids.length || !auction) return null;
  //   const bestBid = rankedBids[0];
  //   const previousCost = auction.reservePrice;
  //   const currentBestCost = bestBid.totalCost;
  //   const savings = previousCost - currentBestCost;
  //   const activeBidders = new Set(
  //     rankedBids.map(bid =>
  //       typeof bid.supplier === 'string' ? bid.supplier : bid.supplier._id
  //     )
  //   ).size;
  //   return {
  //     bestLandedCost: `${auction.currency} ${currentBestCost.toFixed(2)}`,
  //     bestSupplier: rankedBids.length ? `#1 ${getSupplierName(rankedBids[0].supplier)}` : '-',
  //     estimatedSavings: `${auction.currency} ${savings.toFixed(2)}`,
  //     savingsNote: '',
  //     previousCost: `${auction.currency} ${previousCost.toFixed(2)}`,
  //     previousNote: '/ unit',
  //     activeBidders,
  //   };
  // };

  // function getFilteredBids(): BidRowData[] {
  //   if (!auction || !selectedLot) return [];
  //   const lotObj = auction.lots.find(l => l._id === selectedLot);
  //   const productName = lotObj?.name ?? '';
  //   return rankedBids
  //     .filter(bid => bid.lot === selectedLot)
  //     .map((bid, idx) => ({
  //       id: bid._id,
  //       rank: idx + 1,
  //       lotId: bid.lot || '',
  //       product: (bid as unknown as { product?: string }).product || productName,
  //       supplier: getSupplierName(bid.supplier),
  //       fobCost: `${auction.currency} ${bid.fobCost?.toFixed(2) ?? '--'}`,
  //       freight: `${auction.currency} ${(bid as unknown as { freight?: number }).freight?.toFixed(2) ?? '--'}`,
  //       duty: typeof bid.duty === 'number' ? `${bid.duty.toFixed(0)}%` : '--',
  //       landedCost: Number(bid.totalCost),
  //       bidTime: new Date(bid.updatedAt).toLocaleTimeString(),
  //     }));
  // }

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

  return (
    <DashboardLayout>
      <div className="py-8 px-4 md:px-8 max-w-6xl mx-auto w-full">
        <AuctionLotMonitorHeader
          auctionTitle={auction.title}
          auctionCode={auction._id}
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
          // lots={auction.lots.map(lot => ({ id: lot._id, label: lot.name }))}
          // selectedLotId={selectedLot}
          // onSelectLot={setSelectedLot}
          // summary={getSummaryData() || {
          //   bestLandedCost: '-',
          //   bestSupplier: '-',
          //   estimatedSavings: '-',
          //   savingsNote: '-',
          //   previousCost: '-',
          //   previousNote: '-',
          //   activeBidders: 0,
          // }}
          // bids={getFilteredBids()}
        />

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
      </div>
    </DashboardLayout>
  );
}