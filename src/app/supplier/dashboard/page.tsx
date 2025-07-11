'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import NotificationDropdown from '@/components/shared/NotificationDropdown';
import SupplierLayout from '@/components/shared/SupplierLayout';
import OnboardingModal from '@/components/ui/modal/OnboardingModal';
import AuctionCapacityModal from '@/components/ui/modal/AuctionCapacityModal';

const lotsList = [
  { id: 'LOT-001', label: 'Kraft Boxes - Standard Size' },
  { id: 'LOT-002', label: 'Corrugated Shipping Boxes' },
  { id: 'LOT-003', label: 'Premium Packaging Boxes' },
];

export default function SupplierDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<'active' | 'history'>('active');
  const [notifOpen, setNotifOpen] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [capacityModalOpen, setCapacityModalOpen] = useState<{ auctionId: string; readOnly: boolean } | null>(null);
  const [auctionDetails, setAuctionDetails] = useState<Record<string, { capacities: Record<string, string>; confirmed: boolean }>>({});
  const [confirmationData, setConfirmationData] = useState<{ auctionId: string; capacities: Record<string, string> } | null>(null);
  const [auctions, setAuctions] = useState<any[]>([]); // fetched from backend

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

  const handleConfirmAndEnter = () => {
    if (!confirmationData) return;
    setAuctionDetails(prev => ({
      ...prev,
      [confirmationData.auctionId]: { capacities: confirmationData.capacities, confirmed: true },
    }));
    setConfirmationData(null);
    router.push(`/supplier/auction/${confirmationData.auctionId}/live`);
  };

  const fetchAuctions = async (token: string) => {
    try {
      const res = await fetch('/api/auction', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch auctions');
      const data = await res.json();
      setAuctions(data.auctions || []); // adjust depending on response shape
    } catch (err) {
      console.error('Error fetching auctions:', err);
    }
  };

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
                role: 'supplier',
                profile: {
                  companyName: data.name,
                  country: data.country,
                  portOfLoading: data.port,
                },
              };

              const res = await fetch('/api/supplier/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
              });

              if (!res.ok) throw new Error('Registration failed');

              const resData = await res.json();
              const token = resData.token;
              localStorage.setItem('token', token);

              setOnboardingDone(true);
              await fetchAuctions(token);
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
              {Object.entries(confirmationData.capacities).map(([lotId, value]) => (
                <div key={lotId} className="text-sm text-gray-700">
                  <strong>{lotId}:</strong> {value} cartons
                </div>
              ))}
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

                        :

tsx
Copy
Edit
{capacityModalOpen && capacityModalOpen.auctionId === auction.id && (
  <AuctionCapacityModal
    open={true}
    auctionTitle={auction.title}
    auctionTime={auction.startTime}
    lots={lotsList}
    initialCapacities={details?.capacities || {}}
    isReadOnly={capacityModalOpen.readOnly}
    isLiveAuction={isLive}
    onClose={() => setCapacityModalOpen(null)}
    onSave={(caps, editMode) => handleCapacitySave(auction.id, caps, editMode)}
  />
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
