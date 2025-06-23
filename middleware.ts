import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { auth } from './lib/auth';

const publicRoutes = [
  '/',
  '/api/v1/qr/generate',
  '/prihlasenie(.*)',
  '/registracia(.*)',
  '/pravne(.*)',
];

const middleware = async (request: NextRequest) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session && !publicRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/prihlasenie', request.url));
  }

  return NextResponse.next();
};

export default middleware;

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
