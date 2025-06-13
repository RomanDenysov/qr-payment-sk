import type { ReactNode } from 'react';
import { SidebarProvider } from '~/components/ui/sidebar';
import { AppSidebar } from './components/app-sidebar';

type AppLayoutProps = {
  readonly children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar>{children}</AppSidebar>
    </SidebarProvider>
  );
}
