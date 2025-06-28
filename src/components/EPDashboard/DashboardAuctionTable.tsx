'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AuctionTable from '@/components/AuctionTable';
import Loader from '@/components/shared/Loader';
import { Auction } from '@/types/auction';

const tabs = ['All', 'Live', 'Paused', 'Scheduled', 'Completed'] as const;
type TabType = (typeof tabs)[number];

type DashboardAuctionTableProps = {
  auctions: Auction[];
  loading: boolean;
};

export default function DashboardAuctionTable({ auctions, loading }: DashboardAuctionTableProps) {
  const [tab, setTab] = useState<TabType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  if (loading) return <Loader />;

  return (
    <>
      {/* Search + Tabs + Actions */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-borderInput p-2 pl-8 rounded-full text-sm w-64"
            />
            <svg
              className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex items-center gap-1 px-4 rounded-full border ${
                  tab === t
                    ? 'border-status-scheduled text-status-scheduled'
                    : 'border-borderInput text-body'
                }`}
              >
                {t === 'Live' && <div className="h-2 w-2 rounded-full bg-status-live" />}
                {t === 'Paused' && <div className="h-2 w-2 rounded-full bg-yellow-500" />}
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Create New Auction */}
        <div className="flex gap-2">
          <button
            onClick={() => router.push('/ep-member/auction/create')}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded text-sm font-semibold"
          >
            <Image
              width={5}
              height={5}
              src="/icons/plus.svg"
              alt="Plus"
              className="w-4 h-4"
            />
            New Auction
          </button>
        </div>
      </div>

      {/* Auction Table */}
      <AuctionTable
        tab={tab}
        searchQuery={searchQuery}
        auctions={auctions}
        loading={loading}
        onMonitorClick={(id: string) => router.push(`/ep-member/auction/${id}/monitor`)}
      />
    </>
  );
}
