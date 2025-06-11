
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import SpinnerLogo from '@/components/SpinnerLogo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ArrowRight, PackageCheck, HandHeart, BarChartBig, Users, Pill } from 'lucide-react';
import Image from 'next/image';
import { AppFooter } from '@/components/layout/AppFooter';
import { allMockDrugs } from '@/lib/mock-data';
import type { Drug } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';

export default function LandingPage() {
  const featuredDrugs: Drug[] = allMockDrugs.filter(drug => drug.status === 'Available' || drug.status === 'Donated').slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button asChild variant="outline">
              <Link href="/login">Login / Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-background">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <div className="mb-8 inline-block p-2 rounded-lg">
              <SpinnerLogo className="h-20 w-20 md:h-28 md:h-28 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline mb-6">
              Smart Solutions for <span className="text-primary">Drug Expiration</span> Management
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Rxpiration Alert helps pharmacies, hospitals, and organizations reduce waste, optimize inventory, and improve medication accessibility through a collaborative platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
                <Link href="/signup">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="shadow-lg">
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Drugs Section */}
        {featuredDrugs.length > 0 && (
          <section id="featured-drugs" className="py-16 md:py-24 bg-secondary/30">
            <div className="container mx-auto px-4 md:px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">Featured Medications</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Explore some of the medications managed and tracked on our platform.
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredDrugs.map((drug) => (
                  <Card key={drug.id} className="flex flex-col overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="relative h-48 w-full bg-muted">
                      <Image
                        src={`https://placehold.co/600x400.png?text=${encodeURIComponent(drug.name)}`}
                        alt={drug.name}
                        layout="fill"
                        objectFit="cover"
                        data-ai-hint="medication product"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold">{drug.name}</CardTitle>
                      <CardDescription>{drug.dosage} - {drug.manufacturer}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{drug.notes || `Category: ${drug.category}`}</p>
                      <div className="flex items-center justify-between text-sm">
                        <Badge variant={drug.status === 'Expired' ? 'destructive' : 'outline'}>{drug.status}</Badge>
                        <span className="text-muted-foreground">Expires: {drug.expirationDate ? format(parseISO(drug.expirationDate), "MMM yyyy") : 'N/A'}</span>
                      </div>
                    </CardContent>
                    <div className="p-4 border-t">
                       <Button variant="link" className="w-full text-primary p-0" asChild>
                           <Link href={`/search?q=${encodeURIComponent(drug.name)}`}>
                            View Details
                           </Link>
                       </Button>
                    </div>
                  </Card>
                ))}
              </div>
              <div className="text-center mt-12">
                <Button asChild size="lg" variant="outline">
                  <Link href="/search">Explore More Medications</Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">Why Rxpiration Alert?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover the powerful features designed to streamline your pharmaceutical management.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: PackageCheck, title: "Inventory Optimization", description: "Manage drug listings efficiently, track expiration dates, and reduce waste." },
                { icon: HandHeart, title: "Facilitate Donations", description: "Easily connect with charities to donate surplus medications." },
                { icon: BarChartBig, title: "Data Analytics", description: "Gain insights from comprehensive reports on trends and inventory levels." },
                { icon: Users, title: "Seamless Collaboration", description: "Communicate effectively between pharmacists, patients, and organizations." },
                { icon: Pill, title: "AI-Powered Assistance", description: "Leverage AI for smart predictions and efficient management (Coming Soon)." }
              ].map((feature, index) => (
                <div key={index} className="p-6 bg-card rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <feature.icon className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-semibold font-headline mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* How it Works Section */}
        <section className="py-16 md:py-24 bg-secondary/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">Intuitive Dashboard. Powerful Insights.</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Visualize your data, track key metrics, and make informed decisions with our user-friendly interface.
              </p>
            </div>
            {/* Image was here, now removed */}
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 md:py-24 bg-primary/80 text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-headline mb-6">Ready to Reduce Waste and Improve Access?</h2>
            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 opacity-90">
              Join Rxpiration Alert today and be part of a sustainable solution for pharmaceutical management.
            </p>
            <Button asChild size="lg" variant="secondary" className="bg-background text-primary hover:bg-background/90 shadow-lg">
              <Link href="/signup">
                Sign Up for Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      
      <AppFooter />
    </div>
  );
}
