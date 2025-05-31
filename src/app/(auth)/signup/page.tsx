
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import Logo from '@/components/Logo';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, CreditCard, ShieldCheck } from 'lucide-react';

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  // Add state for form fields if needed for client-side validation or controlled components

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    // TODO: Implement actual signup logic:
    // 1. Collect form data
    // 2. Validate data (client-side and server-side)
    // 3. Send data to backend API for user creation
    // 4. Handle response (success/error)
    // 5. Redirect to payment page or dashboard
    console.log("Form submitted. Implement signup and payment redirection.");
    alert("Signup form submitted (placeholder). Backend integration and payment flow needed.");
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8">
        <Link href="/">
          <Logo />
        </Link>
      </div>
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Pharmacist Registration</CardTitle>
          <CardDescription>Join Rxpiration Alert to manage your inventory effectively.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" placeholder="e.g., John" required />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" placeholder="e.g., Doe" required />
              </div>
            </div>
            <div>
              <Label htmlFor="pharmacyName">Pharmacy Name (This will be your Username)</Label>
              <Input id="pharmacyName" name="pharmacyName" placeholder="e.g., City Central Pharmacy" required />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>
             <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="Create a strong password" required />
            </div>
            <div>
              <Label htmlFor="phone">Nigeria Phone Number</Label>
              <Input id="phone" name="phone" type="tel" placeholder="e.g., 08012345678" required pattern="^(0[7-9][01]\d{8})$" title="Please enter a valid Nigeria phone number (e.g., 08012345678)" />
            </div>
            <div>
              <Label htmlFor="pharmacyAddress">Pharmacy Address</Label>
              <Input id="pharmacyAddress" name="pharmacyAddress" placeholder="e.g., 123 Main Street, Ikeja, Lagos" required />
            </div>

            <Alert className="bg-primary/10 border-primary/30">
              <CreditCard className="h-5 w-5 text-primary" />
              <AlertTitle className="text-primary">Subscription Plans</AlertTitle>
              <AlertDescription>
                <p>Access all features with our simple subscription:</p>
                <ul className="list-disc list-inside ml-4 my-2">
                  <li><strong>Monthly:</strong> N5,000 (or equivalent)</li>
                  <li><strong>Yearly:</strong> N100,000 (or equivalent - Save N20,000!)</li>
                </ul>
                <p className="text-sm">Payment will be processed securely via Paystack or Flutterwave after registration.</p>
              </AlertDescription>
            </Alert>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Sign Up & Proceed to Payment'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col items-center">
          <p className="text-sm text-muted-foreground">
            Already have an account? <Link href="/login" className="text-primary hover:underline">Log In</Link>
          </p>
          <p className="mt-4 text-xs text-muted-foreground text-center">
             By signing up, you agree to our Terms of Service and Privacy Policy (placeholders).
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
