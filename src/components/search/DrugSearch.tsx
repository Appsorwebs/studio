
"use client";

import { useState, useMemo } from "react";
import type { Drug } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search as SearchIcon, ListFilter, Package, BriefcaseMedical, CalendarClock } from "lucide-react";
import { format, parseISO, differenceInDays } from "date-fns";

const mockDrugs: Drug[] = [
  { id: "1", name: "Amoxicillin", dosage: "250mg", manufacturer: "Pfizer", expirationDate: "2025-12-31", category: "Antibiotic", quantity: 100, status: "Available", listedDate: "2023-01-15" },
  { id: "2", name: "Paracetamol", dosage: "500mg", manufacturer: "GSK", expirationDate: "2024-08-15", category: "Analgesic", quantity: 250, status: "Available", listedDate: "2023-02-20"  },
  { id: "3", name: "Lisinopril", dosage: "10mg", manufacturer: "AstraZeneca", expirationDate: "2024-06-30", category: "Antihypertensive", quantity: 50, status: "Available", listedDate: "2023-03-10" },
  { id: "4", name: "Metformin", dosage: "850mg", manufacturer: "Merck", expirationDate: "2026-01-20", category: "Antidiabetic", quantity: 120, status: "Donated", listedDate: "2023-04-05" },
  { id: "5", name: "Aspirin", dosage: "81mg", manufacturer: "Bayer", expirationDate: "2024-09-01", category: "Analgesic", quantity: 300, status: "Available", listedDate: "2023-05-01" },
  { id: "6", name: "Omeprazole", dosage: "20mg", manufacturer: "Generic Co.", expirationDate: "2025-03-10", category: "PPI", quantity: 150, status: "Available", listedDate: "2023-06-15" },
  { id: "7", name: "Simvastatin", dosage: "40mg", manufacturer: "Pharma Inc.", expirationDate: "2023-07-01", category: "Cholesterol", quantity: 0, status: "Expired", listedDate: "2022-10-01" },
];

const drugCategories = ["All", "Antibiotic", "Analgesic", "Antihypertensive", "Antidiabetic", "PPI", "Cholesterol", "Respiratory"];

export function DrugSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [expirationFilter, setExpirationFilter] = useState("All"); // "All", "Soon (30d)", "Very Soon (7d)"

  const filteredDrugs = useMemo(() => {
    let results = mockDrugs;

    if (searchTerm) {
      results = results.filter(drug =>
        drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drug.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "All") {
      results = results.filter(drug => drug.category === categoryFilter);
    }
    
    if (expirationFilter !== "All") {
      const today = new Date();
      results = results.filter(drug => {
        const expDate = parseISO(drug.expirationDate);
        const daysLeft = differenceInDays(expDate, today);
        if (expirationFilter === "Soon (90d)") return daysLeft > 0 && daysLeft <= 90;
        if (expirationFilter === "Soon (30d)") return daysLeft > 0 && daysLeft <= 30;
        if (expirationFilter === "Very Soon (7d)") return daysLeft > 0 && daysLeft <= 7;
        return true;
      });
    }


    return results.filter(drug => drug.status === "Available" || drug.status === "Donated"); // Only show available or donated
  }, [searchTerm, categoryFilter, expirationFilter]);
  
  const getDaysToExpireElement = (expirationDate: string) => {
    const days = differenceInDays(parseISO(expirationDate), new Date());
    if (days < 0) return <Badge variant="destructive">Expired</Badge>;
    if (days <= 7) return <Badge variant="destructive">{days} days left</Badge>;
    if (days <= 30) return <Badge variant="secondary">{days} days left</Badge>;
    return <span>{format(parseISO(expirationDate), "MMM dd, yyyy")}</span>;
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Find Medications</CardTitle>
          <CardDescription>Search for available drugs by name, category, or expiration status.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by drug name or manufacturer..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="ghost" className="md:hidden">
              <ListFilter className="mr-2 h-4 w-4" /> Filters
            </Button>
          </div>
          <div className="hidden md:flex flex-col md:flex-row gap-4">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {drugCategories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={expirationFilter} onValueChange={setExpirationFilter}>
              <SelectTrigger className="w-full md:w-[220px]">
                <SelectValue placeholder="Filter by expiration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Expirations</SelectItem>
                <SelectItem value="Soon (90d)">Expiring in 90 days</SelectItem>
                <SelectItem value="Soon (30d)">Expiring in 30 days</SelectItem>
                <SelectItem value="Very Soon (7d)">Expiring in 7 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {filteredDrugs.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDrugs.map((drug) => (
            <Card key={drug.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">{drug.name} <Badge variant={drug.status === 'Donated' ? 'default' : 'outline'}>{drug.status}</Badge></CardTitle>
                <CardDescription>{drug.dosage} - {drug.manufacturer}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Package className="mr-2 h-4 w-4" /> Category: {drug.category || "N/A"}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                   <CalendarClock className="mr-2 h-4 w-4" /> Expires: {getDaysToExpireElement(drug.expirationDate)}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                   <BriefcaseMedical className="mr-2 h-4 w-4" /> Quantity: {drug.quantity ?? 'N/A'}
                </div>
              </CardContent>
              <div className="p-4 border-t">
                <Button className="w-full" variant="outline">View Details / Request</Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <SearchIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-xl font-semibold">No Drugs Found</h3>
            <p className="mt-2 text-muted-foreground">
              Try adjusting your search terms or filters.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
