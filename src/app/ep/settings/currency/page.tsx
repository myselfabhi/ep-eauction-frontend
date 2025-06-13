'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import Image from 'next/image';

export default function WeeklyCurrencyRatesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [autoUpdate, setAutoUpdate] = useState(false);

  const currencies = [
    { currency: 'US Dollar', code: 'USD', rate: '1.27', date: 'June 4, 2025' },
    { currency: 'Euro', code: 'EUR', rate: '1.27', date: 'June 4, 2025' },
    { currency: 'Japanese Yen', code: 'JPY', rate: '180.50', date: 'June 4, 2025' },
    { currency: 'British Pound', code: 'GBP', rate: '1.00', date: 'June 4, 2025' },
    { currency: 'Swiss Franc', code: 'CHF', rate: '1.12', date: 'June 4, 2025' },
  ];

  const filteredCurrencies = currencies.filter((row) =>
    `${row.currency} ${row.code}`.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <DashboardLayout>
      {/* Top Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div
            className="flex items-center gap-2 mb-1 cursor-pointer"
            onClick={() => router.push('/ep/settings')}
          >
            <Image width={5} height={5} src="/icons/arrow_back.svg" alt="Back" className="w-4 h-4" />
            <h1 className="text-lg font-semibold">Weekly Currency Rates</h1>
          </div>
          <p className="text-sm text-[#5E5E65]">
            Update exchange rates used in landed cost calculations.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => alert('Save changes')}
            className="bg-[#007AFF] text-white text-sm font-semibold px-4 py-2 rounded"
          >
            Save changes
          </button>
          <div className="flex items-center gap-2 text-sm text-[#383838]">
            Auto Update
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={autoUpdate}
                onChange={() => setAutoUpdate(!autoUpdate)}
              />
              <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-[#007AFF] after:content-[''] after:absolute after:left-[2px] after:top-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Search + Add Country */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 w-[400px]">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search Currency/code"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-[#DDE1EB] p-2 pl-10 rounded text-sm"
            />
            <Image width={5} height={5}
              src="/icons/magnifying.svg"
              alt="Search"
              className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2"
            />
          </div>
          <button
            onClick={() => alert('Add Country')}
            className="flex items-center gap-2 bg-[#F0F6FF] text-[#007AFF] text-sm font-medium px-4 py-2 rounded"
          >
            <Image width={5} height={5} src="/icons/add.svg" alt="Plus" className="w-4 h-4" />
            Add Country
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-[#EAECF0] rounded overflow-hidden text-sm">
        <table className="w-full text-left">
          <thead className="bg-[#F9FAFB] text-[#383838] font-medium border-b border-[#EAECF0]">
            <tr>
              <th className="px-4 py-4 border-r border-[#EAECF0]">Currency</th>
              <th className="px-4 py-4 border-r border-[#EAECF0]">Code</th>
              <th className="px-4 py-4 border-r border-[#EAECF0]">Exchange Rate (to GBP)</th>
              <th className="px-4 py-4">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {filteredCurrencies.map((row, index) => (
              <tr
                key={index}
                className="border-b border-[#EAECF0] hover:bg-gray-50"
              >
                <td className="px-4 py-4 border-r border-[#EAECF0]">{row.currency}</td>
                <td className="px-4 py-4 border-r border-[#EAECF0]">{row.code}</td>
                <td className="px-4 py-4 border-r border-[#EAECF0]">
                  <div className="flex justify-between items-center pr-2">
                    <span>{row.rate}</span>
                    {/* Show edit pen for all rows */}
                    <Image width={5} height={5}
                      src="/icons/edit_pen.svg"
                      alt="Edit"
                      className="w-4 h-4 cursor-pointer opacity-60 hover:opacity-100"
                      onClick={() => alert(`Edit rate for ${row.currency}`)}
                    />
                  </div>
                </td>
                <td className="px-4 py-4">{row.date}</td>
              </tr>
            ))}
            {filteredCurrencies.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-sm text-gray-500"
                >
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
