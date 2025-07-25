import { apiRequest } from '@/lib/api';
import { ApiResponse } from '@/types/api';

// Interfaces pour les providers
export interface ProviderData {
  id: number;
  name: string;
  type: string;
  email: string;
  phone: string;
  address?: string;
  specialties?: string[];
  latitude?: number;
  longitude?: number;
  status: string;
  created_at: string;
  user_id?: number;
  documents?: DocumentData[];
}

export interface DocumentData {
  id: number;
  name: string;
  type: string;
  path: string;
  added_on: string;
}

export interface ProviderListResponse {
  providers: ProviderData[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  total_actifs: number;
  total_inactifs: number;
  new_this_month: number;
}

export interface CreateProviderData {
  user_id: number;
  name: string;
  director?: string;
  type: string;
  email?: string;
  phone?: string;
  address?: string;
  description?: string;
  approval_number?: string;
  creation_date: string;
  specialties?: string[];
  status?: string;
  documents?: {
    type: string;
    name: string;
    path: string;
    status?: string;
    added_on?: string;
  }[];
}

export interface UpdateProviderData {
  name?: string;
  director?: string;
  type?: string;
  email?: string;
  phone?: string;
  address?: string;
  description?: string;
  approval_number?: string;
  creation_date?: string;
  specialties?: string[];
  status?: string;
  documents?: {
    type: string;
    name: string;
    path: string;
    status?: string;
    added_on?: string;
  }[];
}

export const providerManagementService = {
  // Lister les providers avec pagination et filtres
  async getProviders(params?: {
    page?: number;
    search?: string;
    status?: string;
  }): Promise<ApiResponse<ProviderListResponse>> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.status) searchParams.append('status', params.status);
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/users/admin/provider?${queryString}` : '/users/admin/provider';
    
    return apiRequest<ApiResponse<ProviderListResponse>>(endpoint);
  },

  // Récupérer un provider par ID
  async getProvider(id: number): Promise<ApiResponse<ProviderData>> {
    return apiRequest<ApiResponse<ProviderData>>(`/users/admin/provider/${id}`);
  },

  // Créer un nouveau provider
  async createProvider(providerData: CreateProviderData): Promise<ApiResponse<ProviderData>> {
    return apiRequest<ApiResponse<ProviderData>>('/users/admin/provider', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(providerData),
    });
  },

  // Mettre à jour un provider
  async updateProvider(id: number, providerData: UpdateProviderData): Promise<ApiResponse<ProviderData>> {
    return apiRequest<ApiResponse<ProviderData>>(`/users/admin/provider/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(providerData),
    });
  },

  // Supprimer un provider (soft delete)
  async deleteProvider(id: number): Promise<ApiResponse<void>> {
    return apiRequest<ApiResponse<void>>(`/users/admin/provider/${id}`, {
      method: 'DELETE',
    });
  },

  // Restaurer un provider supprimé
  async restoreProvider(id: number): Promise<ApiResponse<void>> {
    return apiRequest<ApiResponse<void>>(`/users/admin/provider/restore/${id}`, {
      method: 'PUT',
    });
  },
};