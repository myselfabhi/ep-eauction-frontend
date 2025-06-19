'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import OtpModal from '@/components/OtpModal';

export default function LoginPage() {
  const router = useRouter();
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [email, setEmail] = useState('demo@eauction.com');
const [password, setPassword] = useState('password123');

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(''); // Clear previous errors
//     try {
// await axios.post('http://localhost:5000/api/auth/login', { email, password });
// setShowOtp(true);

// } catch (err) {
//   const error = err as AxiosError<{ message?: string }>;
//   const message = error.response?.data?.message;
//   if (message && message.toLowerCase().includes('invalid')) {
//     setError('Invalid email or password.');
//   } else {
//     setError(message || 'Login failed. Please try again.');
//   }
// }
//   };

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  // Skip real API call, directly simulate success
  const dummyToken = 'FAKE_JWT_TOKEN';
  const dummyRole = email.includes('supplier') ? 'supplier' : 'ep'; // Change logic if needed

  localStorage.setItem('token', dummyToken);
  router.push(dummyRole === 'supplier' ? '/supplier/dashboard' : '/ep/dashboard');
};


  const handleOtpVerified = (token: string, role: string) => {
    localStorage.setItem('token', token);
    router.push(role === 'supplier' ? '/supplier/dashboard' : '/ep/dashboard');
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm"
      >
        <h2 className="text-center text-base font-semibold mb-6">
          Login into your account
        </h2>

        {/* Error message shown here */}
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

        <div className="mb-6">
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

        <button
  type="button"
  onClick={() => {
    setEmail('ep@eauction.com'); // or 'supplier@eauction.com'
    setPassword('password123');
  }}
  className="w-full mb-3 bg-gray-100 text-gray-800 text-sm font-medium py-2 rounded border hover:bg-gray-200 transition"
>
  Use Dummy Account
</button>

        <button
          type="submit"
          className="w-full bg-[#007AFF] text-white text-sm font-medium py-2 rounded hover:opacity-90 transition"
        >
          Login
        </button>

        {/* Register link */}
        <div className="mt-6 text-center">
          <span className="text-sm text-gray-600">New user?{' '}</span>
          <button
            type="button"
            onClick={() => router.push('/auth/ep-register')}
            className="text-sm text-blue-600 underline hover:no-underline hover:text-blue-800 transition"
          >
            Register here
          </button>
        </div>
      </form>
      <OtpModal
        email={email}
        open={showOtp}
        onClose={() => setShowOtp(false)}
        onVerified={handleOtpVerified}
      />
    </main>
  );
}
