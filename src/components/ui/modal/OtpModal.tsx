'use client';

import { useEffect, useState } from 'react';
import Loader from '@/components/shared/Loader';

export default function OtpModal({
  email,
  open,
  onClose,
  onVerified,
}: {
  email: string;
  open: boolean;
  onClose: () => void;
  onVerified: (token: string, user: { id: string; name: string; role: string }) => void;
}) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);

  function isErrorWithMessage(e: unknown): e is { message: string } {
    return (
      typeof e === 'object' &&
      e !== null &&
      'message' in e &&
      typeof (e as Record<string, unknown>).message === 'string'
    );
  }

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (open && resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer, open]);

  const handleVerify = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('https://ep-backend-j7fq.onrender.com/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      if (!res.ok) throw await res.json();
const data = await res.json();

// Save user in localStorage
localStorage.setItem('epUser', JSON.stringify(data.user));

// Continue with existing flow
onVerified(data.token, data.user);
onClose();

    } catch (err) {
      if (isErrorWithMessage(err)) {
        setError(err.message);
      } else {
        setError('Verification failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    try {
      await fetch('https://ep-backend-j7fq.onrender.com/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setResendTimer(30);
    } catch {
      setError('Failed to resend OTP');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all">
      <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl p-10 flex flex-col items-center gap-y-5">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-2xl text-gray-400 hover:text-gray-700"
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-center text-lg font-semibold mb-4">Enter OTP</h2>
        {loading ? (
          <Loader />
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="w-full border border-[#DDE1EB] rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              autoFocus
            />
            {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
            <button
              onClick={handleVerify}
              disabled={loading || otp.length !== 6}
              className="w-full bg-[#007AFF] text-white text-base font-medium py-3 rounded-lg hover:opacity-90 transition mb-1 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <div className="mt-2 text-sm text-center w-full">
              {resendTimer > 0 ? (
                <span className="text-gray-500">Resend OTP in {resendTimer}s</span>
              ) : (
                <button
                  className="text-blue-600 underline hover:no-underline hover:text-blue-800 transition"
                  onClick={handleResendOtp}
                  disabled={loading}
                >
                  Resend OTP
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
