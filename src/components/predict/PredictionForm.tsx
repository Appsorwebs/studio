
"use client";

import { useState, useRef, useEffect } from 'react';
import { useFormStatus } from "react-dom";
import { predictExpirationDate, type PredictExpirationDateInput, type PredictExpirationDateOutput } from '@/ai/flows/predict-expiration-date';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, CheckCircle, AlertTriangle, Wand2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
      Predict Expiration
    </Button>
  );
}

export function PredictionForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictExpirationDateOutput | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const [manufacturingDate, setManufacturingDate] = useState<Date | undefined>();

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);
    setResult(null);

    const inputData: PredictExpirationDateInput = {
      drugName: formData.get("drugName") as string,
      dosage: formData.get("dosage") as string,
      manufacturer: formData.get("manufacturer") as string,
      storageConditions: formData.get("storageConditions") as string,
      manufacturingDate: formData.get("manufacturingDate") as string, // This will be formatted from the state
      additionalNotes: formData.get("additionalNotes") as string | undefined,
    };
    
    // Basic validation
    if (!inputData.drugName || !inputData.dosage || !inputData.manufacturer || !inputData.storageConditions || !inputData.manufacturingDate) {
      setError("Please fill in all required fields for prediction.");
      setIsLoading(false);
      toast({ title: "Missing Fields", description: "All fields marked with * are required.", variant: "destructive"});
      return;
    }

    try {
      const prediction = await predictExpirationDate(inputData);
      setResult(prediction);
      toast({ title: "Prediction Successful", description: `Predicted expiration: ${prediction.predictedExpirationDate}`, variant: "default"});
      // formRef.current?.reset(); // Optionally reset form
      // setManufacturingDate(undefined);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred during prediction.";
      setError(errorMessage);
      toast({ title: "Prediction Failed", description: errorMessage, variant: "destructive"});
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>AI Expiration Prediction</CardTitle>
        <CardDescription>Enter drug details to predict its expiration date using AI.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} ref={formRef} className="space-y-4">
          <div>
            <Label htmlFor="drugName">Drug Name *</Label>
            <Input id="drugName" name="drugName" placeholder="e.g., Atorvastatin" required />
          </div>
          <div>
            <Label htmlFor="dosage">Dosage *</Label>
            <Input id="dosage" name="dosage" placeholder="e.g., 40mg" required />
          </div>
          <div>
            <Label htmlFor="manufacturer">Manufacturer *</Label>
            <Input id="manufacturer" name="manufacturer" placeholder="e.g., Sun Pharma" required />
          </div>
          <div>
            <Label htmlFor="storageConditions">Storage Conditions *</Label>
            <Input id="storageConditions" name="storageConditions" placeholder="e.g., Cool, dry place, protected from light" required />
          </div>
          <div>
            <Label htmlFor="manufacturingDate">Manufacturing Date *</Label>
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
                  disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                />
              </PopoverContent>
            </Popover>
            <Input type="hidden" name="manufacturingDate" value={manufacturingDate ? format(manufacturingDate, "yyyy-MM-dd") : ""} />
          </div>
          <div>
            <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
            <Textarea id="additionalNotes" name="additionalNotes" placeholder="e.g., Batch number, observed changes" />
          </div>
          <SubmitButton />
        </form>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <Alert variant="default" className="mt-4 bg-accent/30">
            <CheckCircle className="h-4 w-4 text-accent-foreground" />
            <AlertTitle className="font-headline">Prediction Result</AlertTitle>
            <AlertDescription>
              <p><strong>Predicted Expiration Date:</strong> {result.predictedExpirationDate}</p>
              <p><strong>Confidence Level:</strong> {result.confidenceLevel}</p>
              <p><strong>Reasoning:</strong> {result.reasoning}</p>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

