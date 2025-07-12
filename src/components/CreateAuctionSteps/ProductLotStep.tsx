import { useState } from "react";

type ProductLotData = {
  lotId?: string;
  hsCode?: string;
  productName?: string;
  material?: string;
  prevCost?: string;
  dimensions?: { l?: string; w?: string; h?: string };
  lotCount?: number | string;
};

type Product = {
  _id: string;
  name: string;
  hsCode?: string;
};

type ProductLotStepProps = {
  data: ProductLotData;
  onChange: (data: Partial<ProductLotData>) => void;
  showErrors?: boolean;
  disableLotId?: boolean;
  onLotIdBlur?: (newLotId: string) => void;
  importProducts: Product[];
  setImportProducts: (products: Product[]) => void;
};

export default function ProductLotStep({
  data,
  onChange,
  showErrors,
  disableLotId = false,
  onLotIdBlur,
  importProducts = [],
  setImportProducts,
}: ProductLotStepProps) {
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [customProductName, setCustomProductName] = useState("");
  const [saving, setSaving] = useState(false);

  const handleDimensionChange = (dim: "l" | "w" | "h", value: string) => {
    onChange({
      dimensions: { ...data.dimensions, [dim]: value },
    });
  };

  const confirmCustomProduct = async () => {
    if (!customProductName.trim()) return;

    try {
      setSaving(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/import-duty/product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: customProductName.trim() }),
      });

      if (!res.ok) throw new Error("Failed to add product");

      // Refresh product list
      const updatedRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/import-duty/products`);
      const updatedData = await updatedRes.json();
      if (Array.isArray(updatedData)) {
        setImportProducts(updatedData);
      }

      setCustomModalOpen(false);
      setCustomProductName("");
      setConfirmationModalOpen(true); // ✅ Show confirmation modal
    } catch (err) {
      alert("Failed to add product to Import Duty Matrix");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="bg-[#F9FAFB] border border-[#EAECF0] rounded p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* LOT ID */}
          <div>
            <label className="block text-sm mb-1">LOT ID / Product ID</label>
            <input
              type="text"
              placeholder="LOT ID / Product ID"
              className="w-full bg-white border border-[#DDE1EB] px-3 py-2 rounded text-sm"
              value={data.lotId || ""}
              onChange={(e) =>
                disableLotId ? undefined : onChange({ lotId: e.target.value })
              }
              onBlur={(e) =>
                disableLotId || !onLotIdBlur
                  ? undefined
                  : onLotIdBlur(e.target.value)
              }
              disabled={disableLotId}
            />
          </div>

          {/* HS Code */}
          <div>
            <label className="block text-sm mb-1">HS Code</label>
            <select
              className="w-full bg-white border border-[#DDE1EB] px-3 py-2 rounded text-sm"
              value={data.hsCode || ""}
              onChange={(e) => onChange({ hsCode: e.target.value })}
            >
              <option value="">Select HS Code</option>
              {/* You can map HS codes here if needed */}
            </select>
          </div>

          {/* Product Name Dropdown */}
          <div>
            <label className="block text-sm mb-1">Product Name</label>
            <select
              className={`w-full bg-white border px-3 py-2 rounded text-sm ${
                showErrors && !data.productName ? "border-red-500" : "border-[#DDE1EB]"
              }`}
              value={data.productName || ""}
              onChange={(e) => {
                if (e.target.value === "__add_other__") {
                  setCustomModalOpen(true);
                } else {
                  onChange({ productName: e.target.value });
                }
              }}
            >
              <option value="">Select Product</option>
              {importProducts.map((p) => (
                <option key={p._id} value={p.name}>
                  {p.name} {p.hsCode ? `(${p.hsCode})` : ""}
                </option>
              ))}
              <option value="__add_other__">+ Add Other</option>
            </select>
            {showErrors && !data.productName && (
              <span className="text-xs text-red-500">Required</span>
            )}
          </div>

          {/* Material */}
          <div>
            <label className="block text-sm mb-1">Material Type</label>
            <input
              type="text"
              placeholder="Material Type"
              className="w-full bg-white border border-[#DDE1EB] px-3 py-2 rounded text-sm"
              value={data.material || ""}
              onChange={(e) => onChange({ material: e.target.value })}
            />
          </div>

          {/* Previous Cost */}
          <div className="col-span-2">
            <label className="block text-sm mb-1">Previous Landed Cost</label>
            <input
              type="text"
              placeholder="Previous Landed Cost"
              className="w-full bg-white border border-[#DDE1EB] px-3 py-2 rounded text-sm"
              value={data.prevCost || ""}
              onChange={(e) => onChange({ prevCost: e.target.value })}
            />
          </div>
        </div>

        {/* Dimensions */}
        <div className="mt-4">
          <label className="block text-sm mb-1">Dimensions</label>
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="L"
              className="w-full bg-white border border-[#DDE1EB] px-3 py-2 rounded text-sm"
              value={data.dimensions?.l || ""}
              onChange={(e) => handleDimensionChange("l", e.target.value)}
            />
            <input
              type="text"
              placeholder="W"
              className="w-full bg-white border border-[#DDE1EB] px-3 py-2 rounded text-sm"
              value={data.dimensions?.w || ""}
              onChange={(e) => handleDimensionChange("w", e.target.value)}
            />
            <input
              type="text"
              placeholder="H"
              className="w-full bg-white border border-[#DDE1EB] px-3 py-2 rounded text-sm"
              value={data.dimensions?.h || ""}
              onChange={(e) => handleDimensionChange("h", e.target.value)}
            />
          </div>
        </div>

        {/* Volume */}
        <div>
          <label className="block text-sm mb-1">Volume</label>
          <input
            type="number"
            placeholder="Number of LOTs"
            className={`w-full border px-3 py-2 rounded text-sm ${
              showErrors && !data.lotCount ? "border-red-500" : "border-[#DDE1EB]"
            }`}
            value={data.lotCount || ""}
            onChange={(e) => onChange({ lotCount: e.target.value })}
          />
          {showErrors && !data.lotCount && (
            <span className="text-xs text-red-500">Required</span>
          )}
        </div>
      </div>

      {/* Modal for adding custom product */}
      {customModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Add Custom Product</h2>
            <input
              type="text"
              value={customProductName}
              onChange={(e) => setCustomProductName(e.target.value)}
              placeholder="Enter product name"
              className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setCustomModalOpen(false);
                  setCustomProductName("");
                }}
                className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmCustomProduct}
                disabled={saving}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
              >
                {saving ? "Saving..." : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Confirmation modal after adding product */}
      {confirmationModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-2">Product Added</h2>
            <p className="text-sm text-gray-700 mb-4">
              Your product has been added successfully. Please select it from the dropdown.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setConfirmationModalOpen(false)}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
