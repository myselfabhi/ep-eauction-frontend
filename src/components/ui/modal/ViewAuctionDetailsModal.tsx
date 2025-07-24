import React from 'react';

export type ViewAuctionDetailsModalProps = {
  open: boolean;
  onClose: () => void;
  auction: {
    title?: string;
    auctionId?: string;
    status?: string;
    reservePrice?: number;
    currency?: string;
    startTime?: string;
    endTime?: string;
    autoExtension?: boolean;
    createdBy?: { name?: string; email?: string };
    lots?: Array<{
      lotId?: string;
      name?: string;
      material?: string;
      volume?: string;
      prevCost?: string;
      hsCode?: string;
      dimensions?: { l?: string; w?: string; h?: string } | string;
    }>;
  };
};

const ViewAuctionDetailsModal: React.FC<ViewAuctionDetailsModalProps> = ({ open, onClose, auction }) => {
  if (!open) return null;
  const {
    title,
    auctionId,
    status,
    reservePrice,
    currency,
    startTime,
    endTime,
    autoExtension,
    createdBy,
    lots = [],
  } = auction || {};

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 px-8 py-7 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Auction Details</h2>
          <p className="text-sm text-gray-500">Below are all the details for this auction. Please review them carefully.</p>
        </div>
        <div className="mb-8 text-left text-sm text-gray-700 space-y-3 border-b pb-6">
          <div><span className="font-semibold">Auction Title:</span> <span className="text-gray-900">{title || '-'}</span></div>
          <div><span className="font-semibold">Auction ID:</span> <span className="text-gray-900">{auctionId || '-'}</span></div>
          <div><span className="font-semibold">Status:</span> <span className="text-gray-900">{status || '-'}</span></div>
          <div><span className="font-semibold">Reserve Price:</span> <span className="text-gray-900">{reservePrice !== undefined ? `${reservePrice} ${currency}` : '-'}</span> <span className="text-gray-500">(Minimum price to win a lot)</span></div>
          <div><span className="font-semibold">Start Time:</span> <span className="text-gray-900">{startTime ? new Date(startTime).toLocaleString() : '-'}</span></div>
          <div><span className="font-semibold">End Time:</span> <span className="text-gray-900">{endTime ? new Date(endTime).toLocaleString() : '-'}</span></div>
          <div><span className="font-semibold">Auto Extension:</span> <span className="text-gray-900">{autoExtension ? 'Enabled' : 'Disabled'}</span> <span className="text-gray-500">(Auction end time will extend if a bid is placed near closing)</span></div>
          <div><span className="font-semibold">Created By:</span> <span className="text-gray-900">{createdBy?.name || createdBy?.email || '-'}</span></div>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Auction Lots</h3>
          <table className="w-full text-sm border rounded overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">Lot ID</th>
                <th className="px-3 py-2 text-left font-semibold">Name</th>
                <th className="px-3 py-2 text-left font-semibold">Material</th>
                <th className="px-3 py-2 text-left font-semibold">Volume</th>
                <th className="px-3 py-2 text-left font-semibold">HS Code</th>
                <th className="px-3 py-2 text-left font-semibold">Dimensions</th>
              </tr>
            </thead>
            <tbody>
              {lots.map((lot, idx) => (
                <tr key={lot.lotId || idx} className="border-b last:border-b-0">
                  <td className="px-3 py-2">{lot.lotId || '-'}</td>
                  <td className="px-3 py-2">{lot.name || '-'}</td>
                  <td className="px-3 py-2">{lot.material || '-'}</td>
                  <td className="px-3 py-2">{lot.volume || '-'}</td>
                  <td className="px-3 py-2">{lot.hsCode || '-'}</td>
                  <td className="px-3 py-2">{
                    typeof lot.dimensions === 'string'
                      ? lot.dimensions
                      : lot.dimensions
                      ? `${lot.dimensions.l || '-'}x${lot.dimensions.w || '-'}x${lot.dimensions.h || '-'}`
                      : '-'
                  }</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end mt-6">
          <button
            type="button"
            className="px-5 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewAuctionDetailsModal; 