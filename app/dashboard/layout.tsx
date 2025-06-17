import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { ProfileGuard } from '@/components/profile-guard';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { UserButton } from '@clerk/nextjs';
import { MenuIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ProfileGuard>
      <div className="min-h-screen bg-background">
        {/* Desktop Sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
          <DashboardSidebar />
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden">
          <div className="flex h-16 items-center justify-between border-b px-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MenuIcon className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <DashboardSidebar />
              </SheetContent>
            </Sheet>

            <UserButton
              appearance={{
                elements: {
                  avatarBox: '!size-8 !rounded-lg',
                },
              }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:pl-64">
          {/* Desktop Header */}
          <div className="hidden h-16 items-center justify-end border-b px-6 lg:flex">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: '!size-8 !rounded-lg',
                },
              }}
            />
          </div>

          {/* Page Content */}
          <main className="p-6">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </ProfileGuard>
  );
}
