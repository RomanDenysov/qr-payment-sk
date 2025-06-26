'use client';

import { useFormStatus } from 'react-dom';
import { Button, type ButtonProps } from '../ui/button';

export function FormButton({ children, ...props }: ButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" {...props} disabled={pending}>
      {children}
    </Button>
  );
}
