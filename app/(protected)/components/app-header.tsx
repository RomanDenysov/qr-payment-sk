import type { ReactNode } from 'react';
import { Separator } from '~/components/ui/separator';
import { SidebarTrigger } from '~/components/ui/sidebar';
import { cn } from '~/lib/utils';
import {
  type BreadcrumbItemType,
  DashboardBreadcrumbs,
} from './dashboard-breadcrumbs';

type AppHeaderProps = {
  breadcrumbs: BreadcrumbItemType[];
  children?: ReactNode;
  className?: string;
};

export function AppHeader({
  breadcrumbs,
  children,
  className,
}: AppHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-2 z-50 flex shrink-0 items-center rounded-md border bg-gray-50 px-4 shadow backdrop-blur-sm',
        className
      )}
    >
      <div className="flex h-14 items-center gap-x-4 lg:gap-x-10">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1 [&_svg:not([class*='size-'])]:size-5" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-6"
          />
          <DashboardBreadcrumbs breadcrumbs={breadcrumbs} />
        </div>
      </div>
      {children}
    </header>
  );
}
