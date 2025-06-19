'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import DutyModal from '../../../../components/modal/DutyModal';

// ---------------------
// Dummy seed data (LOCAL ONLY)
// ---------------------

type Country = { _id: string; name: string };
type Product = { _id: string; name: string; hsCode?: string };
type DutyRow = { _id: string; product: string; country: string; dutyRate: number | null };

const seedCountries: Country[] = [
  { _id: 'c1', name: 'India' },
  { _id: 'c2', name: 'USA' },
  { _id: 'c3', name: 'Germany' },
];
const seedProducts: Product[] = [
  { _id: 'p1', name: 'Steel', hsCode: '7208' },
  { _id: 'p2', name: 'Aluminium', hsCode: '7606' },
  { _id: 'p3', name: 'Plastic', hsCode: '3901' },
];
const seedDuties: DutyRow[] = [
  { _id: 'd1', product: 'Steel', country: 'India', dutyRate: 5 },
  { _id: 'd2', product: 'Steel', country: 'USA', dutyRate: 10 },
  { _id: 'd3', product: 'Aluminium', country: 'Germany', dutyRate: 7 },
];

// ---------------------
// CSV helpers
// ---------------------
function buildDutyMatrix(rows: DutyRow[]) {
  const matrix: Record<string, Record<string, { rate: string; id: string }>> = {};
  for (const r of rows) {
    if (!matrix[r.product]) matrix[r.product] = {};
    matrix[r.product][r.country] = { rate: r.dutyRate !== null ? `${r.dutyRate}%` : '', id: r._id };
  }
  return matrix;
}

function toCsv(products: Product[], countries: Country[], matrix: ReturnType<typeof buildDutyMatrix>) {
  const header = ['Product (HS Code)', ...countries.map(c => c.name)];
  const rows = products.map(p => {
    const row: string[] = [`${p.name} (${p.hsCode ?? ''})`];
    for (const c of countries) row.push(matrix[p.name]?.[c.name]?.rate || '');
    return row;
  });
  return [header, ...rows].map(r => r.map(f => `"${f}"`).join(',')).join('\r\n');
}

function download(csv: string, filename = 'import-duty-matrix.csv') {
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

// ---------------------
// Page component (dummy mode)
// ---------------------
export default function ImportDutyMatrixPage() {
  const router = useRouter();

  // state
  const [countries, setCountries] = useState<Country[]>(seedCountries);
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [dutyRows, setDutyRows] = useState<DutyRow[]>(seedDuties);
  const [search, setSearch] = useState('');

  // modal state (fully typed)
  const [modal, setModal] = useState<{
    open: boolean;
    product?: Product;
    country?: Country;
    currentRate: number | null;
    dutyRowId?: string;
  }>({ open: false, currentRate: null });

  // add country/product pop-ups
  const [showAddCountry, setShowAddCountry] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newCountry, setNewCountry] = useState('');
  const [newProduct, setNewProduct] = useState('');

  const dutyMatrix = useMemo(() => buildDutyMatrix(dutyRows), [dutyRows]);
  // const countryKeys = countries.map(c => c.name);

  // ---------- handlers ----------
  const openAdd = (product: Product, country: Country) =>
    setModal({ open: true, product, country, currentRate: null });

  const openEdit = (product: Product, country: Country, rate: string, id: string) =>
    setModal({ open: true, product, country, currentRate: Number(rate.replace('%', '')) || 0, dutyRowId: id });

  const closeModal = () => setModal(prev => ({ ...prev, open: false }));

  const saveDuty = (product: Product, country: Country, rate: number) => {
    setDutyRows(prev => {
      const idx = prev.findIndex(r => r.product === product.name && r.country === country.name);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], dutyRate: rate };
        return updated;
      }
      return [...prev, { _id: Date.now().toString(), product: product.name, country: country.name, dutyRate: rate }];
    });
    closeModal();
  };

  const addCountry = () => {
    if (!newCountry.trim()) return;
    setCountries(prev => [...prev, { _id: Date.now().toString(), name: newCountry.trim() }]);
    setNewCountry('');
    setShowAddCountry(false);
  };

  const addProduct = () => {
    if (!newProduct.trim()) return;
    setProducts(prev => [...prev, { _id: Date.now().toString(), name: newProduct.trim() }]);
    setNewProduct('');
    setShowAddProduct(false);
  };

  // ---------- UI ----------
  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1 cursor-pointer" onClick={() => router.push('/ep/settings')}>
            <Image src="/icons/arrow_left.svg" width={8} height={8} alt="Back" />
            <h1 className="text-lg font-semibold">Import Duty Matrix (Demo)</h1>
          </div>
          <p className="text-sm text-muted-foreground">Dummy data – backend disabled</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => download(toCsv(products, countries, dutyMatrix))}
            className="border px-4 py-2 rounded text-sm flex items-center gap-2"
          >
            <Image src="/icons/export.svg" width={16} height={16} alt="CSV" /> Export CSV
          </button>
        </div>
      </div>

      {/* Search & Add buttons */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <div className="relative">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products"
            className="border rounded pl-9 pr-3 py-2 text-sm w-72"
          />
          <Image src="/icons/magnifying.svg" width={16} height={16} alt="Search" className="absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        <button onClick={() => setShowAddCountry(true)} className="bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm">Add Country</button>
        <button onClick={() => setShowAddProduct(true)} className="bg-green-100 text-green-700 px-3 py-2 rounded text-sm">Add Product</button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-muted">
            <tr>
              <th className="sticky left-0 bg-muted px-4 py-2 border">Product (HS)</th>
              {countries.map(country => (
                <th key={country._id} className="border px-4 py-2">{country.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products
              .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
              .map(prod => (
                <tr key={prod._id} className="border-t">
                  <td className="sticky left-0 bg-white px-4 py-2 border-r whitespace-nowrap">
                    {prod.name} {prod.hsCode && <span className="text-xs">({prod.hsCode})</span>}
                  </td>
                  {countries.map(ct => {
                    const cell = dutyMatrix[prod.name]?.[ct.name];
                    return (
                      <td key={ct._id} className="border px-4 py-2 text-center">
                        {cell ? (
                          <div className="flex items-center justify-between">
                            <span>{cell.rate}</span>
                            <Image
                              src="/icons/edit_pen.svg"
                              width={16}
                              height={16}
                              alt="Edit"
                              className="cursor-pointer"
                              onClick={() => openEdit(prod, ct, cell.rate, cell.id)}
                            />
                          </div>
                        ) : (
                          <button className="text-blue-600" onClick={() => openAdd(prod, ct)}>+</button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Duty Modal */}
      <DutyModal
        open={modal.open}
        country={modal.country}
        product={modal.product}
        currentRate={modal.currentRate}
        onClose={closeModal}
        onSave={saveDuty}
      />

      {/* Quick Add Country/Product Modals*/}
      {showAddCountry && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-2">Add Country</h2>
            <input value={newCountry} onChange={e => setNewCountry(e.target.value)} className="border p-2 w-full mb-4 rounded" placeholder="Country name" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowAddCountry(false)} className="px-4 py-2">Cancel</button>
              <button onClick={addCountry} className="px-4 py-2 bg-primary text-white rounded">Add</button>
            </div>
          </div>
        </div>
      )}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-2">Add Product</h2>
            <input value={newProduct} onChange={e => setNewProduct(e.target.value)} className="border p-2 w-full mb-4 rounded" placeholder="Product name" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowAddProduct(false)} className="px-4 py-2">Cancel</button>
              <button onClick={addProduct} className="px-4 py-2 bg-primary text-white rounded">Add</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}