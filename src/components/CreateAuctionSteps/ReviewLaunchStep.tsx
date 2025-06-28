'use client';

// Types
type ReviewAuctionData = {
  title?: string;
  sapCode?: string;
  type?: string;
  productName?: string;
  lots?: {
    lotId?: string;
    hsCode?: string;
    productName?: string;
    material?: string;
    dimensions?: {
      l?: string;
      w?: string;
      h?: string;
    };
    prevCost?: string | number;
  }[];
  startTime?: string;
  endTime?: string;
  autoExtension?: boolean;
  allowPause?: boolean;
  suppliers?: string[];
  emailPreview?: string;
};

type ReviewLaunchStepProps = {
  data: ReviewAuctionData;
  onSubmit: () => void;
};

// Card Container
const Card = ({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) => (
  <section className={`bg-[#FAFAFC] border border-[#E1E6F0] rounded-2xl p-5 mb-6 ${className}`}>
    <h3 className="font-semibold mb-4 text-[15px] text-[#23272E]">{title}</h3>
    {children}
  </section>
);

// Format dimensions object
const formatDimensions = (dims?: { l?: string; w?: string; h?: string }) => {
  if (!dims) return '-';
  const { l, w, h } = dims;
  const filled = [l, w, h].filter(Boolean);
  return filled.length > 0 ? `L${l || '-'} x W${w || '-'} x H${h || '-'}` : '-';
};

export default function ReviewLaunchStep({ data }: ReviewLaunchStepProps) {
  const displayLots = data.lots && data.lots.length > 0
    ? data.lots
    : [{
        lotId: '-',
        hsCode: '-',
        productName: data.productName || '-',
        material: '-',
        dimensions: { l: '-', w: '-', h: '-' },
        prevCost: '-'
      }];

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-[20px] font-semibold mb-3">Review &amp; Launch</h2>

      {/* --- Auction Information --- */}
      <Card title="Auction Information">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <div className="text-xs mb-1 text-gray-500">Auction title</div>
            <div className="border border-[#E1E6F0] rounded px-2 py-2 bg-white text-[15px]">{data.title || "-"}</div>
          </div>
          <div>
            <div className="text-xs mb-1 text-gray-500">SAP Code</div>
            <div className="border border-[#E1E6F0] rounded px-2 py-2 bg-white text-[15px]">{data.sapCode || "-"}</div>
          </div>
          <div>
            <div className="text-xs mb-1 text-gray-500">Auction Type</div>
            <div className="border border-[#E1E6F0] rounded px-2 py-2 bg-white text-[15px]">{data.type || "-"}</div>
          </div>
        </div>
      </Card>

      {/* --- LOT & Product Details --- */}
      <Card title="LOT & Product Details">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border rounded-xl overflow-hidden">
            <thead className="bg-[#F4F6FA] text-gray-700">
              <tr>
                <th className="px-4 py-2 border-b font-medium">LOT ID</th>
                <th className="px-4 py-2 border-b font-medium">HS Code</th>
                <th className="px-4 py-2 border-b font-medium">Product Name</th>
                <th className="px-4 py-2 border-b font-medium">Material / Dimensions</th>
                <th className="px-4 py-2 border-b font-medium">Previous landed cost</th>
              </tr>
            </thead>
            <tbody>
              {displayLots.map((lot, i) => (
                <tr key={i} className="bg-white even:bg-[#FAFAFC]">
                  <td className="px-4 py-2 border-b">{lot.lotId || '-'}</td>
                  <td className="px-4 py-2 border-b">{lot.hsCode || '-'}</td>
                  <td className="px-4 py-2 border-b">{lot.productName || '-'}</td>
                  <td className="px-4 py-2 border-b">
                    {lot.material || '-'}
                    {lot.material && lot.dimensions ? ', ' : ''}
                    {formatDimensions(lot.dimensions)}
                  </td>
                  <td className="px-4 py-2 border-b">{lot.prevCost || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* --- Auction Settings --- */}
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
            <div className="text-xs mb-1 text-gray-500">Auto-Extension Rules</div>
            <div className="border border-[#E1E6F0] rounded px-2 py-2 bg-white text-[15px]">
              {data.autoExtension ? "Enabled" : "Disabled"}
            </div>
          </div>
          <div>
            <div className="text-xs mb-1 text-gray-500">Allow pause/resume live auction</div>
            <div className="border border-[#E1E6F0] rounded px-2 py-2 bg-white text-[15px]">
              {data.allowPause ? "Enabled" : "Disabled"}
            </div>
          </div>
        </div>
      </Card>

      {/* --- Invited suppliers --- */}
      <Card title={`Invited suppliers (${(data.suppliers || []).length})`} className="mb-4">
        <div className="flex flex-wrap gap-2 mb-2">
          {(data.suppliers || []).map((email, idx) => (
            <span
              key={idx}
              className="flex items-center gap-1 bg-white border border-[#E1E6F0] px-3 py-1 rounded-full text-[15px] text-[#222] shadow-sm"
            >
              <span>{email}</span>
            </span>
          ))}
        </div>
      </Card>

      {/* --- Email Preview --- */}
      <Card title="Email Preview" className="mb-2">
        <textarea
          className="w-full border border-[#DDE1EB] px-3 py-2 rounded-xl text-[15px] min-h-[110px] bg-white"
          style={{ fontFamily: "inherit" }}
          value={
            data.emailPreview ||
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
