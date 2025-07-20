'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/shared/DashboardLayout';
import axios from 'axios';

type SupplierResponse = {
  _id: string;
  name?: string;
  email?: string;
  profile?: {
    companyName?: string;
    country?: string;
  };
};

type Supplier = {
  _id: string;
  name: string;
  email: string;
  businessName: string;
  country: string;
};

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Load dummy data on mount
  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/supplier/allsupplier`;
    axios.get(url)
      .then(res => {
        const data: SupplierResponse[] = Array.isArray(res.data) ? res.data : [];
        setSuppliers(
          data.map((s) => ({
            _id: s._id,
            name: s.name || '',
            email: s.email || '',
            businessName: s.profile?.companyName || '',
            country: s.profile?.country || '',
          }))
        );
      })
      .catch(err => {
        setSuppliers([]);
        console.error('Error fetching suppliers:', err);
      });
  }, []);

  const handleDeleteSupplier = (id: string) => {
    if (confirm('Are you sure you want to delete this supplier?')) {
      setSuppliers(suppliers.filter((s) => s._id !== id));
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-lg font-semibold mb-1">Suppliers</h1>
          <p className="text-sm text-gray-600">Manage your suppliers list</p>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, email or country"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full max-w-sm"
        />
      </div>

      <div className="border border-gray-200 rounded overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Business Name</th>
              <th className="px-4 py-2">Country</th>
            </tr>
          </thead>
          <tbody>
            {suppliers
              .filter(
                (s) =>
                  s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  s.country.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((s) => (
                <tr key={s._id} className="border-t">
                  <td className="px-4 py-2">{s.name}</td>
                  <td className="px-4 py-2">{s.email}</td>
                  <td className="px-4 py-2">{s.businessName}</td>
                  <td className="px-4 py-2">{s.country}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
