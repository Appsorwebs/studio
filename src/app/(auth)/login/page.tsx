
"use client";

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import Logo from '@/components/Logo';
import { LogIn, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { authClient } from '@/lib/firebase/client'; 
import { signInWithEmailAndPassword, AuthError } from 'firebase/auth';
import { useRouter } from 'next/navigation'; 

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter(); 

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const userCredential = await signInWithEmailAndPassword(authClient, email, password);
      const user = userCredential.user;
      console.log("Firebase client login successful, user:", user.uid);

      // Get ID token
      const idToken = await user.getIdToken();

      // Send ID token to backend to create session cookie
      const response = await fetch('/api/auth/session-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (response.ok) {
        toast({
          title: "Login Successful! 🎉",
          description: `Welcome back, ${user.email}! Redirecting...`,
          variant: "default",
          duration: 3000,
        });
        (event.target as HTMLFormElement).reset();
        router.push('/dashboard'); 
      } else {
        const errorData = await response.json();
        toast({
          title: "Session Login Failed",
          description: errorData.error || "Could not create a session. Please try again.",
          variant: "destructive",
        });
      }

    } catch (error) {
      const authError = error as AuthError;
      console.error("Firebase login error:", authError.code, authError.message);
      let errorMessage = "An unknown error occurred during login.";
      switch (authError.code) {
        case 'auth/invalid-email':
          errorMessage = "Invalid email address format.";
          break;
        case 'auth/user-disabled':
          errorMessage = "This user account has been disabled.";
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential': 
          errorMessage = "Invalid email or password.";
          break;
        default:
          errorMessage = authError.message || "Failed to log in. Please try again.";
      }
      toast({
        title: "Login Failed",
        description: errorMessage,
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
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Welcome Back!</CardTitle>
          <CardDescription>Log in to manage your Rxpiration Alert account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="Your password" required />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
              Log In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col items-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account? <Link href="/signup" className="text-primary hover:underline">Sign Up</Link>
          </p>
           <p className="mt-4 text-xs text-muted-foreground text-center">
             Forgot your password? (Functionality coming soon)
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
