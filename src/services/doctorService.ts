import axios from 'axios';
import Cookies from 'js-cookie';
import { API_URL } from '../config/api.config';


export interface Doctor {
  _id: string;
  readableId?: string;
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
    isProfileVerified?: boolean;
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
export interface Doctor {
  data: {
    _id: string;
    readableId?: string;
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
    averageRating?: number;
    docProfile?: {
      bio: string;
      isProfileVerified?: boolean;
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

  async updateAllowStatusVerification(id: string, allowStatusVerification: boolean, currentDoctorData: Doctor): Promise<Doctor> {
    try {
      const response = await axios.put(`${API_URL}/users/${id}`, {
        docProfile: {
          ...currentDoctorData.data.docProfile,
          regulatoryDetails: {
            ...currentDoctorData.data.docProfile?.regulatoryDetails,
            allowStatusVerification
          }
        },
        country: currentDoctorData.data.address?.country,
        city: currentDoctorData.data.address?.city,
        fcmToken: "fcmToken.From.Device" // This is required by the API
      }, {
        headers: this.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating status verification for doctor ${id}:`, error);
      throw error;
    }
  }

  async updateProfileVerification(id: string, isProfileVerified: boolean, currentDoctorData: Doctor): Promise<Doctor> {
    try {
      const response = await axios.put(`${API_URL}/users/${id}`, {
        docProfile: {
          ...currentDoctorData.data.docProfile,
          isProfileVerified
        },
        country: currentDoctorData.data.address?.country,
        city: currentDoctorData.data.address?.city,
        fcmToken: "fcmToken.From.Device" // This is required by the API
      }, {
        headers: this.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating profile verification for doctor ${id}:`, error);
      throw error;
    }
  }
}

export const doctorService = new DoctorService(); 