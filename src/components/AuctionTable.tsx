'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Auction } from '@/types/auction';

export default function AuctionTable({
  onMonitorClick,
  tab,
  searchQuery,
  auctions,
  loading,
}: {
  onMonitorClick: (id: string) => void;
  tab: 'All' | 'Live' | 'Scheduled' | 'Completed';
  searchQuery: string;
  auctions: Auction[];
  loading: boolean;
}) {
  const router = useRouter();
  const [openAction, setOpenAction] = useState<number | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const selectAllRef = useRef<HTMLInputElement>(null);

  const filtered = auctions.filter(
    (a) =>
      (tab === 'All' || a.status === tab) &&
      a.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const toggleRow = (index: number) => {
    setSelectedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toggleAll = () => {
    if (selectedRows.length === filtered.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filtered.map((_, index) => index));
    }
  };

  useEffect(() => {
    if (selectAllRef.current) {
      const isAllSelected = selectedRows.length === filtered.length;
      const isNoneSelected = selectedRows.length === 0;
      selectAllRef.current.indeterminate = !isAllSelected && !isNoneSelected;
    }
  }, [selectedRows, tab, searchQuery, filtered.length]);

  useEffect(() => {
    const handleMouseDown = () => setOpenAction(null);
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, []);

  if (loading) {
    return <div className="p-4 text-sm ">Loading auctions...</div>;
  }

  return (
    <div className="bg-white border rounded border-border overflow-x-auto">
      <table className="w-full text-sm text-body">
        <thead className="bg-background text-left border-b border-border">
          <tr>
            <th className="px-4 py-2 font-medium text-body">
              <input
                type="checkbox"
                ref={selectAllRef}
                checked={selectedRows.length === filtered.length && filtered.length > 0}
                onChange={toggleAll}
              />
            </th>
            {['Title', 'Status', 'Time/date'].map((col) => (
              <th key={col} className="px-4 py-2 font-medium text-body">
                <div className="flex items-center gap-1">
                  {col}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M7 10l5-5 5 5" />
                    <path d="M7 14l5 5 5-5" />
                  </svg>
                </div>
              </th>
            ))}
            <th className="px-4 py-2 font-medium text-body">Suppliers</th>
            <th className="px-4 py-2 font-medium text-body">Lots</th>
            <th className="px-4 py-2 font-medium text-body text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((auction, index) => (
            <tr
              key={auction._id}
              className={`border-b border-border hover:bg-background ${
                selectedRows.includes(index) ? 'bg-background-blue' : ''
              }`}
            >
              <td className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={selectedRows.includes(index)}
                  onChange={() => toggleRow(index)}
                  onClick={(e) => e.stopPropagation()}
                />
              </td>
              <td className="px-4 py-2">{auction.title}</td>
              <td className="px-4 py-2 flex items-center gap-1">
                {auction.status === 'Active' && (
                  <>
                    <div className="h-2 w-2 bg-status-live rounded-full" />
                    <span className="text-status-live text-xs font-semibold">Auction Live</span>
                  </>
                )}
                {auction.status === 'Scheduled' && (
                  <>
                    <Image src="/icons/schedule_blue.svg" alt="Scheduled" width={16} height={16} />
                    <span className="text-status-scheduled text-xs font-semibold">Scheduled</span>
                  </>
                )}
                {auction.status === 'Ended' && (
                  <>
                    <Image src="/icons/completed_auction.svg" alt="Completed" width={16} height={16} />
                    <span className="text-xs font-semibold text-body">Completed</span>
                  </>
                )}
              </td>
              <td className="px-4 py-2 text-xs">
                {new Date(auction.startTime).toLocaleString()} – {new Date(auction.endTime).toLocaleString()}
              </td>
              <td className="px-4 py-2">{auction.invitedSuppliers?.length ?? 0}</td>
              <td className="px-4 py-2">{auction.lots?.length ?? 0}</td>
              <td className="px-4 py-2 text-right">
                <div className="relative flex justify-end items-center gap-2">
                  {auction.status === 'Active' && (
                    <button
                      onClick={() => onMonitorClick(auction._id)}
                      className="flex items-center gap-1 px-3 py-1 border border-border rounded text-sm font-medium"
                    >
                      <Image src="/icons/monitor_eye.svg" alt="Monitor" width={16} height={16} />
                      Monitor
                    </button>
                  )}
                  <button
                    className="p-1 border rounded hover:bg-background"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setOpenAction(openAction === index ? null : index);
                    }}
                  >
                    •••
                  </button>
                  {openAction === index && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 mt-2 w-48 bg-white border border-border rounded-lg shadow-lg z-[9999] py-1"
                    >
                      <button
                        onClick={() => router.push('/dummy/edit-time')}
                        className="w-full flex items-center justify-between px-4 py-2 text-sm text-body hover:bg-gray-100"
                      >
                        <span>Edit time</span>
                        <Image src="/icons/edit.svg" alt="Edit Time" width={16} height={16} />
                      </button>
                      <div className="border-t border-border" />
                      <button
                        onClick={() => router.push('/dummy/edit-details')}
                        className="w-full flex items-center justify-between px-4 py-2 text-sm text-body hover:bg-gray-100"
                      >
                        <span>Edit Details</span>
                        <Image src="/icons/edit_pen.svg" alt="Edit Details" width={16} height={16} />
                      </button>
                      <div className="border-t border-border" />
                      <button
                        onClick={() => router.push('/dummy/download-report')}
                        className="w-full flex items-center justify-between px-4 py-2 text-sm text-body hover:bg-gray-100"
                      >
                        <span>Download Report</span>
                        <Image src="/icons/save_file.svg" alt="Download Report" width={16} height={16} />
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
