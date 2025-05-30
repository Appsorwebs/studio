
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserCircle } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <UserCircle className="mx-auto h-24 w-24 text-primary mb-4" />
          <CardTitle className="text-2xl">User Profile</CardTitle>
          <CardDescription>Manage your account settings and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">This page is under construction.</p>
          <p className="mt-2">Your profile details and settings will appear here soon!</p>
        </CardContent>
      </Card>
    </div>
  );
}
