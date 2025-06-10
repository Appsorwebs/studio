
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Settings as SettingsIcon, Palette, BellRing, KeyRound, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();
  
  const [platformAnnouncements, setPlatformAnnouncements] = useState(true);
  const [featureUpdates, setFeatureUpdates] = useState(true);

  const handlePasswordChange = () => {
    toast({ title: "Feature Coming Soon", description: "Password change functionality will be available in a future update." });
  };

  const handle2FA = () => {
    toast({ title: "Feature Coming Soon", description: "Two-Factor Authentication management is planned for a future update." });
  };
  
  const handleApiKeys = () => {
    toast({ title: "Feature Not Yet Active", description: "API Key management will be available for advanced users in a future update." });
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <SettingsIcon className="mx-auto h-20 w-20 text-primary mb-4" />
          <CardTitle className="text-3xl">Application Settings</CardTitle>
          <CardDescription>Customize your Rxpiration Alert experience and manage account security.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Appearance Section */}
          <div className="p-6 border rounded-lg bg-card shadow-sm">
            <h3 className="text-xl font-semibold mb-4 flex items-center text-primary">
              <Palette className="mr-3 h-6 w-6" /> Appearance
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              Global theme (Light/Dark/System) is managed via the theme toggle button in the application header.
            </p>
            <div className="p-3 bg-muted/50 rounded-md">
              <p className="text-xs text-muted-foreground">
                <em>Further display customization options, such as text size or compact views, may be added here in the future.</em>
              </p>
            </div>
          </div>

          {/* General Notification Settings Section */}
          <div className="p-6 border rounded-lg bg-card shadow-sm">
            <h3 className="text-xl font-semibold mb-4 flex items-center text-primary">
              <BellRing className="mr-3 h-6 w-6" /> General Notification Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-md border hover:bg-muted/30 transition-colors">
                <Label htmlFor="platformAnnouncements" className="flex-grow cursor-pointer pr-4">
                  Platform Announcements
                  <p className="text-xs text-muted-foreground">Receive important news and updates about Rxpiration Alert.</p>
                </Label>
                <Switch
                  id="platformAnnouncements"
                  checked={platformAnnouncements}
                  onCheckedChange={setPlatformAnnouncements}
                  aria-label="Toggle platform announcements"
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-md border hover:bg-muted/30 transition-colors">
                <Label htmlFor="featureUpdates" className="flex-grow cursor-pointer pr-4">
                  New Feature Updates
                  <p className="text-xs text-muted-foreground">Be notified when new features and improvements are launched.</p>
                </Label>
                <Switch
                  id="featureUpdates"
                  checked={featureUpdates}
                  onCheckedChange={setFeatureUpdates}
                  aria-label="Toggle feature updates"
                />
              </div>
            </div>
             <p className="text-xs text-muted-foreground mt-4">
                <em>Email-specific notification preferences (e.g., for expiring drugs, weekly summaries) can be managed in your <a href="/profile" className="text-primary hover:underline">Profile settings</a>.</em>
            </p>
          </div>

          {/* Account & Security Section */}
          <div className="p-6 border rounded-lg bg-card shadow-sm">
            <h3 className="text-xl font-semibold mb-4 flex items-center text-primary">
              <ShieldCheck className="mr-3 h-6 w-6" /> Account & Security
            </h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start" onClick={handlePasswordChange}>
                <KeyRound className="mr-2 h-4 w-4" /> Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={handle2FA}>
                <ShieldCheck className="mr-2 h-4 w-4" /> Manage Two-Factor Authentication
              </Button>
               <Button variant="outline" className="w-full justify-start" onClick={handleApiKeys} disabled>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 lucide lucide-key-round"><path d="M21 18v3m-6.09-6.09a3 3 0 0 0 0-4.24l-2.835-2.835a3.001 3.001 0 0 0-4.24 0l-2.835 2.835a3 3 0 0 0 0 4.24l2.835 2.835a3 3 0 0 0 4.24 0Zm0 0-2.835 2.835m6.09-6.09-2.835 2.835"></path><path d="M18 21v-3"></path><path d="M12 15V9"></path></svg>
                 API Key Management (Coming Soon)
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              <em>Advanced security settings and account management options will be progressively rolled out.</em>
            </p>
          </div>
          
          <Separator className="my-8" />

          <CardFooter className="flex-col items-center text-center">
             <p className="text-md font-semibold text-muted-foreground">
              Settings Interactivity Enhanced
            </p>
            <p className="mt-1 text-sm text-muted-foreground max-w-md">
              While these settings are now interactive, their persistence and backend integration are part of ongoing development. Your selections here are currently local to this session.
            </p>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
}
