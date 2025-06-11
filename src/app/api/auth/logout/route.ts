
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Clear the session cookie
    cookies().delete('session');

    // Redirect to the login page
    // Using a relative URL for redirection is fine here.
    // For external URLs, ensure you use the full URL.
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl.toString(), { status: 302 }); // 302 for temporary redirect

  } catch (error) {
    console.error('Logout error:', error);
    // Even if an error occurs, try to redirect to login as a fallback.
    // You might want more sophisticated error handling for production.
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl.toString(), {
      status: 302, // Or an error page
    });
  }
}
