import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Building2, 
  Pill, 
  TrendingUp, 
  DollarSign,
  Activity,
  UserPlus,
  Shield,
  BarChart3,
  AlertTriangle
} from "lucide-react";

export const AdminDashboard = () => {
  const { logout } = useAuth();

  // Déconnexion automatique pour test de redirection
  useEffect(() => {
    const timer = setTimeout(() => {
      logout();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [logout]);

  // Données factices pour la démonstration
  const stats = {
    total_users: 1247,
    total_patients: 892,
    total_providers: 156,
    total_pharmacies: 89,
    total_transactions: 5634,
    monthly_volume: 156789.45,
    pending_validations: 12,
    system_status: "operational"
  };

  const recentActivity = [
    { id: 1, type: "user_registration", description: "Nouveau patient inscrit", time: "Il y a 5 min", user: "Marie Dubois" },
    { id: 2, type: "provider_validation", description: "Prestataire en attente", time: "Il y a 15 min", user: "Cabinet Dr. Martin" },
    { id: 3, type: "large_transaction", description: "Transaction importante", time: "Il y a 1h", amount: "2,450.00 €" },
    { id: 4, type: "document_upload", description: "Document téléchargé", time: "Il y a 2h", user: "Pharmacie Centrale" },
  ];

  const pendingValidations = [
    { id: 1, type: "provider", name: "Cabinet Dentaire Sourire", status: "documents_pending" },
    { id: 2, type: "pharmacy", name: "Pharmacie du Centre", status: "approval_pending" },
    { id: 3, type: "document", name: "Agrément médical", status: "review_needed" },
  ];

  return (
    <div className="space-y-6">
      {/* En-tête administrateur */}
      <div className="bg-gradient-hero rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Administration PassPay</h1>
            <p className="text-white/80">
              Tableau de bord de gestion système
            </p>
          </div>
          <div className="hidden md:block">
            <Shield className="w-12 h-12 text-white/60" />
          </div>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Total</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.total_users}</div>
            <p className="text-xs text-muted-foreground">
              +12% ce mois
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volume Mensuel</CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {stats.monthly_volume.toLocaleString()} €
            </div>
            <p className="text-xs text-muted-foreground">
              +8% vs mois précédent
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Activity className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_transactions}</div>
            <p className="text-xs text-muted-foreground">
              Ce mois
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.pending_validations}</div>
            <p className="text-xs text-muted-foreground">
              Validations requises
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Répartition des utilisateurs */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Patients</span>
              <Button size="sm" variant="outline">
                <UserPlus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary mb-2">{stats.total_patients}</div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">Actifs</Badge>
              <span className="text-sm text-muted-foreground">
                {Math.round((stats.total_patients / stats.total_users) * 100)}% du total
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Prestataires</span>
              <Building2 className="h-5 w-5 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary mb-2">{stats.total_providers}</div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-success/10 text-success border-success">
                Certifiés
              </Badge>
              <span className="text-sm text-muted-foreground">
                {Math.round((stats.total_providers / stats.total_users) * 100)}% du total
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Pharmacies</span>
              <Pill className="h-5 w-5 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary mb-2">{stats.total_pharmacies}</div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-success/10 text-success border-success">
                Agréées
              </Badge>
              <span className="text-sm text-muted-foreground">
                {Math.round((stats.total_pharmacies / stats.total_users) * 100)}% du total
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Activité récente */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Activité Récente</span>
              <Button variant="ghost" size="sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                Détails
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'user_registration' ? 'bg-success' :
                    activity.type === 'provider_validation' ? 'bg-warning' :
                    activity.type === 'large_transaction' ? 'bg-primary' : 'bg-secondary'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{activity.description}</div>
                    <div className="text-xs text-muted-foreground">
                      {activity.user || activity.amount} • {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Validations en attente */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Validations en Attente</span>
              <Badge variant="outline" className="bg-warning/10 text-warning border-warning">
                {pendingValidations.length} en attente
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingValidations.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      item.type === 'provider' ? 'bg-primary' :
                      item.type === 'pharmacy' ? 'bg-success' : 'bg-secondary'
                    }`} />
                    <div>
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {item.type} • {item.status.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Examiner
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};