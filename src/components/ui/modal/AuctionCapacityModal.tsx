'use client';

import { useState, useEffect } from 'react';

type Lot = {
  _id: string;
  lotId: string;
  name: string;
  material?: string;
  volume?: string;
  dimensions?: { l?: string; w?: string; h?: string };
};

export default function AuctionCapacityModal({
  auctionTitle,
  auctionTime,
  lots,
  initialCapacities = {},
  open,
  onClose,
  onSave,
  isReadOnly = false,
  isLiveAuction = false,
  initialCurrency = 'USD',
  initialFob = '',
}: {
  auctionTitle: string;
  auctionTime: string;
  lots: Lot[];
  initialCapacities?: Record<string, string>;
  open: boolean;
  onClose: () => void;
  onSave: (capacities: Record<string, string>, editMode?: boolean, extra?: { currency: string; fob: string }) => void;
  isReadOnly?: boolean;
  isLiveAuction?: boolean;
  initialCurrency?: string;
  initialFob?: string;
}) {
  const [capacities, setCapacities] = useState<Record<string, string>>({});
  const [agreed, setAgreed] = useState(false);
  const [currency, setCurrency] = useState(initialCurrency);
  const [fob, setFob] = useState(initialFob);

  useEffect(() => {
    setCapacities(initialCapacities);
  }, [initialCapacities]);

  useEffect(() => {
    setCurrency(initialCurrency);
  }, [initialCurrency]);

  useEffect(() => {
    setFob(initialFob);
  }, [initialFob]);

  // Debug logging
  useEffect(() => {
    if (open) {
      console.log('DEBUG: AuctionCapacityModal opened');
      console.log('DEBUG: Modal props:', {
        auctionTitle,
        auctionTime,
        lotsCount: lots.length,
        lots,
        initialCapacities,
        isReadOnly,
        isLiveAuction,
        initialCurrency,
        initialFob,
      });
    }
  }, [open, auctionTitle, auctionTime, lots, initialCapacities, isReadOnly, isLiveAuction, initialCurrency, initialFob]);

  const handleChange = (lotId: string, value: string) => {
    setCapacities((prev) => ({ ...prev, [lotId]: value }));
  };

  const canSubmit =
    !isReadOnly &&
    agreed &&
    lots.every((lot) => capacities[lot.lotId] && capacities[lot.lotId].trim() !== '') &&
    currency &&
    fob.trim() !== '';

  if (!open) return null;

  // De-duplicate lots by lotId
  const uniqueLots = Array.from(
    new Map(lots.map((lot) => [lot.lotId, lot])).values()
  );

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 px-8 py-7 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">{auctionTitle}</h2>
          {/* <p className="text-sm text-gray-500 mt-1">{auctionTime}</p> */}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (canSubmit) onSave(capacities, false, { currency, fob });
          }}
        >
          <div className="space-y-6 mb-6">
            {uniqueLots.map((lot) => (
              <div key={lot.lotId}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 mb-0.5">Lot - {lot.lotId}</p>
                    <p className="text-xs text-gray-500 mb-1">Product: {lot.name}</p>
                    {/* {lot.volume && (
                      <p className="text-xs text-gray-500 mb-1">Volume: {lot.volume}</p>
                    )} */}
                  </div>
                  <div className="w-36">
                    <input
                      type="text"
                      inputMode="numeric"
                      readOnly={isReadOnly}
                      placeholder="Carton/container"
                      value={capacities[lot.lotId] || ''}
                      onChange={(e) => handleChange(lot.lotId, e.target.value)}
                      className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none ${
                        isReadOnly
                          ? 'bg-gray-100 text-gray-500 border-gray-200'
                          : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                      }`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Currency Dropdown */}
          <div className="mb-4">
            <label className="block text-xs font-semibold mb-1 text-gray-700">Currency</label>
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none border-gray-300 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
              disabled={isReadOnly}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="INR">INR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
              <option value="CNY">CNY</option>
            </select>
          </div>
          {/* FOB Input */}
          <div className="mb-6">
            <label className="block text-xs font-semibold mb-1 text-gray-700">FOB Value</label>
            <input
              type="number"
              value={fob}
              onChange={e => setFob(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none border-gray-300 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
              placeholder="Enter FOB value"
              readOnly={isReadOnly}
            />
          </div>

          {!isReadOnly && (
            <div className="flex items-start text-xs text-gray-600 mb-6 gap-2">
              <input
                type="checkbox"
                id="agree"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-[0.2rem] h-3 w-3 rounded border-gray-300 text-blue-600"
              />
              <label htmlFor="agree" className="cursor-pointer select-none">
                I agree to the auction participation terms and conditions, including pricing commitments and delivery schedules.
              </label>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-5 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100"
              onClick={onClose}
            >
              {isReadOnly ? 'Close' : 'Back'}
            </button>
            {isReadOnly ? (
              <button
                type="button"
                className="px-5 py-2 rounded-md text-sm font-semibold text-blue-600 border border-blue-600 hover:bg-blue-50"
                onClick={() => onSave(capacities, true, { currency, fob })}
              >
                Edit Details
              </button>
            ) : (
              <button
                type="submit"
                disabled={!canSubmit}
                className={`px-5 py-2 rounded-md text-sm font-semibold text-white transition ${
                  canSubmit ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 cursor-not-allowed'
                }`}
              >
                {isLiveAuction ? 'Continue' : 'Save'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
