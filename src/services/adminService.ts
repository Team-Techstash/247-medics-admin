import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://3.14.150.170:5000/api';

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