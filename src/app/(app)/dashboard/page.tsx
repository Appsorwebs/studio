
"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Package, Clock, Users, AlertTriangle } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { BarChart, LineChart, PieChart, Bar, Line, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend as RechartsLegend } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";


interface ExpiringDrugData {
  name: string;
  count: number;
  fill: string;
}

interface InventoryByCategoryData {
  name: string;
  value: number;
  fill: string;
}

interface DonationTrendData {
  month: string;
  donations: number;
  received: number;
}

interface SummaryStats {
    totalDrugsListed: number;
    totalDrugsListedChange: string;
    expiringSoonCount: number;
    expiringSoonMessage: string;
    activeUsers: number;
    activeUsersChange: string;
    donationsFacilitated: number;
    donationsFacilitatedMessage: string;
}

interface DashboardData {
  expiringDrugsData: ExpiringDrugData[];
  inventoryByCategoryData: InventoryByCategoryData[];
  donationTrendData: DonationTrendData[];
  summaryStats: SummaryStats;
}

const chartConfig = {
  count: { label: "Count", color: "hsl(var(--chart-1))" },
  value: { label: "Value", color: "hsl(var(--chart-1))" },
  donations: { label: "Donations", color: "hsl(var(--chart-1))" },
  received: { label: "Received", color: "hsl(var(--chart-2))" },
};

const initialDashboardData: DashboardData = {
    expiringDrugsData: [],
    inventoryByCategoryData: [],
    donationTrendData: [],
    summaryStats: {
        totalDrugsListed: 0,
        totalDrugsListedChange: "",
        expiringSoonCount: 0,
        expiringSoonMessage: "",
        activeUsers: 0,
        activeUsersChange: "",
        donationsFacilitated: 0,
        donationsFacilitatedMessage: "",
    }
};


export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData>(initialDashboardData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/dashboard');
        if (!response.ok) {
          throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
        }
        const data: DashboardData = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        console.error("Error fetching dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-[120px]" />)}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[380px]" />
          <Skeleton className="h-[380px]" />
        </div>
        <Skeleton className="h-[430px]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 text-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
        <p className="text-destructive">Could not load dashboard data: {error}</p>
      </div>
    );
  }
  
  const { expiringDrugsData, inventoryByCategoryData, donationTrendData, summaryStats } = dashboardData;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Drugs Listed</CardTitle>
            <Package className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.totalDrugsListed.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{summaryStats.totalDrugsListedChange}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon (30 days)</CardTitle>
            <Clock className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{summaryStats.expiringSoonCount}</div>
            <p className="text-xs text-muted-foreground">{summaryStats.expiringSoonMessage}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{summaryStats.activeUsersChange}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Donations Facilitated</CardTitle>
            <Package className="h-5 w-5 text-muted-foreground" /> {/* Changed Icon to Package to match previous state */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.donationsFacilitated}</div>
            <p className="text-xs text-muted-foreground">{summaryStats.donationsFacilitatedMessage}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Drugs Expiring Soon</CardTitle>
            <CardDescription>Count of drugs by expiration window</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expiringDrugsData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                     {expiringDrugsData.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                      ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory by Category</CardTitle>
            <CardDescription>Distribution of drugs across categories</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
             <ChartContainer config={chartConfig} className="h-[300px] w-full aspect-square">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                  <Pie data={inventoryByCategoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {inventoryByCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Donation Trends</CardTitle>
          <CardDescription>Monthly donations listed vs. received by charities</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={donationTrendData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                <Line type="monotone" dataKey="donations" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="received" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
                <ChartLegend content={<ChartLegendContent />} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
