
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings as SettingsIcon, Palette, BellRing, KeyRound, ShieldCheck } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <SettingsIcon className="mx-auto h-20 w-20 text-primary mb-4" />
          <CardTitle className="text-3xl">Application Settings</CardTitle>
          <CardDescription>Customize your Rxpiration Alert experience and manage account security.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 border rounded-lg bg-card shadow-sm">
            <h3 className="text-lg font-semibold mb-3 flex items-center text-primary">
              <Palette className="mr-2 h-5 w-5" /> Appearance
            </h3>
            <p className="text-sm text-muted-foreground">Theme preferences are managed globally via the theme toggle in the header.</p>
            <p className="text-xs text-muted-foreground mt-1"><em>Additional display or layout settings may appear here in the future.</em></p>
          </div>

          <div className="p-4 border rounded-lg bg-card shadow-sm">
            <h3 className="text-lg font-semibold mb-3 flex items-center text-primary">
              <BellRing className="mr-2 h-5 w-5" /> General Notification Settings
            </h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium text-muted-foreground">Platform Announcements:</span> <span className="text-foreground">Enabled (Placeholder)</span></p>
              <p><span className="font-medium text-muted-foreground">Feature Updates:</span> <span className="text-foreground">Enabled (Placeholder)</span></p>
            </div>
            <p className="text-xs text-muted-foreground mt-3"><em>Control general app notifications here soon.</em></p>
          </div>

          <div className="p-4 border rounded-lg bg-card shadow-sm">
            <h3 className="text-lg font-semibold mb-3 flex items-center text-primary">
              <ShieldCheck className="mr-2 h-5 w-5" /> Account & Security
            </h3>
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground"><em>Placeholder for actions like changing password, enabling two-factor authentication, or managing API keys (future features).</em></p>
            </div>
             <p className="text-xs text-muted-foreground mt-3"><em>Advanced account settings will be available here.</em></p>
          </div>
          
          <div className="text-center pt-4 mt-6 border-t">
             <p className="text-lg font-semibold text-accent">
              Settings Area Under Development
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              More customization and control options are on the way. Thank you for your patience!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
