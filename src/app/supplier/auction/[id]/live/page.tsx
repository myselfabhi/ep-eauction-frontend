'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import SupplierLayout from '@/components/shared/SupplierLayout';
import ConfirmBidModal from '@/components/ui/modal/ConfirmBidModal';
import { Auction } from '@/types/auction';
import { bidService } from '@/services';
import { Bid } from '@/types/bid';
import { getSocket, joinAuctionRoom, disconnectSocket } from '@/lib/socket';
import ViewAuctionDetailsModal from '@/components/ui/modal/ViewAuctionDetailsModal';
import type { ViewAuctionDetailsModalProps } from '@/components/ui/modal/ViewAuctionDetailsModal';
import ModalWrapper from '@/components/ui/modal/ModalWrapper';

// const initialActiveBids = [
//   {
//     id: 'LOT-CC-001',
//     product: '8oz Paper Cups',
//     quantity: '50,000 units',
//     bidders: 12,
//     lastUpdate: '2s ago',
//     rank: 1,
//     yourBid: '$0.40',
//     updateBid: '$0.40',
//     status: 'success',
//     confirmed: true,
//   },
//   {
//     id: 'LOT-CC-001',
//     product: '8oz Paper Cups',
//     quantity: '50,000 units',
//     bidders: 12,
//     lastUpdate: '2s ago',
//     rank: 6,
//     yourBid: '$0.40',
//     updateBid: '$0.60',
//     status: 'danger',
//     confirmed: false,
//   },
//   {
//     id: 'LOT-CC-001',
//     product: '8oz Paper Cups',
//     quantity: '50,000 units',
//     bidders: 12,
//     lastUpdate: '2s ago',
//     rank: 10,
//     yourBid: '$0.40',
//     updateBid: '$0.40',
//     status: 'danger',
//     confirmed: false,
//   },
// ];

// const initialAvailableLots = [
//   {
//     id: 'LOT-CC-001',
//     product: '8oz Paper Cups',
//     quantity: '50,000 units',
//     bidders: 12,
//     bid: '',
//     inputMode: false,
//     confirmed: false,
//     disabled: false,
//   },
//   ...Array.from({ length: 4 }).map(() => ({
//     id: 'LOT-CC-001',
//     product: '8oz Paper Cups',
//     quantity: '50,000 units',
//     bidders: 12,
//     bid: '',
//     inputMode: false,
//     confirmed: false,
//     disabled: false,
//   })),
// ];

