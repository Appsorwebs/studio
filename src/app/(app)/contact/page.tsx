
import { ContactForm } from "@/components/contact/ContactForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container mx-auto py-8 space-y-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">Contact Rxpiration Alert</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We're here to help! Whether you have a question about our platform, need support, or want to share feedback, feel free to reach out.
        </p>
      </section>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="text-center">
          <CardHeader>
            <Mail className="mx-auto h-10 w-10 text-primary mb-2" />
            <CardTitle>Email Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">For general inquiries & support:</p>
            <a href="mailto:admin@appsorwebs.com" className="text-primary hover:underline">admin@appsorwebs.com</a>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardHeader>
            <Phone className="mx-auto h-10 w-10 text-primary mb-2" />
            <CardTitle>Call Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Our support line is open Mon-Fri, 9am-5pm EST:</p>
            <a href="tel:+2348090775252" className="text-primary hover:underline">+234 809 077 5252</a>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardHeader>
            <MapPin className="mx-auto h-10 w-10 text-primary mb-2" />
            <CardTitle>Our Office</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Rxpiration Alert HQ</p>
            <p>Suit C33 Danziyal Plaza, Central Business Area, Abuja.</p>
          </CardContent>
        </Card>
      </div>
      
      <ContactForm />
    </div>
  );
}
