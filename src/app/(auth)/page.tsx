
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGuardianStore } from '@/hooks/use-guardian-store';
import { GuardianSetupForm } from '@/components/auth/guardian-setup-form';
import { Skeleton } from '@/components/ui/skeleton';


export default function SetupPage() {
  const router = useRouter();
  const { guardianEmail, isGuardianSet, setGuardianEmail } = useGuardianStore();

  useEffect(() => {
    if (isGuardianSet && guardianEmail) {
      router.replace('/dashboard');
    }
  }, [isGuardianSet, guardianEmail, router]);

  const handleSetupComplete = (email: string) => {
    setGuardianEmail(email);
    router.replace('/dashboard');
  };

  if (!isGuardianSet && guardianEmail === null) { // Initial loading state before store is initialized
     return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <div className="w-full max-w-md space-y-6">
            <Skeleton className="h-16 w-16 rounded-full mx-auto" />
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-6 w-full mx-auto" />
            <div className="space-y-4 pt-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
     );
  }
  
  if (isGuardianSet) {
    // This case should ideally be handled by the useEffect redirect,
    // but as a fallback or during fast transitions:
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return <GuardianSetupForm onSetupComplete={handleSetupComplete} />;
}
