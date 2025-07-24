import { apiRequest } from '@/lib/api';
import { ApiResponse, AuthResponse, User } from '@/types/api';

export const authService = {
  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    const response = await apiRequest<ApiResponse<AuthResponse>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.status && response.data) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user_data', JSON.stringify(response.data.user));
    }

    return response;
  },

  async register(userData: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: string;
  }): Promise<ApiResponse<AuthResponse>> {
    return apiRequest<ApiResponse<AuthResponse>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async me(): Promise<ApiResponse<User>> {
    return apiRequest<ApiResponse<User>>('/users/me');
  },

  async meRole(): Promise<ApiResponse<{ user: User; role: string; linked_id: number }>> {
    return apiRequest<ApiResponse<{ user: User; role: string; linked_id: number }>>('/users/me/role');
  },

  async logout(): Promise<ApiResponse<any>> {
    const response = await apiRequest<ApiResponse<any>>('/users/logout', {
      method: 'POST',
    });

    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('user_role');

    return response;
  },

  async updateProfile(data: { name: string; phone: string }): Promise<ApiResponse<User>> {
    return apiRequest<ApiResponse<User>>('/users/me/update', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async updateInfo(data: { email: string }): Promise<ApiResponse<User>> {
    return apiRequest<ApiResponse<User>>('/users/me/update-info', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async updatePassword(data: { ancien: string; nouveau: string }): Promise<ApiResponse<any>> {
    return apiRequest<ApiResponse<any>>('/users/me/update-secret', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async updatePhoto(file: File): Promise<ApiResponse<{ photo_url: string }>> {
    const formData = new FormData();
    formData.append('photo', file);

    return apiRequest<ApiResponse<{ photo_url: string }>>('/users/me/update-photo', {
      method: 'PUT',
      body: formData,
    });
  },

  getCurrentUser(): User | null {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  },

  getCurrentToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  isAuthenticated(): boolean {
    return !!this.getCurrentToken();
  },
};