'use client';

import { Supplier } from '@/components/CreateAuctionSteps/SupplierInvitationStep';
import { useState, useEffect } from 'react';
import type { Lot } from '@/types/lot';

type EditableReviewModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (updated: AuctionData) => void;
  initialData: AuctionData;
  suppliers: Supplier[];
};

export interface AuctionData {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  lots: Lot[];
  documents: string[];
  invitedSuppliers: string[];
  reservePrice: number;
  currency: string;
  startTime: string;
  endTime: string;
  autoExtension: boolean;
  extensionMinutes: number;
  costParams: {
    priceWeight: number;
    fobWeight: number;
    taxWeight: number;
    dutyWeight: number;
    performanceWeight: number;
    qualityRequirements?: string;
  };
}

export default function EditableReviewModal({
  open,
  onClose,
  onSave,
  initialData,
}: EditableReviewModalProps) {
  const [data, setData] = useState<AuctionData>(initialData);

  useEffect(() => {
    if (open) {
      console.log('[Modal] Opened with data:', initialData);
      setData(initialData);
    }
  }, [initialData, open]);

  const update = <K extends keyof AuctionData>(key: K, value: AuctionData[K]) => {

    setData(prev => ({ ...prev, [key]: value }));
  };

  if (!open) {
    console.log('[Modal] Not open, returning null');
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-4xl w-full relative overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4">Edit Auction Details</h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-sm">Title</label>
            <input
              value={data.title || ''}
              onChange={e => update('title', e.target.value)}
              className="w-full border px-3 py-2 rounded text-sm"
            />
          </div>
          <div>
            <label className="text-sm">Category</label>
            <input
              value={data.category || ''}
              onChange={e => update('category', e.target.value)}
              className="w-full border px-3 py-2 rounded text-sm"
            />
          </div>
          <div>
            <label className="text-sm">Reserve Price</label>
            <input
              type="number"
              value={data.reservePrice || ''}
              onChange={e => update('reservePrice', Number(e.target.value))}
              className="w-full border px-3 py-2 rounded text-sm"
            />
          </div>
          <div>
            <label className="text-sm">Currency</label>
            <input
              value={data.currency || ''}
              onChange={e => update('currency', e.target.value)}
              className="w-full border px-3 py-2 rounded text-sm"
            />
          </div>
          <div>
            <label className="text-sm">Start Time</label>
            <input
              type="datetime-local"
              value={data.startTime?.slice(0, 16) || ''}
              onChange={e => update('startTime', new Date(e.target.value).toISOString())}
              className="w-full border px-3 py-2 rounded text-sm"
            />
          </div>
          <div>
            <label className="text-sm">End Time</label>
            <input
              type="datetime-local"
              value={data.endTime?.slice(0, 16) || ''}
              onChange={e => update('endTime', new Date(e.target.value).toISOString())}
              className="w-full border px-3 py-2 rounded text-sm"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm">Description</label>
          <textarea
            value={data.description || ''}
            onChange={e => update('description', e.target.value)}
            className="w-full border px-3 py-2 rounded text-sm"
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="border border-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              console.log('[Modal] Saving data:', data);
              onSave(data);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
