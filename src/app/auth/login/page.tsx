'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('ep')) {
      router.push('/ep/dashboard');
    } else {
      router.push('/supplier/dashboard');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white rounded-lg p-8 shadow w-full max-w-sm"
      >
        <h2 className="text-center text-lg font-semibold mb-6 text-black">Login</h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full border border-black rounded px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-1 focus:ring-black text-black placeholder-black"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email Address"
          className="w-full border border-black rounded px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-1 focus:ring-black text-black placeholder-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-black text-white text-sm py-2 rounded mb-4 hover:opacity-90 transition"
        >
          Proceed
        </button>

        <p className="text-center text-xs text-black mb-3">or</p>

        <button
          type="button"
          className="w-full border border-black text-sm py-2 rounded hover:bg-gray-50 transition text-black"
        >
          Google
        </button>
      </form>
    </main>
  );
}
