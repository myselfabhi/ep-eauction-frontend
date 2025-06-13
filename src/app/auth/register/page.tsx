'use client';

import { useState,  memo } from 'react';

type LotId = 'LOT-001' | 'LOT-002' | 'LOT-003';

const AgreementScreen = memo(function AgreementScreen({ setStep }: { setStep: (step: number) => void }) {
  console.log('Rendering AgreementScreen');
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4 text-gray-900">
      <div className="bg-white p-8 rounded shadow max-w-md text-center">
        <h1 className="text-xl font-bold mb-4">EP Auction Participation Agreement</h1>
        <p className="text-sm  mb-6">
          By proceeding, you confirm that your company agrees to abide by all EP Auction rules and conditions including pricing, quality, and delivery terms.
        </p>
        <button
          onClick={() => setStep(1)}
          className="bg-blue-600 text-white px-6 py-2 rounded font-medium"
        >
          I Agree & Continue
        </button>
      </div>
    </main>
  );
});

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
    capacities: Record<LotId, string>;
  };
  handleChange: (field: keyof typeof form, value: string) => void;
}) => {
  const [agreed, setAgreed] = useState(false);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#f9fafb] p-6 text-gray-900">
      <h1 className="text-2xl font-bold mb-1">Participant Onboarding</h1>
      <p className="text-sm  mb-6">
        Complete your registration to access the live auction
      </p>

      {/* Stepper */}
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm">1. Company Information</div>
        <div className="bg-gray-200  px-4 py-1 rounded-full text-sm">2. Carton Capacity</div>
      </div>

      {/* Form card */}
      <div className="bg-white w-full max-w-xl p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Company Information</h2>
        <p className="text-sm  mb-4">Please provide your company details</p>

        <div className="grid gap-4 mb-4">
          <input
            placeholder="Business Name *"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full border p-2 rounded text-sm"
          />
          <select
            value={form.port}
            onChange={(e) => handleChange('port', e.target.value)}
            className="w-full border p-2 rounded text-sm "
          >
            <option value="">Select Port of Loading *</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Chennai">Chennai</option>
            <option value="Kolkata">Kolkata</option>
          </select>
          <select
            value={form.country}
            onChange={(e) => handleChange('country', e.target.value)}
            className="w-full border p-2 rounded text-sm "
          >
            <option value="">Select Country *</option>
            <option value="India">India</option>
            <option value="UAE">UAE</option>
            <option value="UK">UK</option>
          </select>
        </div>

        <div className="flex items-start gap-2 mb-6">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1"
          />
          <span className="text-sm ">
            I confirm the above information is accurate and up to date.
          </span>
        </div>

        <button
          disabled={!agreed}
          onClick={() => setStep(2)}
          className={`w-full py-2 text-white rounded ${
            agreed ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </div>
    </main>
  );
};


const StepTwo = ({
  setStep,
  form,
  handleCapacityChange,
}: {
  setStep: (step: number) => void;
  form: {
    capacities: Record<LotId, string>;
  };
  handleCapacityChange: (lot: LotId, value: string) => void;
}) => {
  const [agreed, setAgreed] = useState(false);

  const lots: { id: LotId; label: string }[] = [
    { id: 'LOT-001', label: 'Kraft Boxes – Standard Size' },
    { id: 'LOT-002', label: 'Corrugated Shipping Boxes' },
    { id: 'LOT-003', label: 'Premium Packaging Boxes' },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#f9fafb] p-6 text-gray-900">
      <h1 className="text-2xl font-bold mb-1">Participant Onboarding</h1>
      <p className="text-sm  mb-6">
        Complete your registration to access the live auction
      </p>

      {/* Stepper */}
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-green-600 text-white px-4 py-1 rounded-full text-sm">
          1. Company Information
        </div>
        <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm">
          2. Carton Capacity
        </div>
      </div>

      {/* Form card */}
      <div className="bg-white w-full max-w-xl p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Carton Capacity</h2>
        <p className="text-sm  mb-4">
          Specify your capacity for each product
        </p>

        <div className="space-y-4 mb-6">
          {lots.map((lot) => (
            <div key={lot.id}>
              <label className="block text-sm font-semibold mb-1">{lot.id}</label>
              <p className="text-xs  mb-1">{lot.label}</p>
              <input
                placeholder="Carton/container"
                value={form.capacities[lot.id]}
                onChange={(e) => handleCapacityChange(lot.id, e.target.value)}
                className="w-full border p-2 rounded text-sm"
              />
            </div>
          ))}
        </div>

        <div className="flex items-start gap-2 mb-6">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1"
          />
          <span className="text-sm ">
            I agree to the auction participation terms and conditions, including pricing commitments and delivery schedules.
          </span>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setStep(1)}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded text-sm"
          >
            Back
          </button>
          <button
            disabled={!agreed}
            onClick={() => setStep(3)}
            className={`px-4 py-2 rounded text-sm text-white ${
              agreed ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Submit & Enter Auction
          </button>
        </div>
      </div>
    </main>
  );
};


const SuccessScreen = memo(function SuccessScreen() {
  console.log('Rendering SuccessScreen');
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-green-50 text-gray-900">
      <div className="bg-white p-8 rounded shadow-md max-w-md">
        <h1 className="text-2xl font-bold mb-2">🎉 Account Created Successfully</h1>
        <p className="text-sm  mb-6">
          You can now access your dashboard and participate in auctions.
        </p>
        <button
          className="bg-green-600 text-white px-6 py-2 rounded font-medium"
          onClick={() => (window.location.href = '/supplier/dashboard')}
        >
          Continue to Dashboard
        </button>
      </div>
    </main>
  );
});

export default function SupplierRegister() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<{
    name: string;
    type: string;
    regNo: string;
    year: string;
    port: string;
    country: string;
    city: string;
    capacities: Record<LotId, string>;
  }>({
    name: '',
    type: '',
    regNo: '',
    year: '',
    port: '',
    country: '',
    city: '',
    capacities: {
      'LOT-001': '',
      'LOT-002': '',
      'LOT-003': '',
    },
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    console.log(`Updating ${field} with value: ${value}`);
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCapacityChange = (lot: LotId, value: string) => {
    console.log(`Updating capacity for ${lot} with value: ${value}`);
    setForm((prev) => ({
      ...prev,
      capacities: {
        ...prev.capacities,
        [lot]: value,
      },
    }));
  };

  if (step === 0) return <AgreementScreen setStep={setStep} />;
  if (step === 1) return <StepOne setStep={setStep} form={form} handleChange={handleChange} />;
  if (step === 2) return (
    <StepTwo
      setStep={setStep}
      form={form}
      handleCapacityChange={handleCapacityChange}
    />
  );
  return <SuccessScreen />;
}