import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

interface OTPEmailProps {
  username?: string;
  otpCode?: string;
  expiresIn?: number;
}

export const OTPEmail = ({
  username = 'Používateľ',
  otpCode = '123456',
  expiresIn = 10,
}: OTPEmailProps) => {
  const previewText = `Váš overovací kód: ${otpCode}`;

  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Preview>{previewText}</Preview>
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-[#eaeaea] border-solid p-[20px]">
            {/* Logo Section */}
            <Section className="mt-[32px] text-center">
              {/* You can replace this with actual logo */}
              <div className="mx-auto my-0 flex h-[40px] w-[40px] items-center justify-center rounded-lg bg-[#007bff]">
                <Text className="m-0 font-bold text-[20px] text-white">QR</Text>
              </div>
              {/* Alternative with actual logo: */}
              {/* <img 
                src={getStaticUrl('qr-platby-logo.png')} 
                width="40" 
                height="40" 
                alt="QR Platby Logo" 
                className="mx-auto my-0"
              /> */}
            </Section>

            <Heading className="mx-0 my-[30px] p-0 text-center font-normal text-[24px] text-black">
              Overovací kód
            </Heading>

            <Text className="text-[14px] text-black leading-[24px]">
              Ahoj {username},
            </Text>

            <Text className="text-[14px] text-black leading-[24px]">
              Váš kód na potvrdenie akcie v <strong>QR Platby</strong>:
            </Text>

            <Section className="mt-[32px] mb-[32px] text-center">
              <div className="inline-block rounded-lg border border-[#e1e8ed] bg-[#f6f9fc] px-[24px] py-[16px]">
                <Text className="m-0 font-bold text-[#007bff] text-[32px] tracking-[8px]">
                  {otpCode}
                </Text>
              </div>
            </Section>

            <Text className="text-center text-[14px] text-black leading-[24px]">
              Zadajte tento kód v aplikácii pre pokračovanie.
            </Text>

            <Text className="text-center text-[#666666] text-[12px] leading-[20px]">
              Kód je platný <strong>{expiresIn} minút</strong>.
            </Text>

            <Hr className="mx-0 my-[26px] w-full border border-[#eaeaea] border-solid" />

            <Text className="text-[#666666] text-[12px] leading-[24px]">
              Ak ste si nevyžiadali tento kód, jednoducho ignorujte tento
              e-mail. Kód bude automaticky deaktivovaný po {expiresIn} minútach.
            </Text>

            <Text className="text-[#666666] text-[12px] leading-[24px]">
              S pozdravom,
              <br />
              Tím <strong>QR Platby</strong>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
