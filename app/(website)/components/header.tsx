'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import useScroll from '@/hooks/useScroll';
import { cn } from '@/lib/utils';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import { LogInIcon, UserPlusIcon } from 'lucide-react';
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
    <header
      className={cn(
        'sticky top-0 z-40 mx-auto max-w-7xl border-transparent border-b ',
        scrolled
          ? 'border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
          : 'border-transparent bg-background'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="grid h-16 grid-cols-3 items-center">
          <Link href="/" aria-label="domov">
            <span className="sr-only">QR Platby Logo</span>
            <div className="flex items-center gap-1">
              <div className="flex size-8 items-center justify-center rounded-md bg-primary">
                <span className="font-bold text-secondary text-sm">QR</span>
              </div>
              <span className="font-black text-lg text-primary tracking-normal">
                Platby
              </span>
            </div>
          </Link>
          <nav className="flex items-center justify-center gap-6">
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
          <div className="flex items-center justify-end gap-4">
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
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
}
