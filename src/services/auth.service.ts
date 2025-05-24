import axios from 'axios';
import { API_URL } from '../config/api.config';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    // Add other user fields as needed
  };
}

class AuthService {
  async loginWithEmail(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await axios.post(`${API_URL}/users/email-login`, credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const authService = new AuthService(); 