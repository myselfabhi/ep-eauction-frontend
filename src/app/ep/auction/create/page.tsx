'use client';

import { useState } from 'react';
import EPHeader from '@/components/EPHeader';
import AuctionBreadcrumb from '@/components/AuctionBreadcrumb';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const steps = [
  'Auction Details',
  'Product & LOT',
  'Auction Settings',
  'Supplier Invitations',
  'Review & Launch',
];

export default function CreateAuctionPage() {
  const [step, setStep] = useState(0);
  const router = useRouter();

  const goNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  return (
    <div className="flex min-h-screen bg-white text-[#383838] flex-col">
      <EPHeader />

      <main className="flex-1 p-8  max-w-6xl mx-auto">
        <div
          className="flex items-center gap-2 mb-1 cursor-pointer"
          onClick={() => router.push('/ep/dashboard')}
        >
          <Image width={5} height={5} src="/icons/arrow_left.svg" alt="Back" className="w-4 h-4" />
          <h1 className="text-xl font-semibold">Create Auction</h1>
        </div>
        <p className="text-sm text-[#5E5E65] mb-6">
          Fill out the details and create a new auction
        </p>

        {/* Breadcrumb */}
        <AuctionBreadcrumb
  steps={steps}
  currentStep={step}
  onStepClick={(index) => setStep(index)}  // THIS lets user click steps
/>

        {/* Step Content */}
        <div className="bg-white pt-6 rounded border-t border-[#EAECF0]">
          {step === 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Enter basic auction information</h2>
              <p className="text-sm text-[#5E5E65] mb-6">
                Enter the auction title and related reference details
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm mb-1">Title</label>
                  <input
                    type="text"
                    placeholder="Auction title"
                    className="w-full border border-[#DDE1EB] px-3 py-2 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Auction Type</label>
                  <input
                    type="text"
                    placeholder="Single LOTs / Multiple LOTs"
                    className="w-full border border-[#DDE1EB] px-3 py-2 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">SAP Code</label>
                  <input
                    type="text"
                    placeholder="Auction title"
                    className="w-full border border-[#DDE1EB] px-3 py-2 rounded text-sm"
                  />
                </div>
              </div>
            </div>
          )}
          {step === 1 && (
  <div>
    <div className="flex justify-between items-start mb-4">
      <div>
        <h2 className="text-lg font-semibold mb-1">Add product or LOT-level information</h2>
        <p className="text-sm text-[#5E5E65]">
          Enter key details for the products being auctioned
        </p>
      </div>
      <button
        onClick={() => alert('Add New LOT')}
        className="flex items-center gap-2 border border-[#DDE1EB] px-4 py-2 rounded text-sm text-[#383838] font-medium"
      >
        + New Lot
      </button>
    </div>

    <div className="bg-[#F9FAFB] border border-[#EAECF0] rounded p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">LOT ID / Product ID</label>
          <input
            type="text"
            placeholder="LOT ID / Product ID"
            className="w-full bg-white border border-[#DDE1EB] px-3 py-2 rounded text-sm"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">HS Code</label>
          <input
            type="text"
            placeholder="HS Code"
            className="w-full bg-white border border-[#DDE1EB] px-3 py-2 rounded text-sm"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Product Name</label>
          <input
            type="text"
            placeholder="Product Name"
            className="w-full bg-white border border-[#DDE1EB] px-3 py-2 rounded text-sm"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Material Type</label>
          <input
            type="text"
            placeholder="Material Type"
            className="w-full bg-white border border-[#DDE1EB] px-3 py-2 rounded text-sm"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm mb-1">Previous landed cost</label>
          <input
            type="text"
            placeholder="Previous landed cost"
            className="w-full bg-white border border-[#DDE1EB] px-3 py-2 rounded text-sm"
          />
        </div>
      </div>

      {/* Dimensions */}
      <div className="mt-4">
        <label className="block text-sm mb-1">Dimensions</label>
        <div className="grid grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="L"
            className="w-full bg-white border border-[#DDE1EB] px-3 py-2 rounded text-sm"
          />
          <input
            type="text"
            placeholder="W"
            className="w-full bg-white border border-[#DDE1EB] px-3 py-2 rounded text-sm"
          />
          <input
            type="text"
            placeholder="H"
            className="w-full bg-white border border-[#DDE1EB] px-3 py-2 rounded text-sm"
          />
        </div>
      </div>
    </div>
  </div>
)}
{step === 2 && (
  <div>
    <h2 className="text-lg font-semibold mb-2">Set auction behavior and schedule</h2>
    <p className="text-sm text-[#5E5E65] mb-8">
      Configure timing, rules, and auction type
    </p>

    <div className="grid grid-cols-2 gap-4 rounded">
      <div>
        <label className="block text-sm mb-1">Auction Start Date & Time</label>
        <input
          type="datetime-local"
          placeholder="Auction Start Date & Time"
          className="w-full border border-[#DDE1EB] px-3 py-2 rounded text-sm"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Auction End Date & Time</label>
        <input
          type="datetime-local"
          placeholder="Auction End Date & Time"
          className="w-full border border-[#DDE1EB] px-3 py-2 rounded text-sm"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Enable Auto Extension (Checkbox)</label>
        <input
          type="text"
          placeholder="Allow Pause/Resume During Auction (Toggle)"
          className="w-full border border-[#DDE1EB] px-3 py-2 rounded text-sm"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Allow Pause/Resume During Auction (Toggle)</label>
        <input
          type="text"
          placeholder="Allow Pause/Resume During Auction (Toggle)"
          className="w-full border border-[#DDE1EB] px-3 py-2 rounded text-sm"
        />
      </div>
    </div>
  </div>
)}
{step === 3 && (
  <div>
    <h2 className="text-lg font-semibold mb-2">Select and invite suppliers</h2>
    <p className="text-sm text-[#5E5E65] mb-4">
      Only invited suppliers will receive access to this auction
    </p>

    <div className="grid grid-cols-2 gap-4 mb-4  ">
      <div>
        <label className="block text-sm mb-1">Supplier Email Addresses</label>
        <input
          type="text"
          placeholder="Supplier Email Addresses"
          className="w-full border border-[#DDE1EB] px-3 py-2 rounded text-sm"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Selection Dropdown (1 Selected)</label>
        <select
          className="w-full border border-[#DDE1EB] px-3 py-2 rounded text-sm appearance-none"
        >
          <option>Select from supplier list</option>
          <option>Supplier 1</option>
          <option>Supplier 2</option>
        </select>
      </div>
    </div>

    <div >
      <label className="block text-sm mb-1">Preview Email Invitation</label>
      <textarea
        placeholder="Hey, you are invited to the auction..."
        className="w-full border border-[#DDE1EB] px-3 py-2 rounded text-sm"
        rows={6}
      ></textarea>
    </div>
  </div>
)}
{step === 4 && (
  <div>
    <h2 className="text-lg font-semibold mb-2">Review & Launch</h2>
    <p className="text-sm text-[#5E5E65] mb-4">
      This is your final opportunity to review the auction details before launching.
    </p>

    <div className="border border-[#EAECF0] rounded p-6 bg-[#F9FAFB] max-h-[500px] overflow-y-auto space-y-6">
      {/* Auction Details */}
      <div>
        <h3 className="text-base font-semibold mb-2">Auction Details</h3>
        <p className="text-sm mb-1"><strong>Title:</strong> Sample Auction Title</p>
        <p className="text-sm mb-1"><strong>Type:</strong> Single LOT</p>
        <p className="text-sm mb-1"><strong>SAP Code:</strong> 12345</p>
      </div>

      {/* Product & LOT */}
      <div>
        <h3 className="text-base font-semibold mb-2">Product & LOT</h3>
        <p className="text-sm mb-1"><strong>LOT ID:</strong> LOT-001</p>
        <p className="text-sm mb-1"><strong>HS Code:</strong> 4819.10</p>
        <p className="text-sm mb-1"><strong>Product Name:</strong> Kraft Boxes</p>
        <p className="text-sm mb-1"><strong>Material Type:</strong> Paperboard</p>
        <p className="text-sm mb-1"><strong>Previous Landed Cost:</strong> $500</p>
        <p className="text-sm mb-1"><strong>Dimensions:</strong> L: 10cm, W: 10cm, H: 5cm</p>
      </div>

      {/* Auction Settings */}
      <div>
        <h3 className="text-base font-semibold mb-2">Auction Settings</h3>
        <p className="text-sm mb-1"><strong>Start Date & Time:</strong> June 20, 2025, 10:00 AM</p>
        <p className="text-sm mb-1"><strong>End Date & Time:</strong> June 20, 2025, 11:00 AM</p>
        <p className="text-sm mb-1"><strong>Auto Extension:</strong> Enabled</p>
        <p className="text-sm mb-1"><strong>Pause/Resume:</strong> Allowed</p>
      </div>

      {/* Supplier Invitations */}
      <div>
        <h3 className="text-base font-semibold mb-2">Supplier Invitations</h3>
        <p className="text-sm mb-1"><strong>Suppliers:</strong> supplier1@email.com, supplier2@email.com</p>
        <p className="text-sm mb-1"><strong>Email Invitation:</strong> Hey, you are invited to the auction...</p>
      </div>
    </div>
  </div>
)}




        </div>

        {/* Navigation Buttons */}
        <div className="flex bottom-0 justify-between mt-6">
          <button className="border border-[#DDE1EB] px-4 py-2 rounded text-sm">Save Draft</button>
          <div className="flex gap-4">

            <button
              onClick={goNext}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm"
            >
              {step === steps.length - 1 ? 'Launch Auction' : 'Next'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
