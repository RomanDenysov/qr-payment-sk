import { PricingTable } from '@clerk/nextjs';
import { QRCard } from './components/qr-card';

export default function Home() {
  return (
    <>
      <h1 className="font-bold text-4xl">Hello World</h1>
      <QRCard />
      <PricingTable />
    </>
  );
}
