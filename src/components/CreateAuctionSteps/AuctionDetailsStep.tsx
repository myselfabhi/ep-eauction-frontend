import { Plus } from "lucide-react";
import { useState } from "react";

type AuctionDetailsData = {
  title?: string;
  type?: string;
  sapCodes?: string[];
  reservePrice?: number | string;
  currency?: string;
  description?: string;
  category?: string;
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
  const [sapInput, setSapInput] = useState('');

  const addSapCode = () => {
    const trimmed = sapInput.trim();
    if (
      trimmed.length > 0 &&
      !(data.sapCodes || []).includes(trimmed)
    ) {
      onChange({ sapCodes: [...(data.sapCodes || []), trimmed] });
      setSapInput('');
    }
  };
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Enter basic auction information</h2>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm mb-1">Title</label>
          <input
            type="text"
            placeholder="Auction Title"
            className={`w-full border px-3 py-2 rounded text-sm ${
              showErrors && !data.title ? 'border-red-500' : 'border-[#DDE1EB]'
            }`}
            value={data.title || ''}
            onChange={(e) => onChange({ title: e.target.value })}
          />
          {showErrors && !data.title && (
            <span className="text-xs text-red-500">Required</span>
          )}
        </div>

        <div>
  <label className="block text-sm mb-1">Auction Type</label>
  <select
    className={`w-full border px-3 py-2 bg-white rounded text-sm ${
      showErrors && !data.type ? 'border-red-500' : 'border-[#DDE1EB]'
    }`}
    value={data.type || ''}
    onChange={e => onChange({ type: e.target.value })}
  >
    <option value="">Select Auction Type</option>
    <option value="Single Lot">Single Lot</option>
    <option value="Multi Lot">Multi Lot</option>
  </select>
  {showErrors && !data.type && (
    <span className="text-xs text-red-500">Required</span>
  )}
</div>


        <div>
      <label className="block text-sm mb-1">SAP Code(s)</label>
      <div className="relative">
        <input
          type="text"
          placeholder="SAP Code"
          className={`w-full border px-3 py-2 rounded text-sm pr-9 ${showErrors && (!data.sapCodes || data.sapCodes.length === 0) ? 'border-red-500' : 'border-[#DDE1EB]'}`}
          value={sapInput}
          onChange={e => setSapInput(e.target.value)}
          onKeyDown={e => {
            if ((e.key === 'Enter' || e.key === ',') && sapInput.trim()) {
              e.preventDefault();
              addSapCode();
            }
          }}
        />
        <button
          type="button"
          className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={addSapCode}
          disabled={!sapInput.trim() || (data.sapCodes || []).includes(sapInput.trim())}
          title="Add SAP Code"
          tabIndex={-1}
        >
          <Plus size={16} />
        </button>
      </div>
      {/* Chips for added SAP Codes */}
      {data.sapCodes && data.sapCodes.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {data.sapCodes.map(code => (
            <span
              key={code}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-300 text-xs"
            >
              {code}
              <button
                type="button"
                className="ml-1 text-blue-700 hover:text-red-600"
                onClick={() => onChange({ sapCodes: data.sapCodes!.filter(c => c !== code) })}
                aria-label={`Remove ${code}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      {showErrors && (!data.sapCodes || data.sapCodes.length === 0) && (
        <span className="text-xs text-red-500">Required</span>
      )}
    </div>


        <div>
          <label className="block text-sm mb-1">Reserve Price</label>
          <input
            type="number"
            placeholder="Reserve Price"
            className={`w-full border px-3 py-2 rounded text-sm ${
              showErrors && !data.reservePrice ? 'border-red-500' : 'border-[#DDE1EB]'
            }`}
            value={data.reservePrice || ''}
            onChange={(e) => onChange({ reservePrice: e.target.value })}
          />
          {showErrors && !data.reservePrice && (
            <span className="text-xs text-red-500">Required</span>
          )}
        </div>

        <div>
  <label className="block text-sm mb-1">Currency</label>
  <select
    className={`w-full border px-3 py-2 rounded text-sm bg-white ${
      showErrors && !data.currency ? 'border-red-500' : 'border-[#DDE1EB]'
    }`}
    value={data.currency || ''}
    onChange={e => onChange({ currency: e.target.value })}
  >
    <option value=""></option>
    <option value="USD">USD – US Dollar</option>
    <option value="EUR">EUR – Euro</option>
    <option value="GBP">GBP – British Pound</option>
    <option value="INR">INR – Indian Rupee</option>
    <option value="JPY">JPY – Japanese Yen</option>
    <option value="AUD">AUD – Australian Dollar</option>
    <option value="CAD">CAD – Canadian Dollar</option>
    <option value="CHF">CHF – Swiss Franc</option>
    <option value="CNY">CNY – Chinese Yuan</option>
    <option value="SGD">SGD – Singapore Dollar</option>
    <option value="HKD">HKD – Hong Kong Dollar</option>
    <option value="ZAR">ZAR – South African Rand</option>
    <option value="AED">AED – UAE Dirham</option>
    <option value="SAR">SAR – Saudi Riyal</option>
    <option value="BRL">BRL – Brazilian Real</option>
    <option value="RUB">RUB – Russian Ruble</option>
    <option value="KRW">KRW – South Korean Won</option>
    <option value="MXN">MXN – Mexican Peso</option>
    <option value="SEK">SEK – Swedish Krona</option>
    <option value="NOK">NOK – Norwegian Krone</option>
    {/* Add or remove currencies as per your needs */}
  </select>
  {showErrors && !data.currency && (
    <span className="text-xs text-red-500">Required</span>
  )}
</div>


        <div>
          <label className="block text-sm mb-1">Category</label>
          <input
            type="text"
            placeholder="Auction Category"
            className={`w-full border px-3 py-2 rounded text-sm ${
              showErrors && !data.category ? 'border-red-500' : 'border-[#DDE1EB]'
            }`}
            value={data.category || ''}
            onChange={(e) => onChange({ category: e.target.value })}
          />
          {showErrors && !data.category && (
            <span className="text-xs text-red-500">Required</span>
          )}
        </div>

        <div className="col-span-2">
          <label className="block text-sm mb-1">Description</label>
          <textarea
            placeholder="Describe the auction"
            rows={3}
            className={`w-full border px-3 py-2 rounded text-sm ${
              showErrors && !data.description ? 'border-red-500' : 'border-[#DDE1EB]'
            }`}
            value={data.description || ''}
            onChange={(e) => onChange({ description: e.target.value })}
          />
          {showErrors && !data.description && (
            <span className="text-xs text-red-500">Required</span>
          )}
        </div>
      </div>
    </div>
  );
}
