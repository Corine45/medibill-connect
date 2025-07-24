import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Wallet, 
  CreditCard, 
  TrendingUp, 
  MapPin, 
  Lock,
  Plus,
  Eye,
  ArrowUpRight,
  Heart,
  Activity
} from "lucide-react";

export const PatientDashboard = () => {
  const { user } = useAuth();

  // Données factices pour la démonstration
  const walletData = {
    solde_total: 1250.75,
    solde_disponible: 980.50,
    solde_reserve: 270.25,
  };

  const recentTransactions = [
    { id: 1, description: "Consultation Dr. Martin", montant: -45.00, date: "2024-01-20", statut: "completed" },
    { id: 2, description: "Recharge portefeuille", montant: 100.00, date: "2024-01-18", statut: "completed" },
    { id: 3, description: "Pharmacie Centrale", montant: -25.30, date: "2024-01-15", statut: "completed" },
  ];

  const vaults = [
    { id: 1, nom: "Urgences Médicales", montant_actuel: 150.00, objectif: 500.00 },
    { id: 2, nom: "Soins Dentaires", montant_actuel: 75.50, objectif: 300.00 },
  ];

  return (
    <div className="space-y-6">
      {/* En-tête de bienvenue */}
      <div className="bg-gradient-primary rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Bonjour, {user?.name}!</h1>
            <p className="text-white/80">
              Gérez votre santé et vos paiements en toute simplicité
            </p>
          </div>
          <div className="hidden md:block">
            <Activity className="w-12 h-12 text-white/60" />
          </div>
        </div>
      </div>

      {/* Aperçu du portefeuille */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solde Total</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {walletData.solde_total.toFixed(2)} €
            </div>
            <p className="text-xs text-muted-foreground">
              Disponible: {walletData.solde_disponible.toFixed(2)} €
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Épargne Santé</CardTitle>
            <Lock className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {walletData.solde_reserve.toFixed(2)} €
            </div>
            <p className="text-xs text-muted-foreground">
              Dans {vaults.length} coffres-forts
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carte Virtuelle</CardTitle>
            <CreditCard className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge variant="outline" className="bg-success/10 text-success border-success">
                Active
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Limite journalière: 200 €
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Actions rapides */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
            <CardDescription>
              Accédez rapidement à vos fonctionnalités principales
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Button className="justify-start h-auto p-4 bg-gradient-primary hover:opacity-90">
              <Plus className="mr-3 h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Recharger mon portefeuille</div>
                <div className="text-sm text-white/80">Ajouter des fonds</div>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto p-4">
              <MapPin className="mr-3 h-5 w-5 text-primary" />
              <div className="text-left">
                <div className="font-medium">Trouver un prestataire</div>
                <div className="text-sm text-muted-foreground">À proximité</div>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto p-4">
              <Eye className="mr-3 h-5 w-5 text-primary" />
              <div className="text-left">
                <div className="font-medium">Voir ma carte</div>
                <div className="text-sm text-muted-foreground">Détails et paramètres</div>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Coffres-forts d'épargne */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Mes Coffres-forts</span>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau
              </Button>
            </CardTitle>
            <CardDescription>
              Épargnez pour vos futurs soins de santé
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {vaults.map((vault) => {
              const progress = (vault.montant_actuel / vault.objectif) * 100;
              return (
                <div key={vault.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">{vault.nom}</span>
                    <span className="text-sm text-muted-foreground">
                      {vault.montant_actuel}€ / {vault.objectif}€
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Transactions récentes */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Transactions Récentes</span>
            <Button variant="ghost" size="sm">
              Voir tout
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    transaction.montant > 0 ? 'bg-success' : 'bg-primary'
                  }`} />
                  <div>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-sm text-muted-foreground">{transaction.date}</div>
                  </div>
                </div>
                <div className={`font-medium ${
                  transaction.montant > 0 ? 'text-success' : 'text-primary'
                }`}>
                  {transaction.montant > 0 ? '+' : ''}{transaction.montant.toFixed(2)} €
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};