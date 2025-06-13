'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type Auction = {
  title: string;
  status: 'Live' | 'Scheduled' | 'Completed';
  timeline: string;
  suppliers: string;
  lots: string;
};

export default function AuctionTable({
  onMonitorClick,
  tab,
  searchQuery,
}: {
  onMonitorClick: (id: string) => void;
  tab: 'All' | 'Live' | 'Scheduled' | 'Completed';
  searchQuery: string;
}) {
  const router = useRouter();
  const [openAction, setOpenAction] = useState<number | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const actionMenuRef = useRef<HTMLDivElement>(null);
  const selectAllRef = useRef<HTMLInputElement>(null);

  const auctions: Auction[] = [
    {
      title: 'Food Service Paper Cups - Q2',
      status: 'Live',
      timeline: '12:34:00 left',
      suppliers: '8/12 active',
      lots: '5 lots',
    },
    {
      title: 'Beverage Packaging Materials',
      status: 'Scheduled',
      timeline: 'Starts in 5m',
      suppliers: '8/12 active',
      lots: '5 lots',
    },
    {
      title: 'Beverage Packaging Materials',
      status: 'Scheduled',
      timeline: '12:01 PM GMT June 4, 2025',
      suppliers: '8/12 active',
      lots: '5 lots',
    },
    {
      title: 'Food Service Paper Cups - Q2',
      status: 'Completed',
      timeline: '12:01 PM GMT June 4, 2025',
      suppliers: '8/12 active',
      lots: '5 lots',
    },
  ];

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
    const handleClickOutside = (event: MouseEvent) => {
      if (
        actionMenuRef.current &&
        !actionMenuRef.current.contains(event.target as Node)
      ) {
        setOpenAction(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [filtered.length, selectedRows, tab, searchQuery]);

  return (
    <div className="bg-white border rounded border-[#EAECF0] overflow-x-auto">
      <table className="w-full text-sm text-[#383838]">
        <thead className="bg-gray-50 text-left border-b border-[#EAECF0]">
          <tr>
            <th className="px-4 py-2 font-medium text-[#383838]">
              <input
                type="checkbox"
                ref={selectAllRef}
                checked={selectedRows.length === filtered.length && filtered.length > 0}
                onChange={toggleAll}
              />
            </th>
            {['Title', 'Status', 'Time/date'].map((col) => (
              <th key={col} className="px-4 py-2 font-medium text-[#383838]">
                <div className="flex items-center gap-1">
                  {col}
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7 10l5-5 5 5" />
                    <path d="M7 14l5 5 5-5" />
                  </svg>
                </div>
              </th>
            ))}
            <th className="px-4 py-2 font-medium text-[#383838]">Suppliers</th>
            <th className="px-4 py-2 font-medium text-[#383838]">Lots</th>
            <th className="px-4 py-2 font-medium text-[#383838] text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((auction, index) => (
            <tr
              key={index}
              className={`border-b border-[#EAECF0] hover:bg-gray-50 ${
                selectedRows.includes(index) ? 'bg-blue-50' : ''
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
                {auction.status === 'Live' && (
                  <>
                    <div className="h-2 w-2 bg-red-500 rounded-full" />
                    <span className="text-red-500 text-xs font-semibold">Auction Live</span>
                  </>
                )}
                {auction.status === 'Scheduled' &&
                  (auction.timeline.includes('Starts') ? (
                    <>
                      <Image src="/icons/schedule_blue.svg" alt="Schedule Blue" width={16} height={16} />
                      <span className="text-blue-600 text-xs font-semibold">Schedule</span>
                    </>
                  ) : (
                    <>
                      <Image src="/icons/schedule_black.svg" alt="Schedule Black" width={16} height={16} />
                      <span className="text-xs font-semibold">Schedule</span>
                    </>
                  ))}
                {auction.status === 'Completed' && (
                  <>
                    <Image src="/icons/completed_auction.svg" alt="Completed" width={16} height={16} />
                    <span className="text-xs font-semibold">Completed</span>
                  </>
                )}
              </td>
              <td className="px-4 py-2">
                {auction.status === 'Live' ? (
                  <span className="inline-block px-2 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-full">
                    {auction.timeline}
                  </span>
                ) : auction.status === 'Scheduled' && auction.timeline.includes('Starts') ? (
                  <span className="inline-block px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full">
                    {auction.timeline}
                  </span>
                ) : (
                  <div className="flex flex-col text-xs leading-tight">
                    <span>{auction.timeline.split(',')[0]}</span>
                    <span>{auction.timeline.split(',')[1]?.trim()}</span>
                  </div>
                )}
              </td>
              <td className="px-4 py-2">{auction.suppliers}</td>
              <td className="px-4 py-2">{auction.lots}</td>
              <td className="px-4 py-2 text-right relative flex justify-end items-center gap-2">
                {auction.status === 'Live' && (
                  <button
                    onClick={() => onMonitorClick('1')}
                    className="flex items-center gap-1 px-3 py-1 border border-[#EAECF0] rounded text-sm font-medium"
                  >
                    <Image src="/icons/monitor_eye.svg" alt="Monitor" width={16} height={16} />
                    Monitor
                  </button>
                )}
                {auction.status === 'Scheduled' && (
                  <button
                    className="flex items-center gap-1 px-3 py-1 border border-[#EAECF0] rounded text-sm font-medium"
                  >
                    <Image src="/icons/edit_pen.svg" alt="Edit" width={16} height={16} />
                  </button>
                )}
                {auction.status === 'Completed' && (
                  <button
                    className="flex items-center gap-1 px-3 py-1 border border-[#EAECF0] rounded text-sm font-medium"
                  >
                    <Image src="/icons/save_file.svg" alt="Save" width={16} height={16} />
                  </button>
                )}
                <button
                  className="p-1 border rounded hover:bg-gray-100"
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
                    ref={actionMenuRef}
                    className="absolute right-0 mt-2 w-40 bg-white border border-[#EAECF0] rounded shadow text-sm z-10"
                  >
                    <button
                      onClick={() => router.push('/dummy/edit-time')}
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-left"
                    >
                      <Image src="/icons/edit_time.svg" alt="Edit Time" width={16} height={16} />
                      Edit time
                    </button>
                    <button
                      onClick={() => router.push('/dummy/edit-details')}
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-left"
                    >
                      <Image src="/icons/edit_pen.svg" alt="Edit Details" width={16} height={16} />
                      Edit Details
                    </button>
                    <button
                      onClick={() => router.push('/dummy/download-report')}
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-left"
                    >
                      <Image src="/icons/download_file.svg" alt="Download Report" width={16} height={16} />
                      Download Report
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
