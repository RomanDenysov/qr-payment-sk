import { QrCodeIcon, SaveIcon, SmartphoneIcon, BarChart3Icon } from "lucide-react";

export default function Features() {
    return (
       <section
      aria-label="QR Payments SK Key Features"
      id="features"
      className="relative mx-auto max-w-6xl scroll-my-24 px-4 sm:px-6 lg:px-8"
    >
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="relative inline-block text-lg font-semibold tracking-tight text-orange-500">
          Ako to funguje
          <div className="absolute top-1 -left-[8px] h-5 w-[3px] rounded-r-sm bg-orange-500" />
        </h2>
        <p className="mt-2 text-3xl font-semibold tracking-tighter text-balance text-gray-900 md:text-4xl">
          Štyri jednoduché kroky k moderným platbám
        </p>
        <p className="mt-4 text-balance text-gray-700 max-w-2xl mx-auto">
          Vytvorte si QR kód za pár sekúnd a transformujte spôsob, akým prijímate platby.
        </p>
      </div>

      {/* Vertical Lines */}
      <div className="pointer-events-none inset-0 select-none">
        {/* Left */}
        <div
          className="absolute inset-y-0 my-[-5rem] w-px"
          style={{
            maskImage:
              "linear-gradient(transparent, white 5rem, white calc(100% - 5rem), transparent)",
          }}
        >
          <svg className="h-full w-full" preserveAspectRatio="none">
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="100%"
              className="stroke-gray-300"
              strokeWidth="2"
              strokeDasharray="3 3"
            />
          </svg>
        </div>

        {/* Right */}
        <div
          className="absolute inset-y-0 right-0 my-[-5rem] w-px"
          style={{
            maskImage:
              "linear-gradient(transparent, white 5rem, white calc(100% - 5rem), transparent)",
          }}
        >
          <svg className="h-full w-full" preserveAspectRatio="none">
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="100%"
              className="stroke-gray-300"
              strokeWidth="2"
              strokeDasharray="3 3"
            />
          </svg>
        </div>
        {/* Middle */}
        <div
          className="absolute inset-y-0 left-1/2 -z-10 my-[-5rem] w-px"
          style={{
            maskImage:
              "linear-gradient(transparent, white 5rem, white calc(100% - 5rem), transparent)",
          }}
        >
          <svg className="h-full w-full" preserveAspectRatio="none">
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="100%"
              className="stroke-gray-300"
              strokeWidth="2"
              strokeDasharray="3 3"
            />
          </svg>
        </div>
        {/* 25% */}
        <div
          className="absolute inset-y-0 left-1/4 -z-10 my-[-5rem] hidden w-px sm:block"
          style={{
            maskImage:
              "linear-gradient(transparent, white 5rem, white calc(100% - 5rem), transparent)",
          }}
        >
          <svg className="h-full w-full" preserveAspectRatio="none">
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="100%"
              className="stroke-gray-300"
              strokeWidth="2"
              strokeDasharray="3 3"
            />
          </svg>
        </div>
        {/* 75% */}
        <div
          className="absolute inset-y-0 left-3/4 -z-10 my-[-5rem] hidden w-px sm:block"
          style={{
            maskImage:
              "linear-gradient(transparent, white 5rem, white calc(100% - 5rem), transparent)",
          }}
        >
          <svg className="h-full w-full" preserveAspectRatio="none">
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="100%"
              className="stroke-gray-300"
              strokeWidth="2"
              strokeDasharray="3 3"
            />
          </svg>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-0">
        {/* Step 1: Create QR Code */}
        <div className="col-span-2 my-auto px-2">
          <h2 className="relative text-lg font-semibold tracking-tight text-orange-500">
            1. Vytvorte QR kód
            <div className="absolute top-1 -left-[8px] h-5 w-[3px] rounded-r-sm bg-orange-500" />
          </h2>
          <p className="mt-2 text-3xl font-semibold tracking-tighter text-balance text-gray-900 md:text-4xl">
            Zadajte IBAN, sumu a popis platby
          </p>
          <p className="mt-4 text-balance text-gray-700">
            Náš generátor okamžite vytvorí platobný QR kód v štandarde BySquare, 
            kompatibilný so všetkými bankami na Slovensku.
          </p>
        </div>
        <div className="relative col-span-2 flex items-center justify-center overflow-hidden">
          <svg
            className="absolute size-full [mask-image:linear-gradient(transparent,white_10rem)]"
          >
            <defs>
              <pattern
                id="diagonal-pattern-1"
                patternUnits="userSpaceOnUse"
                width="64"
                height="64"
              >
                {Array.from({ length: 17 }, (_, i) => {
                  const offset = i * 8
                  return (
                    <path
                      key={i}
                      d={`M${-106 + offset} 110L${22 + offset} -18`}
                      className="stroke-gray-200/70"
                      strokeWidth="1"
                    />
                  )
                })}
              </pattern>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="url(#diagonal-pattern-1)"
            />
          </svg>
          <div className="pointer-events-none h-[26rem] p-10 select-none">
            <div className="relative flex flex-col items-center justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-orange-100 border-4 border-orange-200">
                <QrCodeIcon className="h-12 w-12 text-orange-600" />
              </div>
              <div className="mt-6 text-center">
                <div className="rounded-lg bg-white p-4 shadow-lg border">
                  <div className="text-sm text-gray-600">IBAN: SK89 1100 0000 0026 2600 0007</div>
                  <div className="text-sm text-gray-600">Suma: 25.00 EUR</div>
                  <div className="text-sm text-gray-600">Popis: Strih vlasov</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Save Templates */}
        <div className="col-span-2 my-auto px-2">
          <h2 className="relative text-lg font-semibold tracking-tight text-orange-500">
            2. Uložte si šablóny
            <div className="absolute top-1 -left-[8px] h-5 w-[3px] rounded-r-sm bg-orange-500" />
          </h2>
          <p className="mt-2 text-3xl font-semibold tracking-tighter text-balance text-gray-900 md:text-4xl">
            Pre opakované platby jednoducho a rýchlo
          </p>
          <p className="mt-4 text-balance text-gray-700">
            Pre opakované platby si uložte šablóny (napr. 'Strih vlasov 25€') 
            a generujte QR kódy ešte rýchlejšie jedným klikom.
          </p>
        </div>
        <div className="relative col-span-2 flex items-center justify-center overflow-hidden">
          <svg className="absolute size-full">
            <defs>
              <pattern
                id="diagonal-pattern-2"
                patternUnits="userSpaceOnUse"
                width="64"
                height="64"
              >
                {Array.from({ length: 17 }, (_, i) => {
                  const offset = i * 8
                  return (
                    <path
                      key={i}
                      d={`M${-106 + offset} 110L${22 + offset} -18`}
                      className="stroke-gray-200/70"
                      strokeWidth="1"
                    />
                  )
                })}
              </pattern>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="url(#diagonal-pattern-2)"
            />
          </svg>
          <div className="pointer-events-none h-[26rem] p-10 select-none">
            <div className="relative flex flex-col items-center justify-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-orange-100 border-2 border-orange-200">
                <SaveIcon className="h-8 w-8 text-orange-600" />
              </div>
              
              <div className="space-y-2">
                <div className="rounded-lg bg-white px-4 py-2 shadow-md border border-gray-200">
                  <span className="text-sm font-medium text-gray-900">Strih vlasov - 25€</span>
                </div>
                <div className="rounded-lg bg-white px-4 py-2 shadow-md border border-gray-200">
                  <span className="text-sm font-medium text-gray-900">Manikúra - 20€</span>
                </div>
                <div className="rounded-lg bg-white px-4 py-2 shadow-md border border-gray-200">
                  <span className="text-sm font-medium text-gray-900">Masáž - 40€</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Accept Payments */}
        <div className="col-span-2 my-auto px-2">
          <h2 className="relative text-lg font-semibold tracking-tight text-orange-500">
            3. Prijímajte platby
            <div className="absolute top-1 -left-[8px] h-5 w-[3px] rounded-r-sm bg-orange-500" />
          </h2>
          <p className="mt-2 text-3xl font-semibold tracking-tighter text-balance text-gray-900 md:text-4xl">
            Zákazník naskenuje a platba je na ceste
          </p>
          <p className="mt-4 text-balance text-gray-700">
            Váš zákazník jednoducho naskenuje QR kód svojou bankovou aplikáciou 
            a platba je okamžite odoslaná na váš účet.
          </p>
        </div>
        <div className="relative col-span-2 flex items-center justify-center overflow-hidden">
          <svg
            className="absolute size-full [mask-image:linear-gradient(white_10rem,transparent)]"
          >
            <defs>
              <pattern
                id="diagonal-pattern-3"
                patternUnits="userSpaceOnUse"
                width="64"
                height="64"
              >
                {Array.from({ length: 17 }, (_, i) => {
                  const offset = i * 8
                  return (
                    <path
                      key={i}
                      d={`M${-106 + offset} 110L${22 + offset} -18`}
                      className="stroke-gray-200/70"
                      strokeWidth="1"
                    />
                  )
                })}
              </pattern>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="url(#diagonal-pattern-3)"
            />
          </svg>
          
          <div className="pointer-events-none h-[26rem] p-10 select-none">
            <div className="relative flex flex-col items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 border-4 border-green-200">
                <SmartphoneIcon className="h-10 w-10 text-green-600" />
              </div>
              <div className="mt-6 text-center space-y-2">
                <div className="text-lg font-semibold text-green-600">Platba úspešná!</div>
                <div className="rounded-lg bg-white p-4 shadow-lg border max-w-xs">
                  <div className="text-sm text-gray-600">25.00 EUR</div>
                  <div className="text-xs text-gray-500">odoslané na SK89 1100...</div>
                  <div className="text-xs text-gray-500">Strih vlasov</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 4: Track Statistics */}
        <div className="col-span-2 my-auto px-2">
          <h2 className="relative text-lg font-semibold tracking-tight text-orange-500">
            4. Sledujte štatistiky
            <div className="absolute top-1 -left-[8px] h-5 w-[3px] rounded-r-sm bg-orange-500" />
          </h2>
          <p className="mt-2 text-3xl font-semibold tracking-tighter text-balance text-gray-900 md:text-4xl">
            Získajte prehľad o svojich platbách
          </p>
          <p className="mt-4 text-balance text-gray-700">
            Sledujte všetky svoje platby priamo v dashboarde. Pre Pro plány sú 
            k dispozícii detailné štatistiky a exporty dát.
          </p>
        </div>
        <div className="relative col-span-2 flex items-center justify-center overflow-hidden">
          <svg
            className="absolute size-full [mask-image:linear-gradient(transparent,white_10rem)]"
          >
            <defs>
              <pattern
                id="diagonal-pattern-4"
                patternUnits="userSpaceOnUse"
                width="64"
                height="64"
              >
                {Array.from({ length: 17 }, (_, i) => {
                  const offset = i * 8
                  return (
                    <path
                      key={i}
                      d={`M${-106 + offset} 110L${22 + offset} -18`}
                      className="stroke-gray-200/70"
                      strokeWidth="1"
                    />
                  )
                })}
              </pattern>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="url(#diagonal-pattern-4)"
            />
          </svg>
          
          <div className="pointer-events-none h-[26rem] p-10 select-none">
            <div className="relative flex flex-col items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-blue-100 border-2 border-blue-200">
                <BarChart3Icon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-6 rounded-lg bg-white p-6 shadow-lg border max-w-sm">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Dnes</span>
                    <span className="text-sm font-semibold">3 platby</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tento týždeň</span>
                    <span className="text-sm font-semibold">18 platieb</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Celkom</span>
                    <span className="text-sm font-semibold text-orange-600">1,240.00 EUR</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    )
}