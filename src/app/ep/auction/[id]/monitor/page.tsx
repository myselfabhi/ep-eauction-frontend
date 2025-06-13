'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { getSocket } from '@/lib/socket';

type Bid = {
  supplier: string;
  fob: number;
  freight: number;
  duty: number;
  landedCost: number;
  bidTime: string;
};

export default function EPMonitorAuctionPage() {
  const { id } = useParams();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [selectedLot, setSelectedLot] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedLot') || 'LOT-001';
    }
    return 'LOT-001';
  });

  const [bids, setBids] = useState<Bid[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(3600);
  const [isPaused, setIsPaused] = useState(false);
  const [highlightedBidTime, setHighlightedBidTime] = useState<string | null>(null);

  const lots = ['LOT-001', 'LOT-002', 'LOT-003', 'LOT-004'];

  const bestBid = bids.length > 0 && bids[0]?.landedCost !== undefined ? bids[0] : null;

  const summary = {
    bestLandedCost: bestBid ? `£${bestBid.landedCost.toFixed(2)}/unit` : '—',
    estimatedSavings: bestBid ? `£${(7.20 - bestBid.landedCost).toFixed(2)}/unit` : '—',
    previousCost: '£7.20/unit',
    activeBidders: new Set(bids.map((bid) => bid.supplier)).size,
  };

  // On first load → restore auctionEndTimestamp
  useEffect(() => {
    const storedEnd = localStorage.getItem(`auctionEndTimestamp-${id}`);
    if (storedEnd) {
      const diff = Math.floor((parseInt(storedEnd) - Date.now()) / 1000);
      setTimeRemaining(diff > 0 ? diff : 0);
    } else {
      // First time → store timestamp
      const auctionEnd = Date.now() + timeRemaining * 1000;
      localStorage.setItem(`auctionEndTimestamp-${id}`, auctionEnd.toString());
    }
  }, [id]);

  useEffect(() => {
    const socket = getSocket();

    socket.on('connect', () => {
      console.log('Connected to WebSocket for EP monitor');
    });

    socket.on('bid-update', ({ lot, newBid }: { lot: string; newBid: Bid }) => {
      if (isPaused) return;
      if (lot === selectedLot && newBid && newBid.landedCost !== undefined) {
        setBids((prev) => {
          const updated = [...prev, newBid].sort((a, b) => a.landedCost - b.landedCost);
          setHighlightedBidTime(newBid.bidTime); // highlight row
          setTimeout(() => {
            setHighlightedBidTime(null);
          }, 1500);
          setTimeout(() => {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
          return updated;
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedLot, isPaused]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isPaused) {
        setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <main className="p-8 bg-white min-h-screen text-gray-900">
      {/* Auction Header */}
      <h1 className="text-2xl font-bold mb-1">Single-Use Coffee Cup Procurement - Q2 2025</h1>
      <div className="flex flex-wrap gap-4 text-sm  mb-4">
        <span>Auction #: <b>AUC-{id}</b></span>
        <a href="#" className="text-blue-600 underline">View Details</a>
        <span>Invited suppliers: 12</span>
        <span>Started: June 3, 2025, 4:00 PM GMT</span>
        <span>Closing: June 3, 2025, 4:00 PM GMT</span>
      </div>

      {/* Auction Live Status */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setIsPaused(true)}
            className={`border px-4 py-2 rounded text-sm ${
              isPaused ? 'bg-gray-200 ' : ''
            }`}
            disabled={isPaused}
          >
            Pause Auction
          </button>
          <button
            onClick={() => setIsPaused(false)}
            className={`border px-4 py-2 rounded text-sm ${
              !isPaused ? 'bg-gray-200 ' : ''
            }`}
            disabled={!isPaused}
          >
            Resume Auction
          </button>
        </div>
        <div className="text-red-500 text-sm font-semibold border border-red-500 px-3 py-1 rounded">
          ● Auction Live - {formatTime(timeRemaining)} Time Remaining
        </div>
      </div>

      {/* LOT Tabs */}
      <div className="flex gap-2 mb-4">
        {lots.map((lot) => (
          <button
            key={lot}
            onClick={() => {
              setSelectedLot(lot);
              localStorage.setItem('selectedLot', lot);
              setBids([]);
            }}
            className={`px-4 py-1 rounded-full text-sm border ${
              selectedLot === lot
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100  border-gray-300'
            }`}
          >
            {lot}
          </button>
        ))}
      </div>

      {/* LOT Summary */}
      <div className="bg-gray-50 border rounded p-4 mb-6 grid grid-cols-4 gap-4 text-sm">
        <div>
          <p className=" mb-1">Best Landed Cost</p>
          <p className="text-green-600 font-bold text-lg">{summary.bestLandedCost}</p>
        </div>
        <div>
          <p className=" mb-1">Estimated Savings</p>
          <p className="text-green-600 font-bold text-lg">{summary.estimatedSavings}</p>
        </div>
        <div>
          <p className=" mb-1">Previous Cost</p>
          <p className="text-black font-bold text-lg">{summary.previousCost}</p>
        </div>
        <div>
          <p className=" mb-1">Active Bidders</p>
          <p className="text-black font-bold text-lg">{summary.activeBidders}</p>
        </div>
      </div>

      {/* Active Bids Table */}
      <div className="bg-white border rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-2 font-medium ">#</th>
              <th className="px-4 py-2 font-medium ">LOT</th>
              <th className="px-4 py-2 font-medium ">Supplier</th>
              <th className="px-4 py-2 font-medium ">FOB Cost</th>
              <th className="px-4 py-2 font-medium ">Freight/Carton</th>
              <th className="px-4 py-2 font-medium ">Duty %</th>
              <th className="px-4 py-2 font-medium ">Landed Cost (GBP)</th>
              <th className="px-4 py-2 font-medium ">Bid Time</th>
            </tr>
          </thead>
          <tbody>
            {bids.map((bid, index) => {
              if (!bid || bid.supplier === undefined) return null;
              return (
                <tr
                  key={index}
                  className={`border-t hover:bg-gray-50 ${
                    highlightedBidTime === bid.bidTime ? 'bg-yellow-100 transition-colors' : ''
                  }`}
                >
                  <td className="px-4 py-2 font-bold text-green-600">{`#${index + 1}`}</td>
                  <td className="px-4 py-2">{selectedLot}</td>
                  <td className="px-4 py-2">{bid.supplier}</td>
                  <td className="px-4 py-2">£{bid.fob.toFixed(2)}</td>
                  <td className="px-4 py-2">£{bid.freight.toFixed(2)}</td>
                  <td className="px-4 py-2">{bid.duty}%</td>
                  <td
                    className={`px-4 py-2 font-semibold ${
                      index === 0 ? 'text-green-600' : 'text-black'
                    }`}
                  >
                    £{bid.landedCost.toFixed(2)}
                  </td>
                  <td className="px-4 py-2">{bid.bidTime}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* Auto-scroll anchor */}
        <div ref={bottomRef}></div>
      </div>
    </main>
  );
}
