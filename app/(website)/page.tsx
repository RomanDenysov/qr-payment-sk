import { GetQrCard } from './components/get-qr-card';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h1 className="font-bold text-4xl">Hello World</h1>
      <GetQrCard />
    </div>
  );
}
