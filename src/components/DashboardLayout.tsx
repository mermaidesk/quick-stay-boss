import { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard,
  DollarSign,
  Receipt,
  Wrench,
  FileCheck,
  Users,
  CheckSquare,
  Calendar,
  FileText,
  Mail,
  LogOut,
  Menu,
  X,
  Building2,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Income", href: "/dashboard/income", icon: DollarSign },
  { name: "Expenses", href: "/dashboard/expenses", icon: Receipt },
  { name: "Bookings", href: "/dashboard/bookings", icon: Calendar },
  { name: "Maintenance", href: "/dashboard/maintenance", icon: Wrench },
  { name: "Regulations", href: "/dashboard/regulations", icon: FileCheck },
  { name: "Contacts", href: "/dashboard/contacts", icon: Users },
  { name: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
  { name: "Documentation", href: "/dashboard/documentation", icon: FileText },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");
  const [businessName, setBusinessName] = useState<string>("Property PMS");
  const [logoUrl, setLogoUrl] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUserEmail(session.user.email || "");
        loadBusinessSettings(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUserEmail(session.user.email || "");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadBusinessSettings = async (userId: string) => {
    const { data } = await supabase
      .from("user_settings")
      .select("business_name, logo_url")
      .eq("id", userId)
      .maybeSingle();

    if (data) {
      setBusinessName(data.business_name || "Property PMS");
      setLogoUrl(data.logo_url || "");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    });
  };

  const handleEmailClick = () => {
    window.open("https://mail.google.com/mail/?view=cm&fs=1", "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar-background transition-all duration-300 border-r border-sidebar-border",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        {/* Logo & Toggle */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-8 h-8 object-contain" />
              ) : (
                <Building2 className="w-6 h-6 text-sidebar-primary" />
              )}
              <span className="font-semibold text-sidebar-foreground">
                {businessName}
              </span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 font-medium",
                      !sidebarOpen && "justify-center px-2",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                        : "bg-sidebar-accent/50 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                    onClick={() => navigate(item.href)}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && <span>{item.name}</span>}
                  </Button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Quick Actions */}
        <div className="border-t border-sidebar-border p-4 space-y-2">
          <Button
            variant="outline"
            className={cn(
              "w-full gap-2 border-sidebar-border bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-accent/80 hover:text-sidebar-foreground",
              !sidebarOpen && "justify-center px-2"
            )}
            onClick={handleEmailClick}
          >
            <Mail className="w-5 h-5 flex-shrink-0 text-sidebar-foreground" />
            {sidebarOpen && <span className="text-sidebar-foreground">Compose Email</span>}
          </Button>
          <Button
            variant="outline"
            className={cn(
              "w-full gap-2 border-sidebar-border bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-accent/80 hover:text-sidebar-foreground",
              !sidebarOpen && "justify-center px-2"
            )}
            onClick={handleSignOut}
          >
            <LogOut className="w-5 h-5 flex-shrink-0 text-sidebar-foreground" />
            {sidebarOpen && <span className="text-sidebar-foreground">Sign Out</span>}
          </Button>
        </div>

        {/* User Info */}
        {sidebarOpen && userEmail && (
          <div className="border-t border-sidebar-border p-4">
            <p className="text-xs text-sidebar-foreground/60 truncate">
              {userEmail}
            </p>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div
        className={cn(
          "transition-all duration-300",
          sidebarOpen ? "ml-64" : "ml-20"
        )}
      >
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
