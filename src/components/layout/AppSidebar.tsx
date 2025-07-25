import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Wallet,
  FileText,
  MapPin,
  Settings,
  LogOut,
  Heart,
  Pill,
  UserCheck,
  Building2,
  Shield,
  BarChart3,
  Lock,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/lib/api";

const roleMenus = {
  superadmin: [
    {
      title: "Administration",
      items: [
        { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
        { title: "Gestion Utilisateurs", url: "/admin/users", icon: Users },
        { title: "Gestion Patients", url: "/admin/patients", icon: UserCheck },
        { title: "Gestion Prestataires", url: "/admin/providers", icon: Building2 },
        { title: "Rôles & Permissions", url: "/admin/roles", icon: Shield },
        { title: "Statistiques", url: "/admin/stats", icon: BarChart3 },
      ],
    },
  ],
  admin: [
    {
      title: "Administration",
      items: [
        { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
        { title: "Gestion Utilisateurs", url: "/admin/users", icon: Users },
        { title: "Gestion Patients", url: "/admin/patients", icon: UserCheck },
        { title: "Gestion Prestataires", url: "/admin/providers", icon: Building2 },
        { title: "Statistiques", url: "/admin/stats", icon: BarChart3 },
      ],
    },
  ],
  patient: [
    {
      title: "Mon Compte",
      items: [
        { title: "Dashboard", url: "/patient", icon: LayoutDashboard },
        { title: "Mon Portefeuille", url: "/patient/wallet", icon: Wallet },
        { title: "Ma Carte", url: "/patient/card", icon: CreditCard },
        { title: "Coffre-fort", url: "/patient/vault", icon: Lock },
        { title: "Mes Documents", url: "/patient/documents", icon: FileText },
      ],
    },
    {
      title: "Services",
      items: [
        { title: "Prestataires Proches", url: "/patient/providers", icon: MapPin },
        { title: "Historique", url: "/patient/history", icon: BarChart3 },
      ],
    },
  ],
  provider: [
    {
      title: "Mon Activité",
      items: [
        { title: "Dashboard", url: "/provider", icon: LayoutDashboard },
        { title: "Encaissements", url: "/provider/payments", icon: Wallet },
        { title: "Ma Carte", url: "/provider/card", icon: CreditCard },
        { title: "Mes Patients", url: "/provider/patients", icon: UserCheck },
        { title: "Services", url: "/provider/services", icon: Heart },
      ],
    },
    {
      title: "Gestion",
      items: [
        { title: "Documents", url: "/provider/documents", icon: FileText },
        { title: "Localisation", url: "/provider/location", icon: MapPin },
      ],
    },
  ],
  pharmacy: [
    {
      title: "Mon Activité",
      items: [
        { title: "Dashboard", url: "/pharmacy", icon: LayoutDashboard },
        { title: "Encaissements", url: "/pharmacy/payments", icon: Wallet },
        { title: "Ma Carte", url: "/pharmacy/card", icon: CreditCard },
        { title: "Mes Patients", url: "/pharmacy/patients", icon: UserCheck },
        { title: "Types de Services", url: "/pharmacy/types", icon: Pill },
      ],
    },
    {
      title: "Gestion",
      items: [
        { title: "Documents", url: "/pharmacy/documents", icon: FileText },
        { title: "Localisation", url: "/pharmacy/location", icon: MapPin },
      ],
    },
  ],
};

export function AppSidebar() {
  const { userRole, user, logout } = useAuth();
  const location = useLocation();

  const currentMenus = userRole ? roleMenus[userRole as keyof typeof roleMenus] || [] : [];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-sidebar-foreground">PassPay</h2>
            <p className="text-xs text-sidebar-foreground/70 capitalize">
              {userRole}
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {currentMenus.map((group, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = location.pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link to={item.url}>
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        <SidebarGroup>
          <SidebarGroupLabel>Compte</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/profile">
                    <Settings className="w-4 h-4" />
                    <span>Paramètres</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            {user?.photo ? (
              <img 
                src={user.photo.startsWith('http') ? user.photo : `${BASE_URL}/storage/${user.photo}`}
                alt="Photo de profil"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.name}
              </p>
              <p className="text-xs text-sidebar-foreground/70 truncate">
                {user?.email}
              </p>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start text-destructive border-destructive/50 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}