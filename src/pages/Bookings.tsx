import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Settings, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Bookings = () => {
  const [sheetUrl, setSheetUrl] = useState<string>("");
  const [calendarId, setCalendarId] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("user_settings")
      .select("bookings_sheet_url, calendar_id")
      .eq("id", user.id)
      .maybeSingle();

    if (data?.bookings_sheet_url) {
      setSheetUrl(data.bookings_sheet_url);
    }
    if (data?.calendar_id) {
      setCalendarId(data.calendar_id);
    }
  };

  const embedUrl = calendarId
    ? `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(calendarId)}&mode=MONTH&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&showTz=0`
    : "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Bookings</h1>
        <p className="text-muted-foreground mt-1">
          View and manage property bookings
        </p>
      </div>

      {/* Calendar Display */}
      {embedUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Booking Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-muted rounded-lg overflow-hidden" style={{ height: "600px" }}>
              <iframe
                src={embedUrl}
                className="w-full h-full"
                frameBorder="0"
                title="Google Calendar"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bookings Sheet */}
      <Card>
        <CardHeader>
          <CardTitle>Bookings Spreadsheet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sheetUrl ? (
            <>
              <p className="text-sm text-muted-foreground">
                Track your bookings in detail with your spreadsheet. This sheet can be manually synced with your calendar data.
              </p>
              <Button
                onClick={() => window.open(sheetUrl, "_blank")}
                className="gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Open Bookings Sheet
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                No bookings sheet configured yet. Set it up in Settings to track detailed booking information.
              </p>
              <Button
                onClick={() => navigate("/dashboard/settings")}
                variant="outline"
                className="gap-2"
              >
                <Settings className="w-4 h-4" />
                Go to Settings
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {!embedUrl && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-4">
              No calendar configured. Go to Settings to add your Google Calendar ID to view bookings here.
            </p>
            <Button
              onClick={() => navigate("/dashboard/settings")}
              variant="outline"
              className="gap-2"
            >
              <Settings className="w-4 h-4" />
              Configure Calendar
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Bookings;
