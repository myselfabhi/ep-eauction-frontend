type ProductLotData = {
  lotId?: string;
  hsCode?: string;
  productName?: string;
  material?: string;
  prevCost?: string;
  dimensions?: {
    l?: string;
    w?: string;
    h?: string;
  };
  lotCount?: number | string;
};

type ProductLotStepProps = {
  data: ProductLotData;
  onChange: (data: Partial<ProductLotData>) => void;
  showErrors?: boolean;
};

export default function ProductLotStep({ data, onChange, showErrors }: ProductLotStepProps) {
  const handleDimensionChange = (dim: "l" | "w" | "h", value: string) => {
    onChange({
      dimensions: { ...data.dimensions, [dim]: value }
    });
  };

  const hsCodeOptions = [
  { code: "390110", label: "390110 – Polyethylene (PE)" },
  { code: "390120", label: "390120 – Polypropylene (PP)" },
  { code: "271019", label: "271019 – Light Oils & Preparations" },
  { code: "730890", label: "730890 – Iron/Steel Structures" },
  { code: "847130", label: "847130 – Portable Digital Computers" },
  { code: "870322", label: "870322 – Motor Cars, 1500-3000cc" },
  { code: "870899", label: "870899 – Auto Parts" },
  // ...add as many as you like
];
  return (
    <div>
      <div className="bg-[#F9FAFB] border border-[#EAECF0] rounded p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">LOT ID / Product ID</label>
            <input
              type="text"
              placeholder="LOT ID / Product ID"
              className="w-full bg-white border border-[#DDE1EB] px-3 py-2 rounded text-sm"
              value={data.lotId || ''}
              onChange={e => onChange({ lotId: e.target.value })}
            />
          </div>

          <div>
  <label className="block text-sm mb-1">HS Code</label>
  <select
    className="w-full bg-white border border-[#DDE1EB] px-3 py-2 rounded text-sm"
    value={data.hsCode || ''}
    onChange={e => onChange({ hsCode: e.target.value })}
  >
    <option value="">Select HS Code</option>
    {hsCodeOptions.map(opt => (
      <option key={opt.code} value={opt.code}>
        {opt.label}
      </option>
    ))}
  </select>
</div>

          <div>
            <label className="block text-sm mb-1">Product Name</label>
            <input
              type="text"
              placeholder="Product Name"
              className={`w-full bg-white border px-3 py-2 rounded text-sm ${showErrors && !data.productName ? 'border-red-500' : 'border-[#DDE1EB]'}`}
              value={data.productName || ''}
              onChange={e => onChange({ productName: e.target.value })}
            />
            {showErrors && !data.productName && (
              <span className="text-xs text-red-500">Required</span>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">Material Type</label>
            <input
              type="text"
              placeholder="Material Type"
              className="w-full bg-white border border-[#DDE1EB] px-3 py-2 rounded text-sm"
              value={data.material || ''}
              onChange={e => onChange({ material: e.target.value })}
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm mb-1">Previous landed cost</label>
            <input
              type="text"
              placeholder="Previous landed cost"
              className="w-full bg-white border border-[#DDE1EB] px-3 py-2 rounded text-sm"
              value={data.prevCost || ''}
              onChange={e => onChange({ prevCost: e.target.value })}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm mb-1">Dimensions</label>
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="L"
              className="w-full bg-white border border-[#DDE1EB] px-3 py-2 rounded text-sm"
              value={data.dimensions?.l || ''}
              onChange={e => handleDimensionChange('l', e.target.value)}
            />
            <input
              type="text"
              placeholder="W"
              className="w-full bg-white border border-[#DDE1EB] px-3 py-2 rounded text-sm"
              value={data.dimensions?.w || ''}
              onChange={e => handleDimensionChange('w', e.target.value)}
            />
            <input
              type="text"
              placeholder="H"
              className="w-full bg-white border border-[#DDE1EB] px-3 py-2 rounded text-sm"
              value={data.dimensions?.h || ''}
              onChange={e => handleDimensionChange('h', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Volume</label>
          <input
            type="number"
            placeholder="Number of LOTs"
            className={`w-full border px-3 py-2 rounded text-sm ${showErrors && !data.lotCount ? 'border-red-500' : 'border-[#DDE1EB]'}`}
            value={data.lotCount || ''}
            onChange={e => onChange({ lotCount: e.target.value })}
          />
          {showErrors && !data.lotCount && (
            <span className="text-xs text-red-500">Required</span>
          )}
        </div>
      </div>
    </div>
  );
}
