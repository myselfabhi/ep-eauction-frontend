'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EPHeader() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('epUser');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setName(user.name || '');
      } catch (err) {
        console.error('Invalid user in localStorage:', err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('epUser');
    localStorage.removeItem('epToken');
    router.push('/');
  };

  return (
    <header className="flex justify-between items-center px-14 py-8 bg-white border-b border-border text-body relative">
      {/* Logo */}
      <div
        className="text-xl font-bold cursor-pointer"
        onClick={() => router.push('/ep-member/dashboard')}
      >
        EP Auction
      </div>

      {/* Profile Section */}
      <div className="flex items-center gap-2 cursor-pointer relative" onClick={() => setShowDropdown(prev => !prev)}>
        <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-sm font-medium">
          {name ? name.charAt(0).toUpperCase() : 'U'}
        </div>
        <span className="text-sm">{name || 'User'}</span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>

        {/* Dropdown */}
        {showDropdown && (
          <div className="absolute right-0 top-14 w-32 bg-white border border-border rounded shadow-md z-10">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
