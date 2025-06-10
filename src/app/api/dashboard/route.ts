
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock data, in a real app this would come from a database
const mockDashboardData = {
  expiringDrugsData: [
    { name: "Next 30 Days", count: 15, fill: "hsl(var(--chart-1))" },
    { name: "Next 60 Days", count: 25, fill: "hsl(var(--chart-2))" },
    { name: "Next 90 Days", count: 10, fill: "hsl(var(--chart-3))" },
  ],
  inventoryByCategoryData: [
    { name: "Analgesics", value: 400, fill: "hsl(var(--chart-1))" },
    { name: "Antibiotics", value: 300, fill: "hsl(var(--chart-2))" },
    { name: "Antivirals", value: 200, fill: "hsl(var(--chart-3))" },
    { name: "Vitamins", value: 280, fill: "hsl(var(--chart-4))" },
    { name: "Others", value: 150, fill: "hsl(var(--chart-5))" },
  ],
  donationTrendData: [
    { month: "Jan", donations: 50, received: 30 },
    { month: "Feb", donations: 60, received: 45 },
    { month: "Mar", donations: 75, received: 50 },
    { month: "Apr", donations: 90, received: 65 },
    { month: "May", donations: 80, received: 55 },
    { month: "Jun", donations: 100, received: 70 },
  ],
  summaryStats: {
    totalDrugsListed: 1234,
    totalDrugsListedChange: "+5% from last month",
    expiringSoonCount: 78,
    expiringSoonMessage: "Urgent attention needed",
    activeUsers: 245,
    activeUsersChange: "+12 since last week",
    donationsFacilitated: 56,
    donationsFacilitatedMessage: "Items donated this quarter",
  }
};

export async function GET(request: NextRequest) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return NextResponse.json(mockDashboardData, { status: 200 });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json({ message: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
