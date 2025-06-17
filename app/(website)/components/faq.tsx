import { FadeContainer, FadeDiv, FadeSpan } from '@/components/motion/fade';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

const faqs = [
  {
    question: 'Čo je BySquare QR platba?',
    answer:
      'BySquare je slovenský štandard pre QR platby, ktorý umožňuje zákazníkom zaplatiť jednoducho naskenovaním QR kódu v bankovej aplikácii. Všetky potrebné údaje sa automaticky vyplnia.',
  },
  {
    question: 'Koľko QR kódov môžem vytvoriť zadarmo?',
    answer:
      'Neregistrovaní používatelia môžu vytvoriť 10 QR kódov týždenne. Registrovaní používatelia majú k dispozícii 150 QR kódov mesačne zdarma.',
  },
  {
    question: 'Fungujú QR kódy vo všetkých slovenských bankách?',
    answer:
      'Áno, QR kódy vytvorené v našej platforme sú plně kompatibilné s BySquare štandardom a fungujú vo všetkých slovenských bankových aplikáciách vrátane VÚB, Slovenskej sporiteľne, Tatra banky a ďalších.',
  },
  {
    question: 'Môžem si uložiť šablóny pre opakované platby?',
    answer:
      'Áno, registrovaní používatelia môžu vytvárať a spravovať neobmedzené množstvo šablónů pre rýchle generovanie opakovaných platieb ako faktúry, členské poplatky či nájomné.',
  },
  {
    question: 'Je platforma bezpečná?',
    answer:
      'Absolútne. Všetky údaje sú šifrované, používame HTTPS protokol a nedochovávame žiadne citlivé bankové informácie. QR kódy obsahujú iba platobné údaje potrebné pre transakciu.',
  },
  {
    question: 'Ako fungovať API prístup?',
    answer:
      'API prístup je dostupný od Starter plánu. Môžete integrovať našu službu do vašej aplikácie alebo e-shopu. API umožňuje automatické generovanie QR kódov a tracking platieb.',
  },
  {
    question: 'Môžem zrušiť predplatné kedykoľvek?',
    answer:
      'Áno, predplatné môžete zrušiť kedykoľvek bez výpovednej lehoty. Služby vám zostanú aktívne do konca aktuálneho zúčtovacieho obdobia.',
  },
  //   {
  //     question: 'Dostávam faktúru na platby?',
  //     answer:
  //       'Áno, všetky platby sú automaticky faktúrované. Faktúry nájdete vo vašom účte a sú vystavené v súlade so slovenskou legislatívou pre účtovníctvo.',
  //   },
];

export function FAQ() {
  return (
    <section
      id="faq"
      aria-label="Často kladené otázky"
      className="w-full py-20 lg:py-40"
    >
      <FadeContainer className="mx-auto max-w-4xl px-4 md:px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <FadeDiv>
            <Badge variant="outline">FAQ</Badge>
          </FadeDiv>
          <div className="flex flex-col gap-2">
            <h2 className="font-medium text-3xl tracking-tighter lg:text-5xl">
              <FadeSpan>Často kladené otázky</FadeSpan>
            </h2>
            <p className="max-w-xl text-lg text-muted-foreground leading-relaxed tracking-tight">
              <FadeSpan>
                Máte otázky? Nájdite odpovede na najčastejšie kladené otázky o
                našej platforme.
              </FadeSpan>
            </p>
          </div>
        </div>

        <FadeDiv className="mt-12">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-lg border border-border/50 bg-background/50 px-6 backdrop-blur-sm transition-colors hover:bg-background/80"
              >
                <AccordionTrigger className="py-6 text-left font-medium text-base hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeDiv>
      </FadeContainer>
    </section>
  );
}
