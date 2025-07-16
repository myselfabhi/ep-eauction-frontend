"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import OnboardingModal from "@/components/ui/modal/OnboardingModal";
import { checkEmail } from "@/services/user.service";

function SupplierOnboardingPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [checking, setChecking] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [emailInput, setEmailInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (email) {
      setChecking(true);
      setError(null);
      checkEmail(email)
        .then((exists) => {
          if (exists) {
            router.push(`/auth/login?email=${encodeURIComponent(email)}`);
          } else {
            setShowOnboarding(true);
          }
        })
        .catch(() => {
          setError('Could not check email. Please try again.');
        })
        .finally(() => setChecking(false));
    }
  }, [email, router]);

  if (checking) return <div className="flex justify-center items-center min-h-screen">Checking...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-600">{error}</div>;

  if (!email && !showOnboarding) {
    // Show email entry form
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form
          className="bg-white p-8 rounded shadow max-w-md w-full"
          onSubmit={e => {
            e.preventDefault();
            setEmail(emailInput);
          }}
        >
          <h2 className="text-xl font-semibold mb-4">Supplier Onboarding</h2>
          <input
            type="email"
            value={emailInput}
            onChange={e => setEmailInput(e.target.value)}
            placeholder="Enter your email"
            required
            className="border rounded px-3 py-2 w-full mb-4"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded py-2 font-semibold hover:bg-blue-700"
          >
            Continue
          </button>
        </form>
      </div>
    );
  }

  if (showOnboarding) {
    return (
      <OnboardingModal
        onComplete={() => {
          // handle onboarding complete
          router.push("/supplier/dashboard");
        }}
        initialEmail={email}
      />
    );
  }

  return null;
}

export default function SupplierOnboardingPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SupplierOnboardingPageInner />
    </Suspense>
  );
} 