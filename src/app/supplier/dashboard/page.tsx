'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import NotificationDropdown from '@/components/shared/NotificationDropdown';
import SupplierLayout from '@/components/shared/SupplierLayout';
import OnboardingModal from '@/components/ui/modal/OnboardingModal';
import AuctionCapacityModal from '@/components/ui/modal/AuctionCapacityModal';
import { auctionService } from '@/services';
import { ROUTES } from '@/lib';

type LotData = {
  _id: string;
  lotId: string;
  name: string;
  material?: string;
  volume?: string;
  dimensions?: { l?: string; w?: string; h?: string };
};

type BackendLot = {
  _id: string;
  lotId: string;
  name: string;
  material?: string;
  volume?: string;
  dimensions?: { l?: string; w?: string; h?: string };
  [key: string]: unknown;
};

type SupplierAuction = {
  id: string;
  status: 'live' | 'upcoming' | 'closed';
  title: string;
  startTime: string;
  eligibleLots: number;
  lots?: LotData[];
};

export default function SupplierDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<'active' | 'history'>('active');
  const [notifOpen, setNotifOpen] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [capacityModalOpen, setCapacityModalOpen] = useState<{ auctionId: string; readOnly: boolean } | null>(null);
  const [auctionDetails, setAuctionDetails] = useState<Record<string, { capacities: Record<string, string>; confirmed: boolean }>>({});
  const [confirmationData, setConfirmationData] = useState<{ auctionId: string; capacities: Record<string, string> } | null>(null);
  const [auctions, setAuctions] = useState<SupplierAuction[]>([]);

  // Check onboarding status on mount
  useEffect(() => {
    const user = localStorage.getItem('epUser');
    const token = localStorage.getItem('token');
    console.log('DEBUG: epUser in localStorage:', user);
    console.log('DEBUG: token in localStorage:', token);
    if (user) {
      setOnboardingDone(true);
    }
  }, []);

  const handleCapacitySave = (auctionId: string, capacities: Record<string, string>, editMode = false) => {
    const isLive = auctions.find(a => a.id === auctionId)?.status === 'live';
    if (editMode) {
      setCapacityModalOpen({ auctionId, readOnly: false });
      return;
    }
    setAuctionDetails(prev => ({ ...prev, [auctionId]: { capacities, confirmed: !isLive } }));
    setCapacityModalOpen(null);
    if (isLive) setConfirmationData({ auctionId, capacities });
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
        const token = localStorage.getItem('token');
        console.log('DEBUG: Fetching auctions with token:', token);
        const data = await auctionService.getAll();
        console.log('DEBUG: Raw auction API response:', data);
        console.log('DEBUG: Data type:', typeof data);
        console.log('DEBUG: Data keys:', Object.keys(data || {}));
        
        // Additional debugging for the specific auction structure
        if (data && typeof data === 'object') {
          console.log('DEBUG: Full data structure:', JSON.stringify(data, null, 2));
        }
        
        // For suppliers, the backend returns { upcoming, live, ended }
        // We need to combine them into a single array for the UI
        if (data && typeof data === 'object' && 'upcoming' in data) {
          const supplierData = data as { upcoming?: unknown[]; live?: unknown[]; ended?: unknown[] };
          console.log('DEBUG: Supplier data structure:', {
            upcoming: supplierData.upcoming?.length || 0,
            live: supplierData.live?.length || 0,
            ended: supplierData.ended?.length || 0
          });
          
          const allAuctions = [
            ...(supplierData.upcoming || []),
            ...(supplierData.live || []),
            ...(supplierData.ended || [])
          ];
          
          console.log('DEBUG: Combined auctions count:', allAuctions.length);
          console.log('DEBUG: First auction sample:', allAuctions[0]);
          
          // Transform backend auction format to supplier auction format
          const transformedAuctions: SupplierAuction[] = allAuctions.map((auction, index) => {
            const auctionData = auction as Record<string, unknown>;
            console.log(`DEBUG: Processing auction ${index}:`, {
              id: auctionData._id || auctionData.id,
              title: auctionData.title,
              lots: auctionData.lots,
              lotsType: typeof auctionData.lots,
              lotsLength: Array.isArray(auctionData.lots) ? auctionData.lots.length : 'not array'
            });
            
            // Handle lots data properly
            let lotsArray: LotData[] = [];
            if (auctionData.lots && Array.isArray(auctionData.lots)) {
              lotsArray = (auctionData.lots as unknown[]).map((lot: unknown, lotIndex: number) => {
                const lotData = lot as BackendLot;
                console.log(`DEBUG: Processing lot ${lotIndex}:`, lotData);
                return {
                  _id: lotData._id,
                  lotId: lotData.lotId,
                  name: lotData.name,
                  material: lotData.material,
                  volume: lotData.volume || '', // Handle missing volume field
                  dimensions: lotData.dimensions,
                };
              });
            }
            
            const transformedAuction = {
              id: (auctionData._id || auctionData.id) as string,
              status: (auctionData.status === 'Active' ? 'live' : auctionData.status === 'Scheduled' ? 'upcoming' : 'closed') as 'live' | 'upcoming' | 'closed',
              title: auctionData.title as string,
              startTime: auctionData.startTime as string,
              eligibleLots: lotsArray.length,
              lots: lotsArray
            };
            
            console.log(`DEBUG: Transformed auction ${index}:`, transformedAuction);
            return transformedAuction;
          });
          
          console.log('DEBUG: Final transformed auctions:', transformedAuctions);
          setAuctions(transformedAuctions);
        } else {
          // Fallback for EP members or if data structure is different
          console.log('DEBUG: Using fallback data processing');
          const arrayData = Array.isArray(data) ? data : [];
          const transformedAuctions: SupplierAuction[] = arrayData.map((auction, index) => {
            const auctionData = auction as unknown as Record<string, unknown>;
            console.log(`DEBUG: Fallback processing auction ${index}:`, auctionData);
            
            // Handle lots data properly for fallback
            let lotsArray: LotData[] = [];
            if (auctionData.lots && Array.isArray(auctionData.lots)) {
              lotsArray = (auctionData.lots as unknown[]).map((lot: unknown, lotIndex: number) => {
                const lotData = lot as BackendLot;
                console.log(`DEBUG: Fallback processing lot ${lotIndex}:`, lotData);
                return {
                  _id: lotData._id,
                  lotId: lotData.lotId,
                  name: lotData.name,
                  material: lotData.material,
                  volume: lotData.volume || '', // Handle missing volume field
                  dimensions: lotData.dimensions,
                };
              });
            }
            
            const transformedAuction = {
              id: (auctionData._id || auctionData.id) as string,
              status: (auctionData.status === 'Active' ? 'live' : auctionData.status === 'Scheduled' ? 'upcoming' : 'closed') as 'live' | 'upcoming' | 'closed',
              title: auctionData.title as string,
              startTime: auctionData.startTime as string,
              eligibleLots: lotsArray.length,
              lots: lotsArray
            };
            
            console.log(`DEBUG: Fallback transformed auction ${index}:`, transformedAuction);
            return transformedAuction;
          });
          
          console.log('DEBUG: Final fallback transformed auctions:', transformedAuctions);
          setAuctions(transformedAuctions);
        }
      } catch (err) {
        console.error('Failed to load auctions:', err);
        setAuctions([]);
      }
    };

    loadAuctions();
  }, []);



  return (
    <SupplierLayout>
      {!onboardingDone && (
        <OnboardingModal
          onComplete={async (data) => {
            try {
              const payload = {
                name: data.name,
                email: data.email,
                password: data.password,
                role: 'Supplier',
                profile: {
                  companyName: data.name,
                  country: data.country,
                  portOfLoading: data.port,
                },
              };

              const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
              });

              if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Registration failed');
              }

              const resData = await res.json();
              console.log('Registration successful:', resData);

              // Mark onboarding as done after successful registration
              setOnboardingDone(true);

              router.push(ROUTES.AUTH.LOGIN);
            } catch (err) {
              console.error('Registration error:', err);
              alert('Registration failed. Please try again.');
            }
          }}
        />
      )}

      {confirmationData && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 px-8 py-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-800 text-center mb-3">Confirm Auction Details</h2>
            <div className="space-y-3 mb-5">
              {Object.entries(confirmationData.capacities).map(([lotId, value]) => {
                const auction = auctions.find(a => a.id === confirmationData.auctionId);
                const lot = auction?.lots?.find(l => l.lotId === lotId);
                return (
                  <div key={lotId} className="text-sm text-gray-700 border-b border-gray-100 pb-2">
                    <div className="font-semibold">{lotId}</div>
                    <div className="text-gray-600">{lot?.name || 'Lot Details'}</div>
                    <div className="text-gray-500">{value} cartons</div>
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

      {onboardingDone && (
        <div className="px-10 py-8 flex flex-col min-h-screen">
          <div className="flex justify-between items-start mb-10 w-full max-w-7xl mx-auto">
            <div>
              <h2 className="text-2xl font-bold mb-1 text-gray-800">E-Auction Dashboard</h2>
              <p className="text-base text-gray-500 mb-8">Manage your auction participation</p>
              <div className="flex gap-3 mb-0">
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
                {auctions.length === 0 ? (
                  <p className="text-center w-full text-gray-500">No auctions available</p>
                ) : (
                  auctions.map((auction) => {
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
                              onClick={() => {
                                if (!details) setCapacityModalOpen({ auctionId: auction.id, readOnly: false });
                                else if (!details.confirmed) setConfirmationData({ auctionId: auction.id, capacities: details.capacities });
                                else router.push(`/supplier/auction/${auction.id}/live`);
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
  (() => {
    console.log('DEBUG: Modal data for auction:', auction.id);
    console.log('DEBUG: Auction title:', auction.title);
    console.log('DEBUG: Auction lots:', auction.lots);
    console.log('DEBUG: Lots length:', auction.lots?.length || 0);
    console.log('DEBUG: First lot sample:', auction.lots?.[0]);
    return (
      <AuctionCapacityModal
        open={true}
        auctionTitle={auction.title}
        auctionTime={auction.startTime}
        lots={auction.lots || []}
        initialCapacities={details?.capacities || {}}
        isReadOnly={capacityModalOpen.readOnly}
        isLiveAuction={isLive}
        onClose={() => setCapacityModalOpen(null)}
        onSave={(caps, editMode) => handleCapacitySave(auction.id, caps, editMode)}
      />
    );
  })()
)}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </SupplierLayout>
  );
}
