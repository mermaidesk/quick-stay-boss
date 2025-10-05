import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ExternalLink, Receipt, FileSpreadsheet, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Expenses = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [expenseFormUrl, setExpenseFormUrl] = useState("");
  const [expenseSheetUrl, setExpenseSheetUrl] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("user_settings")
        .select("expense_form_url, expense_sheet_url")
        .eq("id", user.id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        setExpenseFormUrl(data.expense_form_url || "");
        setExpenseSheetUrl(data.expense_sheet_url || "");
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = () => {
    if (!expenseFormUrl) {
      toast({
        title: "Setup Required",
        description: "Please configure your Expense Form URL in Settings",
        variant: "destructive",
      });
      navigate("/dashboard/settings");
      return;
    }
    window.open(expenseFormUrl, "_blank");
  };

  const handleOpenSheet = () => {
    if (!expenseSheetUrl) {
      toast({
        title: "Setup Required",
        description: "Please configure your Expense Sheet URL in Settings",
        variant: "destructive",
      });
      navigate("/dashboard/settings");
      return;
    }
    window.open(expenseSheetUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const isConfigured = expenseFormUrl || expenseSheetUrl;

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Expense Tracking</h1>
        <p className="text-muted-foreground">
          Track and manage all property expenses
        </p>
      </div>

      {!isConfigured && (
        <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Settings className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                Setup Required
              </h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
                Configure your Google Sheets and Forms links to get started.
              </p>
              <Button
                size="sm"
                onClick={() => navigate("/dashboard/settings")}
                className="gap-2"
              >
                <Settings className="w-4 h-4" />
                Go to Settings
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Receipt className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">Submit Expense</h2>
              <p className="text-sm text-muted-foreground">
                Add a new expense with receipt upload using Google Form
              </p>
            </div>
          </div>
          <Button 
            onClick={handleOpenForm} 
            className="w-full gap-2"
            disabled={!expenseFormUrl}
          >
            <Receipt className="w-4 h-4" />
            Open Expense Form
            <ExternalLink className="w-4 h-4 ml-auto" />
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            📱 Perfect for mobile: Quickly snap and upload receipts on-the-go
          </p>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 rounded-lg bg-green-500/10">
              <FileSpreadsheet className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">View & Edit</h2>
              <p className="text-sm text-muted-foreground">
                Open your expense spreadsheet to view, edit, or manually add entries
              </p>
            </div>
          </div>
          <Button 
            onClick={handleOpenSheet}
            variant="outline"
            className="w-full gap-2"
            disabled={!expenseSheetUrl}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Open Expense Sheet
            <ExternalLink className="w-4 h-4 ml-auto" />
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            💻 Best on desktop/tablet: Full spreadsheet editing capability
          </p>
        </div>
      </div>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Quick Tips:</h3>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Use the form when you need to upload a receipt photo</li>
          <li>Open the sheet directly to manually add or edit expenses without receipts</li>
          <li>Form responses automatically appear in your "Form Responses" sheet tab</li>
          <li>Use the "Expenses" tab for manual entries and organization</li>
        </ul>
      </div>
    </div>
  );
};

export default Expenses;
