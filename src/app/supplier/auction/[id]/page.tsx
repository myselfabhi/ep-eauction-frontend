'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getSocket } from '@/lib/socket';
import Loader from '@/components/shared/Loader';

export default function SupplierAuctionPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [bids, setBids] = useState([
    { lot: 'LOT-CC-001', product: '8oz Paper Cups', quantity: '50,000', current: 0.4, yourBid: '' },
    { lot: 'LOT-CC-002', product: '12oz Paper Cups', quantity: '30,000', current: 0.42, yourBid: '' },
  ]);

  useEffect(() => {
    const socket = getSocket();

    socket.on('bid-update', ({ lot, newBid }) => {
      setBids((prev) =>
        prev.map((b) =>
          b.lot === lot ? { ...b, current: parseFloat(newBid) } : b
        )
      );
    });

    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timer);
      socket.disconnect();
    };
  }, []);

  const handleBidChange = (index: number, value: string) => {
    const updated = [...bids];
    updated[index].yourBid = value;
    setBids(updated);
  };

  const handleSubmitBid = (index: number) => {
    const updated = [...bids];
    alert(`Bid submitted: ${updated[index].yourBid} for ${updated[index].lot}`);
  };

  return (
    <main className="p-6 text-gray-900">
      {loading ? (
        <Loader />
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-1">Live Auction: {id}</h1>
          <p className=" mb-6">Real-time bidding powered by WebSocket</p>

          <table className="w-full bg-white rounded shadow text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">LOT ID</th>
                <th className="px-4 py-2 text-left">Product</th>
                <th className="px-4 py-2 text-left">Quantity</th>
                <th className="px-4 py-2 text-left">Current Lowest</th>
                <th className="px-4 py-2 text-left">Your Bid</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {bids.map((item, i) => (
                <tr key={i} className="border-t hover:bg-white">
                  <td className="px-4 py-2 font-medium">{item.lot}</td>
                  <td className="px-4 py-2">{item.product}</td>
                  <td className="px-4 py-2">{item.quantity}</td>
                  <td className="px-4 py-2 text-green-700 font-bold">${item.current.toFixed(2)}</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      step="0.01"
                      className="border p-2 rounded w-28"
                      value={item.yourBid}
                      onChange={(e) => handleBidChange(i, e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                      onClick={() => handleSubmitBid(i)}
                    >
                      Submit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </main>
  );
}
