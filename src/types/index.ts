
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
  neededItems?: string[];
}

export interface PharmacistProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string; // Ensure this is unique
  pharmacyName: string; // Will serve as username, ensure unique
  nigeriaPhoneNumber: string;
  pharmacyAddress: string;
  profilePictureUrl?: string;
  socialMediaLinks?: (string | undefined)[]; // Array of up to 5 links
  websiteLink?: string;
  subscriptionStatus: 'active' | 'inactive' | 'pending_payment' | 'cancelled' | 'trial';
  subscriptionTier: 'monthly' | 'yearly' | 'none';
  subscriptionId?: string; // From Paystack/Flutterwave
  nextBillingDate?: string; // ISO string or Date
  memberSince: string; // ISO string or Date
  // Potentially other fields like pharmacist registration number, verification status etc.
}
