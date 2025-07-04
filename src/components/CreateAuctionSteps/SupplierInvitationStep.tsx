import { useRef, useState } from "react";
import { X, User2, Pencil, Save } from "lucide-react";

export type Supplier = {
  _id: string;
  email: string;
};

export type SupplierInvitationData = {
  suppliers: Supplier[];
  previewEmail?: string;
};

type SupplierInvitationStepProps = {
  data: SupplierInvitationData;
  onChange: (data: Partial<SupplierInvitationData>) => void;
  showErrors?: boolean;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DEFAULT_PREVIEW = `Dear Supplier,

You are invited to participate in our upcoming reverse auction for Q1 2025 Raw Materials Procurement. This auction includes multiple LOTs covering various materials and components.

Please review the detailed specifications and submit your competitive bids within the auction timeline. All technical requirements and evaluation criteria are outlined in the attached documentation.

Best regards,
Procurement Team`;

export default function SupplierInvitationStep({
  data,
  onChange,
  showErrors,
}: SupplierInvitationStepProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [previewValue, setPreviewValue] = useState(data.previewEmail || DEFAULT_PREVIEW);
  const inputRef = useRef<HTMLInputElement>(null);

  const suppliers = data.suppliers || [];

  // Update local previewValue if external changes (rare, but safe)
  // (optional: can omit if not using state lift)
  // useEffect(() => {
  //   setPreviewValue(data.previewEmail || DEFAULT_PREVIEW);
  // }, [data.previewEmail]);

  const handleAdd = (email: string) => {
    const cleaned = email.trim();
    if (!cleaned) return;
    if (!emailRegex.test(cleaned)) {
      setError("Invalid email address");
      return;
    }
    if (suppliers.some((s) => s.email === cleaned)) {
      setError("Email already added");
      return;
    }
    setError("");
    const newSupplier: Supplier = {
      _id: cleaned,
      email: cleaned,
    };
    onChange({ suppliers: [...suppliers, newSupplier] });
    setInput("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["Enter", ",", "Tab"].includes(e.key)) {
      if (input.trim()) {
        e.preventDefault();
        handleAdd(input);
      }
    }
  };

  const handleRemove = (email: string) => {
    onChange({
      suppliers: suppliers.filter((s) => s.email !== email),
    });
    inputRef.current?.focus();
  };

  const handleEditClick = () => setEditMode(true);

  const handleSaveClick = () => {
    setEditMode(false);
    onChange({ previewEmail: previewValue });
  };

  return (
    <form className="flex flex-col ">
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-1">Select and invite suppliers</h2>
        <p className="text-sm text-[#5E5E65] mb-7">
          Only invited suppliers will receive access to this auction
        </p>

        {/* Email input row */}
        <div className="grid grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-sm mb-1 font-medium">Supplier Email Addresses</label>
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                placeholder="acme.plastics@supplier.com"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setError("");
                }}
                onKeyDown={handleKeyDown}
                className={`flex-1 border px-3 py-2 rounded-lg text-sm transition outline-none ring-0 focus:border-[#1AAB74] ${
                  error || (showErrors && suppliers.length === 0)
                    ? "border-red-500"
                    : "border-[#DDE1EB]"
                }`}
                style={{ minWidth: 0 }}
                autoComplete="off"
              />
              {emailRegex.test(input.trim()) &&
                !suppliers.some((s) => s.email === input.trim()) &&
                input.trim() && (
                  <button
                    type="button"
                    className="bg-[#1AAB74] w-8 h-8 rounded flex items-center justify-center transition hover:brightness-110 focus:ring-2 focus:ring-[#1AAB74]"
                    onClick={() => handleAdd(input)}
                    tabIndex={-1}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M5 10.4L8.42857 14L15 7"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
            </div>
            {error && <span className="text-xs text-red-500">{error}</span>}
            {showErrors && suppliers.length === 0 && (
              <span className="text-xs text-red-500 block mt-1">
                At least one email is required
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">Selection Dropdown</label>
            <select
              className="w-full border border-[#DDE1EB] px-3 py-2 rounded-lg text-sm bg-white"
              disabled
            >
              <option>Select from supplier list</option>
            </select>
          </div>
        </div>

        {/* Supplier chips */}
        <div className="bg-[#F8FAFC] border border-[#E1E6F0] rounded-xl px-5 py-4 mb-6">
          <div className="font-medium text-[15px] mb-3">
            Invited suppliers{" "}
            <span className="text-[#7C8597] text-[13px]">({suppliers.length})</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {suppliers.length === 0 ? (
              <span className="col-span-full text-gray-400 italic">
                No suppliers invited yet.
              </span>
            ) : (
              suppliers.map((s) => (
                <span
                  key={s._id}
                  className="flex items-center gap-2 bg-white border border-[#DDE1EB] px-3 py-2 rounded-[8px] text-[15px] text-[#222] font-normal transition-shadow hover:shadow-md focus-within:shadow-md"
                  tabIndex={-1}
                >
                  <User2 className="w-4 h-4 text-[#3772FF] shrink-0" aria-hidden />
                  <span className="truncate max-w-[160px]">{s.email}</span>
                  <button
                    type="button"
                    onClick={() => handleRemove(s.email)}
                    className="ml-1 rounded hover:bg-red-50 focus:bg-red-50 text-gray-400 hover:text-red-600 focus:text-red-600 transition-colors"
                    aria-label={`Remove ${s.email}`}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") handleRemove(s.email);
                    }}
                  >
                    <X size={16} />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        <div className="border border-[#E1E6F0] rounded-xl bg-[#FCFCFD] px-5 py-5 flex flex-col h-full">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-[15px]">Email Preview</span>
            {editMode ? (
              <button
                type="button"
                className="text-green-700 flex items-center gap-1 text-xs px-3 py-1 rounded border border-green-200 hover:bg-green-50"
                onClick={handleSaveClick}
              >
                <Save size={14} /> Save
              </button>
            ) : (
              <button
                type="button"
                className="text-blue-700 flex items-center gap-1 text-xs px-3 py-1 rounded border border-blue-200 hover:bg-blue-50"
                onClick={handleEditClick}
              >
                <Pencil size={14} /> Edit
              </button>
            )}
          </div>
          {editMode ? (
            <textarea
              className="w-full border border-blue-300 rounded-lg bg-white px-3 py-2 text-[15px] leading-relaxed min-h-[240px] resize-y focus:ring-2 focus:ring-blue-200 outline-none"
              value={previewValue}
              onChange={e => setPreviewValue(e.target.value)}
              autoFocus
            />
          ) : (
            <textarea
              className="w-full border-none bg-transparent p-0 text-[15px] leading-relaxed min-h-[240px] resize-none focus:ring-0 focus:outline-none"
              value={previewValue}
              readOnly
              tabIndex={-1}
              style={{ minHeight: "240px", height: "100%", width: "100%" }}
            />
          )}
        </div>
      </div>
    </form>
  );
}
