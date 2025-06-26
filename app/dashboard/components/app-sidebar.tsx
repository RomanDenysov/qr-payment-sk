import { Logo } from '@/components/shared/logo';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import { User2 } from 'lucide-react';
import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { NavMain } from './nav-main';

type AppSidebarProps = ComponentProps<typeof Sidebar> & {
  readonly children: ReactNode;
};

export function AppSidebar({ children, ...props }: AppSidebarProps) {
  return (
    <>
      <Sidebar {...props} collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/dashboard" className="flex items-center gap-2">
                  <Logo />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <NavMain />
        </SidebarContent>

        <SidebarFooter className="space-y-4">
          {/* QR Usage Card in Sidebar */}
          <div className="px-2">{/* <QrUsageCard /> */}</div>

          {/* User Profile Button */}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a
                  href="/dashboard/settings/profile"
                  className="flex items-center gap-2"
                >
                  <User2 className="h-4 w-4" />
                  <span>Profil</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="size-full bg-gradient-to-b from-accent to-background">
        {children}
      </SidebarInset>
    </>
  );
}
