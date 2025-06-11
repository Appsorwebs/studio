
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
  status?: 'Available' | 'Donated' | 'Expired';
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
  userId: string; // Firebase Auth User ID will be the primary identifier
  firstName: string;
  lastName: string;
  email: string; 
  pharmacyName: string; // This also serves as the username
  nigeriaPhoneNumber: string;
  pharmacyAddress: string;
  profilePictureUrl?: string;
  socialMediaLinks?: (string | undefined)[]; 
  websiteLink?: string;
  subscriptionStatus: 'Trial Active' | 'Active' | 'Inactive' | 'Pending Payment' | 'Cancelled';
  subscriptionTier: 'Monthly' | 'Yearly' | 'None' | 'N/A';
  subscriptionId?: string; 
  nextBillingDate?: string; // ISO string or Date
  memberSince: string; // ISO string or Date
  trialEndDate: string; // ISO string or Date
  paymentLinks?: {
    monthly: string;
    yearly: string;
  };
}
