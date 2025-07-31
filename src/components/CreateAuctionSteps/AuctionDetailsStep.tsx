import { ChevronDown, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
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

// Validation constants
const VALIDATION_RULES = {
  title: {
    minLength: 3,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s\-_.,()]+$/, // Allow letters, numbers, spaces, hyphens, underscores, dots, commas, parentheses
  },
  category: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9\s\-_]+$/, // Allow letters, numbers, spaces, hyphens, underscores
  },
  description: {
    minLength: 10,
    maxLength: 1000,
    pattern: /^[^<>]*$/, // No HTML tags
  },
  sapCode: {
    minLength: 3,
    maxLength: 20,
    pattern: /^[A-Z0-9\-_]+$/, // Uppercase letters, numbers, hyphens, underscores
  },
  reservePrice: {
    min: 0.01,
    max: 999999999.99,
    decimalPlaces: 2,
  },
  maxSapCodes: 10,
};

// Validation functions
const validateTitle = (title: string): string | null => {
  if (!title) return "Title is required";
  if (title.length < VALIDATION_RULES.title.minLength) 
    return `Title must be at least ${VALIDATION_RULES.title.minLength} characters`;
  if (title.length > VALIDATION_RULES.title.maxLength) 
    return `Title must be no more than ${VALIDATION_RULES.title.maxLength} characters`;
  if (!VALIDATION_RULES.title.pattern.test(title)) 
    return "Title contains invalid characters";
  return null;
};

const validateCategory = (category: string): string | null => {
  if (!category) return "Category is required";
  if (category.length < VALIDATION_RULES.category.minLength) 
    return `Category must be at least ${VALIDATION_RULES.category.minLength} characters`;
  if (category.length > VALIDATION_RULES.category.maxLength) 
    return `Category must be no more than ${VALIDATION_RULES.category.maxLength} characters`;
  if (!VALIDATION_RULES.category.pattern.test(category)) 
    return "Category contains invalid characters";
  return null;
};

const validateDescription = (description: string): string | null => {
  if (!description) return "Description is required";
  if (description.length < VALIDATION_RULES.description.minLength) 
    return `Description must be at least ${VALIDATION_RULES.description.minLength} characters`;
  if (description.length > VALIDATION_RULES.description.maxLength) 
    return `Description must be no more than ${VALIDATION_RULES.description.maxLength} characters`;
  if (!VALIDATION_RULES.description.pattern.test(description)) 
    return "Description contains invalid characters";
  return null;
};

const validateSapCode = (sapCode: string): string | null => {
  if (!sapCode) return null; // SAP codes are optional
  if (sapCode.length < VALIDATION_RULES.sapCode.minLength) 
    return `SAP code must be at least ${VALIDATION_RULES.sapCode.minLength} characters`;
  if (sapCode.length > VALIDATION_RULES.sapCode.maxLength) 
    return `SAP code must be no more than ${VALIDATION_RULES.sapCode.maxLength} characters`;
  if (!VALIDATION_RULES.sapCode.pattern.test(sapCode)) 
    return "SAP code can only contain uppercase letters, numbers, hyphens, and underscores";
  return null;
};

const validateReservePrice = (price: number | string): string | null => {
  if (!price) return null; // Reserve price is optional
  const numPrice = Number(price);
  if (isNaN(numPrice)) return "Reserve price must be a valid number";
  if (numPrice < VALIDATION_RULES.reservePrice.min) 
    return `Reserve price must be at least ${VALIDATION_RULES.reservePrice.min}`;
  if (numPrice > VALIDATION_RULES.reservePrice.max) 
    return `Reserve price must be no more than ${VALIDATION_RULES.reservePrice.max}`;
  
  // Check decimal places
  const decimalPlaces = price.toString().split('.')[1]?.length || 0;
  if (decimalPlaces > VALIDATION_RULES.reservePrice.decimalPlaces) 
    return `Reserve price can have maximum ${VALIDATION_RULES.reservePrice.decimalPlaces} decimal places`;
  
  return null;
};

