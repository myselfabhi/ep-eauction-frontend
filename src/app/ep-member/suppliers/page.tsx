'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import DashboardLayout from '@/components/shared/DashboardLayout';

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
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSupplier, setNewSupplier] = useState<Partial<Supplier>>({
    name: '',
    email: '',
    businessName: '',
    country: '',
  });

  // Load dummy data on mount
  useEffect(() => {
    setSuppliers([
      {
        _id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        businessName: 'Doe Industries',
        country: 'USA',
      },
      {
        _id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        businessName: 'Smith Exports',
        country: 'UK',
      },
      {
        _id: '3',
        name: 'Akira Tanaka',
        email: 'akira@example.com',
        businessName: 'Tanaka Trading',
        country: 'Japan',
      },
    ]);
  }, []);

  const handleAddSupplier = () => {
    if (!newSupplier.name || !newSupplier.email || !newSupplier.businessName || !newSupplier.country) {
      alert('Please fill all fields');
      return;
    }

    const newEntry: Supplier = {
      _id: (suppliers.length + 1).toString(),
      name: newSupplier.name!,
      email: newSupplier.email!,
      businessName: newSupplier.businessName!,
      country: newSupplier.country!,
    };

    setSuppliers([...suppliers, newEntry]);
    setNewSupplier({ name: '', email: '', businessName: '', country: '' });
    setShowAddModal(false);
  };

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
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-100 text-blue-700 text-sm font-medium px-4 py-2 rounded"
        >
          <Image src="/icons/add.svg" width={16} height={16} alt="Add" />
          Add Supplier
        </button>
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
              <th className="px-4 py-2 text-right">Actions</th>
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
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => handleDeleteSupplier(s._id)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Add Supplier</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={newSupplier.name}
                onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                className="border border-gray-300 rounded w-full p-2"
              />
              <input
                type="email"
                placeholder="Email"
                value={newSupplier.email}
                onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                className="border border-gray-300 rounded w-full p-2"
              />
              <input
                type="text"
                placeholder="Business Name"
                value={newSupplier.businessName}
                onChange={(e) => setNewSupplier({ ...newSupplier, businessName: e.target.value })}
                className="border border-gray-300 rounded w-full p-2"
              />
              <input
                type="text"
                placeholder="Country"
                value={newSupplier.country}
                onChange={(e) => setNewSupplier({ ...newSupplier, country: e.target.value })}
                className="border border-gray-300 rounded w-full p-2"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSupplier}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
