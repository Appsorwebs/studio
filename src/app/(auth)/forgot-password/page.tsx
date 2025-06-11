
"use client";

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import Logo from '@/components/Logo';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { authClient } from '@/lib/firebase/client';
import { sendPasswordResetEmail, AuthError } from 'firebase/auth';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(authClient, email);
      toast({
        title: "Password Reset Email Sent",
        description: "If an account exists for this email, a password reset link has been sent. Please check your inbox (and spam folder).",
        variant: "default",
        duration: 7000,
      });
      setEmail(''); // Clear the input
    } catch (error) {
      const authError = error as AuthError;
      console.error("Password reset error:", authError.code, authError.message);
      let errorMessage = "An error occurred. Please try again.";
      if (authError.code === 'auth/user-not-found') {
        // Don't reveal if user exists, show generic message for security
         toast({
            title: "Password Reset Email Sent",
            description: "If an account exists for this email, a password reset link has been sent. Please check your inbox (and spam folder).",
            variant: "default",
            duration: 7000,
        });
      } else if (authError.code === 'auth/invalid-email') {
        errorMessage = "The email address is not valid.";
         toast({
            title: "Invalid Email",
            description: errorMessage,
            variant: "destructive",
        });
      }
      else {
        toast({
            title: "Error Sending Reset Email",
            description: errorMessage,
            variant: "destructive",
        });
      }
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
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Forgot Password?</CardTitle>
          <CardDescription>Enter your email address and we'll send you a link to reset your password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="you@example.com" 
                    required 
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Send Reset Link'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col items-center">
          <Link href="/login" className="text-sm text-primary hover:underline flex items-center">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Log In
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
