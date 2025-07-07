'use client';

import { useState } from 'react';

export default function OnboardingModal({
  onComplete,
}: {
  onComplete: (data: { name: string; port: string; country: string }) => void;
}) {
  const [form, setForm] = useState({ name: '', port: '', country: '' });
  const [agreed, setAgreed] = useState(false);

  const canProceed = agreed && form.name && form.port && form.country;

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canProceed) onComplete(form);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 px-8 py-7 w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Participant Onboarding</h2>
          <p className="text-sm text-gray-500 mt-1">
            Please fill in your company details to access the dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="space-y-4 mb-5">
            <div>
              <label className="text-xs font-semibold mb-1 block">Business Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => handleChange('name', e.target.value)}
                className="w-full border border-gray-200 rounded-md text-xs px-3 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="Your Company Name"
              />
            </div>

            <div>
              <label className="text-xs font-semibold mb-1 block">Port of Loading *</label>
              <select
                value={form.port}
                onChange={e => handleChange('port', e.target.value)}
                className="w-full border border-gray-200 rounded-md text-xs px-3 py-2 focus:border-blue-500 focus:outline-none"
              >
                <option value="">Select from port list</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Chennai">Chennai</option>
                <option value="Kolkata">Kolkata</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold mb-1 block">Country *</label>
              <select
                value={form.country}
                onChange={e => handleChange('country', e.target.value)}
                className="w-full border border-gray-200 rounded-md text-xs px-3 py-2 focus:border-blue-500 focus:outline-none"
              >
                <option value="">Select from country list</option>
                <option value="India">India</option>
                <option value="UAE">UAE</option>
                <option value="UK">UK</option>
              </select>
            </div>
          </div>

          <div className="flex items-start text-xs text-gray-600 mb-4 gap-2">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              className="mt-[0.15rem] h-3 w-3 rounded border-gray-300 text-blue-600"
            />
            <label htmlFor="agree" className="cursor-pointer select-none">
              I confirm the above information is accurate and up-to-date.
            </label>
          </div>

          <button
            type="submit"
            className={`w-full bg-blue-600 text-white rounded-md text-sm py-2 font-semibold ${
              canProceed ? 'hover:bg-blue-700' : 'opacity-60 cursor-not-allowed'
            }`}
            disabled={!canProceed}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
