'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryState } from 'nuqs';
import { useForm } from 'react-hook-form';
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
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-2xl">{title}</h1>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
          <Button type="submit">
            {authState === 'prihlasenie' ? 'Prihlásiť sa' : 'Registrácia'}
          </Button>
        </form>
      </Form>
      <div className="flex flex-col gap-2">
        {authState === 'prihlasenie' ? (
          <p className="text-muted-foreground text-sm">
            Nemáte účet?{' '}
            <Button
              variant="link"
              className="underline"
              onClick={() => setAuthState('registracia')}
            >
              Registrácia
            </Button>
          </p>
        ) : (
          <p className="text-muted-foreground text-sm">
            Už máte účet?{' '}
            <Button
              variant="link"
              className="underline"
              onClick={() => setAuthState('prihlasenie')}
            >
              Prihlásenie
            </Button>
          </p>
        )}
      </div>
    </div>
  );
}
