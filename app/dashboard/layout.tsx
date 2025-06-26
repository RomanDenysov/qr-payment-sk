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
        <div className="container relative mx-auto max-w-7xl">{children}</div>
      </AppSidebar>
    </SidebarProvider>
  );
}
