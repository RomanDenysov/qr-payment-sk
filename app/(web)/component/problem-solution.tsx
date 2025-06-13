import { XIcon, CheckIcon, CreditCardIcon, SmartphoneIcon } from "lucide-react";
import Image from "next/image";

export default function ProblemSolution() {
  return (
    <section
      aria-label="Problem Solution for QR Payments"
      className="relative mx-auto max-w-6xl scroll-my-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
        {/* Problem Side */}
        <div className="space-y-8">
          <div>
            <h2 className="relative text-lg font-semibold tracking-tight text-red-500">
              Problémy tradičných platieb
              <div className="absolute top-1 -left-[8px] h-5 w-[3px] rounded-r-sm bg-red-500" />
            </h2>
            <p className="mt-2 text-3xl font-semibold tracking-tighter text-balance text-gray-900 md:text-4xl">
              Už žiadne diktovanie IBANov, drahé terminály ani chybné platby
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                <XIcon className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Drahé POS terminály</h3>
                <p className="text-gray-600">Mesačné poplatky 20-50€ plus náklady na zariadenie</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                <XIcon className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Chyby pri zadávaní IBAN</h3>
                <p className="text-gray-600">Zdĺhavé diktovanie čísel a časté preklepy</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                <XIcon className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Neprofesionálny dojem</h3>
                <p className="text-gray-600">Hľadanie papiera a ceruzky pôsobí zastaralo</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                <XIcon className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Žiadny prehľad</h3>
                <p className="text-gray-600">Ťažko sledovať a organizovať platby</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <Image
              src="/images/qr-photo-tim-douglas.jpg"
              alt="Traditional payment problems"
              width={500}
              height={300}
              className="rounded-lg object-cover opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 to-transparent rounded-lg" />
          </div>
        </div>

        {/* Solution Side */}
        <div className="space-y-8">
          <div>
            <h2 className="relative text-lg font-semibold tracking-tight text-green-500">
              QR Payments SK riešenie
              <div className="absolute top-1 -left-[8px] h-5 w-[3px] rounded-r-sm bg-green-500" />
            </h2>
            <p className="mt-2 text-3xl font-semibold tracking-tighter text-balance text-gray-900 md:text-4xl">
              Transformujeme spôsob, akým prijímate platby
            </p>
            <p className="mt-4 text-balance text-gray-700">
              Vytvorte si QR kód pre akúkoľvek platbu za pár sekúnd. Jednoducho, rýchlo a profesionálne.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                <CheckIcon className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Bez dodatočných nákladov</h3>
                <p className="text-gray-600">Free plán zadarmo, Pro od 5€/mesiac</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                <CheckIcon className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Nulové chyby</h3>
                <p className="text-gray-600">QR kód obsahuje všetky údaje presne</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                <CheckIcon className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Moderný a profesionálny</h3>
                <p className="text-gray-600">Impresívny dojem na zákazníkov</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                <CheckIcon className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Kompletná štatistika</h3>
                <p className="text-gray-600">Prehľad všetkých transakcií a trendov</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <Image
              src="/images/qr-pay-photo.jpg"
              alt="QR Payment solution"
              width={500}
              height={300}
              className="rounded-lg object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-green-900/10 to-transparent rounded-lg" />
            <div className="absolute top-4 right-4">
              <div className="flex items-center gap-2 rounded-full bg-white/90 px-3 py-1">
                <SmartphoneIcon className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-gray-900">BySquare štandard</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 