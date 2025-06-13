import dynamic from 'next/dynamic';

const PricingTable = dynamic(() =>
  import('@clerk/nextjs').then((mod) => mod.PricingTable)
);

export default function PricingPage() {
  return <PricingTable />;
}
