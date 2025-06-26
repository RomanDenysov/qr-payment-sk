'use client';

import { generateQRCodeAuth } from '@/app/actions/qr-codes';
import { IbanInput } from '@/components/shared/iban-input';
import { ShowQrDrawer } from '@/components/show-qr-drawer';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { NumberScrubber } from '@/components/ui/number-scrubber';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/hooks/use-user';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, QrCode } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// Form validation schema matching the server action
const qrGenerationSchema = z.object({
  iban: z
    .string()
    .regex(/^SK\d{22}$/, 'Invalid Slovak IBAN format')
    .transform((val) => val.replace(/\s+/g, '').toUpperCase()),
  amount: z
    .number()
    .min(0.01, 'Amount must be at least €0.01')
    .max(99999999.99, 'Amount cannot exceed €99,999,999.99'),
  variableSymbol: z
    .string()
    .regex(/^\d{1,10}$/, 'Variable symbol must be 1-10 digits')
    .optional()
    .or(z.literal('')),
  constantSymbol: z
    .string()
    .regex(/^\d{1,10}$/, 'Constant symbol must be 1-10 digits')
    .optional()
    .or(z.literal('')),
  paymentNote: z
    .string()
    .max(140, 'Payment note cannot exceed 140 characters')
    .optional(),
});

type QrGenerationInput = z.infer<typeof qrGenerationSchema>;

interface QrResult {
  qrId: string;
  qrData: string;
  qrCodeUrl: string;
  variableSymbol: string;
  usageStatus?: {
    used: number;
    remaining: number;
    limit: number;
    plan: string;
  };
}

export function DashboardQrGenerator() {
  const user = useUser();
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrResult, setQrResult] = useState<QrResult | null>(null);
  const [showQrDrawer, setShowQrDrawer] = useState(false);

  const form = useForm<QrGenerationInput>({
    resolver: zodResolver(qrGenerationSchema),
    defaultValues: {
      iban: '',
      amount: 0,
      variableSymbol: '',
      constantSymbol: '',
      paymentNote: '',
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!user) {
      toast.error('Musíte byť prihlásený pre generovanie QR kódov');
      return;
    }

    setIsGenerating(true);

    try {
      // Clean up empty optional fields
      const cleanData = {
        ...data,
        variableSymbol: data.variableSymbol || undefined,
        constantSymbol: data.constantSymbol || undefined,
        paymentNote: data.paymentNote || undefined,
      };

      const result = await generateQRCodeAuth(cleanData);

      if (result.data) {
        setQrResult(result.data);
        setShowQrDrawer(true);

        toast.success('QR kód úspešne vygenerovaný');

        // Show usage status if available
        if (result.data.usageStatus) {
          const { used, remaining, limit, plan } = result.data.usageStatus;
          if (limit !== -1 && remaining <= 10) {
            toast.warning(
              `Pozor: Zostáva vám už len ${remaining} QR kódov v ${plan} pláne`
            );
          }
        }
      } else if (result.serverError) {
        toast.error(result.serverError);
      }
    } catch (error) {
      console.error('QR generation error:', error);
      toast.error('Nepodarilo sa vygenerovať QR kód');
    } finally {
      setIsGenerating(false);
    }
  });

  const handleCloseDrawer = () => {
    setShowQrDrawer(false);
    // Keep qrResult for potential re-opening
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="flex h-64 items-center justify-center">
          <div className="text-center">
            <QrCode className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 font-medium text-lg">Prihlásenie požadované</h3>
            <p className="text-muted-foreground">
              Pre generovanie QR kódov sa musíte prihlásiť
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Generátor
          </CardTitle>
          <CardDescription>
            Vytvorte BySquare QR kód pre slovenské platby
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* IBAN Field */}
              <FormField
                control={form.control}
                name="iban"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IBAN účet *</FormLabel>
                    <FormControl>
                      <IbanInput
                        placeholder="SK1234567890123456789012"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Amount Field */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Suma (EUR) *</FormLabel>
                    <FormControl>
                      <NumberScrubber
                        placeholder="0.00"
                        min={0.01}
                        max={99999999.99}
                        step={0.01}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Optional Fields */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="variableSymbol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Variabilný symbol</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="1234567890"
                          maxLength={10}
                          {...field}
                        />
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
                      <FormLabel>Konštantný symbol</FormLabel>
                      <FormControl>
                        <Input placeholder="0308" maxLength={10} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Payment Note */}
              <FormField
                control={form.control}
                name="paymentNote"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Poznámka k platbe</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Popis platby (max 140 znakov)"
                        maxLength={140}
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isGenerating}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generuje sa...
                  </>
                ) : (
                  <>
                    <QrCode className="mr-2 h-4 w-4" />
                    Vygenerovať QR kód
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* QR Result Drawer */}
      {qrResult && (
        <ShowQrDrawer
          open={showQrDrawer}
          onClose={handleCloseDrawer}
          qrData={qrResult.qrData}
          qrCodeUrl={qrResult.qrCodeUrl}
          variableSymbol={qrResult.variableSymbol}
          usageStatus={qrResult.usageStatus}
        />
      )}
    </>
  );
}
