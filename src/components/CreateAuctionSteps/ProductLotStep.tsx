type ProductLotData = {
  lotId?: string;
  hsCode?: string;
  productName?: string;
  materialType?: string;
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

  return (
    <div>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-semibold mb-1">Add product or LOT-level information</h2>
          <p className="text-sm text-[#5E5E65]">
            Enter key details for the products being auctioned
          </p>
        </div>
        <button
          onClick={() => alert('Add New LOT')}
          className="flex items-center gap-2 border border-[#DDE1EB] px-4 py-2 rounded text-sm text-[#383838] font-medium"
        >
          + New Lot
        </button>
      </div>

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
            <input
              type="text"
              placeholder="HS Code"
              className="w-full bg-white border border-[#DDE1EB] px-3 py-2 rounded text-sm"
              value={data.hsCode || ''}
              onChange={e => onChange({ hsCode: e.target.value })}
            />
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
              value={data.materialType || ''}
              onChange={e => onChange({ materialType: e.target.value })}
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
          <label className="block text-sm mb-1">LOT Count</label>
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
