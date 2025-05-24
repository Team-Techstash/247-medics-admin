import axios from 'axios';
import { API_URL } from '../config/api.config';

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
}; 