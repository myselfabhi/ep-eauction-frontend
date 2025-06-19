'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import Image from 'next/image';
import { CurrencyRateModal } from '@/components/modal/CurrencyRateModal';
import { Button } from '@/components/ui/button';

// -------------------
// Dummy data & types
// -------------------
type Currency = {
  _id?: string;
  currency: string;
  code: string;
  rate: number;
  updatedAt?: string;
};

const seedCurrencies: Currency[] = [
  { _id: '1', currency: 'US Dollar', code: 'USD', rate: 1.27, updatedAt: new Date().toISOString() },
  { _id: '2', currency: 'Euro', code: 'EUR', rate: 1.15, updatedAt: new Date().toISOString() },
  { _id: '3', currency: 'Indian Rupee', code: 'INR', rate: 0.0097, updatedAt: new Date().toISOString() },
];

export default function WeeklyCurrencyRatesPage() {
  const router = useRouter();

  // state
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [modalData, setModalData] = useState<Partial<Currency>>({});

  // Load dummy on mount
  useEffect(() => setCurrencies(seedCurrencies), []);

  // Filter by search
  const filtered = currencies.filter(c =>
    `${c.currency} ${c.code}`.toLowerCase().includes(searchQuery.trim().toLowerCase()),
  );

  // ---------- modal handlers ----------
  const openAdd = () => {
    setModalMode('add');
    setModalData({});
    setModalOpen(true);
  };

  const openEdit = (row: Currency) => {
    setModalMode('edit');
    setModalData(row);
    setModalOpen(true);
  };

  const saveCurrency = (data: { currency: string; code: string; rate: number }) => {
    if (modalMode === 'add') {
      setCurrencies(prev => [
        ...prev,
        { _id: Date.now().toString(), ...data, updatedAt: new Date().toISOString() },
      ]);
    } else if (modalMode === 'edit' && modalData._id) {
      setCurrencies(prev =>
        prev.map(c => (c._id === modalData._id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c)),
      );
    }
    setModalOpen(false);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div
            className="flex items-center gap-2 mb-1 cursor-pointer"
            onClick={() => router.push('/ep/settings')}
          >
            <Image src="/icons/arrow_back.svg" width={16} height={16} alt="Back" />
            <h1 className="text-lg font-semibold">Weekly Currency Rates (Demo)</h1>
          </div>
          <p className="text-sm text-muted-foreground">Dummy data – backend disabled</p>
        </div>
        <Button onClick={openAdd} variant="outline">
          <Image src="/icons/add.svg" width={16} height={16} alt="Add" />
          <span className="ml-2">Add Currency</span>
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 w-[400px] mb-4">
        <div className="relative flex-1">
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search Currency / Code"
            className="w-full border p-2 pl-10 rounded text-sm"
          />
          <Image src="/icons/magnifying.svg" width={16} height={16} alt="Search" className="absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Table */}
      <div className="border rounded overflow-hidden text-sm">
        <table className="w-full text-left">
          <thead className="bg-muted font-medium border-b">
            <tr>
              <th className="px-4 py-4 border-r">Currency</th>
              <th className="px-4 py-4 border-r">Code</th>
              <th className="px-4 py-4 border-r">Rate (→ GBP)</th>
              <th className="px-4 py-4 border-r">Updated</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length ? (
              filtered.map((row, idx) => (
                <tr key={row._id || idx} className="border-b hover:bg-muted/50">
                  <td className="px-4 py-3 border-r">{row.currency}</td>
                  <td className="px-4 py-3 border-r">{row.code}</td>
                  <td className="px-4 py-3 border-r">
                    <div className="flex items-center justify-between">
                      <span>{row.rate}</span>
                      <Image
                        src="/icons/edit_pen.svg"
                        width={16}
                        height={16}
                        alt="Edit"
                        className="cursor-pointer opacity-60 hover:opacity-100"
                        onClick={() => openEdit(row)}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 border-r">
                    {row.updatedAt ? new Date(row.updatedAt).toLocaleDateString() : ''}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
                  No results
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <CurrencyRateModal
        open={modalOpen}
        mode={modalMode}
        initialData={modalData}
        onClose={() => setModalOpen(false)}
        onSave={saveCurrency}
      />
    </DashboardLayout>
  );
}
