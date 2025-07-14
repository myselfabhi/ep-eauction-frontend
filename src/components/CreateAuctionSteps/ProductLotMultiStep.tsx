import ProductLotStep from "./ProductLotStep";

type ProductLotData = {
  lotId?: string;
  hsCode?: string;
  productName?: string;
  material?: string;
  volume?: string;
  prevCost?: string;
  dimensions?: { l?: string; w?: string; h?: string };
  lotCount?: number | string;
};

type Product = {
  _id: string;
  name: string;
  hsCode?: string;
};

export default function ProductLotMultiStep({
  value,
  onChange,
  showErrors,
  auctionType, // 'single' | 'multi'
  importProducts = [],
  setImportProducts, // ✅ add this!
}: {
  value: ProductLotData[];
  onChange: (lots: ProductLotData[]) => void;
  showErrors?: boolean;
  auctionType: "single" | "multi";
  importProducts: Product[];
  setImportProducts: (products: Product[]) => void; // ✅ declare type
}) {
  const lots = value && value.length ? value : [{}];

  const updateLot = (index: number, data: Partial<ProductLotData>) => {
    const newLots = lots.map((lot, i) => (i === index ? { ...lot, ...data } : lot));
    onChange(newLots);
  };

  const addNewProduct = (lotId: string, groupIndex: number) => {
    const actualLotId = lotId || `__group${groupIndex}`;
    onChange([...lots, { lotId: actualLotId }]);
  };

  const addNewLot = () => {
    onChange([...lots, { lotId: "" }]);
  };

  const removeLot = (index: number) => {
    if (lots.length > 1) {
      onChange(lots.filter((_, i) => i !== index));
    }
  };

  const isFirstOfLot = (lotId: string | undefined, index: number) =>
    lots.findIndex((lot) => lot.lotId === lotId) === index;

  const handleLotIdBlur = (index: number, newLotId: string) => {
    const oldLotId = lots[index]?.lotId || `__group${index}`;
    const updatedLots = lots.map((lot, i) => {
      const lotGroupId = lot.lotId || `__group${i}`;
      if (auctionType === "single") {
        return { ...lot, lotId: newLotId };
      } else if (lotGroupId === oldLotId) {
        return { ...lot, lotId: newLotId };
      }
      return lot;
    });
    onChange(updatedLots);
  };

  return (
    <div className="space-y-8">
      {lots.map((lot, idx) => {
        const disableLotId =
          auctionType === "single" ? idx !== 0 : !isFirstOfLot(lot.lotId, idx);

        return (
          <div
            key={idx}
            className="relative border border-[#EAECF0] rounded-lg p-4 bg-[#FAFAFC] shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-semibold mb-1">
                  {auctionType === "single"
                    ? "Product"
                    : `LOT: ${lot.lotId || "(unnamed)"}`}
                </h2>
                <p className="text-sm text-[#5E5E65]">
                  {auctionType === "single"
                    ? "Add multiple products under fixed LOT"
                    : "Add products and manage lot-level details"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="border border-[#DDE1EB] px-3 py-1 rounded text-xs text-[#383838] font-medium hover:bg-green-50 hover:text-green-600 transition"
                  onClick={() => addNewProduct(lot.lotId || "", idx)}
                >
                  + New Product
                </button>
                {auctionType === "multi" && (
                  <button
                    type="button"
                    className="border border-[#DDE1EB] px-3 py-1 rounded text-xs text-[#383838] font-medium hover:bg-blue-50 hover:text-blue-600 transition"
                    onClick={addNewLot}
                  >
                    + New Lot
                  </button>
                )}
                {lots.length > 1 && (
                  <button
                    type="button"
                    className="border border-[#DDE1EB] px-3 py-1 rounded text-xs text-[#383838] font-medium hover:bg-red-50 hover:text-red-600 transition"
                    onClick={() => removeLot(idx)}
                  >
                    ✕ Remove
                  </button>
                )}
              </div>
            </div>

            <ProductLotStep
              data={lot}
              onChange={(data) => updateLot(idx, data)}
              showErrors={showErrors}
              disableLotId={disableLotId}
              onLotIdBlur={(newLotId) => handleLotIdBlur(idx, newLotId || "")}
              importProducts={importProducts}
              setImportProducts={setImportProducts} // ✅ pass it down
            />
          </div>
        );
      })}
    </div>
  );
}
