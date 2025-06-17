'use client';

import { hasProfile } from '@/app/actions/profile';
import { ProfileSetupDialog } from '@/components/profile-setup-dialog';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

interface ProfileGuardProps {
  children: React.ReactNode;
}

export function ProfileGuard({ children }: ProfileGuardProps) {
  const { isLoaded, isSignedIn } = useUser();
  const [profileExists, setProfileExists] = useState<boolean | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    async function checkProfile() {
      if (isLoaded && isSignedIn) {
        try {
          const exists = await hasProfile();
          setProfileExists(exists);
          if (!exists) {
            setShowDialog(true);
          }
        } catch (error) {
          console.error('Error checking profile:', error);
          setProfileExists(false);
          setShowDialog(true);
        }
      }
    }

    checkProfile();
  }, [isLoaded, isSignedIn]);

  // Show loading state while checking profile
  if (!isLoaded || profileExists === null) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-32 w-32 animate-spin rounded-full border-primary border-b-2" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not signed in, render children normally
  if (!isSignedIn) {
    return <>{children}</>;
  }

  // Handle profile setup completion
  const handleDialogClose = () => {
    setShowDialog(false);
    setProfileExists(true);
  };

  return (
    <>
      {children}
      <ProfileSetupDialog open={showDialog} onOpenChange={handleDialogClose} />
    </>
  );
}
