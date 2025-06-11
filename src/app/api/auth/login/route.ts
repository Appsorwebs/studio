
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Schema for validating login data
const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Hardcoded credentials for simulation
const SIMULATED_USER_EMAIL = "test@example.com";
const SIMULATED_USER_PASSWORD = "password123";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    const validation = LoginSchema.safeParse(formData);

    if (!validation.success) {
      return NextResponse.json({ 
        message: 'Invalid input.', 
        errors: validation.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    const { email, password } = validation.data;

    // Simulate authentication
    // In a real app, you would use Firebase Admin SDK to verify ID token or handle custom token logic
    // For now, we check against hardcoded values.
    if (email === SIMULATED_USER_EMAIL && password === SIMULATED_USER_PASSWORD) {
      // Simulate successful login and session creation
      // In a real app, you'd create a session cookie here
      console.log(`Simulated successful login for: ${email}`);
      return NextResponse.json({ 
        message: "Login successful (simulated).",
        user: { // Return some basic user info (simulated)
          email: email,
          // In a real app, include user ID, roles, etc.
        }
      }, { status: 200 });
    } else {
      console.warn(`Simulated failed login attempt for: ${email}`);
      return NextResponse.json({ 
        message: 'Invalid email or password (simulated).',
      }, { status: 401 }); // 401 Unauthorized
    }

  } catch (error) {
    console.error("Error processing login:", error);
    return NextResponse.json({ message: "An unexpected error occurred during login." }, { status: 500 });
  }
}
