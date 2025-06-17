'use client';

import { Logo } from '@/components/shared/logo';
import { Button, buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  BarChart3Icon,
  CreditCardIcon,
  HistoryIcon,
  HomeIcon,
  QrCodeIcon,
  SettingsIcon,
  UserIcon,
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

const secondaryItems = [
  {
    title: 'Štatistiky',
    href: '/dashboard/analytics',
    icon: BarChart3Icon,
  },
  {
    title: 'Nastavenia',
    href: '/dashboard/settings',
    icon: SettingsIcon,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Logo />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  buttonVariants({ variant: isActive ? 'secondary' : 'ghost' }),
                  'w-full justify-start gap-3',
                  isActive && 'bg-primary/10 text-primary'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </div>

        <Separator className="my-4" />

        <div className="space-y-1">
          <p className="px-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">
            Pokročilé
          </p>
          {secondaryItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start gap-3',
                    isActive && 'bg-primary/10 text-primary'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User section */}
      <div className="border-t p-4">
        <Link href="/dashboard/profile">
          <Button variant="ghost" className="w-full justify-start gap-3">
            <UserIcon className="h-4 w-4" />
            Profil používateľa
          </Button>
        </Link>
      </div>
    </div>
  );
}
