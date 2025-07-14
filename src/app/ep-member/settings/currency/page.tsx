'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/shared/DashboardLayout";
import Image from "next/image";
import { CurrencyRateModal } from "@/components/ui/modal/CurrencyRateModal";
import { Button } from "@/components/ui/button";
import { currencyService } from "@/services";
import { ROUTES } from "@/lib/routes";


// ---- Currency type definition ----
type Currency = {
  _id?: string;
  currency: string;
  code: string;
  rate: number;
  updatedAt?: string;
};

export default function WeeklyCurrencyRatesPage() {
  const router = useRouter();
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [modalData, setModalData] = useState<Partial<Currency>>({});

  // Delete modal state
  const [deleteMode, setDeleteMode] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Currency | null>(null);

  // Fetch currencies from backend
  const fetchCurrencies = async () => {
    try {
      const data = await currencyService.getRates();
      setCurrencies(data as Currency[]);
    } catch (error) {
      console.error('Failed to fetch currencies:', error);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  // Filter by search
  const filteredCurrencies = currencies.filter((row) =>
    `${row.currency} ${row.code}`.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  // Modal open handlers
  const handleAdd = () => {
    setModalMode("add");
    setModalData({});
    setModalOpen(true);
  };

  const handleEdit = (row: Currency) => {
    setModalMode("edit");
    setModalData({
      _id: row._id,
      currency: row.currency,
      code: row.code,
      rate: row.rate,
    });
    setModalOpen(true);
  };

  // Save handler (add or edit)
  const handleSave = async (data: { currency: string; code: string; rate: number }) => {
    await currencyService.updateRate(data);
    setModalOpen(false);
    fetchCurrencies();
  };

  // Delete handler for the modal
  const handleDelete = async () => {
    if (!deleteTarget?.code) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/currency-rate`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: deleteTarget.code }),
    });
    setDeleteMode(false);
    setDeleteTarget(null);
    fetchCurrencies();
  };

  return (
    <DashboardLayout>
      {/* Top Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div
            className="flex items-center gap-2 mb-1 cursor-pointer"
            onClick={() => router.push(ROUTES.EP_MEMBER.SETTINGS.ROOT)}
          >
            <Image width={16} height={16} src="/icons/arrow_left.svg" alt="Back" className="w-4 h-4" />
            <h1 className="text-lg font-semibold text-body">Weekly Currency Rates</h1>
          </div>
          <p className="text-sm ">
            Update exchange rates used in landed cost calculations.
          </p>
        </div>
      </div>
      {/* Search + Add + Delete Button Row */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        {/* Left side: Search + Add */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Currency/Code"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-borderInput p-2 pl-10 rounded text-sm"
              style={{ maxWidth: 340 }}
            />
            <Image
              width={16}
              height={16}
              src="/icons/magnifying.svg"
              alt="Search"
              className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2"
            />
          </div>
          <Button
            onClick={handleAdd}
            variant="outline"
            className="flex items-center gap-2 bg-status-success-light text-status-success text-sm font-medium px-4 py-2 rounded"
          >
            <Image width={16} height={16} src="/icons/add_green.svg" alt="Plus" className="w-4 h-4" />
            Add Currency
          </Button>
        </div>
        {/* Right side: Delete */}
        <div className="flex-shrink-0">
          <button
            onClick={() => setDeleteMode(true)}
            className="flex items-center gap-2 bg-background-red text-status-error text-sm font-medium px-4 py-2 rounded border border-red-200 hover:bg-red-50 transition"
          >
            <Image width={16} height={16} src="/icons/trash.svg" alt="Delete" className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
      {/* Table */}
      <div className="border border-border rounded overflow-hidden text-sm">
        <table className="w-full table-fixed text-left">
          <thead className="bg-background-subtle text-body font-medium border-b border-border">
            <tr>
              <th className="px-4 py-4 border-r border-border w-1/3">Currency Name</th>
              <th className="px-4 py-4 border-r border-border w-1/6">Code</th>
              <th className="px-4 py-4 border-r border-border w-1/3">Exchange Rate (to GBP)</th>
              <th className="px-4 py-4 border-r border-border w-1/4">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {filteredCurrencies.length > 0 ? (
              filteredCurrencies.map((row, index) => (
                <tr
                  key={row._id || index}
                  className="border-b border-border hover:bg-background"
                >
                  <td className="px-4 py-4 border-r border-border relative group">
                    <div className="flex items-center justify-between min-w-0 overflow-hidden">
                      <span className="truncate">{row.currency}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 border-r border-border">{row.code}</td>
                  <td className="px-4 py-4 border-r border-border">
                    <div className="flex items-center justify-between">
                      <span>{row.rate}</span>
                      <Image
                        width={16}
                        height={16}
                        src="/icons/edit_pen.svg"
                        alt="Edit"
                        className="w-4 h-4 cursor-pointer opacity-60 hover:opacity-100 ml-2"
                        onClick={() => handleEdit(row)}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-4 border-r border-border">
                    {row.updatedAt ? new Date(row.updatedAt).toLocaleDateString() : ""}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-sm text-gray-500">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Currency Rate Modal */}
      <CurrencyRateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={modalData}
        mode={modalMode}
      />

      {/* Delete Confirmation Modal (Dropdown) */}
      {deleteMode && (
        <div className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg flex flex-col gap-5">
            <h2 className="text-lg font-semibold mb-2 text-red-600">Delete Currency</h2>
            <label className="block mb-1 font-medium">Select Currency</label>
            <select
              className="border border-borderInput p-2 rounded w-full"
              value={deleteTarget?._id ?? ""}
              onChange={e => {
                const selected = currencies.find(c => c._id === e.target.value);
                setDeleteTarget(selected || null);
              }}
            >
              <option value="">Select a currency</option>
              {currencies.map((cur) => (
                <option key={cur._id} value={cur._id}>
                  {cur.currency} ({cur.code})
                </option>
              ))}
            </select>
            <div className="text-xs text-gray-500 mt-2">
              Deletion is permanent. Only the selected currency will be deleted.
            </div>
            <div className="flex gap-3 mt-2 w-full justify-end">
              <button
                className="px-5 py-2 bg-gray-100 rounded text-body hover:bg-gray-200 transition"
                onClick={() => {
                  setDeleteMode(false);
                  setDeleteTarget(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                disabled={!deleteTarget}
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
