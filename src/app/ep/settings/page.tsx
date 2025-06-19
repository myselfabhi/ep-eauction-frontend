'use client';

import DashboardLayout from '@/components/DashboardLayout';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-1 text-body">Settings</h1>
      <p className="text-sm  mb-6">
        Manage your account preferences and platform configuration
      </p>

      {/* User Detail Card */}
      <div className="bg-white border border-border rounded-lg p-6 mb-6 space-y-4">
        <h2 className="text-lg font-semibold text-body">User Detail</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-body">Name</label>
            <input
              type="text"
              value="Anab Akhtar"
              readOnly
              className="w-full border border-borderInput px-3 py-2 rounded text-sm bg-background cursor-not-allowed text-body"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-body">Email</label>
            <input
              type="text"
              value="user@email.com"
              readOnly
              className="w-full border border-borderInput px-3 py-2 rounded text-sm bg-background cursor-not-allowed text-body"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-body">Role</label>
            <input
              type="text"
              value="Admin"
              readOnly
              className="w-full border border-borderInput px-3 py-2 rounded text-sm bg-background cursor-not-allowed text-body"
            />
          </div>
        </div>
      </div>

      {/* Import Duty Matrix Card */}
      <div className="bg-white border border-border rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-1 text-body">Import Duty Matrix</h2>
        <p className="text-sm  mb-4">
          Manage country-wise and product-wise import duties used in landed cost calculations
        </p>
        <button
          onClick={() => router.push('/ep/settings/import-duty-matrix')}
          className="border border-borderInput px-4 py-2 rounded text-sm text-body flex items-center gap-2"
        >
          <Image width={5} height={5} src="/icons/edit_pen.svg" alt="Edit" className="w-4 h-4" />
          Edit
        </button>
      </div>

      {/* Weekly currency rate Card */}
      <div className="bg-white border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-1 text-body">Weekly currency rate</h2>
        <p className="text-sm  mb-4">
          Update exchange rates used in landed cost calculations
        </p>
        <button
          onClick={() => router.push('/ep/settings/currency')}
          className="border border-borderInput px-4 py-2 rounded text-sm text-body flex items-center gap-2"
        >
          <Image width={5} height={5} src="/icons/edit_pen.svg" alt="Edit" className="w-4 h-4" />
          Edit
        </button>
      </div>
    </DashboardLayout>
  );
}
