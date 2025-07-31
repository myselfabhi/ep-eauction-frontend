import { useState } from "react";
import { dutyService } from "@/services";

type ProductLotData = {
  lotId?: string;
  hsCode?: string;
  productName?: string;
  material?: string;
  volume?: string;
  volumeUnit?: string;
  prevCost?: string;
  dimensions?: { l?: string; w?: string; h?: string };
  dimensionUnit?: string;
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

// Validation constants
const VALIDATION_RULES = {
  lotId: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[A-Za-z0-9\-_]+$/, // Letters, numbers, hyphens, underscores
  },
  hsCode: {
    minLength: 4,
    maxLength: 12,
    pattern: /^[0-9]+$/, // Only numbers
  },
  productName: {
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s\-_.,()]+$/, // Letters, numbers, spaces, hyphens, underscores, dots, commas, parentheses
  },
  material: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9\s\-_]+$/, // Letters, numbers, spaces, hyphens, underscores
  },
  volume: {
    min: 0.01,
    max: 999999.99,
    decimalPlaces: 2,
  },
  prevCost: {
    min: 0,
    max: 999999999.99,
    decimalPlaces: 2,
  },
  dimensions: {
    min: 0,
    max: 999999.99,
    decimalPlaces: 2,
  },
  lotCount: {
    min: 1,
    max: 999999,
  },
};

const VOLUME_UNITS = [
  { value: "kg", label: "Kilograms (kg)" },
  { value: "g", label: "Grams (g)" },
  { value: "l", label: "Liters (l)" },
  { value: "ml", label: "Milliliters (ml)" },
  { value: "m3", label: "Cubic Meters (m³)" },
  { value: "cm3", label: "Cubic Centimeters (cm³)" },
  { value: "pcs", label: "Pieces (pcs)" },
  { value: "units", label: "Units" },
  { value: "boxes", label: "Boxes" },
  { value: "pallets", label: "Pallets" },
  { value: "tons", label: "Tons" },
  { value: "lbs", label: "Pounds (lbs)" },
];

// Validation functions
const validateLotId = (lotId: string): string | null => {
  if (!lotId) return null; // LOT ID is optional
  if (lotId.length < VALIDATION_RULES.lotId.minLength) 
    return `LOT ID must be at least ${VALIDATION_RULES.lotId.minLength} characters`;
  if (lotId.length > VALIDATION_RULES.lotId.maxLength) 
    return `LOT ID must be no more than ${VALIDATION_RULES.lotId.maxLength} characters`;
  if (!VALIDATION_RULES.lotId.pattern.test(lotId)) 
    return "LOT ID can only contain letters, numbers, hyphens, and underscores";
  return null;
};

const validateHsCode = (hsCode: string): string | null => {
  if (!hsCode) return null; // HS Code is optional
  if (hsCode.length < VALIDATION_RULES.hsCode.minLength) 
    return `HS Code must be at least ${VALIDATION_RULES.hsCode.minLength} digits`;
  if (hsCode.length > VALIDATION_RULES.hsCode.maxLength) 
    return `HS Code must be no more than ${VALIDATION_RULES.hsCode.maxLength} digits`;
  if (!VALIDATION_RULES.hsCode.pattern.test(hsCode)) 
    return "HS Code can only contain numbers";
  return null;
};

const validateProductName = (productName: string): string | null => {
  if (!productName) return "Product name is required";
  if (productName.length < VALIDATION_RULES.productName.minLength) 
    return `Product name must be at least ${VALIDATION_RULES.productName.minLength} characters`;
  if (productName.length > VALIDATION_RULES.productName.maxLength) 
    return `Product name must be no more than ${VALIDATION_RULES.productName.maxLength} characters`;
  if (!VALIDATION_RULES.productName.pattern.test(productName)) 
    return "Product name contains invalid characters";
  return null;
};

const validateMaterial = (material: string): string | null => {
  if (!material) return null; // Material is optional
  if (material.length < VALIDATION_RULES.material.minLength) 
    return `Material must be at least ${VALIDATION_RULES.material.minLength} characters`;
  if (material.length > VALIDATION_RULES.material.maxLength) 
    return `Material must be no more than ${VALIDATION_RULES.material.maxLength} characters`;
  if (!VALIDATION_RULES.material.pattern.test(material)) 
    return "Material contains invalid characters";
  return null;
};

