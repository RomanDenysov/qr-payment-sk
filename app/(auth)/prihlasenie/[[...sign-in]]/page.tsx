import dynamic from 'next/dynamic';

const title = 'Vitajte späť';
const description = 'Zadajte svoje údaje na prihlásenie.';
const SignIn = dynamic(() => import('@clerk/nextjs').then((mod) => mod.SignIn));

export default function Page() {
  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="font-semibold text-2xl tracking-tight">{title}</h1>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <SignIn />
    </>
  );
}
