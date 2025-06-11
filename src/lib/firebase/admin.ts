
import admin from 'firebase-admin';

// Ensure this file is not imported on the client side.
// It should only be used in server-side code (e.g., API routes).

if (!admin.apps.length) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
      throw new Error('Firebase Admin SDK environment variables not set. Ensure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are configured in your .env.local file.');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error) {
    console.error('Firebase Admin SDK initialization error:', error);
    // You might want to throw the error or handle it gracefully depending on your app's needs
    // For now, we'll log it. The API routes using this will fail if admin is not initialized.
  }
}

export const firebaseAdmin = admin;
export const firestoreAdmin = admin.firestore();
export const authAdmin = admin.auth();
