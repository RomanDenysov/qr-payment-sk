'use client';

import { AnimatedBackground } from '@/components/motion-primitives/animated-background';
import { Logo, LogoSmall } from '@/components/shared/logo';
import { buttonVariants } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import useScroll from '@/hooks/use-scroll';
import { cn } from '@/lib/utils';
import { LogInIcon, MenuIcon } from 'lucide-react';
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

export function Header({ isSignedIn }: { isSignedIn: boolean }) {
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
            <MobileMenu isSignedIn={isSignedIn} />

            <div className="transition-opacity duration-200 hover:opacity-90">
              <Logo />
            </div>
          </div>

          <nav className="hidden flex-1 items-center justify-center gap-3 md:flex">
            <AnimatedBackground
              className="rounded-md border border-primary"
              transition={{
                type: 'spring',
                bounce: 0.2,
                duration: 0.3,
              }}
              enableHover
            >
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  data-id={item.href}
                  className={cn(
                    'inline-flex h-8 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 font-medium text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20'
                  )}
                  href={item.href}
                  aria-label={item.label}
                >
                  {item.label}
                </Link>
              ))}
            </AnimatedBackground>
          </nav>

          <div className="flex flex-1 items-center justify-end gap-3">
            {isSignedIn ? (
              <Link
                href="/dashboard"
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'sm' }),
                  'hidden border border-transparent transition-colors hover:border-primary hover:bg-transparent hover:text-primary sm:flex'
                )}
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/autorizacia"
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'sm' }),
                  'hidden border border-transparent transition-colors hover:border-primary hover:bg-transparent hover:text-primary sm:flex'
                )}
              >
                <LogInIcon className="size-4" />
                Prihlásiť sa
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function MobileMenu({ isSignedIn }: { isSignedIn: boolean }) {
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
              {isSignedIn ? (
                <Link
                  href="/dashboard"
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'sm' }),
                    'hidden w-full border border-transparent transition-colors hover:border-primary hover:bg-transparent hover:text-primary sm:flex'
                  )}
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/autorizacia"
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'sm' }),
                    'hidden w-full border border-transparent transition-colors hover:border-primary hover:bg-transparent hover:text-primary sm:flex'
                  )}
                >
                  <LogInIcon className="size-4" />
                  Prihlásiť sa
                </Link>
              )}
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
