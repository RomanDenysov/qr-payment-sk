import { UserButton } from '@clerk/nextjs';
import { BellDot } from 'lucide-react';
import { ModeToggle } from '~/components/shared/mode-toggle';
import { Button } from '~/components/ui/button';
import { SidebarMenuItem } from '~/components/ui/sidebar';

export function NavUser() {
  return (
    <SidebarMenuItem className="flex items-center justify-center">
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
    </SidebarMenuItem>
  );
}
