
import type { Drug } from "@/types";
import { differenceInDays, parseISO } from 'date-fns';

export const getStatusBasedOnExpiration = (expirationDateStr?: string): Drug['status'] => {
    if (!expirationDateStr) return 'Available';
    const expirationDate = parseISO(expirationDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to the start of the day for consistent comparison
    
    const daysToExpire = differenceInDays(expirationDate, today);

    if (daysToExpire < 0) return "Expired";
    // Example: if a drug expires "today", daysToExpire will be 0. It's still "Available" until end of day.
    // Modify as needed for different status logic, e.g. for "Donated" or near-expiry warnings.
    return "Available";
};

export const allMockDrugs: Drug[] = [
  { 
    id: "1", 
    name: "Amoxicillin Trihydrate", 
    dosage: "250mg Capsules", 
    manufacturer: "Pfizer Global", 
    expirationDate: "2025-12-31", 
    category: "Antibiotic", 
    quantity: 100, 
    listedDate: "2023-01-15", 
    manufacturingDate: "2023-01-01", 
    storageConditions: "Store below 25°C, protect from moisture.",
    notes: "Broad-spectrum penicillin antibiotic.",
    status: getStatusBasedOnExpiration("2025-12-31") 
  },
  { 
    id: "2", 
    name: "Paracetamol Tablets", 
    dosage: "500mg", 
    manufacturer: "GSK Consumer Healthcare", 
    expirationDate: "2024-08-15", 
    category: "Analgesic", 
    quantity: 250, 
    listedDate: "2023-02-20", 
    manufacturingDate: "2022-08-01", 
    storageConditions: "Store in a cool, dry place.",
    notes: "For relief of mild to moderate pain and fever.",
    status: getStatusBasedOnExpiration("2024-08-15")  
  },
  { 
    id: "3", 
    name: "Lisinopril Dihydrate", 
    dosage: "10mg Tablets", 
    manufacturer: "AstraZeneca PLC", 
    expirationDate: "2024-06-30", 
    category: "Antihypertensive", 
    quantity: 50, 
    listedDate: "2023-03-10", 
    manufacturingDate: "2022-06-01", 
    storageConditions: "Protect from light and moisture.",
    notes: "ACE inhibitor for high blood pressure.",
    status: getStatusBasedOnExpiration("2024-06-30")  
  },
  { 
    id: "4", 
    name: "Metformin Hydrochloride", 
    dosage: "850mg Tablets", 
    manufacturer: "Merck & Co.", 
    expirationDate: "2026-01-20", 
    category: "Antidiabetic", 
    quantity: 120, 
    listedDate: "2023-04-05", 
    manufacturingDate: "2023-01-01", 
    storageConditions: "Store at room temperature.",
    notes: "Oral medication for type 2 diabetes.",
    status: 'Donated' // Manually set for variety
  },
  { 
    id: "5", 
    name: "Atorvastatin Calcium", 
    dosage: "20mg Tablets", 
    manufacturer: "Pfizer Global", 
    expirationDate: "2023-05-01", // Expired
    category: "Cholesterol", 
    quantity: 0, // Expired items might have 0 quantity
    listedDate: "2022-11-01", 
    manufacturingDate: "2021-05-01", 
    storageConditions: "Store below 30°C.",
    notes: "Used to lower cholesterol.",
    status: getStatusBasedOnExpiration("2023-05-01")  
  },
  { 
    id: "6", 
    name: "Salbutamol Sulfate Inhaler", 
    dosage: "100mcg/actuation", 
    manufacturer: "Cipla Ltd.", 
    expirationDate: "2024-07-22", 
    category: "Respiratory", 
    quantity: 75, 
    listedDate: "2023-01-25", 
    manufacturingDate: "2023-01-01", 
    storageConditions: "Store below 25°C, away from direct sunlight.",
    notes: "Bronchodilator for asthma and COPD.",
    status: getStatusBasedOnExpiration("2024-07-22")  
  },
  { 
    id: "7", 
    name: "Aspirin Enteric Coated", 
    dosage: "81mg Tablets", 
    manufacturer: "Bayer AG", 
    expirationDate: "2024-09-01", 
    category: "Analgesic/Antiplatelet", 
    quantity: 300, 
    listedDate: "2023-05-01", 
    manufacturingDate: "2023-02-01", 
    storageConditions: "Keep in a dry place.",
    notes: "Low-dose aspirin for cardiovascular protection.",
    status: getStatusBasedOnExpiration("2024-09-01") 
  },
  { 
    id: "8", 
    name: "Omeprazole Magnesium", 
    dosage: "20mg Capsules", 
    manufacturer: "Generic Pharma Co.", 
    expirationDate: "2025-03-10", 
    category: "PPI", 
    quantity: 150, 
    listedDate: "2023-06-15", 
    manufacturingDate: "2023-03-01", 
    storageConditions: "Store in a cool, dry place, protect from light.",
    notes: "Proton pump inhibitor for acid reflux.",
    status: getStatusBasedOnExpiration("2025-03-10") 
  },
  { 
    id: "9", 
    name: "Simvastatin Tablets", 
    dosage: "40mg", 
    manufacturer: "Pharma Dynamics Inc.", 
    expirationDate: "2023-07-01", // Expired
    category: "Cholesterol", 
    quantity: 0, 
    listedDate: "2022-10-01", 
    manufacturingDate: "2022-04-01", 
    storageConditions: "Store at controlled room temperature.",
    notes: "Lipid-lowering agent.",
    status: getStatusBasedOnExpiration("2023-07-01") 
  },
];
