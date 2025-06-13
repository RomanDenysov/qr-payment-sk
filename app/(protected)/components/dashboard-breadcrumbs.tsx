import { Fragment } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';

export type BreadcrumbItemType = {
  label: string;
  href?: string;
};

export function DashboardBreadcrumbs({
  breadcrumbs,
}: { breadcrumbs: BreadcrumbItemType[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((item, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <Fragment key={item.label + idx}>
                {idx > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                <BreadcrumbItem className={isLast ? '' : 'hidden md:block'}>
                  {isLast ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={item.href ?? '#'}>
                      {item.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </nav>
  );
}
