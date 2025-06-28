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
    <div>
      {lots.map((lot, idx) => (
        <div key={idx} className="relative mb-8">
          <ProductLotStep
            data={lot}
            onChange={(data) => updateLot(idx, data)}
            showErrors={showErrors}
          />
          {lots.length > 1 && (
            <button
              type="button"
              className="absolute top-3 right-3 text-xs px-2 py-1 rounded bg-red-50 text-red-700 border border-red-200"
              onClick={() => removeLot(idx)}
            >
              Remove
            </button>
          )}
          {idx === lots.length - 1 && (
            <button
              onClick={addNewLot}
              type="button"
              className="flex items-center gap-2 border border-[#DDE1EB] px-4 py-2 rounded text-sm text-[#383838] font-medium mb-6"
            >
              + New Lot
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
