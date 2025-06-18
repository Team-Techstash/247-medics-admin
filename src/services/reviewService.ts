import axios from 'axios';
import Cookies from 'js-cookie';
import { API_URL } from '../config/api.config';

export interface Review {
  _id: string;
  doctorId: string;
  patientId: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

class ReviewService {
  private getAuthHeader() {
    const token = Cookies.get('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  async getReviewsByDoctorId(doctorId: string): Promise<Review[]> {
    try {
      const response = await axios.get(`${API_URL}/reviews/doctor/${doctorId}`, {
        headers: this.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  }
}

export const reviewService = new ReviewService(); 