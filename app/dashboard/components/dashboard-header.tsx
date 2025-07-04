'use client';

import { AnimatedBackground } from '@/components/motion/animated-background';
import { Logo } from '@/components/shared/logo';
import { UserButton } from '@/components/user/user-button';
import {
  CreditCardIcon,
  HistoryIcon,
  HomeIcon,
  QrCodeIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigationItems = [
  {
    title: 'Prehľad',
    href: '/dashboard',
    icon: HomeIcon,
  },
  {
    title: 'Generátor QR',
    href: '/dashboard/generator',
    icon: QrCodeIcon,
  },
  {
    title: 'Šablóny',
    href: '/dashboard/templates',
    icon: CreditCardIcon,
  },
  {
    title: 'História',
    href: '/dashboard/history',
    icon: HistoryIcon,
  },
];

export function DashboardHeader() {
  const pathname = usePathname();

  const activeItem =
    navigationItems.find((item) => item.href === pathname) ||
    navigationItems[0];

  return (
    <header className="mx-auto flex min-h-16 max-w-7xl items-center justify-between border-accent border-b px-4">
      <div className="flex w-full flex-col gap-4 md:gap-8">
        <div className="flex max-h-16 w-full items-center justify-between py-2">
          <Logo />
          <UserButton />
        </div>
        <div className="flex w-full items-end justify-center md:justify-start">
          <div className="-pb-1 flex items-center gap-2 md:gap-3">
            <AnimatedBackground
              defaultValue={activeItem.href}
              className="rounded-t-md bg-accent"
              transition={{
                ease: 'easeInOut',
                duration: 0.2,
              }}
            >
              {navigationItems.map((item) => (
                <Link
                  prefetch
                  key={item.href}
                  data-id={item.href}
                  href={item.href}
                  aria-label={`Prejdite na ${item.title}`}
                  className="flex h-8 shrink-0 items-center justify-center whitespace-nowrap rounded-md px-2 font-medium text-sm outline-none transition-all md:px-4 md:text-base "
                >
                  {item.title}
                </Link>
              ))}
            </AnimatedBackground>
          </div>
        </div>
      </div>
    </header>
  );
}
