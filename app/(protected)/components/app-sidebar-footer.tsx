'use client';

import { UserButton } from '@clerk/nextjs';
import { BellDot } from 'lucide-react';
import { ModeToggle } from '~/components/shared/mode-toggle';
import { Button } from '~/components/ui/button';
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '~/components/ui/sidebar';
import { cn } from '~/lib/utils';
import { NavUser } from './nav-user';
import { UsageLimitsCard } from './usage-limits-card';

export function AppSidebarFooter() {
  const { open, isMobile } = useSidebar();
  // You can pass different subscription plans and usage data
  // Examples for different subscription types:

  // Free plan example:
  // return (
  //   <SidebarFooter>
  //     <UsageLimitsCard
  //       plan="free"
  //       paymentsUsed={3}
  //       paymentsLimit={10}
  //     />
  //   </SidebarFooter>
  // );

  // Basic plan (current default):
  return (
    <SidebarFooter>
      <SidebarMenu className="gap-2">
        {/* Usage Limits Card - Only show when sidebar is open */}
        {(open || isMobile) && (
          <SidebarMenuItem>
            <UsageLimitsCard
              plan="basic"
              paymentsUsed={45}
              paymentsLimit={100}
              apiCallsUsed={2340}
              apiCallsLimit={5000}
            />
          </SidebarMenuItem>
        )}
        
        {/* User Controls */}
        <SidebarMenuItem className="flex items-center justify-center">
          {open ? (
            <div className="flex w-full items-center justify-between gap-2">
              <UserButton
                showName
                appearance={{
                  elements: {
                    rootBox: 'flex overflow-hidden flex-1',
                    userButtonBox: 'flex-row-reverse w-full',
                    userButtonOuterIdentifier: 'truncate pl-0',
                  },
                }}
              />
              <div className="flex shrink-0 items-center gap-1">
                <ModeToggle />
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <BellDot className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 w-full">
              <SidebarMenuButton asChild className="h-8 w-8 p-0">
                <UserButton
                  appearance={{
                    elements: {
                      rootBox: 'flex overflow-hidden w-full h-full',
                      userButtonBox: 'flex items-center justify-center w-full h-full',
                      userButtonTrigger: 'w-full h-full',
                    },
                  }}
                />
              </SidebarMenuButton>
              <SidebarMenuButton asChild className="h-8 w-8 p-0">
                <ModeToggle side="right" />
              </SidebarMenuButton>
              <SidebarMenuButton asChild className="h-8 w-8 p-0">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <BellDot className="h-4 w-4" />
                </Button>
              </SidebarMenuButton>
            </div>
          )}
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );

  // Pro plan example:
  // return (
  //   <SidebarFooter>
  //     <UsageLimitsCard
  //       plan="pro"
  //       paymentsUsed={245}
  //       paymentsLimit={500}
  //       apiCallsUsed={12340}
  //       apiCallsLimit={25000}
  //     />
  //   </SidebarFooter>
  // );

  // Enterprise plan example:
  // return (
  //   <SidebarFooter>
  //     <UsageLimitsCard
  //       plan="enterprise"
  //       paymentsUsed={1245}
  //       paymentsLimit={10000}
  //       apiCallsUsed={85340}
  //       apiCallsLimit={100000}
  //     />
  //   </SidebarFooter>
  // );
}
