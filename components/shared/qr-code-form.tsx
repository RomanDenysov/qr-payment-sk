'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useQrCodeDrawer } from '@/hooks/use-qr-code-drawer';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon, QrCodeIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { IBANInput } from './iban-input';

const formSchema = z.object({
  iban: z.string().min(1),
  amount: z.number().min(1),
  variableSymbol: z.string().optional(),
  paymentNote: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function QrCodeForm() {
  const setQrCodeUrl = useQrCodeDrawer((state) => state.setQrCodeUrl);
  const setIsOpen = useQrCodeDrawer((state) => state.setIsOpen);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      iban: '',
      amount: 0,
      variableSymbol: '',
      paymentNote: '',
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = (data: FormValues) => {
    // setQrCodeUrl(data);
    setIsOpen(true);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid size-full grid-cols-3 gap-4 sm:grid-cols-5"
      >
        <FormField
          control={form.control}
          name="iban"
          render={({ field }) => (
            <FormItem className="col-span-3 sm:col-span-5">
              <FormLabel>IBAN</FormLabel>
              <FormControl>
                <IBANInput
                  id="iban"
                  maxLength={29}
                  placeholder="SK31 1200 0000 1987 4263 7541"
                  aria-describedby="iban-error"
                  autoCapitalize="characters"
                  required
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="col-span-1 sm:col-span-2">
              <FormLabel>Suma</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="variableSymbol"
          render={({ field }) => (
            <FormItem className="col-span-2 sm:col-span-3">
              <FormLabel>Variabilný symbol</FormLabel>
              <FormControl>
                <Input maxLength={20} placeholder="1234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentNote"
          render={({ field }) => (
            <FormItem className="col-span-3 sm:col-span-5">
              <FormLabel>Poznámka k platbe</FormLabel>
              <FormControl>
                <Textarea
                  maxLength={250}
                  placeholder="Nazov služby, čislo, kód..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-3 mt-2 sm:col-span-5 sm:mt-4">
          <Button
            size="lg"
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2Icon className="animate-spin" />
                Generujem QR kód...
              </>
            ) : (
              <>
                <QrCodeIcon />
                Vygenerovať QR kód
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
