import { PricingTable } from '@clerk/nextjs';
import { Hero } from './components/hero';

export default function Home() {
  return (
    <>
      <Hero />
      {/* <QRCard /> */}
      <PricingTable />
    </>
  );
}
