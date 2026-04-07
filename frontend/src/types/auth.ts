export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  address?: string;
  country?: string;
  pinCode?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  role?: string;
  address?: string;
  country?: string;
  pinCode?: string;
}

export interface UpdateProfileRequest {
  name: string;
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

export interface RefreshTokenRequest {
  userId: string;
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}
