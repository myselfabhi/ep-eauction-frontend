'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import SupplierLayout from '@/components/shared/SupplierLayout';
import ConfirmBidModal from '@/components/ui/modal/ConfirmBidModal';
import { auctionService } from '@/services';
import { Auction } from '@/types/auction';
import { bidService } from '@/services';
import { Bid } from '@/types/bid';

const initialActiveBids = [
  {
    id: 'LOT-CC-001',
    product: '8oz Paper Cups',
    quantity: '50,000 units',
    bidders: 12,
    lastUpdate: '2s ago',
    rank: 1,
    yourBid: '$0.40',
    updateBid: '$0.40',
    status: 'success',
    confirmed: true,
  },
  {
    id: 'LOT-CC-001',
    product: '8oz Paper Cups',
    quantity: '50,000 units',
    bidders: 12,
    lastUpdate: '2s ago',
    rank: 6,
    yourBid: '$0.40',
    updateBid: '$0.60',
    status: 'danger',
    confirmed: false,
  },
  {
    id: 'LOT-CC-001',
    product: '8oz Paper Cups',
    quantity: '50,000 units',
    bidders: 12,
    lastUpdate: '2s ago',
    rank: 10,
    yourBid: '$0.40',
    updateBid: '$0.40',
    status: 'danger',
    confirmed: false,
  },
];

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
  
  // Real auction data state
  const [auctionData, setAuctionData] = useState<Auction | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('00 : 00 : 00');
  
  const [expandLot, setExpandLot] = useState<string | null>('LOT-CC-001_0');
  const [showLots, setShowLots] = useState(true);
  const [activeBids, setActiveBids] = useState<Bid[]>([]);
  const [editBid, setEditBid] = useState<string | null>(null); // bid._id being edited
  const [editBidValue, setEditBidValue] = useState<string>('');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);

  // New: Track bid input state
  const [bidInput, setBidInput] = useState<{ [lotId: string]: string }>({});
  const [placingBid, setPlacingBid] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch auction data on component mount
  useEffect(() => {
    const fetchAuctionData = async () => {
      try {
        console.log('DEBUG: Fetching auction data for ID:', auctionId);
        const response = await auctionService.getSingle(auctionId);
        console.log('DEBUG: Live auction page - Auction data:', response);
        console.log('DEBUG: Live auction page - Lots:', response.lots);
        setAuctionData(response);
      } catch (err) {
        console.error('DEBUG: Error fetching auction data:', err);
      }
    };

    if (auctionId) {
      fetchAuctionData();
    }
  }, [auctionId]);

  // Live countdown timer for auction end
  useEffect(() => {
    if (!auctionData?.endTime) return;

    const updateCountdown = () => {
      const now = new Date();
      const end = new Date(auctionData.endTime);
      const diff = end.getTime() - now.getTime();

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
  }, [auctionData?.endTime]);

  // Fetch active bids ranking for this auction
  const fetchRanking = async () => {
    if (!auctionId) return;
    try {
      const ranking = await bidService.getRanking(auctionId);
      setActiveBids(ranking);
    } catch (err) {
      console.error('Failed to fetch bid ranking:', err);
    }
  };

  // Fetch ranking on mount and after each bid
  useEffect(() => {
    fetchRanking();
  }, [auctionId]);

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
            <span className="font-mono text-[13px] font-medium text-black">{auctionData._id}</span>
            <span className="mx-2 text-[#aaa]">|</span>
            <a className="text-blue-600 underline cursor-pointer font-medium" href="#">View details</a>
          </div>
          <div className="flex items-center gap-12 mt-1 text-[13px]">
            <div>
              <div className="text-[#777] font-medium">Currency</div>
              <div className="text-black font-medium">{auctionData.currency}</div>
            </div>
            <div>
              <div className="text-[#777] font-medium">Reserve Price</div>
              <div className="text-black font-medium">{auctionData.reservePrice}</div>
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
    if (!auctionData) return;
    setIsSubmitting(true);
    try {
      const payload = {
        auctionId: auctionData._id,
        lotId: lot._id,
        amount: Number(bidInput[lot._id]),
        currency: auctionData.currency,
        fobCost: 0,
        tax: 0,
        duty: 0,
        performanceScore: 0,
      };
      const response = await bidService.create(payload);
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
    setIsSubmitting(true);
    try {
      const payload = {
        amount: Number(editBidValue),
        currency: bid.currency,
        fobCost: bid.fobCost,
        tax: bid.tax,
        duty: bid.duty,
        performanceScore: bid.performanceScore,
      };
      await bidService.update(bid._id, payload);
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

  return (
    <SupplierLayout>
      <div className="pt-8 pb-2 px-4 min-h-screen bg-[#fafbfc]">
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
                {activeBids.map((bid, idx) => (
                  <React.Fragment key={bid._id}>
                    <tr className={`border-b border-[#f1f1f1] ${bid.status === 'Active' ? '' : 'bg-gray-100'}`}>
                      <td className={tdBase + ' font-semibold'}>
                        <span className={`inline-block w-4 h-4 rounded-full mr-1 align-middle ${bid.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {auctionData?.lots.find(l => l._id === bid.lot)?.lotId || bid.lot}
                      </td>
                      <td className={tdBase}>{auctionData?.lots.find(l => l._id === bid.lot)?.name || ''}</td>
                      <td className={tdBase}>{auctionData?.lots.find(l => l._id === bid.lot)?.volume || ''}</td>
                      <td className={tdBase}>{new Date(bid.updatedAt).toLocaleString()}</td>
                      <td className={tdBase + ' ' + tdRank} style={{ color: idx === 0 ? '#2b9500' : '#e53935' }}>
                        #{idx + 1}
                      </td>
                      <td className={tdBase + ' font-bold'}>${bid.amount}</td>
                      <td className={tdBase}>
                        {editBid === bid._id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              className="border rounded px-2 py-1 w-20 text-right text-black font-medium text-sm"
                              value={editBidValue}
                              onChange={e => setEditBidValue(e.target.value)}
                              min={0}
                              disabled={isSubmitting}
                            />
                            <button
                              className="flex items-center justify-center w-6 h-6 rounded-[4px] bg-green-50 border border-green-500 text-green-600 text-lg font-semibold transition hover:bg-green-100"
                              title="Confirm"
                              disabled={isSubmitting || !editBidValue}
                              onClick={() => handleUpdateBid(bid)}
                            >
                              ✓
                            </button>
                            <button
                              className="ml-1 text-gray-400 hover:text-red-500 text-lg font-bold"
                              onClick={() => setEditBid(null)}
                              disabled={isSubmitting}
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span>${bid.amount}</span>
                            <button
                              className="flex items-center justify-center w-6 h-6 rounded-[4px] bg-blue-50 border border-blue-500 text-blue-600 text-lg font-semibold transition hover:bg-blue-100"
                              title="Edit"
                              onClick={() => {
                                setEditBid(bid._id);
                                setEditBidValue(bid.amount.toString());
                              }}
                              disabled={isSubmitting}
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
                    {availableLots.map((realLot, idx: number) => (
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
                          <td className={tdBase}>--</td>
                          <td className={tdBase}>
                            {placingBid === realLot._id ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  className="border rounded px-2 py-1 w-20 text-right text-black font-medium text-sm"
                                  value={bidInput[realLot._id] || ''}
                                  onChange={e => setBidInput(prev => ({ ...prev, [realLot._id]: e.target.value }))}
                                  min={0}
                                  disabled={isSubmitting}
                                />
                                <button
                                  className="flex items-center justify-center w-6 h-6 rounded-[4px] bg-green-50 border border-green-500 text-green-600 text-lg font-semibold transition hover:bg-green-100"
                                  title="Confirm"
                                  disabled={isSubmitting || !bidInput[realLot._id]}
                                  onClick={() => handlePlaceBid(realLot)}
                                >
                                  ✓
                                </button>
                                <button
                                  className="ml-1 text-gray-400 hover:text-red-500 text-lg font-bold"
                                  onClick={() => setPlacingBid(null)}
                                  disabled={isSubmitting}
                                >
                                  ×
                                </button>
                              </div>
                            ) : (
                              <button
                                className="text-blue-600 underline font-medium px-1 py-1"
                                style={{ fontSize: 15, letterSpacing: '-0.5px' }}
                                onClick={() => setPlacingBid(realLot._id)}
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
                    ))}
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
      </div>
    </SupplierLayout>
  );
}
