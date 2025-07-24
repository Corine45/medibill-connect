import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types/api';
import { authService } from '@/services/auth';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  userRole: string | null;
  linkedId: number | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [linkedId, setLinkedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const isAuthenticated = !!user && !!authService.getCurrentToken();
  
  console.log('AuthContext - user:', user, 'token:', !!authService.getCurrentToken(), 'isAuthenticated:', isAuthenticated);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = authService.getCurrentToken();
      if (token) {
        await refreshUserData();
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de l\'authentification:', error);
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUserData = async () => {
    try {
      const response = await authService.meRole();
      if (response.status && response.data) {
        setUser(response.data.user);
        setUserRole(response.data.role);
        setLinkedId(response.data.linked_id);
        localStorage.setItem('user_data', JSON.stringify(response.data.user));
        localStorage.setItem('user_role', response.data.role);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.login(email, password);
      
      if (response.status && response.data) {
        setUser(response.data.user);
        await refreshUserData();
        
        toast({
          title: "Connexion réussie",
          description: `Bienvenue ${response.data.user.name}`,
        });
        
        return true;
      }
      
      return false;
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message || "Identifiants invalides",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setUser(null);
      setUserRole(null);
      setLinkedId(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('user_role');
      window.location.href = '/auth/login';
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    userRole,
    linkedId,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};