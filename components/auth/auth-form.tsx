'use client';
import { emailOtp, signIn } from '@/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
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
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';

const emailSchema = z.object({
  email: z.string().email(),
});

const otpSchema = z.object({
  otp: z
    .string()
    .min(6, 'OTP musí mať 6 znakov')
    .max(6, 'OTP musí mať 6 znakov'),
});

type AuthState = 'prihlasenie' | 'registracia' | 'otp';

export function AuthForm() {
  const router = useRouter();
  const [authState, setAuthState] = useQueryState<AuthState>('status', {
    defaultValue: 'prihlasenie',
    history: 'push',
    shallow: true,
    parse: (value) => value as AuthState,
    serialize: (value) => value as AuthState,
  });

  const [isPending, startTransition] = useTransition();
  const [userEmail, setUserEmail] = useState('');

  const handleSocialSignIn = (provider: 'google' | 'apple') => {
    startTransition(async () => {
      await signIn.social({
        provider,
        callbackURL: '/dashboard',
      });
    });
  };

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const getTitle = () => {
    switch (authState) {
      case 'prihlasenie':
        return 'Prihlásenie';
      case 'registracia':
        return 'Registrácia';
      case 'otp':
        return 'Overte váš email';
      default:
        return 'Prihlásenie';
    }
  };

  const getDescription = () => {
    switch (authState) {
      case 'prihlasenie':
        return 'Prihláste sa do svojho účtu';
      case 'registracia':
        return 'Vytvorte si nový účet';
      case 'otp':
        return `Zadajte 6-miestny kód, ktorý sme poslali na ${userEmail}`;
      default:
        return 'Prihláste sa do svojho účtu';
    }
  };

  const onEmailSubmit = (data: z.infer<typeof emailSchema>) => {
    startTransition(async () => {
      try {
        await emailOtp.sendVerificationOtp({
          email: data.email,
          type: 'sign-in',
        });

        setUserEmail(data.email);
        setAuthState('otp');
        toast.success('OTP kód bol odoslaný na váš email');
      } catch (error) {
        toast.error('Chyba pri odosielaní OTP kódu');
        console.error('OTP send error:', error);
      }
    });
  };

  const onOtpSubmit = (data: z.infer<typeof otpSchema>) => {
    startTransition(async () => {
      try {
        await signIn.emailOtp({
          email: userEmail,
          otp: data.otp,
        });

        toast.success('Úspešne ste sa prihlásili!');
        router.push('/dashboard');
      } catch (error) {
        toast.error('Neplatný alebo nesprávny OTP kód');
        // biome-ignore lint/suspicious/noConsole: <explanation>
        console.error('OTP verification error:', error);
        otpForm.reset();
      }
    });
  };

  const handleResendOtp = () => {
    startTransition(async () => {
      try {
        await emailOtp.sendVerificationOtp({
          email: userEmail,
          type: 'sign-in',
        });
        toast.success('OTP kód bol znovu odoslaný');
      } catch (error) {
        toast.error('Chyba pri opätovnom odosielaní OTP kódu');
        // biome-ignore lint/suspicious/noConsole: <explanation>
        console.error('OTP resend error:', error);
      }
    });
  };

  const handleBackToEmail = () => {
    setAuthState(authState === 'otp' ? 'prihlasenie' : 'prihlasenie');
    setUserEmail('');
    otpForm.reset();
  };

  return (
    <div className="mx-auto size-full max-w-xs sm:max-w-sm md:max-w-md">
      <div className="space-y-6">
        <div className="flex flex-col gap-1 text-center">
          {authState === 'otp' && (
            <FadeDiv className="mb-4 flex justify-start">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToEmail}
                disabled={isPending}
                className="h-auto p-0"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Späť
              </Button>
            </FadeDiv>
          )}

          <h1 className="font-bold text-3xl leading-none">
            <FadeSpan>{getTitle()}</FadeSpan>
          </h1>
          <p className="text-lg text-muted-foreground">
            <FadeSpan>{getDescription()}</FadeSpan>
          </p>

          {authState !== 'otp' && (
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
          )}
        </div>

        {authState === 'otp' ? (
          <FadeDiv>
            <Form {...otpForm}>
              <form
                onSubmit={otpForm.handleSubmit(onOtpSubmit)}
                className="size-full space-y-6"
              >
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center space-y-4">
                      <FormLabel>Overovací kód</FormLabel>
                      <FormControl>
                        <InputOTP
                          maxLength={6}
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isPending}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isPending || otpForm.watch('otp').length !== 6}
                >
                  {isPending ? (
                    <>
                      <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                      Overovanie...
                    </>
                  ) : (
                    'Overiť kód'
                  )}
                </Button>

                <div className="text-center">
                  <p className="mb-2 text-muted-foreground text-sm">
                    Nedostali ste kód?
                  </p>
                  <Button
                    type="button"
                    variant="link"
                    onClick={handleResendOtp}
                    disabled={isPending}
                    className="h-auto p-0 text-primary"
                  >
                    Poslať znovu
                  </Button>
                </div>
              </form>
            </Form>
          </FadeDiv>
        ) : (
          <>
            <FadeDiv>
              <Form {...emailForm}>
                <form
                  onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                  className="size-full space-y-4"
                >
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Email"
                            {...field}
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? (
                      <>
                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                        Odosielanie...
                      </>
                      // biome-ignore lint/nursery/noNestedTernary: <explanation>
                    ) : authState === 'prihlasenie' ? (
                      'Prihlásiť sa'
                    ) : (
                      'Registrácia'
                    )}
                  </Button>
                </form>
              </Form>
            </FadeDiv>

            <FadeDiv className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-border after:border-t">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Alebo
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="mr-2 h-4 w-4"
                  >
                    <title>Apple</title>
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                )}
                Apple
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="mr-2 h-4 w-4"
                  >
                    <title>Google</title>
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                )}
                Google
              </Button>
            </FadeDiv>
          </>
        )}

        <FadeDiv className="text-balance text-center text-muted-foreground text-xs *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-primary">
          Pri pokračovaní súhlasíte s našimi{' '}
          <Link href="/pravne/obchodne-podmienky">Obchodné podmienky</Link> a{' '}
          <Link href="/pravne/ochrana-sukromia">Ochrana súkromia</Link>.
        </FadeDiv>
      </div>
    </div>
  );
}
