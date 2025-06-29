import ProductLotStep from "./ProductLotStep";

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

export default function ProductLotMultiStep({
  value,
  onChange,
  showErrors,
}: {
  value: ProductLotData[];
  onChange: (lots: ProductLotData[]) => void;
  showErrors?: boolean;
}) {
  const lots = value && value.length ? value : [{}];

  const updateLot = (index: number, data: Partial<ProductLotData>) => {
    const newLots = lots.map((lot, i) => (i === index ? { ...lot, ...data } : lot));
    onChange(newLots);
  };

  const addNewLot = () => {
    onChange([...lots, {}]);
  };

  const removeLot = (index: number) => {
    if (lots.length > 1) {
      onChange(lots.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-8">
      {lots.map((lot, idx) => (
        <div
          key={idx}
          className="relative border border-[#EAECF0] rounded-lg p-4 bg-[#FAFAFC] shadow-sm"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-semibold mb-1">
                Add product or LOT-level information
              </h2>
              <p className="text-sm text-[#5E5E65]">
                Enter key details for the products being auctioned
              </p>
            </div>
            {lots.length > 1 && (
              <button
                type="button"
                className="border border-[#DDE1EB] px-4 py-2 rounded text-sm text-[#383838] font-medium hover:bg-red-50 hover:text-red-600 transition"
                onClick={() => removeLot(idx)}
              >
                ✕ Remove
              </button>
            )}
          </div>

          <ProductLotStep
            data={lot}
            onChange={(data) => updateLot(idx, data)}
            showErrors={showErrors}
          />
        </div>
      ))}

      <div className="flex justify-center">
        <button
          onClick={addNewLot}
          type="button"
          className="flex items-center gap-2 border border-[#DDE1EB] px-5 py-2 rounded text-sm text-[#383838] font-medium hover:bg-[#f9fafb] transition"
        >
          + New Lot
        </button>
      </div>
    </div>
  );
}
