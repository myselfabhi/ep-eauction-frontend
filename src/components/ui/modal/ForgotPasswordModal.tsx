'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services';
import { ROUTES, ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/lib';
import Loader from '@/components/shared/Loader';

export default function ForgotPasswordModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [stage, setStage] = useState<'email' | 'otp' | 'reset'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      resetState();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const resetState = () => {
    setEmail('');
    setOtp('');
    setNewPassword('');
    setRetypePassword('');
    setStage('email');
    setError('');
    setSuccess('');
    setLoading(false);
  };

  const handleSendOtp = async () => {
    if (!email) return;
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setStage('otp');
      setSuccess(SUCCESS_MESSAGES.GENERAL.SAVED);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const msg = error?.response?.data?.message || ERROR_MESSAGES.GENERAL.UNKNOWN_ERROR;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return;
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await authService.verifyForgotOtp(email, otp);
      setStage('reset');
      setSuccess('OTP verified. Set your new password.');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const msg = error?.response?.data?.message || ERROR_MESSAGES.GENERAL.UNKNOWN_ERROR;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !retypePassword) return;
    if (newPassword !== retypePassword) {
      setError(ERROR_MESSAGES.FORM.PASSWORD_MISMATCH);
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await authService.resetPassword(email, otp, newPassword);
      setSuccess(SUCCESS_MESSAGES.AUTH.PASSWORD_RESET);
      setTimeout(() => {
        onClose();
        router.push(ROUTES.AUTH.LOGIN);
      }, 1500);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const msg = error?.response?.data?.message || ERROR_MESSAGES.GENERAL.UNKNOWN_ERROR;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all">
      <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl p-10 flex flex-col items-center gap-y-5">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-2xl text-gray-400 hover:text-gray-700"
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-center text-lg font-semibold mb-4">Forgot Password</h2>

        {loading ? (
          <Loader />
        ) : (
          <>
            {/* Email Input */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#DDE1EB] rounded-lg px-4 py-3 text-base mb-2"
              readOnly={stage !== 'email'}
            />

            {/* OTP Input */}
            {stage === 'otp' && (
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border border-[#DDE1EB] rounded-lg px-4 py-3 text-base mb-2"
              />
            )}

            {/* New Password Fields */}
            {stage === 'reset' && (
              <>
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-[#DDE1EB] rounded-lg px-4 py-3 text-base mb-2"
                />
                <input
                  type="password"
                  placeholder="Retype Password"
                  value={retypePassword}
                  onChange={(e) => setRetypePassword(e.target.value)}
                  className="w-full border border-[#DDE1EB] rounded-lg px-4 py-3 text-base mb-2"
                />
              </>
            )}

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}

            {/* Button Controls */}
            {stage === 'email' && (
              <button
                onClick={handleSendOtp}
                className="w-full bg-[#007AFF] text-white py-3 rounded-lg"
              >
                Send OTP
              </button>
            )}

            {stage === 'otp' && (
              <button
                onClick={handleVerifyOtp}
                className="w-full bg-[#007AFF] text-white py-3 rounded-lg"
              >
                Verify OTP
              </button>
            )}

            {stage === 'reset' && (
              <button
                onClick={handleResetPassword}
                className="w-full bg-[#007AFF] text-white py-3 rounded-lg"
              >
                Reset Password
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
