'use client';

import { Supplier } from "./SupplierInvitationStep";

type Lot = {
  lotId?: string;
  hsCode?: string;
  productName?: string;
  material?: string;
  dimensions?: {
    l?: string;
    w?: string;
    h?: string;
  };
  prevCost?: string;
  lotCount?: number | string;
};

type ReviewAuctionData = {
  title?: string;
  description?: string;
  category?: string;
  reservePrice?: number | string;
  currency?: string;
  startTime?: string;
  endTime?: string;
  autoExtension?: boolean;
  extensionMinutes?: number;
  invitedSuppliers?: string[];
  previewEmail?: string;
  lots?: Lot[];
};

type ReviewLaunchStepProps = {
  data: ReviewAuctionData;
  onSubmit: () => void;
  suppliers: Supplier[];
};

const Card = ({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <section className={`bg-[#FAFAFC] border border-[#E1E6F0] rounded-2xl p-5 mb-6 ${className}`}>
    <h3 className="font-semibold mb-4 text-[15px] text-[#23272E]">{title}</h3>
    {children}
  </section>
);

const formatDimensions = (dims?: { l?: string; w?: string; h?: string }) => {
  if (!dims) return "-";
  const { l, w, h } = dims;
  const parts = [l, w, h];
  if (parts.every((v) => !v)) return "-";
  return `L${l || "-"} x W${w || "-"} x H${h || "-"}`;
};

export default function ReviewLaunchStep({ data, suppliers = [] }: ReviewLaunchStepProps) {
  const lotsToShow = (data.lots?.length ? data.lots : [
    {
      lotId: "-",
      hsCode: "-",
      productName: data.title || "-",
      material: "-",
      dimensions: { l: "-", w: "-", h: "-" },
      prevCost: "-",
    },
  ]) as Lot[];

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-[20px] font-semibold mb-3">Review &amp; Launch</h2>

      <Card title="Auction Information">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <div className="text-xs mb-1 text-gray-500">Auction title</div>
            <div className="border border-[#E1E6F0] rounded px-2 py-2 bg-white text-[15px]">
              {data.title || "-"}
            </div>
          </div>
          <div>
            <div className="text-xs mb-1 text-gray-500">Category</div>
            <div className="border border-[#E1E6F0] rounded px-2 py-2 bg-white text-[15px]">
              {data.category || "-"}
            </div>
          </div>
          <div>
            <div className="text-xs mb-1 text-gray-500">Reserve Price</div>
            <div className="border border-[#E1E6F0] rounded px-2 py-2 bg-white text-[15px]">
              {data.reservePrice ?? "-"}
            </div>
          </div>
          <div>
            <div className="text-xs mb-1 text-gray-500">Currency</div>
            <div className="border border-[#E1E6F0] rounded px-2 py-2 bg-white text-[15px]">
              {data.currency || "-"}
            </div>
          </div>
        </div>
      </Card>

      <Card title="LOT & Product Details">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border rounded-xl overflow-hidden">
            <thead className="bg-[#F4F6FA] text-gray-700">
              <tr>
                <th className="px-4 py-2 border-b font-medium">LOT ID</th>
                <th className="px-4 py-2 border-b font-medium">HS Code</th>
                <th className="px-4 py-2 border-b font-medium">Product Name</th>
                <th className="px-4 py-2 border-b font-medium">Material / Dimensions</th>
                <th className="px-4 py-2 border-b font-medium">Previous Cost</th>
                <th className="px-4 py-2 border-b font-medium">LOT Count</th>
              </tr>
            </thead>
            <tbody>
              {lotsToShow.map((lot, idx) => (
                <tr key={idx} className="bg-white even:bg-[#FAFAFC]">
                  <td className="px-4 py-2 border-b">{lot.lotId || "-"}</td>
                  <td className="px-4 py-2 border-b">{lot.hsCode || "-"}</td>
                  <td className="px-4 py-2 border-b">{lot.productName || "-"}</td>
                  <td className="px-4 py-2 border-b">
                    {lot.material || "-"}
                    {lot.material && lot.dimensions ? ", " : ""}
                    {formatDimensions(lot.dimensions)}
                  </td>
                  <td className="px-4 py-2 border-b">{lot.prevCost || "-"}</td>
                  <td className="px-4 py-2 border-b">{lot.lotCount ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Auction Settings">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <div className="text-xs mb-1 text-gray-500">Start Date &amp; Time</div>
            <div className="border border-[#E1E6F0] rounded px-2 py-2 bg-white text-[15px]">
              {data.startTime ? new Date(data.startTime).toLocaleString() : "-"}
            </div>
          </div>
          <div>
            <div className="text-xs mb-1 text-gray-500">End Date &amp; Time</div>
            <div className="border border-[#E1E6F0] rounded px-2 py-2 bg-white text-[15px]">
              {data.endTime ? new Date(data.endTime).toLocaleString() : "-"}
            </div>
          </div>
          <div>
            <div className="text-xs mb-1 text-gray-500">Auto Extension</div>
            <div className="border border-[#E1E6F0] rounded px-2 py-2 bg-white text-[15px]">
              {data.autoExtension ? "Enabled" : "Disabled"}
            </div>
          </div>
          <div>
            <div className="text-xs mb-1 text-gray-500">Extension Minutes</div>
            <div className="border border-[#E1E6F0] rounded px-2 py-2 bg-white text-[15px]">
              {data.extensionMinutes ?? "-"}
            </div>
          </div>
        </div>
      </Card>

      <Card title={`Invited Suppliers (${suppliers.length})`}>
  <div className="flex flex-wrap gap-2 mb-2">
    {suppliers.map((supplier) => (
      <span
        key={supplier._id}
        className="flex items-center gap-1 bg-white border border-[#E1E6F0] px-3 py-1 rounded-full text-[15px] text-[#222] shadow-sm"
      >
        {supplier.email}
      </span>
    ))}
  </div>
</Card>


      <Card title="Email Preview" className="mb-2">
        <textarea
          className="w-full border border-[#DDE1EB] px-3 py-2 rounded-xl text-[15px] min-h-[110px] bg-white"
          style={{ fontFamily: "inherit" }}
          value={
            data.previewEmail ||
            `Dear Supplier,

You are invited to participate in our upcoming reverse auction. This auction includes multiple LOTs covering various materials and components.

Please review the detailed specifications and submit your competitive bids within the auction timeline. All technical requirements and evaluation criteria are outlined in the attached documentation.

Best regards,
Procurement Team`
          }
          readOnly
        />
      </Card>
    </div>
  );
}
