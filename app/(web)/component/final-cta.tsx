import { QrCodeIcon, ArrowRightIcon, CheckIcon } from "lucide-react";
import Image from "next/image";

export default function FinalCTA() {
  return (
    <section
      aria-label="Final Call to Action"
      className="relative mx-auto max-w-6xl scroll-my-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 p-12 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg className="h-full w-full" viewBox="0 0 100 100">
            <defs>
              <pattern
                id="final-cta-pattern"
                patternUnits="userSpaceOnUse"
                width="20"
                height="20"
              >
                <circle cx="10" cy="10" r="1" fill="currentColor" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#final-cta-pattern)" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  Prestaňte čakať a začnite prijímať platby jednoducho!
                </h2>
                <p className="mt-6 text-xl text-orange-100">
                  Pripojte sa k stovkám slovenských podnikateľov, ktorí už používajú 
                  QR Payments SK na modernizáciu svojich platieb.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                    <CheckIcon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-orange-100">Registrácia zadarmo za 2 minúty</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                    <CheckIcon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-orange-100">Okamžite začnite generovať QR kódy</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                    <CheckIcon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-orange-100">Bez poplatkov, bez skrytých nákladov</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-4 text-lg font-semibold text-orange-600 transition-all duration-200 hover:bg-gray-50 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-500">
                  <QrCodeIcon className="h-6 w-6" />
                  Zaregistrovať sa teraz
                  <ArrowRightIcon className="h-5 w-5" />
                </button>
                <button className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white/30 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20">
                  Pozrieť demo
                </button>
              </div>

              <div className="text-sm text-orange-200">
                ✨ Žiadna kreditná karta nie je potrebná
              </div>
            </div>

            {/* Right Content - Visual */}
            <div className="relative lg:pl-12">
              <div className="relative mx-auto w-full max-w-md">
                {/* Phone mockup */}
                <div className="relative">
                  <div className="aspect-[9/19] rounded-[3rem] bg-gray-900 p-2 shadow-2xl">
                    <div className="h-full w-full rounded-[2.5rem] bg-white overflow-hidden">
                      <div className="relative h-full">
                        {/* Phone status bar */}
                        <div className="absolute top-0 left-0 right-0 h-8 bg-gray-900 rounded-t-[2.5rem] flex items-center justify-center">
                          <div className="h-4 w-16 rounded-full bg-gray-800"></div>
                        </div>
                        
                        {/* Phone content */}
                        <div className="pt-12 px-6 h-full flex flex-col items-center justify-center space-y-6">
                          <div className="text-center">
                            <div className="text-lg font-semibold text-gray-900">
                              QR Payments SK
                            </div>
                            <div className="text-sm text-gray-600">
                              Generovať platbu
                            </div>
                          </div>

                          {/* QR Code simulation */}
                          <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-orange-200">
                            <div className="grid grid-cols-8 gap-1">
                              {Array.from({ length: 64 }, (_, i) => (
                                <div
                                  key={i}
                                  className={`w-2 h-2 ${
                                    Math.random() > 0.5 ? 'bg-gray-900' : 'bg-transparent'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>

                          <div className="text-center space-y-1">
                            <div className="text-2xl font-bold text-gray-900">
                              25.00 EUR
                            </div>
                            <div className="text-sm text-gray-600">
                              Strih vlasov
                            </div>
                            <div className="text-xs text-gray-500">
                              SK89 1100 0000 0026 2600 0007
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating elements */}
                  <div className="absolute -top-4 -right-4 rounded-full bg-white/20 backdrop-blur-sm p-3">
                    <QrCodeIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 rounded-full bg-white/20 backdrop-blur-sm p-3">
                    <CheckIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom stats */}
      <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">500+</div>
          <div className="text-gray-600">Spokojných podnikateľov</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">10,000+</div>
          <div className="text-gray-600">Vygenerovaných QR kódov</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">99.9%</div>
          <div className="text-gray-600">Spoľahlivosť služby</div>
        </div>
      </div>
    </section>
  );
} 