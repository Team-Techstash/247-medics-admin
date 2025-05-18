import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://3.14.150.170:5000/api';

export interface Doctor {
  data: {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    streetAddress1: string;
    city: string;
    country: string;
  };
  role: string;
  status: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
  docProfile?: {
    bio: string;
    emergencyContact: {
      fullName: string;
      relation: string;
      phone: string;
      email: string;
    };
    regulatoryDetails: {
      authorityName: string;
      registrationNumber: string;
      onSpecialistRegister: boolean;
      allowStatusVerification: boolean;
    };
  }; 
}
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface GetDoctorsParams {
  page?: number;
  limit?: number;
  role?: string;
}

class DoctorService {
  private getAuthHeader() {
    const token = Cookies.get('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return {
      Authorization: `Bearer ${token}`
    };
  }

  async getDoctors(params: GetDoctorsParams = {}): Promise<PaginatedResponse<Doctor>> {
    try {
      const response = await axios.get(`${API_URL}/admin/users`, {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          role: params.role || 'doctor'
        },
        headers: this.getAuthHeader()
      });

      return {
        data: response.data.data,
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit
      };
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw error;
    }
  }

  async getDoctorById(id: string): Promise<Doctor> {
    try {
      const response = await axios.get(`${API_URL}/admin/users/${id}`, {
        headers: this.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching doctor with id ${id}:`, error);
      throw error;
    }
  }
}

export const doctorService = new DoctorService(); 