
import { DrugTable } from "@/components/inventory/DrugTable";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Drug Inventory Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Drug List</CardTitle>
          <CardDescription>View, manage, and update your drug inventory.</CardDescription>
        </CardHeader>
        <CardContent>
          <DrugTable />
        </CardContent>
      </Card>
    </div>
  );
}
