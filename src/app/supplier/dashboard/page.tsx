'use client';
import { useState } from 'react';
import Image from 'next/image';
import NotificationDropdown from '@/components/shared/NotificationDropdown';
import { useRouter } from 'next/navigation';
import SupplierLayout from '@/components/shared/SupplierLayout';

const auctions = [
  {
    id: '1',
    status: 'live',
    title: 'Mid-June Reverse Auction',
    startTime: 'June 15, 2025 2:00 PM',
    eligibleLots: 4,
  },
  {
    id: '2',
    status: 'upcoming',
    title: 'Mid-June Reverse Auction',
    startTime: 'June 15, 2025 2:00 PM',
    eligibleLots: 4,
  },
];

const bidHistoryData = [
  {
    auctionName: 'Food Service Paper Cups - Q2',
    product: 'Kraft Boxes - LOT-CC-001',
    totalBids: 3,
  },
  {
    auctionName: 'Feb Auction',
    product: 'Tape Rolls - LOT-53-016',
    totalBids: 6,
  },
];

const tabOptions = [
  { label: 'Upcoming/Live', key: 'active' },
  { label: 'History', key: 'history' },
];

export default function SupplierDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<'active' | 'history'>('active');
  const [notifOpen, setNotifOpen] = useState(false);

  const filteredAuctions =
    tab === 'active'
      ? auctions.filter((a) => a.status === 'live' || a.status === 'upcoming')
      : [];

  return (
    <SupplierLayout>
      <div className="px-10 py-8 flex flex-col min-h-screen">
        {/* Header Row */}
        <div className="flex justify-between items-start mb-10 w-full max-w-7xl mx-auto">
          <div>
            <h2 className="text-2xl font-bold mb-1 text-gray-800">E-Auction Dashboard</h2>
            <p className="text-base text-gray-500 mb-8">Manage your auction participation</p>
            {/* Tabs */}
            <div className="flex gap-3 mb-0">
              {tabOptions.map((option) => (
                <button
                  key={option.key}
                  onClick={() => setTab(option.key as 'active' | 'history')}
                  className={`px-4 py-2 rounded-[10px] border text-[14px] transition
                    ${
                      tab === option.key
                        ? 'border-[#D0D5DD] bg-white text-[#1570EF]'
                        : 'border-[#D0D5DD] bg-white text-[#667085]'
                    }
                  `}
                  style={{
                    boxShadow: 'none',
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div className="relative mt-1">
            <button
              className="w-10 h-10 bg-[#f7f8fa] rounded-full flex items-center justify-center shadow-sm hover:shadow transition"
              onClick={() => setNotifOpen((v) => !v)}
            >
              <Image
                width={20}
                height={20}
                src="/icons/bell.svg"
                alt="Notifications"
                className="w-5 h-5"
              />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-status-live" />
            </button>
            <NotificationDropdown open={notifOpen} onClose={() => setNotifOpen(false)} />
          </div>
        </div>

        {/* Content: left-aligned */}
        <div className="w-full max-w-7xl mx-auto">
          {tab === 'active' && (
            <div className="flex gap-8">
              {filteredAuctions.length === 0 && (
                <div className="text-gray-400 text-center py-10 w-full">No auctions found.</div>
              )}
              {filteredAuctions.map((auction) => {
                const isLive = auction.status === 'live';
                const borderColor = isLive ? 'border-[#F04B46]' : 'border-[#2C74F6]';
                const topBorderColor = isLive ? 'bg-[#F04B46]' : 'bg-[#2C74F6]';
                const badgeBg = isLive ? 'bg-[#FDEAEA]' : 'bg-[#EAF3FF]';
                const badgeText = isLive ? 'text-[#F04B46]' : 'text-[#2C74F6]';

                return (
                  <div
                    key={auction.id}
                    className={`
                      relative w-[355px] min-h-[265px] bg-white pb-8 pt-7 px-8 border-2 ${borderColor}
                      rounded-[18px] flex flex-col shadow-none
                      overflow-visible
                    `}
                  >
                    {/* Custom thick top border */}
                    <div
                      className={`absolute top-0 left-0 w-full h-[8px] ${topBorderColor} rounded-t-[18px] z-10`}
                    />

                    {/* Badge */}
                    <span
                      className={`
                        absolute left-7 top-4 z-20 px-3 py-1 text-xs font-medium rounded-full
                        ${badgeBg} ${badgeText}
                        border border-transparent
                      `}
                      style={{ letterSpacing: '0.01em' }}
                    >
                      {auction.status === 'live' ? 'LIVE' : 'UPCOMING'}
                    </span>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-end mt-7">
                      <div className="text-[20px] font-medium text-[#222] mb-5 mt-2">
                        {auction.title}
                      </div>
                      <div className="flex justify-between items-center text-[15px] mb-1">
                        <span className="text-[#666]">Start Time:</span>
                        <span className="text-[#222] font-medium">{auction.startTime}</span>
                      </div>
                      <div className="flex justify-between items-center text-[15px] mb-7">
                        <span className="text-[#666]">Eligible LOTs</span>
                        <span className="text-[#222] font-medium">{auction.eligibleLots}</span>
                      </div>
                      {isLive ? (
                        <button
                          className="w-full py-3 rounded-[8px] text-white text-base font-semibold uppercase tracking-wide bg-[#D23636] hover:bg-[#b52d2d] transition"
                          onClick={() => router.push(`/supplier/auction/${auction.id}/live`)}
                        >
                          ENTER AUCTION
                        </button>
                      ) : (
                        <div className="flex gap-3">
                          <button
                            className="flex-1 py-3 rounded-[8px] border border-[#CED6F3] bg-white text-[#222] text-base font-medium transition hover:bg-[#F4F7FE]"
                          >
                            Edit info
                          </button>
                          <button
                            className="flex-1 py-3 rounded-[8px] border border-blue-300 bg-white text-[#2C74F6] text-base font-medium transition hover:bg-[#F4F7FE]"
                          >
                            View details
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* History Table */}
          {tab === 'history' && (
            <div className="bg-white rounded-xl shadow p-0 w-full mt-2">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-left text-sm">
                    <th className="py-3 px-6 font-medium">Auction Name</th>
                    <th className="py-3 px-6 font-medium">Product / LOTs</th>
                    <th className="py-3 px-6 font-medium">Total Bids</th>
                  </tr>
                </thead>
                <tbody>
                  {bidHistoryData.map((row, idx) => (
                    <tr key={idx} className="border-t text-gray-700 text-sm">
                      <td className="py-3 px-6">{row.auctionName}</td>
                      <td className="py-3 px-6">{row.product}</td>
                      <td className="py-3 px-6">{row.totalBids} Bids</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </SupplierLayout>
  );
}
