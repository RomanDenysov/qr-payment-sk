import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { HomeIcon, Plus } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';

type AppSidebarProps = ComponentProps<typeof Sidebar> & {
  readonly children: ReactNode;
};

export function AppSidebar({ children, ...props }: AppSidebarProps) {
  return (
    <>
      <Sidebar {...props} collapsible="icon">
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/dashboard">
                  <HomeIcon />
                  <span>Prehľad</span>
                </a>
              </SidebarMenuButton>
              <SidebarMenuAction>
                <Plus /> <span className="sr-only">Add Project</span>
              </SidebarMenuAction>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="size-full bg-gradient-to-b from-accent to-background">
        {children}
      </SidebarInset>
    </>
  );
}
