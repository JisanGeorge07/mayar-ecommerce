export interface LoginRequest {
  email: string;
  password: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  roleId?: string;
  allowedPaths: string[];
  phoneNumber?: string;
  address?: string;
  country?: string;
  pinCode?: string;
}

export interface TokenResponse {
  userId: string;
  accessToken: string;
  refreshToken: string;
}
