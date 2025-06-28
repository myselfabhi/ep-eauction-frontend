'use client';

import EPHeader from './EPHeader';
import { ReactNode } from 'react';

export default function SupplierLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-body flex flex-col">
      {/* Full width header */}
      <EPHeader />

      {/* Main content only (no sidebar) */}
      <main className="flex-1 p-0 bg-background overflow-auto">
        {children}
      </main>
    </div>
  );
}
