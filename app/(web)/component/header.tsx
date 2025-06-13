'use client';

import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { MenuIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button, buttonVariants } from '~/components/ui/button';
import useScroll from '~/hooks/use-scroll';
import { cn } from '~/lib/utils';

export default function Header() {
  const [open, setOpen] = useState(false);
  const scrolled = useScroll(15);
  return (
    <header
      className={cn(
        'fixed inset-x-4 top-4 z-50 mx-auto flex max-w-6xl justify-center rounded-lg border border-transparent px-3 py-3 transition duration-300',
        scrolled || open
          ? 'border-gray-200/50 bg-white/80 shadow-2xl shadow-black/5 backdrop-blur-sm'
          : 'bg-white/0'
      )}
    >
      <div className="w-full md:my-auto">
        <div className="relative flex items-center justify-between">
          <Link href="/" aria-label="Home">
            <span className="sr-only">QR Platby Logo</span>
            <div className="flex items-center gap-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500">
                <span className="font-bold text-sm text-white">QR</span>
              </div>
              <span className="font-black text-gray-900 text-lg tracking-normal">
                Platby
              </span>
            </div>
          </Link>
          <nav className="md:-translate-x-1/2 md:-translate-y-1/2 hidden sm:block md:absolute md:top-1/2 md:left-1/2 md:transform">
            <div className="flex items-center gap-10 font-medium">
              <Link
                className="px-2 py-1 text-gray-900 transition-colors hover:text-orange-600"
                href="#features"
              >
                Ako to funguje
              </Link>
              <Link
                className="px-2 py-1 text-gray-900 transition-colors hover:text-orange-600"
                href="#pricing"
              >
                Cenník
              </Link>
              <Link
                className="px-2 py-1 text-gray-900 transition-colors hover:text-orange-600"
                href="#faq"
              >
                FAQ
              </Link>
            </div>
          </nav>
          <div className="flex items-center gap-2">
            <SignedOut>
              <Link
                href="/sign-in"
                className={cn(buttonVariants({ variant: 'secondary' }))}
              >
                Prihlásiť sa
              </Link>
              <Link
                href="/sign-up"
                className={cn(buttonVariants({ variant: 'default' }))}
              >
                Zaregistrovať sa
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                href="/overview"
                className={cn(buttonVariants({ variant: 'default' }), 'mr-2')}
              >
                Generovať QR
              </Link>
              <UserButton />
            </SignedIn>
          </div>{' '}
          <Button
            onClick={() => setOpen(!open)}
            variant="secondary"
            className="p-1.5 sm:hidden"
            aria-label={open ? 'CloseNavigation Menu' : 'Open Navigation Menu'}
          >
            {open ? (
              <XIcon className="size-6 shrink-0 text-gray-900" aria-hidden />
            ) : (
              <MenuIcon className="size-6 shrink-0 text-gray-900" aria-hidden />
            )}
          </Button>
        </div>
        <nav
          className={cn(
            'mt-6 flex flex-col gap-6 text-lg ease-in-out will-change-transform sm:hidden',
            open ? '' : 'hidden'
          )}
        >
          <ul className="space-y-4 font-medium">
            <li onClick={() => setOpen(false)} onKeyDown={() => setOpen(false)}>
              <Link
                href="#features"
                className="transition-colors hover:text-orange-600"
              >
                Ako to funguje
              </Link>
            </li>
            <li onClick={() => setOpen(false)} onKeyDown={() => setOpen(false)}>
              <Link
                href="#pricing"
                className="transition-colors hover:text-orange-600"
              >
                Cenník
              </Link>
            </li>
            <li onClick={() => setOpen(false)} onKeyDown={() => setOpen(false)}>
              <Link
                href="#faq"
                className="transition-colors hover:text-orange-600"
              >
                FAQ
              </Link>
            </li>
          </ul>
          <Link
            href="/sign-in"
            className={cn(buttonVariants({ variant: 'secondary' }))}
          >
            Prihlásiť sa
          </Link>
          <Link
            href="/sign-up"
            className={cn(buttonVariants({ variant: 'secondary' }))}
          >
            Zaregistrovať sa
          </Link>
        </nav>
      </div>
    </header>
  );
}
