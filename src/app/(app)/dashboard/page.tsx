
"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Package, Clock, Users, AlertTriangle } from "lucide-react"; // Corrected: Removed BarChart, LineChart, PieChart
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { BarChart, LineChart, PieChart, Bar, Line, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend as RechartsLegend } from "recharts"; // Corrected: Added BarChart, LineChart, PieChart

const expiringDrugsData = [
  { name: "Next 30 Days", count: 15, fill: "hsl(var(--chart-1))" },
  { name: "Next 60 Days", count: 25, fill: "hsl(var(--chart-2))" },
  { name: "Next 90 Days", count: 10, fill: "hsl(var(--chart-3))" },
];

const inventoryByCategoryData = [
  { name: "Analgesics", value: 400, fill: "hsl(var(--chart-1))" },
  { name: "Antibiotics", value: 300, fill: "hsl(var(--chart-2))" },
  { name: "Antivirals", value: 200, fill: "hsl(var(--chart-3))" },
  { name: "Vitamins", value: 280, fill: "hsl(var(--chart-4))" },
  { name: "Others", value: 150, fill: "hsl(var(--chart-5))" },
];

const donationTrendData = [
  { month: "Jan", donations: 50, received: 30 },
  { month: "Feb", donations: 60, received: 45 },
  { month: "Mar", donations: 75, received: 50 },
  { month: "Apr", donations: 90, received: 65 },
  { month: "May", donations: 80, received: 55 },
  { month: "Jun", donations: 100, received: 70 },
];

const chartConfig = {
  count: { label: "Count", color: "hsl(var(--chart-1))" },
  value: { label: "Value", color: "hsl(var(--chart-1))" },
  donations: { label: "Donations", color: "hsl(var(--chart-1))" },
  received: { label: "Received", color: "hsl(var(--chart-2))" },
};

export default function DashboardPage() {
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
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon (30 days)</CardTitle>
            <Clock className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">78</div>
            <p className="text-xs text-muted-foreground">Urgent attention needed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground">+12 since last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Donations Facilitated</CardTitle>
            <AlertTriangle className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">56</div>
            <p className="text-xs text-muted-foreground">Items donated this quarter</p>
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
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} />
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
