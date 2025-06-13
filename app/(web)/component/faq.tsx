'use client';

import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Ako funguje QR kód?",
      answer: "QR kód obsahuje všetky potrebné platobné informácie v BySquare štandarde - IBAN, sumu, variabilný symbol a popis platby. Zákazník jednoducho naskenuje kód svojou bankovou aplikáciou a všetky údaje sa automaticky vyplnia. Stačí už len potvrdiť platbu."
    },
    {
      question: "Je to bezpečné?",
      answer: "Áno, QR Payments SK je úplne bezpečné. QR kód obsahuje len verejné platobné informácie, ktoré by ste inak diktovali zákazníkovi. Neobsahuje žiadne citlivé údaje o vašom účte. Používame BySquare štandard, ktorý je oficiálne podporovaný všetkými slovenskými bankami."
    },
    {
      question: "Podporuje to moju banku?",
      answer: "QR Payments SK funguje so všetkými bankami na Slovensku, ktoré podporujú BySquare štandard - to sú všetky veľké banky ako Tatra banka, Slovenská sporiteľňa, VÚB, ČSOB, OTP Bank, mBank, Poštová banka a ďalšie. Zákazník si môže zvoliť svoju bankovú aplikáciu."
    },
    {
      question: "Koľko to stojí?",
      answer: "Máme tri plány: Free (zadarmo) s básičnými funkciami, Pro (5€/mesiac) s pokročilými štatistikami a neobmedzenými šablónami, a Business (15€/mesiac) s tímovým prístupom a API. Môžete začať zadarmo a upgradovať kedykoľvek."
    },
    {
      question: "Potrebujem špeciálne zariadenie?",
      answer: "Nie, nepotrebujete žiadne špeciálne zariadenie. Stačí vám mobil, tablet alebo počítač s internetovým pripojením. QR kódy si môžete vytlačiť alebo zobraziť na obrazovke. Vaši zákazníci potrebujú len smartfón s bankovou aplikáciou."
    },
    {
      question: "Ako rýchlo prídu peniaze na môj účet?",
      answer: "Rýchlosť platby závisí od banky vašeho zákazníka. Väčšinou sú platby spracované okamžite alebo do niekoľkých minút. QR Payments SK len uľahčuje zadávanie platobných údajov - samotná platba prebieha cez štandardný bankový systém."
    },
    {
      question: "Môžem používať vlastné IBAN čísla?",
      answer: "Samozrejme! QR Payments SK funguje s akýmkoľvek platným slovenským IBAN číslom. Môžete zadať účet svojej firmy, osobný účet alebo ktorýkoľvek iný účet, na ktorý chcete prijímať platby."
    },
    {
      question: "Čo ak zákazník nemá smartfón?",
      answer: "QR kódy sú len alternatívou k tradičným platbám. Ak zákazník nemá smartfón alebo nepoužíva internetbanking, môže platiť klasicky - hotovosťou, kartou alebo bankovým prevodom s manuálnym zadaním údajov."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      aria-label="Frequently Asked Questions"
      className="relative mx-auto max-w-4xl scroll-my-24 px-4 sm:px-6 lg:px-8"
      id="faq"
    >
      <div className="text-center mb-16">
        <h2 className="relative inline-block text-lg font-semibold tracking-tight text-orange-500">
          Často kladené otázky
          <div className="absolute top-1 -left-[8px] h-5 w-[3px] rounded-r-sm bg-orange-500" />
        </h2>
        <p className="mt-2 text-3xl font-semibold tracking-tighter text-balance text-gray-900 md:text-4xl">
          Všetko, čo potrebujete vedieť
        </p>
        <p className="mt-4 text-balance text-gray-700 max-w-2xl mx-auto">
          Máte otázku, ktorá tu nie je? Kontaktujte nás a radi vám pomôžeme.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="rounded-lg border border-gray-200 bg-white transition-all duration-200 hover:shadow-md"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-lg"
              aria-expanded={openIndex === index}
            >
              <span className="text-lg font-medium text-gray-900 pr-4">
                {faq.question}
              </span>
              {openIndex === index ? (
                <ChevronUpIcon className="h-5 w-5 text-orange-500 shrink-0" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-gray-400 shrink-0" />
              )}
            </button>
            
            {openIndex === index && (
              <div className="px-6 pb-4">
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <div className="rounded-2xl bg-orange-50 border border-orange-200 p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Nenapšli ste odpoveď na svoju otázku?
          </h3>
          <p className="text-gray-700 mb-6">
            Náš tím je tu pre vás. Kontaktujte nás a radi vám pomôžeme s čímkoľvek.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center justify-center gap-2 rounded-md border-b-[1.5px] border-orange-700 bg-linear-to-b from-orange-400 to-orange-500 px-6 py-3 font-medium text-white shadow-[0_0_0_2px_rgba(0,0,0,0.04),0_0_14px_0_rgba(255,255,255,0.19)] transition-all duration-200 ease-in-out hover:shadow-orange-300">
              Kontaktovať podporu
            </button>
            <button className="px-6 py-3 rounded-md border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors">
              Napísať email
            </button>
          </div>
        </div>
      </div>
    </section>
  );
} 