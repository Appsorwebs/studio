
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { authAdmin } from '@/lib/firebase/admin';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const idToken = body.idToken;

    if (!idToken || typeof idToken !== 'string') {
      return NextResponse.json({ error: 'ID token is required and must be a string.' }, { status: 400 });
    }

    // Set session expiration to 5 days.
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days in milliseconds

    // Verify the ID token first.
    // This also checks if the token is revoked.
    const decodedIdToken = await authAdmin.verifyIdToken(idToken, true);

    if (decodedIdToken) {
      // Token is valid, create the session cookie.
      // Note: verifyIdToken already checks for expiration.
      // The check `new Date().getTime() / 1000 < decodedIdToken.exp` is redundant if verifyIdToken doesn't throw.
      const sessionCookie = await authAdmin.createSessionCookie(idToken, { expiresIn });
      const options = {
        name: 'session', // Name of the cookie
        value: sessionCookie,
        maxAge: expiresIn / 1000, // maxAge is in seconds
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        path: '/',
        sameSite: 'lax' as const,
      };

      // Set cookie using Next.js cookies() utility
      cookies().set(options);

      return NextResponse.json({ status: 'success', message: 'Session cookie created.' }, { status: 200 });
    } else {
      // This case should ideally not be reached if verifyIdToken throws an error for invalid tokens.
      // However, as a safeguard:
      return NextResponse.json({ error: 'Invalid ID token.' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('Session login error:', error);
    if (error.code === 'auth/id-token-expired') {
        return NextResponse.json({ error: 'ID token has expired. Please log in again.' }, { status: 401 });
    }
    if (error.code === 'auth/id-token-revoked') {
        return NextResponse.json({ error: 'ID token has been revoked. Please log in again.' }, { status: 401 });
    }
    if (error.code === 'auth/argument-error') { // Often from malformed token
        return NextResponse.json({ error: 'Invalid ID token format.' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error during session login.', details: error.message || 'Unknown error' }, { status: 500 });
  }
}
