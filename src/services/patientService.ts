import axios from 'axios';
import Cookies from 'js-cookie';
import { API_URL } from '../config/api.config';

export interface Patient {
  data:{
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    streetAddress1?: string;
    streetAddress2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  } | string;
  role: string;
  createdAt: string;
  updatedAt: string;
  }
}

export interface Patient {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    streetAddress1?: string;
    streetAddress2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  } | string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const patientService = {
  getAllPatients: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Patient>> => {
    try {
      const response = await axios.get(`${API_URL}/admin/users`, {
        params: {
          page,
          limit,
          role: 'patient'
        },
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
  },

  getPatientById: async (id: string): Promise<Patient> => {
    try {
      const response = await axios.get(`${API_URL}/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching patient details:', error);
      throw error;
    }
  }
}; 