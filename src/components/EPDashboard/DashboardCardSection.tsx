'use client';

import Image from 'next/image';
import { Auction } from '@/types/auction';

export default function DashboardCardSection({
  auctions,
  // loading,
}: {
  auctions: Auction[];
  loading: boolean;
}) {
  const countByStatus = (status: string) =>
    auctions.filter((a) => a.status === status).length;

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1 text-body">Dashboard (Demo)</h1>
          <p className="text-sm text-muted-foreground">Dummy data — backend disabled</p>
        </div>
        <button className="w-10 h-10 bg-background rounded-full flex items-center justify-center">
          <Image width={20} height={20} src="/icons/bell.svg" alt="Notifications" />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-border p-4 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-status-live" />
              <span className="text-sm font-medium">Active Auctions</span>
            </div>
            <Image width={16} height={16} src="/icons/arrow_right.svg" alt="Chevron" />
          </div>
          <div className="flex justify-between items-end mt-4">
            <span className="text-4xl font-semibold">{countByStatus('Active')}</span>
            <span className="text-status-live text-sm font-semibold">Live</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-border p-4 flex flex-col justify-between h-32">
          <div className="flex items-center gap-1 text-sm font-medium">
            <Image width={16} height={16} src="/icons/block_code.svg" alt="Total Auctions" />
            Total Auctions
          </div>
          <div className="text-4xl font-semibold mt-4">{auctions.length}</div>
        </div>

        <div className="bg-white rounded-lg border border-border p-4 flex flex-col justify-between h-32">
          <div className="flex items-center gap-1 text-sm font-medium">
            <Image width={16} height={16} src="/icons/calendar_clock.svg" alt="Schedule Auction" />
            Schedule Auction
          </div>
          <div className="text-4xl font-semibold mt-4">{countByStatus('Scheduled')}</div>
        </div>

        <div className="bg-white rounded-lg border border-border p-4 flex flex-col justify-between h-32">
          <div className="flex items-center gap-1 text-sm font-medium">
            <Image width={16} height={16} src="/icons/group.svg" alt="Total Suppliers" />
            Total Suppliers
          </div>
          <div className="text-4xl font-semibold mt-4">–</div>
        </div>
      </div>
    </>
  );
}