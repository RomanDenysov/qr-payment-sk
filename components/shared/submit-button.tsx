'use client';

import { Button } from '@/components/ui/button';
import { Loader2Icon } from 'lucide-react';
import { useFormStatus } from 'react-dom';

export function SubmitButton({
  formId,
  title,
  className,
}: {
  formId: string;
  title: string;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      form={formId}
      className={className}
    >
      {pending && <Loader2Icon className="animate-spin" />}
      {title}
    </Button>
  );
}
