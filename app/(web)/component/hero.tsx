import { ArrowUpRightFromSquareIcon, QrCodeIcon } from 'lucide-react';
import Link from 'next/link';
import { FadeContainer, FadeDiv, FadeSpan } from '~/components/motion/fade';
import GameOfLife from '~/components/motion/hero-background';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';

export default function Hero() {
  return (
    <section aria-label="hero" className="relative py-20 md:py-32">
      <FadeContainer className="flex flex-col items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
        <FadeDiv className="mx-auto">
          <Link
            aria-label="View latest news about QR Platby"
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto w-full"
          >
            <Badge className="inline-flex max-w-full items-center gap-3 rounded-full bg-white/5 px-2.5 py-0.5 pr-3 pl-0.5 font-medium text-gray-900 shadow-lg shadow-orange-400/20 ring-1 ring-black/10 filter backdrop-blur-[1px] transition-colors hover:bg-orange-500/[2.5%] focus:outline-hidden sm:text-sm">
              <span className="shrink-0 truncate rounded-full border bg-gray-50 px-2.5 py-1 text-gray-600 text-sm sm:text-xs">
                ✨ Novinka
              </span>
              <span className="flex items-center gap-1 truncate">
                <span className="w-full truncate">
                  Nová generácia platieb na Slovensku
                </span>
                <ArrowUpRightFromSquareIcon className="size-4 shrink-0 text-gray-700" />
              </span>
            </Badge>
          </Link>
        </FadeDiv>
        <h1 className="mt-8 text-center font-semibold text-5xl text-gray-900 tracking-tighter sm:text-7xl sm:leading-[4.5rem]">
          {/* <FadeSpan>QR</FadeSpan> <FadeSpan>Platby</FadeSpan> */}
          <br />
          <FadeSpan>Prijímajte</FadeSpan> <FadeSpan>platby cez</FadeSpan>
          <br />
          <FadeSpan className="text-orange-500">QR Platby</FadeSpan>
        </h1>
        <p className="mt-5 max-w-2xl text-balance text-center text-base text-gray-700 sm:mt-8 sm:text-xl">
          <FadeSpan>Vytvorte QR kód za 10 sekúnd.</FadeSpan>{' '}
          <FadeSpan>Zákazníci platia jedným skenovaním</FadeSpan>{' '}
          <FadeSpan>– bez písania IBAN-u,</FadeSpan>{' '}
          <FadeSpan>bez chýb,</FadeSpan> <FadeSpan>bez čakania.</FadeSpan>
        </p>
        <FadeDiv className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="inline-flex cursor-pointer flex-row items-center justify-center gap-2 whitespace-nowrap rounded-md border-orange-700 border-b-[1.5px] bg-linear-to-b from-orange-400 to-orange-500 px-8 py-4 font-medium text-white leading-4 tracking-wide shadow-[0_0_0_2px_rgba(0,0,0,0.04),0_0_14px_0_rgba(255,255,255,0.19)] transition-all duration-200 ease-in-out hover:shadow-orange-300"
          >
            <QrCodeIcon className="size-5" />
            Generovať QR kód
          </Button>
        </FadeDiv>
        <div className="-z-20 absolute inset-0 flex items-center justify-center">
          <GameOfLife />
        </div>
        {/* <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-10">
          <Image
            src="/images/qr-code-photo.jpg"
            alt="QR Code Payment"
            width={800}
            height={600}
            className="object-cover rounded-lg"
          />
        </div> */}
      </FadeContainer>
    </section>
  );
}
