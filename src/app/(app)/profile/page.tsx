
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { UserCircle, Edit2, Bell, Building, Phone, MapPin, Link as LinkIcon, Globe, Tv, ThumbsUp, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Placeholder data - in a real app, this would come from user state/backend
const pharmacistProfile = {
  firstName: "Jane",
  lastName: "Doe",
  email: "jane.doe@example.com",
  memberSince: "January 1, 2024",
  pharmacyName: "City Central Pharmacy",
  nigeriaPhoneNumber: "08012345678",
  pharmacyAddress: "123 Main Street, Ikeja, Lagos",
  socialMediaLinks: [
    "https://facebook.com/citycentral",
    "https://twitter.com/citycentralrx",
    "", // Placeholder for 3rd link
    "", // Placeholder for 4th link
    "", // Placeholder for 5th link
  ],
  websiteLink: "https://citycentralpharmacy.com",
  subscriptionStatus: "Active",
  subscriptionTier: "Yearly",
};


export default function ProfilePage() {
  // In a real app, you'd have form handling state and functions here
  // For example:
  // const [profileData, setProfileData] = useState(pharmacistProfile);
  // const handleInputChange = (e) => { /* ... */ };
  // const handleSocialLinkChange = (index, value) => { /* ... */ };
  // const handleSubmit = async () => { /* ... */ };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <UserCircle className="mx-auto h-20 w-20 text-primary mb-4" />
          <CardTitle className="text-3xl">{pharmacistProfile.firstName} {pharmacistProfile.lastName}</CardTitle>
          <CardDescription>Manage your account settings and professional presence.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Personal & Pharmacy Information */}
          <div className="p-4 border rounded-lg bg-card shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-primary">
              <Building className="mr-2 h-5 w-5" /> Pharmacy & Contact Information
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="pharmacyName">Pharmacy Name (Username)</Label>
                <Input id="pharmacyName" defaultValue={pharmacistProfile.pharmacyName} readOnly className="bg-muted/50" />
                 <p className="text-xs text-muted-foreground mt-1">Username (Pharmacy Name) cannot be changed.</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue={pharmacistProfile.firstName} />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue={pharmacistProfile.lastName} />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue={pharmacistProfile.email} />
              </div>
              <div>
                <Label htmlFor="phone">Nigeria Phone Number</Label>
                <Input id="phone" type="tel" defaultValue={pharmacistProfile.nigeriaPhoneNumber} />
              </div>
              <div>
                <Label htmlFor="pharmacyAddress">Pharmacy Address</Label>
                <Input id="pharmacyAddress" defaultValue={pharmacistProfile.pharmacyAddress} />
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
                  <Input id="websiteLink" placeholder="https://yourpharmacy.com" defaultValue={pharmacistProfile.websiteLink} className="pl-10"/>
                </div>
              </div>
              <div>
                <Label>Social Media Links (up to 5)</Label>
                {pharmacistProfile.socialMediaLinks.map((link, index) => (
                  <div key={index} className="relative mt-2">
                     <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                     <Input 
                        id={`socialLink${index + 1}`} 
                        placeholder={`Social Media Link ${index + 1}`} 
                        defaultValue={link} 
                        className="pl-10"
                     />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Subscription Information */}
          <div className="p-4 border rounded-lg bg-card shadow-sm">
            <h3 className="text-lg font-semibold mb-3 flex items-center text-primary">
              <CreditCard className="mr-2 h-5 w-5" /> Subscription
            </h3>
            <div className="space-y-2 text-sm">
                <p><span className="font-medium text-muted-foreground">Status:</span> <span className="text-foreground font-semibold text-green-600">{pharmacistProfile.subscriptionStatus}</span></p>
                <p><span className="font-medium text-muted-foreground">Plan:</span> <span className="text-foreground">{pharmacistProfile.subscriptionTier}</span></p>
                <p><span className="font-medium text-muted-foreground">Next Billing Date:</span> <span className="text-foreground">October 26, 2024 (Placeholder)</span></p>
            </div>
            <Button variant="outline" className="mt-4">Manage Subscription</Button>
             <p className="text-xs text-muted-foreground mt-2"><em>Subscription management will be handled via Paystack/Flutterwave.</em></p>
          </div>
          
          {/* Notification Preferences (Existing) */}
          <div className="p-4 border rounded-lg bg-card shadow-sm">
            <h3 className="text-lg font-semibold mb-3 flex items-center text-primary">
              <Bell className="mr-2 h-5 w-5" /> Notification Preferences
            </h3>
            <div className="space-y-2 text-sm">
                <p><span className="font-medium text-muted-foreground">Email Alerts for Expiring Drugs:</span> <span className="text-foreground">Enabled (Placeholder)</span></p>
                <p><span className="font-medium text-muted-foreground">Weekly Summary Email:</span> <span className="text-foreground">Disabled (Placeholder)</span></p>
            </div>
            <p className="text-xs text-muted-foreground mt-3"><em>Customize your notification settings here in an upcoming update.</em></p>
          </div>
          
          <Separator className="my-6"/>

          <div className="flex justify-end">
            <Button size="lg">Save Changes</Button>
          </div>
          
          <div className="text-center pt-4 mt-6 border-t">
            <p className="text-md font-semibold text-accent">
              Profile management is partially implemented.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Saving changes and full backend integration for profile updates are under development.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
