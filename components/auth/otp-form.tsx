'use client';

import { emailOtp, signIn } from '@/lib/auth-client';
import { isDev } from '@/lib/configs';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';

const otpSchema = z.object({
  otp: z.string().min(6, 'OTP musí mať 6 znakov'),
});

type OtpFormValues = z.infer<typeof otpSchema>;

export function OtpForm({ userEmail }: { userEmail: string }) {
  const router = useRouter();
  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (data: z.infer<typeof otpSchema>) =>
    await signIn.emailOtp(
      {
        email: userEmail,
        otp: data.otp,
      },
      {
        onSuccess: () => {
          toast.success('Úspešne ste sa prihlásili!');
          form.reset();
          router.push('/dashboard');
        },
        onError: (error) => {
          toast.error('Neplatný alebo nesprávny OTP kód');
          // biome-ignore lint/suspicious/noConsole: <explanation>
          console.error('OTP verification error:', error);
          form.reset();
        },
      }
    );

  const handleResendOtp = async () =>
    await emailOtp.sendVerificationOtp(
      {
        email: userEmail,
        type: 'sign-in',
      },
      {
        onSuccess: () => {
          toast.success('OTP kód bol znovu odoslaný');
        },
        onError: (error) => {
          toast.error('Chyba pri odosielaní OTP kódu');
          // biome-ignore lint/suspicious/noConsole: <explanation>
          console.error('OTP resend error:', error);
        },
      }
    );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="size-full space-y-6"
      >
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center space-y-4">
              <FormLabel>Overovací kód</FormLabel>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  disabled={isSubmitting}
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
          disabled={isSubmitting || !form.formState.isValid}
        >
          {isSubmitting ? (
            <>
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              Overovanie...
            </>
          ) : (
            'Overiť kód'
          )}
        </Button>

        {/* Debug info */}
        {isDev && (
          <div className="mt-2 space-y-1 text-muted-foreground text-xs">
            <div>OTP Length: {form.watch('otp')?.length || 0}</div>
            <div>OTP Value: "{form.watch('otp')}"</div>
            <div>Is Valid: {form.formState.isValid ? 'Yes' : 'No'}</div>
            <div>Is Submitting: {isSubmitting ? 'Yes' : 'No'}</div>
            <div>Errors: {JSON.stringify(form.formState.errors)}</div>
            <button
              type="button"
              onClick={() => form.setValue('otp', '123456')}
              className="rounded bg-blue-500 px-2 py-1 text-white text-xs"
            >
              Test Set OTP
            </button>
          </div>
        )}

        <div className="text-center">
          <p className="mb-2 text-muted-foreground text-sm">
            Nedostali ste kód?
          </p>
          <Button
            type="button"
            variant="link"
            onClick={handleResendOtp}
            disabled={isSubmitting}
            className="h-auto p-0 text-primary"
          >
            Poslať znovu
          </Button>
        </div>
      </form>
    </Form>
  );
}
