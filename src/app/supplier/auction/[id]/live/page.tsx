'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import SupplierLayout from '@/components/shared/SupplierLayout';
import ConfirmBidModal from '@/components/ui/modal/ConfirmBidModal';
import { auctionService } from '@/services';
import { Auction } from '@/types/auction';

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
  
  const [expandLot, setExpandLot] = useState<string | null>('LOT-CC-001_0');
  const [showLots, setShowLots] = useState(true);
  const [activeBids, setActiveBids] = useState(initialActiveBids);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);

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
          <div className="font-mono text-2xl font-semibold text-red-600 tracking-wide mb-1">02 : 02 : 02</div>
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
                  <React.Fragment key={idx}>
                    <tr className={`border-b border-[#f1f1f1] ${bid.status === 'success' ? 'bg-[#f2faee]' : ''}`}>
                      <td className={tdBase + ' font-semibold'}>
                        <span className={`inline-block w-4 h-4 rounded-full mr-1 align-middle ${bid.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {bid.id}
                      </td>
                      <td className={tdBase}>{bid.product}</td>
                      <td className={tdBase}>{bid.quantity}</td>
                      <td className={tdBase}>{bid.lastUpdate}</td>
                      <td className={tdBase + ' ' + tdRank} style={bid.status === 'success'
                        ? { color: '#2b9500' }
                        : { color: '#e53935' }
                      }>
                        {bid.rank === 1 ? `#${bid.rank}` : `#${bid.rank}`}
                      </td>
                      <td className={tdBase + ' font-bold'}>{bid.yourBid}</td>
                      <td className={tdBase}>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={bid.updateBid}
                            onChange={e => {
                              setActiveBids(prev =>
                                prev.map((b, i) => i === idx ? { ...b, updateBid: e.target.value } : b)
                              );
                            }}
                            className="border rounded px-2 py-1 w-20 text-right text-black font-medium text-sm"
                            readOnly={bid.confirmed}
                            style={{
                              background: bid.confirmed ? '#f0f1f4' : '#fff',
                              borderColor: '#e4e4e7',
                            }}
                          />
                          {bid.confirmed ? (
                            <span className="flex items-center justify-center w-6 h-6 rounded-[4px] bg-green-50 border border-green-500 text-green-600 text-lg font-semibold">
                              ✓
                            </span>
                          ) : (
                            <button
                              className="flex items-center justify-center w-6 h-6 rounded-[4px] bg-green-50 border border-green-500 text-green-600 text-lg font-semibold hover:bg-green-100"
                              title="Confirm"
                            >
                              ✓
                            </button>
                          )}
                        </div>
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
              <span className="ml-1 text-gray-400">{auctionData?.lots?.length || 0}</span>
              <span className="ml-5 text-[13px] text-gray-500 cursor-pointer select-none"
                onClick={() => setShowLots((prev) => !prev)}
              >
                {showLots ? <>Hide <span className="font-bold">⌃</span></> : <>Show <span className="font-bold">⌄</span></>}
              </span>
            </div>
            {showLots && (
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
                  {auctionData?.lots?.map((realLot, idx: number) => (
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
                          <button
                            className="text-blue-600 underline font-medium px-1 py-1"
                            style={{ fontSize: 15, letterSpacing: '-0.5px' }}
                            onClick={() => {
                              // Handle bid placement
                              console.log('DEBUG: Placing bid for lot:', realLot);
                            }}
                          >
                            Place bid
                          </button>
                        </td>
                      </tr>
                      {expandLot === `${realLot.lotId}_${idx}` && (
                        <ProductSpecsRow lot={realLot} />
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
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
