'use client';

import { emailOtp } from '@/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
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
import { useAuthState } from './use-auth-state';

const emailSchema = z.object({
  email: z.string().email(),
});

type EmailFormValues = z.infer<typeof emailSchema>;

export function EmailForm({
  setUserEmail,
}: { setUserEmail: (email: string) => void }) {
  const { authState, setAuthState } = useAuthState();

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (data: z.infer<typeof emailSchema>) => {
    await emailOtp.sendVerificationOtp(
      {
        email: data.email,
        type: 'sign-in',
      },
      {
        onSuccess: () => {
          toast.success('OTP kód bol odoslaný na váš email');
          setUserEmail(data.email);
          setAuthState('otp');
          form.reset();
        },
        onError: (error) => {
          toast.error('Chyba pri odosielaní OTP kódu');
          // biome-ignore lint/suspicious/noConsole: <explanation>
          console.error('OTP send error:', error);
        },
      }
    );
  };

  return (
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
                <Input placeholder="Email" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
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
  );
}
