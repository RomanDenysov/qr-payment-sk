import { getSessionCookie } from 'better-auth/cookies';
import { type NextRequest, NextResponse } from 'next/server';

// biome-ignore lint/suspicious/useAwait: <explanation>
const middleware = async (request: NextRequest) => {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
};

export default middleware;

export const config = {
  matcher: ['/dashboard/:path*'],
};
