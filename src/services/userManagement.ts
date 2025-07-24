
import { apiRequest } from '@/lib/api';
import { ApiResponse } from '@/types/api';

export interface UserData {
  id: number;
  name: string;
  email: string;
  phone?: string;
  photo?: string;
  role: string;
  status: 'Actif' | 'Inactif';
  created_at: string;
}

export interface UserListResponse {
  users: UserData[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  total_actifs: number;
  total_inactifs: number;
  new_this_month: number;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  photo?: File;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  role?: string;
  photo?: File;
}

export const userManagementService = {
  async getUsers(params?: {
    page?: number;
    search?: string;
    status?: string;
  }): Promise<ApiResponse<UserListResponse>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.status) searchParams.append('status', params.status);

    const url = `/users/users-management/users-management${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return apiRequest<ApiResponse<UserListResponse>>(url);
  },

  async getUser(id: number): Promise<ApiResponse<UserData>> {
    return apiRequest<ApiResponse<UserData>>(`/users/users-management/users-management/${id}`);
  },

  async createUser(userData: CreateUserData): Promise<ApiResponse<UserData>> {
    const formData = new FormData();
    formData.append('name', userData.name);
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    formData.append('phone', userData.phone);
    formData.append('role', userData.role);
    
    if (userData.photo) {
      formData.append('photo', userData.photo);
    }

    return apiRequest<ApiResponse<UserData>>('/users/users-management/users-management', {
      method: 'POST',
      body: formData,
    });
  },

  async updateUser(id: number, userData: UpdateUserData): Promise<ApiResponse<UserData>> {
    const formData = new FormData();
    formData.append('_method', 'PUT'); // Nécessaire pour Laravel avec FormData
    if (userData.name !== undefined) formData.append('name', userData.name);
    if (userData.email !== undefined) formData.append('email', userData.email);
    if (userData.password !== undefined) formData.append('password', userData.password);
    if (userData.phone !== undefined) formData.append('phone', userData.phone || '');
    if (userData.role !== undefined) formData.append('role', userData.role);
    if (userData.photo) formData.append('photo', userData.photo);

    return apiRequest<ApiResponse<UserData>>(`/users/users-management/users-management/${id}`, {
      method: 'POST', // Utiliser POST avec _method=PUT pour FormData
      body: formData,
    });
  },

  async deleteUser(id: number): Promise<ApiResponse<void>> {
    return apiRequest<ApiResponse<void>>(`/users/users-management/users-management/${id}`, {
      method: 'DELETE',
    });
  },

  async restoreUser(id: number): Promise<ApiResponse<void>> {
    return apiRequest<ApiResponse<void>>(`/users/users-management/users-management/restore/${id}`, {
      method: 'PUT',
    });
  },
};
