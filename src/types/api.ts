export interface ApiResponse<T = any> {
  status: boolean;
  message: string;
  data: T;
}

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  patient?: Patient;
  provider?: Provider;
  pharmacy?: Pharmacy;
  roles?: Array<{
    id: number;
    name: string;
  }>;
}

export interface Patient {
  id: number;
  user_id: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  profession?: string;
  address?: string;
  marital_status?: string;
  social_security_number?: string;
  blood_group?: string;
  weight?: number;
  height?: number;
  allergies?: string;
  chronic_diseases?: string;
  current_medications?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relation?: string;
  latitude?: number;
  longitude?: number;
  photo?: string;
  status?: string;
  wallet?: Wallet;
}

export interface Provider {
  id: number;
  user_id: number;
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
  profile_image?: string;
  code_qr?: string;
  latitude?: number;
  longitude?: number;
  status?: string;
  photo?: string;
}

export interface Pharmacy {
  id: number;
  user_id: number;
  name?: string;
  director?: string;
  email?: string;
  phone?: string;
  address?: string;
  description?: string;
  approval_number?: string;
  creation_date?: string;
  latitude?: number;
  longitude?: number;
  status?: string;
  photo?: string;
}

export interface Wallet {
  id: number;
  patient_id: number;
  solde_total: number;
  solde_disponible: number;
  solde_reserve: number;
  virtual_card?: VirtualCard;
  transactions?: Transaction[];
  vaults?: Vault[];
}

export interface VirtualCard {
  id: number;
  wallet_id: number;
  numero: string;
  cvv: string;
  statut: string;
  type: string;
  description?: string;
  limite_mensuelle: number;
  limite_journaliere: number;
  limite_by_transaction: number;
  montant_utilise: number;
  date_creation: string;
  date_expiration: string;
}

export interface Transaction {
  id: number;
  wallet_id: number;
  type: string;
  source: string;
  description: string;
  montant: number;
  statut: string;
  effectue_le: string;
  vault_id?: number;
  reference: string;
}

export interface Vault {
  id: number;
  wallet_id: number;
  nom: string;
  categorie: string;
  objectif: number;
  description?: string;
  montant_actuel: number;
}

export interface Document {
  id: number;
  title: string;
  type: string;
  file_path: string;
  status: string;
  uploaded_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface DashboardStats {
  total_balance?: number;
  total_transactions?: number;
  total_patients?: number;
  total_providers?: number;
  recent_transactions?: Transaction[];
  monthly_revenue?: number;
  pending_documents?: number;
}