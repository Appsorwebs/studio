
"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { addDrugAction, type AddDrugFormState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Add Drug
    </Button>
  );
}

export function AddDrugForm() {
  const initialState: AddDrugFormState | undefined = undefined;
  const [state, formAction] = useFormState(addDrugAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const [manufacturingDate, setManufacturingDate] = useState<Date | undefined>();
  const [expirationDate, setExpirationDate] = useState<Date | undefined>();

  useEffect(() => {
    if (state?.message) {
      toast({
        title: state.isError ? "Error" : "Success",
        description: state.message,
        variant: state.isError ? "destructive" : "default",
      });
      if (!state.isError && state.drug) {
        formRef.current?.reset();
        setManufacturingDate(undefined);
        setExpirationDate(undefined);
      }
    }
  }, [state, toast]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Drug</CardTitle>
        <CardDescription>Fill in the details of the drug to add it to the inventory.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} ref={formRef} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Drug Name</Label>
              <Input id="name" name="name" placeholder="e.g., Amoxicillin" required />
              {state?.fields?.name && <p className="text-sm text-destructive mt-1">{state.fields.name}</p>}
            </div>
            <div>
              <Label htmlFor="dosage">Dosage</Label>
              <Input id="dosage" name="dosage" placeholder="e.g., 250mg" required />
              {state?.fields?.dosage && <p className="text-sm text-destructive mt-1">{state.fields.dosage}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="manufacturer">Manufacturer</Label>
              <Input id="manufacturer" name="manufacturer" placeholder="e.g., Pfizer" required />
              {state?.fields?.manufacturer && <p className="text-sm text-destructive mt-1">{state.fields.manufacturer}</p>}
            </div>
             <div>
              <Label htmlFor="category">Category</Label>
              <Input id="category" name="category" placeholder="e.g., Antibiotic" />
              {state?.fields?.category && <p className="text-sm text-destructive mt-1">{state.fields.category}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" name="quantity" type="number" placeholder="e.g., 100" />
              {state?.fields?.quantity && <p className="text-sm text-destructive mt-1">{state.fields.quantity}</p>}
            </div>
            <div>
              <Label htmlFor="storageConditions">Storage Conditions</Label>
              <Input id="storageConditions" name="storageConditions" placeholder="e.g., Room temperature, cool and dry place" />
              {state?.fields?.storageConditions && <p className="text-sm text-destructive mt-1">{state.fields.storageConditions}</p>}
            </div>
          </div>
                    
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="manufacturingDate">Manufacturing Date</Label>
               <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !manufacturingDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {manufacturingDate ? format(manufacturingDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={manufacturingDate}
                    onSelect={setManufacturingDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Input type="hidden" name="manufacturingDate" value={manufacturingDate ? format(manufacturingDate, "yyyy-MM-dd") : ""} />
              {state?.fields?.manufacturingDate && <p className="text-sm text-destructive mt-1">{state.fields.manufacturingDate}</p>}
            </div>
            
            <div>
              <Label htmlFor="expirationDate">Expiration Date</Label>
               <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !expirationDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expirationDate ? format(expirationDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={expirationDate}
                    onSelect={setExpirationDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Input type="hidden" name="expirationDate" value={expirationDate ? format(expirationDate, "yyyy-MM-dd") : ""} />
              {state?.fields?.expirationDate && <p className="text-sm text-destructive mt-1">{state.fields.expirationDate}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea id="notes" name="notes" placeholder="e.g., Batch number, specific instructions" />
          </div>

          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
