import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://3.14.150.170:5000/api';

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