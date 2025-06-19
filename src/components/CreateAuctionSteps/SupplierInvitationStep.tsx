import { useRef, useState } from "react";
import { X } from "lucide-react";

// --- Data Type for the Step ---
type SupplierInvitationData = {
  suppliers: string[];
  previewEmail?: string;
};

type SupplierInvitationStepProps = {
  data: SupplierInvitationData;
  onChange: (data: Partial<SupplierInvitationData>) => void;
  showErrors?: boolean;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SupplierInvitationStep({
  data,
  onChange,
  showErrors,
}: SupplierInvitationStepProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Existing emails
  const suppliers: string[] = data.suppliers || [];

  // Add email
  const handleAdd = (email: string) => {
    const cleaned = email.trim();
    if (!cleaned) return;
    if (!emailRegex.test(cleaned)) {
      setError("Invalid email address");
      return;
    }
    if (suppliers.includes(cleaned)) {
      setError("Email already added");
      return;
    }
    setError("");
    onChange({ suppliers: [...suppliers, cleaned] });
    setInput("");
  };

  // On input keypress
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAdd(input);
    }
  };

  // Remove email
  const handleRemove = (email: string) => {
    onChange({ suppliers: suppliers.filter((s) => s !== email) });
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Select and invite suppliers</h2>
      <p className="text-sm text-[#5E5E65] mb-4">
        Only invited suppliers will receive access to this auction
      </p>
      <div className="grid grid-cols-2 gap-6 mb-4">
        <div>
          <label className="block text-sm mb-1">Supplier Email Addresses</label>
          <input
            ref={inputRef}
            type="text"
            placeholder="Supplier Email Addresses"
            value={input}
            onChange={e => {
              setInput(e.target.value);
              setError("");
            }}
            onKeyDown={handleKeyDown}
            className={`w-full border px-3 py-2 rounded text-sm ${
              showErrors && suppliers.length === 0
                ? "border-red-500"
                : "border-[#DDE1EB]"
            }`}
          />
          {error && <span className="text-xs text-red-500">{error}</span>}
          {showErrors && suppliers.length === 0 && (
            <span className="text-xs text-red-500 block mt-1">
              At least one email is required
            </span>
          )}
        </div>
        <div>
          <label className="block text-sm mb-1">Selection Dropdown (1 Selected)</label>
          <select className="w-full border border-[#DDE1EB] px-3 py-2 rounded text-sm" disabled>
            <option>Select from supplier list</option>
            {/* You can populate with options if needed */}
          </select>
        </div>
      </div>
      {/* Breadcrumb chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {suppliers.map((email) => (
          <span
            key={email}
            className="flex items-center gap-1 bg-[#F3F6FB] border border-[#E1E6F0] px-3 py-1 rounded-full text-sm text-[#222] shadow-sm"
          >
            <span>{email}</span>
            <button
              type="button"
              onClick={() => handleRemove(email)}
              className="text-gray-400 hover:text-red-600 ml-1"
              aria-label="Remove"
            >
              <X size={16} />
            </button>
          </span>
        ))}
      </div>
      {/* Preview */}
      <div className="mb-6">
        <label className="block text-sm mb-1">Preview Email Invitation</label>
        <textarea
          className="w-full border border-[#DDE1EB] px-3 py-2 rounded text-sm min-h-[80px]"
          value={data.previewEmail || "Hey, you are invited to the auction..."}
          readOnly
        />
      </div>
    </div>
  );
}
