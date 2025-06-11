
"use client";

import type { Charity } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { HeartHandshake, Mail, Phone, Globe, Search } from "lucide-react";
import { useState, useMemo } from "react";

const mockCharities: Charity[] = [
  {
    id: "charity1",
    name: "HealthBridge Foundation",
    contactPerson: "Sarah Chen",
    email: "schen@healthbridge.org",
    phone: "555-0101",
    address: "123 Health St, Anytown, USA",
    website: "www.healthbridge.org",
    description: "Providing essential medicines to underserved communities locally and globally.",
    status: "Active",
    neededItems: ["Antibiotics", "Pain relievers", "Vitamins"]
  },
  {
    id: "charity2",
    name: "MedsForAll Initiative",
    contactPerson: "David Miller",
    email: "dmiller@medsforall.org",
    phone: "555-0102",
    address: "456 Care Ave, Anytown, USA",
    website: "www.medsforall.org",
    description: "Focusing on chronic disease medications for low-income patients.",
    status: "Active",
    neededItems: ["Insulin", "Blood pressure medication", "Asthma inhalers"]
  },
  {
    id: "charity3",
    name: "Global Aid Pharmacy",
    contactPerson: "Maria Rodriguez",
    email: "mrodriguez@globalaidpharma.com",
    phone: "555-0103",
    address: "789 Hope Blvd, Anytown, USA",
    description: "Emergency medical supplies and disaster relief pharmacy services.",
    status: "Active",
    neededItems: ["First aid kits", "Antiseptics", "Bandages"]
  },
];


export function DonationsPageContent() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCharities = useMemo(() => {
    return mockCharities.filter(charity =>
      charity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (charity.neededItems && charity.neededItems.some(item => item.toLowerCase().includes(searchTerm.toLowerCase())))
    );
  }, [searchTerm]);

  return (
    <div className="space-y-8">
      <section className="text-center py-8 bg-card rounded-lg shadow-sm">
        <HeartHandshake className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-bold mb-2">Donate Medications, Save Lives</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Connect with reputable charities and organizations to donate surplus or soon-to-expire medications. 
          Your contribution can make a significant impact on those in need.
        </p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>How to Donate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold">1</div>
            <div>
              <h3 className="font-semibold">Check Eligibility</h3>
              <p className="text-muted-foreground">Ensure your medications are unexpired, unopened, and not controlled substances. Check specific charity guidelines.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold">2</div>
            <div>
              <h3 className="font-semibold">Find a Charity</h3>
              <p className="text-muted-foreground">Browse our list of partner organizations or search for one near you that accepts medication donations.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold">3</div>
            <div>
              <h3 className="font-semibold">Contact & Arrange</h3>
              <p className="text-muted-foreground">Reach out to the chosen charity to confirm their current needs and arrange for drop-off or shipment.</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Partner Charities & Organizations</CardTitle>
          <CardDescription>Find an organization to donate your medications to.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search charities by name or needed items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>
          
          {filteredCharities.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCharities.map((charity) => (
                <Card key={charity.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                       <CardTitle className="text-lg">{charity.name}</CardTitle>
                       <Badge variant={charity.status === "Active" ? "default" : "secondary"}>{charity.status}</Badge>
                    </div>
                    <CardDescription>{charity.address}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-2">
                    <p className="text-sm text-muted-foreground line-clamp-3">{charity.description}</p>
                    {charity.neededItems && charity.neededItems.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold mt-2 mb-1">Currently Needs:</h4>
                        <div className="flex flex-wrap gap-1">
                          {charity.neededItems.map(item => <Badge key={item} variant="outline">{item}</Badge>)}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <div className="p-4 border-t space-y-2">
                     <Button variant="outline" className="w-full justify-start text-left">
                       <Mail className="mr-2 h-4 w-4" /> {charity.email}
                     </Button>
                     {charity.phone && (
                        <Button variant="outline" className="w-full justify-start text-left">
                          <Phone className="mr-2 h-4 w-4" /> {charity.phone}
                        </Button>
                     )}
                     {charity.website && (
                        <a href={charity.website} target="_blank" rel="noopener noreferrer">
                           <Button variant="default" className="w-full">
                             <Globe className="mr-2 h-4 w-4" /> Visit Website
                           </Button>
                        </a>
                     )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
             <p className="text-center text-muted-foreground py-4">No charities found matching your search.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>List Your Organization</CardTitle>
          <CardDescription>If you represent a charity or non-profit that accepts medication donations, please get in touch to be listed (functionality coming soon).</CardDescription>
        </CardHeader>
        <CardContent>
           <p className="text-sm text-muted-foreground">This feature will allow organizations to apply for listing in a future update. For now, please contact us directly via the Contact Us page if you wish to be listed.</p>
        </CardContent>
      </Card>
    </div>
  );
}
