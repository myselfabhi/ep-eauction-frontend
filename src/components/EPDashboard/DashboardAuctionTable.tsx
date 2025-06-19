'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AuctionTable from '@/components/AuctionTable';
import { Auction } from '@/types/auction';

// ----------------------
// Dummy seed auctions
// ----------------------
const seedAuctions: Auction[] = [
  {
    _id: 'a1',
    title: 'Steel Plates Q3',
    status: 'Live',
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 3_600_000).toISOString(),
  } as unknown as Auction, // cast if your Auction type has more fields
  {
    _id: 'a2',
    title: 'Aluminium Ingots',
    status: 'Scheduled',
    startTime: new Date(Date.now() + 86_400_000).toISOString(),
    endTime: new Date(Date.now() + 172_800_000).toISOString(),
  } as unknown as Auction,
  {
    _id: 'a3',
    title: 'Plastic Granules Bulk',
    status: 'Completed',
    startTime: new Date(Date.now() - 172_800_000).toISOString(),
    endTime: new Date(Date.now() - 86_400_000).toISOString(),
  } as unknown as Auction,
];

const tabs = ['All', 'Live', 'Scheduled', 'Completed'] as const;
type TabType = typeof tabs[number];

export default function DashboardAuctionTableDummy() {
  const router = useRouter();
  const [tab, setTab] = useState<TabType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [auctions, setAuctions] = useState<Auction[]>([]); // KEEP THIS

  useEffect(() => setAuctions(seedAuctions), []);

  const filtered = auctions.filter(a => {
    const matchesTab = tab === 'All' || a.status === tab;
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <>
      {/* Search + Tabs + Actions */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border p-2 pl-8 rounded-full text-sm w-64"
            />
            <svg
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="flex gap-2">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1 rounded-full text-sm ${
                  tab === t ? 'bg-blue-100 text-blue-700' : 'border border-borderInput'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => router.push('/ep/auction/create')}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded text-sm font-semibold"
        >
          <Image src="/icons/plus.svg" width={16} height={16} alt="Plus" />
          New Auction
        </button>
      </div>

      <AuctionTable
        tab={tab}
        searchQuery={searchQuery}
        auctions={filtered}
        loading={false}
        onMonitorClick={(id: string) => router.push(`/ep/auction/${id}/monitor`)}
      />
    </>
  );
}
