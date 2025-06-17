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
import { LogInIcon, MenuIcon, UserPlusIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const navItems = [
  {
    label: 'Výhody',
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
    <header className={cn('sticky top-0 z-50 mx-auto')}>
      <div
        className={cn(
          'container mx-auto max-w-7xl border-transparent border-b px-4 transition-all duration-300 md:px-6',
          scrolled
            ? 'border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/80'
            : 'border-transparent bg-background'
        )}
      >
        <div className="flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center justify-start gap-2">
            <MobileMenu />

            <div className="transition-transform duration-200 hover:scale-105">
              <Logo />
            </div>
          </div>

          <nav className="hidden flex-1 items-center justify-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                className={cn(
                  buttonVariants({ variant: 'ghost' }),
                  'relative overflow-hidden transition-all duration-200 hover:bg-primary/10 hover:text-primary'
                )}
                href={item.href}
                aria-label={item.label}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-1 items-center justify-end gap-3">
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
        <div className="flex items-center gap-2">
          <SignInButton>
            <Button
              variant="ghost"
              size="sm"
              className="hidden transition-colors hover:bg-primary/10 hover:text-primary sm:flex"
            >
              <LogInIcon className="size-4" />
              Prihlásiť sa
            </Button>
          </SignInButton>
          <SignUpButton>
            <Button
              size="sm"
              className="bg-gradient-to-r from-primary to-primary/75 transition-all duration-200 hover:from-primary/90 hover:to-primary"
            >
              <UserPlusIcon className="size-4" />
              Registrovať sa
            </Button>
          </SignUpButton>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="hidden transition-colors hover:bg-destructive/10 hover:text-destructive sm:flex"
            asChild
          >
            <Link href="/dashboard">Dashboard</Link>
          </Button>

          <UserButton
            appearance={{
              elements: {
                avatarBox: '!size-8 !rounded-lg',
              },
            }}
          />
        </div>
      </SignedIn>

      <ClerkLoading>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </ClerkLoading>
    </>
  );
}

function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Drawer direction="left" open={open} onOpenChange={setOpen}>
      <DrawerTrigger className="rounded-md p-1 transition-colors hover:bg-primary/10 md:hidden">
        <MenuIcon className="size-6" />
      </DrawerTrigger>
      <DrawerContent className="h-full w-80 max-w-[85vw]">
        <div className="flex h-full flex-col">
          <DrawerHeader>
            <DrawerTitle className="flex items-center justify-center">
              <LogoSmall />
            </DrawerTitle>

            <DrawerDescription className="sr-only">
              Nástroj na prijímanie platieb cez QR kód
            </DrawerDescription>
          </DrawerHeader>

          <div className="mx-auto w-full flex-1 p-6">
            <nav className="flex w-full flex-col gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'sm' }),
                    'w-full'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <DrawerFooter>
            <div className="space-y-3">
              <SignedOut>
                <SignInButton>
                  <Button variant="outline" className="w-full">
                    <LogInIcon className="size-4" />
                    Prihlásiť sa
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button className="w-full bg-gradient-to-r from-primary to-primary/75">
                    <UserPlusIcon className="size-4" />
                    Registrovať sa
                  </Button>
                </SignUpButton>
              </SignedOut>

              <SignedIn>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <div className="flex items-center justify-center pt-2">
                  <UserButton />
                </div>
              </SignedIn>

              <ClerkLoading>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </ClerkLoading>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
