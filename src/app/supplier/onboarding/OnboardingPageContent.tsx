"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import OnboardingModal from '@/components/ui/modal/OnboardingModal';
import { ROUTES } from '@/lib';

export default function OnboardingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  useEffect(() => {
    if (!email) {
      // If no email, redirect to check-email page
      router.replace('/supplier/check-email');
    }
  }, [email, router]);

  if (!email) return <div>Redirecting...</div>;

  return (
    <OnboardingModal
      onComplete={async (data) => {
        try {
          const payload = {
            name: data.name,
            email: data.email,
            password: data.password,
            role: 'Supplier',
            profile: {
              companyName: data.name,
              country: data.country,
              portOfLoading: data.port,
            },
          };

          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Registration failed');
          }

          router.push(ROUTES.AUTH.LOGIN);
        } catch {
          alert('Registration failed. Please try again.');
        }
      }}
      defaultEmail={email}
    />
  );
} 