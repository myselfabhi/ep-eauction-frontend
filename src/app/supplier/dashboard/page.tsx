'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import NotificationDropdown from '@/components/shared/NotificationDropdown';
import SupplierLayout from '@/components/shared/SupplierLayout';
import AuctionCapacityModal from '@/components/ui/modal/AuctionCapacityModal';
import { auctionService } from '@/services';
import { ROUTES } from '@/lib';
import type { Auction } from '@/types/auction';

type LotData = {
  _id: string;
  lotId: string;
  name: string;
  material?: string;
  volume?: string;
  dimensions?: { l?: string; w?: string; h?: string };
  fob?: string;
  currency?: string;
};

// type BackendLot = {
//   _id: string;
//   lotId: string;
//   name: string;
//   material?: string;
//   volume?: string;
//   dimensions?: { l?: string; w?: string; h?: string };
//   [key: string]: unknown;
// };

// type SupplierAuction = {
//   id: string;
//   status: 'live' | 'upcoming' | 'closed';
//   title: string;
//   startTime: string;
//   eligibleLots: number;
//   lots?: LotData[];
// };

// Define a local UI type for supplier dashboard cards
interface SupplierAuction {
  id: string;
  status: 'live' | 'upcoming' | 'closed';
  title: string;
  startTime: string;
  eligibleLots: number;
  lots?: LotData[];
}

function SupplierDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invited = searchParams.get('invited'); // could be email or user id
  const [tab, setTab] = useState<'active' | 'history'>('active');
  const [notifOpen, setNotifOpen] = useState(false);
  const [capacityModalOpen, setCapacityModalOpen] = useState<{ auctionId: string; readOnly: boolean } | null>(null);
  const [auctionDetails, setAuctionDetails] = useState<Record<string, { capacities: Record<string, string>; confirmed: boolean }>>({});
  const [confirmationData, setConfirmationData] = useState<{ auctionId: string; capacities: Record<string, string> } | null>(null);
  const [auctions, setAuctions] = useState<SupplierAuction[]>([]);
  const [checking, setChecking] = useState(false);

  // On mount, check if invited param is present and if user exists
  useEffect(() => {
    if (invited) {
      setChecking(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/by-email?email=${encodeURIComponent(invited)}`)
        .then(res => res.json())
        .then(user => {
          if (user && user._id) {
            // User exists, redirect to login
            router.replace(ROUTES.AUTH.LOGIN);
          } else {
            // User does not exist, show onboarding modal
            // setShowOnboarding(true); // This line is removed
          }
        })
        .finally(() => setChecking(false));
    }
  }, [invited, router]);

  const handleCapacitySave = (
    auctionId: string,
    capacities: Record<string, string>,
    editMode = false,
    extra?: { currency?: string; fob?: string }
  ) => {
    const isLive = auctions.find(a => a.id === auctionId)?.status === 'live';
    if (editMode) {
      setCapacityModalOpen({ auctionId, readOnly: false });
      return;
    }
    
    // Save all values to localStorage
    if (extra && extra.fob && extra.currency) {
      localStorage.setItem(`auction_fob_${auctionId}`, extra.fob);
      localStorage.setItem(`auction_currency_${auctionId}`, extra.currency);
      localStorage.setItem(`auction_carton_${auctionId}`, JSON.stringify(capacities));
    }
    
    setAuctionDetails(prev => ({ ...prev, [auctionId]: { capacities, confirmed: !isLive } }));
    setCapacityModalOpen(null);
    
    // If it's a live auction, redirect directly to live auction page
    if (isLive) {
      router.push(`/supplier/auction/${auctionId}/live`);
    }
  };

  const handleConfirmAndEnter = async () => {
    if (!confirmationData) return;
    
    try {
      console.log('DEBUG: Calling listSingleAuctions for auction ID:', confirmationData.auctionId);
      
      // Call the listSingleAuctions endpoint
      const response = await auctionService.getSingle(confirmationData.auctionId);
      console.log('DEBUG: listSingleAuctions response:', response);
      console.log('DEBUG: Response type:', typeof response);
      console.log('DEBUG: Response keys:', Object.keys(response || {}));
      
      if (response) {
        console.log('DEBUG: Single auction details:', response);
        console.log('DEBUG: Auction lots:', response.lots);
        console.log('DEBUG: Lots length:', response.lots?.length || 0);
      }
      
      setAuctionDetails(prev => ({
        ...prev,
        [confirmationData.auctionId]: { capacities: confirmationData.capacities, confirmed: true },
      }));
      setConfirmationData(null);
      router.push(`/supplier/auction/${confirmationData.auctionId}/live`);
    } catch (error) {
      console.error('DEBUG: Error calling listSingleAuctions:', error);
      // Still proceed with navigation even if the API call fails
      setAuctionDetails(prev => ({
        ...prev,
        [confirmationData.auctionId]: { capacities: confirmationData.capacities, confirmed: true },
      }));
      setConfirmationData(null);
      router.push(`/supplier/auction/${confirmationData.auctionId}/live`);
    }
  };

  // Fetch auctions on component mount
  useEffect(() => {
    const loadAuctions = async () => {
      try {
        const data = await auctionService.getAll();
        let allAuctions: Auction[] = [];
        if (data && typeof data === 'object' && ('upcoming' in data || 'live' in data || 'ended' in data)) {
          const resp = data as { upcoming?: Auction[]; live?: Auction[]; ended?: Auction[] };
          allAuctions = [
            ...(resp.upcoming || []),
            ...(resp.live || []),
            ...(resp.ended || [])
          ];
        } else if (Array.isArray(data)) {
          allAuctions = data;
        }
        // Map backend Auction to SupplierAuction for UI
        const transformedAuctions: SupplierAuction[] = allAuctions.map((auction: Auction) => {
          let status: 'live' | 'upcoming' | 'closed' = 'closed';
          if (auction.status === 'Active') status = 'live';
          else if (auction.status === 'Scheduled') status = 'upcoming';
          else if (auction.status === 'Ended') status = 'closed';
          else if (auction.status === 'Paused') status = 'live'; // treat paused as live for tab
          return {
            id: auction._id,
            status,
            title: auction.title,
            startTime: auction.startTime,
            eligibleLots: auction.lots ? auction.lots.length : 0,
            lots: auction.lots as LotData[],
          };
        });
        setAuctions(transformedAuctions);
      } catch (err) {
        console.error('DEBUG: Error fetching auctions:', err);
      }
    };
    loadAuctions();
  }, []);

  // Add top-level debug log
  console.log('DEBUG: tab state at top', tab);
  console.log('Current tab:', tab);

  if (checking) return <div>Checking...</div>;

  return (
    <SupplierLayout>
      <div className="px-10 py-8 flex flex-col min-h-screen">
        {/* Tab Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setTab('active')}
            className={`px-4 py-2 rounded-[10px] border text-[14px] transition ${tab === 'active' ? 'text-[#1570EF]' : 'text-[#667085]'}`}
          >
            Upcoming/Live
          </button>
          <button
            onClick={() => setTab('history')}
            className={`px-4 py-2 rounded-[10px] border text-[14px] transition ${tab === 'history' ? 'text-[#1570EF]' : 'text-[#667085]'}`}
          >
            History
          </button>
        </div>

        {/* Confirmation Modal */}
        {confirmationData && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 px-8 py-6 w-full max-w-md">
              <h2 className="text-lg font-semibold text-gray-800 text-center mb-3">Confirm Auction Details</h2>
              <div className="space-y-3 mb-5">
                {Object.entries(confirmationData.capacities).map(([lotId, value]) => {
                  const auction = auctions.find(a => a.id === confirmationData.auctionId);
                  const lot = auction?.lots?.find(l => l.lotId === lotId);
                  // Read FOB and currency from localStorage
                  const fob = typeof window !== 'undefined' ? localStorage.getItem(`auction_fob_${confirmationData.auctionId}`) : '';
                  const currency = typeof window !== 'undefined' ? localStorage.getItem(`auction_currency_${confirmationData.auctionId}`) : '';
                  return (
                    <div key={lotId} className="text-sm text-gray-700 border-b border-gray-100 pb-2">
                      <div className="font-semibold">Lot - {lotId}</div>
                      <div className="text-gray-500">Product: {lot?.name || 'Lot Details'}</div>
                      <div className="text-gray-500">Cartons: {value} </div>
                      {fob && <div className="text-gray-500">FOB: {fob}</div>}
                      {currency && <div className="text-gray-500">Currency: {currency}</div>}
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
                  onClick={() => {
                    setCapacityModalOpen({ auctionId: confirmationData.auctionId, readOnly: false });
                    setConfirmationData(null);
                  }}
                >
                  Edit
                </button>
                <button
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={handleConfirmAndEnter}
                >
                  Continue to Auction
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Dashboard Content */}
        <div className="flex justify-between items-start mb-10 w-full max-w-7xl mx-auto">
          <div>
            <h2 className="text-2xl font-bold mb-1 text-gray-800">E-Auction Dashboard</h2>
            <p className="text-base text-gray-500 mb-8">Manage your auction participation</p>
          </div>
          <div className="relative mt-1">
            <button
              className="w-10 h-10 bg-[#f7f8fa] rounded-full flex items-center justify-center shadow-sm hover:shadow transition"
              onClick={() => setNotifOpen(prev => !prev)}
            >
              <Image width={20} height={20} src="/icons/bell.svg" alt="Notifications" className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-status-live" />
            </button>
            <NotificationDropdown open={notifOpen} onClose={() => setNotifOpen(false)} />
          </div>
        </div>
        <div className="w-full max-w-7xl mx-auto">
          {tab === 'active' && (
            <div className="flex gap-8 flex-wrap">
              {(() => {
                const filteredAuctions: SupplierAuction[] = auctions.filter((a: SupplierAuction) => a.status === 'live' || a.status === 'upcoming');
                if (filteredAuctions.length === 0) {
                  return <p className="text-center w-full text-gray-500">No auctions available</p>;
                }
                return filteredAuctions.map((auction: SupplierAuction) => {
                  const isLive = auction.status === 'live';
                  const borderColor = isLive ? 'border-[#F04B46]' : 'border-[#2C74F6]';
                  const topBorderColor = isLive ? 'bg-[#F04B46]' : 'bg-[#2C74F6]';
                  const badgeBg = isLive ? 'bg-[#FDEAEA]' : 'bg-[#EAF3FF]';
                  const badgeText = isLive ? 'text-[#F04B46]' : 'text-[#2C74F6]';
                  const details = auctionDetails[auction.id];
                  return (
                    <div
                      key={auction.id}
                      className={`relative w-[355px] min-h-[265px] bg-white pb-8 pt-7 px-8 border-2 ${borderColor} rounded-[18px] flex flex-col overflow-hidden`}
                    >
                      <div className={`absolute top-0 left-0 w-full h-[8px] ${topBorderColor}`} />
                      <span className={`absolute left-7 top-4 px-3 py-1 text-xs font-medium rounded-full ${badgeBg} ${badgeText}`}>
                        {auction.status.toUpperCase()}
                      </span>

                      <div className="flex-1 flex flex-col justify-end mt-7">
                        <div className="text-[20px] font-medium text-[#222] mb-5 mt-2">{auction.title}</div>
                        <div className="flex justify-between text-[15px] mb-1 text-[#666]">
                          <span>Start Time:</span>
                          <span className="text-[#222] font-medium">{auction.startTime}</span>
                        </div>
                        <div className="flex justify-between text-[15px] mb-7 text-[#666]">
                          <span>Eligible LOTs</span>
                          <span className="text-[#222] font-medium">{auction.eligibleLots}</span>
                        </div>

                        {isLive ? (
                          <button
                            className="w-full py-3 rounded-[8px] text-white text-base font-semibold uppercase tracking-wide bg-[#D23636] hover:bg-[#b52d2d]"
                            onClick={async () => {
                              try {
                                const token = localStorage.getItem('token');
                                console.log('Using token:', token);
                                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bid/ranking/${auction.id}`, {
                                  headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json',
                                  },
                                });
                                const data = await res.json();
                                console.log('Ranking API response for auction', auction.id, ':', data);
                                if (Array.isArray(data) && data.length === 0) {
                                  setCapacityModalOpen({ auctionId: auction.id, readOnly: false });
                                } else {
                                  router.push(`/supplier/auction/${auction.id}/live`);
                                }
                              } catch (err) {
                                console.error('Failed to call ranking API:', err);
                                setCapacityModalOpen({ auctionId: auction.id, readOnly: false }); // fallback: open modal on error
                              }
                            }}
                          >
                            ENTER AUCTION
                          </button>
                        ) : (
                          !details ? (
                            <button
                              className="w-full py-3 rounded-[8px] border border-blue-300 bg-white text-[#2C74F6] text-base font-medium"
                              onClick={() => setCapacityModalOpen({ auctionId: auction.id, readOnly: false })}
                            >
                              Fill Details
                            </button>
                          ) : (
                            <button
                              className="w-full py-3 rounded-[8px] border border-blue-300 bg-white text-[#2C74F6] text-base font-medium"
                              onClick={() => setCapacityModalOpen({ auctionId: auction.id, readOnly: true })}
                            >
                              View Details
                            </button>
                          )
                        )}
                      </div>
                      {capacityModalOpen && capacityModalOpen.auctionId === auction.id && (
                        <AuctionCapacityModal
                          open={true}
                          auctionTitle={auction.title}
                          auctionTime={auction.startTime}
                          lots={auction.lots || []}
                          initialCapacities={details?.capacities || {}}
                          isReadOnly={capacityModalOpen.readOnly}
                          isLiveAuction={isLive}
                          onClose={() => setCapacityModalOpen(null)}
                          onSave={(caps, editMode, extra) => handleCapacitySave(auction.id, caps, editMode, extra)}
                        />
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          )}
          {tab === 'history' && (
            <div className="flex gap-8 flex-wrap">
              {(() => {
                const filteredAuctions: SupplierAuction[] = auctions.filter((a: SupplierAuction) => a.status === 'closed');
                if (filteredAuctions.length === 0) {
                  return <p className="text-center w-full text-gray-500">No auctions available</p>;
                }
                return filteredAuctions.map((auction: SupplierAuction) => {
                  const isLive = auction.status === 'live';
                  const borderColor = isLive ? 'border-[#F04B46]' : 'border-[#2C74F6]';
                  const topBorderColor = isLive ? 'bg-[#F04B46]' : 'bg-[#2C74F6]';
                  const badgeBg = isLive ? 'bg-[#FDEAEA]' : 'bg-[#EAF3FF]';
                  const badgeText = isLive ? 'text-[#F04B46]' : 'text-[#2C74F6]';
                  const details = auctionDetails[auction.id];
                  return (
                    <div
                      key={auction.id}
                      className={`relative w-[355px] min-h-[265px] bg-white pb-8 pt-7 px-8 border-2 ${borderColor} rounded-[18px] flex flex-col overflow-hidden`}
                    >
                      <div className={`absolute top-0 left-0 w-full h-[8px] ${topBorderColor}`} />
                      <span className={`absolute left-7 top-4 px-3 py-1 text-xs font-medium rounded-full ${badgeBg} ${badgeText}`}>
                        {auction.status.toUpperCase()}
                      </span>

                      <div className="flex-1 flex flex-col justify-end mt-7">
                        <div className="text-[20px] font-medium text-[#222] mb-5 mt-2">{auction.title}</div>
                        <div className="flex justify-between text-[15px] mb-1 text-[#666]">
                          <span>Start Time:</span>
                          <span className="text-[#222] font-medium">{auction.startTime}</span>
                        </div>
                        <div className="flex justify-between text-[15px] mb-7 text-[#666]">
                          <span>Eligible LOTs</span>
                          <span className="text-[#222] font-medium">{auction.eligibleLots}</span>
                        </div>
                        <button
                          className="w-full py-3 rounded-[8px] border border-blue-300 bg-white text-[#2C74F6] text-base font-medium"
                          onClick={() => setCapacityModalOpen({ auctionId: auction.id, readOnly: true })}
                        >
                          View Details
                        </button>
                      </div>
                      {capacityModalOpen && capacityModalOpen.auctionId === auction.id && (
                        <AuctionCapacityModal
                          open={true}
                          auctionTitle={auction.title}
                          auctionTime={auction.startTime}
                          lots={auction.lots || []}
                          initialCapacities={details?.capacities || {}}
                          isReadOnly={capacityModalOpen.readOnly}
                          isLiveAuction={false}
                          onClose={() => setCapacityModalOpen(null)}
                          onSave={(caps, editMode, extra) => handleCapacitySave(auction.id, caps, editMode, extra)}
                        />
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          )}
        </div>
      </div>
    </SupplierLayout>
  );
}

export default function SupplierDashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SupplierDashboardContent />
    </Suspense>
  );
}