const validateVolume = (volume: string): string | null => {
  if (!volume) return "Volume is required";
  const numVolume = Number(volume);
  if (isNaN(numVolume)) return "Volume must be a valid number";
  if (numVolume < VALIDATION_RULES.volume.min) 
    return `Volume must be at least ${VALIDATION_RULES.volume.min}`;
  if (numVolume > VALIDATION_RULES.volume.max) 
    return `Volume must be no more than ${VALIDATION_RULES.volume.max}`;
  
  // Check decimal places
  const decimalPlaces = volume.toString().split('.')[1]?.length || 0;
  if (decimalPlaces > VALIDATION_RULES.volume.decimalPlaces) 
    return `Volume can have maximum ${VALIDATION_RULES.volume.decimalPlaces} decimal places`;
  
  return null;
};

const validatePrevCost = (prevCost: string): string | null => {
  if (!prevCost) return null; // Previous cost is optional
  const numCost = Number(prevCost);
  if (isNaN(numCost)) return "Previous cost must be a valid number";
  if (numCost < VALIDATION_RULES.prevCost.min) 
    return `Previous cost must be at least ${VALIDATION_RULES.prevCost.min}`;
  if (numCost > VALIDATION_RULES.prevCost.max) 
    return `Previous cost must be no more than ${VALIDATION_RULES.prevCost.max}`;
  
  // Check decimal places
  const decimalPlaces = prevCost.toString().split('.')[1]?.length || 0;
  if (decimalPlaces > VALIDATION_RULES.prevCost.decimalPlaces) 
    return `Previous cost can have maximum ${VALIDATION_RULES.prevCost.decimalPlaces} decimal places`;
  
  return null;
};

const validateDimension = (dimension: string): string | null => {
  if (!dimension) return null; // Dimensions are optional
  const numDim = Number(dimension);
  if (isNaN(numDim)) return "Dimension must be a valid number";
  if (numDim < VALIDATION_RULES.dimensions.min) 
    return `Dimension must be at least ${VALIDATION_RULES.dimensions.min}`;
  if (numDim > VALIDATION_RULES.dimensions.max) 
    return `Dimension must be no more than ${VALIDATION_RULES.dimensions.max}`;
  
  // Check decimal places
  const decimalPlaces = dimension.toString().split('.')[1]?.length || 0;
  if (decimalPlaces > VALIDATION_RULES.dimensions.decimalPlaces) 
    return `Dimension can have maximum ${VALIDATION_RULES.dimensions.decimalPlaces} decimal places`;
  
  return null;
};

