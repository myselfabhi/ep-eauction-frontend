import { Suspense } from 'react';
import  OnboardingPageContent  from './OnboardingPageContent';

export default function SupplierOnboardingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OnboardingPageContent />
    </Suspense>
  );
} 