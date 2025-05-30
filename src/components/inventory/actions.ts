
"use server";

import { z } from "zod";
import type { Drug } from "@/types";
import { predictExpirationDate } from "@/ai/flows/predict-expiration-date";

const DrugSchema = z.object({
  name: z.string().min(1, "Drug name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  expirationDate: z.string().optional(), // Can be predicted
  category: z.string().optional(),
  quantity: z.coerce.number().min(0, "Quantity must be non-negative").optional(),
  storageConditions: z.string().optional(),
  manufacturingDate: z.string().optional(), // YYYY-MM-DD format
  notes: z.string().optional(),
  predictExpiry: z.boolean().optional(),
});

export type AddDrugFormState = {
  message: string;
  fields?: Record<string, string>;
  drug?: Drug;
  prediction?: {
    predictedExpirationDate: string;
    confidenceLevel: string;
    reasoning: string;
  };
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
    status: drugData.status || 'Available',
  };
}


export async function addDrugAction(
  prevState: AddDrugFormState | undefined,
  formData: FormData
): Promise<AddDrugFormState> {
  const predictExpiry = formData.get("predictExpiry") === "on";
  
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
    predictExpiry: predictExpiry,
  };

  const validatedFields = DrugSchema.safeParse(drugData);

  if (!validatedFields.success) {
    return {
      message: "Invalid form data.",
      fields: validatedFields.error.flatten().fieldErrors as Record<string, string>,
      isError: true,
    };
  }

  const { predictExpiry: shouldPredict, ...dataToSave } = validatedFields.data;

  let finalDrugData: Omit<Drug, 'id' | 'listedDate'> = { ...dataToSave, status: 'Available' };
  let predictionResult;

  if (shouldPredict) {
    if (!dataToSave.manufacturingDate || !dataToSave.storageConditions) {
      return {
        message: "Manufacturing date and storage conditions are required for AI prediction.",
        fields: {
          ...( !dataToSave.manufacturingDate && { manufacturingDate: "Required for prediction" }),
          ...( !dataToSave.storageConditions && { storageConditions: "Required for prediction" }),
        },
        isError: true,
      };
    }
    try {
      predictionResult = await predictExpirationDate({
        drugName: dataToSave.name,
        dosage: dataToSave.dosage,
        manufacturer: dataToSave.manufacturer,
        storageConditions: dataToSave.storageConditions,
        manufacturingDate: dataToSave.manufacturingDate, // Assuming YYYY-MM-DD string
        additionalNotes: dataToSave.notes,
      });
      
      finalDrugData.expirationDate = predictionResult.predictedExpirationDate; // Use AI predicted date
      finalDrugData.aiPredictedExpirationDate = predictionResult.predictedExpirationDate;
      finalDrugData.status = 'Pending Prediction'; // Or 'Available with AI date'

    } catch (error) {
      console.error("AI Prediction Error:", error);
      return {
        message: "AI prediction failed. Please try again or enter manually.",
        isError: true,
      };
    }
  } else if (!dataToSave.expirationDate) {
     return {
        message: "Expiration date is required if not using AI prediction.",
        fields: { expirationDate: "Expiration date is required" },
        isError: true,
      };
  }


  try {
    const savedDrug = await saveDrugToDatabase(finalDrugData);
    return {
      message: `Drug "${savedDrug.name}" added successfully. ${predictionResult ? 'AI prediction completed.' : ''}`,
      drug: savedDrug,
      ...(predictionResult && { prediction: predictionResult }),
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
