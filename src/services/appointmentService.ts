import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://3.14.150.170:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface AppointmentResponse {
  success: boolean;
  data: {
    _id: string;
    appointmentMode: string;
    attended: boolean;
    createdAt: string;
    createdBy: string;
    durationMinutes: number;
    isForSelf: boolean;
    patientId: {
      _id: string;
      email: string;
      phone: string;
      name: string;
      emailVerified: boolean;
      phoneVerified: boolean;
      role: string;
      status: string;
    };
    reason: string;
    recommendedDoctors: any[];
    respondedDoctors: any[];
    scheduledRange: {
      start: string;
      end: string;
    };
    serviceType: string;
    status: string;
    visitType: string;
  };
}

export interface Appointment {
  _id: string;
  appointmentMode: string;
  attended: boolean;
  createdAt: string;
  createdBy: string;
  durationMinutes: number;
  isForSelf: boolean;
  patientId: {
    _id: string;
    email: string;
    phone: string;
    name: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    role: string;
    status: string;
  };
  reason: string;
  recommendedDoctors: any[];
  respondedDoctors: any[];
  scheduledRange: {
    start: string;
    end: string;
  };
  serviceType: string;
  status: string;
  visitType: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export const appointmentService = {
  // Admin: Get all appointments with optional filters
  getAdminAppointments: async (params: {
    page?: number;
    limit?: number;
    status?: string;
    patientId?: string;
    doctorId?: string;
    visitType?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
    recommendedDoctorId?: string;
    respondedDoctorId?: string;
  }) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    
    const response = await api.get<PaginatedResponse<Appointment>>(`/admin/appointments?${queryParams.toString()}`);
    return response.data;
  },

  // Admin: Get appointment by ID
  getAdminAppointmentById: async (id: string) => {
    try {
      const response = await api.get<AppointmentResponse>(`/admin/appointments/${id}`);
      console.log('API Response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error in getAdminAppointmentById:', error);
      throw error;
    }
  },
}; 