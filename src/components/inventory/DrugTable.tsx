
"use client";

import { useState, useMemo } from 'react';
import type { Drug } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit3, Trash2, Eye, PackagePlus } from "lucide-react";
import { format, differenceInDays, parseISO } from 'date-fns';
import Link from 'next/link';

const mockDrugs: Drug[] = [
  { id: "1", name: "Amoxicillin", dosage: "250mg", manufacturer: "Pfizer", expirationDate: "2025-12-31", category: "Antibiotic", quantity: 100, status: "Available", listedDate: "2023-01-15", manufacturingDate: "2023-01-01", storageConditions: "Room temperature" },
  { id: "2", name: "Paracetamol", dosage: "500mg", manufacturer: "GSK", expirationDate: "2024-08-15", category: "Analgesic", quantity: 250, status: "Available", listedDate: "2023-02-20", manufacturingDate: "2022-08-01", storageConditions: "Cool, dry place"  },
  { id: "3", name: "Lisinopril", dosage: "10mg", manufacturer: "AstraZeneca", expirationDate: "2024-06-30", category: "Antihypertensive", quantity: 50, status: "Available", listedDate: "2023-03-10", manufacturingDate: "2022-06-01", storageConditions: "Protect from light"  },
  { id: "4", name: "Metformin", dosage: "850mg", manufacturer: "Merck", expirationDate: "2026-01-20", category: "Antidiabetic", quantity: 120, status: "Donated", listedDate: "2023-04-05", manufacturingDate: "2023-01-01", storageConditions: "Room temperature"  },
  { id: "5", name: "Atorvastatin", dosage: "20mg", manufacturer: "Pfizer", expirationDate: "2023-05-01", category: "Cholesterol", quantity: 0, status: "Expired", listedDate: "2022-11-01", manufacturingDate: "2021-05-01", storageConditions: "Room temperature"  },
  { id: "6", name: "Salbutamol Inhaler", dosage: "100mcg", manufacturer: "Cipla", expirationDate: "2024-07-22", category: "Respiratory", quantity: 75, status: "Available", listedDate: "2023-01-25", manufacturingDate: "2023-01-01", storageConditions: "Store below 25°C"  },
];

export function DrugTable() {
  const [drugs, setDrugs] = useState<Drug[]>(mockDrugs);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<Drug['status'] | 'All'>('All');

  const filteredDrugs = useMemo(() => {
    return drugs.filter(drug => 
      (drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       drug.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
       (drug.category && drug.category.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (filterStatus === 'All' || drug.status === filterStatus)
    );
  }, [drugs, searchTerm, filterStatus]);

  const getStatusBadgeVariant = (status: Drug['status'], expirationDate: string) => {
    const daysToExpire = differenceInDays(parseISO(expirationDate), new Date());
    if (status === 'Expired' || daysToExpire < 0) return "destructive";
    if (status === 'Donated') return "default"; 
    if (daysToExpire <= 30) return "secondary"; 
    if (status === 'Pending Prediction') return "outline"; // Kept for type consistency, though AI is removed
    return "default"; 
  };

  const getStatusText = (status: Drug['status'], expirationDate: string) => {
    const daysToExpire = differenceInDays(parseISO(expirationDate), new Date());
    if (status === 'Expired' || daysToExpire < 0) return "Expired";
    if (status === 'Donated') return "Donated";
    if (daysToExpire <= 30) return `Expires in ${daysToExpire} days`;
    if (daysToExpire <= 90) return `Expires in ${Math.round(daysToExpire/30)} months`;
    return status;
  }

  // Mock delete action
  const handleDelete = (drugId: string) => {
    if(confirm("Are you sure you want to delete this drug?")) {
        setDrugs(prev => prev.filter(d => d.id !== drugId));
        // In a real app, call an API to delete
    }
  };


  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <Input 
          placeholder="Search drugs (name, manufacturer, category)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Filter by Status: {filterStatus}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {['All', 'Available', 'Donated', 'Expired', 'Pending Prediction'].map((status) => (
                <DropdownMenuItem key={status} onSelect={() => setFilterStatus(status as Drug['status'] | 'All')}>
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/inventory/add" passHref>
            <Button>
              <PackagePlus className="mr-2 h-4 w-4" /> Add New Drug
            </Button>
          </Link>
        </div>
      </div>
      <Table>
        <TableCaption>A list of managed drugs.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Manufacturer</TableHead>
            <TableHead>Dosage</TableHead>
            <TableHead>Expiration Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDrugs.map((drug) => (
            <TableRow key={drug.id}>
              <TableCell className="font-medium">{drug.name}</TableCell>
              <TableCell className="hidden md:table-cell">{drug.manufacturer}</TableCell>
              <TableCell>{drug.dosage}</TableCell>
              <TableCell>{format(parseISO(drug.expirationDate), "MMM dd, yyyy")}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(drug.status, drug.expirationDate)}>
                  {getStatusText(drug.status, drug.expirationDate)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onSelect={() => alert(`Viewing details for ${drug.name}`)}>
                      <Eye className="mr-2 h-4 w-4" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => alert(`Editing ${drug.name}`)}>
                      <Edit3 className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onSelect={() => handleDelete(drug.id)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {filteredDrugs.length === 0 && (
        <p className="text-center text-muted-foreground py-4">No drugs found matching your criteria.</p>
      )}
    </div>
  );
}
