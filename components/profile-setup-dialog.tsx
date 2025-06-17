'use client';

import { createProfile } from '@/app/actions/profile';
import { IBANInput } from '@/components/shared/iban-input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const profileSchema = z.object({
  businessName: z.string().min(1, 'Business name is required').max(200),
  defaultIban: z
    .string()
    .regex(/^SK\d{22}$/, 'Invalid Slovak IBAN format')
    .optional()
    .or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileSetupDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ProfileSetupDialog({
  open,
  onOpenChange,
}: ProfileSetupDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      businessName: '',
      defaultIban: '',
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('businessName', data.businessName);
      formData.append('defaultIban', data.defaultIban || '');

      const result = await createProfile(formData);

      if (result.success) {
        toast.success('Profile created successfully!');
        onOpenChange?.(false);
        router.refresh();
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to create profile'
      );
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            To start generating QR codes, please provide some basic information
            about your business.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your business name"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    This will be used to identify your business in the
                    dashboard.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="defaultIban"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default IBAN (Optional)</FormLabel>
                  <FormControl>
                    <IBANInput
                      placeholder="SK1234567890123456789012"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Set a default Slovak IBAN to save time when creating QR
                    codes. You can change this later.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Complete Setup'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
