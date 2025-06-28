import React, { useEffect } from 'react';

type Props = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmBidModal({ open, onCancel, onConfirm }: Props) {
  useEffect(() => {
    if (!open) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Enter') onConfirm();
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [open, onCancel, onConfirm]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="bg-white rounded-[16px] px-8 py-7 shadow-2xl w-[420px] max-w-[94vw] flex flex-col items-center">
        <h2 className="text-[20px] font-semibold mb-2 text-center tracking-tight">
          Confirm Your Bid
        </h2>
        <p className="text-[#757575] text-[16px] mb-7 text-center">
          This action is final and cannot be undone
        </p>
        <div className="flex w-full justify-between gap-3">
          <button
            className="h-10 w-1/2 border border-[#E0E0E0] bg-white text-[#222] rounded-[8px] text-base font-medium transition focus:outline-none"
            onClick={onCancel}
          >
            Back (Esc)
          </button>
          <button
            className="h-10 w-1/2 bg-[#1570EF] hover:bg-[#175CD3] text-white rounded-[8px] text-base font-semibold transition focus:outline-none"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
