'use client';

export default function SupplierDashboard() {
  const invitedAuctions = [
    {
      title: 'Food Service Paper Cups - Q2',
      id: 'AUC-2025-CC-001',
      closing: 'June 3, 2025, 4:00 PM GMT',
      status: 'Live',
    },
    {
      title: 'Beverage Packaging Materials',
      id: 'AUC-2025-BPM-002',
      closing: 'June 10, 2025, 6:00 PM GMT',
      status: 'Scheduled',
    },
  ];

  return (
    <main className="p-6 text-gray-900">
      <h1 className="text-2xl font-bold mb-4">Invited Auctions</h1>

      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded shadow text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left px-4 py-2">Title</th>
              <th className="text-left px-4 py-2">Auction ID</th>
              <th className="text-left px-4 py-2">Closing</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="text-left px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {invitedAuctions.map((auction, index) => (
              <tr key={index} className="border-t hover:bg-white">
                <td className="px-4 py-2 font-medium">{auction.title}</td>
                <td className="px-4 py-2">{auction.id}</td>
                <td className="px-4 py-2">{auction.closing}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 text-xs rounded font-medium ${
                      auction.status === 'Live'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {auction.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => {
                      window.location.href = `/supplier/auction/${auction.id}`;
                    }}
                  >
                    Enter Auction
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
