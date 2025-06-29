'use client';

import EPHeader from './EPHeader';
import Sidebar from './Sidebar';
import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen w-screen overflow-hidden bg-background text-body">
      {/* Fixed header */}
      <EPHeader />

      {/* Sidebar + Scrollable Main content */}
      <div className="flex h-[calc(100vh-64px)]"> {/* 64px = header height */}
        {/* Fixed Sidebar */}
        <div className="w-64 border-r border-border h-full">
          <Sidebar />
        </div>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-8 bg-white mb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
