'use client';

import { hasProfile } from '@/app/actions/profile';
import { ProfileSetupDialog } from '@/components/profile-setup-dialog';
import { useUser } from '@clerk/nextjs';
import { type ReactNode, useEffect, useState } from 'react';

interface ProfileGuardProps {
  children: ReactNode;
}

export function ProfileGuard({ children }: ProfileGuardProps) {
  const { isLoaded, isSignedIn } = useUser();
  const [profileExists, setProfileExists] = useState<boolean | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function checkProfile() {
      if (isLoaded && isSignedIn) {
        try {
          setIsChecking(true);
          const exists = await hasProfile();
          setProfileExists(exists);
          if (!exists) {
            setShowDialog(true);
          }
        } catch (error) {
          console.error('Error checking profile:', error);
          setProfileExists(false);
          setShowDialog(true);
        } finally {
          setIsChecking(false);
        }
      } else if (isLoaded && !isSignedIn) {
        // User is not signed in, allow children to render
        setIsChecking(false);
        setProfileExists(true); // Allow rendering for non-authenticated pages
      }
    }

    checkProfile();
  }, [isLoaded, isSignedIn]);

  // If profile doesn't exist and we're signed in, only show the setup dialog
  // Don't render children until profile is created
  if (isSignedIn && !profileExists) {
    return (
      <div className="flex h-screen items-center justify-center">
        <ProfileSetupDialog
          open={showDialog}
          onOpenChange={(open) => {
            if (!open) {
              // Profile was created, refresh the profile check
              setIsChecking(true);
              setShowDialog(false);
              // Re-check profile after dialog closes
              setTimeout(async () => {
                try {
                  const exists = await hasProfile();
                  setProfileExists(exists);
                  setIsChecking(false);
                } catch (error) {
                  console.error('Error re-checking profile:', error);
                  setIsChecking(false);
                }
              }, 100);
            }
          }}
        />
      </div>
    );
  }

  // Profile exists, render children
  return <>{children}</>;
}
