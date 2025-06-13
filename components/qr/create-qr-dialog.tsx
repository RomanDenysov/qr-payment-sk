'use client';

import { type ReactNode, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { CopyIcon, DownloadIcon, RefreshCwIcon } from 'lucide-react';
import Image from 'next/image';
import QRCode from 'qrcode';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { QRLoading } from '~/components/motion/qr-loading';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';

interface CreateQRDialogProps {
  children: ReactNode;
}

const formSchema = z.object({
  amount: z
    .string()
    .min(1, 'Suma je povinná')
    .refine((val) => {
      const num = Number.parseFloat(val);
      return !Number.isNaN(num) && num > 0;
    }, 'Suma musí byť kladné číslo'),
  iban: z
    .string()
    .min(1, 'IBAN je povinný')
    .regex(
      /^SK\d{2}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/i,
      'Prosím zadajte platný slovenský IBAN'
    ),
  recipientName: z.string().min(1, 'Meno príjemcu je povinné').trim(),
  description: z.string().optional(),
  variableSymbol: z.string().optional(),
  constantSymbol: z.string().optional(),
  specificSymbol: z.string().optional(),
});

type PaymentFormData = z.infer<typeof formSchema>;

export function CreateQRDialog({ children }: CreateQRDialogProps) {
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '',
      iban: '',
      recipientName: '',
      description: '',
      variableSymbol: '',
      constantSymbol: '',
      specificSymbol: '',
    },
  });

  const handleGenerateQR = async (data: PaymentFormData) => {
    setIsGenerating(true);
    setQrCodeUrl(null);

    try {
      // Call the Next.js API route which forwards to the QR service
      const response = await fetch('/api/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          iban: data.iban,
          amount: data.amount,
          recipientName: data.recipientName,
          description: data.description || undefined,
          variableSymbol: data.variableSymbol || undefined,
          constantSymbol: data.constantSymbol || undefined,
          specificSymbol: data.specificSymbol || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Chyba pri generovaní QR kódu');
      }

      // Generate QR code from the backend response
      const qrDataUrl = await QRCode.toDataURL(result.qrString, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      setQrCodeUrl(qrDataUrl);
      toast.success('QR kód bol úspešne vygenerovaný!');
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.error('Error generating QR code:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Chyba pri generovaní QR kódu';
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadQR = () => {
    if (!qrCodeUrl) {
      return;
    }

    const link = document.createElement('a');
    link.download = `payment-qr-${Date.now()}.png`;
    link.href = qrCodeUrl;
    link.click();
    toast.success('QR kód bol stiahnutý');
  };

  const handleCopyQR = async () => {
    if (!qrCodeUrl) {
      return;
    }

    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      toast.success('QR kód bol skopírovaný do schránky');
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.error('Error copying QR code:', error);
      toast.error('Chyba pri kopírovaní QR kódu');
    }
  };

  const handleReset = () => {
    form.reset();
    setQrCodeUrl(null);
    setIsGenerating(false);
  };

  const handleClose = () => {
    setOpen(false);
    // Reset after a short delay to avoid visual glitch
    setTimeout(() => {
      handleReset();
    }, 200);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:w-full sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Generovať QR kód pre platbu</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleGenerateQR)}
            className="grid grid-cols-1 gap-6 lg:grid-cols-2"
          >
            {/* Form Section */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Suma (€) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="iban"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IBAN *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="SK89 0200 0000 0000 0000"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="recipientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meno príjemcu *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Meno a priezvisko / Názov spoločnosti"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Popis platby</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Popis účelu platby"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-2">
                <FormField
                  control={form.control}
                  name="variableSymbol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>VS</FormLabel>
                      <FormControl>
                        <Input placeholder="Variabilný symbol" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="constantSymbol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>KS</FormLabel>
                      <FormControl>
                        <Input placeholder="Konštantný symbol" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="specificSymbol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SS</FormLabel>
                      <FormControl>
                        <Input placeholder="Špecifický symbol" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* QR Code Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="flex size-[400px] items-center justify-center">
                {isGenerating ? (
                  <QRLoading size={400} />
                  // biome-ignore lint/nursery/noNestedTernary: <explanation>
                ) : qrCodeUrl ? (
                  <Image
                    src={qrCodeUrl}
                    alt="Payment QR Code"
                    className="size-full rounded-lg border object-contain"
                    width={400}
                    height={400}
                  />
                ) : (
                  <div className="flex size-full items-center justify-center rounded-lg border-2 border-gray-300 border-dashed text-muted-foreground">
                    <p className="text-center">
                      QR kód sa zobrazí tu
                      <br />
                      po vyplnení formulára
                    </p>
                  </div>
                )}
              </div>

              {qrCodeUrl && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDownloadQR}
                  >
                    <DownloadIcon className="h-4 w-4" />
                    Stiahnuť
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCopyQR}>
                    <CopyIcon className="h-4 w-4" />
                    Kopírovať
                  </Button>
                </div>
              )}
            </div>
          </form>
          <DialogFooter>
            {qrCodeUrl && (
              <Button type="button" variant="outline" onClick={handleReset}>
                <RefreshCwIcon className="mr-2 h-4 w-4" />
                Reset
              </Button>
            )}
            <Button type="button" variant="outline" onClick={handleClose}>
              Zatvoriť
            </Button>
            <Button type="submit" disabled={isGenerating}>
              {isGenerating ? 'Generujem...' : 'Generovať QR kód'}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