export default function SupplierAuctionLivePage() {
  const params = useParams();
  const auctionId = params.id as string;
  const id = auctionId; // For localStorage key
  
  // Real auction data state
  const [auctionData, setAuctionData] = useState<Auction | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('00 : 00 : 00');
  const [timeOffset, setTimeOffset] = useState(0); // NEW: Offset between server and client time
  
  const [expandLot, setExpandLot] = useState<string | null>('LOT-CC-001_0');
  const [showLots, setShowLots] = useState(true);
  const [activeBids, setActiveBids] = useState<Bid[]>([]);
  const [editBid, setEditBid] = useState<string | null>(null); // bid._id being edited
  const [editBidValue, setEditBidValue] = useState<string>('');
  const [isPaused, setIsPaused] = useState(false);
  
  // Get modal values from localStorage
  const getModalValues = () => {
    if (typeof window === 'undefined') return null;
    
    console.log('🔍 Getting modal values for auction ID:', id);
    
    const fob = localStorage.getItem(`auction_fob_${id}`);
    const currency = localStorage.getItem(`auction_currency_${id}`);
    const cartonStr = localStorage.getItem(`auction_carton_${id}`);
    
    console.log('🔍 Raw localStorage values:');
    console.log('  - FOB:', fob);
    console.log('  - Currency:', currency);
    console.log('  - Carton (string):', cartonStr);
    
    if (!fob || !currency || !cartonStr) {
      console.log('❌ Missing required values in localStorage');
      return null;
    }
    
    try {
      const carton = JSON.parse(cartonStr);
      const result = {
        fob: Number(fob),
        currency,
        carton
      };
      console.log('✅ Parsed modal values:', result);
      return result;
    } catch (error) {
      console.error('❌ Error parsing carton values from localStorage:', error);
      return null;
    }
  };

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);

  // New: Track bid input state
  const [bidInput, setBidInput] = useState<{ [lotId: string]: string }>({});
  const [placingBid, setPlacingBid] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [viewDetailsData, setViewDetailsData] = useState<ViewAuctionDetailsModalProps['auction'] | null>(null);
  const [showBidErrorModal, setShowBidErrorModal] = useState(false);
  const [bidErrorMessage, setBidErrorMessage] = useState('');

  // Add a function to fetch auction details for the modal
  const handleViewDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auction/${auctionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) {
        throw new Error('Auction not found');
      }
      const details = await res.json();
      setViewDetailsData(details);
      setViewDetailsOpen(true);
    } catch (err) {
      setViewDetailsData(null);
      setViewDetailsOpen(true);
      console.error('Failed to fetch auction details:', err);
    }
  };

  // Fetch auction data and server time on mount
  useEffect(() => {
    const fetchAuctionData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auction/${auctionId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) {
          throw new Error('Auction not found');
        }
        const data = await res.json();
        setAuctionData(data);
        // Get server time from Date header
        const serverTimeString = res.headers.get('Date');
        if (serverTimeString) {
          const serverTime = new Date(serverTimeString).getTime();
          const clientTime = Date.now();
          setTimeOffset(serverTime - clientTime);
        } else {
          setTimeOffset(0); // fallback if header missing
        }
      } catch (err) {
        console.error('DEBUG: Error fetching auction data:', err);
      }
    };
    if (auctionId) {
      fetchAuctionData();
    }
  }, [auctionId]);

  // Live countdown timer for auction end (using server time offset)
  useEffect(() => {
    if (!auctionData?.endTime) return;
    const updateCountdown = () => {
      const now = Date.now() + timeOffset; // Use offset
      const end = new Date(auctionData.endTime).getTime();
      const diff = end - now;
      if (diff <= 0) {
        setTimeLeft('00 : 00 : 00');
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft(
        `${hours.toString().padStart(2, '0')} : ${minutes
          .toString()
          .padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`
      );
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [auctionData?.endTime, timeOffset]);

  // Socket: Listen for auction pause/resume
  useEffect(() => {
    if (!auctionId) return;
    const socket = getSocket();
    joinAuctionRoom(auctionId);
    socket.on('auctionStatusChanged', (data) => {
      setIsPaused(data.status === 'Paused');
    });
    return () => {
      disconnectSocket();
    };
  }, [auctionId]);

  // Fetch active bids ranking for this auction
  const fetchRanking = useCallback(async () => {
    if (!auctionId) return;
    try {
      const ranking = await bidService.getRanking(auctionId);
      setActiveBids(ranking);
    } catch (err) {
      console.error('Failed to fetch bid ranking:', err);
    }
  }, [auctionId]);

  // Fetch ranking on mount and after each bid
  useEffect(() => {
    fetchRanking();
  }, [auctionId, fetchRanking]);

  const gbpRates: Record<string, number> = {
    GBP: 1,
    USD: 1.35,
    CNY: 9.71,
    VND: 35364.06,
    TRY: 54.72,
    EUR: 1.15,
    INR: 116.79,
  };

  function convertCurrency(amount: number, from: string, to: string): number {
    if (from === to) return amount;
    const rateFrom = gbpRates[from];
    const rateTo = gbpRates[to];
    if (!rateFrom || !rateTo) return amount; // fallback: no conversion
    // Convert from 'from' to GBP, then GBP to 'to'
    const amountInGbp = amount / rateFrom;
    return amountInGbp * rateTo;
  }

  // Auction Header (matches your screenshot)
  function AuctionHeader() {
    if (!auctionData) {
      return (
        <div className="flex justify-between items-start mb-8 w-full max-w-[1050px] mx-auto">
          <div className="text-[20px] font-semibold mb-[2px] tracking-tight text-[#232323]">
            Loading auction data...
          </div>
        </div>
      );
    }

    const localCurrency = typeof window !== 'undefined'
      ? localStorage.getItem(`auction_currency_${auctionData._id || auctionData.auctionId}`)
      : null;

    // Normalize currency codes
    const auctionCurrency = auctionData.currency ? auctionData.currency.trim().toUpperCase() : '';
    const userCurrency = localCurrency ? localCurrency.trim().toUpperCase() : '';

    // Debug log for normalization and lookup
    console.log(
      'NORMALIZED:', { auctionCurrency, userCurrency },
      'GBP Rate for auctionCurrency:', gbpRates[auctionCurrency],
      'GBP Rate for userCurrency:', gbpRates[userCurrency]
    );

    // Reserve price conversion logic
    let displayReservePrice: number | null = Number(auctionData.reservePrice);
    let displayCurrency = userCurrency;
    let conversionError = false;
    if (
      userCurrency &&
      gbpRates[auctionCurrency] &&
      gbpRates[userCurrency]
    ) {
      displayReservePrice = convertCurrency(Number(auctionData.reservePrice), auctionCurrency, userCurrency);
    } else if (userCurrency && (!gbpRates[auctionCurrency] || !gbpRates[userCurrency])) {
      conversionError = true;
    } else {
      displayCurrency = auctionCurrency;
    }

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleString();
    };

    return (
      <div className="flex justify-between items-start mb-8 w-full max-w-[1050px] mx-auto">
        <div>
          <div className="text-[20px] font-semibold mb-[2px] tracking-tight text-[#232323]">
            {auctionData.title}
          </div>
          <div className="flex items-center gap-2 text-[13px] text-[#555] mb-[3px]">
            Auction ID:
            <span className="font-mono text-[13px] font-medium text-black">
                {auctionData.auctionId}
            </span>
            <span className="mx-2 text-[#aaa]">|</span>
            <button
              className="text-blue-600 underline cursor-pointer font-medium"
              onClick={handleViewDetails}
              type="button"
            >
              View Details
            </button>
          </div>
          <div className="flex items-center gap-12 mt-1 text-[13px]">
            <div>
              <div className="text-[#777] font-medium">Currency</div>
              <div className="text-black font-medium">{localCurrency}</div>
            </div>
            <div>
              <div className="text-[#777] font-medium">Reserve Price</div>
              {conversionError ? (
                <div className="text-black font-medium">Conversion for this value is not present for now</div>
              ) : (
                <div className="text-black font-medium">{displayReservePrice.toFixed(2)} {displayCurrency}</div>
              )}
            </div>
            <div>
              <div className="text-[#777] font-medium">End Time</div>
              <div className="text-black font-medium">{formatDate(auctionData.endTime)}</div>
            </div>
          </div>
        </div>
        <div className="border border-red-400 rounded-lg px-10 py-5 flex flex-col items-center min-w-[170px] shadow-sm bg-white mt-[-12px]">
          <div className="uppercase text-red-600 font-semibold text-xs tracking-wide mb-1">AUCTION LIVE</div>
          <div className="font-mono text-2xl font-semibold text-red-600 tracking-wide mb-1">{timeLeft}</div>
          <div className="text-xs text-gray-500">Time Remaining</div>
        </div>
      </div>
    );
  }

  const tdBase = "py-[10px] px-6 align-middle text-[15px]";
  const tdRank = "font-semibold";

  // --- Confirm Modal Handlers ---
  const handleCancel = () => {
    setModalOpen(false);
  };
  const handleConfirm = () => {
    setModalOpen(false);
  };

  // Place bid handler
  const handlePlaceBid = async (lot: Auction['lots'][0]) => {
    if (!auctionData || isPaused) return;
    const bidValue = Number(bidInput[lot._id]);
    if (
      typeof auctionData.reservePrice === 'number' &&
      bidValue > auctionData.reservePrice
    ) {
      setBidErrorMessage(`Your bid cannot exceed the reserve price of ${auctionData.reservePrice}.`);
      setShowBidErrorModal(true);
      return;
    }
    setIsSubmitting(true);
    try {
      const modalValues = getModalValues();
      console.log('🔍 Modal Values:', modalValues);
      console.log('🔍 Lot:', lot);
      console.log('🔍 Bid Input:', bidInput[lot._id]);
      
      const payload = {
        auctionId: auctionData._id,
        lotId: lot._id,
        amount: Number(bidInput[lot._id]),
        currency: modalValues?.currency || auctionData.currency,
        fob: modalValues?.fob || 0,        // Only fob field - consistent with backend
        carton: modalValues?.carton[lot.lotId || ''] || 0,
        tax: 0,
        duty: 0,
        performanceScore: 0,
      };
      
      console.log('🚀 Sending Bid Payload:', payload);
      console.log('🚀 Payload JSON:', JSON.stringify(payload, null, 2));
      
      const response = await bidService.create(payload);
      console.log('✅ Bid Response:', response);
      
      // Add the new bid to the table and fetch latest ranking
      await fetchRanking();
      setBidInput(prev => ({ ...prev, [lot._id]: '' }));
      setPlacingBid(null);
    } catch (err) {
      alert('Failed to place bid.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update bid handler
  const handleUpdateBid = async (bid: Bid) => {
    if (isPaused) return;
    const newBidValue = Number(editBidValue);
    if (typeof bid.amount === 'number' && newBidValue > bid.amount) {
      setBidErrorMessage('You cannot update your bid to a value higher than your previous bid.');
      setShowBidErrorModal(true);
      return;
    }
    setIsSubmitting(true);
    try {
      const modalValues = getModalValues();
      console.log('🔍 Update - Modal Values:', modalValues);
      console.log('🔍 Update - Current Bid:', bid);
      console.log('🔍 Update - Edit Value:', editBidValue);
      
      const payload = {
        amount: Number(editBidValue),
        currency: modalValues?.currency || bid.currency,
        fob: modalValues?.fob || bid.fob, // Only fob field - consistent with backend
        carton: modalValues?.carton?.[
          (bid.lot && typeof bid.lot === 'object' && 'lotId' in bid.lot && bid.lot.lotId) ? bid.lot.lotId : ''
        ] ?? bid.carton,
        tax: bid.tax,
        duty: bid.duty,
        performanceScore: bid.performanceScore,
      };
      
      console.log('🚀 Sending Update Payload:', payload);
      console.log('🚀 Update Payload JSON:', JSON.stringify(payload, null, 2));
      
      const response = await bidService.update(bid._id, payload);
      console.log('✅ Update Response:', response);
      
      await fetchRanking();
      setEditBid(null);
      setEditBidValue('');
    } catch (err) {
      alert('Failed to update bid.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  function ProductSpecsRow({ lot }: { lot: Auction['lots'][0] }) {
    const formatDimensions = (dims: { l?: string; w?: string; h?: string } | undefined) => {
      if (!dims) return 'N/A';
      const { l, w, h } = dims;
      return `${l || 'N/A'} x ${w || 'N/A'} x ${h || 'N/A'}`;
    };

    return (
      <tr className="bg-[#f7f8fa] border-b border-[#f1f1f1]">
        <td colSpan={8} className="py-4 px-8">
          <div className="grid grid-cols-4 gap-y-1 gap-x-7 text-xs">
            <div>
              <b>Dimensions</b><br />{formatDimensions(lot.dimensions)}
            </div>
            <div>
              <b>Material</b><br />{lot.material || 'N/A'}
            </div>
            <div>
              <b>HS Code</b><br />{lot.hsCode || 'N/A'}
            </div>
            <div>
              <b>Previous Cost</b><br />{lot.prevCost || 'N/A'}
            </div>
            <div>
              <b>Volume</b><br />{lot.volume || 'N/A'}
            </div>
            <div>
              <b>Lot ID</b><br />{lot.lotId || 'N/A'}
            </div>
            <div>
              <b>Created</b><br />{new Date(lot.createdAt).toLocaleDateString()}
            </div>
            <div>
              <b>Updated</b><br />{new Date(lot.updatedAt).toLocaleDateString()}
            </div>
          </div>
        </td>
      </tr>
    );
  }

  // Compute available lots (lots without an active bid by this supplier)
  const availableLots = auctionData?.lots?.filter(lot => !activeBids.some(bid => bid.lot === lot._id)) || [];
  const localCurrency = typeof window !== 'undefined'
    ? localStorage.getItem(`auction_currency_${auctionData?._id || auctionData?.auctionId}`)
    : null;

  return (
    <SupplierLayout>
      <div className="pt-8 pb-2 px-4 min-h-screen bg-[#fafbfc]">
        {isPaused && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-4 text-center font-semibold text-lg">
            Auction is currently <span className="text-yellow-900">Paused</span>. Bidding is disabled.
          </div>
        )}
        <AuctionHeader />

        <div className="max-w-[1100px] mx-auto">
          {/* Active Bids Table */}
          <div className="bg-white rounded-2xl border border-[#ececec] shadow mb-5">
            <div className="px-6 pt-4 font-semibold text-[15px] text-[#232323] flex items-center">
              ACTIVE BIDS <span className="ml-1 text-gray-400">{activeBids.length}</span>
            </div>
            <table className="w-full border-separate border-spacing-0 text-[15px]">
              <thead>
                <tr className="text-[#7b7b7b] font-semibold bg-[#f7f8fa] border-b border-[#f0f0f0]">
                  <th className="text-left py-2 px-6 rounded-tl-xl">LOT ID</th>
                  <th className="text-left py-2">Product</th>
                  <th className="text-left py-2">Quantity</th>
                  <th className="text-left py-2">Last update</th>
                  <th className="text-left py-2">Rank</th>
                  <th className="text-left py-2">Your Bid</th>
                  <th className="text-left py-2 rounded-tr-xl">Update bid</th>
                </tr>
              </thead>
              <tbody>
                {activeBids.map((bid) => (
                  <React.Fragment key={bid._id}>
                    <tr className={`border-b border-[#f1f1f1] ${bid.status === 'Active' ? '' : 'bg-gray-100'}`}>
                      {(() => {
                        // Find the lot associated with this bid
                        const lot = auctionData?.lots.find(l => l._id === bid.lot);
                        return (
                          <>
                            <td className={tdBase + ' font-semibold'}>
                              <span className={`inline-block w-4 h-4 rounded-full mr-1 align-middle ${bid.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                              {lot?.lotId || (typeof bid.lot === 'string' ? bid.lot : '')}
                            </td>
                            <td className={tdBase}>{lot?.name || ''}</td>
                            <td className={tdBase}>{lot?.volume ?? ''}</td>
                            <td className={tdBase}>{new Date(bid.updatedAt).toLocaleString()}</td>
                          </>
                        );
                      })()}
                      <td className={tdBase + ' ' + tdRank} style={{ color: bid.rank === 1 ? '#2b9500' : '#e53935' }}>
                        {bid.rank ? `#${bid.rank}` : '--'}
                      </td>
                      <td className={tdBase + ' font-bold'}>{bid.amount} {localCurrency ? localCurrency.trim().toUpperCase() : ''}</td>
                      <td className={tdBase}>
                        {editBid === bid._id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              className="border rounded px-2 py-1 w-20 text-right text-black font-medium text-sm"
                              value={editBidValue}
                              onChange={e => setEditBidValue(e.target.value)}
                              min={0}
                              disabled={isSubmitting || isPaused}
                            />
                            <span className="font-medium text-gray-700">{localCurrency ? localCurrency.trim().toUpperCase() : ''}</span>
                            <button
                              className="flex items-center justify-center w-6 h-6 rounded-[4px] bg-green-50 border border-green-500 text-green-600 text-lg font-semibold transition hover:bg-green-100"
                              title="Confirm"
                              disabled={isSubmitting || !editBidValue || isPaused}
                              onClick={() => handleUpdateBid(bid)}
                            >
                              ✓
                            </button>
                            <button
                              className="ml-1 text-gray-400 hover:text-red-500 text-lg font-bold"
                              onClick={() => setEditBid(null)}
                              disabled={isSubmitting || isPaused}
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span>{bid.amount} {localCurrency ? localCurrency.trim().toUpperCase() : ''}</span>
                            <button
                              className="flex items-center justify-center w-6 h-6 rounded-[4px] bg-blue-50 border border-blue-500 text-blue-600 text-lg font-semibold transition hover:bg-blue-100"
                              title="Edit"
                              onClick={() => {
                                setEditBid(bid._id);
                                setEditBidValue(bid.amount.toString());
                              }}
                              disabled={isSubmitting || isPaused}
                            >
                              ✎
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Available Lots Table */}
          <div className="bg-white rounded-2xl border border-[#ececec] shadow">
            <div className="flex items-center px-6 pt-4 font-semibold text-[15px] text-[#232323]">
              <span>AVAILABLE LOTS</span>
              <span className="ml-1 text-gray-400">{availableLots.length}</span>
              <span className="ml-5 text-[13px] text-gray-500 cursor-pointer select-none"
                onClick={() => setShowLots((prev) => !prev)}
              >
                {showLots ? <>Hide <span className="font-bold">⌃</span></> : <>Show <span className="font-bold">⌄</span></>}
              </span>
            </div>
            {showLots && (
              availableLots.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500 text-[15px]">No available lots to bid on.</div>
              ) : (
                <table className="w-full border-separate border-spacing-0 text-[15px]">
                  <thead>
                    <tr className="text-[#7b7b7b] font-semibold bg-[#f7f8fa] border-b border-[#f0f0f0]">
                      <th className="text-left py-2 px-6 rounded-tl-xl">LOT ID</th>
                      <th className="text-left py-2">Product</th>
                      <th className="text-left py-2">Quantity</th>
                      <th className="text-left py-2">Active bidders</th>
                      <th className="text-left py-2">Last update</th>
                      <th className="text-left py-2">Rank</th>
                      <th className="text-left py-2 rounded-tr-xl">Your Bid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availableLots.map((realLot, idx: number) => {
                      return (
                        <React.Fragment key={idx}>
                          <tr className="border-b border-[#f1f1f1] hover:bg-[#fafbfc] group transition">
                            <td className={tdBase + ' font-semibold text-black'}>
                              <button
                                className="focus:outline-none"
                                onClick={() => setExpandLot(expandLot === `${realLot.lotId}_${idx}` ? null : `${realLot.lotId}_${idx}`)}
                              >
                                {expandLot === `${realLot.lotId}_${idx}` ? '▾' : '▸'}
                              </button>{' '}
                              {realLot.lotId}
                            </td>
                            <td className={tdBase}>{realLot.name}</td>
                            <td className={tdBase}>{realLot.volume || 'N/A'}</td>
                            <td className={tdBase}>--</td>
                            <td className={tdBase}>--</td>
                            <td className={tdBase}>
                              {(() => {
                                const bid = activeBids.find(b => b.lot === realLot._id);
                                return bid && bid.rank ? `#${bid.rank}` : '--';
                              })()}
                            </td>
                            <td className={tdBase}>
                              {placingBid === realLot._id ? (
                                <div className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    className="border rounded px-2 py-1 w-20 text-right text-black font-medium text-sm"
                                    value={bidInput[realLot._id] || ''}
                                    onChange={e => setBidInput(prev => ({ ...prev, [realLot._id]: e.target.value }))}
                                    min={0}
                                    disabled={isSubmitting || isPaused}
                                  />
                                  <span className="font-medium text-gray-700">{localCurrency}</span>
                                  <button
                                    className="flex items-center justify-center w-6 h-6 rounded-[4px] bg-green-50 border border-green-500 text-green-600 text-lg font-semibold transition hover:bg-green-100"
                                    title="Confirm"
                                    disabled={isSubmitting || !bidInput[realLot._id] || isPaused}
                                    onClick={() => handlePlaceBid(realLot)}
                                  >
                                    ✓
                                  </button>
                                  <button
                                    className="ml-1 text-gray-400 hover:text-red-500 text-lg font-bold"
                                    onClick={() => setPlacingBid(null)}
                                    disabled={isSubmitting || isPaused}
                                  >
                                    ×
                                  </button>
                                </div>
                              ) : (
                                <button
                                  className="text-blue-600 underline font-medium px-1 py-1"
                                  style={{ fontSize: 15, letterSpacing: '-0.5px' }}
                                  onClick={() => {
                                    const fob = localStorage.getItem(`auction_fob_${auctionId}`);
                                    const carton = localStorage.getItem(`auction_carton_${auctionId}`);
                                    const currency = localStorage.getItem(`auction_currency_${auctionId}`);
                                    if (!fob || !carton || !currency) {
                                      setModalOpen(true);
                                    } else {
                                      setPlacingBid(realLot._id);
                                    }
                                  }}
                                  disabled={isPaused}
                                >
                                  Place bid
                                </button>
                              )}
                            </td>
                          </tr>
                          {expandLot === `${realLot.lotId}_${idx}` && (
                            <ProductSpecsRow lot={realLot} />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              )
            )}
          </div>
        </div>

        {/* Confirmation Modal (imported version) */}
        <ConfirmBidModal
          open={modalOpen}
          onCancel={handleCancel}
          onConfirm={handleConfirm}
        />
        <ViewAuctionDetailsModal
          open={viewDetailsOpen}
          onClose={() => {
            setViewDetailsOpen(false);
            setViewDetailsData(null);
          }}
          auction={viewDetailsData || {}}
        />
        <ModalWrapper open={showBidErrorModal} onClose={() => setShowBidErrorModal(false)} title="Bid Error">
          <div className="py-4 text-center">
            <p>{bidErrorMessage}</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => setShowBidErrorModal(false)}
            >
              OK
            </button>
          </div>
        </ModalWrapper>
      </div>
    </SupplierLayout>
  );
}
