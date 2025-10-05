import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Settings, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Maintenance = () => {
  const [sheetUrl, setSheetUrl] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("user_settings")
      .select("maintenance_sheet_url")
      .eq("id", user.id)
      .maybeSingle();

    if (data?.maintenance_sheet_url) {
      setSheetUrl(data.maintenance_sheet_url);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Maintenance</h1>
        <p className="text-muted-foreground mt-1">
          Track and manage property maintenance
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5" />
            Maintenance Log
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sheetUrl ? (
            <>
              <p className="text-sm text-muted-foreground">
                Your maintenance tracking sheet is configured. Click below to open it.
              </p>
              <Button
                onClick={() => window.open(sheetUrl, "_blank")}
                className="gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Open Maintenance Sheet
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                No maintenance sheet configured yet. Set it up in Settings to track your property maintenance.
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
    </div>
  );
};

export default Maintenance;
