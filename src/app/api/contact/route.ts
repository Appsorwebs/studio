
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Schema for validating contact form data
const ContactFormSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.enum([
    "general", 
    "support", 
    "feedback", 
    "partnership", 
    "donation_query"
  ], {
    errorMap: () => ({ message: "Please select a valid inquiry type." })
  }),
  message: z.string().min(1, "Message is required").min(10, "Message should be at least 10 characters long"),
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    const validation = ContactFormSchema.safeParse(formData);

    if (!validation.success) {
      return NextResponse.json({ 
        message: 'Invalid input. Please check the fields.', 
        errors: validation.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    const { name, email, subject, message } = validation.data;

    console.log("Validated contact form data received on server:", { name, email, subject, message });

    // In a real app, you would implement email sending logic here
    // using a service like Resend, SendGrid, or Nodemailer.
    // For now, we'll log to console and return success.
    return NextResponse.json({ message: "Message received successfully!" }, { status: 200 });

  } catch (error) {
    console.error("Error processing contact form:", error);
    let errorMessage = "An unexpected error occurred while processing your request.";
    // Avoid exposing detailed internal errors to the client in production
    if (error instanceof z.ZodError) { // Should be caught by safeParse, but as a fallback
        errorMessage = "There was an issue with the data submitted."
    } else if (error instanceof Error && process.env.NODE_ENV === 'development') {
      // More detailed errors in development if needed
      // errorMessage = error.message; 
    }
    return NextResponse.json({ message: "Failed to process message.", errorDetail: errorMessage }, { status: 500 });
  }
}
