import { CheckIcon, StarIcon } from "lucide-react";

export default function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "0",
      currency: "EUR",
      period: "navždy",
      description: "Ideálne pre začiatočníkov a malé podnikania",
      features: [
        "Generovanie QR kódov",
        "3 platobné šablóny",
        "Prehľad generovaných QR kódov za mesiac",
        "BySquare štandard",
        "Podpora všetkých slovenských bánk"
      ],
      buttonText: "Vybrať Free",
      buttonVariant: "outline",
      popular: false
    },
    {
      name: "Pro",
      price: "5",
      currency: "EUR",
      period: "mesiac",
      description: "Pre rastúce podnikania s potrebou lepšieho prehľadu",
      features: [
        "Všetko z Free plánu",
        "Neobmedzené šablóny",
        "Detailné štatistiky",
        "Export dát (CSV, Excel)",
        "Mesačné a ročné reporty",
        "Emailová podpora"
      ],
      buttonText: "Vybrať Pro", 
      buttonVariant: "primary",
      popular: true
    },
    {
      name: "Business",
      price: "15",
      currency: "EUR", 
      period: "mesiac",
      description: "Pre firmy s vysokým objemom transakcií",
      features: [
        "Všetko z Pro plánu",
        "Prístup pre tím (až 5 používateľov)",
        "API prístup",
        "Pokročilé analytické nástroje",
        "Vlastný branding",
        "Prioritná podpora"
      ],
      buttonText: "Vybrať Business",
      buttonVariant: "outline",
      popular: false
    }
  ];

  return (
    <section
      aria-label="QR Payments SK Pricing Plans"
      className="relative mx-auto max-w-6xl scroll-my-24 px-4 sm:px-6 lg:px-8"
      id="pricing"
    >
      <div className="text-center mb-16">
        <h2 className="relative inline-block text-lg font-semibold tracking-tight text-orange-500">
          Cenové plány
          <div className="absolute top-1 -left-[8px] h-5 w-[3px] rounded-r-sm bg-orange-500" />
        </h2>
        <p className="mt-2 text-3xl font-semibold tracking-tighter text-balance text-gray-900 md:text-4xl">
          Jednoduchý a transparentný pricing
        </p>
        <p className="mt-4 text-balance text-gray-700 max-w-2xl mx-auto">
          Vyberte si plán, ktorý najlepšie vyhovuje vášmu podnikaniu. Môžete kedykoľvek upgradovať alebo downgradovať.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative rounded-2xl border p-8 transition-all duration-300 hover:shadow-lg ${
              plan.popular 
                ? 'border-orange-200 bg-orange-50 shadow-lg scale-105' 
                : 'border-gray-200 bg-white hover:scale-[1.02]'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <div className="flex items-center gap-1 rounded-full bg-orange-500 px-3 py-1 text-sm font-medium text-white">
                  <StarIcon className="h-4 w-4" />
                  Najpopulárnejší
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-2 text-gray-700">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-700">{plan.currency}</span>
                <span className="text-gray-500">/ {plan.period}</span>
              </div>

              <ul className="space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                      <CheckIcon className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full rounded-md px-6 py-3 font-medium transition-all duration-200 ${
                  plan.buttonVariant === 'primary'
                    ? 'border-b-[1.5px] border-orange-700 bg-linear-to-b from-orange-400 to-orange-500 text-white shadow-[0_0_0_2px_rgba(0,0,0,0.04),0_0_14px_0_rgba(255,255,255,0.19)] hover:shadow-orange-300'
                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <div className="rounded-2xl bg-gray-50 border border-gray-200 p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Máte otázky k cenám?
          </h3>
          <p className="text-gray-700 mb-6">
            Kontaktujte nás a radi vám pomôžeme vybrať najlepší plán pre vaše potreby.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 rounded-md border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors">
              Kontaktovať podporu
            </button>
            <button className="px-6 py-3 rounded-md border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors">
              Pozrieť FAQ
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500">
          Všetky ceny sú uvedené vrátane DPH. Platby sa spracovávajú bezpečne a môžete kedykoľvek zrušiť.
        </p>
      </div>
    </section>
  );
} 