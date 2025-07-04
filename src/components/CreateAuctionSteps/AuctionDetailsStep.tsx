import { ChevronDown, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

const CURRENCIES = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "INR", name: "Indian Rupee" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "CHF", name: "Swiss Franc" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "HKD", name: "Hong Kong Dollar" },
  { code: "ZAR", name: "South African Rand" },
  { code: "AED", name: "UAE Dirham" },
  { code: "SAR", name: "Saudi Riyal" },
  { code: "BRL", name: "Brazilian Real" },
  { code: "RUB", name: "Russian Ruble" },
  { code: "KRW", name: "South Korean Won" },
  { code: "MXN", name: "Mexican Peso" },
  { code: "SEK", name: "Swedish Krona" },
  { code: "NOK", name: "Norwegian Krone" },
];

const AUCTION_TYPES = [
  { value: "Single Lot", label: "Single Lot" },
  { value: "Multi Lot", label: "Multi Lot" },
];

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

        {/* Title */}
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

        {/* Auction Type Dropdown */}
        <div>
          <label className="block text-sm mb-1">Auction Type</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
      variant="outline"
      className={`w-full justify-between text-left flex items-center ${
        showErrors && !data.type ? 'border-red-500' : ''
      }`}
    >
      <span>{data.type || "Select Auction Type"}</span>
      <ChevronDown className="ml-2 w-4 h-4 text-muted-foreground" />
    </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full min-w-[180px]" align="start">
              <DropdownMenuGroup>
                {AUCTION_TYPES.map((type) => (
                  <DropdownMenuItem
                    key={type.value}
                    onClick={() => onChange({ type: type.value })}
                  >
                    {type.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          {showErrors && !data.type && (
            <span className="text-xs text-red-500">Required</span>
          )}
        </div>

        {/* SAP Codes Input */}
        <div>
          <label className="block text-sm mb-1">SAP Code(s)</label>
          <div className="relative">
            <input
              type="text"
              placeholder="SAP Code"
              className={`w-full border px-3 py-2 rounded text-sm pr-9 ${
                showErrors && (!data.sapCodes || data.sapCodes.length === 0)
                  ? 'border-red-500'
                  : 'border-[#DDE1EB]'
              }`}
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

        {/* Reserve Price */}
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

        {/* Currency Dropdown */}
        <div>
          <label className="block text-sm mb-1">Currency</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
      variant="outline"
      className={`w-full justify-between text-left flex items-center ${
        showErrors && !data.currency ? 'border-red-500' : ''
      }`}
    >
      <span>
        {data.currency
          ? `${data.currency} – ${CURRENCIES.find((c) => c.code === data.currency)?.name || ""}`
          : "Select Currency"}
      </span>
      <ChevronDown className="ml-2 w-4 h-4 text-muted-foreground" />
    </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full min-w-[180px]" align="start">
              <DropdownMenuGroup>
                {CURRENCIES.map((cur) => (
                  <DropdownMenuItem
                    key={cur.code}
                    onClick={() => onChange({ currency: cur.code })}
                  >
                    {cur.code} – {cur.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          {showErrors && !data.currency && (
            <span className="text-xs text-red-500">Required</span>
          )}
        </div>

        {/* Category */}
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

        {/* Description */}
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
