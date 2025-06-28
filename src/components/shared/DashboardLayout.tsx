'use client';

import EPHeader from './EPHeader';
import Sidebar from './Sidebar';
import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-body flex flex-col">
      {/* Full width header */}
      <EPHeader />

      {/* Sidebar + Main content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-8 bg-white overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
