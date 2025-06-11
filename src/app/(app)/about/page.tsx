
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Info, HeartHandshake, Lightbulb, ShieldCheck } from "lucide-react";
import Logo from "@/components/Logo";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="container mx-auto py-8 space-y-12">
      <section className="text-center">
        <div className="inline-block mb-6">
          <Link href="/dashboard">
            <Logo />
          </Link>
        </div>
        <h1 className="text-4xl font-bold mb-4">About Rxpiration Alert</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Rxpiration Alert is dedicated to reducing pharmaceutical waste and improving medication accessibility. 
          Our platform connects pharmacists, healthcare providers, and organizations to ensure that medications are utilized effectively and safely before they expire.
        </p>
      </section>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <HeartHandshake className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To minimize drug wastage globally by creating a smart, collaborative ecosystem for managing near-expiry medications, ultimately enhancing patient access and promoting healthcare sustainability.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Lightbulb className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Our Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To be the leading platform for intelligent drug lifecycle management, leveraging technology like AI to create a future where no usable medication goes to waste.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <ShieldCheck className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Our Values</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><strong>Integrity:</strong> Upholding the highest ethical standards.</li>
              <li><strong>Innovation:</strong> Continuously improving through technology.</li>
              <li><strong>Collaboration:</strong> Fostering partnerships for greater impact.</li>
              <li><strong>Accessibility:</strong> Ensuring medications reach those in need.</li>
              <li><strong>Sustainability:</strong> Promoting responsible resource use.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Key Features</CardTitle>
          <CardDescription>How Rxpiration Alert helps you.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p><strong>Drug Listing & Management:</strong> Easily list and manage your inventory of near-expiry drugs.</p>
          <p><strong>AI-Powered Prediction:</strong> Utilize our advanced AI to predict drug expiration dates more accurately.</p>
          <p><strong>Smart Search & Filtering:</strong> Quickly find specific medications based on various criteria.</p>
          <p><strong>Donation Facilitation:</strong> Connect with charities to donate surplus medications efficiently.</p>
          <p><strong>Data Analytics:</strong> Gain insights from reports on expiration trends and inventory levels.</p>
        </CardContent>
      </Card>
    </div>
  );
}
