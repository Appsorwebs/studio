
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { authAdmin } from '@/lib/firebase/admin';

export async function POST(request: NextRequest) {
  try {
    const { sessionCookie } = await request.json();

    if (!sessionCookie || typeof sessionCookie !== 'string') {
      return NextResponse.json({ isValid: false, error: 'Session cookie not provided or invalid format' }, { status: 400 });
    }

    const decodedToken = await authAdmin.verifySessionCookie(sessionCookie, true);
    return NextResponse.json({ 
      isValid: true, 
      userId: decodedToken.uid, 
      email: decodedToken.email 
    }, { status: 200 });

  } catch (error: any) {
    console.error('API verify-session error:', error.code, error.message);
    // Specific Firebase error codes for session cookie verification
    let errorMessage = 'Invalid or expired session';
    if (error.code === 'auth/session-cookie-expired') {
        errorMessage = 'Session cookie has expired.';
    } else if (error.code === 'auth/session-cookie-revoked') {
        errorMessage = 'Session cookie has been revoked.';
    } else if (error.code === 'auth/invalid-session-cookie') {
        errorMessage = 'Session cookie is invalid.';
    }
    
    return NextResponse.json({ isValid: false, error: errorMessage, errorCode: error.code }, { status: 401 });
  }
}
