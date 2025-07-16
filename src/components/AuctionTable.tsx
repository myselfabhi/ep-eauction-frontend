'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Auction } from '@/types/auction';
import EditableReviewModal from './ui/modal/EditableReviewModal';
import { auctionService } from '@/services';
import { ROUTES, ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/lib';

function getRemainingTime(endTime: string): string {
  const end = new Date(endTime).getTime();
  const now = Date.now();
  const diff = end - now;

  if (diff <= 0) return '00:00:00';

  const hours = String(Math.floor(diff / 1000 / 60 / 60)).padStart(2, '0');
  const minutes = String(Math.floor((diff / 1000 / 60) % 60)).padStart(2, '0');
  const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}

function getStartsInMinutes(startTime: string): number {
  const start = new Date(startTime).getTime();
  const now = Date.now();
  const diff = start - now;
  return Math.floor(diff / 1000 / 60);
}

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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editAuction, setEditAuction] = useState<Auction | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [openAction, setOpenAction] = useState<number | null>(null);
  const selectAllRef = useRef<HTMLInputElement>(null);

  const tabStatusMap = {
    All: 'ALL',
    Live: 'Active',
    Scheduled: 'Scheduled',
    Completed: 'Ended',
  } as const;

  const statusFilter = tabStatusMap[tab];

  const filtered = auctions.filter((a) => {
    return (
      (statusFilter === 'ALL' || a.status === statusFilter) &&
      a.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
  });

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
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.dropdown-menu')) {
        setTimeout(() => {
          setOpenAction(null);
        }, 50);
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, []);

  if (loading) return <div className="p-4 text-sm">Loading auctions...</div>;

  return (
    <div className="border rounded border-border overflow-x-auto">
      <table className="w-full text-left text-sm font-normal font-sans text-body">
        <thead className="text-left text-sm text-body">
          <tr className="border border-border bg-white">
            <th className="px-4 py-3 border-r border-border">
              <input
                type="checkbox"
                ref={selectAllRef}
                checked={selectedRows.length === filtered.length && filtered.length > 0}
                onChange={toggleAll}
              />
            </th>
            {["Title", "Status", "Time/date", "Suppliers", "Lots"].map((col) => (
              <th
                key={col}
                className="px-4 py-3 font-medium border-r border-border text-left"
              >
                <div className="flex items-center justify-between">
                  <span>{col}</span>
                  {(col === 'Title' || col === 'Status' || col === 'Time/date') && (
                    <svg
                      className="w-5 h-5 text-gray-400 ml-2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M7 10l5-5 5 5" />
                      <path d="M7 14l5 5 5-5" />
                    </svg>
                  )}
                </div>
              </th>
            ))}
            <th className="px-4 py-3 font-medium text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((auction, index) => {
            const remainingTime = getRemainingTime(auction.endTime);
            const startsInMinutes = getStartsInMinutes(auction.startTime);

            return (
              <tr
                key={auction._id}
                className={`hover:bg-background ${selectedRows.includes(index) ? 'bg-background-blue' : ''}`}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(index)}
                    onChange={() => toggleRow(index)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
                <td className="px-4 py-3">{auction.title}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {auction.status === 'Active' && (
                      <>
                        <span className="h-2 w-2 bg-[#EF4444] rounded-full" />
                        <span className="text-[#EF4444] text-xs font-semibold">Auction Live</span>
                      </>
                    )}
                    {auction.status === 'Paused' && (
                      <>
                        <span className="h-2 w-2 bg-yellow-400 rounded-full" />
                        <span className="text-yellow-700 text-xs font-semibold">Paused</span>
                      </>
                    )}
                    {auction.status === 'Scheduled' && (
                      <>
                        <Image src="/icons/schedule_blue.svg" alt="Scheduled" width={16} height={16} />
                        <span className="text-[#2563EB] text-xs font-medium">Schedule</span>
                      </>
                    )}
                    {auction.status === 'Ended' && (
                      <>
                        <Image src="/icons/completed_auction.svg" alt="Completed" width={16} height={16} />
                        <span className="text-xs font-medium text-[#5E5E65]">Completed</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {auction.status === 'Active' ? (
                    <span className="text-[#EF4444] bg-[#FEE2E2] px-2 py-[2px] rounded-full text-xs font-semibold">
                      {remainingTime} left
                    </span>
                  ) : auction.status === 'Scheduled' && startsInMinutes <= 5 ? (
                    <span className="text-[#2563EB] bg-[#DBEAFE] px-2 py-[2px] rounded-full text-xs font-medium">
                      Starts in {startsInMinutes}m
                    </span>
                  ) : (
                    <span className="text-xs text-[#5E5E65]">
                      {new Date(auction.startTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      GMT
                      <br />
                      {new Date(auction.startTime).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-[#5E5E65]">
                  {auction.invitedSuppliers?.length ?? 0}/12 active
                </td>
                <td className="px-4 py-3 text-sm text-[#5E5E65]">
                  {auction.lots?.length ?? 0} lots
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="relative flex justify-end items-center gap-2 dropdown-menu">
                    {(auction.status === 'Active' || auction.status === 'Paused') && (
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
                        setOpenAction(openAction === index ? null : index);
                      }}
                      aria-label="Row actions"
                    >
                      •••
                    </button>
                    {openAction === index && (
                      <div className="absolute top-full right-0 mt-2 w-48 bg-white border rounded shadow z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('✅ Edit clicked');
                            setEditAuction(auction);
                            setEditModalOpen(true);
                            setOpenAction(null);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center justify-between"
                        >
                          <span>Edit Auction</span>
                          <Image src="/icons/edit_pen.svg" alt="Edit Auction" width={16} height={16} />
                        </button>
                        <button
                          onClick={() => {
                            setOpenAction(null);
                            router.push(ROUTES.COMMON.HOME);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center justify-between"
                        >
                          <span>Download Report</span>
                          <Image src="/icons/save_file.svg" alt="Download Report" width={16} height={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {editAuction && (
        <EditableReviewModal
          open={editModalOpen}
          onClose={() => {
            console.log('[Modal] Closed');
            setEditModalOpen(false);
          }}
          initialData={{
            ...editAuction,
            invitedSuppliers: editAuction.invitedSuppliers.map(user => user._id),
          }}
          suppliers={editAuction.invitedSuppliers.map(user => ({
            _id: user._id,
            email: user.email,
          }))}
          onSave={async (updatedData) => {
            console.log('[Modal] Saving updated auction:', updatedData);
            try {
              await auctionService.update(editAuction._id, updatedData as unknown as Partial<Auction>);
              alert(SUCCESS_MESSAGES.AUCTION.UPDATED);
              setEditModalOpen(false);
              console.log('[Modal] Saved and closed');
            } catch (error: unknown) {
              const apiError = error as { response?: { data?: { message?: string } } };
              const message = apiError?.response?.data?.message || ERROR_MESSAGES.GENERAL.UNKNOWN_ERROR;
              alert(message);
            }
          }}
        />
      )}
    </div>
  );
}
