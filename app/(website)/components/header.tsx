'use client';

import { Logo, LogoSmall } from '@/components/shared/logo';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Skeleton } from '@/components/ui/skeleton';
import useScroll from '@/hooks/useScroll';
import { cn } from '@/lib/utils';
import {
  ClerkLoading,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import { LogInIcon, LogOutIcon, MenuIcon, UserPlusIcon } from 'lucide-react';
import Link from 'next/link';

const navItems = [
  {
    label: 'Ako to funguje',
    href: '#features',
  },
  {
    label: 'Cenník',
    href: '#pricing',
  },
  {
    label: 'FAQ',
    href: '#faq',
  },
];

export function Header() {
  const scrolled = useScroll(15);
  return (
    <header className={cn('sticky top-0 z-40 mx-auto')}>
      <div
        className={cn(
          'container mx-auto max-w-7xl border-transparent border-b px-4 md:px-6',
          scrolled
            ? 'border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
            : 'border-transparent bg-background'
        )}
      >
        <div className="flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center justify-start gap-2">
            <MobileMenu />
            <Logo />
          </div>
          <nav className="hidden flex-1 items-center justify-center gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                className={cn(buttonVariants({ variant: 'ghost' }))}
                href={item.href}
                aria-label={item.label}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-1 items-center justify-end gap-4">
            <AuthButtons />
          </div>
        </div>
      </div>
    </header>
  );
}

function AuthButtons() {
  return (
    <>
      <SignedOut>
        <SignInButton>
          <Button variant="outline" size="sm">
            <LogInIcon className="size-4" />
            Prihlásiť sa
          </Button>
        </SignInButton>
        <SignUpButton>
          <Button size="sm">
            <UserPlusIcon className="size-4" />
            Registrovať sa
          </Button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <div className="flex items-center gap-2">
          <UserButton />
          <Button variant="outline" size="sm">
            <LogOutIcon className="size-4" />
            Odhlásiť sa
          </Button>
        </div>
      </SignedIn>
      <ClerkLoading>
        <Skeleton className="h-8 w-32 rounded-md" />
        <Skeleton className="h-8 w-32 rounded-md" />
        {/* <Skeleton className="size-8 rounded-full" /> */}
      </ClerkLoading>
    </>
  );
}

function MobileMenu() {
  return (
    <Drawer direction="left">
      <DrawerTrigger className="md:hidden">
        <MenuIcon className="size-6" />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="items-center">
          <DrawerTitle>
            <LogoSmall />
          </DrawerTitle>
          <DrawerDescription className="sr-only">
            Nástroj na prijímanie platieb cez QR kód.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex h-full flex-1 items-center justify-center p-4">
          <nav className="w-full">
            <ul className="flex flex-col gap-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      buttonVariants({ variant: 'ghost', size: 'lg' }),
                      'w-full'
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <DrawerFooter className="w-full items-center">
          <AuthButtons />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
