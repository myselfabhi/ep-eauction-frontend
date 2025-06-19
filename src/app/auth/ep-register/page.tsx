'use client';

import { useState } from 'react';

function validateEmail(email: string) {
  // Simple email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function EpRegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Validation logic
  const errors = {
    name: !form.name.trim() && touched.name ? 'Name is required.' : '',
    email: !form.email.trim() && touched.email
      ? 'Email is required.'
      : form.email && !validateEmail(form.email) && touched.email
      ? 'Enter a valid email address.'
      : '',
    password: !form.password.trim() && touched.password ? 'Password is required.' : '',
    confirmPassword:
      !form.confirmPassword.trim() && touched.confirmPassword
        ? 'Confirm your password.'
        : form.confirmPassword &&
          form.password !== form.confirmPassword &&
          touched.confirmPassword
        ? 'Passwords do not match.'
        : '',
  };

  const isFormValid =
    form.name.trim() &&
    form.email.trim() &&
    validateEmail(form.email) &&
    form.password.trim() &&
    form.confirmPassword.trim() &&
    form.password === form.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/create-ep-member`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
      }),
    });
    setLoading(false);
    if (res.ok) {
      alert('EP Member registered successfully!');
      setForm({ name: '', email: '', password: '', confirmPassword: '' });
      setTouched({
        name: false,
        email: false,
        password: false,
        confirmPassword: false,
      });
    } else {
      const data = await res.json();
      alert(data.message || 'Registration failed');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow max-w-md w-full space-y-4"
        autoComplete="off"
      >
        <h1 className="text-xl font-bold mb-4 text-center">Create Account</h1>

        {/* Name Input */}
        <div>
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            className={`w-full border p-2 rounded text-sm ${
              errors.name ? 'border-red-500' : ''
            }`}
            required
          />
          {errors.name && (
            <p className="text-xs text-red-600 mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email Input */}
        <div>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            className={`w-full border p-2 rounded text-sm ${
              errors.email ? 'border-red-500' : ''
            }`}
            required
          />
          {errors.email && (
            <p className="text-xs text-red-600 mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={form.password}
            onChange={(e) => handleChange('password', e.target.value)}
            onBlur={() => handleBlur('password')}
            className={`w-full border p-2 rounded text-sm pr-12 ${
              errors.password ? 'border-red-500' : ''
            }`}
            required
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-600"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
          {errors.password && (
            <p className="text-xs text-red-600 mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password Input */}
        <div>
          <input
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            onBlur={() => handleBlur('confirmPassword')}
            className={`w-full border p-2 rounded text-sm ${
              errors.confirmPassword ? 'border-red-500' : ''
            }`}
            required
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid || loading}
          className={`w-full bg-blue-600 text-white py-2 rounded font-medium ${
            !isFormValid || loading ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </main>
  );
}
