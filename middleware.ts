import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { auth } from './lib/auth';

// Define public routes as string prefixes instead of patterns
const publicRoutes = [
  '/',
  '/api/v1/qr/generate',
  '/autorizacia',
  '/registracia',
  '/pravne',
];

// Updated helper function to check if the pathname matches a public route
const isPublicRoute = (pathname: string) => {
  return publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
};

// Middleware function
const middleware = async (request: NextRequest) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Redirect to '/autorizacia' if there's no session and the path is not public
  if (!session && !isPublicRoute(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/autorizacia', request.url));
  }

  return NextResponse.next();
};

export default middleware;

export const config = {
  // runtime: 'nodejs',
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
