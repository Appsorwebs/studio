
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
  status?: 'Available' | 'Donated' | 'Expired'; // Removed 'Pending Prediction'
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
  status: 'Active' | 'Inactive'; 
  neededItems?: string[];
}

export interface PharmacistProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string; 
  pharmacyName: string; 
  nigeriaPhoneNumber: string;
  pharmacyAddress: string;
  profilePictureUrl?: string;
  socialMediaLinks?: (string | undefined)[]; 
  websiteLink?: string;
  subscriptionStatus: 'Trial Active' | 'Active' | 'Inactive' | 'Pending Payment' | 'Cancelled'; // Added 'Trial Active'
  subscriptionTier: 'Monthly' | 'Yearly' | 'None' | 'N/A'; // Added 'N/A' for trial
  subscriptionId?: string; 
  nextBillingDate?: string; 
  memberSince: string; 
  trialEndDate?: string; // ISO string or Date
  paymentLinks?: { // For reference, actual payment handled by Paystack links
    monthly: string;
    yearly: string;
  };
}
