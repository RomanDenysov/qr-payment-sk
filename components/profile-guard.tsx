'use client';

import { hasProfile } from '@/app/actions/profile';
import { ProfileSetupDialog } from '@/components/profile-setup-dialog';
import { useUser } from '@clerk/nextjs';
import { useAction } from 'next-safe-action/hooks';
import { type ReactNode, useEffect, useState } from 'react';

interface ProfileGuardProps {
  children: ReactNode;
}

export function ProfileGuard({ children }: ProfileGuardProps) {
  const { isLoaded, isSignedIn } = useUser();
  const [profileExists, setProfileExists] = useState<boolean | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const { execute, result, isExecuting } = useAction(hasProfile, {
    onSettled: () => {
      const hasProfileResult = result.data || false;
      setProfileExists(hasProfileResult);

      // Show dialog if user is signed in but doesn't have a profile
      if (isSignedIn && !hasProfileResult) {
        setShowDialog(true);
      }
    },
  });

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      execute();
    }
  }, [isLoaded, isSignedIn, execute]);

  // Always render children for signed-in users
  // The dialog will overlay on top if needed
  if (!isLoaded || !isSignedIn) {
    return <>{children}</>;
  }

  return (
    <>
      {children}

      {/* Show profile setup dialog if user doesn't have a profile */}
      <ProfileSetupDialog
        open={showDialog}
        onOpenChange={(open) => {
          if (open) {
            setShowDialog(open);
          } else {
            setShowDialog(false);
            // Re-check profile after dialog closes to see if it was created
            execute();
          }
        }}
      />
    </>
  );
}
