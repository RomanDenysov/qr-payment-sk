'use client';
import { signIn } from '@/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { useQueryState } from 'nuqs';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { FadeDiv, FadeSpan } from '../motion/fade';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';

const emailSchema = z.object({
  email: z.string().email(),
});

type AuthState = 'prihlasenie' | 'registracia' | 'otp';

export function AuthForm() {
  const [authState, setAuthState] = useQueryState<AuthState>('status', {
    defaultValue: 'prihlasenie',
    history: 'push',
    shallow: true,
    parse: (value) => value as AuthState,
    serialize: (value) => value as AuthState,
  });

  const [isPending, startTransition] = useTransition();

  const handleSocialSignIn = (provider: 'google' | 'apple') => {
    startTransition(async () => {
      await signIn.social({
        provider,
        callbackURL: '/dashboard',
      });
    });
  };

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  const title = authState === 'prihlasenie' ? 'Prihlásenie' : 'Registrácia';
  const description =
    authState === 'prihlasenie'
      ? 'Prihláste sa do svojho účtu'
      : 'Vytvorte si nový účet';

  const onSubmit = (data: z.infer<typeof emailSchema>) => {
    if (authState === 'prihlasenie') {
      console.log(data);
    } else {
      console.log(data);
    }
  };

  return (
    <div className="mx-auto size-full max-w-xs sm:max-w-sm md:max-w-md">
      <div className="space-y-6">
        <div className="flex flex-col gap-1 text-center">
          <h1 className="font-bold text-3xl leading-none">
            <FadeSpan>{title}</FadeSpan>
          </h1>
          <p className="text-lg text-muted-foreground">
            <FadeSpan>{description}</FadeSpan>
          </p>
          <FadeDiv className="inline-flex items-center justify-center gap-1">
            {authState === 'prihlasenie' ? (
              <p className="text-muted-foreground text-sm">
                Nemáte účet?{' '}
                <button
                  type="button"
                  className="cursor-pointer text-primary underline"
                  onClick={() => setAuthState('registracia')}
                >
                  Zaregistrovať sa
                </button>
              </p>
            ) : (
              <p className="text-muted-foreground text-sm">
                Už máte účet?{' '}
                <button
                  type="button"
                  className="cursor-pointer text-primary underline"
                  onClick={() => setAuthState('prihlasenie')}
                >
                  Prihlásiť sa
                </button>
              </p>
            )}
          </FadeDiv>
        </div>

        <FadeDiv>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="size-full space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {authState === 'prihlasenie' ? 'Prihlásiť sa' : 'Registrácia'}
              </Button>
            </form>
          </Form>
        </FadeDiv>
        <FadeDiv className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-border after:border-t">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or
          </span>
        </FadeDiv>
        <FadeDiv className="grid gap-4 sm:grid-cols-2">
          <Button
            variant="outline"
            type="button"
            className="w-full"
            disabled={isPending}
            onClick={() => handleSocialSignIn('apple')}
          >
            {isPending ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>Apple</title>
                <path
                  d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                  fill="currentColor"
                />
              </svg>
            )}
            Pokračovať s Apple
          </Button>
          <Button
            variant="outline"
            disabled={isPending}
            type="button"
            className="w-full"
            onClick={() => handleSocialSignIn('google')}
          >
            {isPending ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>Google</title>
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
            )}
            Pokračovať s Google
          </Button>
        </FadeDiv>
        <FadeDiv className="text-balance text-center text-muted-foreground text-xs *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-primary">
          By clicking continue, you agree to our{' '}
          <Link href="/pravne/obchodne-podmienky">Obchodné podmienky</Link> a{' '}
          <Link href="/pravne/ochrana-sukromia">Ochrana súkromia</Link>.
        </FadeDiv>
      </div>
    </div>
  );
}
