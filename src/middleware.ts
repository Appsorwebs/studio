
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { authAdmin } from '@/lib/firebase/admin'; // Ensure this path is correct

const PROTECTED_ROUTES = ['/dashboard', '/inventory', '/profile', '/settings', '/search', '/donations', '/about', '/contact']; // Add all routes under (app)
const AUTH_ROUTES = ['/login', '/signup'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session')?.value;

  // Check if trying to access auth page while logged in
  if (AUTH_ROUTES.some(route => pathname.startsWith(route))) {
    if (sessionCookie) {
      try {
        await authAdmin.verifySessionCookie(sessionCookie, true);
        // User is logged in, redirect from auth pages to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } catch (error) {
        // Cookie is invalid or expired, allow access to auth page, clear cookie
        const response = NextResponse.next();
        response.cookies.delete('session');
        return response;
      }
    }
    // Not logged in, allow access to auth pages
    return NextResponse.next();
  }

  // Check if trying to access a protected route
  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    if (!sessionCookie) {
      // Not logged in, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Verify the session cookie
      const decodedToken = await authAdmin.verifySessionCookie(sessionCookie, true);
      
      // Add user info to request headers for Server Components
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', decodedToken.uid);
      requestHeaders.set('x-user-email', decodedToken.email || '');

      // Allow request to proceed with new headers
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      // Session cookie is invalid (e.g., expired, revoked)
      // Redirect to login and clear the invalid cookie
      console.error('Middleware: Session cookie verification failed', error);
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('session');
      return response;
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
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (if you have a public/images folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};
