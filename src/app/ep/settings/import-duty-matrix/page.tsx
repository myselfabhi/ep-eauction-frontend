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
            <h1 className="text-lg font-semibold text-body">Import Duty Matrix</h1>
          </div>
          <p className="text-sm text-muted">
            Configure import duty percentages by country and product type
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => alert('Export CSV')}
            className="flex items-center gap-2 border border-borderInput px-4 py-2 rounded text-sm text-body"
          >
            <Image width={5} height={5} src="/icons/export.svg" alt="Download" className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => alert('Save changes')}
            className="bg-primary text-white text-sm font-semibold px-4 py-2 rounded"
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
              className="border border-borderInput p-2 pl-10 rounded text-sm w-72"
            />
            <Image
              width={5}
              height={5}
              src="/icons/magnifying.svg"
              alt="Search"
              className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-icon"
            />
          </div>
          <button
            onClick={() => alert('Add Country')}
            className="flex items-center gap-2 bg-background-blue text-status-scheduled text-sm font-medium px-4 py-2 rounded"
          >
            <Image width={5} height={5} src="/icons/add.svg" alt="Plus" className="w-4 h-4" />
            Add Country
          </button>
          <button
            onClick={() => alert('Add Product')}
            className="flex items-center gap-2 bg-status-success-light text-status-success text-sm font-medium px-4 py-2 rounded"
          >
            <Image width={5} height={5} src="/icons/add_green.svg" alt="Plus" className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-border rounded text-sm overflow-x-auto relative max-w-full">
        <table className="min-w-[1200px] border-collapse text-left">
          <thead className="bg-background-subtle text-body font-medium border-b border-border">
            <tr>
              <th
                className="min-w-[300px] px-4 py-3 sticky left-0 bg-background-subtle z-20 border-r border-border whitespace-nowrap shadow-md"
              >
                Product <span className="text-xs text-muted">(HS Code)</span>
              </th>
              {countryKeys.map((country) => (
                <th
                  key={country}
                  className="pl-2 pr-12 py-1 border-l border-border bg-background-subtle whitespace-nowrap"
                >
                  {country} <span className="text-xs text-muted">Duty %</span>
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
                <tr key={index} className="border-b border-border">
                  <td className="px-4 py-4 sticky left-0 bg-white z-20 border-r border-border shadow-md">
                    <div className="flex flex-col">
                      <span>{row.product}</span>
                      <span className="text-xs text-muted">{row.hsCode}</span>
                    </div>
                  </td>
                  {countryKeys.map((country) => (
                    <td
                      key={country}
                      className="pr-4 py-1 text-center border-l border-border"
                    >
                      {row.countries[country] ? (
                        <div className="flex items-center justify-between px-2">
                          <span className="text-left">{row.countries[country]}</span>
                          <Image
                            width={5}
                            height={5}
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
                          className="text-status-scheduled text-xl leading-none hover:bg-background-blue rounded w-7 h-7 flex items-center justify-center mx-auto"
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
