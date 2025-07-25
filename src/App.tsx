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
import { PatientManagement } from "@/pages/admin/PatientManagement";
import { ProviderManagement } from "@/pages/admin/ProviderManagement";
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
  
  console.log('DashboardRouter - userRole:', userRole, 'isLoading:', isLoading);
  
  if (isLoading) {
    return <div>Chargement...</div>;
  }
  
  // Forcer la redirection immédiate selon le rôle
  if (userRole === 'patient') {
    window.location.replace('/patient');
    return null;
  }
  if (userRole === 'provider') {
    window.location.replace('/provider');
    return null;
  }
  if (userRole === 'pharmacy') {
    window.location.replace('/pharmacy');
    return null;
  }
  if (userRole === 'admin' || userRole === 'superadmin') {
    window.location.replace('/admin');
    return null;
  }
  
  // Si pas de rôle défini, rediriger vers login
  return <Navigate to="/auth/login" replace />;
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
    <Route path="patients" element={<PatientManagement />} />
    <Route path="providers" element={<ProviderManagement />} />
    <Route path="roles" element={<div>Rôles & Permissions - En développement</div>} />
    <Route path="stats" element={<div>Statistiques - En développement</div>} />
  </Routes>
);

export default App;
