import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Receipt, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// Helper function for Google Calendar ID
function extractCalendarId(input: string) {
  // If input is an iCal URL, extract the calendar ID (email or group id)
  const icalMatch = input.match(/ical\/([^/]+)\//);
  if (icalMatch && icalMatch[1]) return icalMatch[1];
  // If input is a full embed URL, find src param
  const embedMatch = input.match(/src=([^&]+)/);
  if (embedMatch && embedMatch[1]) return decodeURIComponent(embedMatch[1]);
  // Otherwise, assume it's a direct calendar ID
  return input;
}

const Dashboard = () => {
  const [property, setProperty] = useState<any>(null);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netIncome: 0,
    upcomingBookings: 0,
  });
  const [calendarIdInput, setCalendarIdInput] = useState("");
  const [userSettings, setUserSettings] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadProperty();
    loadStats();
    loadUserSettings();
  }, []);

  const loadProperty = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      console.error("Error loading property:", error);
    } else if (data) {
      setProperty(data);
    }
  };

  const loadUserSettings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("user_settings")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      console.error("Error loading user settings:", error);
    } else if (data) {
      setUserSettings(data);
      setCalendarIdInput(data.calendar_id || "");
    }
  };

  const loadStats = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get property first
    const { data: propertyData } = await supabase
      .from("properties")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!propertyData) return;

    // Load income
    const { data: incomeData } = await supabase
      .from("income")
      .select("net_income")
      .eq("property_id", propertyData.id);

    // Load expenses
    const { data: expenseData } = await supabase
      .from("expenses")
      .select("amount")
      .eq("property_id", propertyData.id);

    // Load upcoming bookings
    const { data: bookingsData } = await supabase
      .from("bookings")
      .select("id")
      .eq("property_id", propertyData.id)
      .gte("check_in_date", new Date().toISOString());

    const totalIncome = incomeData?.reduce((sum, item) => sum + Number(item.net_income), 0) || 0;
    const totalExpenses = expenseData?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;

    setStats({
      totalIncome,
      totalExpenses,
      netIncome: totalIncome - totalExpenses,
      upcomingBookings: bookingsData?.length || 0,
    });
  };

  const handleSaveCalendar = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("user_settings")
      .upsert({
        id: user.id,
        calendar_id: calendarIdInput,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save calendar ID",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Calendar ID saved successfully",
      });
      loadUserSettings();
    }
  };

  // Build the Google Calendar embed URL
  const calendarId = extractCalendarId(userSettings?.calendar_id || "");
  const embedUrl = calendarId
    ? `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(calendarId)}&mode=MONTH&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&showTz=0&ctz=America/New_York`
    : "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome to your property management dashboard
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <DollarSign className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              ${stats.totalIncome.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Year to date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <Receipt className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              ${stats.totalExpenses.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Year to date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ${stats.netIncome.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Year to date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingBookings}</div>
            <p className="text-xs text-muted-foreground mt-1">Next 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Section */}
      <Card>
        <CardHeader>
          <CardTitle>Property Calendar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="calendar-id">Google Calendar ID</Label>
            <div className="flex gap-2">
              <Input
                id="calendar-id"
                placeholder="elliottenter@gmail.com"
                value={calendarIdInput}
                onChange={(e) => setCalendarIdInput(e.target.value)}
              />
              <Button onClick={handleSaveCalendar}>Save</Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Enter your calendar ID (like elliottenter@gmail.com or group calendar address).<br />
              <strong>Do not paste the .ics link.</strong> Find your calendar ID in Google Calendar settings under "Integrate calendar".
            </p>
          </div>

          {embedUrl ? (
            <div className="w-full bg-muted rounded-lg overflow-hidden" style={{ height: "600px" }}>
              <iframe
                src={embedUrl}
                className="w-full h-full"
                frameBorder="0"
                title="Google Calendar"
              />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No calendar to display.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
