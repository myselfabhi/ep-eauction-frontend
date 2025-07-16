"use client";

import { useRouter } from "next/navigation";
import OnboardingModal from "@/components/ui/modal/OnboardingModal";

export default function EPOnboardingPage() {
  const router = useRouter();

  const handleComplete = () => {
    // You can send data to your backend here if needed
    // For now, just redirect to dashboard
    router.push("/ep-member/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <OnboardingModal onComplete={handleComplete} />
    </div>
  );
} 