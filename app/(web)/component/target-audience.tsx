import { ScissorsIcon, CoffeeIcon, UserIcon } from "lucide-react";
import Image from "next/image";

export default function TargetAudience() {
  const audiences = [
    {
      icon: ScissorsIcon,
      title: "Pre kaderníčky a kozmetičky",
      description: "Pôsobte profesionálnejšie a zrýchlite platby. Už žiadne hľadanie ceruzky a papiera!",
      benefits: [
        "Moderný a profesionálny dojem",
        "Rýchle platby bez čakania",
        "Presné sumy bez chýb",
        "Ušetrený čas na každom klientovi"
      ],
      image: "/images/qr-photo-1.jpg",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
      iconColor: "text-pink-600"
    },
    {
      icon: CoffeeIcon,
      title: "Pre malé kaviarne a reštaurácie",
      description: "Ušetrite na drahých POS termináloch. Ponúknite zákazníkom modernú a bezkontaktnú možnosť platby.",
      benefits: [
        "Žiadne mesačné poplatky za terminály",
        "Bezkontaktné platby",
        "Rýchle spracovanie objednávok",
        "Lepší cash flow"
      ],
      image: "/images/qr-photo-2.jpg",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      iconColor: "text-amber-600"
    },
    {
      icon: UserIcon,
      title: "Pre živnostníkov a freelancerov",
      description: "Ideálne pre platby na mieste. Mobilné, flexibilné a okamžité pre masáže, lekcie, opravy a konzultácie.",
      benefits: [
        "Platby kdekoľvek, kedykoľvek",
        "Ideálne pre mobilné služby",
        "Žiadne dodatočné zariadenia",
        "Kompletný prehľad príjmov"
      ],
      image: "/images/qr-photo-hamidoff-studio.jpg",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200", 
      iconColor: "text-blue-600"
    }
  ];

  return (
    <section
      aria-label="Target Audience Benefits"
      className="relative mx-auto max-w-6xl scroll-my-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="text-center mb-16">
        <h2 className="relative inline-block text-lg font-semibold tracking-tight text-orange-500">
          Pre každé podnikanie
          <div className="absolute top-1 -left-[8px] h-5 w-[3px] rounded-r-sm bg-orange-500" />
        </h2>
        <p className="mt-2 text-3xl font-semibold tracking-tighter text-balance text-gray-900 md:text-4xl">
          QR Payments SK pre váš typ podnikania
        </p>
        <p className="mt-4 text-balance text-gray-700 max-w-2xl mx-auto">
          Bez ohľadu na to, aké služby poskytujete, QR Payments SK vám pomôže prijímať platby moderne a efektívne.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {audiences.map((audience, index) => (
          <div
            key={index}
            className={`rounded-2xl ${audience.bgColor} ${audience.borderColor} border p-8 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]`}
          >
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white border-2 ${audience.borderColor}`}>
                  <audience.icon className={`h-6 w-6 ${audience.iconColor}`} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {audience.title}
                  </h3>
                </div>
              </div>

              <p className="text-gray-700">
                {audience.description}
              </p>

              <div className="space-y-3">
                {audience.benefits.map((benefit, benefitIndex) => (
                  <div key={benefitIndex} className="flex items-start gap-3">
                    <div className={`mt-0.5 h-2 w-2 rounded-full ${audience.iconColor.replace('text-', 'bg-')}`} />
                    <span className="text-sm text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="relative">
                <Image
                  src={audience.image}
                  alt={audience.title}
                  width={300}
                  height={200}
                  className="rounded-lg object-cover w-full h-48"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <div className="rounded-2xl bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Pripravení transformovať svoje podnikanie?
          </h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Pridajte sa k stovkám slovenských podnikateľov, ktorí už používają QR Payments SK 
            na jednoduchšie a efektívnejšie prijímanie platieb.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center justify-center gap-2 rounded-md border-b-[1.5px] border-orange-700 bg-linear-to-b from-orange-400 to-orange-500 px-6 py-3 font-medium text-white shadow-[0_0_0_2px_rgba(0,0,0,0.04),0_0_14px_0_rgba(255,255,255,0.19)] transition-all duration-200 ease-in-out hover:shadow-orange-300">
              Začať zadarmo
            </button>
            <button className="px-6 py-3 rounded-md border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors">
              Pozrieť ukážku
            </button>
          </div>
        </div>
      </div>
    </section>
  );
} 