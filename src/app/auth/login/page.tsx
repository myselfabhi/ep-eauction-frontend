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
    <main className="min-h-screen flex items-center justify-center bg-background px-4">

      <form
        onSubmit={handleLogin}
        className="bg-white rounded-lg p-8 shadow-card w-full max-w-sm"
      >
        <h2 className="text-center text-lg font-semibold mb-6 text-body">Login</h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full border border-borderInput rounded px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-1 focus:ring-primary text-body placeholder-muted"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email Address"
          className="w-full border border-borderInput rounded px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-1 focus:ring-primary text-body placeholder-muted"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-primary text-white text-sm py-2 rounded mb-4 hover:opacity-90 transition"
        >
          Proceed
        </button>

        <p className="text-center text-xs text-muted mb-3">or</p>

        <button
          type="button"
          className="w-full border border-borderInput text-sm py-2 rounded hover:bg-background transition text-body"
        >
          Google
        </button>
      </form>
    </main>
  );
}
