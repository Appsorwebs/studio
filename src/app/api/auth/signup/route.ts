
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authAdmin, firestoreAdmin } from '@/lib/firebase/admin';
import { addMonths, formatISO } from 'date-fns';

// Schema for validating pharmacist signup data
const PharmacistSignupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  pharmacyName: z.string().min(1, "Pharmacy name is required (will be username)"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  nigeriaPhoneNumber: z.string().regex(/^(0[7-9][01]\d{8})$/, "Invalid Nigeria phone number (e.g., 08012345678)"),
  pharmacyAddress: z.string().min(1, "Pharmacy address is required"),
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    const validation = PharmacistSignupSchema.safeParse(formData);

    if (!validation.success) {
      return NextResponse.json({ 
        message: 'Invalid input.', 
        errors: validation.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    const { firstName, lastName, pharmacyName, email, password, nigeriaPhoneNumber, pharmacyAddress } = validation.data;

    // Check if user with this email already exists in Firebase Auth
    try {
      await authAdmin.getUserByEmail(email);
      return NextResponse.json({ 
        message: 'An account with this email address already exists.',
      }, { status: 409 }); // 409 Conflict
    } catch (error: any) {
      if (error.code !== 'auth/user-not-found') {
        // Some other error occurred while checking email
        console.error("Error checking existing email:", error);
        return NextResponse.json({ message: 'Error verifying email. Please try again.' }, { status: 500 });
      }
      // If 'auth/user-not-found', it means email is available, proceed.
    }
    
    // Future enhancement: Check if pharmacyName (username) is unique in Firestore
    // This would involve a query to the 'pharmacists' collection.
    // For simplicity in this step, we'll omit this check.

    let newUserRecord;
    try {
      newUserRecord = await authAdmin.createUser({
        email: email,
        password: password,
        displayName: `${firstName} ${lastName} (${pharmacyName})`, // Firebase Auth display name
        emailVerified: false, // You might want to implement email verification later
      });
    } catch (error: any) {
      console.error("Error creating user in Firebase Auth:", error);
      let publicMessage = "Failed to create user account.";
      if (error.code === 'auth/email-already-exists') { // Should have been caught above, but as a safeguard
        publicMessage = "An account with this email address already exists.";
         return NextResponse.json({ message: publicMessage }, { status: 409 });
      } else if (error.code === 'auth/invalid-password') {
        publicMessage = "Password is not strong enough. It must be at least 6 characters long.";
         return NextResponse.json({ message: publicMessage, errors: { password: [publicMessage]} }, { status: 400 });
      }
      return NextResponse.json({ message: publicMessage }, { status: 500 });
    }

    const userId = newUserRecord.uid;
    const currentDate = new Date();
    const trialEndDate = addMonths(currentDate, 1);

    const pharmacistProfileData = {
      userId: userId, // Storing the auth UID
      firstName,
      lastName,
      pharmacyName, // This is also the username
      email,
      nigeriaPhoneNumber,
      pharmacyAddress,
      memberSince: formatISO(currentDate),
      trialEndDate: formatISO(trialEndDate),
      subscriptionStatus: 'Trial Active', // Default status on signup
      subscriptionTier: 'N/A', // N/A during trial
      // socialMediaLinks and websiteLink can be added/updated by user later
    };

    try {
      // Use the Firebase Auth UID as the document ID in Firestore for easy linking
      await firestoreAdmin.collection('pharmacists').doc(userId).set(pharmacistProfileData);
      console.log(`Pharmacist profile for UID ${userId} created in Firestore.`);
    } catch (error) {
      console.error("Error saving pharmacist profile to Firestore:", error);
      // Potentially roll back Firebase Auth user creation or mark user for cleanup
      // For now, return an error to the client
      return NextResponse.json({ message: 'User account created, but failed to save profile details. Please contact support.' }, { status: 500 });
    }
    

    return NextResponse.json({ 
      message: "Pharmacist registration successful! Your 1-month free trial has started.",
      user: { // Return some basic info, not the full profile or password
        userId: userId,
        pharmacyName: pharmacyName,
        email: email
      } 
    }, { status: 201 });

  } catch (error) {
    console.error("Error processing signup:", error);
    // Generic error for unexpected issues
    return NextResponse.json({ message: "An unexpected error occurred during signup." }, { status: 500 });
  }
}
