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

type Product = { _id: string; name: string; hsCode?: string };

type LotData = {
  lotId?: string;
  hsCode?: string;
  productName?: string;
  material?: string;
  dimensions?: { l?: string; w?: string; h?: string };
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
  const router = useRouter();

  useEffect(() => {
    const savedStep = localStorage.getItem('auctionStep');
    if (savedStep && !isNaN(Number(savedStep))) setStep(Number(savedStep));

    // Load import duty products for dropdown
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/import-duty/products`)
      .then(res => res.json())
      .then(data => Array.isArray(data) && setImportProducts(data))
      .catch(console.error);
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
    0: ['title', 'description', 'category', 'reservePrice', 'currency'],
    2: ['startTime', 'endTime'],
    3: ['invitedSuppliers'],
  };

  const isStepValid = () => {
    if (step === 1) {
      const lots = auctionData.lots || [];
      return lots.length > 0 && lots.every(lot => lot.productName?.trim());
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
    alert('Draft saved!');
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { title, description, category, reservePrice, currency, startTime, endTime, autoExtension, extensionMinutes, costParams, lots } = auctionData;

    // Prepare invitedSuppliers array with mixed user IDs and emails
    const invitedSuppliers = supplierObjects.map(s => {
      // If it's a valid MongoDB ObjectId (24 characters), use as is
      if (s._id && s._id.length === 24 && /^[0-9a-fA-F]{24}$/.test(s._id)) {
        return s._id.trim();
      }
      // Otherwise, use the email (for new suppliers)
      return s.email;
    });

    // Validate required fields
    if (!title || !description || !category || !currency || !startTime || !endTime) {
      alert('Please fill in all required fields.');
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
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
        hsCode: lot.hsCode && lot.hsCode.trim() !== '' ? lot.hsCode : '123', // Default to '123' if missing/null/empty
        material: lot.material || 'Material',
        prevCost: lot.prevCost ? Number(lot.prevCost) : 0,
        dimensions: lot.dimensions ? 
          `${lot.dimensions.l || ''}x${lot.dimensions.w || ''}x${lot.dimensions.h || ''}` : 
          '0x0x0'
      })) || [],
    };

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Please log in to create an auction.');
        router.push('/auth/login');
        return;
      }
      
      console.log('Sending payload:', JSON.stringify(payload, null, 2));
      console.log('Using token:', token ? `${token.substring(0, 10)}...` : 'No token');
      console.log('API URL:', `${process.env.NEXT_PUBLIC_API_URL}/auction/create`);
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auction/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      const resText = await res.text();
      console.log('Response status:', res.status);
      console.log('Response text:', resText);
      
      let data;
      try { 
        data = JSON.parse(resText); 
        console.log('Parsed response:', data);
      } catch (e) { 
        console.log('Failed to parse response as JSON:', e);
        data = { message: resText }; 
      }

      setLoading(false);
      if (res.ok || res.status === 201) {
        alert('Auction created successfully!');
        localStorage.removeItem('auctionStep');
        localStorage.removeItem('auctionDraft');
        router.push('/ep-member/dashboard');
      } else {
        console.error('API Error:', res.status, data);
        if (res.status === 401) {
          alert('Authentication failed. Please log in again.');
          router.push('/auth/login');
        } else {
          alert(`Auction creation failed: ${data.message || 'Unknown error'}`);
        }
      }
    } catch {
      setLoading(false);
      alert('Network error');
    }
  };

  const handleBack = () => {
    localStorage.removeItem('auctionStep');
    router.push('/ep-member/dashboard');
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
    </div>
  );
}
