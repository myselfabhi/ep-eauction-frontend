'use client';

import { useState } from "react";

// --- Confirmation Modal ---
function ConfirmLaunchModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg p-8 min-w-[350px] max-w-[95vw] flex flex-col items-center relative">
        <div className="text-lg font-semibold mb-2 text-center">Save &amp; Launch</div>
        <div className="text-center text-[#555] mb-6">
          Are you sure you want to save changes &amp; send invitations?
        </div>
        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            className="w-1/2 py-2 rounded border border-[#DDE1EB] text-sm font-medium bg-[#f8fafc] hover:bg-[#f3f6fb] transition"
          >
            Back
          </button>
          <button
            onClick={onConfirm}
            className="w-1/2 py-2 rounded bg-[#1976D2] text-white text-sm font-medium hover:bg-[#1565c0] transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Review step data type ---
type ReviewAuctionData = {
  title?: string;
  sapCode?: string;
  type?: string;
  lots?: {
    lotId?: string;
    hsCode?: string;
    productName?: string;
    material?: string;
    dimensions?: string;
    prevCost?: string | number;
  }[];
  startTime?: string;
  endTime?: string;
  autoExtension?: boolean;
  allowPause?: boolean;
  suppliers?: string[];
  emailPreview?: string;
};

// --- Main Review & Launch Step ---
type ReviewLaunchStepProps = {
  data: ReviewAuctionData;
  onSubmit: () => void;
};

export default function ReviewLaunchStep({ data, onSubmit }: ReviewLaunchStepProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Review &amp; Launch</h2>
      {/* --- Auction Information --- */}
      <div className="bg-[#FAFAFC] border border-[#E1E6F0] rounded mb-5 p-4">
        <h3 className="font-semibold mb-3 text-[15px]">Auction Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs mb-1 text-gray-500">Auction title</div>
            <div className="border border-[#E1E6F0] rounded px-2 py-1 bg-white">{data.title || "-"}</div>
          </div>
          <div>
            <div className="text-xs mb-1 text-gray-500">SAP Code</div>
            <div className="border border-[#E1E6F0] rounded px-2 py-1 bg-white">{data.sapCode || "-"}</div>
          </div>
          <div>
            <div className="text-xs mb-1 text-gray-500">Auction Type</div>
            <div className="border border-[#E1E6F0] rounded px-2 py-1 bg-white">{data.type || "-"}</div>
          </div>
        </div>
      </div>

      {/* --- LOT & Product Details --- */}
      <div className="bg-[#FAFAFC] border border-[#E1E6F0] rounded mb-5 p-4">
        <h3 className="font-semibold mb-3 text-[15px]">LOT & Product Details</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead className="bg-[#F4F6FA] text-gray-700">
              <tr>
                <th className="p-2 border">LOT ID</th>
                <th className="p-2 border">HS Code</th>
                <th className="p-2 border">Product Name</th>
                <th className="p-2 border">Material / Dimensions</th>
                <th className="p-2 border">Previous landed cost</th>
              </tr>
            </thead>
            <tbody>
              {(data.lots && data.lots.length > 0 ? data.lots : [{ lotId: '-', hsCode: '-', productName: '-', material: '-', prevCost: '-' }]).map((lot, i) => (
                <tr key={i}>
                  <td className="p-2 border">{lot.lotId || '-'}</td>
                  <td className="p-2 border">{lot.hsCode || '-'}</td>
                  <td className="p-2 border">{lot.productName || '-'}</td>
                  <td className="p-2 border">
                    {lot.material || '-'}
                    {lot.dimensions ? `, ${lot.dimensions}` : ''}
                  </td>
                  <td className="p-2 border">{lot.prevCost || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Auction Settings --- */}
      <div className="bg-[#FAFAFC] border border-[#E1E6F0] rounded mb-5 p-4">
        <h3 className="font-semibold mb-3 text-[15px]">Auction Settings</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs mb-1 text-gray-500">Start Date & Time</div>
            <div className="border border-[#E1E6F0] rounded px-2 py-1 bg-white">
              {data.startTime || "-"}
            </div>
          </div>
          <div>
            <div className="text-xs mb-1 text-gray-500">End Date & Time</div>
            <div className="border border-[#E1E6F0] rounded px-2 py-1 bg-white">
              {data.endTime || "-"}
            </div>
          </div>
          <div>
            <div className="text-xs mb-1 text-gray-500">Auto-Extension Rules</div>
            <div className="border border-[#E1E6F0] rounded px-2 py-1 bg-white">
              {data.autoExtension ? "Enabled" : "Disabled"}
            </div>
          </div>
          <div>
            <div className="text-xs mb-1 text-gray-500">Allow pause/resume live auction</div>
            <div className="border border-[#E1E6F0] rounded px-2 py-1 bg-white">
              {data.allowPause ? "Enabled" : "Disabled"}
            </div>
          </div>
        </div>
      </div>

      {/* --- Invited suppliers --- */}
      <div className="bg-[#FAFAFC] border border-[#E1E6F0] rounded mb-5 p-4">
        <h3 className="font-semibold mb-3 text-[15px]">Invited suppliers ({(data.suppliers || []).length})</h3>
        <div className="flex flex-wrap gap-2 mb-2">
          {(data.suppliers || []).map((email, idx) => (
            <span
              key={idx}
              className="flex items-center gap-1 bg-[#F3F6FB] border border-[#E1E6F0] px-3 py-1 rounded-full text-sm text-[#222] shadow-sm"
            >
              <span>{email}</span>
            </span>
          ))}
        </div>
      </div>

      {/* --- Email Preview --- */}
      <div className="bg-[#FAFAFC] border border-[#E1E6F0] rounded mb-5 p-4">
        <h3 className="font-semibold mb-3 text-[15px]">Email Preview</h3>
        <textarea
          className="w-full border border-[#DDE1EB] px-3 py-2 rounded text-sm min-h-[80px] bg-white"
          value={
            data.emailPreview ||
            `Dear Supplier,\n\nYou are invited to participate in our upcoming reverse auction. This auction includes multiple LOTs covering various materials and components.\n\nPlease review the detailed specifications and submit your competitive bids within the auction timeline. All technical requirements and evaluation criteria are outlined in the attached documentation.\n\nBest regards,\nProcurement Team`
          }
          readOnly
        />
      </div>

      {/* --- Buttons --- */}
      <div className="flex justify-end gap-2 mt-6">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          type="button"
          onClick={() => setModalOpen(true)}
        >
          Launch Auction
        </button>
      </div>

      {/* --- Confirmation Modal --- */}
      <ConfirmLaunchModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={onSubmit}
      />
    </div>
  );
}
