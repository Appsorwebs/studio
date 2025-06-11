
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
// Do NOT import authAdmin from '@/lib/firebase/admin' here for Edge compatibility

const PROTECTED_ROUTES = ['/dashboard', '/inventory', '/profile', '/settings', '/search', '/donations', '/about', '/contact'];
const AUTH_ROUTES = ['/login', '/signup'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session')?.value;

  // Handle auth pages
  if (AUTH_ROUTES.some(route => pathname.startsWith(route))) {
    if (sessionCookie) {
      // If there's a cookie, try to verify it to decide if user should be redirected from auth pages
      try {
        const verifyUrl = new URL('/api/auth/verify-session', request.url);
        const apiResponse = await fetch(verifyUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionCookie }),
        });
        const verificationResult = await apiResponse.json();

        if (apiResponse.ok && verificationResult.isValid) {
          // User is logged in, redirect from auth pages to dashboard
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        // Cookie invalid or verification failed, allow access to auth page, clear bad cookie
        const response = NextResponse.next();
        response.cookies.delete('session');
        return response;

      } catch (error) {
        // Error calling verification API, allow access to auth page, clear potentially bad cookie
        console.error('Middleware: Error verifying session for auth route access', error);
        const response = NextResponse.next();
        response.cookies.delete('session');
        return response;
      }
    }
    // No session cookie, allow access to auth pages
    return NextResponse.next();
  }

  // Handle protected routes
  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    if (!sessionCookie) {
      // Not logged in, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Call the internal API to verify the session cookie
      const verifyUrl = new URL('/api/auth/verify-session', request.url);
      const apiResponse = await fetch(verifyUrl.toString(), { // Ensure URL is a string
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionCookie }),
      });

      const verificationResult = await apiResponse.json();

      if (apiResponse.ok && verificationResult.isValid) {
        // Session is valid, add user info to request headers
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-user-id', verificationResult.userId);
        if (verificationResult.email) {
          requestHeaders.set('x-user-email', verificationResult.email);
        }
        
        return NextResponse.next({
          request: { headers: requestHeaders },
        });
      } else {
        // Verification failed or API error
        console.warn('Middleware: Session verification via API failed for protected route.', verificationResult.error, verificationResult.errorCode);
        const redirectResponse = NextResponse.redirect(new URL('/login', request.url));
        redirectResponse.cookies.delete('session'); // Clear the invalid/expired cookie
        return redirectResponse;
      }
    } catch (error) {
      // Network error calling the verification API or other unexpected error
      console.error('Middleware: Error calling verification API for protected route', error);
      const redirectResponse = NextResponse.redirect(new URL('/login', request.url));
      redirectResponse.cookies.delete('session'); // Clear cookie on error
      return redirectResponse;
    }
  }

  // Allow other requests (e.g., public assets, root page) to pass through
  return NextResponse.next();
}

// Define the matcher for the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes, though our verify-session is an API route, it's called by middleware)
     *   The matcher needs to be careful not to block the middleware from calling its own API.
     *   However, the verify-session API itself doesn't need to be matched by this middleware
     *   for protection, as it's an internal call. We only care about user-facing routes.
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (if you have a public/images folder)
     */
    '/((?!api/auth/verify-session|_next/static|_next/image|favicon.ico|images).*)',
  ],
};
