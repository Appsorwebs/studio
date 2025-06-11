
"use server";

import { z } from "zod";
import type { Drug } from "@/types";

const DrugSchema = z.object({
  name: z.string().min(1, "Drug name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  expirationDate: z.string().min(1, "Expiration date is required"), 
  category: z.string().optional(),
  quantity: z.coerce.number().min(0, "Quantity must be non-negative").optional(),
  storageConditions: z.string().optional(),
  manufacturingDate: z.string().optional(), // YYYY-MM-DD format
  notes: z.string().optional(),
});

export type AddDrugFormState = {
  message: string;
  fields?: Record<string, string>;
  drug?: Drug;
  isError: boolean;
};

// This is a mock function. In a real app, this would interact with a database.
async function saveDrugToDatabase(drugData: Omit<Drug, 'id' | 'listedDate'>): Promise<Drug> {
  console.log("Saving drug to database (mock):", drugData);
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate DB call
  return {
    id: Math.random().toString(36).substr(2, 9),
    ...drugData,
    listedDate: new Date().toISOString(),
    status: drugData.status || 'Available', // Default status
  };
}


export async function addDrugAction(
  prevState: AddDrugFormState | undefined,
  formData: FormData
): Promise<AddDrugFormState> {
  
  const drugData = {
    name: formData.get("name") as string,
    dosage: formData.get("dosage") as string,
    manufacturer: formData.get("manufacturer") as string,
    expirationDate: formData.get("expirationDate") as string | undefined,
    category: formData.get("category") as string | undefined,
    quantity: formData.get("quantity") ? Number(formData.get("quantity")) : undefined,
    storageConditions: formData.get("storageConditions") as string | undefined,
    manufacturingDate: formData.get("manufacturingDate") as string | undefined,
    notes: formData.get("notes") as string | undefined,
  };

  const validatedFields = DrugSchema.safeParse(drugData);

  if (!validatedFields.success) {
    return {
      message: "Invalid form data.",
      fields: validatedFields.error.flatten().fieldErrors as Record<string, string>,
      isError: true,
    };
  }
  
  if (!validatedFields.data.expirationDate) {
    return {
       message: "Expiration date is required.",
       fields: { expirationDate: "Expiration date is required" },
       isError: true,
     };
  }

  const finalDrugData: Omit<Drug, 'id' | 'listedDate'> = { ...validatedFields.data, status: 'Available' };

  try {
    const savedDrug = await saveDrugToDatabase(finalDrugData);
    return {
      message: `Drug "${savedDrug.name}" added successfully.`,
      drug: savedDrug,
      isError: false,
    };
  } catch (error) {
    console.error("Database save error:", error);
    return {
      message: "Failed to save drug to the database.",
      isError: true,
    };
  }
}
