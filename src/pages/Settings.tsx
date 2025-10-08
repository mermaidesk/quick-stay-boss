import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save, ExternalLink } from "lucide-react";

const Settings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    business_name: "",
    logo_url: "",
    expense_form_url: "",
    expense_sheet_url: "",
    income_sheet_url: "",
    maintenance_sheet_url: "",
    bookings_sheet_url: "",
    contacts_sheet_url: "",
    regulatory_sheet_url: "",
    documentation_sheet_url: "",
    calendar_id: "",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("id", user.id)
        .single();

      // Debug logging
      if (error) {
        console.log("Supabase error code:", error.code);
      }

      if (error && error.code === "PGRST116") {
        // No row found for this user: treat as blank, don't show error
        setSettings({
          business_name: "",
          logo_url: "",
          expense_form_url: "",
          expense_sheet_url: "",
          income_sheet_url: "",
          maintenance_sheet_url: "",
          bookings_sheet_url: "",
          contacts_sheet_url: "",
          regulatory_sheet_url: "",
          documentation_sheet_url: "",
          calendar_id: "",
        });
        setLoading(false);
        return;
      }

      if (error) {
        // Only log/toast for real errors (not PGRST116)
        console.error("Error loading settings:", error);
        toast({
          title: "Error",
          description: "Failed to load settings",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (data) {
        setSettings({
          business_name: data.business_name || "",
          logo_url: data.logo_url || "",
          expense_form_url: data.expense_form_url || "",
          expense_sheet_url: data.expense_sheet_url || "",
          income_sheet_url: data.income_sheet_url || "",
          maintenance_sheet_url: data.maintenance_sheet_url || "",
          bookings_sheet_url: data.bookings_sheet_url || "",
          contacts_sheet_url: data.contacts_sheet_url || "",
          regulatory_sheet_url: data.regulatory_sheet_url || "",
          documentation_sheet_url: data.documentation_sheet_url || "",
          calendar_id: data.calendar_id || "",
        });
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("user_settings")
        .upsert({
          id: user.id,
          ...settings,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Settings saved successfully",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Configure your Google Sheets, Forms, and Calendar links
        </p>
      </div>

      <div className="bg-card rounded-lg border p-6 space-y-6">
        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Quick Setup Guide:
          </h3>
          <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
            <li>Create your Google Sheet with tabs for each category</li>
            <li>Create Google Forms for data entry (optional)</li>
            <li>Copy the URLs and paste them below</li>
            <li>For calendar, use the Calendar ID (not the .ics link)</li>
            <li>Click Save to store your links</li>
          </ol>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="business_name">Business Name</Label>
            <Input
              id="business_name"
              placeholder="My Property Business"
              value={settings.business_name}
              onChange={(e) => handleChange("business_name", e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              This will be displayed in the sidebar
            </p>
          </div>

          <div>
            <Label htmlFor="logo_url">Logo URL (optional)</Label>
            <Input
              id="logo_url"
              placeholder="https://example.com/logo.png"
              value={settings.logo_url}
              onChange={(e) => handleChange("logo_url", e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter a URL to your business logo image
            </p>
          </div>

          <div>
            <Label htmlFor="expense_form_url">Expense Form URL</Label>
            <Input
              id="expense_form_url"
              placeholder="https://docs.google.com/forms/d/..."
              value={settings.expense_form_url}
              onChange={(e) => handleChange("expense_form_url", e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Google Form for submitting expenses with receipts
            </p>
          </div>

          <div>
            <Label htmlFor="expense_sheet_url">Expense Sheet URL</Label>
            <Input
              id="expense_sheet_url"
              placeholder="https://docs.google.com/spreadsheets/d/..."
              value={settings.expense_sheet_url}
              onChange={(e) => handleChange("expense_sheet_url", e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Direct link to your Expenses sheet tab
            </p>
          </div>

          <div>
            <Label htmlFor="income_sheet_url">Income Sheet URL</Label>
            <Input
              id="income_sheet_url"
              placeholder="https://docs.google.com/spreadsheets/d/..."
              value={settings.income_sheet_url}
              onChange={(e) => handleChange("income_sheet_url", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="maintenance_sheet_url">Maintenance Sheet URL</Label>
            <Input
              id="maintenance_sheet_url"
              placeholder="https://docs.google.com/spreadsheets/d/..."
              value={settings.maintenance_sheet_url}
              onChange={(e) => handleChange("maintenance_sheet_url", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="bookings_sheet_url">Bookings/Calendar Sheet URL</Label>
            <Input
              id="bookings_sheet_url"
              placeholder="https://docs.google.com/spreadsheets/d/..."
              value={settings.bookings_sheet_url}
              onChange={(e) => handleChange("bookings_sheet_url", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="contacts_sheet_url">Contacts Sheet URL</Label>
            <Input
              id="contacts_sheet_url"
              placeholder="https://docs.google.com/spreadsheets/d/..."
              value={settings.contacts_sheet_url}
              onChange={(e) => handleChange("contacts_sheet_url", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="regulatory_sheet_url">Regulatory Sheet URL</Label>
            <Input
              id="regulatory_sheet_url"
              placeholder="https://docs.google.com/spreadsheets/d/..."
              value={settings.regulatory_sheet_url}
              onChange={(e) => handleChange("regulatory_sheet_url", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="documentation_sheet_url">Documentation/Notes Sheet URL</Label>
            <Input
              id="documentation_sheet_url"
              placeholder="https://docs.google.com/spreadsheets/d/..."
              value={settings.documentation_sheet_url}
              onChange={(e) => handleChange("documentation_sheet_url", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="calendar_id">Google Calendar ID</Label>
            <Input
              id="calendar_id"
              placeholder="elliottenter@gmail.com"
              value={settings.calendar_id}
              onChange={(e) => handleChange("calendar_id", e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter your Google Calendar ID (usually your Gmail address, not the .ics link). Example: <br />
              <span className="font-mono text-xs">elliottenter@gmail.com</span>
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button onClick={saveSettings} disabled={saving} className="gap-2">
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>

      <div className="mt-6 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <ExternalLink className="w-4 h-4" />
          Need Help?
        </h3>
        <p className="text-sm text-muted-foreground">
          To get a sheet URL: Open your Google Sheet → Click "Share" → Copy link
          <br />
          To get a form URL: Open your Google Form → Click "Send" → Copy link
          <br />
          To get your Calendar ID: Open Google Calendar → Settings → "Integrate calendar" → Copy the "Calendar ID" (not the iCal address)
        </p>
      </div>
    </div>
  );
};

export default Settings;
