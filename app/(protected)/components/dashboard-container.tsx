import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '~/lib/utils';

export function DashboardContainer(props: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={cn(
        'size-full flex-1 rounded-md border p-3 shadow-md md:p-6',
        props.className
      )}
    />
  );
}
