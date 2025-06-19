'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import EPHeader from '@/components/EPHeader';
import AuctionBreadcrumb from '@/components/AuctionBreadcrumb';
import AuctionDetailsStep from '@/components/CreateAuctionSteps/AuctionDetailsStep';
import ProductLotStep from '@/components/CreateAuctionSteps/ProductLotStep';
import AuctionSettingsStep from '@/components/CreateAuctionSteps/AuctionSettingsStep';
import SupplierInvitationStep from '@/components/CreateAuctionSteps/SupplierInvitationStep';
import ReviewLaunchStep from '@/components/CreateAuctionSteps/ReviewLaunchStep';

// ---- TYPE DEFINITIONS ----
type AuctionData = {
  title?: string;
  type?: string;
  sapCode?: string;
  reservePrice?: number | string;
  currency?: string;
  productName?: string;
  lotCount?: number | string;
  startTime?: string;
  endTime?: string;
  suppliers?: string[];
  // Add more fields as needed!
};

const steps = [
  'Auction Details',
  'Product & LOT',
  'Auction Settings',
  'Supplier Invitations',
  'Review & Launch',
];

export default function CreateAuctionPage() {
  const [step, setStep] = useState<number>(0);
  const [auctionData, setAuctionData] = useState<AuctionData>({});
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [showErrors, setShowErrors] = useState<boolean>(false);
  const [showLaunchModal, setShowLaunchModal] = useState<boolean>(false);

  // Modal component, ideally should be its own file, but kept here for simplicity
  function ConfirmLaunchModal({
    open,
    onClose,
    onConfirm,
  }: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
  }) {
    if (!open) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
        <div className="bg-white rounded-lg shadow-lg p-8 min-w-[350px] max-w-[95vw] flex flex-col items-center relative">
          <div className="text-lg font-semibold mb-2 text-center">Save &amp; Launch</div>
          <div className="text-center text-[#555] mb-6">
            Are you sure you want to save changes &amp; send invitations?
          </div>
          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="w-1/2 py-2 rounded border border-[#DDE1EB] text-sm font-medium bg-[#f8fafc] hover:bg-[#f3f6fb] transition"
            >
              Back
            </button>
            <button
              onClick={onConfirm}
              className="w-1/2 py-2 rounded bg-[#1976D2] text-white text-sm font-medium hover:bg-[#1565c0] transition"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  }

  const goNext = () => {
    if (!isStepValid()) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    setStep(step + 1);
  };

  const updateAuctionData = (data: Partial<AuctionData>) => {
    setAuctionData((prev) => ({ ...prev, ...data }));
  };

  const requiredFieldsPerStep: Record<number, Array<keyof AuctionData>> = {
    0: ['title', 'type', 'sapCode', 'reservePrice', 'currency'],
    1: ['productName', 'lotCount'], // Add more if needed from ProductLotStep
    2: ['startTime', 'endTime'], // Add more if needed from AuctionSettingsStep
    3: ['suppliers'],
    // 4: [] (Review step doesn't need validation)
  };

  const isStepValid = () => {
    const required = requiredFieldsPerStep[step] || [];
    return required.every((field) => {
      const value = auctionData[field];
      return value !== undefined && value !== '' && !(Array.isArray(value) && value.length === 0);
    });
  };

  // Save auctionData to localStorage
  const saveDraft = () => {
    localStorage.setItem('auctionDraft', JSON.stringify(auctionData));
    alert('Draft saved!');
  };

  // Load auctionData from localStorage on mount
  useEffect(() => {
    const draft = localStorage.getItem('auctionDraft');
    if (draft) {
      setAuctionData(JSON.parse(draft));
    }
  }, []);

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <AuctionDetailsStep
            data={auctionData}
            onChange={updateAuctionData}
            showErrors={showErrors}
          />
        );
      case 1:
        return (
          <ProductLotStep
            data={auctionData}
            onChange={updateAuctionData}
            showErrors={showErrors}
          />
        );
      case 2:
        return (
          <AuctionSettingsStep
            data={auctionData}
            onChange={updateAuctionData}
            showErrors={showErrors}
          />
        );
      case 3:
        return (
          <SupplierInvitationStep
            data={{
              ...auctionData,
              suppliers: auctionData.suppliers ?? [],
            }}
            onChange={updateAuctionData}
            showErrors={showErrors}
          />
        );
      case 4:
        return (
          <ReviewLaunchStep
            data={auctionData}
            onSubmit={function (): void {
              throw new Error('Function not implemented.');
            }}
          />
        );
      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (
      !auctionData.title ||
      !auctionData.reservePrice ||
      !auctionData.currency ||
      !auctionData.startTime ||
      !auctionData.endTime
    ) {
      alert('Please fill all required fields.');
      setLoading(false);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auction/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(auctionData),
      });
      setLoading(false);
      if (res.ok) {
        alert('Auction created successfully!');
        router.push('/ep/dashboard');
      } else {
        const data = await res.json();
        alert(data.message || 'Auction creation failed');
      }
    } catch {
      setLoading(false);
      alert('Network error');
    }
  };

  return (
    <div className="flex min-h-screen bg-white text-[#383838] flex-col">
      <EPHeader />

      <main className="flex-1 p-8 max-w-6xl mx-auto">
        {/* Header with back button */}
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

        {/* Stepper */}
        <AuctionBreadcrumb
          steps={steps}
          currentStep={step}
          onStepClick={(index) => {
            if (index <= step) setStep(index); // only allow backward
          }}
        />

        {/* Step Content */}
        <div className="bg-white pt-6 rounded border-t border-[#EAECF0]">
          {renderStepContent(step)}
        </div>

        {/* Footer navigation */}
        <div className="flex bottom-0 justify-between mt-6">
          <button
            className="border border-[#DDE1EB] px-4 py-2 rounded text-sm"
            type="button"
            onClick={saveDraft}
          >
            Save Draft
          </button>
          <div className="flex gap-4">
            <button
              onClick={
                step === steps.length - 1
                  ? () => setShowLaunchModal(true)
                  : goNext
              }
              className={`px-4 py-2 bg-blue-600 text-white rounded text-sm transition ${
                loading || !isStepValid() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading || !isStepValid()}
            >
              {loading
                ? 'Submitting...'
                : step === steps.length - 1
                ? 'Launch Auction'
                : 'Next'}
            </button>
          </div>
        </div>
        <ConfirmLaunchModal
          open={showLaunchModal}
          onClose={() => setShowLaunchModal(false)}
          onConfirm={() => {
            setShowLaunchModal(false);
            handleSubmit();
          }}
        />
      </main>
    </div>
  );
}
