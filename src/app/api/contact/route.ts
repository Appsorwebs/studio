
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

    // TODO: Implement actual email sending logic here
    // For example, using a service like Resend, SendGrid, or Nodemailer.
    // const sendEmailResponse = await emailService.send({
    //   to: 'admin@appsorwebs.com', // The administrator email
    //   from: `Contact Form <noreply@yourdomain.com>`, // Use a verified sender
    //   reply_to: email, // Set reply-to to the user's email
    //   subject: `Contact Form: ${subject} - from ${name}`,
    //   html: `<p><strong>Name:</strong> ${name}</p>
    //          <p><strong>Email:</strong> ${email}</p>
    //          <p><strong>Subject:</strong> ${subject}</p>
    //          <p><strong>Message:</strong></p>
    //          <p>${message.replace(/\n/g, '<br>')}</p>`,
    // });
    // if (sendEmailResponse.success) {
    //   return NextResponse.json({ message: "Message sent successfully!" }, { status: 200 });
    // } else {
    //   console.error("Failed to send email:", sendEmailResponse.error);
    //   return NextResponse.json({ message: "Failed to send message due to a server error." }, { status: 500 });
    // }

    // For now, we'll simulate success after validation
    return NextResponse.json({ message: "Message received and validated by the server. Email sending not yet implemented." }, { status: 200 });

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
