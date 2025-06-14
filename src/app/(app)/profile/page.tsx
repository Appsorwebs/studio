
"use client";

import { useState, FormEvent, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserCircle, Bell, Building, Phone, Link as LinkIcon, Globe, ThumbsUp, CreditCard, Loader2, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from '@/hooks/use-toast';
import { format, addMonths } from 'date-fns';

// Initial data - in a real app, this would come from user state/backend after login
const initialPharmacistProfile = {
  firstName: "Jane",
  lastName: "Doe",
  email: "jane.doe@example.com",
  memberSince: "January 1, 2024",
  pharmacyName: "City Central Pharmacy", // Also username
  nigeriaPhoneNumber: "08012345678",
  pharmacyAddress: "123 Main Street, Ikeja, Lagos",
  socialMediaLinks: [
    "https://facebook.com/citycentral",
    "https://twitter.com/citycentralrx",
    "", 
    "", 
    "", 
  ],
  websiteLink: "https://citycentralpharmacy.com",
  // Subscription and trial related fields would ideally come from backend
  subscriptionStatus: "Trial Active", 
  subscriptionTier: "N/A", 
  trialEndDate: addMonths(new Date(), 1).toISOString(), // Simulating trial end date for display
  paymentLinks: { // These would be used when trial ends or user wants to subscribe
      monthly: "https://paystack.shop/pay/rxpiration",
      yearly: "https://paystack.shop/pay/rxpiration1"
  }
};


export default function ProfilePage() {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState(initialPharmacistProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [displayTrialEndDate, setDisplayTrialEndDate] = useState('');

  useEffect(() => {
    if (profileData.trialEndDate) {
      setDisplayTrialEndDate(format(new Date(profileData.trialEndDate), "MMMM dd, yyyy"));
    }
  }, [profileData.trialEndDate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialLinkChange = (index: number, value: string) => {
    const newSocialLinks = [...profileData.socialMediaLinks];
    newSocialLinks[index] = value;
    setProfileData(prev => ({ ...prev, socialMediaLinks: newSocialLinks }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    
    const { memberSince, subscriptionStatus, subscriptionTier, trialEndDate, paymentLinks, ...dataToUpdate } = profileData;

    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToUpdate), 
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Profile Updated",
          description: result.message || "Your profile changes have been saved.",
          variant: "default",
        });
      } else {
        let errorMessages = result.message || "An error occurred while updating your profile.";
        if (result.errors) {
          const fieldErrors = Object.entries(result.errors)
            .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
            .join('\n');
          errorMessages += `\nDetails:\n${fieldErrors}`;
        }
        toast({
          title: "Update Failed",
          description: errorMessages,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Profile update submission error:", error);
      toast({
        title: "Network Error",
        description: "Could not reach the server. Please check your connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleManageSubscription = () => {
     toast({
        title: "Manage Subscription",
        description: "Subscription management options and payment links will be available here or via email reminders as your trial period nears its end.",
        duration: 7000,
    });
  };


  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <UserCircle className="mx-auto h-20 w-20 text-primary mb-4" />
          <CardTitle className="text-3xl">{profileData.firstName} {profileData.lastName}</CardTitle>
          <CardDescription>Manage your account settings and professional presence.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal & Pharmacy Information */}
            <div className="p-4 border rounded-lg bg-card shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-primary">
                <Building className="mr-2 h-5 w-5" /> Pharmacy & Contact Information
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="pharmacyName">Pharmacy Name (Username)</Label>
                  <Input id="pharmacyName" name="pharmacyName" value={profileData.pharmacyName} readOnly className="bg-muted/50" />
                  <p className="text-xs text-muted-foreground mt-1">Username (Pharmacy Name) cannot be changed here.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" name="firstName" value={profileData.firstName} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" name="lastName" value={profileData.lastName} onChange={handleInputChange} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" value={profileData.email} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="nigeriaPhoneNumber">Nigeria Phone Number</Label>
                  <Input id="nigeriaPhoneNumber" name="nigeriaPhoneNumber" type="tel" value={profileData.nigeriaPhoneNumber} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="pharmacyAddress">Pharmacy Address</Label>
                  <Input id="pharmacyAddress" name="pharmacyAddress" value={profileData.pharmacyAddress} onChange={handleInputChange} />
                </div>
              </div>
            </div>

            {/* Social Media & Website Links */}
            <div className="p-4 border rounded-lg bg-card shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-primary">
                <ThumbsUp className="mr-2 h-5 w-5" /> Online Presence
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="websiteLink">Website Link</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        id="websiteLink" 
                        name="websiteLink"
                        placeholder="https://yourpharmacy.com" 
                        value={profileData.websiteLink} 
                        onChange={handleInputChange}
                        className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label>Social Media Links (up to 5)</Label>
                  {profileData.socialMediaLinks.map((link, index) => (
                    <div key={index} className="relative mt-2">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                          id={`socialLink${index + 1}`}
                          name={`socialLink${index + 1}`}
                          placeholder={`Social Media Link ${index + 1}`} 
                          value={link} 
                          onChange={(e) => handleSocialLinkChange(index, e.target.value)}
                          className="pl-10"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <Separator className="my-6"/>

            <div className="flex justify-end">
              <Button type="submit" size="lg" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Changes
              </Button>
            </div>
          </form>

          {/* Subscription Information */}
          <div className="mt-8 p-4 border rounded-lg bg-card shadow-sm">
            <h3 className="text-lg font-semibold mb-3 flex items-center text-primary">
              <CreditCard className="mr-2 h-5 w-5" /> Subscription
            </h3>
            <div className="space-y-2 text-sm">
                <p><span className="font-medium text-muted-foreground">Status:</span> <span className="text-foreground font-semibold text-green-600">{profileData.subscriptionStatus}</span></p>
                {profileData.subscriptionStatus === "Trial Active" && displayTrialEndDate && (
                  <p><Star className="inline mr-1 h-4 w-4 text-yellow-500" /> <span className="font-medium text-muted-foreground">Trial Ends:</span> <span className="text-foreground">{displayTrialEndDate}</span></p>
                )}
                {profileData.subscriptionStatus !== "Trial Active" && (
                    <p><span className="font-medium text-muted-foreground">Plan:</span> <span className="text-foreground">{profileData.subscriptionTier}</span></p>
                )}
            </div>
            <Button variant="outline" className="mt-4" onClick={handleManageSubscription}>Manage Subscription</Button>
            <p className="text-xs text-muted-foreground mt-2"><em>Subscription management will be handled via Paystack. You'll be prompted to subscribe before your trial ends.</em></p>
          </div>
          
          {/* Notification Preferences (Existing) */}
          <div className="mt-8 p-4 border rounded-lg bg-card shadow-sm">
            <h3 className="text-lg font-semibold mb-3 flex items-center text-primary">
              <Bell className="mr-2 h-5 w-5" /> Notification Preferences
            </h3>
            <div className="space-y-2 text-sm">
                <p><span className="font-medium text-muted-foreground">Email Alerts for Expiring Drugs:</span> <span className="text-foreground">Enabled</span></p>
                <p><span className="font-medium text-muted-foreground">Weekly Summary Email:</span> <span className="text-foreground">Disabled</span></p>
                <p><span className="font-medium text-muted-foreground">Subscription Reminders:</span> <span className="text-foreground">Enabled</span></p>
            </div>
            <p className="text-xs text-muted-foreground mt-3"><em>Customize your notification settings here in an upcoming update.</em></p>
          </div>
          
          <div className="text-center pt-4 mt-6 border-t">
            <p className="text-md font-semibold text-accent-foreground">
              Profile UI is Interactive
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              You can edit your profile information. Saving changes is handled via a backend API call. Full database persistence is the next step.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
