import { FadeContainer, FadeDiv } from '@/components/motion/fade';
import { Logo } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  type LucideIcon,
  TwitterIcon,
} from 'lucide-react';
import Link from 'next/link';

const footerSections: {
  title: string;
  links: { label: string; href: string }[];
}[] = [
  {
    title: 'Produkt',
    links: [
      { label: 'Ako to funguje', href: '#features' },
      { label: 'Cenník', href: '#pricing' },
      { label: 'FAQ', href: '#faq' },
    ],
  },
  {
    title: 'Právne',
    links: [
      { label: 'Obchodné podmienky', href: '/pravne/obchodne-podmienky' },
      { label: 'Ochrana súkromia', href: '/pravne/ochrana-sukromia' },
      { label: 'Zásady cookies', href: '/pravne/zasady-cookies' },
    ],
  },
];

const socialLinks: {
  name: string;
  href: string;
  icon: LucideIcon;
}[] = [
  {
    name: 'Facebook',
    href: 'https://facebook.com/qrplatby',
    icon: FacebookIcon,
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/qrplatby',
    icon: TwitterIcon,
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/company/qrplatby',
    icon: LinkedinIcon,
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/qrplatby',
    icon: InstagramIcon,
  },
];

const contactInfo: {
  icon: LucideIcon;
  label: string;
  href: string;
}[] = [
  // {
  //   icon: MailIcon,
  //   label: 'podpora@qrplatby.sk',
  //   href: 'mailto:podpora@qrplatby.sk',
  // },
  // {
  //   icon: PhoneIcon,
  //   label: '+421 123 456 789',
  //   href: 'tel:+421123456789',
  // },
  // {
  //   icon: MapPinIcon,
  //   label: 'Bratislava, Slovensko',
  //   href: 'https://maps.google.com',
  // },
];

export function Footer() {
  return (
    <footer className="relative w-full border-border border-t bg-muted/30">
      <div className="absolute inset-0 bg-[size:20px_20px] bg-grid-white/10 [mask-image:radial-gradient(white,transparent_85%)]" />

      <FadeContainer className="relative">
        <div className="container mx-auto max-w-7xl px-4 pt-16 pb-8 md:px-6 lg:pt-20">
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Company Info */}
            <FadeDiv className="lg:col-span-2">
              <div className="space-y-6">
                <div>
                  <Logo />
                  <p className="mt-4 max-w-md text-muted-foreground">
                    Moderný nástroj na generovanie BySquare QR kódov pre
                    jednoduché a bezpečné prijímanie platieb na Slovensku.
                  </p>
                </div>

                {contactInfo && contactInfo.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold">Kontakt</h3>
                    <div className="space-y-2">
                      {contactInfo.map((contact) => (
                        <Link
                          key={contact.label}
                          href={contact.href}
                          className="flex items-center gap-3 text-muted-foreground text-sm transition-colors hover:text-foreground"
                        >
                          <contact.icon className="size-4" />
                          {contact.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <h3 className="font-semibold">Sledujte nás</h3>
                  <div className="flex gap-2">
                    {socialLinks.map((social) => (
                      <Button
                        key={social.name}
                        variant="outline"
                        size="sm"
                        className="size-10 p-0"
                        asChild
                      >
                        <Link
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={social.name}
                        >
                          <social.icon className="size-4" />
                        </Link>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </FadeDiv>

            {/* Footer Links */}
            <div className="flex items-start justify-center lg:col-span-3">
              <div className="grid items-center gap-8 sm:grid-cols-2">
                {footerSections.map((section) => (
                  <FadeDiv key={section.title}>
                    <div className="space-y-4">
                      <h3 className="font-semibold">{section.title}</h3>
                      <ul className="space-y-2">
                        {section.links.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              className="text-muted-foreground text-sm transition-colors hover:text-foreground hover:underline"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </FadeDiv>
                ))}
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          <FadeDiv>
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="flex flex-col items-center gap-2 text-muted-foreground text-sm md:flex-row md:gap-4">
                <p>
                  &copy; {new Date().getFullYear()} QR Platby. Všetky práva
                  vyhradené.
                </p>
                <div className="hidden md:block">•</div>
                <p>Vyrobené s ❤️ na Slovensku</p>
              </div>

              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <span>Kompatibilné s</span>
                <span className="font-semibold text-primary">BySquare</span>
                <span>štandardom</span>
              </div>
            </div>
          </FadeDiv>
        </div>
      </FadeContainer>
    </footer>
  );
}
