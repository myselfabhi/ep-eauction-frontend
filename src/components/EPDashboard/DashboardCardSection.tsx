import { useState } from 'react';
import Image from 'next/image';
import { Auction } from '@/types/auction';
import NotificationDropdown from '../shared/NotificationDropdown';
import Loader from '@/components/shared/Loader';

type DashboardCardSectionProps = {
  auctions: Auction[];
  loading: boolean;
};

export default function DashboardCardSection({ auctions, loading }: DashboardCardSectionProps) {
  const [notifOpen, setNotifOpen] = useState(false);

  const countByStatus = (status: string) =>
    auctions.filter((a) => a.status === status).length;

  if (loading) return <Loader />;

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1 text-body">Dashboard</h1>
          <p className="text-sm">Create, track, and review auctions</p>
        </div>
        <div className="relative">
          <button
            className="w-10 h-10 bg-background rounded-full flex items-center justify-center shadow-sm hover:shadow transition"
            onClick={() => setNotifOpen((prev) => !prev)}
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

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {/* Active Auctions */}
        <div className="bg-white rounded-lg border border-border p-4 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-status-live" />
              <span className="text-sm font-medium">Active Auctions</span>
            </div>
            <Image
              width={5}
              height={5}
              src="/icons/arrow_right.svg"
              alt="Chevron"
              className="w-4 h-4"
            />
          </div>
          <div className="flex justify-between items-end mt-4">
            <span className="text-4xl font-semibold">
              {countByStatus('Active')}
            </span>
            <span className="text-status-live text-sm font-semibold">Live</span>
          </div>
        </div>

        {/* Total Auctions */}
        <div className="bg-white rounded-lg border border-border p-4 flex flex-col justify-between h-32">
          <div className="flex items-center gap-1 text-sm font-medium">
            <Image
              width={5}
              height={5}
              src="/icons/block_code.svg"
              alt="Total Auctions"
              className="w-4 h-4"
            />
            Total Auctions
          </div>
          <div className="text-4xl font-semibold mt-4">{auctions.length}</div>
        </div>

        {/* Scheduled Auctions */}
        <div className="bg-white rounded-lg border border-border p-4 flex flex-col justify-between h-32">
          <div className="flex items-center gap-1 text-sm font-medium">
            <Image
              width={5}
              height={5}
              src="/icons/calendar_clock.svg"
              alt="Scheduled Auction"
              className="w-4 h-4"
            />
            Scheduled Auction
          </div>
          <div className="text-4xl font-semibold mt-4">
            {countByStatus('Scheduled')}
          </div>
        </div>

        {/* Total Suppliers */}
        <div className="bg-white rounded-lg border border-border p-4 flex flex-col justify-between h-32">
          <div className="flex items-center gap-1 text-sm font-medium">
            <Image
              width={5}
              height={5}
              src="/icons/group.svg"
              alt="Total Suppliers"
              className="w-4 h-4"
            />
            Total Suppliers
          </div>
          <div className="text-4xl font-semibold mt-4">–</div>
        </div>
      </div>
    </>
  );
}
