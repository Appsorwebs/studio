
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

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

    // **MOCK IMPLEMENTATION STARTS HERE**
    // In a real application, you would:
    // 1. Hash the password securely (e.g., using bcrypt).
    // 2. Check if the email or pharmacyName (username) already exists in your database.
    // 3. Save the new pharmacist user to your database, including a trial start/end date.
    // 4. Potentially create a session or JWT for authentication.

    console.log("Received pharmacist signup data:", validation.data);
    console.log("Simulating password hashing for:", password.substring(0,2) + "..."); 
    console.log(`Simulating saving user ${pharmacyName} to database with a 1-month free trial...`);

    // Simulate a delay for database operation
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log("User successfully (simulated) created.");
    // **MOCK IMPLEMENTATION ENDS HERE**

    // After successful user creation (simulated), the user gets a 1-month free trial.
    // Payment processing would happen later, when the trial is about to expire or if the user chooses to subscribe earlier.

    return NextResponse.json({ 
      message: "Pharmacist registration (simulated) successful! Your 1-month free trial has started.",
      user: { 
        pharmacyName: pharmacyName,
        email: email
      } 
    }, { status: 201 });

  } catch (error) {
    console.error("Error processing signup:", error);
    let errorMessage = "An unexpected error occurred during signup.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ message: "Failed to process signup.", error: errorMessage }, { status: 500 });
  }
}
