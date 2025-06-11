
"use client";

import { useState, useMemo } from "react";
import type { Drug } from "@/types";
import { allMockDrugs } from "@/lib/mock-data"; // Import centralized mock data
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search as SearchIcon, ListFilter, Package, BriefcaseMedical, CalendarClock } from "lucide-react";
import { format, parseISO, differenceInDays } from "date-fns";
import { DrugDetailsDialog } from '@/components/inventory/DrugDetailsDialog';

const drugCategories = ["All", "Antibiotic", "Analgesic", "Antihypertensive", "Antidiabetic", "PPI", "Cholesterol", "Respiratory", "Analgesic/Antiplatelet"];

export function DrugSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [expirationFilter, setExpirationFilter] = useState("All"); 

  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const filteredDrugs = useMemo(() => {
    let results = allMockDrugs; // Use centralized mock data

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
        if (!drug.expirationDate) return false;
        const expDate = parseISO(drug.expirationDate);
        const daysLeft = differenceInDays(expDate, today);
        if (expirationFilter === "Soon (90d)") return daysLeft > 0 && daysLeft <= 90;
        if (expirationFilter === "Soon (30d)") return daysLeft > 0 && daysLeft <= 30;
        if (expirationFilter === "Very Soon (7d)") return daysLeft > 0 && daysLeft <= 7;
        return true;
      });
    }

    return results.filter(drug => drug.status === "Available" || drug.status === "Donated");
  }, [searchTerm, categoryFilter, expirationFilter]);
  
  const getDaysToExpireElement = (expirationDate?: string) => {
    if (!expirationDate) return <Badge variant="outline">N/A</Badge>;
    const days = differenceInDays(parseISO(expirationDate), new Date());
    if (days < 0) return <Badge variant="destructive">Expired</Badge>;
    if (days <= 7) return <Badge variant="destructive">{days} days left</Badge>;
    if (days <= 30) return <Badge variant="secondary">{days} days left</Badge>; 
    return <span>{format(parseISO(expirationDate), "MMM dd, yyyy")}</span>;
  };

  const handleViewDetails = (drug: Drug) => {
    setSelectedDrug(drug);
    setIsDetailsDialogOpen(true);
  };

  return (
    <>
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
                  <Button className="w-full" variant="outline" onClick={() => handleViewDetails(drug)}>View Details / Request</Button>
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
      <DrugDetailsDialog 
        drug={selectedDrug} 
        isOpen={isDetailsDialogOpen} 
        onOpenChange={setIsDetailsDialogOpen} 
      />
    </>
  );
}
