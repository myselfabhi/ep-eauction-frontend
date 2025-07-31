'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AuctionDetailsStep from '@/components/CreateAuctionSteps/AuctionDetailsStep';
import ProductLotMultiStep from '@/components/CreateAuctionSteps/ProductLotMultiStep';
import AuctionSettingsStep from '@/components/CreateAuctionSteps/AuctionSettingsStep';
import SupplierInvitationStep, { Supplier } from '@/components/CreateAuctionSteps/SupplierInvitationStep';
import ReviewLaunchStep from '@/components/CreateAuctionSteps/ReviewLaunchStep';
import EPHeader from '@/components/shared/EPHeader';
import AuctionBreadcrumb from '@/components/shared/AuctionBreadcrumb';
import Loader from '@/components/shared/Loader';
import { auctionService, dutyService } from '@/services';
import { ROUTES, ERROR_MESSAGES } from '@/lib';
import { Auction } from '@/types/auction';
import ModalWrapper from '@/components/ui/modal/ModalWrapper';

type Product = { _id: string; name: string; hsCode?: string };

type LotData = {
  lotId?: string;
  hsCode?: string;
  productName?: string;
  material?: string;
  volume?: string;
  volumeUnit?: string;
  dimensions?: { l?: string; w?: string; h?: string };
  dimensionUnit?: string;
  prevCost?: string;
  lotCount?: number | string;
};

type CostParams = {
  freight?: number;
  duty?: number;
  [key: string]: number | undefined;
};

