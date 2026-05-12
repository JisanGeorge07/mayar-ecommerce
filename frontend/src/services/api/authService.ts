import api from '@/lib/axios';
import type {
  LoginRequest,
  SignupRequest,
  UserProfile,
  TokenResponse,
  UpdateProfileRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '@/types/auth';

const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_ID_KEY = 'userId';

export const authService = {

  async login(data: LoginRequest): Promise<{ success: boolean; user?: UserProfile; message: string }> {
    try {
      const res = await api.post<TokenResponse>('/auth/login', {
        email: data.email,
        password: data.password,
      });
      localStorage.setItem(TOKEN_KEY, res.data.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, res.data.refreshToken);
      localStorage.setItem(USER_ID_KEY, res.data.userId);

      const user = await this.getCurrentUser();
      return { success: true, user: user ?? undefined, message: 'Login successful' };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || 'Invalid email or password',
      };
    }
  },

  async signup(data: SignupRequest): Promise<{ success: boolean; user?: UserProfile; message: string }> {
    try {
      const res = await api.post<UserProfile>('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber || undefined,
        address: data.address || undefined,
        country: data.country || undefined,
        pinCode: data.pinCode || undefined,
      });
      return { success: true, user: res.data, message: 'Account created' };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed',
      };
    }
  },

  async getCurrentUser(): Promise<UserProfile | null> {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    try {
      const res = await api.get<{ success: boolean; user: UserProfile }>('/auth/checkAuth');
      return res.data.user;
    } catch {
      return null;
    }
  },

  async updateProfile(data: UpdateProfileRequest): Promise<{ success: boolean; user?: UserProfile; message: string }> {
    try {
      const res = await api.put<{ success: boolean; data: UserProfile; message: string }>('/auth/update-profile', {
        name: data.name,
        phoneNumber: data.phoneNumber || undefined,
        address: data.address || undefined,
        country: data.country || undefined,
        pinCode: data.pinCode || undefined,
      });
      return { success: true, user: res.data.data, message: res.data.message };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to update profile',
      };
    }
  },

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (refreshToken) {
      try {
        await api.post('/auth/logout', { refreshToken });
      } catch {
        // clear tokens regardless
      }
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
  },

  async refreshToken(): Promise<TokenResponse | null> {
    const refreshTokenValue = localStorage.getItem(REFRESH_TOKEN_KEY);
    const userId = localStorage.getItem(USER_ID_KEY);
    if (!refreshTokenValue || !userId) return null;
    try {
      const res = await api.post<TokenResponse>('/auth/refresh-token', {
        userId,
        refreshToken: refreshTokenValue,
      });
      localStorage.setItem(TOKEN_KEY, res.data.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, res.data.refreshToken);
      return res.data;
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_ID_KEY);
      return null;
    }
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<{ success: boolean; message: string }> {
    try {
      const res = await api.post<{ message: string }>('/auth/forgot-password', {
        email: data.email,
        recaptchaToken: data.recaptchaToken,
      });
      return { success: true, message: res.data.message };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to send reset link',
      };
    }
  },

  async resetPassword(data: ResetPasswordRequest): Promise<{ success: boolean; message: string }> {
    try {
      const res = await api.post<{ message: string }>('/auth/reset-password', {
        token: data.token,
        newPassword: data.newPassword,
      });
      return { success: true, message: res.data.message };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to reset password',
      };
    }
  },
};
