import { AuthCard } from '@/components/auth/auth-card';
import { ProvidersForm } from '@/components/auth/providers-form';
import { FadeDiv } from '@/components/motion/fade';
import { appleSignUpFlag } from '@/lib/flags';
import Link from 'next/link';

export default async function AutorizaciaPage() {
  const appleSignUpFlagValue = await appleSignUpFlag();
  return (
    <div className="mx-auto size-full max-w-xs sm:max-w-sm md:max-w-md">
      <div className="space-y-6">
        <AuthCard />

        <FadeDiv className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-border after:border-t">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Alebo
          </span>
        </FadeDiv>

        <ProvidersForm flagValue={appleSignUpFlagValue} />

        <FadeDiv className="text-balance text-center text-muted-foreground text-xs *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-primary">
          Pri pokračovaní súhlasíte s našimi{' '}
          <Link href="/pravne/obchodne-podmienky">Obchodné podmienky</Link> a{' '}
          <Link href="/pravne/ochrana-sukromia">Ochrana súkromia</Link>.
        </FadeDiv>
      </div>
    </div>
  );
}