const validateLotCount = (lotCount: number | string): string | null => {
  if (!lotCount) return "Quantity is required";
  const numCount = Number(lotCount);
  if (isNaN(numCount)) return "Quantity must be a valid number";
  if (numCount < VALIDATION_RULES.lotCount.min) 
    return `Quantity must be at least ${VALIDATION_RULES.lotCount.min}`;
  if (numCount > VALIDATION_RULES.lotCount.max) 
    return `Quantity must be no more than ${VALIDATION_RULES.lotCount.max}`;
  if (!Number.isInteger(numCount)) 
    return "Quantity must be a whole number";
  return null;
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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateField = (fieldName: string, value: unknown): string | null => {
    switch (fieldName) {
      case 'lotId':
        return validateLotId(value as string);
      case 'hsCode':
        return validateHsCode(value as string);
      case 'productName':
        return validateProductName(value as string);
      case 'material':
        return validateMaterial(value as string);
      case 'volume':
        return validateVolume(value as string);
      case 'prevCost':
        return validatePrevCost(value as string);
      case 'lotCount':
        return validateLotCount(value as number | string);
      default:
        return null;
    }
  };

  const handleFieldChange = (fieldName: string, value: unknown) => {
    // Update the field value
    onChange({ [fieldName]: value });
    
    // Validate and update errors
    const error = validateField(fieldName, value);
    setFieldErrors(prev => ({
      ...prev,
      [fieldName]: error || ''
    }));
  };

  const handleDimensionChange = (dim: "l" | "w" | "h", value: string) => {
    // Validate dimension
    const error = validateDimension(value);
    setFieldErrors(prev => ({
      ...prev,
      [`dimension_${dim}`]: error || ''
    }));
    
    onChange({
      dimensions: { ...data.dimensions, [dim]: value },
    });
  };

  const getFieldError = (fieldName: string): string => {
    if (showErrors && !data[fieldName as keyof ProductLotData]) {
      return "Required";
    }
    return fieldErrors[fieldName] || '';
  };

  const hasFieldError = (fieldName: string): boolean => {
    return !!(showErrors && !data[fieldName as keyof ProductLotData]) || !!fieldErrors[fieldName];
  };

  const getDimensionError = (dim: string): string => {
    return fieldErrors[`dimension_${dim}`] || '';
  };

  const hasDimensionError = (dim: string): boolean => {
    return !!fieldErrors[`dimension_${dim}`];
  };

  const confirmCustomProduct = async () => {
    if (!customProductName.trim()) return;

    // Validate custom product name
    const error = validateProductName(customProductName.trim());
    if (error) {
      alert(error);
      return;
    }

    try {
      setSaving(true);
      await dutyService.addProduct({ name: customProductName.trim() });
      
      const updatedData = await dutyService.getProducts();
      if (Array.isArray(updatedData)) {
        setImportProducts(updatedData);
      }

      setCustomModalOpen(false);
      setCustomProductName("");
      setConfirmationModalOpen(true);
    } catch {
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
              className={`w-full bg-white border px-3 py-2 rounded text-sm ${
                hasFieldError('lotId') ? 'border-red-500' : 'border-[#DDE1EB]'
              }`}
              value={data.lotId || ""}
              onChange={(e) =>
                disableLotId ? undefined : handleFieldChange('lotId', e.target.value)
              }
              onBlur={(e) =>
                disableLotId || !onLotIdBlur
                  ? undefined
                  : onLotIdBlur(e.target.value)
              }
              disabled={disableLotId}
              maxLength={VALIDATION_RULES.lotId.maxLength}
            />
            {getFieldError('lotId') && (
              <span className="text-xs text-red-500">{getFieldError('lotId')}</span>
            )}
          </div>

          {/* HS Code */}
          <div>
            <label className="block text-sm mb-1">HS Code</label>
            <select
              className={`w-full bg-white border px-3 py-2 rounded text-sm ${
                hasFieldError('hsCode') ? 'border-red-500' : 'border-[#DDE1EB]'
              }`}
              value={data.hsCode || ""}
              onChange={(e) => handleFieldChange('hsCode', e.target.value)}
            >
              <option value="">Select HS Code</option>
              {/* Add HS code options here if needed */}
            </select>
            {getFieldError('hsCode') && (
              <span className="text-xs text-red-500">{getFieldError('hsCode')}</span>
            )}
          </div>

          {/* Product Name Dropdown */}
          <div>
            <label className="block text-sm mb-1">Product Name</label>
            <select
              className={`w-full bg-white border px-3 py-2 rounded text-sm ${
                hasFieldError('productName') ? "border-red-500" : "border-[#DDE1EB]"
              }`}
              value={data.productName || ""}
              onChange={(e) => {
                if (e.target.value === "__add_other__") {
                  setCustomModalOpen(true);
                } else {
                  handleFieldChange('productName', e.target.value);
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
            {getFieldError('productName') && (
              <span className="text-xs text-red-500">{getFieldError('productName')}</span>
            )}
          </div>

          {/* Material */}
          <div>
            <label className="block text-sm mb-1">Material Type</label>
            <input
              type="text"
              placeholder="Material Type"
              className={`w-full bg-white border px-3 py-2 rounded text-sm ${
                hasFieldError('material') ? 'border-red-500' : 'border-[#DDE1EB]'
              }`}
              value={data.material || ""}
              onChange={(e) => handleFieldChange('material', e.target.value)}
              maxLength={VALIDATION_RULES.material.maxLength}
            />
            {getFieldError('material') && (
              <span className="text-xs text-red-500">{getFieldError('material')}</span>
            )}
          </div>

          {/* Volume */}
          <div>
            <label className="block text-sm mb-1">Volume</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="0.00"
                step="0.01"
                min={VALIDATION_RULES.volume.min}
                max={VALIDATION_RULES.volume.max}
                className={`flex-1 bg-white border px-3 py-2 rounded text-sm ${
                  hasFieldError('volume') ? "border-red-500" : "border-[#DDE1EB]"
                }`}
                value={data.volume || ""}
                onChange={(e) => handleFieldChange('volume', e.target.value)}
              />
              <select
                className="bg-white border border-[#DDE1EB] px-3 py-2 rounded text-sm"
                value={data.volumeUnit || "kg"}
                onChange={(e) => onChange({ volumeUnit: e.target.value })}
              >
                {VOLUME_UNITS.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>
            {getFieldError('volume') && (
              <span className="text-xs text-red-500">{getFieldError('volume')}</span>
            )}
          </div>

          {/* Previous Cost */}
          <div>
            <label className="block text-sm mb-1">Previous Landed Cost (Optional)</label>
            <input
              type="number"
              placeholder="0.00"
              step="0.01"
              min={VALIDATION_RULES.prevCost.min}
              max={VALIDATION_RULES.prevCost.max}
              className={`w-full bg-white border px-3 py-2 rounded text-sm ${
                hasFieldError('prevCost') ? 'border-red-500' : 'border-[#DDE1EB]'
              }`}
              value={data.prevCost || ""}
              onChange={(e) => handleFieldChange('prevCost', e.target.value)}
            />
            {getFieldError('prevCost') && (
              <span className="text-xs text-red-500">{getFieldError('prevCost')}</span>
            )}
          </div>
        </div>

        {/* Dimensions */}
        <div className="mt-4">
          <label className="block text-sm mb-1">Dimensions (Optional)</label>
          <div className="flex gap-4 items-center">
            <div className="grid grid-cols-3 gap-4 flex-1">
              <div>
                <input
                  type="number"
                  placeholder="L"
                  step="0.01"
                  min={VALIDATION_RULES.dimensions.min}
                  max={VALIDATION_RULES.dimensions.max}
                  className={`w-full bg-white border px-3 py-2 rounded text-sm ${
                    hasDimensionError('l') ? 'border-red-500' : 'border-[#DDE1EB]'
                  }`}
                  value={data.dimensions?.l || ""}
                  onChange={(e) => handleDimensionChange("l", e.target.value)}
                />
                {getDimensionError('l') && (
                  <span className="text-xs text-red-500">{getDimensionError('l')}</span>
                )}
              </div>
              <div>
                <input
                  type="number"
                  placeholder="W"
                  step="0.01"
                  min={VALIDATION_RULES.dimensions.min}
                  max={VALIDATION_RULES.dimensions.max}
                  className={`w-full bg-white border px-3 py-2 rounded text-sm ${
                    hasDimensionError('w') ? 'border-red-500' : 'border-[#DDE1EB]'
                  }`}
                  value={data.dimensions?.w || ""}
                  onChange={(e) => handleDimensionChange("w", e.target.value)}
                />
                {getDimensionError('w') && (
                  <span className="text-xs text-red-500">{getDimensionError('w')}</span>
                )}
              </div>
              <div>
                <input
                  type="number"
                  placeholder="H"
                  step="0.01"
                  min={VALIDATION_RULES.dimensions.min}
                  max={VALIDATION_RULES.dimensions.max}
                  className={`w-full bg-white border px-3 py-2 rounded text-sm ${
                    hasDimensionError('h') ? 'border-red-500' : 'border-[#DDE1EB]'
                  }`}
                  value={data.dimensions?.h || ""}
                  onChange={(e) => handleDimensionChange("h", e.target.value)}
                />
                {getDimensionError('h') && (
                  <span className="text-xs text-red-500">{getDimensionError('h')}</span>
                )}
              </div>
            </div>
            <select
              className="border border-[#DDE1EB] px-2 py-2 rounded text-sm bg-white"
              value={data.dimensionUnit || "cm"}
              onChange={e => onChange({ dimensionUnit: e.target.value })}
            >
              <option value="cm">cm</option>
              <option value="m">m</option>
              <option value="in">in</option>
              <option value="ft">ft</option>
            </select>
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm mb-1">Quantity</label>
          <input
            type="number"
            placeholder="Number of LOTs"
            min={VALIDATION_RULES.lotCount.min}
            max={VALIDATION_RULES.lotCount.max}
            className={`w-full border px-3 py-2 rounded text-sm ${
              hasFieldError('lotCount') ? "border-red-500" : "border-[#DDE1EB]"
            }`}
            value={data.lotCount || ""}
            onChange={(e) => handleFieldChange('lotCount', e.target.value)}
          />
          {getFieldError('lotCount') && (
            <span className="text-xs text-red-500">{getFieldError('lotCount')}</span>
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
              maxLength={VALIDATION_RULES.productName.maxLength}
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

      {/* Confirmation modal */}
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
