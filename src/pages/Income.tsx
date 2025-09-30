import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, DollarSign } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";

const Income = () => {
  const [incomes, setIncomes] = useState<any[]>([]);
  const [property, setProperty] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    booking_date: "",
    guest_name: "",
    source: "",
    check_in_date: "",
    check_out_date: "",
    nights: 0,
    gross_income: 0,
    fees: 0,
    net_income: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    loadProperty();
  }, []);

  useEffect(() => {
    if (property) {
      loadIncomes();
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

  const loadIncomes = async () => {
    const { data } = await supabase
      .from("income")
      .select("*")
      .eq("property_id", property.id)
      .order("booking_date", { ascending: false });

    if (data) {
      setIncomes(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from("income").insert({
      ...formData,
      property_id: property.id,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add income record",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Income record added successfully",
      });
      setOpen(false);
      loadIncomes();
      setFormData({
        booking_date: "",
        guest_name: "",
        source: "",
        check_in_date: "",
        check_out_date: "",
        nights: 0,
        gross_income: 0,
        fees: 0,
        net_income: 0,
      });
    }
  };

  const totalIncome = incomes.reduce((sum, item) => sum + Number(item.net_income), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Income</h1>
          <p className="text-muted-foreground mt-1">Track your rental income</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Income
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Income Record</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="booking_date">Booking Date</Label>
                  <Input
                    id="booking_date"
                    type="date"
                    value={formData.booking_date}
                    onChange={(e) =>
                      setFormData({ ...formData, booking_date: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guest_name">Guest Name</Label>
                  <Input
                    id="guest_name"
                    value={formData.guest_name}
                    onChange={(e) =>
                      setFormData({ ...formData, guest_name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <Input
                    id="source"
                    placeholder="Airbnb, VRBO, Direct, etc."
                    value={formData.source}
                    onChange={(e) =>
                      setFormData({ ...formData, source: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nights">Nights</Label>
                  <Input
                    id="nights"
                    type="number"
                    value={formData.nights}
                    onChange={(e) =>
                      setFormData({ ...formData, nights: parseInt(e.target.value) })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="check_in_date">Check-In Date</Label>
                  <Input
                    id="check_in_date"
                    type="date"
                    value={formData.check_in_date}
                    onChange={(e) =>
                      setFormData({ ...formData, check_in_date: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="check_out_date">Check-Out Date</Label>
                  <Input
                    id="check_out_date"
                    type="date"
                    value={formData.check_out_date}
                    onChange={(e) =>
                      setFormData({ ...formData, check_out_date: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gross_income">Gross Income</Label>
                  <Input
                    id="gross_income"
                    type="number"
                    step="0.01"
                    value={formData.gross_income}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        gross_income: parseFloat(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fees">Fees</Label>
                  <Input
                    id="fees"
                    type="number"
                    step="0.01"
                    value={formData.fees}
                    onChange={(e) =>
                      setFormData({ ...formData, fees: parseFloat(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="net_income">Net Income</Label>
                  <Input
                    id="net_income"
                    type="number"
                    step="0.01"
                    value={formData.net_income}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        net_income: parseFloat(e.target.value),
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Income</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-accent" />
            Total Net Income: ${totalIncome.toFixed(2)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Check-In</TableHead>
                <TableHead>Check-Out</TableHead>
                <TableHead>Nights</TableHead>
                <TableHead>Gross</TableHead>
                <TableHead>Fees</TableHead>
                <TableHead>Net</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incomes.map((income) => (
                <TableRow key={income.id}>
                  <TableCell>{income.booking_date}</TableCell>
                  <TableCell>{income.guest_name || "-"}</TableCell>
                  <TableCell>{income.source || "-"}</TableCell>
                  <TableCell>{income.check_in_date}</TableCell>
                  <TableCell>{income.check_out_date}</TableCell>
                  <TableCell>{income.nights}</TableCell>
                  <TableCell>${Number(income.gross_income).toFixed(2)}</TableCell>
                  <TableCell>${Number(income.fees).toFixed(2)}</TableCell>
                  <TableCell className="font-medium text-accent">
                    ${Number(income.net_income).toFixed(2)}
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

export default Income;
