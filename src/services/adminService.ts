import axios from 'axios';
import { API_URL } from '../config/api.config';
import Cookies from 'js-cookie';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface CreateAdminData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AdminResponse {
  success: boolean;
  data: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    createdAt: string;
  };
}

export interface DashboardStats {
  totalAppointments: number;
  netRevenue: number;
  profit: number;
  doctorOnBoarded: number;
  patientOnBoarded: number;
  appointmentTrends: Array<{
    _id: string;
    count: number;
  }>;
}

export const adminService = {
  createAdmin: async (data: CreateAdminData) => {
    try {
      const response = await api.post<AdminResponse>('/admin', data);
      return response.data;
    } catch (error) {
      console.error('Error in createAdmin:', error);
      throw error;
    }
  },
  getDashboardStats: async (startDate: string, endDate: string, timeFilter: string): Promise<DashboardStats> => {
    try {
      const token = Cookies.get('token');
      const response = await api.get<DashboardStats>(
        `/admin/dashboard-stats`,
        {
          params: { startDate, endDate, timeFilter },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error in getDashboardStats:', error);
      throw error;
    }
  },
}; 