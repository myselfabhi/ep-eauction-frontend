'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  // helper to check if the current link is active
  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <aside className="w-64 bg-white p-12 border-r border-border flex flex-col gap-8 h-screen text-body">
      <nav className="flex flex-col gap-6 text-base font-medium">
        <Link
          href="/ep/dashboard"
          className={`flex items-center gap-3 hover:text-status-scheduled ${
            isActive('/ep/dashboard') ? 'text-status-scheduled' : ''
          }`}
        >
          <Image width={5} height={5} src="/icons/auctions_dashboard.svg"  alt="Auctions" className="w-5 h-5" />
          Auctions
        </Link>

        <Link
          href="/ep/suppliers"
          className={`flex items-center gap-3 hover:text-status-scheduled ${
            isActive('/ep/suppliers') ? 'text-status-scheduled' : ''
          }`}
        >
          <Image width={5} height={5} src="/icons/group.svg"  alt="Suppliers" className="w-5 h-5" />
          Suppliers
        </Link>

        <Link
          href="/ep/settings"
          className={`flex items-center gap-3 hover:text-status-scheduled ${
            isActive('/ep/settings') ? 'text-status-scheduled' : ''
          }`}
        >
          <Image width={5} height={5} src="/icons/profile_settings.svg"  alt="Settings" className="w-5 h-5" />
          Settings
        </Link>
      </nav>
    </aside>
  );
}
