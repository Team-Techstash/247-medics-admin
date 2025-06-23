import axios from 'axios';
import Cookies from 'js-cookie';
import { API_URL } from '../config/api.config';

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

export interface AppointmentStatus {
  id: number;
  code: string;
  name: string;
}

export interface VisitType {
  id: number;
  code: string;
  name: string;
}

export interface ServiceType {
  id: number;
  code: string;
  name: string;
}

export interface AppointmentMode {
  id: number;
  code: string;
  name: string;
}

export interface PaymentStatus {
  id: number;
  code: string;
  name: string;
}

export interface ReferencesData {
  VISIT_TYPES: {
    [key: string]: VisitType;
  };
  APPOINTMENT_STATUSES: {
    [key: string]: AppointmentStatus;
  };
  SERVICE_TYPES: {
    [key: string]: ServiceType;
  };
  APPOINTMENT_MODES: {
    [key: string]: AppointmentMode;
  };
  PAYMENT_STATUSES: {
    [key: string]: PaymentStatus;
  };
}

export interface ReferencesResponse {
  data: ReferencesData;
}

export const referenceService = {
  // Get all references including appointment statuses
  getReferences: async (): Promise<ReferencesData> => {
    try {
      const response = await api.get<ReferencesResponse>('/users/references');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching references:', error);
      throw error;
    }
  },

  // Get only appointment statuses
  getAppointmentStatuses: async (): Promise<AppointmentStatus[]> => {
    try {
      const response = await api.get<ReferencesResponse>('/users/references');
      const statuses = response.data.data.APPOINTMENT_STATUSES;
      return Object.values(statuses || {});
    } catch (error) {
      console.error('Error fetching appointment statuses:', error);
      throw error;
    }
  },

  // Get visit types
  getVisitTypes: async (): Promise<VisitType[]> => {
    try {
      const response = await api.get<ReferencesResponse>('/users/references');
      const visitTypes = response.data.data.VISIT_TYPES;
      return Object.values(visitTypes || {});
    } catch (error) {
      console.error('Error fetching visit types:', error);
      throw error;
    }
  },

  // Get service types
  getServiceTypes: async (): Promise<ServiceType[]> => {
    try {
      const response = await api.get<ReferencesResponse>('/users/references');
      const serviceTypes = response.data.data.SERVICE_TYPES;
      return Object.values(serviceTypes || {});
    } catch (error) {
      console.error('Error fetching service types:', error);
      throw error;
    }
  },

  // Get appointment modes
  getAppointmentModes: async (): Promise<AppointmentMode[]> => {
    try {
      const response = await api.get<ReferencesResponse>('/users/references');
      const modes = response.data.data.APPOINTMENT_MODES;
      return Object.values(modes || {});
    } catch (error) {
      console.error('Error fetching appointment modes:', error);
      throw error;
    }
  },

  // Get payment statuses
  getPaymentStatuses: async (): Promise<PaymentStatus[]> => {
    try {
      const response = await api.get<ReferencesResponse>('/users/references');
      const paymentStatuses = response.data.data.PAYMENT_STATUSES;
      return Object.values(paymentStatuses || {});
    } catch (error) {
      console.error('Error fetching payment statuses:', error);
      throw error;
    }
  }
}; 