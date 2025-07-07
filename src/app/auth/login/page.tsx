'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import OtpModal from '@/components/ui/modal/OtpModal';
import Loader from '@/components/shared/Loader';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        email,
        password,
      });
      setShowOtp(true);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const message = error?.response?.data?.message;

      setError(
        message?.toLowerCase().includes('invalid')
          ? 'Invalid email or password.'
          : message || 'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

const handleOtpVerified = (
  token: string,
  user: { id: string; name: string; role: string }
) => {
  localStorage.setItem('token', token);
  localStorage.setItem('epUser', JSON.stringify(user));

  const role = user.role.toLowerCase();

  const epMemberRoles = ['admin', 'viewer', 'manager'];

  if (epMemberRoles.includes(role)) {
    router.push('/ep-member/dashboard');
  } else if (role === 'supplier') {
    router.push('/supplier/dashboard');
  } else {
    router.push('/unauthorized'); // Optional fallback for unknown roles
  }
};


  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-4">
      {loading ? (
        <Loader />
      ) : (
        <form
          onSubmit={handleLogin}
          className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm"
        >
          <h2 className="text-center text-base font-semibold mb-6">
            Login into your account
          </h2>

          {/* Error message */}
          {error && (
            <p className="text-red-600 text-sm text-center mb-4">{error}</p>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#DDE1EB] rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-[#DDE1EB] rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center text-xs text-blue-600"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right text-xs mb-4">
            <button
              type="button"
              onClick={() => router.push('/auth/forgot-password')}
              className="text-blue-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-[#007AFF] text-white text-sm font-medium py-2 rounded hover:opacity-90 transition"
          >
            {loading ? <Loader /> : 'Login'}
          </button>

          {/* Register link (optional) */}
          {/* <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">New user? </span>
            <button
              type="button"
              onClick={() => router.push('/auth/ep-register')}
              className="text-sm text-blue-600 underline hover:no-underline hover:text-blue-800 transition"
            >
              Register here
            </button>
          </div> */}
        </form>
      )}

      <OtpModal
        email={email}
        open={showOtp}
        onClose={() => setShowOtp(false)}
        onVerified={handleOtpVerified}
      />
    </main>
  );
}
