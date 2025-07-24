import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";

// Pages d'authentification
import { LoginForm } from "@/components/auth/LoginForm";

// Pages dashboard
import { PatientDashboard } from "@/pages/patient/PatientDashboard";
import { ProviderDashboard } from "@/pages/provider/ProviderDashboard";
import { PharmacyDashboard } from "@/pages/pharmacy/PharmacyDashboard";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { UserManagement } from "@/pages/admin/UserManagement";
import { Profile } from "@/pages/Profile";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Routes publiques */}
            <Route path="/auth/login" element={<LoginForm />} />
            
            {/* Redirection de la racine vers le bon dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Routes protégées avec layout */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <AppLayout>
                  <DashboardRouter />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            {/* Routes spécifiques par rôle */}
            <Route path="/patient/*" element={
              <ProtectedRoute allowedRoles={['patient', 'admin', 'superadmin']}>
                <AppLayout>
                  <PatientRoutes />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/provider/*" element={
              <ProtectedRoute allowedRoles={['provider', 'admin', 'superadmin']}>
                <AppLayout>
                  <ProviderRoutes />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/pharmacy/*" element={
              <ProtectedRoute allowedRoles={['pharmacy', 'admin', 'superadmin']}>
                <AppLayout>
                  <PharmacyRoutes />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/admin/*" element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <AppLayout>
                  <AdminRoutes />
                </AppLayout>
              </ProtectedRoute>
            } />

            {/* Route profil commune */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <AppLayout>
                  <Profile />
                </AppLayout>
              </ProtectedRoute>
            } />

            {/* Route 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

// Composant pour router vers le bon dashboard selon le rôle
const DashboardRouter = () => {
  const { userRole, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Chargement...</div>;
  }
  
  if (userRole === 'patient') return <Navigate to="/patient" replace />;
  if (userRole === 'provider') return <Navigate to="/provider" replace />;
  if (userRole === 'pharmacy') return <Navigate to="/pharmacy" replace />;
  if (userRole === 'admin' || userRole === 'superadmin') return <Navigate to="/admin" replace />;
  
  return <div>Chargement...</div>;
};

// Routes Patient
const PatientRoutes = () => (
  <Routes>
    <Route index element={<PatientDashboard />} />
    <Route path="wallet" element={<div>Portefeuille - En développement</div>} />
    <Route path="card" element={<div>Carte - En développement</div>} />
    <Route path="vault" element={<div>Coffre-fort - En développement</div>} />
    <Route path="documents" element={<div>Documents - En développement</div>} />
    <Route path="providers" element={<div>Prestataires - En développement</div>} />
    <Route path="history" element={<div>Historique - En développement</div>} />
  </Routes>
);

// Routes Provider
const ProviderRoutes = () => (
  <Routes>
    <Route index element={<ProviderDashboard />} />
    <Route path="payments" element={<div>Encaissements - En développement</div>} />
    <Route path="card" element={<div>Carte - En développement</div>} />
    <Route path="patients" element={<div>Patients - En développement</div>} />
    <Route path="services" element={<div>Services - En développement</div>} />
    <Route path="documents" element={<div>Documents - En développement</div>} />
    <Route path="location" element={<div>Localisation - En développement</div>} />
  </Routes>
);

// Routes Pharmacy
const PharmacyRoutes = () => (
  <Routes>
    <Route index element={<PharmacyDashboard />} />
    <Route path="payments" element={<div>Encaissements - En développement</div>} />
    <Route path="card" element={<div>Carte - En développement</div>} />
    <Route path="patients" element={<div>Patients - En développement</div>} />
    <Route path="types" element={<div>Types de Services - En développement</div>} />
    <Route path="documents" element={<div>Documents - En développement</div>} />
    <Route path="location" element={<div>Localisation - En développement</div>} />
  </Routes>
);

// Routes Admin
const AdminRoutes = () => (
  <Routes>
    <Route index element={<AdminDashboard />} />
    <Route path="users" element={<UserManagement />} />
    <Route path="roles" element={<div>Rôles & Permissions - En développement</div>} />
    <Route path="stats" element={<div>Statistiques - En développement</div>} />
  </Routes>
);

export default App;
