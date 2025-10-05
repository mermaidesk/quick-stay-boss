import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Settings, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Contacts = () => {
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
      .select("contacts_sheet_url")
      .eq("id", user.id)
      .maybeSingle();

    if (data?.contacts_sheet_url) {
      setSheetUrl(data.contacts_sheet_url);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Contacts</h1>
        <p className="text-muted-foreground mt-1">
          Manage your property-related contacts
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Contact Directory
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sheetUrl ? (
            <>
              <p className="text-sm text-muted-foreground">
                Your contacts sheet is configured. Click below to open it.
              </p>
              <Button
                onClick={() => window.open(sheetUrl, "_blank")}
                className="gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Open Contacts Sheet
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                No contacts sheet configured yet. Set it up in Settings to manage your property contacts.
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

export default Contacts;
