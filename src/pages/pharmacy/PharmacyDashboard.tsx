import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { 
  DollarSign, 
  CreditCard, 
  Users, 
  Package, 
  TrendingUp,
  MapPin,
  Plus,
  Eye,
  Pill,
  Activity,
  ShoppingCart
} from "lucide-react";

export const PharmacyDashboard = () => {
  const { user } = useAuth();

  // Données factices pour la démonstration
  const stats = {
    monthly_revenue: 8750.45,
    total_customers: 156,
    pending_payments: 680.20,
    prescriptions_today: 23,
    card_status: "active",
    avg_sale: 28.50
  };

  const recentSales = [
    { id: 1, customer: "Patient P-001", items: "Doliprane, Vitamine D", montant: 15.80, date: "2024-01-20", statut: "encaissé" },
    { id: 2, customer: "Patient P-045", items: "Antibiotique sur ordonnance", montant: 42.30, date: "2024-01-20", statut: "encaissé" },
    { id: 3, customer: "Patient P-123", items: "Paracétamol, Spray nasal", montant: 12.60, date: "2024-01-19", statut: "en_attente" },
  ];

  const popularProducts = [
    { name: "Paracétamol 1g", sales: 45, category: "Antalgique" },
    { name: "Amoxicilline", sales: 32, category: "Antibiotique" },
    { name: "Vitamine D", sales: 28, category: "Complément" },
    { name: "Doliprane", sales: 25, category: "Antalgique" },
  ];

  const prescriptionsQueue = [
    { id: 1, patient: "Marie D.", doctor: "Dr. Martin", status: "en_preparation", time: "09:30" },
    { id: 2, patient: "Jean L.", doctor: "Dr. Dubois", status: "prete", time: "10:15" },
    { id: 3, patient: "Sophie K.", doctor: "Dr. Bernard", status: "en_attente", time: "11:00" },
  ];

  return (
    <div className="space-y-6">
      {/* En-tête pharmacie */}
      <div className="bg-gradient-primary rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Pharmacie Centrale</h1>
            <p className="text-white/80">
              Gérez vos ventes et ordonnances
            </p>
          </div>
          <div className="hidden md:block">
            <Pill className="w-12 h-12 text-white/60" />
          </div>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus du Mois</CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {stats.monthly_revenue.toFixed(2)} €
            </div>
            <p className="text-xs text-muted-foreground">
              +12% vs mois précédent
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients Actifs</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.total_customers}</div>
            <p className="text-xs text-muted-foreground">
              +5 nouveaux cette semaine
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <TrendingUp className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {stats.pending_payments.toFixed(2)} €
            </div>
            <p className="text-xs text-muted-foreground">
              Paiements à encaisser
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ordonnances</CardTitle>
            <Package className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.prescriptions_today}</div>
            <p className="text-xs text-muted-foreground">
              Traitées aujourd'hui
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
              <ShoppingCart className="mr-3 h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Nouvelle vente</div>
                <div className="text-sm text-white/80">Encaisser un achat</div>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto p-4">
              <Eye className="mr-3 h-5 w-5 text-primary" />
              <div className="text-left">
                <div className="font-medium">Voir ma carte</div>
                <div className="text-sm text-muted-foreground">Carte professionnelle</div>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto p-4">
              <Package className="mr-3 h-5 w-5 text-primary" />
              <div className="text-left">
                <div className="font-medium">Gérer stock</div>
                <div className="text-sm text-muted-foreground">Produits et services</div>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* File d'attente des ordonnances */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Ordonnances en Cours</span>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                {prescriptionsQueue.length} en file
              </Badge>
            </CardTitle>
            <CardDescription>
              Ordonnances à préparer et à délivrer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {prescriptionsQueue.map((prescription) => (
              <div key={prescription.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    prescription.status === 'prete' ? 'bg-success' :
                    prescription.status === 'en_preparation' ? 'bg-warning' : 'bg-muted-foreground'
                  }`} />
                  <div>
                    <div className="font-medium text-sm">{prescription.patient}</div>
                    <div className="text-xs text-muted-foreground">
                      {prescription.doctor} • {prescription.time}
                    </div>
                  </div>
                </div>
                <Badge variant={
                  prescription.status === 'prete' ? 'default' :
                  prescription.status === 'en_preparation' ? 'secondary' : 'outline'
                }>
                  {prescription.status.replace('_', ' ')}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Produits populaires */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Produits Populaires</CardTitle>
            <CardDescription>Les médicaments les plus vendus ce mois</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {popularProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-medium text-sm">{product.name}</div>
                    <div className="text-xs text-muted-foreground">{product.category}</div>
                  </div>
                </div>
                <div className="text-sm font-medium">{product.sales} ventes</div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Ventes récentes */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Ventes Récentes</span>
              <Button variant="ghost" size="sm">
                Voir tout
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      sale.statut === 'encaissé' ? 'bg-success' : 'bg-warning'
                    }`} />
                    <div>
                      <div className="font-medium text-sm">{sale.customer}</div>
                      <div className="text-xs text-muted-foreground">{sale.items}</div>
                      <div className="text-xs text-muted-foreground">{sale.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-success">
                      +{sale.montant.toFixed(2)} €
                    </div>
                    <Badge variant={sale.statut === 'encaissé' ? 'default' : 'secondary'} className="text-xs">
                      {sale.statut}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};