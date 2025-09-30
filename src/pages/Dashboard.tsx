import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Receipt, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [property, setProperty] = useState<any>(null);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netIncome: 0,
    upcomingBookings: 0,
  });
  const [calendarUrl, setCalendarUrl] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadProperty();
    loadStats();
  }, []);

  const loadProperty = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error loading property:", error);
    } else if (data) {
      setProperty(data);
      setCalendarUrl(data.google_calendar_id || "");
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
    if (!property) {
      // Create property if it doesn't exist
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("properties").insert({
        user_id: user.id,
        property_name: "My Property",
        google_calendar_id: calendarUrl,
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to save calendar URL",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Calendar URL saved successfully",
        });
        loadProperty();
      }
    } else {
      const { error } = await supabase
        .from("properties")
        .update({ google_calendar_id: calendarUrl })
        .eq("id", property.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to save calendar URL",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Calendar URL saved successfully",
        });
      }
    }
  };

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
            <Label htmlFor="calendar-url">Google Calendar iCal URL</Label>
            <div className="flex gap-2">
              <Input
                id="calendar-url"
                placeholder="Paste your Google Calendar iCal URL here"
                value={calendarUrl}
                onChange={(e) => setCalendarUrl(e.target.value)}
              />
              <Button onClick={handleSaveCalendar}>Save</Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Get your calendar's iCal URL from Google Calendar settings
            </p>
          </div>

          {property?.google_calendar_id && (
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <iframe
                src={`https://calendar.google.com/calendar/embed?src=${encodeURIComponent(
                  property.google_calendar_id
                )}&mode=AGENDA`}
                className="w-full h-full rounded-lg"
                frameBorder="0"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
