type AuctionDetailsData = {
  title?: string;
  type?: string;
  sapCode?: string;
  reservePrice?: number | string;
  currency?: string;
};

type AuctionDetailsStepProps = {
  data: AuctionDetailsData;
  onChange: (data: Partial<AuctionDetailsData>) => void;
  showErrors?: boolean;
};

export default function AuctionDetailsStep({
  data,
  onChange,
  showErrors,
}: AuctionDetailsStepProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Enter basic auction information</h2>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm mb-1">Title</label>
          <input
            type="text"
            placeholder="Auction Title"
            className={`w-full border px-3 py-2 rounded text-sm ${showErrors && !data.title ? 'border-red-500' : 'border-[#DDE1EB]'}`}
            value={data.title || ''}
            onChange={e => onChange({ title: e.target.value })}
          />
          {showErrors && !data.title && (
            <span className="text-xs text-red-500">Required</span>
          )}
        </div>
        <div>
          <label className="block text-sm mb-1">Auction Type</label>
          <input
            type="text"
            placeholder="Single LOTs / Multiple LOTs"
            className={`w-full border px-3 py-2 rounded text-sm ${showErrors && !data.type ? 'border-red-500' : 'border-[#DDE1EB]'}`}
            value={data.type || ''}
            onChange={e => onChange({ type: e.target.value })}
          />
          {showErrors && !data.type && (
            <span className="text-xs text-red-500">Required</span>
          )}
        </div>
        <div>
          <label className="block text-sm mb-1">SAP Code</label>
          <input
            type="text"
            placeholder="SAP Code"
            className={`w-full border px-3 py-2 rounded text-sm ${showErrors && !data.sapCode ? 'border-red-500' : 'border-[#DDE1EB]'}`}
            value={data.sapCode || ''}
            onChange={e => onChange({ sapCode: e.target.value })}
          />
          {showErrors && !data.sapCode && (
            <span className="text-xs text-red-500">Required</span>
          )}
        </div>
        <div>
          <label className="block text-sm mb-1">Reserve Price</label>
          <input
            type="number"
            placeholder="Reserve Price"
            className={`w-full border px-3 py-2 rounded text-sm ${showErrors && !data.reservePrice ? 'border-red-500' : 'border-[#DDE1EB]'}`}
            value={data.reservePrice || ''}
            onChange={e => onChange({ reservePrice: e.target.value })}
          />
          {showErrors && !data.reservePrice && (
            <span className="text-xs text-red-500">Required</span>
          )}
        </div>
        <div>
          <label className="block text-sm mb-1">Currency</label>
          <input
            type="text"
            placeholder="Currency (e.g. GBP)"
            className={`w-full border px-3 py-2 rounded text-sm ${showErrors && !data.currency ? 'border-red-500' : 'border-[#DDE1EB]'}`}
            value={data.currency || ''}
            onChange={e => onChange({ currency: e.target.value })}
          />
          {showErrors && !data.currency && (
            <span className="text-xs text-red-500">Required</span>
          )}
        </div>
      </div>
    </div>
  );
}