const validateSapCodes = (sapCodes: string[]): string | null => {
  if (sapCodes.length > VALIDATION_RULES.maxSapCodes) 
    return `Maximum ${VALIDATION_RULES.maxSapCodes} SAP codes allowed`;
  
  // Check for duplicates
  const uniqueCodes = new Set(sapCodes.map(code => code.toUpperCase()));
  if (uniqueCodes.size !== sapCodes.length) 
    return "Duplicate SAP codes are not allowed";
  
  // Validate each code
  for (const code of sapCodes) {
    const error = validateSapCode(code);
    if (error) return error;
  }
  
  return null;
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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateField = (fieldName: string, value: unknown): string | null => {
    switch (fieldName) {
      case 'title':
        return validateTitle(value as string);
      case 'category':
        return validateCategory(value as string);
      case 'description':
        return validateDescription(value as string);
      case 'reservePrice':
        return validateReservePrice(value as number | string);
      case 'sapCodes':
        return validateSapCodes(value as string[]);
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

  const addSapCode = () => {
    const trimmed = sapInput.trim().toUpperCase();
    if (!trimmed) return;
    
    const error = validateSapCode(trimmed);
    if (error) {
      setFieldErrors(prev => ({ ...prev, sapInput: error }));
      return;
    }
    
    if ((data.sapCodes || []).includes(trimmed)) {
      setFieldErrors(prev => ({ ...prev, sapInput: "SAP code already exists" }));
      return;
    }
    
    if ((data.sapCodes || []).length >= VALIDATION_RULES.maxSapCodes) {
      setFieldErrors(prev => ({ ...prev, sapInput: `Maximum ${VALIDATION_RULES.maxSapCodes} SAP codes allowed` }));
      return;
    }
    
    const newSapCodes = [...(data.sapCodes || []), trimmed];
    onChange({ sapCodes: newSapCodes });
    setSapInput('');
    setFieldErrors(prev => ({ ...prev, sapInput: '', sapCodes: '' }));
  };

  const removeSapCode = (codeToRemove: string) => {
    const newSapCodes = (data.sapCodes || []).filter(code => code !== codeToRemove);
    onChange({ sapCodes: newSapCodes });
    setFieldErrors(prev => ({ ...prev, sapCodes: '' }));
  };

  const getFieldError = (fieldName: string): string => {
    if (showErrors && !data[fieldName as keyof AuctionDetailsData]) {
      return "Required";
    }
    return fieldErrors[fieldName] || '';
  };

  const hasFieldError = (fieldName: string): boolean => {
    return !!(showErrors && !data[fieldName as keyof AuctionDetailsData]) || !!fieldErrors[fieldName];
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
              hasFieldError('title') ? 'border-red-500' : 'border-[#DDE1EB]'
            }`}
            value={data.title || ''}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            maxLength={VALIDATION_RULES.title.maxLength}
          />
          {getFieldError('title') && (
            <span className="text-xs text-red-500">{getFieldError('title')}</span>
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
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter SAP Code"
              className={`flex-1 border px-3 py-2 rounded text-sm ${
                fieldErrors.sapInput ? 'border-red-500' : 'border-[#DDE1EB]'
              }`}
              value={sapInput}
              onChange={(e) => {
                setSapInput(e.target.value.toUpperCase());
                setFieldErrors(prev => ({ ...prev, sapInput: '' }));
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSapCode();
                }
              }}
              maxLength={VALIDATION_RULES.sapCode.maxLength}
            />
            <button
              type="button"
              onClick={addSapCode}
              className="bg-[#1AAB74] text-white px-3 py-2 rounded text-sm hover:bg-[#169a66] transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {fieldErrors.sapInput && (
            <span className="text-xs text-red-500">{fieldErrors.sapInput}</span>
          )}
          {getFieldError('sapCodes') && (
            <span className="text-xs text-red-500">{getFieldError('sapCodes')}</span>
          )}
          
          {/* Display added SAP codes */}
          {(data.sapCodes || []).length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {data.sapCodes?.map((code, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs flex items-center gap-1"
                >
                  {code}
                  <button
                    type="button"
                    onClick={() => removeSapCode(code)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
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
              hasFieldError('category') ? 'border-red-500' : 'border-[#DDE1EB]'
            }`}
            value={data.category || ''}
            onChange={(e) => handleFieldChange('category', e.target.value)}
            maxLength={VALIDATION_RULES.category.maxLength}
          />
          {getFieldError('category') && (
            <span className="text-xs text-red-500">{getFieldError('category')}</span>
          )}
        </div>

        {/* Reserve Price */}
        <div>
          <label className="block text-sm mb-1">Reserve Price (Optional)</label>
          <input
            type="number"
            placeholder="0.00"
            step="0.01"
            min={VALIDATION_RULES.reservePrice.min}
            max={VALIDATION_RULES.reservePrice.max}
            className={`w-full border px-3 py-2 rounded text-sm ${
              hasFieldError('reservePrice') ? 'border-red-500' : 'border-[#DDE1EB]'
            }`}
            value={data.reservePrice || ''}
            onChange={(e) => handleFieldChange('reservePrice', e.target.value)}
          />
          {getFieldError('reservePrice') && (
            <span className="text-xs text-red-500">{getFieldError('reservePrice')}</span>
          )}
        </div>

        {/* Description */}
        <div className="col-span-2">
          <label className="block text-sm mb-1">Description</label>
          <textarea
            placeholder="Describe the auction"
            rows={3}
            className={`w-full border px-3 py-2 rounded text-sm ${
              hasFieldError('description') ? 'border-red-500' : 'border-[#DDE1EB]'
            }`}
            value={data.description || ''}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            maxLength={VALIDATION_RULES.description.maxLength}
          />
          <div className="flex justify-between items-center mt-1">
            {getFieldError('description') && (
              <span className="text-xs text-red-500">{getFieldError('description')}</span>
            )}
            <span className="text-xs text-gray-500 ml-auto">
              {(data.description || '').length}/{VALIDATION_RULES.description.maxLength}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
