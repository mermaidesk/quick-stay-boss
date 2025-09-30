import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Receipt as ReceiptIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const IRS_CATEGORIES = [
  "Advertising",
  "Auto/Travel",
  "Cleaning & Maintenance",
  "Commissions",
  "Insurance",
  "Legal/Professional Fees",
  "Management Fees",
  "Mortgage Interest",
  "Repairs",
  "Supplies",
  "Taxes & Licenses",
  "Utilities",
  "Other",
];

const Expenses = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [property, setProperty] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [formData, setFormData] = useState({
    expense_date: "",
    vendor: "",
    description: "",
    category: "",
    amount: 0,
    receipt_link: "",
    notes: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    loadProperty();
  }, []);

  useEffect(() => {
    if (property) {
      loadExpenses();
    }
  }, [property]);

  const loadProperty = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("properties")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setProperty(data);
    }
  };

  const loadExpenses = async () => {
    const { data } = await supabase
      .from("expenses")
      .select("*")
      .eq("property_id", property.id)
      .order("expense_date", { ascending: false });

    if (data) {
      setExpenses(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from("expenses").insert({
      ...formData,
      property_id: property.id,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add expense",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Expense added successfully",
      });
      setOpen(false);
      loadExpenses();
      setFormData({
        expense_date: "",
        vendor: "",
        description: "",
        category: "",
        amount: 0,
        receipt_link: "",
        notes: "",
      });
    }
  };

  const filteredExpenses = expenses.filter((expense) =>
    filter ? expense.category === filter : true
  );

  const totalExpenses = filteredExpenses.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Expenses</h1>
          <p className="text-muted-foreground mt-1">Track your property expenses</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Expense</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expense_date">Date</Label>
                  <Input
                    id="expense_date"
                    type="date"
                    value={formData.expense_date}
                    onChange={(e) =>
                      setFormData({ ...formData, expense_date: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendor">Vendor/Payee</Label>
                  <Input
                    id="vendor"
                    value={formData.vendor}
                    onChange={(e) =>
                      setFormData({ ...formData, vendor: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {IRS_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: parseFloat(e.target.value) })
                    }
                    required
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="receipt_link">Receipt Link</Label>
                  <Input
                    id="receipt_link"
                    value={formData.receipt_link}
                    onChange={(e) =>
                      setFormData({ ...formData, receipt_link: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Expense</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ReceiptIcon className="w-5 h-5 text-destructive" />
            Total: ${totalExpenses.toFixed(2)}
          </CardTitle>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {IRS_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Receipt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{expense.expense_date}</TableCell>
                  <TableCell>{expense.vendor}</TableCell>
                  <TableCell>{expense.description || "-"}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell className="font-medium">
                    ${Number(expense.amount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {expense.receipt_link ? (
                      <a
                        href={expense.receipt_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        View
                      </a>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Expenses;
