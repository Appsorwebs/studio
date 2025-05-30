
export interface Drug {
  id: string;
  name: string;
  dosage: string;
  manufacturer: string;
  expirationDate: string; // ISO string or Date
  category?: string;
  quantity?: number;
  storageConditions?: string;
  manufacturingDate?: string; // ISO string or Date
  listedDate?: string; // ISO string or Date
  status?: 'Available' | 'Donated' | 'Expired' | 'Pending Prediction';
  aiPredictedExpirationDate?: string;
  notes?: string;
}

export interface Charity {
  id:string;
  name: string;
  contactPerson: string;
  email: string;
  phone?: string;
  address: string;
  website?: string;
  description: string;
  status: 'Active' | 'Inactive'; // Or other relevant statuses
}

export interface PredictionRequest {
  drugName: string;
  dosage: string;
  manufacturer: string;
  storageConditions: string;
  manufacturingDate: string; // YYYY-MM-DD
  additionalNotes?: string;
}

export interface PredictionResult {
  predictedExpirationDate: string; // YYYY-MM-DD or similar
  confidenceLevel: string; // e.g., High, Moderate, Low
  reasoning: string;
}
