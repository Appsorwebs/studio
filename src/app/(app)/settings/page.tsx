
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <Settings className="mx-auto h-24 w-24 text-primary mb-4" />
          <CardTitle className="text-2xl">Application Settings</CardTitle>
          <CardDescription>Customize your Rxpiration Alert experience.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">This page is under construction.</p>
          <p className="mt-2">App settings and preferences will be available here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
