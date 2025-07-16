"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib';

export default function SupplierCheckEmailPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/by-email?email=${encodeURIComponent(email)}`);
      const user = await res.json();
      if (user && user._id) {
        // User exists, redirect to login
        router.replace(ROUTES.AUTH.LOGIN);
      } else {
        // User does not exist, redirect to onboarding
        router.replace(`/supplier/onboarding?email=${encodeURIComponent(email)}`);
      }
    } catch (err) {
      console.error('Check email error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleCheck} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Supplier Onboarding</h2>
        <label className="block mb-2 text-sm font-medium text-gray-700">Enter your email to continue</label>
        <input
          type="email"
          className="w-full border rounded px-3 py-2 mb-4"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Checking...' : 'Confirm'}
        </button>
      </form>
    </div>
  );
} 