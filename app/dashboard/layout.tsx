import { SidebarProvider } from '@/components/ui/sidebar';
import type { ReactNode } from 'react';
import { AppSidebar } from './components/app-sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar>
        {/* <DashboardHeader /> */}
        <div className="container relative mx-auto max-w-7xl px-4 py-8 md:px-6">
          {children}
        </div>
      </AppSidebar>
    </SidebarProvider>
  );
}
