'use client';

import { Dialog, DialogContent, DialogTitle } from  '@/components/ui/dialog';
import { useState, useEffect } from 'react';

// ---- TYPE DEFINITIONS ----
type Country = { _id: string; name: string };
type Product = { _id: string; name: string };

export default function DutyModal({
  open,
  country,
  product,
  currentRate,
  onClose,
  onSave,
}: {
  open: boolean;
  country?: Country;
  product?: Product;
  currentRate?: number | null;
  onClose: () => void;
  onSave: (product: Product, country: Country, rate: number) => void;
}) {
  const [rate, setRate] = useState(currentRate ?? '');

  useEffect(() => {
    setRate(currentRate ?? '');
  }, [open, currentRate]);

  if (!open || !product || !country) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>
          {currentRate != null ? 'Edit Duty Rate' : 'Add Duty Rate'}
        </DialogTitle>
        <form
          className="flex flex-col gap-4 mt-2"
          onSubmit={e => {
            e.preventDefault();
            if (rate === '') return;
            onSave(product, country, Number(rate));
          }}
        >
          <div>
            <span className="text-body font-medium">{product.name}</span> to{' '}
            <span className="text-body font-medium">{country.name}</span>
          </div>
          <input
            type="number"
            step="0.01"
            placeholder="Duty %"
            value={rate}
            onChange={e => setRate(e.target.value)}
            className="border border-borderInput px-3 py-2 rounded"
            min={0}
            max={100}
            required
          />
          <div className="flex gap-2 justify-end mt-2">
            <button
              type="button"
              className="px-4 py-2 rounded border"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
