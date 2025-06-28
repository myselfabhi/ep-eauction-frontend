'use client';

import { useState, memo } from 'react';
import OnboardingBreadcrumb from '@/components/shared/OnboardingBreadcrumb'; 

const lotsList = [
  { id: 'LOT-001', label: 'Kraft Boxes - Standard Size' },
  { id: 'LOT-002', label: 'Corrugated Shipping Boxes' },
  { id: 'LOT-003', label: 'Premium Packaging Boxes' },
] as const;

type LotId = typeof lotsList[number]['id'];

const onboardingSteps = ['Company information', 'Carton capacity'];

const StepOne = ({
  setStep,
  form,
  handleChange,
}: {
  setStep: (step: number) => void;
  form: {
    name: string;
    port: string;
    country: string;
  };
  handleChange: (field: keyof typeof form, value: string) => void;
}) => {
  const [agreed, setAgreed] = useState(false);
  const canProceed = agreed && form.name && form.port && form.country;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans text-gray-700">
      <div className="max-w-md w-full px-4 py-10">
        <h2 className="text-center font-semibold text-lg text-gray-900 mb-1">Participant Onboarding</h2>
        <p className="text-center text-sm text-gray-500 mb-8">Complete your registration to access the live auction</p>
        <OnboardingBreadcrumb
          steps={onboardingSteps}
          currentStep={0}
          onStepClick={() => {}}
        />

        <form
          className="bg-white rounded-xl p-8 shadow-sm border border-gray-200"
          style={{ width: 420, minHeight: 420 }}
          onSubmit={e => {
            e.preventDefault();
            if (canProceed) setStep(1);
          }}
          autoComplete="off"
        >
          <fieldset>
            <legend className="font-medium text-center text-gray-800 mb-4">Company Information</legend>
            <p className="text-center text-xs text-gray-500 mb-6">Please provide your company details</p>

            <div className="space-y-5 mb-6">
              <div>
                <label className="block text-xs font-semibold mb-1">Business Name *</label>
                <input
                  type="text"
                  placeholder="LOT ID / Product ID"
                  value={form.name}
                  onChange={e => handleChange('name', e.target.value)}
                  className="w-full border border-gray-200 rounded-md text-xs px-3 py-2 text-gray-700 placeholder:text-gray-300 focus:border-blue-400 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Port of Loading *</label>
                <select
                  value={form.port}
                  onChange={e => handleChange('port', e.target.value)}
                  className="w-full border border-gray-200 rounded-md text-xs px-3 py-2 text-gray-700 placeholder:text-gray-300 focus:border-blue-400 focus:outline-none"
                  required
                >
                  <option value="">Select from port list</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Kolkata">Kolkata</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Country *</label>
                <select
                  value={form.country}
                  onChange={e => handleChange('country', e.target.value)}
                  className="w-full border border-gray-200 rounded-md text-xs px-3 py-2 text-gray-700 placeholder:text-gray-300 focus:border-blue-400 focus:outline-none"
                  required
                >
                  <option value="">Select from port list</option>
                  <option value="India">India</option>
                  <option value="UAE">UAE</option>
                  <option value="UK">UK</option>
                </select>
              </div>
            </div>
          </fieldset>

          <div className="mb-6 text-xs text-gray-600 flex items-start gap-2">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              className="mt-[0.15rem] h-3 w-3 rounded border-gray-300 text-blue-600 focus:ring-blue-400"
            />
            <label htmlFor="agree" className="select-none leading-snug cursor-pointer">
              I confirm the above information is accurate and up-to-date.
            </label>
          </div>

          <button
            type="submit"
            className={`w-full bg-blue-600 text-white rounded-md text-sm py-2 transition font-semibold ${
              canProceed ? 'hover:bg-blue-700 cursor-pointer' : 'opacity-60 cursor-not-allowed'
            }`}
            disabled={!canProceed}
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
};

