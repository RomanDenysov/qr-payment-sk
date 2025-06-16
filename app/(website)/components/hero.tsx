import { FadeContainer, FadeDiv, FadeSpan } from '@/components/motion/fade';
import { Badge } from '@/components/ui/badge';
import { QRCard } from './qr-card';

export function Hero() {
  return (
    <section aria-label="hero" className="relative w-full py-20 lg:py-40">
      <FadeContainer className="grid grid-cols-1 items-center gap-8 px-4 md:grid-cols-2 md:px-6">
        <div className="flex flex-col items-center gap-4 md:items-start">
          <FadeDiv>
            <Badge variant="outline">
              <span className="mr-1 size-2.5 rounded-full bg-green-400" />
              My sme online!
            </Badge>
          </FadeDiv>
          <div className="flex flex-col gap-4">
            <h1 className="text-center font-medium text-5xl tracking-tighter sm:text-7xl sm:leading-[4.5rem] md:text-left">
              <FadeSpan>Prijímajte</FadeSpan> <FadeSpan>platby cez</FadeSpan>
              <br />
              <FadeSpan className="text-stroke">QR Platby</FadeSpan>
            </h1>
            <p className="max-w-xl text-balance text-center text-base text-muted-foreground tracking-tight sm:text-xl md:text-left">
              <FadeSpan>Vytvorte QR kód za 10 sekúnd.</FadeSpan>{' '}
              <FadeSpan>Zákazníci platia jedným skenovaním</FadeSpan>{' '}
              <FadeSpan>– bez písania IBAN-u,</FadeSpan>{' '}
              <FadeSpan>bez chýb,</FadeSpan> <FadeSpan>bez čakania.</FadeSpan>
            </p>
          </div>
        </div>
        <FadeDiv className="md:pt-5">
          <QRCard />
        </FadeDiv>
      </FadeContainer>
    </section>
  );
}
