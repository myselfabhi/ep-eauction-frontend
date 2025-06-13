'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type CountryDuty = {
  [key: string]: string;
};

const data: {
  product: string;
  hsCode: string;
  countries: CountryDuty;
}[] = [
  {
    product: 'Kraft Boxes',
    hsCode: '4819.10',
    countries: {
      India: '12%',
      China: '',
      Turkey: '',
      Vietnam: '',
      USA: '',
      Bangladesh: '',
      Japan: '',
      France: '',
      Germany: '',
      Italy: '',
      Brazil: '',
      Mexico: '',
      Canada: '',
    },
  },
  {
    product: 'Plastic Hangers',
    hsCode: '3923',
    countries: {
      India: '20%',
      China: '',
      Turkey: '',
      Vietnam: '',
      USA: '',
      Bangladesh: '',
      Japan: '',
      France: '',
      Germany: '',
      Italy: '',
      Brazil: '',
      Mexico: '',
      Canada: '',
    },
  },
  {
    product: 'Cotton T-Shirts',
    hsCode: '6109.10',
    countries: {
      India: '10%',
      China: '',
      Turkey: '20%',
      Vietnam: '',
      USA: '',
      Bangladesh: '',
      Japan: '',
      France: '',
      Germany: '',
      Italy: '',
      Brazil: '',
      Mexico: '',
      Canada: '',
    },
  },
];

export default function ImportDutyMatrixPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const countryKeys = [
    'India',
    'China',
    'Turkey',
    'Vietnam',
    'USA',
    'Bangladesh',
    'Japan',
    'France',
    'Germany',
    'Italy',
    'Brazil',
    'Mexico',
    'Canada',
  ];

  return (
    <DashboardLayout>
      {/* Top header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div
            className="flex items-center gap-2 mb-1 cursor-pointer"
            onClick={() => router.push('/ep/settings')}
          >
            <Image width={5} height={5} src="/icons/arrow_left.svg" alt="Back" className="w-4 h-4" />
            <h1 className="text-lg font-semibold">Import Duty Matrix</h1>
          </div>
          <p className="text-sm text-[#5E5E65]">
            Configure import duty percentages by country and product type
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => alert('Export CSV')}
            className="flex items-center gap-2 border border-[#DDE1EB] px-4 py-2 rounded text-sm text-[#383838]"
          >
            <Image width={5} height={5} src="/icons/export.svg" alt="Download" className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => alert('Save changes')}
            className="bg-[#007AFF] text-white text-sm font-semibold px-4 py-2 rounded"
          >
            Save changes
          </button>
        </div>
      </div>

      {/* Search + Add buttons */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products or HS codes"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-[#DDE1EB] p-2 pl-10 rounded text-sm w-72"
            />
            <Image width={5} height={5}
              src="/icons/magnifying.svg"
              alt="Search"
              className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8E8E99]"
            />
          </div>
          <button
            onClick={() => alert('Add Country')}
            className="flex items-center gap-2 bg-[#F0F6FF] text-[#007AFF] text-sm font-medium px-4 py-2 rounded"
          >
            <Image width={5} height={5} src="/icons/add.svg" alt="Plus" className="w-4 h-4" />
            Add Country
          </button>
          <button
            onClick={() => alert('Add Product')}
            className="flex items-center gap-2 bg-[#E9F8E5] text-[#2C742F] text-sm font-medium px-4 py-2 rounded"
          >
            <Image width={5} height={5} src="/icons/add_green.svg" alt="Plus" className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-[#EAECF0] rounded text-sm overflow-x-auto relative max-w-full">
        <table className="min-w-[1200px] border-collapse text-left">
          <thead className="bg-[#F9FAFB] text-[#383838] font-medium border-b border-[#EAECF0]">
            <tr>
              <th
                className="min-w-[300px] px-4 py-3 sticky left-0 bg-[#F9FAFB] z-20 border-r border-[#EAECF0] whitespace-nowrap shadow-md"
              >
                Product <span className="text-xs text-[#5E5E65]">(HS Code)</span>
              </th>
              {countryKeys.map((country) => (
                <th
                  key={country}
                  className="pl-2 pr-12 py-1 border-l border-[#EAECF0] bg-[#F9FAFB] whitespace-nowrap"
                >
                  {country} <span className="text-xs text-[#5E5E65]">Duty %</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data
              .filter(
                (row) =>
                  row.product.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
                  row.hsCode.toLowerCase().includes(searchQuery.trim().toLowerCase())
              )
              .map((row, index) => (
                <tr key={index} className="border-b border-[#EAECF0]">
                  <td className="px-4 py-4 sticky left-0 bg-white z-20 border-r border-[#EAECF0] shadow-md">
                    <div className="flex flex-col">
                      <span>{row.product}</span>
                      <span className="text-xs text-[#5E5E65]">{row.hsCode}</span>
                    </div>
                  </td>
                  {countryKeys.map((country) => (
                    <td
                      key={country}
                      className="pr-4 py-1 text-center border-l border-[#EAECF0]"
                    >
                      {row.countries[country] ? (
                        <div className="flex items-center justify-between px-2">
                          <span className="text-left">{row.countries[country]}</span>
                          <Image width={5} height={5}
                            src="/icons/edit_pen.svg"
                            alt="Edit"
                            className="w-4 h-4 cursor-pointer opacity-60 hover:opacity-100"
                            onClick={() =>
                              alert(`Edit duty for ${country} - ${row.product}`)
                            }
                          />
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            alert(`Add duty for ${country} - ${row.product}`)
                          }
                          className="text-[#007AFF] text-xl leading-none hover:bg-blue-50 rounded w-7 h-7 flex items-center justify-center mx-auto"
                        >
                          +
                        </button>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