type AuctionData = {
  title?: string;
  description?: string;
  sapCodes?: string[];
  category?: string;
  reservePrice?: number | string;
  currency?: string;
  startTime?: string;
  endTime?: string;
  autoExtension?: boolean;
  extensionMinutes?: number;
  invitedSuppliers?: string[];
  previewEmail?: string;
  costParams?: CostParams;
  lots?: LotData[];
  type?: string; // Single Lot or Multi Lot
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
  const [supplierObjects, setSupplierObjects] = useState<Supplier[]>([]);
  const [importProducts, setImportProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showErrors, setShowErrors] = useState<boolean>(false);
  const [showLaunchModal, setShowLaunchModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedStep = localStorage.getItem('auctionStep');
    if (savedStep && !isNaN(Number(savedStep))) setStep(Number(savedStep));

    // Load import duty products for dropdown
    const loadProducts = async () => {
      try {
        const data = await dutyService.getProducts();
        if (Array.isArray(data)) {
          setImportProducts(data);
        }
      } catch (error) {
        console.error('Failed to load products:', error);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem('auctionStep', step.toString());
  }, [step]);

  useEffect(() => {
    const draft = localStorage.getItem('auctionDraft');
    if (draft) {
      const parsed = JSON.parse(draft);
      setAuctionData(parsed);
      if (Array.isArray(parsed.invitedSuppliers)) {
        setSupplierObjects(parsed.invitedSuppliers.map((id: string, index: number) => ({
          _id: id,
          email: `supplier${index + 1}@example.com`,
        })));
      }
    }
  }, []);

  const requiredFieldsPerStep: Record<number, Array<keyof AuctionData>> = {
    0: ['title', 'description', 'category', 'reservePrice', 'currency', 'sapCodes'],
    2: ['startTime', 'endTime'],
    3: ['invitedSuppliers']
  };

  const isStepValid = () => {
    if (step === 1) {
      const lots = auctionData.lots || [];
      return lots.length > 0 && lots.every(lot => lot.productName?.trim() && lot.volume?.trim());
    }
    if (step === 3) {
      // Require previewEmail to be present and not empty
      if (!auctionData.previewEmail || auctionData.previewEmail.trim() === "") return false;
    }
    const required = requiredFieldsPerStep[step] || [];
    return required.every(field => {
      const value = auctionData[field];
      return value !== undefined && value !== '' && !(Array.isArray(value) && value.length === 0);
    });
  };

  const goNext = () => {
    if (!isStepValid()) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    setStep(step + 1);
  };

  const updateAuctionData = (data: Partial<AuctionData>) => {
    setAuctionData(prev => ({ ...prev, ...data }));
  };

  const saveDraft = () => {
    localStorage.setItem('auctionDraft', JSON.stringify(auctionData));
    setShowDraftModal(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { title, description, category, reservePrice, sapCodes, currency, startTime, endTime, autoExtension, extensionMinutes, costParams, lots, previewEmail } = auctionData;

    // Prepare invitedSuppliers array with only emails (never ObjectIds)
    const invitedSuppliers = supplierObjects.map(s => s.email);

    // Validate required fields
    if (!title || !description || !category || !currency || !startTime || !endTime || !sapCodes) {
      alert('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    // Construct redirect URL for supplier invitation
    const redirectUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/supplier/dashboard`
      : '/supplier/dashboard';

    const payload = {
      title: title.trim(),
      description: description.trim(),
      sapCodes: sapCodes || [],
      category: category.trim(),
      reservePrice: Number(reservePrice),
      currency: currency.trim(),
      startTime,
      endTime,
      autoExtension: autoExtension || false,
      extensionMinutes: extensionMinutes || 5,
      invitedSuppliers: invitedSuppliers || [],
      costParams: costParams || {},
      lots: lots?.map(lot => ({
        lotId: lot.lotId || 'LOT001',
        productName: lot.productName || 'Product',
        hsCode: lot.hsCode && lot.hsCode.trim() !== '' ? lot.hsCode : '123',
        material: lot.material || 'Material',
        volume: lot.volumeUnit ? `${lot.volume || '0'} ${lot.volumeUnit}` : (lot.volume || '0'),
        prevCost: lot.prevCost ? Number(lot.prevCost) : 0,
        dimensions: lot.dimensions
          ? `${lot.dimensions.l || ''}${lot.dimensionUnit || 'cm'}x${lot.dimensions.w || ''}${lot.dimensionUnit || 'cm'}x${lot.dimensions.h || ''}${lot.dimensionUnit || 'cm'}`
          : undefined,
      })) || [],
      previewEmail: previewEmail || '',
      redirectUrl,
    };

    try {
      console.log('Sending payload:', JSON.stringify(payload, null, 2));
      const data = await auctionService.create(payload as unknown as Partial<Auction>);
      console.log('Auction created:', data);

      setLoading(false);
      setShowSuccessModal(true);
      localStorage.removeItem('auctionStep');
      localStorage.removeItem('auctionDraft');
      // router.push(ROUTES.EP_MEMBER.DASHBOARD); // Move this to modal button
    } catch (error: unknown) {
      setLoading(false);
      console.error('API Error:', error);
      // Enhanced backend error logging
      if (typeof error === 'object' && error && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } };
        const message = apiError?.response?.data?.message || ERROR_MESSAGES.GENERAL.UNKNOWN_ERROR;
        alert(`Auction creation failed: ${message}`);
      } else {
        alert('Auction creation failed.');
      }
    }
  };

  const handleBack = () => {
    localStorage.removeItem('auctionStep');
    router.push(ROUTES.EP_MEMBER.DASHBOARD);
  };

  const ConfirmLaunchModal = ({ open, onClose, onConfirm }: { open: boolean; onClose: () => void; onConfirm: () => void; }) => {
    if (!open) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
        <div className="bg-white rounded-lg shadow-lg p-8 min-w-[350px] max-w-[95vw] flex flex-col items-center relative">
          <div className="text-lg font-semibold mb-2 text-center">Save & Launch</div>
          <div className="text-center text-[#555] mb-6">Are you sure you want to save changes & send invitations?</div>
          <div className="flex gap-3 w-full">
            <button onClick={onClose} className="w-1/2 py-2 rounded border border-[#DDE1EB] text-sm font-medium bg-[#f8fafc] hover:bg-[#f3f6fb] transition">Back</button>
            <button onClick={onConfirm} className="w-1/2 py-2 rounded bg-[#1976D2] text-white text-sm font-medium hover:bg-[#1565c0] transition">Confirm</button>
          </div>
        </div>
      </div>
    );
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <AuctionDetailsStep data={auctionData} onChange={updateAuctionData} showErrors={showErrors} />;
      case 1:
        return <ProductLotMultiStep
  value={auctionData.lots || [{}]}
  onChange={(lots) => updateAuctionData({ lots })}
  showErrors={showErrors}
  auctionType={auctionData.type === 'Single Lot' ? 'single' : 'multi'}
  importProducts={importProducts}
  setImportProducts={setImportProducts}
/>;
      case 2:
        return <AuctionSettingsStep data={auctionData} onChange={updateAuctionData} showErrors={showErrors} />;
      case 3:
        return <SupplierInvitationStep data={{ suppliers: supplierObjects, previewEmail: auctionData.previewEmail }} onChange={(updated) => { updateAuctionData({ invitedSuppliers: (updated.suppliers || []).map(s => s._id), previewEmail: updated.previewEmail }); setSupplierObjects(updated.suppliers || []); }} showErrors={showErrors} />;
      case 4:
        return <ReviewLaunchStep data={auctionData} suppliers={supplierObjects} onSubmit={() => { }} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-white text-[#383838] flex-col">
      <EPHeader />
      <main className="flex-1 p-8 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-1 cursor-pointer" onClick={handleBack}>
          <Image width={5} height={5} src="/icons/arrow_left.svg" alt="Back" className="w-4 h-4" />
          <h1 className="text-xl font-semibold">Create Auction</h1>
        </div>
        <p className="text-sm text-[#5E5E65] mb-6">Fill out the details and create a new auction</p>
        <AuctionBreadcrumb steps={steps} currentStep={step} onStepClick={(index) => { if (index <= step) setStep(index); }} />
        <div className="bg-white pt-6 rounded border-t border-[#EAECF0]">{renderStepContent(step)}</div>
        <div className="flex bottom-0 justify-between mt-6">
          <button className="border border-[#DDE1EB] px-4 py-2 rounded text-sm" type="button" onClick={saveDraft}>Save Draft</button>
          <div className="flex gap-4">
            <button onClick={step === steps.length - 1 ? () => setShowLaunchModal(true) : goNext} className={`px-4 py-2 bg-blue-600 text-white rounded text-sm transition ${loading || !isStepValid() ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={loading || !isStepValid()}>
              {loading ? 'Submitting...' : step === steps.length - 1 ? 'Launch Auction' : 'Next'}
            </button>
          </div>
        </div>
        <ConfirmLaunchModal open={showLaunchModal} onClose={() => setShowLaunchModal(false)} onConfirm={() => { setShowLaunchModal(false); handleSubmit(); }} />
        {loading && <Loader />}
      </main>
      <ModalWrapper open={showSuccessModal} onClose={() => { setShowSuccessModal(false); router.push(ROUTES.EP_MEMBER.DASHBOARD); }}>
        <div className="text-center">
          <div className="text-lg font-semibold mb-2">Auction created successfully!</div>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded text-sm"
            onClick={() => { setShowSuccessModal(false); router.push(ROUTES.EP_MEMBER.DASHBOARD); }}
          >
            Go to Dashboard
          </button>
        </div>
      </ModalWrapper>
      <ModalWrapper open={showDraftModal} onClose={() => setShowDraftModal(false)} title="Draft Saved!">
        <div className="text-center">
          <div className="text-lg font-semibold mb-2">Your draft has been saved.</div>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded text-sm"
            onClick={() => setShowDraftModal(false)}
          >
            Close
          </button>
        </div>
      </ModalWrapper>
    </div>
  );
}
