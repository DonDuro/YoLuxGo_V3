import { apiRequest } from './queryClient';

export interface User {
  id: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user_id: string;
  userType: string;
  profile?: {
    id: string;
    firstName: string;
    lastName: string;
    membershipTier?: string;
  };
}

export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  try {
    const response = await apiRequest('POST', '/api/auth/login', credentials);
    const data = await response.json();
    
    console.log("Login response:", data);
    
    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }
    
    return data;
  } catch (error) {
    console.error("Login function error:", error);
    throw error;
  }
}

export async function register(userData: RegisterRequest): Promise<AuthResponse> {
  const response = await apiRequest('POST', '/api/auth/register', userData);
  const data = await response.json();
  
  // Store token in localStorage
  if (data.token) {
    localStorage.setItem('auth_token', data.token);
  }
  
  return data;
}

export async function logout(): Promise<void> {
  try {
    await apiRequest('POST', '/api/auth/logout');
  } catch (error) {
    // Continue with logout even if API call fails
    console.error('Logout API call failed:', error);
  } finally {
    // Always remove token from localStorage
    localStorage.removeItem('auth_token');
  }
}

export function getStoredToken(): string | null {
  return localStorage.getItem('auth_token');
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Date.now() / 1000;
    return payload.exp < now;
  } catch {
    return true;
  }
}

export function checkAuthStatus(): boolean {
  const token = getStoredToken();
  if (!token) return false;
  
  if (isTokenExpired(token)) {
    localStorage.removeItem('auth_token');
    return false;
  }
  
  return true;
}