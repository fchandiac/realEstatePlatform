import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the request is for backOffice routes
  if (pathname.startsWith('/backOffice')) {
    // Check for NextAuth session cookie
    const sessionCookie = request.cookies.get('next-auth.session-token') ||
                         request.cookies.get('next-auth.session-token.0') ||
                         request.cookies.get('__Secure-next-auth.session-token') ||
                         request.cookies.get('__Secure-next-auth.session-token.0');

    // If no session cookie exists, redirect to home page
    if (!sessionCookie) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};