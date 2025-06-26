import { FadeContainer, FadeDiv, FadeSpan } from '@/components/motion/fade';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

export function CTA() {
  return (
    <section
      id="cta"
      aria-label="Začnite dnes"
      className="group w-full py-20 lg:py-40"
    >
      <CTADecorator>
        <FadeContainer className="mx-auto max-w-4xl px-4">
          <FadeDiv className="group">
            <div className="flex flex-col items-center gap-8 p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <Badge variant="outline" className="bg-background/80">
                  <Sparkles className="mr-2 h-3 w-3" />
                  Začnite za pár minút
                </Badge>

                <div className="flex flex-col gap-4">
                  <h2 className="font-medium text-3xl tracking-tighter lg:text-5xl">
                    <FadeSpan>Pripravení začať prijímať</FadeSpan>
                    <br />
                    <FadeSpan className="text-primary">QR platby?</FadeSpan>
                  </h2>
                  <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed tracking-tight">
                    <FadeSpan>
                      Zaregistrujte sa zdarma a začnite generovať QR kódy pre
                      vaše platby už dnes. Žiadne poplatky, žiadne záväzky - iba
                      jednoduché a rýchle platby.
                    </FadeSpan>
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="group/btn w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
                >
                  <Link href="/autorizacia" className="flex items-center gap-2">
                    Registrovať sa zdarma
                    <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <Link href="#pricing">Pozrieť cenník</Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-8 border-border/50 border-t pt-8 sm:grid-cols-3">
                <div className="flex flex-col items-center gap-2">
                  <div className="font-bold text-2xl text-primary">150+</div>
                  <div className="text-muted-foreground text-sm">
                    QR kódov zdarma
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="font-bold text-2xl text-primary">10s</div>
                  <div className="text-muted-foreground text-sm">
                    Rýchlosť generovania
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="font-bold text-2xl text-primary">100%</div>
                  <div className="text-muted-foreground text-sm">
                    BySquare kompatibilita
                  </div>
                </div>
              </div>
            </div>
          </FadeDiv>
        </FadeContainer>
      </CTADecorator>
    </section>
  );
}

const CTADecorator = ({ children }: { children: ReactNode }) => (
  <div className="relative mx-auto h-auto w-full max-w-7xl duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)8%,transparent)] group-hover:bg-white/5 dark:group-hover:bg-white/5 group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)15%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)12%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)18%,transparent)]">
    {/* Grid pattern background */}
    <div
      aria-hidden
      className="absolute inset-0 rounded-xl bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:32px_32px]"
    />
    {/* Radial gradient overlay to fade edges */}
    <div
      aria-hidden
      className="absolute inset-0 rounded-xl bg-radial from-transparent via-transparent to-75% to-background"
    />
    {/* Subtle highlight in center */}
    <div
      aria-hidden
      className="absolute inset-0 rounded-xl bg-radial from-white/5 via-transparent to-40% to-transparent dark:from-white/3"
    />
    {/* Content container */}
    <div className="relative select-none rounded-xl">{children}</div>
  </div>
);
