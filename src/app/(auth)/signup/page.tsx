
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import Logo from '@/components/Logo';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, CreditCard, ShieldCheck, Loader2, Sparkles } from 'lucide-react'; 
import { useToast } from '@/hooks/use-toast'; 

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast(); 

  const paystackMonthlyLink = "https://paystack.shop/pay/rxpiration";
  const paystackYearlyLink = "https://paystack.shop/pay/rxpiration1";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      pharmacyName: formData.get("pharmacyName") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      nigeriaPhoneNumber: formData.get("phone") as string,
      pharmacyAddress: formData.get("pharmacyAddress") as string,
    };

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Registration Successful! 🎉",
          description: `${result.message} You can now log in and explore the app.`,
          variant: "default",
          duration: 7000, 
        });
        (event.target as HTMLFormElement).reset(); 
        // In a real app, you might redirect to login or dashboard after a short delay
        // For now, we just inform the user.
      } else {
        let errorMessages = result.message || "An error occurred during signup.";
        if (result.errors) {
          const fieldErrors = Object.entries(result.errors)
            .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
            .join('\n');
          errorMessages += `\nDetails:\n${fieldErrors}`;
        }
        toast({
          title: "Registration Failed",
          description: errorMessages,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Signup form submission error:", error);
      toast({
        title: "Network Error",
        description: "Could not reach the server. Please check your connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
              <Label htmlFor="password">Password (min. 8 characters)</Label>
              <Input id="password" name="password" type="password" placeholder="Create a strong password" required minLength={8}/>
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
              <Sparkles className="h-5 w-5 text-primary" />
              <AlertTitle className="text-primary">Start with a 1-MONTH FREE TRIAL!</AlertTitle>
              <AlertDescription>
                <p className="mb-2">Enjoy full access to all Rxpiration Alert features, no payment needed upfront during your trial period.</p>
                <p className="font-semibold">After your trial, continue with one of our plans:</p>
                <ul className="list-disc list-inside ml-4 my-2 space-y-1">
                  <li>
                    <strong>Monthly Plan:</strong> N5,000
                    {/* Link could be activated post-trial <a href={paystackMonthlyLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">(Pay Monthly)</a> */}
                  </li>
                  <li>
                    <strong>Yearly Plan:</strong> N100,000 - Best value for uninterrupted long-term access.
                    {/* Link could be activated post-trial <a href={paystackYearlyLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">(Pay Yearly)</a> */}
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground">You'll be reminded to choose a plan before your trial ends. Payments will be processed securely via Paystack.</p>
              </AlertDescription>
            </Alert>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Sign Up & Start Free Trial'}
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
