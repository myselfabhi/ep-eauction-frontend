'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getSocket } from '@/lib/socket';

type BidRow = {
  supplier: string;
  lot: string;
  product: string;
  fob: number;
  freight: number;
  duty: number;
  time: string;
};

export default function EPMonitorPage() {
  const { id } = useParams();
  const [bids, setBids] = useState<BidRow[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  const calculateLandedCost = (fob: number, freight: number, duty: number) => {
    return (fob + freight) * (1 + duty / 100);
  };

  useEffect(() => {
    const socket = getSocket();

    socket.on('connect', () => {
      console.log('Connected to WebSocket as EP monitor');
    });

    socket.on('bid-update', (newBid: BidRow) => {
      if (!isPaused) {
        setBids((prev) => [
          ...prev,
          {
            ...newBid,
            fob: parseFloat(newBid.fob as unknown as string),
            freight: parseFloat(newBid.freight as unknown as string),
            duty: parseFloat(newBid.duty as unknown as string),
          },
        ]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [isPaused]);

  const sortedBids = bids
    .map((bid) => ({
      ...bid,
      landedCost: calculateLandedCost(bid.fob, bid.freight, bid.duty),
    }))
    .sort((a, b) => a.landedCost - b.landedCost);

  return (
    <main className="p-6 text-gray-900">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Live Monitor: {id}</h1>
          <p className="text-sm ">Real-time bidding powered by WebSocket</p>
        </div>
        <button
          onClick={() => setIsPaused((prev) => !prev)}
          className={`px-4 py-2 rounded text-white font-medium ${
            isPaused ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      </div>

      <table className="w-full bg-white rounded shadow text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left px-4 py-2">Rank</th>
            <th className="text-left px-4 py-2">LOT</th>
            <th className="text-left px-4 py-2">Supplier</th>
            <th className="text-left px-4 py-2">Product</th>
            <th className="text-left px-4 py-2">FOB ($)</th>
            <th className="text-left px-4 py-2">Freight (£)</th>
            <th className="text-left px-4 py-2">Duty (%)</th>
            <th className="text-left px-4 py-2">Landed Cost (£)</th>
            <th className="text-left px-4 py-2">Time</th>
          </tr>
        </thead>
        <tbody>
          {sortedBids.map((bid, index) => (
            <tr key={index} className="border-t hover:bg-white">
              <td className="px-4 py-2 font-bold">{index + 1}</td>
              <td className="px-4 py-2">{bid.lot}</td>
              <td className="px-4 py-2">{bid.supplier}</td>
              <td className="px-4 py-2">{bid.product}</td>
              <td className="px-4 py-2">${bid.fob.toFixed(2)}</td>
              <td className="px-4 py-2">£{bid.freight.toFixed(2)}</td>
              <td className="px-4 py-2">{bid.duty}%</td>
              <td className="px-4 py-2 text-blue-600 font-semibold">
                £{calculateLandedCost(bid.fob, bid.freight, bid.duty).toFixed(2)}
              </td>
              <td className="px-4 py-2">{bid.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
