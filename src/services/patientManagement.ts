import { apiRequest } from '@/lib/api';
import { ApiResponse } from '@/types/api';

// Interfaces pour les données patients
export interface PatientData {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  gender?: string;
  blood_type?: string;
  height?: number;
  weight?: number;
  address?: string;
  status: string;
  created_at: string;
  documents?: Array<{
    id: number;
    title: string;
    type: string;
    file_path: string;
    uploaded_at: string;
  }>;
}

export interface PatientListResponse {
  patients: PatientData[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  total_actifs: number;
  total_inactifs: number;
  new_this_month: number;
}

export interface CreatePatientData {
  user_id: number;
  first_name: string;
  last_name: string;
  birth_date: string;
  gender: string;
  blood_type?: string;
  height?: number;
  weight?: number;
  address?: string;
}

export interface UpdatePatientData {
  first_name?: string;
  last_name?: string;
  birth_date?: string;
  gender?: string;
  blood_type?: string;
  height?: number;
  weight?: number;
  address?: string;
}

export const patientManagementService = {
  // Récupérer la liste des patients
  async getPatients(params?: {
    page?: number;
    search?: string;
    status?: string;
  }): Promise<ApiResponse<PatientListResponse>> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.status) searchParams.append('status', params.status);
    
    const queryString = searchParams.toString();
    const endpoint = `/users/admin/patient${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest<ApiResponse<PatientListResponse>>(endpoint);
  },

  // Récupérer un patient spécifique
  async getPatient(id: number): Promise<ApiResponse<{ patient: PatientData }>> {
    return apiRequest<ApiResponse<{ patient: PatientData }>>(`/users/admin/patient/${id}`);
  },

  // Créer un nouveau patient
  async createPatient(patientData: CreatePatientData): Promise<ApiResponse<PatientData>> {
    return apiRequest<ApiResponse<PatientData>>('/users/admin/patient', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patientData),
    });
  },

  // Mettre à jour un patient
  async updatePatient(id: number, patientData: UpdatePatientData): Promise<ApiResponse<PatientData>> {
    return apiRequest<ApiResponse<PatientData>>(`/users/admin/patient/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patientData),
    });
  },

  // Supprimer un patient (soft delete)
  async deletePatient(id: number): Promise<ApiResponse<void>> {
    return apiRequest<ApiResponse<void>>(`/users/admin/patient/${id}`, {
      method: 'DELETE',
    });
  },

  // Restaurer un patient supprimé
  async restorePatient(id: number): Promise<ApiResponse<void>> {
    return apiRequest<ApiResponse<void>>(`/users/admin/patient/restore/${id}`, {
      method: 'PUT',
    });
  },
};