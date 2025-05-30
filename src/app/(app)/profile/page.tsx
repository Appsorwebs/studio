
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserCircle, Edit2, Bell } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <UserCircle className="mx-auto h-20 w-20 text-primary mb-4" />
          <CardTitle className="text-3xl">User Profile</CardTitle>
          <CardDescription>Manage your account settings and personal preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 border rounded-lg bg-card shadow-sm">
            <h3 className="text-lg font-semibold mb-3 flex items-center text-primary">
              <Edit2 className="mr-2 h-5 w-5" /> Personal Information
            </h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium text-muted-foreground">Name:</span> <span className="text-foreground">Jane Doe (Placeholder)</span></p>
              <p><span className="font-medium text-muted-foreground">Email:</span> <span className="text-foreground">jane.doe@example.com (Placeholder)</span></p>
              <p><span className="font-medium text-muted-foreground">Member Since:</span> <span className="text-foreground">January 1, 2024 (Placeholder)</span></p>
            </div>
            <p className="text-xs text-muted-foreground mt-3"><em>Full editing capabilities for your information will be available soon.</em></p>
          </div>

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
          
          <div className="text-center pt-4 mt-6 border-t">
            <p className="text-lg font-semibold text-amber-600 dark:text-amber-400">
              This Page is Under Construction
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              We're working hard to bring you a fully functional profile management experience. Stay tuned!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
