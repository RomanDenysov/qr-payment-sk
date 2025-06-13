import { QrCodeIcon } from 'lucide-react';
import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '~/components/ui/sidebar';
import { AppSidebarFooter } from './app-sidebar-footer';
import { NavMain } from './nav-main';

type AppSidebarProps = ComponentProps<typeof Sidebar> & {
  readonly children: ReactNode;
};

export function AppSidebar({ children, ...props }: AppSidebarProps) {
  return (
    <>
      <Sidebar collapsible="icon" variant="floating" {...props}>
        <AppSidebarHeader />
        <SidebarContent>
          <NavMain />
        </SidebarContent>
        <AppSidebarFooter />
      </Sidebar>
      <SidebarInset className="relative flex flex-col gap-2 bg-gray-50 p-2 md:pl-0">
        {children}
      </SidebarInset>
    </>
  );
}

function AppSidebarHeader() {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            className="data-[slot=sidebar-menu-button]:!p-1.5"
          >
            <Link href="#">
              <QrCodeIcon className="!size-5 text-orange-500" />
              <span className="font-semibold text-base">Platby</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
