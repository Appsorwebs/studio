
"use client";

import type { Drug } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, parseISO, differenceInDays } from "date-fns";
import { Package, Edit, CalendarDays, Tag, FileText, Thermometer, AlertTriangle, CheckCircle, Archive } from "lucide-react";

interface DrugDetailsDialogProps {
  drug: Drug | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function DrugDetailsDialog({ drug, isOpen, onOpenChange }: DrugDetailsDialogProps) {
  if (!drug) return null;

  const getStatusInfo = (status?: Drug['status'], expirationDate?: string) => {
    let text = status || "N/A";
    let variant: "default" | "secondary" | "destructive" | "outline" = "default";
    let Icon = Package;

    if (expirationDate) {
        const daysToExpire = differenceInDays(parseISO(expirationDate), new Date());
        if (daysToExpire < 0) {
            text = "Expired";
            variant = "destructive";
            Icon = AlertTriangle;
        } else if (status === 'Donated') {
            text = "Donated";
            variant = "default";
            Icon = Archive;
        } else if (daysToExpire <= 30) {
            text = `Expires in ${daysToExpire} days`;
            variant = "secondary"; // Often yellow/orange in themes
        } else if (daysToExpire <= 90) {
            text = `Expires in ~${Math.round(daysToExpire / 30)} months`;
            variant = "outline";
        } else if (status === 'Available') {
            text = "Available";
            Icon = CheckCircle;
        }
    } else if (status === 'Available') {
        Icon = CheckCircle;
    } else if (status === 'Donated') {
        Icon = Archive;
    }


    return { text, variant, Icon };
  };
  
  const statusInfo = getStatusInfo(drug.status, drug.expirationDate);

  const detailItem = (Icon: React.ElementType, label: string, value?: string | number | null) => (
    value ? (
      <div className="flex items-start space-x-3">
        <Icon className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-md text-foreground">{String(value)}</p>
        </div>
      </div>
    ) : null
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center">
            <Package className="mr-2 h-6 w-6 text-primary" /> {drug.name}
          </DialogTitle>
          <DialogDescription>
            {drug.dosage} - by {drug.manufacturer}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
            <div className="grid gap-4 py-4">
                <div className="flex items-center space-x-2">
                    <statusInfo.Icon className={`h-5 w-5 text-${statusInfo.variant === 'destructive' ? 'destructive' : 'primary'}`} />
                    <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>
                </div>

                {detailItem(Tag, "Category", drug.category)}
                {detailItem(Package, "Quantity", drug.quantity)}
                
                {drug.manufacturingDate && detailItem(CalendarDays, "Manufacturing Date", format(parseISO(drug.manufacturingDate), "PPP"))}
                {drug.expirationDate && detailItem(CalendarDays, "Expiration Date", format(parseISO(drug.expirationDate), "PPP"))}
                {drug.listedDate && detailItem(CalendarDays, "Date Listed", format(parseISO(drug.listedDate), "PPP"))}
                
                {detailItem(Thermometer, "Storage Conditions", drug.storageConditions)}
                {detailItem(FileText, "Additional Notes", drug.notes)}
            </div>
        </ScrollArea>
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button disabled onClick={() => alert("Edit functionality coming soon.")}>
            <Edit className="mr-2 h-4 w-4" /> Edit Drug
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
