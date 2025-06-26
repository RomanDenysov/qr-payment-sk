import { FadeContainer, FadeDiv, FadeSpan } from '@/components/motion/fade';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: '0',
    period: 'navždy',
    description: 'Pre začiatočníkov a malé firmy',
    features: [
      '150 QR kódov/mesiac',
      'Všetky platobné polia',
      'Šablóny pre opakované platby',
      'História generovaní',
      'Základná podpora',
    ],
    notIncluded: [
      'API prístup',
      'Webhooks',
      'Prioritná podpora',
      'White-label riešenie',
    ],
    popular: false,
    cta: 'Začať zdarma',
    href: '/autorizacia',
  },
  {
    name: 'Starter',
    price: '3.99',
    period: 'mesačne',
    description: 'Pre rastúce firmy s vyššími potrebami',
    features: [
      '500 QR kódov/mesiac',
      'Všetko z Free plánu',
      'API prístup (250 volaní/mesiac)',
      'E-mailová podpora',
      'Analytika a štatistiky',
      'Export do CSV',
    ],
    notIncluded: ['Webhooks', 'Prioritná podpora', 'White-label riešenie'],
    popular: true,
    cta: 'Vybrať Starter',
    href: '/autorizacia?plan=starter',
  },
  {
    name: 'Professional',
    price: '14.99',
    period: 'mesačne',
    description: 'Pre veľké firmy a integrácie',
    features: [
      'Neobmedzené QR kódy',
      'Všetko zo Starter plánu',
      'Neobmedzený API prístup',
      'Webhooks pre platby',
      'Prioritná podpora',
      'White-label riešenie',
      'Prispôsobenie QR dizajnu',
      // 'Dedikovaný účet manažér',
    ],
    notIncluded: [],
    popular: false,
    cta: 'Vybrať Professional',
    href: '/autorizacia?plan=professional',
  },
];

export function Pricing() {
  return (
    <section
      id="pricing"
      aria-label="Cenové plány"
      className="w-full py-20 lg:py-40"
    >
      <FadeContainer className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <FadeDiv>
            <Badge variant="outline">Cenník</Badge>
          </FadeDiv>
          <div className="flex flex-col gap-2">
            <h2 className="font-medium text-3xl tracking-tighter lg:text-5xl">
              <FadeSpan>Vyberte si plán</FadeSpan>
            </h2>
            <p className="max-w-xl text-lg text-muted-foreground leading-relaxed tracking-tight">
              <FadeSpan>
                Začnite zdarma a rozširujte podľa rastúcich potrieb vašej firmy.
              </FadeSpan>
            </p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <FadeDiv key={plan.name}>
              <Card
                className={`relative h-full ${plan.popular ? 'scale-105 border-primary shadow-lg' : 'border-border/50'} bg-background/50 backdrop-blur-sm transition-all duration-200 hover:bg-background/80`}
              >
                {plan.popular && (
                  <div className="-top-3 -translate-x-1/2 absolute left-1/2 transform">
                    <Badge className="bg-primary text-primary-foreground">
                      Najpopulárnejší
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-8 text-center">
                  <CardTitle className="font-bold text-2xl">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {plan.description}
                  </CardDescription>
                  <div className="flex items-baseline justify-center gap-1 pt-4">
                    <span className="font-bold text-4xl">€{plan.price}</span>
                    <span className="text-muted-foreground">
                      /{plan.period}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-3">
                        <Check className="h-5 w-5 flex-shrink-0 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                    {plan.notIncluded.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-3 opacity-60"
                      >
                        <X className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                        <span className="text-muted-foreground text-sm">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="pt-8">
                  <Button
                    asChild
                    className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    <Link href={plan.href}>{plan.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            </FadeDiv>
          ))}
        </div>

        <FadeDiv className="mt-12 text-center">
          <p className="text-muted-foreground text-sm">
            Všetky plány zahŕňajú 14-dňovú bezplatnú skúšobnú dobu. Zrušte
            kedykoľvek.
          </p>
        </FadeDiv>
      </FadeContainer>
    </section>
  );
}