const StepTwo = ({
  setStep,
  capacities,
  handleCapacityChange,
  onSubmit,
  loading,
}: {
  setStep: (step: number) => void;
  capacities: Record<LotId, string>;
  handleCapacityChange: (lot: LotId, value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}) => {
  const [agreed, setAgreed] = useState(false);
  const allFilled = lotsList.every(lot => capacities[lot.id]);
  const canSubmit = agreed && allFilled && !loading;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans text-gray-700">
      <div className="max-w-md w-full px-6 py-10">
        <h2 className="text-center font-semibold text-lg text-gray-900 mb-1">Participant Onboarding</h2>
        <p className="text-center text-sm text-gray-500 mb-8">Complete your registration to access the live auction</p>
        <OnboardingBreadcrumb
          steps={onboardingSteps}
          currentStep={1}
          onStepClick={() => {}}
        />

        <form
          className="bg-white rounded-xl p-8 shadow-sm border border-gray-200"
          style={{ width: 420, minHeight: 430 }}
          onSubmit={e => {
            e.preventDefault();
            if (canSubmit) onSubmit();
          }}
          autoComplete="off"
        >
          <fieldset className="mb-6">
            <legend className="font-medium text-center text-gray-800 mb-4">Carton Capacity</legend>
            <p className="text-center text-xs text-gray-500 mb-6">Specify your capacity for each product</p>

            <div className="space-y-5">
              {lotsList.map(lot => (
                <div className="flex items-center justify-between gap-3" key={lot.id + lot.label}>
                  <div className="text-xs text-gray-600 max-w-[65%] leading-snug">
                    <p className="font-semibold uppercase text-gray-700">{lot.id}</p>
                    <p className="max-w-[13rem] truncate">{lot.label}</p>
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    aria-label={`Carton/container quantity for ${lot.label}`}
                    placeholder="Carton/container"
                    value={capacities[lot.id] || ''}
                    onChange={e => handleCapacityChange(lot.id, e.target.value)}
                    className="w-36 border border-gray-200 rounded-md text-xs px-3 py-1.5 text-gray-500 placeholder:text-gray-300 focus:border-indigo-400 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </fieldset>

          <div className="mb-5 text-xs text-gray-600 flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              className="mt-[0.15rem] h-3 w-3 rounded border-gray-300 text-green-600 focus:ring-green-400"
            />
            <label htmlFor="terms" className="select-none leading-snug cursor-pointer">
              I agree to the auction participation terms and conditions, including pricing commitments and delivery schedules.
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              className="flex-1 border border-gray-300 rounded-md text-gray-700 text-sm py-2 hover:bg-gray-100 transition"
              onClick={() => setStep(0)}
              disabled={loading}
            >
              Back
            </button>
            <button
              type="submit"
              className={`flex-1 bg-green-700 text-white rounded-md text-sm py-2 transition ${
                canSubmit ? 'hover:bg-green-800' : 'opacity-60 cursor-not-allowed'
              }`}
              disabled={!canSubmit}
            >
              {loading ? 'Submitting...' : 'Submit & Enter auction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SuccessScreen = memo(function SuccessScreen({ onConfirm }: { onConfirm?: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm w-[350px] max-w-full px-7 py-7 flex flex-col items-center relative">
        <div className="mb-4 mt-2">
          <div className="bg-green-100 rounded-xl flex items-center justify-center w-14 h-14 mx-auto">
            <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="12" fill="#D1FADF" />
              <path
                d="M8 12.5l2.5 2.5 5-5"
                stroke="#16A34A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1"> Onboarding Complete!</h2>
        <div className="text-gray-500 text-sm mb-6 text-center">
          You can now access your dashboard and participate in auctions.
        </div>
        <button
          className="w-full bg-green-400 hover:bg-green-500 text-white rounded-full py-2.5 text-base font-medium shadow-sm transition"
          onClick={onConfirm ?? (() => window.location.href = '/supplier/dashboard')}
        >
          Continue to Dashboard
        </button>
      </div>
    </div>
  );
});

export default function SupplierAuctionOnboarding() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<{
    name: string;
    port: string;
    country: string;
    capacities: Record<LotId, string>;
  }>({
    name: '',
    port: '',
    country: '',
    capacities: Object.fromEntries(lotsList.map(l => [l.id, ''])) as Record<LotId, string>,
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCapacityChange = (lot: LotId, value: string) => {
    setForm((prev) => ({
      ...prev,
      capacities: {
        ...prev.capacities,
        [lot]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 900);
  };

  if (step === 0)
    return (
      <StepOne
        setStep={setStep}
        form={form}
        handleChange={handleChange}
      />
    );
  if (step === 1)
    return (
      <StepTwo
        setStep={setStep}
        capacities={form.capacities}
        handleCapacityChange={handleCapacityChange}
        onSubmit={handleSubmit}
        loading={loading}
      />
    );
  return <SuccessScreen />;
}
