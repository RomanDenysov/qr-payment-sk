import Link from 'next/link';
import type { ReactNode } from 'react';

export function Logo({
  children,
  href = '/',
}: { children?: ReactNode; href?: string }) {
  return (
    <Link href={href} aria-label="domov" className="flex items-center gap-1">
      {children}
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
  );
}

export function LogoSmall({
  children,
  href = '/',
}: { children: ReactNode; href?: string }) {
  return (
    <Link href={href} aria-label="domov" className="flex items-center gap-1">
      {children}
      <span className="sr-only">QR Platby Logo</span>
      <div className="flex items-center gap-1">
        <div className="flex size-6 items-center justify-center rounded-md bg-primary">
          <span className="font-bold text-secondary text-xs">QR</span>
        </div>
        <span className="font-black text-primary text-sm tracking-normal">
          Platby
        </span>
      </div>
    </Link>
  );
}
