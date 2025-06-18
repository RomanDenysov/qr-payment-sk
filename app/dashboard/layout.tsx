import { ProfileGuard } from '@/components/profile-guard';
import type { ReactNode } from 'react';
import { DashboardHeader } from './components/dashboard-header';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ProfileGuard>
      <DashboardHeader />
      <div className="size-full bg-gradient-to-b from-accent to-background">
        <main className="container relative mx-auto max-w-7xl px-4 py-8 md:px-6">
          {children}
        </main>
      </div>
    </ProfileGuard>
  );
}
