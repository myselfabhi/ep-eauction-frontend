'use client';

import AuctionTable from '@/components/AuctionTable';
import DashboardLayout from '@/components/DashboardLayout';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function EPDashboard() {
  const [tab, setTab] = useState<'All' | 'Live' | 'Scheduled' | 'Completed'>('All');
  const tabs = ['All', 'Live', 'Scheduled', 'Completed'];
  const [searchQuery, setSearchQuery] = useState('');

  const router = useRouter();

  return (
    <DashboardLayout>
      {/* Dashboard header + bell */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
          <p className="text-sm text-[#5E5E65]">Create, track, and review auctions</p>
        </div>
        <button className="w-10 h-10 bg-[#F7F7FC] rounded-full flex items-center justify-center">
          <Image width={5} height={5} src="/icons/bell.svg" alt="Notifications" className="w-5 h-5" />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-[#EAECF0] p-4 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-red-500 mt-0.5" />
              <span className="text-sm font-medium">Active Auctions</span>
            </div>
            <Image width={5} height={5} src="/icons/arrow_right.svg" alt="Chevron" className="w-4 h-4" />
          </div>
          <div className="flex justify-between items-end mt-4">
            <span className="text-4xl font-semibold">3</span>
            <span className="text-red-500 text-sm font-semibold">Live</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#EAECF0] p-4 flex flex-col justify-between h-32">
          <div className="flex items-center gap-1 text-sm font-medium">
            <Image width={5} height={5} src="/icons/block_code.svg" alt="Total Auctions" className="w-4 h-4" />
            Total Auctions
          </div>
          <div className="text-4xl font-semibold mt-4">6</div>
        </div>

        <div className="bg-white rounded-lg border border-[#EAECF0] p-4 flex flex-col justify-between h-32">
          <div className="flex items-center gap-1 text-sm font-medium">
            <Image width={5} height={5} src="/icons/calendar_clock.svg" alt="Schedule Auction" className="w-4 h-4" />
            Schedule Auction
          </div>
          <div className="text-4xl font-semibold mt-4">2</div>
        </div>

        <div className="bg-white rounded-lg border border-[#EAECF0] p-4 flex flex-col justify-between h-32">
          <div className="flex items-center gap-1 text-sm font-medium">
            <Image width={5} height={5} src="/icons/group.svg" alt="Total Suppliers" className="w-4 h-4" />
            Total Suppliers
          </div>
          <div className="text-4xl font-semibold mt-4">24</div>
        </div>
      </div>

      {/* Search + Tabs + Buttons */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-[#DDE1EB] p-2 pl-8 rounded-full text-sm w-64"
            />
            <svg
              className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8E8E99]"
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
                onClick={() => setTab(t as 'All' | 'Live' | 'Scheduled' | 'Completed')}
                className={`flex items-center gap-1 px-4  rounded-full border ${
                  tab === t ? 'border-blue-600 text-blue-600' : 'border-[#DDE1EB] text-[#383838]'
                }`}
              >
                {t === 'Live' && (
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                )}
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => router.push('/ep/suppliers')}
            className="flex items-center gap-2 border border-[#DDE1EB] px-4 py-2 rounded text-sm text-[#383838]"
          >
            <Image width={5} height={5} src="/icons/invite.svg" alt="Invite" className="w-4 h-4" />
            Invite Suppliers
          </button>
          <button
            onClick={() => router.push('/ep/auction/create')}
            className="flex items-center gap-2 bg-[#007AFF] text-white px-4 py-2 rounded text-sm font-semibold"
          >
            <Image width={5} height={5} src="/icons/plus.svg" alt="Plus" className="w-4 h-4" />
            New Auction
          </button>
        </div>
      </div>

      {/* Auction Table */}
      <AuctionTable
        onMonitorClick={(id: string) => router.push(`/ep/auction/${id}/monitor`)}
        tab={tab}
        searchQuery={searchQuery}
      />
    </DashboardLayout>
  );
}
