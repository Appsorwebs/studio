
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { allMockDrugs } from '@/lib/mock-data'; // Centralized mock data
import type { Drug } from '@/types';

export async function GET(request: NextRequest) {
  try {
    // In a real application, you would fetch this data from a database.
    // For now, we return the mock data.
    const drugs: Drug[] = allMockDrugs;
    // Simulate a slight delay as if fetching from a DB
    await new Promise(resolve => setTimeout(resolve, 300));
    return NextResponse.json(drugs);
  } catch (error) {
    console.error("Failed to fetch drugs:", error);
    return NextResponse.json({ message: "Failed to fetch drug data" }, { status: 500 });
  }
}
