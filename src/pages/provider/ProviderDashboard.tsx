import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { 
  DollarSign, 
  CreditCard, 
  Users, 
  TrendingUp, 
  Calendar,
  MapPin,
  Plus,
  Eye,
  Heart,
  Activity,
  Stethoscope
} from "lucide-react";

export const ProviderDashboard = () => {
  const { user } = useAuth();

  // Données factices pour la démonstration
  const stats = {
    monthly_revenue: 12450.75,
    total_patients: 248,
    pending_payments: 1250.30,
    appointments_today: 8,
    card_status: "active",
    avg_consultation: 45.50
  };

  const recentPayments = [
    { id: 1, patient: "Marie D.", service: "Consultation générale", montant: 45.00, date: "2024-01-20", statut: "encaissé" },
    { id: 2, patient: "Pierre L.", service: "Examen cardiaque", montant: 85.00, date: "2024-01-20", statut: "encaissé" },
    { id: 3, patient: "Sophie M.", service: "Suivi diabète", montant: 55.00, date: "2024-01-19", statut: "en_attente" },
  ];

  const todayAppointments = [
    { time: "09:00", patient: "Jean Dupont", service: "Consultation" },
    { time: "10:30", patient: "Marie Martin", service: "Suivi" },
    { time: "14:00", patient: "Paul Durand", service: "Contrôle" },
    { time: "15:30", patient: "Lisa Bernard", service: "Consultation" },
  ];

  return (
    <div className="space-y-6">
      {/* En-tête prestataire */}
      <div className="bg-gradient-primary rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Cabinet médical</h1>
            <p className="text-white/80">
              Gérez vos consultations et encaissements
            </p>
          </div>
          <div className="hidden md:block">
            <Stethoscope className="w-12 h-12 text-white/60" />
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
              +15% vs mois précédent
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patients Actifs</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.total_patients}</div>
            <p className="text-xs text-muted-foreground">
              +8 nouveaux ce mois
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
            <CardTitle className="text-sm font-medium">RDV Aujourd'hui</CardTitle>
            <Calendar className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.appointments_today}</div>
            <p className="text-xs text-muted-foreground">
              Consultations prévues
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
                <div className="font-medium">Nouveau paiement</div>
                <div className="text-sm text-white/80">Encaisser une consultation</div>
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
              <Heart className="mr-3 h-5 w-5 text-primary" />
              <div className="text-left">
                <div className="font-medium">Mes services</div>
                <div className="text-sm text-muted-foreground">Gérer mon offre</div>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Rendez-vous du jour */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Planning du Jour</span>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                {todayAppointments.length} RDV
              </Badge>
            </CardTitle>
            <CardDescription>
              Vos consultations prévues aujourd'hui
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayAppointments.map((appointment, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {appointment.time}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{appointment.patient}</div>
                    <div className="text-xs text-muted-foreground">{appointment.service}</div>
                  </div>
                </div>
                <Button size="sm" variant="ghost">
                  Détails
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Encaissements récents */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Encaissements Récents</span>
            <Button variant="ghost" size="sm">
              Voir tout
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    payment.statut === 'encaissé' ? 'bg-success' : 'bg-warning'
                  }`} />
                  <div>
                    <div className="font-medium">{payment.patient} - {payment.service}</div>
                    <div className="text-sm text-muted-foreground">{payment.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-success">
                    +{payment.montant.toFixed(2)} €
                  </div>
                  <Badge variant={payment.statut === 'encaissé' ? 'default' : 'secondary'} className="text-xs">
                    {payment.statut}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};