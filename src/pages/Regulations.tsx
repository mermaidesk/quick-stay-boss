import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Settings, FileCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Regulations = () => {
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
      .select("regulatory_sheet_url")
      .eq("id", user.id)
      .maybeSingle();

    if (data?.regulatory_sheet_url) {
      setSheetUrl(data.regulatory_sheet_url);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Regulations</h1>
        <p className="text-muted-foreground mt-1">
          Track regulatory compliance and permits
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="w-5 h-5" />
            Regulatory Compliance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sheetUrl ? (
            <div className="w-full h-[600px]">
              <iframe
                src={sheetUrl.replace(/\/edit.*/, '/preview')}
                className="w-full h-full border-0 rounded"
                title="Regulations Sheet"
              />
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                No regulatory sheet configured yet. Set it up in Settings to track permits and compliance.
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

export default Regulations;
