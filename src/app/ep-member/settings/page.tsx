'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import DashboardLayout from '@/components/shared/DashboardLayout';
import InviteUserModal from '@/components/ui/modal/InviteUserModal';

export default function SettingsPage() {
  const router = useRouter();
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const [name, setName] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('epUser');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setName(user.name || '');
        setRole(user.role || '');
      } catch (err) {
        console.error('Invalid user data in localStorage:', err);
      }
    }
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-1 text-body">Settings</h1>
      <p className="text-sm mb-6">
        Manage your account preferences and platform configuration
      </p>

      {/* User Detail Card */}
      <div className="bg-white border border-border rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-body mb-4">User Detail</h2>

        <div className="space-y-4 max-w-sm">
          <div>
            <label className="block text-sm mb-1 text-body">Name</label>
            <input
              type="text"
              value={name}
              readOnly
              className="w-full border border-borderInput px-3 py-2 rounded text-sm bg-background cursor-not-allowed text-body"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-body">Email</label>
            <input
              type="text"
              value="(Coming Soon)"
              readOnly
              className="w-full border border-borderInput px-3 py-2 rounded text-sm bg-background cursor-not-allowed text-body"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-body">Role</label>
            <input
              type="text"
              value={role}
              readOnly
              className="w-full border border-borderInput px-3 py-2 rounded text-sm bg-background cursor-not-allowed text-body"
            />
          </div>

          <button
            onClick={() => setShowAddUserModal(true)}
            className="flex items-center gap-2 text-sm px-4 py-2 border border-borderInput rounded hover:bg-background"
          >
            <Image src="/icons/add.svg" alt="Add" width={16} height={16} />
            Add Users
          </button>
        </div>
      </div>

      {/* Import Duty Matrix Card */}
      <div className="bg-white border border-border rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-1 text-body">Import Duty Matrix</h2>
        <p className="text-sm mb-4">
          Manage country-wise and product-wise import duties used in landed cost calculations
        </p>
        <button
          onClick={() => router.push('/ep-member/settings/import-duty-matrix')}
          className="border border-borderInput px-4 py-2 rounded text-sm text-body flex items-center gap-2"
        >
          <Image width={16} height={16} src="/icons/edit_pen.svg" alt="Edit" className="w-4 h-4" />
          Edit
        </button>
      </div>

      {/* Weekly Currency Rate Card */}
      <div className="bg-white border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-1 text-body">Weekly Currency Rate</h2>
        <p className="text-sm mb-4">
          Update exchange rates used in landed cost calculations
        </p>
        <button
          onClick={() => router.push('/ep-member/settings/currency')}
          className="border border-borderInput px-4 py-2 rounded text-sm text-body flex items-center gap-2"
        >
          <Image width={16} height={16} src="/icons/edit_pen.svg" alt="Edit" className="w-4 h-4" />
          Edit
        </button>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && <InviteUserModal onClose={() => setShowAddUserModal(false)} />}
    </DashboardLayout>
  );
}
