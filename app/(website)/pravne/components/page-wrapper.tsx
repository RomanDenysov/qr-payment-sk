import { FadeDiv } from '@/components/motion/fade';
import { Card, CardContent } from '@/components/ui/card';
import type { ReactNode } from 'react';

export function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <FadeDiv>
      <Card className="border-none shadow-none sm:border sm:shadow-xl">
        <CardContent className="p-4 sm:p-8 md:p-12">{children}</CardContent>
      </Card>
    </FadeDiv>
  );
}
