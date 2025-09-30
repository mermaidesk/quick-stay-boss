import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Building2 } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Building2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Property Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your short-term rental with ease
          </p>
        </div>

        <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
          <SupabaseAuth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "hsl(217 91% 60%)",
                    brandAccent: "hsl(217 91% 50%)",
                  },
                },
              },
              className: {
                container: "w-full",
                button: "w-full px-4 py-2 rounded-md",
                input: "w-full px-3 py-2 rounded-md",
              },
            }}
            providers={["google"]}
            redirectTo={`${window.location.origin}/dashboard`}
            onlyThirdPartyProviders={false}
          />
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Your data is secure and only accessible by you
        </p>
      </div>
    </div>
  );
};

export default Auth;
